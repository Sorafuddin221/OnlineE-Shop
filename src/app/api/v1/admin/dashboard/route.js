import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Check Authentication and Admin Role
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    // 1. Total Revenue (sum of totalPrice from all orders)
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    // 2. Counts
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();

    // 3. Out of Stock Products
    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    // 4. Latest Orders (last 5)
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    return NextResponse.json({
      success: true,
      stats: {
        totalAmount,
        productsCount,
        ordersCount,
        usersCount,
        outOfStockCount,
      },
      latestOrders,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
