import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Çift platformlu ortam değişkeni okuma:
 * - Node (npm run dev / Render): process.env'den okur.
 * - Cloudflare Workers: değişkenler/secret'lar binding'lere gelir,
 *   bu yüzden getCloudflareContext().env üzerinden okunur.
 */
export async function getEnv(key: string): Promise<string | undefined> {
  // 1) Node runtime
  const direct = process.env[key];
  if (direct) return direct;

  // 2) Cloudflare Workers runtime
  try {
    const { env } = await getCloudflareContext({ async: true });
    const record = env as unknown as Record<string, unknown>;
    const value = record[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}