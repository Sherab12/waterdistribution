import { connect } from "src/lib/db";
import Command from "@/models/Command";
import Field from "@/models/Field";
import { NextRequest, NextResponse } from "next/server";
import mqtt from "mqtt";
import mongoose from "mongoose";

// Setup MQTT connection globally
const mqttClient = mqtt.connect("mqtt://10.2.5.142:1883");

mqttClient.on("connect", () => {
    console.log("Connected to MQTT Broker");
});

mqttClient.on("error", (err) => {
    console.error("MQTT Connection Error:", err);
});

// Handle POST request to create and publish a command
export async function POST(req: NextRequest) {
    await connect();

    try {
        const body = await req.json();
        const { fieldId, command }: { fieldId: string; command: "open" | "close" | "closeall" | "openall" } = body;

        if (!fieldId || !command) {
        return NextResponse.json({ message: "fieldId and command are required" }, { status: 400 });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(fieldId)) {
        return NextResponse.json({ message: "Invalid fieldId" }, { status: 400 });
        }

        // Find the field
        const field = await Field.findById(fieldId);
        if (!field) {
        return NextResponse.json({ message: "Field not found" }, { status: 404 });
        }

        const mqttPayload = {
        type: "command",
        loraId: field.loraId,
        command: command, // "open" or "close"
        };

        // Publish MQTT command
        mqttClient.publish("source1/field/lora/command", JSON.stringify(mqttPayload));

        // Save command to MongoDB
        const newCommand = await Command.create({
        fieldId: field._id,
        command,
        status: "executed",
        });

        return NextResponse.json(newCommand, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
    }

    // Handle GET request to fetch all commands
    export async function GET() {
    await connect();

    try {
        const commands = await Command.find()
        .populate("fieldId")
        .sort({ createdAt: -1 });

        return NextResponse.json(commands, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
