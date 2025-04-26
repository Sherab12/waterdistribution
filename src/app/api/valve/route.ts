import { NextResponse } from 'next/server';
import Valve from '@/models/Valve';
import { connect } from 'src/lib/db';

// GET all valves or one by ID
export async function GET(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    try {
        if (id) {
        const valve = await Valve.findById(id).populate("fieldId");
        return NextResponse.json(valve);
        } else {
        const valves = await Valve.find().populate("fieldId");
        return NextResponse.json(valves);
        }
    } catch (error) {
        console.error("GET /api/valves error:", error);
        return NextResponse.json({ error: "Failed to fetch valve(s)" }, { status: 500 });
    }
}

    // Create a new valve
export async function POST(request: Request) {
    try {
        await connect();
        const body = await request.json();
        const { fieldId, topic } = body;

        if (!fieldId || !topic) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const valve = await Valve.create({ fieldId, topic });
        return NextResponse.json(valve);
    } catch (error) {
        console.error("POST /api/valves error:", error);
        return NextResponse.json({ error: "Failed to create valve" }, { status: 500 });
    }
}

    // Update a valve
export async function PUT(request: Request) {
    await connect();
    const body = await request.json();
    const { _id, fieldId, topic } = body;

    if (!_id) {
        return NextResponse.json({ error: "Missing valve ID" }, { status: 400 });
    }

    try {
        await Valve.updateOne({ _id }, { fieldId, topic });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/valves error:", error);
        return NextResponse.json({ error: "Failed to update valve" }, { status: 500 });
    }
}

// Delete a valve
// Delete a valve
export async function DELETE(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        console.error("DELETE: No ID provided");
        return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    try {
        // Check if the valve exists first
        const valve = await Valve.findById(id);
        if (!valve) {
            console.error(`DELETE: Valve with ID ${id} not found`);
            return NextResponse.json({ error: "Valve not found" }, { status: 404 });
        }

        console.log(`Attempting to delete valve with ID: ${id}`);
        const result = await Valve.deleteOne({ _id: id });

        // If no documents were deleted
        if (result.deletedCount === 0) {
            console.error("DELETE: Valve not found or already deleted");
            return NextResponse.json({ error: "Valve not found or already deleted" }, { status: 404 });
        }

        console.log(`Valve with ID ${id} deleted successfully`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/valves error:", error);
        return NextResponse.json({ error: "Failed to delete valve" }, { status: 500 });
    }
}
