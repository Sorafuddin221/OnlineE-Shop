import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import { getAuthenticatedUser } from "@/utils/auth";
import sendEmail from "@/utils/sendEmail";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const inquiries = await Inquiry.find()
      .populate("product", "name image")
      .populate("user", "name email")
      .sort("-createdAt");

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("Admin Inquiry GET Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id, status, response } = await req.json();
    
    const updateData = {};
    if (status) updateData.status = status;
    if (response) {
      updateData.response = response;
      updateData.respondedAt = Date.now();
      updateData.status = "Responded";
    }

    const inquiry = await Inquiry.findByIdAndUpdate(id, updateData, { new: true }).populate("product", "name");

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Send Email to Customer if admin replied
    if (response) {
      try {
        const subject = inquiry.product 
          ? `Reply to your inquiry about: ${inquiry.product.name}`
          : "Reply to your message - Online Shop";

        const emailMessage = `
Dear ${inquiry.name},

Thank you for reaching out to us. Here is the response to your message:

Your Message:
"${inquiry.message}"

Our Response:
"${response}"

If you have any further questions, feel free to reply to this email.

Best regards,
Customer Support Team
Online Shop
        `;

        await sendEmail({
          email: inquiry.email,
          subject,
          message: emailMessage,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        // We still return success for the update even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry status updated and reply sent to customer via email",
      inquiry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const user = await getAuthenticatedUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
