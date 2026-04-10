import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can access this resource" },
        { status: 403 }
      );
    }

    const users = await User.find();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
