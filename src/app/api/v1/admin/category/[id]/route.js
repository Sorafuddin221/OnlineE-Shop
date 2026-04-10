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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    const { name, image, parent } = await request.json();

    let category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const newData = {
      name,
      parent: parent || null,
    };

    if (image && !image.startsWith("http")) {
      // New image uploaded (Base64)
      if (category.image.public_id && category.image.public_id !== "sample_id") {
        await cloudinary.uploader.destroy(category.image.public_id);
      }

      const myCloud = await cloudinary.uploader.upload(image, {
        folder: "categories",
      });

      newData.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    category = await Category.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
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

    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Delete image from cloudinary
    if (category.image.public_id && category.image.public_id !== "sample_id") {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
