import { NextResponse } from "next/server";
import mqtt from "mqtt";
import { connect } from "src/lib/db";

// MongoDB models
import Field from "@/models/Field";
import Sensor from "@/models/Sensor";
import SensorData from "@/models/SensorData";

// Connect to MongoDB
await connect();

// Store the latest 100 messages in memory (optional)
let messages: any[] = [];

const client = mqtt.connect("mqtt://10.2.4.179:1883");

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

    messages.push({
      topic,
      ...payload,
      timestamp: timestamp.toISOString(),
    });

    if (messages.length > 100) messages.shift();

    // Match known sensor data
    const flowMatch = data.match(/Flow: ([\d.]+) L\/min/);
    const pressureMatch = data.match(/Pressure: ([-\d.]+) psi/);
    const totalMatch = data.match(/TotalDelivered: ([\d.]+) L/);
    const levelMatch = data.match(/WaterLevel: ([\d.]+) ?cm/);

    // Process water level independently
    if (levelMatch) {
      const level = parseFloat(levelMatch[1]);

      // Find the dedicated level sensor (assuming only one exists)
      const levelSensor = await Sensor.findOne({ type: "level" });

      if (levelSensor) {
        await SensorData.findOneAndUpdate(
          { sensorId: levelSensor._id },
          { value: level, timestamp },
          { new: true, upsert: true }
        );

        console.log(`📏 Water level recorded: ${level} cm`);
      } else {
        console.warn("⚠️ No level sensor found in DB.");
      }
    }

    // Skip remaining processing if it's only water level
    if (!flowMatch && !pressureMatch && !totalMatch) return;

    const pressure = pressureMatch ? parseFloat(pressureMatch[1]) : null;
    const totalDelivered = totalMatch ? parseFloat(totalMatch[1]) : null;

    const field = await Field.findOne({ loraId: new RegExp(`^${source}$`, "i") });

    if (!field) {
      console.warn(`⚠️ No field found for loraId: ${source}`);
      return;
    }

    const sensors = await Sensor.find({ fieldId: field._id });

    for (const sensor of sensors) {
      let value: number | null = null;

      if (sensor.type === "pressure") value = pressure;
      if (sensor.type === "flow") value = totalDelivered;

      if (value !== null) {
        await SensorData.findOneAndUpdate(
          { sensorId: sensor._id },
          { value, timestamp },
          { new: true, upsert: true }
        );

        console.log(`✅ Updated ${sensor.type} data for ${field.name}`);
      }
    }

    console.log(`✅ Processed message from ${source}`);
  } catch (error) {
    console.error("❌ Error handling MQTT message:", error);
  }
});

// Optional endpoint to return stored messages
export async function GET() {
  return NextResponse.json(messages);
}
