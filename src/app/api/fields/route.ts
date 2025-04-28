// app/api/fields/route.ts
import { NextResponse } from 'next/server';
import Field from '@/models/Field';
import { connect } from 'src/lib/db';

// Handle GET requests
export async function GET(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        const field = await Field.findById(id).populate("sourceId");
        return NextResponse.json(field);
    } else {
        const fields = await Field.find().populate("sourceId");
        return NextResponse.json(fields);
    }
}

// Handle POST requests
export async function POST(request: Request) {
    try {
        await connect();
        const body = await request.json();
        const { name, size, sourceId, loraId } = body;   // <-- ADD loraId here

        if (!name || !size || !sourceId || !loraId) {   // <-- Validate loraId too
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const field = await Field.create({ name, size, sourceId, loraId });   // <-- Save loraId
        return NextResponse.json(field);
    } catch (error) {
        console.error("Error in POST /api/fields:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle PUT requests
export async function PUT(request: Request) {
    try {
        await connect();
        const body = await request.json();
        const { _id, name, size, sourceId, loraId } = body;   // <-- ADD loraId

        if (!_id || !name || !size || !sourceId || !loraId) {  // <-- Validate all
            return NextResponse.json({ error: "Missing required fields for update" }, { status: 400 });
        }

        await Field.updateOne({ _id }, { name, size, sourceId, loraId });   // <-- Update loraId too
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /api/fields:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle DELETE requests
export async function DELETE(request: Request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        await Field.deleteOne({ _id: id });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
}
