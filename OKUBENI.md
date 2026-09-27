# Bir Kavanoz Işık 🕯

Aybüke için hazırlanmış, telefonda açılan küçük bir doğum günü hediyesi.

## Nasıl ilerliyor?

1. **Kilit ekranı** — sahte bir bildirim düşer, yukarı kaydırınca açılır.
2. **Karanlık oda** — "ışıkları kapat" der, ortamı hazırlar.
3. **Ateşböcekleri** — karanlıkta ışıklar uçuşur. Telefonu eğdikçe savrulurlar,
   parmağı yaklaşınca kaçarlar. Her yakalanan ışık bir mesaj açar,
   alttaki kavanoz yavaş yavaş dolar.
4. **Pasta** — kavanoz dolunca ışık pastaya dönüşür.
   **Mikrofona gerçekten üfleyerek** mumları söndürür.
   (Mikrofon izni vermezse "basılı tut ve üfle" düğmesi çıkar.)
5. **Şafak** — ekran kararır, sonra gün doğar ve mektup görünür.
6. **Günün notu** — siteyi ana ekranına ekledikten sonra her gün
   açtığında farklı bir not görür. Hediye tek seferlik olmaz.

Arka planda `song.mp3` döngüde çalar; site açılınca başlar, tarayıcı
izin vermezse ilk dokunuşta başlar
(sağ üstteki düğmeyle kapatılabilir).

---

## 1. İçeriği kişiselleştir

Sadece **`icerik.js`** dosyasını aç (herhangi bir metin düzenleyiciyle).
İçindeki tırnak arası yazıları değiştir. Kod bilmene gerek yok.

Değiştirmen gerekenler:

| Ne | Nerede |
|---|---|
| Yaşı (= mum sayısı) | `yas: 21` |
| Doğum günü tarihi | `dogumGunu: [1, 1]` → `[ay, gün]` |
| Ateşböceği mesajları | `atesbocekleri` listesi — **en önemli kısım burası** |
| Mektup | `mektup.paragraflar` |
| İmza | `mektup.imza` |
| Her gün değişen notlar | `gunlukNotlar` listesi |

> **Not:** Şu anki mesajlar örnek. Onları kendi anılarınızla değiştirdiğinde
> site "her yerde bulunan bir şey" olmaktan tamamen çıkar. Asıl fark orada.

## 2. Fotoğraf ekle (isteğe bağlı)

`fotograflar` klasörüne `1.jpg`, `2.jpg`, `3.jpg` adıyla at. Otomatik görünürler.
Koymazsan da site sorunsuz çalışır, o yerlerde boş polaroid çerçeveleri durur.

Altlarındaki yazıları `icerik.js` içindeki `fotograflar` listesinden değiştirirsin.
Çerçeve kare olduğu için fotoğraflar ortadan kırpılır. Bir kare kırpılmasın
istiyorsan (mesela ekran görüntüsü) o satıra `sigdir: true` ekle — o zaman
kırpmadan çerçeveye sığdırır.

## 3. Telefonunda açılması için internete koy

Üfleme (mikrofon) ve eğme (jiroskop) özellikleri **sadece `https://` adreslerde**
çalışır. Dosyaya çift tıklayıp açarsan bu ikisi devre dışı kalır —
site yine çalışır ama sihrin yarısı gider. O yüzden şunu yap:

### En kolay yol — Netlify Drop (üyelik gerekmez, ücretsiz)

1. <https://app.netlify.com/drop> adresini aç.
2. Bu klasörün **tamamını** sayfaya sürükle bırak.
3. Sana `https://...netlify.app` diye bir adres verir. Bitti.
4. O adresi Aybüke'ye gönder.

Adresi güzelleştirmek istersen (ücretsiz): Netlify'da *Site settings →
Change site name* kısmından `aybuke-kavanoz.netlify.app` gibi bir şey yapabilirsin.

İçeriği sonradan değiştirirsen klasörü aynı yere tekrar sürüklemen yeterli.

### Alternatifler
- **GitHub Pages** — repoya at, Settings → Pages → main branch.
- **Vercel** — klasörü sürükle bırak.

## 4. Ana ekrana eklemesi

Site açıldıktan sonra en altta bunun yönergesi zaten var:

- **iPhone (Safari):** alttaki *Paylaş* → *Ana Ekrana Ekle*
- **Android (Chrome):** çıkan *"ana ekrana ekle"* düğmesine dokunur

Eklendikten sonra tarayıcı çubuğu olmadan, gerçek bir uygulama gibi açılır
ve internet olmasa bile çalışır.

---

## Küçük tavsiyeler

- Ona **gece** göndermeyi dene. "Işıkları kapat" cümlesi o zaman anlam kazanıyor.
- İlk açılışta tarayıcı mikrofon izni soracak — "izin ver" demesi gerektiğini
  önceden söyleme, sürprizi bozar; zaten ekranda ne yapacağı yazıyor.
- Ateşböceği sayısını 5–9 arasında tut. Fazlası yorucu oluyor.

## Dosyalar

```
index.html    iskelet
style.css     görünüm
icerik.js     ← SENİN DÜZENLEYECEĞİN DOSYA
app.js        akış, animasyonlar, üfleme algılama
manifest.json ana ekrana eklenebilmesi için
sw.js         internetsiz de açılabilmesi için
ikonlar/      uygulama simgesi
fotograflar/  fotoğrafları buraya at
```
