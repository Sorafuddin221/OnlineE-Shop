import dbConnect from "@/lib/dbConnect";
import Settings from "@/models/Settings";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

// GET settings (Public or Admin)
export async function GET() {
  try {
    await dbConnect();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteTitle: "Online Shop",
        logoText: "ONLINE SHOP",
        navbarItems: [
          { label: "Home", url: "/", order: 0, isActive: true },
          { label: "Shop", url: "/products", order: 1, isActive: true },
          { label: "Trending", url: "/products?trending=true", order: 2, isActive: true },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// UPDATE settings (Admin only)
export async function PUT(request) {
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

    const data = await request.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(data);
    } else {
      // Update each field
      Object.keys(data).forEach((key) => {
        settings[key] = data[key];
      });
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Settings UPDATE Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
