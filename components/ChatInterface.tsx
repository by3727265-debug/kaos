"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export type ChatMessage = {
  id: number;
  role: "user" | "bot";
  content: string;
  streaming?: boolean;
  category?: string;
};

const GREETING =
  "Selam, ben KaosBot. Amına koyayım, ne soracaksan sor da boş konuşmayı bırakalım.";

let nextId = 1;

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId++, role: "bot", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = { id: nextId++, role: "user", content: text };
    const botMsg: ChatMessage = {
      id: nextId++,
      role: "bot",
      content: "",
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        let msg = `Hata (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* yut */
        }
        throw new Error(msg);
      }

      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsg.id
            ? { ...m, content: data.reply, category: data.category, streaming: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsg.id
            ? {
                ...m,
                content:
                  err instanceof Error ? err.message : "Alakasız bir arıza, amına koyayım.",
                streaming: false,
                category: "ERROR",
              }
            : m
        )
      );
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col">
      {/* Başlık */}
      <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-fuchsia-900/40">
          K
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-100">KaosBot</h1>
          <p className="text-xs text-zinc-500">
            absürt · küfürlü · amaçsız · sınırsız
          </p>
        </div>
        <span className="ml-auto flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          online & kaosta
        </span>
      </header>

      {/* Mesajlar */}
      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            animate={m.role === "bot" && i === messages.length - 1}
          />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Giriş */}
      <footer className="border-t border-zinc-800 p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bir şeyler yaz... (500 karaktere kadar)"
            maxLength={500}
            disabled={busy}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-[15px] text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "..." : "Gönder"}
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          KaosBot absürt ve müstehcen içerik üretir. Söylediklerinin hiçbiri gerçek değildir.
        </p>
      </footer>
    </div>
  );
}