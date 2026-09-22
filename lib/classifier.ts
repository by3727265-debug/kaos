import {
  CLASSIFIER_SYSTEM_PROMPT,
  KAOS_CATEGORIES,
  FALLBACK_CATEGORY,
  type KaosCategory,
} from "./templates";
import { getEnv } from "./env";

/**
 * Ücretsiz AI sağlayıcı zinciri.
 * Sıra önemli: ilk sıradaki sağlayıcı çalışınca kullanılır; hata/limit verirse
 * bir sonraki sağlayıcıya geçer. Hepsi başarısız olursa FALLBACK_CATEGORY döner.
 *
 * Sadece anahtarı olan sağlayıcılar zincire dahil olur.
 * Model adları .env ile "PROVIDER_MODEL" şeklinde ezilebilir.
 *
 * Not (2026): Groq'da bazı modeller "reasoning" yaptığı için cevap gecikir ve
 * pahalıya patlar. Sınıflandırma için hızlı + json_object destekleyen
 * qwen/qwen3.8-27b varsayılan seçildi.
 *
 * Ortam değişkenleri her istekte okunur (Cloudflare Workers'te binding'ler
 * sadece request anında erişilebildiği için).
 */
type Provider = {
  id: string;
  baseURL: string;
  model: string;
  apiKey?: string;
};

async function getProviders(): Promise<Provider[]> {
  const providers: Provider[] = [
    {
      id: "groq",
      baseURL: "https://api.groq.com/openai/v1",
      model: (await getEnv("GROQ_MODEL")) ?? "qwen/qwen3.8-27b",
      apiKey: await getEnv("GROQ_API_KEY"),
    },
    {
      id: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      // OpenRouter'daki :free modeller ücretsizdir (anlık liste değişebilir).
      model: (await getEnv("OPENROUTER_MODEL")) ?? "deepseek/deepseek-chat-v3-0324:free",
      apiKey: await getEnv("OPENROUTER_API_KEY"),
    },
    {
      id: "cerebras",
      baseURL: "https://api.cerebras.ai/v1",
      model: (await getEnv("CEREBRAS_MODEL")) ?? "llama-3.3-70b",
      apiKey: await getEnv("CEREBRAS_API_KEY"),
    },
  ];

  return providers.filter((p) => p.apiKey);
}

const TIMEOUT_MS = 10_000;
const MAX_TOKENS = 100;

type CallResult =
  | { kind: "network-error" }
  | { kind: "http-error"; status: number }
  | { kind: "ok"; content: string };

/** Tek bir sağlayıcıyla tek bir istek dener. */
async function callOnce(
  provider: Provider,
  message: string,
  useJson: boolean
): Promise<CallResult> {
  if (!provider.apiKey) return { kind: "http-error", status: 401 };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${provider.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
        // OpenRouter, kullanım amacı için bu header'ları ister (opsiyonel).
        ...(provider.id === "openrouter"
          ? {
              "HTTP-Referer": "https://kaosbot.pages.dev",
              "X-Title": "KaosBot",
            }
          : {}),
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: "system", content: CLASSIFIER_SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
        ...(useJson ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) return { kind: "http-error", status: res.status };
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return { kind: "ok", content };
  } catch {
    return { kind: "network-error" };
  } finally {
    clearTimeout(timeout);
  }
}

function parseCategory(content: string): KaosCategory | null {
  const match = content.match(/\{"category"\s*:\s*"([^"]+)"\}/i);
  if (!match) return null;
  const candidate = match[1].toUpperCase() as string;
  if ((KAOS_CATEGORIES as string[]).includes(candidate)) {
    return candidate as KaosCategory;
  }
  // Bazen model sadece "INSULT" gibi çıplak kelime döner.
  const direct = (KAOS_CATEGORIES as string[]).find(
    (c) => content.toUpperCase() === c
  );
  return (direct as KaosCategory | undefined) ?? null;
}

/** Bir sağlayıcıyı dener; JSON modu reddedilirse düz modla tekrar dener. */
async function tryClassify(
  provider: Provider,
  message: string
): Promise<KaosCategory | null> {
  let result = await callOnce(provider, message, true);

  // Bazı sağlayıcılar response_format'ı desteklemez (400/422): düz moda düş.
  if (
    result.kind === "http-error" &&
    (result.status === 400 || result.status === 422)
  ) {
    result = await callOnce(provider, message, false);
  }

  if (result.kind === "ok") {
    const category = parseCategory(result.content);
    if (category) return category;
  } else if (result.kind === "http-error") {
    const reason =
      result.status === 429
        ? "limit/token bitti"
        : result.status === 401 || result.status === 403
        ? "anahtar geçersiz"
        : `hata ${result.status}`;
    console.warn(
      `[classifier] ${provider.id} (${provider.model}) -> ${reason}, sonraki sağlayıcıya geçiliyor.`
    );
  } else {
    console.warn(
      `[classifier] ${provider.id} (${provider.model}) -> ağ hatası, sonraki sağlayıcıya geçiliyor.`
    );
  }

  return null;
}

/** Mesajı sınıflandırır. Bütün sağlayıcılar fail'leirse RANDOM'a düşer. */
export async function classifyIntent(message: string): Promise<KaosCategory> {
  const available = await getProviders();

  if (available.length === 0) {
    console.warn("[classifier] HİÇBİR AI anahtarı yok, hep RANDOM kullanılacak.");
    return FALLBACK_CATEGORY;
  }

  for (const provider of available) {
    const category = await tryClassify(provider, message);
    if (category) return category;
  }

  return FALLBACK_CATEGORY;
}