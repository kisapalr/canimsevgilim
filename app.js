/* ============================================================
   Bir Kavanoz Işık — uygulama
   İçeriği değiştirmek için icerik.js dosyasına bak.
   ============================================================ */
(function(){
"use strict";

const $  = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const bekle = (ms)=>new Promise(r=>setTimeout(r,ms));
const kisit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const durum = {
  yakalanan: 0,
  toplam: (ICERIK.atesbocekleri||[]).length,
  egim: {x:0, y:0},
  egimVar: false,
  avAktif: false,
  ses: false
};

/* ---------------------------------------------------------
   SAHNE GEÇİŞİ
--------------------------------------------------------- */
function gecis(hedefId, sure){
  sure = sure===undefined ? 900 : sure;
  const eski = $(".sahne.aktif");
  const ac = ()=>{
    const y = document.getElementById(hedefId);
    y.classList.add("aktif");
    y.style.opacity = "0";
    void y.offsetHeight;
    setTimeout(()=>{ y.style.opacity = "1"; }, 20);
  };
  if(eski){
    eski.style.opacity = "0";
    setTimeout(()=>{ eski.classList.remove("aktif"); eski.style.opacity=""; ac(); }, sure);
  } else ac();
}

/* ---------------------------------------------------------
   0 · KİLİT EKRANI
--------------------------------------------------------- */
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz",
               "Ağustos","Eylül","Ekim","Kasım","Aralık"];
const GUNLER = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];

function saatiKur(){
  const yaz = ()=>{
    const d = new Date();
    $("#saat").textContent =
      String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
    $("#tarih").textContent = GUNLER[d.getDay()] + ", " + d.getDate() + " " + AYLAR[d.getMonth()];
  };
  yaz(); setInterval(yaz, 10000);
}

function kilidiKur(){
  $("#bildirim-baslik").textContent = ICERIK.bildirim.baslik;
  $("#bildirim-metin").textContent  = ICERIK.bildirim.metin;

  let acildi = false;
  const ac = ()=>{
    if(acildi) return; acildi = true;
    gecis("karanlik", 750);
    setTimeout(girisiOynat, 800);
  };

  let y0 = null;
  const k = $("#kilit");
  k.addEventListener("touchstart", e=>{ y0 = e.touches[0].clientY; }, {passive:true});
  k.addEventListener("touchmove",  e=>{
    if(y0!==null && y0 - e.touches[0].clientY > 55) ac();
  }, {passive:true});
  k.addEventListener("click", ac);
  window.addEventListener("wheel", e=>{ if(!acildi && e.deltaY>18) ac(); }, {passive:true});
}

/* ---------------------------------------------------------
   1 · KARANLIK ODA — giriş yazıları
--------------------------------------------------------- */
async function girisiOynat(){
  const kutu = $("#giris-yazi");
  const satirlar = ICERIK.giris || [];
  for(let i=0;i<satirlar.length;i++){
    kutu.textContent = satirlar[i];
    kutu.style.transition = "none";
    kutu.style.opacity = "0";
    kutu.style.transform = "translateY(14px)";
    await bekle(30);
    kutu.style.transition = "opacity 1.4s ease, transform 1.4s cubic-bezier(.2,.9,.25,1)";
    kutu.style.opacity = "1";
    kutu.style.transform = "none";
    await bekle(kisit ? 900 : 2500);
    if(i < satirlar.length-1){
      kutu.style.opacity = "0";
      await bekle(kisit ? 200 : 1000);
    }
  }
  $("#hazirim").classList.remove("gizli");
  $("#hazirim").style.opacity = "0";
  $("#hazirim").style.transition = "opacity 1.4s ease";
  setTimeout(()=>{ $("#hazirim").style.opacity = "1"; }, 20);
}

$("#hazirim").addEventListener("click", async ()=>{
  muzigiBaslat();
  $("#ses").classList.add("gorunur");
  await egimIzniIste();
  $("#tuval").classList.add("gorunur","tiklanabilir");
  gecis("av", 800);
  setTimeout(()=>{ durum.avAktif = true; }, 900);
});

