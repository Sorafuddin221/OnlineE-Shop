import mongoose from "mongoose";
import validator from "validator";

const inquirySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: [true, "Please Enter Your Message/Query"],
  },
  status: {
    type: String,
    enum: ["Pending", "Responded", "Closed"],
    default: "Pending",
  },
  response: {
    type: String,
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
