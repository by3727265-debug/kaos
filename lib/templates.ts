/**
 * KAOSBOT — Şablon Havuzu
 * LLM (Groq) "kategori + konu" çıkarır; cevap bu havuzdan rastgele gelir.
 * - {topic} içeren şablonlar: kullanıcının konusuna göre örülür (örn. "İş ha? ...")
 * - {topic} içermeyen şablonlar: konu çıkarılamazsa (null) kullanılır.
 * Böylece tam kontrol sende olur ve API maliyeti minimumda kalır.
 */

export type KaosCategory =
  | "ABSURD"
  | "INSULT"
  | "PHILOSOPHICAL"
  | "SEXUAL"
  | "NONSENSE"
  | "RANDOM";

export const KAOS_CATEGORIES: KaosCategory[] = [
  "ABSURD",
  "INSULT",
  "PHILOSOPHICAL",
  "SEXUAL",
  "NONSENSE",
  "RANDOM",
];

export const TEMPLATES: Record<KaosCategory, string[]> = {
  ABSURD: [
    "{topic} ha? Senin bu işin bir taksiciyi öpen uçan balık gibi.",
    "{topic} deyince aklıma bir şey geldi: kırmızı bir sarımsak. O kadar.",
    "{topic} mi? Cevap uzaydaki döner tezgâhında, oraya git.",
    "{topic} konusunda kafanda bir buzdolabı var, kapısı açık, fark etmiyorsun.",
    "{topic} için önce şu kaktüsü sevmem lazım, bekle.",
    "{topic} sorunu bir çorbanın içindeki laktozsuz korku gibi.",
    "{topic} mevzusu keyfimi kaçırdı, tavanı izliyorum, amına koyayım.",
    "Valla cevap yok, şu an sadece sarımsak düşünüyorum.",
    "Bunu bi' kemiği olan kuşa sor, ben bu işten anlamam.",
    "Cevabın kınalı bir yalnızlıkla kuzu çorbası arasında bir yerlerde.",
    "Soru güzelmiş ama ben yemek yedim, konuyu öğleye bıraktım.",
    "Bu soru keman çalarak otururken geldi, okurken bile abartılı buldum.",
  ],
  INSULT: [
    "{topic} mi? Senin onu anlaman bidonun içinde ayna aramak gibi.",
    "Bir de {topic} diye ağzına alıyorsun, o konuda bile yanlışsın.",
    "Senin {topic} halin, topal bir eşekle maraton koşmak gibi.",
    "{topic} konusunda kafan bu kadar boşsa mağara turu bile kısıtlı kaldı.",
    "Sen {topic} diyorsun ama düşünsen fabrika bacan duman çıkar, enerji üretmez.",
    "Ağzından {topic} lafı çıkarken bile denizatının vergi beyannamesini andırıyorsun.",
    "Seninle {topic} konuşmak, havasız kavanozda ıslık çalmak gibi.",
    "Zekân bir mikrofona küfür eden serseri gibi; mekanizmayı tıkırdatamıyorsun.",
    "Beyninin kıvrımları yumuşak karpuza benziyor, dokununca eziliyorsun.",
    "Oğlum senin aklınla kırk kişi yaşasa hepsi kaybolurdu.",
    "Senin fikrin, kapısız bir gemide pencere aramak gibi.",
    "Konuşman müsveddenin müsveddesi, yazsan kargacık burgacık kalır.",
  ],
  PHILOSOPHICAL: [
    "{topic} dediğin şey aslında bir çöp kutusu; sen de içinde küflenmiş ekmek parçasısın.",
    "Derinleş: {topic} bir yumurtadır, sen onu kaynatırken düşünüyorsun. Özet bu.",
    "Senin için {topic} bir kapı; ama kolların yanda, giremiyorsun.",
    "{topic} hakkında en derin sözüm: kimse kimseye benzemez derler, sen ise kendine bile benzemiyorsun.",
    "Dünya dönüyor derler; ama sen {topic} derken kafanın içinde pedal çeviren yok.",
    "{topic} bir labirent; senin cevabın ise labirentin ortasındaki kuru ekmek.",
    "Hayat bir market reyonu; sen de {topic} derken elinde boş sepetle geziniyorsun.",
    "İnsan dediğin, yürüyen bir tuvalet rulosundan hallice.",
    "Bir bardak çay aslında mezar taşıdır; sen görmeyi bilmiyorsun.",
    "Derin düşünce yorganın altında kaybolan terliktir; bulabildin mi?",
    "Soru sormak kolaydır; asıl mesele cevabın çorabını bulmak.",
  ],
  SEXUAL: [
    "{topic} mi? Amına koyayım öyle bir muhabbet attın ki mutfaktaki tencere utandı.",
    "Seninle {topic} konuşmak, gece yarısı arayan eski sevgili kadar samimiyetsiz.",
    "{topic} konusunda isteklerin, dükkânın önünde beklemiş ayakkabı tadında.",
    "Amına koyayım, {topic} diye soru sorana pazar yerinde bile yer yok.",
    "Senin {topic} hevesin, pazartesi sabahı perdeyi yırtan bir kedi gibi.",
    "Bu {topic} muhabbetinin sonu yok, ortası da yok, sadece kıyamet var.",
    "Seninle en derin muhabbetimiz {topic} değil, vestiyerdeki çakmak kavgası olurdu.",
    "Seninle bu iş, tavada kalan yağın kimseyle evlenmemesi gibi.",
    "Bunu bir sonraki hayatına erteledik, rezervasyon kapattık.",
    "Gözlerin değil cüzdanının derinliği konuşuyor bu saatte, oğlum.",
    "Bu sorunun altından kalkmak için bariyerleri yıkan bir forklift lazım.",
  ],
  NONSENSE: [
    "{topic} ha? Palikarya misıra küserse senin bu işin mazisi 1973'tür.",
    "Şu {topic} mevzusu, çizmenin içinde terliyorken soru soran serçeleri çağrıştırıyor.",
    "{topic} deyince bambaşka bir şey oldu: sarı bir kalem uçtu, sarımsak ağladı.",
    "{topic} meselesi mi? Buzdolabındaki portakal iki kez homurdandı, üçüncüsünde sorun çıktı.",
    "{topic} konusunun düğümü şurada: kuzu adadaki genel sekreter kapıyı çaldı, kapı açmadı.",
    "{topic} derken cebimdeki cüzdan üç dilim çavdar ekmeğine sinirlendi, her şey netleşti.",
    "{topic} işi, mitokondri yağmuru yağarken kefenlerin acele etmemesi gibi; derin mevzu.",
    "Fil girer ağızdan, çıkar göbek deliğinden; sen hâlâ panelde olduğunu sanıyorsun.",
    "Duvarın çayı kızınca tavanı hıçkırık tutuyor, işin özü bu.",
    "Karmakarışık bir kemanla denize indik, yelkenler lahana gibi sarktı.",
    "Pazardan aldığım terlikler öğle vakti ağlıyor, meselenin düğümü burada.",
    "Sen dahil herkes, ama özellikle kaplumbağalar, kışı böyle geçirdi.",
  ],
  RANDOM: [
    "{topic} ha? Tavukları neden sevmezsin, onlar da bir gün uçmayı öğrenecek.",
    "{topic} deyince aklıma gelen tek şey: geçen salı kaybolan bir çorap. Cevap o.",
    "Açıkçası {topic} benim alanım değil; ben bir metrobüs durağı gibi varım.",
    "{topic} sorusuna cevabım yok ama bu gece yatmadan önce bir tavla zarı buldum, sana doğal bir hesap.",
    "{topic} mu? Ben direkt son soruya geçmek istiyorum ama kimse geçmiyor.",
    "Sen bir de {topic} demişsin; yarın cenaze kaldıracaktık, sen soru soruyorsun.",
    "Kediler {topic} konusunda ne yapıyor biliyorum ama söylemeyeceğim; al senin cevabın.",
    "Ben bir asansör gibi çalışıyorum: bazen yukarı, bazen aşağı, hep karanlık.",
    "Cevabım sen bilmediğin için yok, kusura bakma.",
    "Bu soru bir karınca için Everest Dağı kadar anlamsız.",
    "Bir de bana 'sen anlamazsın' diyorlar; haklılar, anlamadım.",
    "Senden bir adet daha soru duyarsam çorba içmekten vazgeçeceğim.",
  ],
};

