import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "@/utils/sendToken";

// Cloudinary Config (If credentials exist)
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

    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const avatar = formData.get("avatar");

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please enter all fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    let avatarData = {
      public_id: "sample_id",
      url: "profilepic_url",
    };

    if (avatar && process.env.CLOUDINARY_CLOUD_NAME) {
       // Only upload to Cloudinary if configured
       const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      avatarData = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else if (avatar) {
       // If avatar provided but no Cloudinary, we just use a placeholder for now
       // or user might have another way to store it. For now, let's keep it simple.
       avatarData = {
          public_id: "avatars/dummy_id",
          url: "https://res.cloudinary.com/dbed3cb4k/image/upload/v1/avatars/dummy_id",
       };
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarData,
    });

    return sendToken(user, 201);
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
