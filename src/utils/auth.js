import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getDataFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    if (!token) {
      return null;
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    return decodedData.id;
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return null;
  }
};

export const getAuthenticatedUser = async () => {
  try {
    await dbConnect();
    const userId = await getDataFromToken();
    if (!userId) return null;

    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Get Auth User Error:", error.message);
    throw error;
  }
};
