import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/models/Newsletter";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "You are already subscribed!" },
        { status: 400 }
      );
    }

    await Newsletter.create({ email });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
    });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
