import { NextResponse, type NextRequest } from "next/server";

/**
 * 18+ kapısı: /chat sayfasına girişte "kaosbot_age" cookie'si yoksa
 * kullanıcıyı ana sayfadaki uyarı ekranına yönlendirir.
 */
export function proxy(request: NextRequest) {
  const accepted = request.cookies.get("kaosbot_age")?.value === "accepted";
  if (!accepted) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*"],
};