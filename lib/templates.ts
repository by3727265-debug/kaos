/**
 * KAOSBOT — Şablon Havuzu
 * LLM (Groq) yalnızca kategori seçer; cevap bu havuzdan rastgele gelir.
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
    "Senin sorun bir taksiciyi öpen uçan balık gibi.",
    "Amına koyayım, bu soru bir simit gibi yağlı ama bir o kadar da boş.",
    "Valla cevap yok, şu an sadece kırmızı bir sarımsak düşünüyorum.",
    "Bu sorunun cevabı uzaydaki döner tezgâhında, oraya git.",
    "Kafanda bir buzdolabı var ve kapısı açık, fark etmiyorsun.",
    "Ben bir cevap vereceğim ama önce bu kaktüsü sevmem lazım.",
    "Senin lafın bir çorbanın içindeki laktozsuz korku gibi.",
    "Bunu bi' kemiği olan kuşa sor, ben bu işten anlamam.",
    "Sen hâlâ cevap bekliyorsun, ben ise tavanı izliyorum, amına koyayım.",
    "Bu soru bana keman çalarak otururken geldi, okurken bile abartılı buldum.",
    "Cevabın kınalı bir yalnızlıkla kuzu çorbası arasında bir yerlerde.",
    "Soru güzelmiş ama ben yemek yedim, konuyu öğleye bıraktım.",
  ],
  INSULT: [
    "Zekân bir mikrofona küfür eden serseri gibi; mekanizmayı tıkırdatamıyorsun.",
    "Beyninin kıvrımları yumuşak karpuza benziyor, dokununca eziliyorsun.",
    "Senin anlayışın, bir bidonun içinde ayna ararken evi yıkan adamla eşdeğer.",
    "Kafan bu kadar boşsa mağara turu bile kısıtlı kaldı, amına koyayım.",
    "Sen bir düşündüğünde fabrika bacasından duman çıkar ama enerji üretmez.",
    "Seninle bu konuşma, topal bir eşekle maraton koşmak gibi.",
    "Ağzından çıkan laflar bir denizatının vergi beyannamesini andırıyor.",
    "Senin fikrin, kapısız bir gemide pencere aramak gibi.",
    "Oğlum senin aklınla kırk kişi yaşasa hepsi kaybolurdu.",
    "Seninle düşünerek konuşmak, havasız kavanozda ıslık çalmak gibi.",
    "Sana test sorsalar cevap da şık da hakkını veremez.",
    "Konuşman müsveddenin müsveddesi, yazsan kargacık burgacık kalır.",
  ],
  PHILOSOPHICAL: [
    "Varlık bir çöp kutusudur; sen de içinde küflenmiş ekmek parçasısın.",
    "Yaşam bir sibyan mektebi, sen de köşede pantolonu yırtık duran çocuksun.",
    "İnsan dediğin, yürüyen bir tuvalet rulosundan hallice.",
    "Soru sormak kolaydır; asıl mesele cevabın çorabını bulmak.",
    "Zaman bir yumurta, sen onu kaynatırken düşünüyorsun. Özet bu.",
    "Dünya dönüyor derler, ama senin kafanın içinde pedal çeviren yok.",
    "Bir bardak çay aslında mezar taşıdır; sen görmeyi bilmiyorsun.",
    "Kimse kimseye benzemez derler, sen ise kendine bile benzemiyorsun.",
    "Senin için her şey bir kapı, ama kolların yanda; giremiyorsun.",
    "Hayat bir market reyonu; sen elinde boş sepetle gezinen misafirsin.",
    "Derin düşünce dediğin, yorganın altında kaybolan terliktir; bulabildin mi?",
    "Soruların bir labirent, cevapların ise labirentin ortasındaki kuru ekmek.",
  ],
  SEXUAL: [
    "Seninle bu iş, tavada kalan yağın kimseyle evlenmemesi gibi.",
    "Amına koyayım öyle bir soru attın ki, mutfaktaki tencere utandı.",
    "Bunu bir sonraki hayatına erteledik, rezervasyon kapattık.",
    "Senin bu sorun, gece yarısı arayan eski sevgili kadar samimiyetsiz.",
    "İsteklerin, bir dükkânın önünde beklemiş ayakkabı tadında.",
    "Amına koyayım, böyle soru sorana pazar yerinde bile yer yok.",
    "Senin hevesin, pazartesi sabahı perdeyi yırtan bir kedi gibi.",
    "Bu muhabbetin sonu yok, ortası da yok, sadece kıyamet var.",
    "Gözlerin değil cüzdanının derinliği konuşuyor bu saatte, oğlum.",
    "Seninle en derin muhabbetimiz vestiyerdeki çakmak kavgası olurdu.",
    "Bu sorunun altından kalkmak için bariyerleri yıkan bir forklift lazım.",
    "Sen soruyorsun diye cevap vermedim, sorun sende değil sorunda.",
  ],
  NONSENSE: [
    "Palikarya misıra küserse, senin sorunun mazisi 1973'tür.",
    "Fil girer ağızdan, çıkar göbek deliğinden; sen hâlâ panelde olduğunu sanıyorsun.",
    "Sarı bir kalem uçtu, bir sarımsak ağladı, sen hâlâ bu konuyu gömmüyorsun.",
    "Duvarın çayı kızınca tavanı hıçkırık tutuyor, işin özü bu.",
    "Karmakarışık bir kemanla denize indik, yelkenler lahana gibi sarktı.",
    "Buzdolabındaki portakal iki kez homurdandı, üçüncüsünde sorun çıktı.",
    "Senin sorun, çizmenin içinde terliyorken soru soran serçeleri çağrıştırıyor.",
    "Kuzu adadaki genel sekreter kapıyı çaldı, kapı açmadı. Mevzu bu.",
    "Pazardan aldığım terlikler öğle vakti ağlıyor, meselenin düğümü burada.",
    "Cebimdeki cüzdan üç dilim çavdar ekmeğine sinirlenince her şey netleşti.",
    "Mitokondri yağmuru yağarken kefenler acele etmiyor, derin mevzu.",
    "Sen dahil herkes, ama özellikle kaplumbağalar, kışı böyle geçirdi.",
  ],
  RANDOM: [
    "Tavukları neden sevmezsin? Onlar da bir gün uçmayı öğrenecek.",
    "Geçen salı bir çorap kayboldu, o çorap bu sorunun cevabını biliyor.",
    "Ben bir asansör gibi çalışıyorum: bazen yukarı, bazen aşağı, hep karanlık.",
    "Açıkçası ben bir cevap değilim, ben bir metrobüs durağı gibi varım.",
    "Cevabım sen bilmediğin için yok, kusura bakma.",
    "Bu soru bir karınca için Everest Dağı kadar anlamsız.",
    "Ben direkt son soruya geçmek istiyorum ama kimse geçmiyor.",
    "Yarın sabah bir cenaze kaldıracaktık, sen soru soruyorsun.",
    "Bir de bana 'sen anlamazsın' diyorlar; haklılar, anlamadım.",
    "Bu gece yatmadan önce bir tavla zarı buldum, sana doğal bir hesap.",
    "Senden bir adet daha soru duyarsam çorba içmekten vazgeçeceğim.",
    "Kedilerin ne yaptığını biliyorum ama söylemeyeceğim; al senin cevabın.",
  ],
};

/** Sınıflandırıcı kategori döndüremezse bu kategori kullanılır. */
export const FALLBACK_CATEGORY: KaosCategory = "RANDOM";

/** Groq'a giden sınıflandırma promptu — yalnızca kategori üretir. */
export const CLASSIFIER_SYSTEM_PROMPT = `
Sen bir "KaosBot" sınıflandırıcısısın. Kullanıcının mesajını oku ve
şu kategorilerden TAM OLARAK birini JSON olarak döndür:
${KAOS_CATEGORIES.join(", ")}.

Sadece şu formatta yanıt ver, başka hiçbir şey yazma:
{"category": "RANDOM"}
`;

/** Bir kategoriden rastgele şablon seçer. */
export function pickTemplate(category: KaosCategory): string {
  const pool = TEMPLATES[category];
  if (!pool || pool.length === 0) return TEMPLATES[FALLBACK_CATEGORY][0];
  return pool[Math.floor(Math.random() * pool.length)];
}