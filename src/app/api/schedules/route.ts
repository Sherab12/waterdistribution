import { connect } from "src/lib/db";
import Schedule from "@/models/Schedule";
import Field from "@/models/Field";
import { NextRequest, NextResponse } from "next/server";
import client from "src/lib/mqtt";
import { DateTime } from "luxon";

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

    const field = await Field.findById(fieldId);
    if (!field || !field.loraId) {
      return NextResponse.json({ message: "Field or loraId not found" }, { status: 404 });
    }

    const payload = {
      loraId: field.loraId,
      startTime: DateTime.fromJSDate(schedule.startTime).toUTC().setZone("Asia/Thimphu").toFormat("yyyy-MM-dd'T'HH:mm:ssZZ"),
      endTime: DateTime.fromJSDate(schedule.endTime).toUTC().setZone("Asia/Thimphu").toFormat("yyyy-MM-dd'T'HH:mm:ssZZ"),
      amountLiters: schedule.amountLiters,
    };

    const topic = "source1/field/lora/schedule";
    const message = JSON.stringify(payload);

    if (!client.connected) {
      client.on("connect", () => client.publish(topic, message));
    } else {
      client.publish(topic, message);
    }

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
