# 🤪 KaosBot

Absürt, küfürlü ve saçma konuşan eğlence amaçlı kurgusal chat botu.

## Nasıl çalışıyor?

Hibrit yaklaşım:

1. Kullanıcı mesajı `/api/chat`'e gider.
2. **Groq** (ücretsiz API) mesajdan şunları çıkarır:
   - `category`: `ABSURD | INSULT | PHILOSOPHICAL | SEXUAL | NONSENSE | RANDOM`
   - `topic`: kullanıcının bahsettiği konu (kısa bir deyim)
3. `lib/templates.ts` havuzundan **rastgele** bir cevap seçilir ve `{topic}`
   yerine konu yerleştirilir — cevap senin anlattığın konuya dokunur ama metin
   yine tamamen el yazımı şablonlardan gelir.

LLM asla cevap üretmez — bu yüzden maliyet neredeyse sıfır ve içerik tam
kontrolü sende.

## Giriş akışı

- `/` → **18+ uyarı kapısı** (disclaimer + kabul butonu → cookie)
- `/chat` → sohbet (cookie yoksa `/`'e yönlendirilir, sayfa seviyesi kontrol)
- `/api/chat` → rate limit + sınıflandırma + şablon

## Yerelde çalıştırma

```bash
npm install
# .env.local oluştur ve GROQ_API_KEY ekle (bkz. .env.example)
npm run dev
```

Anahtar olmadan da çalışır: bot her şeyi "RANDOM" kategorisinden cevaplar.

### AI sağlayıcı zinciri (fallback)

Groq ücretsiz kullanım limitlemesi verirse otomatik olarak bir sonraki
ücretsiz sağlayıcıya geçer. Sıra: **Groq → OpenRouter → Cerebras → RANDOM**.

- **OpenRouter** — `:free` modeller ücretsiz: `https://openrouter.ai/keys` ücretsiz key ver.
- **Cerebras** — ücretsiz tier: `https://console.cerebras.ai/`.
- Sadece anahtarı olanlar zincire dahil olur; hiçbiri yoksa RANDOM.

Ortam değişkenleri `lib/env.ts` üzerinden okunur:
- **Node** (dev / Render): `process.env`
- **Cloudflare Workers**: `getCloudflareContext().env` (binding'ler)

Model adları `.env` ile ezilebilir: `GROQ_MODEL`, `OPENROUTER_MODEL`, `CEREBRAS_MODEL`.

## Deploy (Cloudflare Workers)

> Next.js'i Cloudflare'de çalıştırmak için resmi yol **OpenNext adapter**
> (`@opennextjs/cloudflare`). `@cloudflare/next-on-pages` artık deprecated.
> Bu proje High-efficiency çalışır: API route'ları + sayfa kontrolleri worker
> runtime'da test edildi (18+ kapısı, rate limit, Groq sınıflandırma).

### 1. GitHub'a yükle

```bash
git init
git add .
git commit -m "KaosBot Cloudflare"
git branch -M main
git remote add origin https://github.com/KULLANICIADI/kaos.git
git push -u origin main
```

> `.gitignore` zaten `.env*` dosyalarını dışlar — anahtarın GitHub'a gitmez.
> `.dev.vars` (wrangler yerel secret dosyası) da `.env*` kuralına takılır.

### 2. Workers Builds ile deploy (önerilen)

1. https://dash.cloudflare.com → sol menü **Workers & Pages**
2. **Create** → **Workers** → **Create Worker** → altta "Workers Builds" ile GitHub bağla
   (veya direkt "Connect to GitHub" seçeneği varsa onu kullan)
3. `kaos` reposunu seç, adı `kaosbot` yap
4. **Build & Deploy ayarları:**
   - **Build command:** `npx @opennextjs/cloudflare build`
   - **Deploy command:** `npx @opennextjs/cloudflare deploy`
5. **Variables & Secrets** olarak ekle:
   - `GROQ_API_KEY` → senin key'in (secret)
   - (opsiyonel) `OPENROUTER_API_KEY`, `CEREBRAS_API_KEY`
6. **Save and Deploy** → ilk build ~2-3 dk sürer
7. Site: `https://kaosbot.<senin-alt-alan>.workers.dev`

> Türkiye'den hız için projeye özel domain bağlayabilirsin
> (Cloudflare DNS → Workers route).

### 3. Yerel CLI ile deploy (alternatif)

```bash
npx wrangler login        # tarayıcıda Cloudflare girişi
npx wrangler secret put GROQ_API_KEY   # worker adı: kaosbot
npm run cloudflare:deploy
```

### 4. Yerel worker testi

```bash
Copy-Item .env.local .dev.vars   # wrangler yerel secret'ları
npx wrangler dev                 # http://localhost:8787
```

### 5. Güncelleme

Kod değiştirip `git push` yaptığında Workers Builds otomatik yeniden deploy
eder (üretim branch'i `main` olduğu sürece).

## Proje yapısı

```
app/
  page.tsx            # 18+ kapısı
  chat/page.tsx       # sohbet sayfası (cookie kontrolü burada)
  api/accept/route.ts # 18+ onay cookie'si set eder
  api/chat/route.ts   # rate limit + Groq sınıflandırma + şablon
components/
  AgeGate.tsx
  ChatInterface.tsx
  MessageBubble.tsx
  TypewriterText.tsx
lib/
  templates.ts        # şablon havuzu (6 kategori)
  classifier.ts       # Groq → OpenRouter → Cerebras zinciri
  env.ts              # çift platformlu env okuma (Node/Workers)
  rate-limit.ts       # in-memory IP bazlı limit
wrangler.jsonc        # Cloudflare worker config
open-next.config.ts   # OpenNext adapter config
```

## Güvenlik / yasal not

Sitede 18+ kapısı, disclaimer ve rate limit mevcut. Tüm içerik kurgusaldır;
gerçek kişi/kurum hedeflemez. Yine de herkese açık küfürlü içerik barındıran
bir siteyi canlıya almadan önce yerel yasal durumu (örn. Türkiye'de 5651)
gözden geçirmeni öneririz.

## Şablon havuzunu genişletmek

`lib/templates.ts` içinde kategori başına yeni satırlar ekleyebilirsin.
Hedef: kategori başına 30+ cevap.