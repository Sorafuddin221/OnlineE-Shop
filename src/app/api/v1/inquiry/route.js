import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import { getDataFromToken } from "@/utils/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { product, name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const userId = await getDataFromToken();

    const inquiry = await Inquiry.create({
      product: product || null,
      user: userId || null,
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Your query has been sent successfully!",
      inquiry,
    });
  } catch (error) {
    console.error("Inquiry Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    // If productId is provided, fetch public inquiries for that product
    if (productId) {
      const inquiries = await Inquiry.find({ product: productId })
        .sort("-createdAt");
      
      return NextResponse.json({
        success: true,
        inquiries,
      });
    }

    // Otherwise, fetch inquiries for the logged-in user (Profile page)
    const userId = await getDataFromToken();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Please login to view your inquiries" },
        { status: 401 }
      );
    }

    const inquiries = await Inquiry.find({ user: userId })
      .populate("product", "name image")
      .sort("-createdAt");

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
