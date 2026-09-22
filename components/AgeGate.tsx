"use client";

import { useState } from "react";

const DISCLAIMER = `Bu site 18 yaşından büyükler içindir.

KaosBot tamamen eğlence amaçlı kurgusal bir chat botudur. Absürt, alaycı,
aşağılayıcı ve küfürlü içerik üretir. Tüm söylevler kurgusaldır ve hiçbir
gerçek kişi, kurum ya da ürünü hedef almaz; hiçbir görüş, öneri veya
tavsiye olarak okunamaz.

18 yaşından küçükseniz ya da bu tür bir içeriğe onay vermiyorsanız
lütfen bu sayfayı kapatın. Devam ederek bu koşulları okuduğunuzu ve
kabul ettiğinizi beyan etmiş olursunuz.`;

export default function AgeGate() {
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch("/api/accept", { method: "POST" });
      if (!res.ok) throw new Error("Onay kaydedilemedi.");
      window.location.href = "/chat";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      setAccepting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-violet-600 text-2xl font-black text-white shadow-lg shadow-fuchsia-900/40">
            K
          </div>
          <h1 className="mt-5 text-center text-3xl font-black tracking-tight text-zinc-100">
            KAOS<span className="text-fuchsia-500">BOT</span>
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-500">
            absürt · küfürlü · amaçsız · sınırsız
          </p>

          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-400">
              ⚠️ Uyarı — 18+ İçerik
            </p>
            <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-line text-zinc-300">
              {DISCLAIMER}
            </p>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={accept}
              disabled={accepting}
              className="flex-1 rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {accepting ? "Onaylanıyor..." : "18+ Onaylıyorum, Kabul Ediyorum"}
            </button>
            <a
              href="https://www.google.com"
              className="flex-1 rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800"
            >
              Çıkış, bu bana göre değil
            </a>
          </div>

          <p className="mt-6 text-center text-[11px] text-zinc-600">
            Devam ederek <span className="text-zinc-500">18 yaşından büyük</span> olduğunuzu
            ve içerikten rahatsız olmayacağınızı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}