// app/api/fields-with-valves/route.ts
import { NextResponse } from 'next/server';
import Field from '@/models/Field';
import Valve from '@/models/Valve';
import { connect } from 'src/lib/db';

export async function GET() {
  try {
    await connect();

    // Fetch all fields
    const fields = await Field.find().lean();

    // Fetch all valves
    const valves = await Valve.find().lean();

    // Match valves to their fields
    const fieldsWithValves = fields.map((field) => {
      const relatedValves = valves.filter(
        (valve) => valve.fieldId.toString() === field._id.toString()
      );
      return {
        ...field,
        valves: relatedValves,
      };
    });

    return NextResponse.json(fieldsWithValves);
  } catch (error) {
    console.error("Error in GET /api/fields-with-valves:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
