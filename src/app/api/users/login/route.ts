import { connect } from "src/lib/db";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // Validate password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
        return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

        // Create token
        const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1hr" });

        // Set token cookie and respond
        const response = NextResponse.json({
        message: "Login Successful",
        success: true,
        });

        response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
