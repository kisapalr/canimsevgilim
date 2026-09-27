/* ============================================================
   İÇERİK DOSYASI  —  BURAYI DÜZENLE
   ------------------------------------------------------------
   Sitenin tüm yazıları burada. Kod bilmene gerek yok:
   sadece tırnak içindeki yazıları değiştir, dosyayı kaydet.
   Tırnakları ve sonundaki virgülleri silme.
   ============================================================ */

const ICERIK = {

  /* ---------- TEMEL BİLGİLER ---------- */
  isim: "Aybüke",

  // Kaç yaşına giriyor? Pastadaki mum sayısı bu olacak.
  yas: 21,

  // Doğum günü: [ay, gün]  →  9 = Eylül. Örn. 14 Şubat için [2, 14]
  dogumGunu: [1, 1],


  /* ---------- 1. KİLİT EKRANI BİLDİRİMİ ---------- */
  bildirim: {
    baslik: "Uyanık mısın?",
    metin: "Sana bir şey göstereceğim. Biraz vaktimi aldı."
  },


  /* ---------- 2. KARANLIK ODA — giriş cümleleri ---------- */
  // Sırayla, tek tek ekrana gelirler.
  giris: [
    "Merhaba " + "Aybüke" + ".",
    "Bunu sana hazır bir yerden almadım.",
    "Bir isteğim var:",
    "Işıkları kapat.",
    "Ekranı biraz kıs, telefonu eline al."
  ],


  /* ---------- 3. ATEŞBÖCEKLERİ ---------- */
  // Karanlıkta yakalayacağı ışıklar. Her biri bir mesaj.
  // İstediğin kadar ekleyip çıkarabilirsin (5–9 arası ideal).
  atesbocekleri: [
    {
      baslik: "İlk",
      metin: "Seni ilk gördüğüm günü hâlâ hatırlıyorum. O gün sıradan bir gündü ve sen onu sıradan olmaktan çıkardın."
    },
    {
      baslik: "Gülüşün",
      metin: "Bir şeye gerçekten güldüğünde önce omuzların titrer, sonra sesin gelir. Dünyanın en iyi iki saniyesi."
    },
    {
      baslik: "Sabahları",
      metin: "Sabahları uyanırken çıkardığın o anlamsız sesi kimse bilmiyor. Ben biliyorum. Bu benim en sevdiğim ayrıcalık."
    },
    {
      baslik: "Huysuzluğun",
      metin: "Kızdığın zaman bile sevimli olman haksızlık. Sinirleneceğim yerde gülümsüyorum, sen de daha çok kızıyorsun."
    },
    {
      baslik: "Sessizlik",
      metin: "Hiç konuşmadan yan yana oturabildiğimiz o anlar var ya. Kimseyle öyle rahat susamıyorum."
    },
    {
      baslik: "Kokun",
      metin: "Kalabalık bir yerde gözlerim kapalı olsa bile seni bulurdum. Bunu test etmeye gerek yok, biliyorum."
    },
    {
      baslik: "Sen",
      metin: "Bugün senin günün ama asıl hediyeyi ben aldım. Sen buradasın ve bu bana yetiyor."
    }
  ],


  /* ---------- 4. MUMLAR ---------- */
  mum: {
    davet: "Şimdi ışığı sana veriyorum.",
    talimat: "Telefonu ağzına yaklaştır ve üfle.",
    dinliyor: "seni duyuyorum",
    talimatYedek: "Mikrofon kapalı. Aşağıdaki düğmeyi basılı tut ve üfle.",
    dilek: "Dilek tut."
  },


  /* ---------- 5. MEKTUP ---------- */
  mektup: {
    baslik: "İyi ki doğdun",
    // Her satır ayrı bir paragraf olur.
    paragraflar: [
      "Sana klasik bir şey yapmak istemedim. Hazır şablonlarda senin adını yazmak bana yetmedi.",
      "Çünkü sen hazır bir şey değilsin.",
      "Bu yılın en güzel tarafı, sıradan günlerin bile artık sıradan olmaması. Kötü bir gün geçiriyorum derken senin bir mesajın geliyor ve gün değişiyor. Bunu nasıl yaptığını bilmiyorum, öğrenmeye de niyetim yok. Büyüsü kaçmasın.",
      "Yeni yaşında sana çok gülmen, az üzülmen, hep merak etmen dilerim. Ve nerede olursan ol, dönüp bakınca beni de orada bulman.",
      "İyi ki doğdun. İyi ki varsın."
    ],
    imza: "— seni çok seven biri"     // buraya kendi adını yazabilirsin
  },


  /* ---------- 6. FOTOĞRAFLAR ---------- */
  // "fotograflar" klasörüne 1.jpg, 2.jpg, 3.jpg diye at, otomatik görünürler.
  // Yoksa boş çerçeve olarak durur, site yine çalışır.
  fotograflar: [
    { dosya: "fotograflar/1.jpg", yazi: "o bakış işte, tam o" },
    { dosya: "fotograflar/2.jpg", yazi: "hiç uğraşmadan güzel" },
    // sigdir:true → kare çerçeveye kırpmadan sığdırır (ekran görüntüleri için iyi)
    { dosya: "fotograflar/3.jpg", yazi: "aynı şarkı, aynı anda", sigdir: true }
  ],


  /* ---------- 7. GÜNÜN NOTU ---------- */
  // Site ana ekranına eklendikten sonra her gün açtığında
  // buradan sıradaki notu gösterir. İstediğin kadar ekle.
  gunlukNotlar: [
    "Bugün de iyi ki varsın.",
    "Aklımdasın. Şu an bile.",
    "Bugün biraz daha az yorul, tamam mı?",
    "Sana bakınca içim rahatlıyor.",
    "Bugün seni özledim, dün de özlemiştim.",
    "Ne olursa olsun buradayım.",
    "Bugün gülümse, sana yakışıyor.",
    "Seninle her şey daha kolay.",
    "Bunu okurken gülümsediysen görevimi yaptım.",
    "Kavanozdaki ışıklar hâlâ yanıyor."
  ],


  /* ---------- 8. SON EKRAN ---------- */
  son: {
    baslik: "Bu kavanoz artık senin.",
    metin: "Telefonuna ekle. Karanlıkta kalırsan diye."
  }
};