/* ---------------------------------------------------------
   EĞİM (telefonu eğme)
--------------------------------------------------------- */
async function egimIzniIste(){
  const dinle = ()=>{
    window.addEventListener("deviceorientation", e=>{
      if(e.gamma===null || e.beta===null) return;
      durum.egimVar = true;
      durum.egim.x = Math.max(-1, Math.min(1, e.gamma/32));
      durum.egim.y = Math.max(-1, Math.min(1, (e.beta-42)/32));
    });
  };
  try{
    if(typeof DeviceOrientationEvent!=="undefined" &&
       typeof DeviceOrientationEvent.requestPermission==="function"){
      const izin = await DeviceOrientationEvent.requestPermission();
      if(izin==="granted") dinle();
    } else if("DeviceOrientationEvent" in window){
      dinle();
    }
  }catch(e){}
  setTimeout(()=>{
    $("#av-ipucu").textContent = durum.egimVar
      ? "telefonu yavaşça eğ · ışığa dokun"
      : "parmağını gezdir · ışığa dokun";
  }, 1200);
}

/* ---------------------------------------------------------
   2 · TUVAL — ateşböcekleri
--------------------------------------------------------- */
const tuval = $("#tuval");
const ctx = tuval.getContext("2d");
let G = {w:0, h:0};

