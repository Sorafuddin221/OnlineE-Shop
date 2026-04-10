import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter slide title"],
    trim: true,
  },
  subtitle: {
    type: String,
    required: [true, "Please enter slide subtitle"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter slide description"],
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: false,
    }
  },
  bgColor: {
    type: String,
    default: "bg-blue-900",
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.HeroSlide || mongoose.model("HeroSlide", heroSlideSchema);
