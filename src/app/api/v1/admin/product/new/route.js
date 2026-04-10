import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request) {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, offeredPrice, stock, category, images } = body;

    if (!name || !description || !price || !stock || !category || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields and at least one image" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      offeredPrice,
      stock,
      category,
      image: imagesLinks, // Note: Your model uses 'image' (singular) for the array
      user: user._id,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
