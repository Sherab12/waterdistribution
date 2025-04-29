import { connect } from "src/lib/db";
import Command from "@/models/Command";
import Field from "@/models/Field";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import client from "src/lib/mqtt";

// Utility function to ensure MQTT is connected before publishing
async function publishWhenConnected(topic: string, message: string) {
    if (!client.connected) {
        await new Promise<void>((resolve) => client.once("connect", () => resolve()));
    }

    client.publish(topic, message, {}, (err) => {
        if (err) {
            console.error("MQTT publish failed:", err);
        } else {
            console.log("MQTT command published:", message);
        }
    });
}

// Handle POST request to create and publish a command
export async function POST(req: NextRequest) {
    await connect();

    try {
        const body = await req.json();
        const { fieldId, command }: { fieldId: string; command: "open" | "close" | "closeall" | "openall" } = body;

        if (!fieldId || !command) {
            return NextResponse.json({ message: "fieldId and command are required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(fieldId)) {
            return NextResponse.json({ message: "Invalid fieldId" }, { status: 400 });
        }

        const field = await Field.findById(fieldId);
        if (!field) {
            return NextResponse.json({ message: "Field not found" }, { status: 404 });
        }

        const mqttPayload = {
            type: "command",
            loraId: field.loraId,
            command,
        };

        // Publish the command safely
        await publishWhenConnected("source1/field/lora/command", JSON.stringify(mqttPayload));

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
