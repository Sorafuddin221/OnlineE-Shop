import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";
import { sendToken } from "@/utils/sendToken";

export async function PUT(request) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to access this resource" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword, confirmPassword } = await request.json();

    const currentUser = await User.findById(user._id).select("+password");

    const isPasswordMatched = await currentUser.comparePassword(oldPassword);

    if (!isPasswordMatched) {
      return NextResponse.json(
        { success: false, message: "Old Password is incorrect" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Password does not match" },
        { status: 400 }
      );
    }

    currentUser.password = newPassword;

    await currentUser.save();

    return sendToken(currentUser, 200);
  } catch (error) {
    console.error("Update Password Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
