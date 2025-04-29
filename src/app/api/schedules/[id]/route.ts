import { connect } from "src/lib/db";
import Schedule from "@/models/Schedule";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Handle PATCH request for updating a schedule
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    const scheduleId = params.id;

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return NextResponse.json({ message: "Invalid schedule ID" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const updated = await Schedule.findByIdAndUpdate(scheduleId, body, { new: true });

        if (!updated) {
            return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating schedule:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// Handle DELETE request for deleting a schedule
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    const scheduleId = params.id;

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return NextResponse.json({ message: "Invalid schedule ID" }, { status: 400 });
    }

    try {
        const deleted = await Schedule.findByIdAndDelete(scheduleId);
        if (!deleted) {
            return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// Add GET handler for fetching a specific schedule by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    const scheduleId = params.id;

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return NextResponse.json({ message: "Invalid schedule ID" }, { status: 400 });
    }

    try {
        const schedule = await Schedule.findById(scheduleId).populate("fieldId");

        if (!schedule) {
            return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
        }

        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
