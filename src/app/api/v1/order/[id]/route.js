import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to access this resource" },
        { status: 401 }
      );
    }

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Security: Check if order belongs to the user or user is admin
    if (order.user._id.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You are not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
