import dbConnect from "@/lib/dbConnect";
import HeroSlide from "@/models/HeroSlide";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