function boyutla(){
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  G.w = window.innerWidth; G.h = window.innerHeight;
  tuval.width = G.w*dpr; tuval.height = G.h*dpr;
  tuval.style.width = G.w+"px"; tuval.style.height = G.h+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
boyutla();
window.addEventListener("resize", boyutla);

const rast = (a,b)=>a + Math.random()*(b-a);

// arka plandaki soluk tozlar
const tozlar = [];
for(let i=0;i<70;i++){
  tozlar.push({
    x: Math.random()*G.w, y: Math.random()*G.h,
    r: rast(.4,1.5), hiz: rast(.02,.14),
    faz: Math.random()*6.28, ton: Math.random()<.25 ? "mavi" : "sari"
  });
}

// yakalanacak ateşböcekleri
const bocekler = (ICERIK.atesbocekleri||[]).map((veri,i)=>({
  veri, i,
  x: rast(G.w*.16, G.w*.84),
  y: rast(G.h*.20, G.h*.78),
  vx: rast(-.25,.25), vy: rast(-.25,.25),
  hedefX:null, hedefY:null,
  r: 3.1, faz: Math.random()*6.28,
  hiz: rast(.6,1.0),
  durum: "serbest",     // serbest | yakalandi | bitti
  parlaklik: 1
}));

let kavanozNokta = {x: G.w/2, y: G.h - 90};
let imlec = {x:-999, y:-999, aktif:false};
tuval.addEventListener("pointermove", e=>{ imlec.x=e.clientX; imlec.y=e.clientY; imlec.aktif=true; });
tuval.addEventListener("pointerleave", ()=>{ imlec.aktif=false; });

tuval.addEventListener("pointerdown", e=>{
  if(!durum.avAktif) return;
  imlec.x=e.clientX; imlec.y=e.clientY; imlec.aktif=true;
  let enYakin=null, enKisa=1e9;
  for(const b of bocekler){
    if(b.durum!=="serbest") continue;
    const d = Math.hypot(b.x-e.clientX, b.y-e.clientY);
    if(d<enKisa){ enKisa=d; enYakin=b; }
  }
  if(enYakin && enKisa < 58) yakala(enYakin);
});

let sonZaman = performance.now();
function cizim(t){
  const dt = Math.min(48, t - sonZaman); sonZaman = t;
  const k = dt/16.7;
  ctx.clearRect(0,0,G.w,G.h);

  // tozlar
  for(const p of tozlar){
    p.y -= p.hiz*k;
    p.x += Math.sin((t/3400)+p.faz)*0.12*k;
    if(p.y < -6){ p.y = G.h+6; p.x = Math.random()*G.w; }
    const par = 0.20 + 0.32*(0.5+0.5*Math.sin(t/900 + p.faz*3));
    ctx.beginPath();
    ctx.fillStyle = p.ton==="mavi"
      ? "rgba(170,200,255,"+par.toFixed(3)+")"
      : "rgba(255,224,170,"+par.toFixed(3)+")";
    ctx.arc(p.x, p.y, p.r, 0, 6.2832);
    ctx.fill();
  }

  // kavanoz konumu (yakalanınca oraya uçarlar)
  const kav = $("#kavanoz").getBoundingClientRect();
  let kx, ky;
  if(kav.width > 0){
    kx = kav.left + kav.width/2; ky = kav.top + kav.height/2;
    kavanozNokta.x = kx; kavanozNokta.y = ky;
  } else {                      // kavanoz sahnesi kapandıysa son bilinen yer
    kx = kavanozNokta.x; ky = kavanozNokta.y;
  }

  for(const b of bocekler){
    if(b.durum==="bitti") continue;

    if(b.durum==="serbest"){
      // kendi başına dolaşma
      b.vx += Math.sin(t/1700 + b.faz)*0.010*k;
      b.vy += Math.cos(t/2100 + b.faz*1.7)*0.010*k;
      // telefon eğimi
      if(durum.egimVar){
        b.vx += durum.egim.x*0.10*k;
        b.vy += durum.egim.y*0.10*k;
      }
      // parmak: hafifçe kaçarlar, yakalaması keyifli olsun
      if(imlec.aktif){
        const dx=b.x-imlec.x, dy=b.y-imlec.y, d=Math.hypot(dx,dy);
        if(d<110 && d>0.1){
          const it = (110-d)/110 * 0.34;
          b.vx += (dx/d)*it*k; b.vy += (dy/d)*it*k;
        }
      }
      b.vx *= 0.975; b.vy *= 0.975;
      const hz = Math.hypot(b.vx,b.vy), maks = 1.35*b.hiz;
      if(hz>maks){ b.vx=b.vx/hz*maks; b.vy=b.vy/hz*maks; }
      b.x += b.vx*k; b.y += b.vy*k;

      // kenarlardan yumuşak dönüş
      const pay = 46;
      if(b.x<pay){ b.x=pay; b.vx=Math.abs(b.vx); }
      if(b.x>G.w-pay){ b.x=G.w-pay; b.vx=-Math.abs(b.vx); }
      if(b.y<pay+56){ b.y=pay+56; b.vy=Math.abs(b.vy); }
      if(b.y>G.h-pay-90){ b.y=G.h-pay-90; b.vy=-Math.abs(b.vy); }

    } else if(b.durum==="yakalandi"){
      b.x += (kx-b.x)*0.055*k;
      b.y += (ky-b.y)*0.055*k;
      b.parlaklik *= Math.pow(0.965,k);
      if(Math.hypot(kx-b.x, ky-b.y) < 10 || b.parlaklik<0.05){ b.durum="bitti"; }
    }

    const nb = 0.62 + 0.38*Math.sin(t/620*b.hiz + b.faz);
    const p  = b.parlaklik*(0.55+0.45*nb);
    const R  = b.r*(0.85+0.3*nb);

    const g = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,R*11);
    g.addColorStop(0,   "rgba(255,246,214,"+(0.95*p).toFixed(3)+")");
    g.addColorStop(0.16,"rgba(255,205,120,"+(0.55*p).toFixed(3)+")");
    g.addColorStop(0.45,"rgba(255,160,60,"+(0.14*p).toFixed(3)+")");
    g.addColorStop(1,   "rgba(255,150,50,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(b.x,b.y,R*11,0,6.2832); ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,252,236,"+p.toFixed(3)+")";
    ctx.arc(b.x,b.y,R*0.85,0,6.2832); ctx.fill();
  }

  requestAnimationFrame(cizim);
}
requestAnimationFrame(cizim);

/* ---------------------------------------------------------
   yakalama + mesaj kartı
--------------------------------------------------------- */
const ROMEN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

function yakala(b){
  b.durum = "yakalandi";
  durum.yakalanan++;
  cin(b.i);
  kavanozuDoldur();
  setTimeout(()=>karti(b), 430);
}

function kavanozuDoldur(){
  const oran = durum.toplam ? durum.yakalanan/durum.toplam : 0;
  $("#dolum").setAttribute("y", (50 - 42*oran).toFixed(2));
  $("#sayac").textContent = durum.yakalanan + " / " + durum.toplam;
}

function karti(b){
  $("#kart-no").textContent     = ROMEN[b.i] || String(b.i+1);
  $("#kart-baslik").textContent = b.veri.baslik || "";
  $("#kart-metin").textContent  = b.veri.metin  || "";
  $("#kart-perde").classList.add("acik");
  durum.avAktif = false;
}

$("#kart-kapat").addEventListener("click", ()=>{
  $("#kart-perde").classList.remove("acik");
  if(durum.yakalanan >= durum.toplam){
    setTimeout(pastayaGec, 700);
  } else {
    durum.avAktif = true;
  }
});

/* ---------------------------------------------------------
   3 · PASTA ve MUMLAR
--------------------------------------------------------- */
let mumSayisi = 0, sonenMum = 0, mikrofonAcik = false;

async function pastayaGec(){
  durum.avAktif = false;
  $("#tuval").classList.remove("tiklanabilir");
  // ekranda kalan ışıklar da kavanoza çekilip sönsün
  for(const b of bocekler){ if(b.durum === "serbest") b.durum = "yakalandi"; }
  gecis("pasta", 900);
  await bekle(1000);

  mumlariKur();
  $("#pasta-davet").textContent = ICERIK.mum.davet;
  $("#pasta-davet").classList.add("gorunur");
  await bekle(2800);
  $("#pasta-davet").classList.remove("gorunur");
  await bekle(1200);
  $("#pasta-davet").textContent = ICERIK.mum.talimat;
  $("#pasta-davet").classList.add("gorunur");
  await bekle(700);
  ufleyiBaslat();
}

function mumlariKur(){
  mumSayisi = Math.max(1, Math.min(40, parseInt(ICERIK.yas,10) || 5));
  const kutu = $("#mumlar");
  kutu.innerHTML = "";
  kutu.style.flexWrap = "nowrap";
  const tamGenislik = Math.min(320, window.innerWidth*0.84);
  const genislik = tamGenislik * 0.74;                 // mumlar kekin ortasında dursun
  const kalinlik = mumSayisi > 18 ? 5 : 6;
  const bosluk = Math.max(1.5, Math.min(11, (genislik - mumSayisi*kalinlik) / Math.max(1,mumSayisi-1)));
  kutu.classList.toggle("sik", mumSayisi > 18);
  kutu.style.gap = bosluk.toFixed(1)+"px";
  for(let i=0;i<mumSayisi;i++){
    const m = document.createElement("div");
    m.className = "mum";
    m.innerHTML = '<div class="alev"></div><div class="govde"></div>';
    m.querySelector(".alev").style.animationDelay = (Math.random()*-1.4).toFixed(2)+"s";
    const boy = mumSayisi > 14 ? 22 : 28;
    m.querySelector(".govde").style.height = (boy + Math.random()*9).toFixed(0)+"px";
    kutu.appendChild(m);
  }
}

async function ufleyiBaslat(){
  const olcer = $("#ufle-olcer i");
  let analiz=null, veri=null, taban=0, akis=null;

  try{
    akis = await navigator.mediaDevices.getUserMedia({
      audio:{ echoCancellation:false, noiseSuppression:false, autoGainControl:false }
    });
    muzigiDurdur(true);                 // mikrofon müziği duymasın
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();
    if(ac.state==="suspended") await ac.resume();
    const kaynak = ac.createMediaStreamSource(akis);
    analiz = ac.createAnalyser();
    analiz.fftSize = 1024; analiz.smoothingTimeConstant = 0.55;
    kaynak.connect(analiz);
    veri = new Uint8Array(analiz.frequencyBinCount);
    mikrofonAcik = true;
    $("#ufle-talimat").textContent = ICERIK.mum.dinliyor || "";
  }catch(e){
    mikrofonAcik = false;
    yedekDugme();
    return;
  }

  // 1.2 sn ortam sesi ölç (eşiği ona göre ayarla)
  const ornek = [];
  const olc = ()=>{
    analiz.getByteFrequencyData(veri);
    let alt=0; for(let i=2;i<15;i++) alt+=veri[i];
    return alt/13;
  };
  const t0 = performance.now();
  while(performance.now()-t0 < 1200){ ornek.push(olc()); await bekle(50); }
  taban = ornek.reduce((a,b)=>a+b,0)/ornek.length;
  const esik = Math.max(30, taban + 26);

  let sonSondurme = 0, hicUflemedi = true;
  const dongu = ()=>{
    if(sonenMum >= mumSayisi) return;
    const seviye = olc();
    const oran = Math.max(0, Math.min(1, (seviye - taban) / (esik - taban + 1)));
    olcer.style.width = (oran*100).toFixed(0)+"%";
    const simdi = performance.now();
    if(seviye > esik && simdi - sonSondurme > 170){
      sonSondurme = simdi; hicUflemedi = false;
      mumSondur();
    }
    requestAnimationFrame(dongu);
  };
  dongu();

  // 9 saniyede üfleyemediyse düğmeyi de göster
  setTimeout(()=>{ if(hicUflemedi && sonenMum===0) yedekDugme(true); }, 9000);
}

function yedekDugme(ekTeklif){
  const d = $("#ufle-dugme");
  $("#ufle-talimat").textContent = ekTeklif
    ? "Sesini duyamıyorum. Düğmeyi basılı tutup üfleyebilirsin."
    : ICERIK.mum.talimatYedek;
  d.classList.remove("gizli");
  let zt=null;
  const bas = e=>{ e.preventDefault(); $("#ufle-olcer i").style.width="100%";
                   zt = setInterval(mumSondur, 190); mumSondur(); };
  const birak = ()=>{ clearInterval(zt); $("#ufle-olcer i").style.width="0%"; };
  d.addEventListener("pointerdown", bas);
  window.addEventListener("pointerup", birak);
  window.addEventListener("pointercancel", birak);
}

function mumSondur(){
  if(sonenMum >= mumSayisi) return;
  const mumlar = $$("#mumlar .mum").filter(m=>!m.classList.contains("sondu"));
  if(!mumlar.length) return;
  const m = mumlar[Math.floor(Math.random()*mumlar.length)];
  m.classList.add("sondu");
  sonenMum++;
  puf();
  if(sonenMum >= mumSayisi) setTimeout(dilekVeMektup, 700);
}

async function dilekVeMektup(){
  document.body.classList.add("karanlik-pasta");
  $("#ufle-alan").style.transition = "opacity .8s"; $("#ufle-alan").style.opacity = "0";
  $("#pasta-davet").classList.remove("gorunur");
  await bekle(1100);
  $("#pasta-davet").textContent = ICERIK.mum.dilek;
  $("#pasta-davet").classList.add("gorunur");
  await bekle(3000);
  $("#pasta-davet").classList.remove("gorunur");
  await bekle(1200);
  mektubuAc();
}

/* ---------------------------------------------------------
   4 · MEKTUP
--------------------------------------------------------- */
function mektubuAc(){
  mektubuDoldur();
  document.body.classList.add("safak");
  gecis("mektup", 900);
  setTimeout(()=>{
    document.body.classList.add("mektup-modu");
    $("#mektup").scrollTop = 0;
    muzigiBaslat();
  }, 1000);

  // paragraflar sırayla belirsin
  setTimeout(()=>{
    $$("#mektup .belir").forEach((el,i)=>{
      setTimeout(()=>{ el.style.opacity="1"; el.style.transform="none"; }, i*420);
    });
  }, 1200);
}

function mektubuDoldur(){
  const m = ICERIK.mektup;
  $("#mektup-baslik").textContent = m.baslik;
  $("#mektup-baslik").classList.add("belir");
  $("#mektup-yas").textContent = ICERIK.isim.toLocaleUpperCase("tr-TR") + " · " + ICERIK.yas;

  const govde = $("#mektup-govde");
  govde.innerHTML = "";
  (m.paragraflar||[]).forEach(p=>{
    const el = document.createElement("p");
    el.textContent = p; el.className = "belir";
    govde.appendChild(el);
  });

  const fk = $("#mektup-fotograflar");
  fk.innerHTML = "";
  (ICERIK.fotograflar||[]).forEach(f=>{
    const d = document.createElement("figure");
    d.className = "polaroid belir" + (f.sigdir ? " sigdir" : "");
    d.innerHTML =
      '<div class="cerceve"><span class="bos">fotoğraf<br>burada</span></div>' +
      '<figcaption class="alt-yazi">'+(f.yazi||"")+'</figcaption>';
    const img = new Image();
    img.onload = ()=>{ const c=d.querySelector(".cerceve"); c.innerHTML=""; c.appendChild(img); };
    img.alt = f.yazi || "";
    img.src = f.dosya;
    fk.appendChild(d);
  });

  const imza = $("#mektup-imza");
  imza.textContent = m.imza || ""; imza.classList.add("belir");

  $("#gunluk-metin").textContent = gununNotu();
  $("#gunluk").classList.add("belir");
  $("#son-baslik").textContent = ICERIK.son.baslik;
  $("#son-metin").textContent  = ICERIK.son.metin;
  $("#son-blok").classList.add("belir");

  $$("#mektup .belir").forEach(el=>{
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 1.3s ease, transform 1.3s cubic-bezier(.2,.9,.25,1)";
  });
}

function gununNotu(){
  const n = ICERIK.gunlukNotlar || [];
  if(!n.length) return "";
  const gun = Math.floor(Date.now()/86400000);
  return n[gun % n.length];
}

$("#bastan").addEventListener("click", ()=>{ location.reload(); });

/* ---------------------------------------------------------
   ANA EKRANA EKLE
--------------------------------------------------------- */
let kurulumOlayi = null;
window.addEventListener("beforeinstallprompt", e=>{
  e.preventDefault(); kurulumOlayi = e;
  $("#kur").classList.remove("gizli");
});
$("#kur").addEventListener("click", async ()=>{
  if(!kurulumOlayi) return;
  kurulumOlayi.prompt();
  await kurulumOlayi.userChoice;
  kurulumOlayi = null;
  $("#kur").classList.add("gizli");
});
(function iosKontrol(){
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const kurulu = window.matchMedia("(display-mode: standalone)").matches ||
                 window.navigator.standalone === true;
  if(ios && !kurulu) $("#ios-yardim").classList.remove("gizli");
})();

/* ---------------------------------------------------------
   SES — arka planda song.mp3 döner, küçük efektler sentezleniyor
--------------------------------------------------------- */
let sesCtx=null, anaGain=null;
const DIZI = [0, 2, 4, 7, 9, 12, 14, 16];   // pentatonik (efektler için)
const KOK = 261.63;                          // Do4
const nota = (yari)=>KOK * Math.pow(2, yari/12);

const sarki = new Audio("song.mp3");
sarki.loop = true;
sarki.preload = "auto";
const SARKI_SES = 0.75;
let solma = null, kullaniciKapatti = false;

// iOS'ta volume salt okunur; orada solma olmadan direkt açılıp kapanır
function sesiKay(hedef, sure, bitince){
  clearInterval(solma);
  const bas = sarki.volume, t0 = performance.now();
  solma = setInterval(()=>{
    const k = Math.min(1, (performance.now()-t0)/sure);
    sarki.volume = bas + (hedef-bas)*k;
    if(k>=1){ clearInterval(solma); solma=null; if(bitince) bitince(); }
  }, 40);
}

function muzigiBaslat(){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!sesCtx){
      sesCtx = new AC();
      anaGain = sesCtx.createGain();
      anaGain.gain.value = 0.085;
      anaGain.connect(sesCtx.destination);
    }
    if(sesCtx.state==="suspended") sesCtx.resume();
  }catch(e){}

  if(kullaniciKapatti) return;          // sesi kendisi kapattıysa zorla açma
  if(durum.ses && !sarki.paused) return;
  if(sarki.paused) sarki.volume = 0;
  sarki.play().then(()=>{
    durum.ses = true;
    $("#ses").classList.add("acik","gorunur");
    sesiKay(SARKI_SES, 1800);
  }).catch(()=>{
    // tarayıcı otomatik oynatmaya izin vermedi: ilk dokunuşta başlasın
    durum.ses = false;
    ilkDokunustaBaslat();
  });
}

