import { NextResponse } from "next/server";

export const sendToken = (user, statusCode) => {
  const token = user.getJWTToken();

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  const response = NextResponse.json(
    {
      success: true,
      user,
      token,
    },
    { status: statusCode }
  );

  response.cookies.set("token", token, options);

  return response;
};
