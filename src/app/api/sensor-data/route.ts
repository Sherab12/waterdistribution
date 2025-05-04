import { NextResponse } from "next/server";
import { connect } from "src/lib/db";
import SensorData from "@/models/SensorData";
import Sensor from "@/models/Sensor";
import Field from "@/models/Field";

export async function GET() {
  await connect();

  try {
    const data = await SensorData.find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .populate({
        path: "sensorId",
        model: Sensor,
        populate: {
          path: "fieldId",
          model: Field
        }
      })
      .lean();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch sensor data:", err);
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 });
  }
}