function muzigiDurdur(sessiz){
  durum.ses = false;
  $("#ses").classList.remove("acik");
  sesiKay(0, 350, ()=>sarki.pause());
}

let dokunusBekleniyor = false;
function ilkDokunustaBaslat(){
  if(dokunusBekleniyor) return;
  dokunusBekleniyor = true;
  const olaylar = ["pointerup","touchend","click","keydown"];
  const bir = ()=>{
    olaylar.forEach(o=>window.removeEventListener(o, bir, true));
    dokunusBekleniyor = false;
    if(!kullaniciKapatti) muzigiBaslat();
  };
  olaylar.forEach(o=>window.addEventListener(o, bir, true));
}

function cal(frek, ses, sure){
  if(!sesCtx) return;
  const t = sesCtx.currentTime;
  const g = sesCtx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(ses, t+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t+sure);
  const o1 = sesCtx.createOscillator(); o1.type="sine";     o1.frequency.value=frek;
  const o2 = sesCtx.createOscillator(); o2.type="triangle"; o2.frequency.value=frek*2.004;
  const g2 = sesCtx.createGain(); g2.gain.value = 0.22;
  o2.connect(g2); g2.connect(g); o1.connect(g); g.connect(anaGain);
  o1.start(t); o2.start(t); o1.stop(t+sure+0.05); o2.stop(t+sure+0.05);
}

