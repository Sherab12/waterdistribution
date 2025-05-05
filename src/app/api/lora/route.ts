import { NextResponse } from "next/server";
import mqtt from "mqtt";
import { connect } from "src/lib/db";

// MongoDB models
import Field from "@/models/Field";
import Sensor from "@/models/Sensor";
import SensorData from "@/models/SensorData";

// Connect to MongoDB
await connect();

// Store the latest 100 messages in memory (if still needed)
let messages: any[] = []; // If you don't need to store this in memory, you can remove this

// Connect to MQTT broker
const client = mqtt.connect("mqtt://10.2.5.142:1883");

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  client.subscribe("source1/field/lora", (err) => {
    if (err) {
      console.error("❌ Subscription error:", err);
    } else {
      console.log("📡 Subscribed to topic: source1/field/lora");
    }
  });
});

client.on("message", async (topic, messageBuffer) => {
  try {
    await connect();

    const payload = JSON.parse(messageBuffer.toString());
    const { source, data } = payload;
    const timestamp = new Date();

    // Save raw message in memory only (optional)
    messages.push({
      topic,
      ...payload,
      timestamp: timestamp.toISOString(),
    });

    // Optionally, limit to latest 100 messages
    if (messages.length > 100) {
      messages.shift();
    }

    // Extract sensor values
    const flowMatch = data.match(/Flow: ([\d.]+) L\/min/);
    const pressureMatch = data.match(/Pressure: ([-\d.]+) psi/);
    const totalMatch = data.match(/TotalDelivered: ([\d.]+) L/);

    if (!flowMatch || !pressureMatch || !totalMatch) {
      console.warn("⚠️ Could not extract values from:", data);
      return;
    }

    const pressure = parseFloat(pressureMatch[1]);
    const totalDelivered = parseFloat(totalMatch[1]);

    // Find the field using loraId (case-insensitive)
    const field = await Field.findOne({ loraId: new RegExp(`^${source}$`, "i") });

    if (!field) {
      console.warn(`⚠️ No field found for loraId: ${source}`);
      return;
    }

    // Get sensors for the field
    const sensors = await Sensor.find({ fieldId: field._id });

    console.log(`🔗 Matched field "${field.name}" with ${sensors.length} sensor(s)`);

    // Update or insert latest data for each sensor
    for (const sensor of sensors) {
      let value: number | null = null;

      if (sensor.type === "pressure") value = pressure;
      if (sensor.type === "flow") value = totalDelivered;

      if (value !== null) {
        // Update or insert only one document per sensorId
        await SensorData.findOneAndUpdate(
          { sensorId: sensor._id },
          { value, timestamp },  // new data for the sensor
          { new: true, upsert: true } // upsert ensures only one record per sensorId
        );

        console.log(`✅ Updated latest ${sensor.type} data for field ${field.name}`);
      }
    }

    console.log(`✅ Processed message from ${source}`);
  } catch (error) {
    console.error("❌ Error handling MQTT message:", error);
  }
});

// API handler to return stored messages (Optional, remove if not needed)
export async function GET() {
  return NextResponse.json(messages);
}
