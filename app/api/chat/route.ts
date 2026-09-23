import { NextResponse, type NextRequest } from "next/server";
import { classifyIntent } from "@/lib/classifier";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { pickTemplate } from "@/lib/templates";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1) 18+ onayı
  if (request.cookies.get("kaosbot_age")?.value !== "accepted") {
    return NextResponse.json(
      { error: "Önce 18+ onay sayfasını kabul etmelisin." },
      { status: 403 }
    );
  }

  // 2) Rate limit
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Çok hızlısın, sakin ol. Biraz nefes al." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  // 3) Body doğrulama
  let message: string;
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });
  }
  if (message.length > 500) {
    return NextResponse.json(
      { error: "500 karakterden kısa yaz, patlayacağım." },
      { status: 400 }
    );
  }

  // 4) Sınıflandır (kategori + konu) ve şablondan cevap seç
  const intent = await classifyIntent(message);
  const reply = pickTemplate(intent.category, intent.topic);

  return NextResponse.json({
    reply,
    category: intent.category,
    topic: intent.topic,
  });
}