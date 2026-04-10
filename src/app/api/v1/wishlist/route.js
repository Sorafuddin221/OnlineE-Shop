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

    const { productId } = await request.json();
    
    const dbUser = await User.findById(user._id);
    const wishlist = dbUser.wishlist || [];
    
    const isWishlisted = wishlist.some(id => id.toString() === productId);

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
      populate: { path: "category" }
    });

    return NextResponse.json({ success: true, wishlist: dbUser.wishlist });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
