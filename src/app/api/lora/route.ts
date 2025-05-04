import { NextResponse } from "next/server";
import mqtt from "mqtt";
import { connect } from "src/lib/db";

// MongoDB models
import Field from "@/models/Field";
import Sensor from "@/models/Sensor";
import SensorData from "@/models/SensorData";

// Connect to MongoDB
connect();

// Store the latest 100 messages in memory
let messages: any[] = [];

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
    const payload = JSON.parse(messageBuffer.toString());
    const { source, data } = payload;
    const timestamp = new Date();

    // Save raw message
    messages.push({
      topic,
      ...payload,
      timestamp: timestamp.toISOString(),
    });

    if (messages.length > 100) {
      messages.shift();
    }

    // Parse values from the "data" string
    const flowMatch = data.match(/Flow: ([\d.]+) L\/min/);
    const pressureMatch = data.match(/Pressure: ([-\d.]+) psi/);
    const totalMatch = data.match(/TotalDelivered: ([\d.]+) L/);

    if (!flowMatch || !pressureMatch || !totalMatch) {
      console.warn("⚠️ Could not extract values from:", data);
      return;
    }

    const pressure = parseFloat(pressureMatch[1]);
    const totalDelivered = parseFloat(totalMatch[1]);

    // Find the field using source (e.g., "LORA1")
    const field = await Field.findOne({ loraId: new RegExp(`^${source}$`, "i") });
    if (!field) {
      console.warn(`⚠️ No field found for loraId: ${source}`);
      return;
    }

    // Find related sensors for this field and topic
    const sensors = await Sensor.find({ fieldId: field._id, topic });

    for (const sensor of sensors) {
      let value: number | null = null;

      if (sensor.type === "pressure") value = pressure;
      if (sensor.type === "flow") value = totalDelivered;

      if (value !== null) {
        // Upsert (update or insert) sensor data to avoid duplicates
        await SensorData.findOneAndUpdate(
          { sensorId: sensor._id, loraId: source },
          { value, timestamp },
          { upsert: true, new: true }
        );
        console.log(`🔁 Upserted ${sensor.type} data for ${source}`);
      }
    }

    console.log(`✅ Processed message from ${source}`);
  } catch (error) {
    console.error("❌ Error handling MQTT message:", error);
  }
});

// API handler to return stored messages
export async function GET() {
  return NextResponse.json(messages);
}
