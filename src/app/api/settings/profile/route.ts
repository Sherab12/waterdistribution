import { NextRequest, NextResponse } from "next/server";
import { connect } from "src/lib/db";
import User from "@/models/userModels";

// GET user profile (by email or id from query)
export async function GET(req: NextRequest) {
    await connect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email }).select("username email");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST to update profile
export async function POST(req: NextRequest) {
    await connect();
    try {
        const { email, username, password } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const updates: any = {};
        if (username) updates.username = username;
        if (password) updates.password = password; // TODO: hash password before prod

        const user = await User.findOneAndUpdate({ email }, updates, {
            new: true,
        }).select("username email");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
