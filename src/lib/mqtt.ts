// src/lib/mqttClient.ts
import mqtt from "mqtt";

const client = mqtt.connect("mqtt://10.2.4.179:1883");

client.on("connect", () => {
    console.log("Connected to MQTT broker");
});

client.on("error", (err) => {
    console.error("MQTT error", err);
});

export default client;
