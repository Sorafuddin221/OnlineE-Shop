import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function GET() {
  try {
    await dbConnect();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to access this resource" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Please login to access this resource" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const avatar = formData.get("avatar");

    const newUserData = {
      name: name || currentUser.name,
      email: email || currentUser.email,
    };

    if (avatar && avatar !== "undefined" && avatar !== "null") {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        // Delete old avatar if it's not the default one
        if (currentUser.avatar.public_id && currentUser.avatar.public_id !== "sample_id" && currentUser.avatar.public_id !== "avatars/dummy_id") {
          await cloudinary.uploader.destroy(currentUser.avatar.public_id);
        }

        const myCloud = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });

        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        // Fallback placeholder if Cloudinary is not configured
        newUserData.avatar = {
          public_id: "avatars/dummy_id",
          url: "https://res.cloudinary.com/dbed3cb4k/image/upload/v1/avatars/dummy_id",
        };
      }
    }

    const user = await User.findByIdAndUpdate(currentUser._id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
