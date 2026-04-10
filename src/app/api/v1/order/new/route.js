import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to place an order" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: user._id,
    });

    // Update stock
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("New Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  
  if (product) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
}
