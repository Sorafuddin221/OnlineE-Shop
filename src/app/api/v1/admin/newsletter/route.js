import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/models/Newsletter";
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

    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    return NextResponse.json({
      success: true,
      subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can access this resource" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await Newsletter.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
