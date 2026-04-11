import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Login to add to wishlist" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }
    
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const wishlist = dbUser.wishlist || [];
    
    const isWishlisted = wishlist.some(id => id && id.toString() === productId.toString());

    if (isWishlisted) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { wishlist: productId }
      });
      return NextResponse.json({ success: true, message: "Removed from wishlist", isWishlisted: false });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { wishlist: productId }
      });
      return NextResponse.json({ success: true, message: "Added to wishlist", isWishlisted: true });
    }
  } catch (error) {
    console.error("Wishlist POST Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Login to view wishlist" }, { status: 401 });
    }

    const dbUser = await User.findById(user._id).populate({
      path: "wishlist",
      model: "Product",
      populate: { path: "category", model: "Category" }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, wishlist: dbUser.wishlist || [] });
  } catch (error) {
    console.error("Wishlist GET Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
