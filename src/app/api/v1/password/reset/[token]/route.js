import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendToken } from "@/utils/sendToken";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { token } = await params;

    // Creating Token Hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Reset Password Token is invalid or has been expired" },
        { status: 400 }
      );
    }

    const { password, confirmPassword } = await request.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Password does not match" },
        { status: 400 }
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return sendToken(user, 200);
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
