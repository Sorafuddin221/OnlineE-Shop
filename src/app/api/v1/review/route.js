import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getDataFromToken } from "@/utils/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Please login to submit a review" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    const { rating, comment, productId } = await req.json();

    const review = {
      user: userId,
      name: user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === userId.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
