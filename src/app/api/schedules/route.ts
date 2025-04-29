import { connect } from "src/lib/db";
import Schedule from "@/models/Schedule";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { fieldId, startTime, endTime, amountLiters } = body;

    if (!fieldId || !startTime || !endTime || !amountLiters) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const schedule = await Schedule.create({
      fieldId,
      startTime,
      endTime,
      amountLiters,
      status: "pending",
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const schedules = await Schedule.find().populate("fieldId").sort({ startTime: 1 });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