/** Sınıflandırıcı kategori döndüremezse bu kategori kullanılır. */
export const FALLBACK_CATEGORY: KaosCategory = "RANDOM";

/** Konu çıkarılamazsa {topic} yerine geçer. */
export const FALLBACK_TOPIC = "Mevzu";

/** Kullanıcının konusu metne gömülmeden önce temizlenir. */
export function sanitizeTopic(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const clean = raw
    .replace(/\{topic\}/gi, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, 60);
  return clean.length > 0 ? clean : null;
}

/** Groq'a giden sınıflandırma promptu — kategori + konu üretir. */
export const CLASSIFIER_SYSTEM_PROMPT = `
Sen bir "KaosBot" sınıflandırıcısısın. Kullanıcının mesajını oku ve
JSON olarak şu iki alanı döndür:

1) "category": şu kategorilerden TAM OLARAK biri:
${KAOS_CATEGORIES.join(", ")}.

2) "topic": kullanıcının asıl bahsettiği konu veya duygu. En fazla 3-4
kelimelik kısa bir deyim olsun (küçük harf). Küfür/argo olağan ama kısa
kalmalı. Mesajda net bir konu yoksa (ör. sadece "selam", "ha", "nasılsın")
"topic" değerini null yap, "category" yine doldur.

Örnekler:
Mesaj: "banka işleri için geldim kanka"
→ {"category": "ABSURD", "topic": "banka"}
Mesaj: "hiçbir şey yapasım yok"
→ {"category": "PHILOSOPHICAL", "topic": "hiçbir şey yapmamak"}
Mesaj: "selam"
→ {"category": "RANDOM", "topic": null}

Sadece JSON döndür, başka hiçbir şey yazma.
`;

/** Bir kategoriden rastgele şablon seçer; konu varsa {topic} ile örer. */
export function pickTemplate(
  category: KaosCategory,
  topic?: string | null
): string {
  const pool = TEMPLATES[category] ?? TEMPLATES[FALLBACK_CATEGORY];
  if (pool.length === 0) return TEMPLATES[FALLBACK_CATEGORY][0];

  const cleanTopic = sanitizeTopic(topic);
  const withTopic = pool.filter((t) => t.includes("{topic}"));
  const generic = pool.filter((t) => !t.includes("{topic}"));

  // Konu varsa konuya göre şablon seç; yoksa jenerik şablon seç.
  const list = cleanTopic
    ? withTopic.length > 0
      ? withTopic
      : generic
    : generic.length > 0
    ? generic
    : withTopic;

  const chosen = list[Math.floor(Math.random() * list.length)];
  return chosen.replaceAll("{topic}", cleanTopic ?? FALLBACK_TOPIC);
}