import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
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

    const orders = await Order.find().populate("user", "name email");

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    return NextResponse.json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
