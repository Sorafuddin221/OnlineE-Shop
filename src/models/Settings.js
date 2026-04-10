import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: "Online Shop",
    },
    logoText: {
      type: String,
      default: "ONLINE SHOP",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    faviconUrl: {
      type: String,
      default: "",
    },
    navbarItems: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        children: [
          {
            label: { type: String, required: true },
            url: { type: String, required: true },
            order: { type: Number, default: 0 },
          }
        ]
      },
    ],
    footerText: {
      type: String,
      default: "© 2026 Online Shop. All rights reserved.",
    },
    contactEmail: {
      type: String,
      default: "support@onlineshop.com",
    },
    contactPhone: {
      type: String,
      default: "+1 234 567 890",
    },
    address: {
      type: String,
      default: "123 Street Name, City, Country",
    },
    shippingInsideDhaka: {
      type: Number,
      default: 60,
    },
    shippingOutsideDhaka: {
      type: Number,
      default: 120,
    },
    taxRate: {
      type: Number,
      default: 5,
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
