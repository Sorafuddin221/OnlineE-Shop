import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can access this resource" },
        { status: 403 }
      );
    }

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found with this Id" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Details Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can access this resource" },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found with this Id" },
        { status: 404 }
      );
    }

    if (order.orderStatus === "Delivered") {
      return NextResponse.json(
        { success: false, message: "You have already delivered this order" },
        { status: 400 }
      );
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found with this Id" },
        { status: 404 }
      );
    }

    await order.deleteOne();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
