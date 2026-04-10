import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
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

    const { name, image, parent } = await request.json();

    if (!name || !image) {
      return NextResponse.json(
        { success: false, message: "Please provide name and image" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    let imageData = {
       public_id: "sample_id",
       url: "sample_url"
    };

    if (process.env.CLOUDINARY_CLOUD_NAME) {
        const myCloud = await cloudinary.uploader.upload(image, {
            folder: "categories",
        });
        imageData = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const category = await Category.create({
      name,
      image: imageData,
      parent: parent || null,
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
