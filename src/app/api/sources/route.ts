// app/api/sources/route.ts
import { NextResponse } from 'next/server';
import Source from '@/models/Source';
import { connect } from 'src/lib/db';

// Handle GET requests
export async function GET(request: Request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const source = await Source.findById(id);
    return NextResponse.json(source);
  } else {
    const sources = await Source.find();
    return NextResponse.json(sources);
  }
}

// Handle POST requests
export async function POST(request: Request) {
  await connect();
  const body = await request.json();
  const { name, location, description } = body;

  const source = await Source.create({ name, location, description });
  return NextResponse.json(source);
}

// Handle PUT requests
export async function PUT(request: Request) {
  await connect();
  const body = await request.json();
  const { _id, name, location, description } = body;

  await Source.updateOne({ _id }, { name, location, description });
  return NextResponse.json({ success: true });
}

// Handle DELETE requests
export async function DELETE(request: Request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    await Source.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "No ID provided" }, { status: 400 });
}
