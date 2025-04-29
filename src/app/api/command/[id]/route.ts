import { connect } from "src/lib/db";
import Command from "@/models/Command";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid command ID" }, { status: 400 });
    }

    try {
        const result = await Command.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json({ message: "Command not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Command deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
