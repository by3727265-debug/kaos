import { NextResponse } from "next/server";

/** 18+ onay cookie'sini set eder. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "kaosbot_age",
    value: "accepted",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 yıl
    path: "/",
  });
  return response;
}