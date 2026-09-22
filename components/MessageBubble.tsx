"use client";

import type { ChatMessage } from "./ChatInterface";
import TypewriterText from "./TypewriterText";

type Props = {
  message: ChatMessage;
  animate?: boolean;
};

export default function MessageBubble({ message, animate }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fuchsia-600/20 text-sm font-black text-fuchsia-300 ring-1 ring-fuchsia-500/40">
          K
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-violet-600 text-white"
            : "rounded-bl-md bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700/60"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : message.streaming ? (
          <TypingDots />
        ) : (
          <div>
            <p className="whitespace-pre-wrap break-words">
              {animate ? (
                <TypewriterText text={message.content} speed={14} />
              ) : (
                message.content
              )}
            </p>
            {message.category && (
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-fuchsia-400/60">
                #[{message.category}]
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="tw-dot" />
      <span className="tw-dot" style={{ animationDelay: "0.15s" }} />
      <span className="tw-dot" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}