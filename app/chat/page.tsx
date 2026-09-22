import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";

export const metadata = {
  title: "KaosBot | SoHBeT",
};

export default async function ChatPage() {
  // Proxy'deki kontrolüne ek olarak savunma derinliği.
  const store = await cookies();
  if (store.get("kaosbot_age")?.value !== "accepted") {
    redirect("/");
  }
  return (
    <div className="flex h-dvh flex-col bg-zinc-950 px-0 pt-8 sm:px-4">
      <ChatInterface />
    </div>
  );
}