// küçük "cin" sesi — ateşböceği yakalanınca
function cin(i){
  if(!sesCtx || !durum.ses) return;
  cal(nota(DIZI[i % DIZI.length] + 12), 0.16, 1.8);
}
// mum sönme sesi
function puf(){
  if(!sesCtx || !durum.ses) return;
  try{
    const t = sesCtx.currentTime, uz = 0.22;
    const buf = sesCtx.createBuffer(1, sesCtx.sampleRate*uz, sesCtx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/d.length, 2.6);
    const s = sesCtx.createBufferSource(); s.buffer = buf;
    const f = sesCtx.createBiquadFilter(); f.type="bandpass"; f.frequency.value=760; f.Q.value=0.8;
    const g = sesCtx.createGain(); g.gain.value = 0.30;
    s.connect(f); f.connect(g); g.connect(anaGain); s.start(t);
  }catch(e){}
}

$("#ses").addEventListener("click", e=>{
  e.stopPropagation();
  if(durum.ses){ kullaniciKapatti = true; muzigiDurdur(); }
  else { kullaniciKapatti = false; muzigiBaslat(); }
});

/* ---------------------------------------------------------
   BAŞLAT
--------------------------------------------------------- */
saatiKur();
kilidiKur();
kavanozuDoldur();
muzigiBaslat();   // site açılır açılmaz çalsın (engellenirse ilk dokunuşta)

if("serviceWorker" in navigator && location.protocol!=="file:"){
  window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

})();
