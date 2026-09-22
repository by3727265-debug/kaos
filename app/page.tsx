import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AgeGate from "@/components/AgeGate";

export default async function Home() {
  // Zaten onayladıysan doğrudan sohbete git.
  const store = await cookies();
  if (store.get("kaosbot_age")?.value === "accepted") {
    redirect("/chat");
  }
  return <AgeGate />;
}