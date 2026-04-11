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

    // 4. Order Status Counts
    const processingOrders = await Order.countDocuments({ orderStatus: "Processing" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });

    // 5. Latest Orders (last 5)
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // 5. Monthly Sales and Orders Data (for Charts)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format data for the frontend chart (fill in missing days if needed, but for now just pass what we have)
    const chartData = monthlyData.map(item => ({
      name: item._id.split('-').slice(1).reverse().join('/'), // Format as DD/MM
      sales: item.sales,
      orders: item.orders
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalAmount,
        productsCount,
        ordersCount,
        usersCount,
        outOfStockCount,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
      latestOrders,
      chartData
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
