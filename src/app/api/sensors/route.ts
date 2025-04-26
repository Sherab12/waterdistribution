import { NextResponse } from 'next/server';
import Sensor from '@/models/Sensor';
import { connect } from 'src/lib/db';

// Handle GET requests
export async function GET(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        const sensor = await Sensor.findById(id).populate("fieldId");
        return NextResponse.json(sensor);
    } else {
        const sensors = await Sensor.find().populate("fieldId");
        return NextResponse.json(sensors);
    }
    }

    // Handle POST requests
    export async function POST(request: Request) {
    try {
        await connect();
        const body = await request.json();
        const { fieldId, type, topic } = body;

        if (!fieldId || !type || !topic) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sensor = await Sensor.create({ fieldId, type, topic });
        return NextResponse.json(sensor);
    } catch (error) {
        console.error("Error in POST /api/sensors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    }

    // Handle PUT requests
    export async function PUT(request: Request) {
    await connect();
    const body = await request.json();
    const { _id, fieldId, type, topic } = body;

    if (!_id) {
        return NextResponse.json({ error: "Missing sensor ID" }, { status: 400 });
    }

    await Sensor.updateOne({ _id }, { fieldId, type, topic });
    return NextResponse.json({ success: true });
    }

    // Handle DELETE requests
    export async function DELETE(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        await Sensor.deleteOne({ _id: id });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
}
