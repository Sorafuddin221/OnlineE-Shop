import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can access this resource" },
        { status: 403 }
      );
    }

    const products = await Product.find().populate("category", "name");

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Admin Products Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
