import { NextResponse } from "next/server";
import mqtt from "mqtt";

let messages: any[] = [];

const client = mqtt.connect("mqtt://10.2.5.142:1883");

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe("source1/field/lora", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to source1/field/lora");
    }
  });
});

client.on("message", (topic, messageBuffer) => {
  try {
    const payload = JSON.parse(messageBuffer.toString());

    messages.push({
      topic,
      ...payload,
      timestamp: new Date().toISOString(),
    });

    if (messages.length > 100) {
      messages.shift();
    }

    console.log(`Received on ${topic}:`, payload);
  } catch (error) {
    console.error("Failed to parse MQTT message:", error);
  }
});

export async function GET() {
  return NextResponse.json(messages);
}
