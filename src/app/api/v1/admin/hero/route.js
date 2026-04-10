import dbConnect from "@/lib/dbConnect";
import HeroSlide from "@/models/HeroSlide";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const slides = await HeroSlide.find().sort({ order: 1 });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const slide = await HeroSlide.create(body);

    return NextResponse.json({ success: true, slide });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
