# Reel2gether
Kendi **reel havuzundan** rastgele içerik çekip arkadaşlarla **senkron** şekilde izleme odaları kurabileceğin, sohbet (chat) destekli, hafif ve hızlı bir web uygulaması.

**Demo:** https://reel2gether.vercel.app  
**Repo:** https://github.com/lumiboi/Reel-2-gether

---

##  Özellikler
- **Rastgele Reel**: Uygulamanın reel havuzundan tek tıkla rastgele içerik başlatma.
- **Senkron Oynatma**: Oda içindeki tüm kullanıcılar için play/pause/seek hareketleri eşzamanlıdır.
- **Oda Sistemi**: Oda oluşturma, odaya kod/link ile katılma.
- **Sohbet (Chat)**: Oda içi gerçek zamanlı mesajlaşma.
- **Host Kontrolleri**: Oda sahibine özel yönetim (oynat, durdur, atla vb.).
- **Mobil Uyum**: Telefon, tablet ve masaüstünde akıcı deneyim.

> Not: Özelliklerin bir kısmı geliştirme aşamasında olabilir. Aşağıdaki Yol Haritası bölümüne göz atın.

---

## Teknolojiler
- **Next.js + TypeScript** – modern, hızlı, App Router yapısı  
- **Tailwind CSS** – komponentleri hızlıca stillendirmek için  
- **Gerçek Zamanlı** – (örnek) Firebase/Firestore veya WebSocket tabanlı senkronizasyon
- **İsteğe Bağlı Yardımcı Scriptler** – repo’da yer alan Python betikleri (örn. indirme/işleme iş akışları)

> Projede `firebase.json`, `tailwind.config.mjs`, `eslint.config.mjs`, `tsconfig.json` gibi dosyalar bulunduğundan, geliştirme ortamında bu araçlar hazırdır.

---

##  Başlangıç
### 1) Kurulum
```bash
# projeyi klonla
git clone https://github.com/lumiboi/Reel-2-gether.git
cd Reel-2-gether

# bağımlılıkları yükle
npm install
# veya: yarn / pnpm / bun
```

### 2) Ortam Değişkenleri
Yerelde çalıştırmadan önce `.env.local` dosyası oluşturun. Aşağıdaki anahtarlar, **örnek** bir Firebase kurulumu içindir; kendi anahtarlarınızı ekleyin. Firebase kullanılmıyorsa bu kısmı atlayabilirsiniz.
```bash
# Firebase (örnek)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Senkron/Socket URL (kullanıyorsanız)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3) Geliştirme Sunucusu
```bash
npm run dev
# veya: yarn dev / pnpm dev / bun dev
```
Tarayıcıdan `http://localhost:3000` adresine gidin.

---

##  Kullanım
1. "Oda oluştur" ile yeni bir oda açın.  
2. Odadaki davet linkini veya kodu arkadaşlarınızla paylaşın.  
3. "Rastgele reel" butonuyla havuzdan içerik çekin.  
4. Oynatma/durdurma/ilerletme gibi kontroller tüm katılımcılara senkron uygulanır.  
5. Chat panelinden yazışın.

---

##  Proje Yapısı (özet)
```
Reel-2-gether/
├─ public/                # statik dosyalar
├─ src/                   # Next.js uygulama kaynak kodu
│  ├─ app/                # (App Router) sayfalar, layout, route handlers
│  ├─ components/         # UI bileşenleri
│  ├─ lib/                # yardımcı fonksiyonlar (api/client vb.)
│  └─ styles/             # global stiller
├─ main.py                # opsiyonel python yardımcı betik(ler)
├─ firebase.json          # Firebase yapılandırması (kullanılıyorsa)
├─ tailwind.config.mjs    # Tailwind ayarları
├─ eslint.config.mjs      # ESLint ayarları
├─ tsconfig.json          # TypeScript ayarları
└─ next.config.ts         # Next.js ayarları
```
> Dizinler göstermek amaçlıdır; isimler ve yerleşim değişebilir.

---

## Mimarî Notları
- **Senkronizasyon**: Tek doğruluk kaynağı (host veya sunucu) üzerinden oynatma durumunu yayınlayın.  
- **Oda Durumu**: Oda kimliği (roomId), odaya katılan kullanıcılar, oynatma zamanı/durumu, aktif reel kimliği.  
- **Dayanıklılık**: Oda durumu kalıcı bir store’a (Firestore/Redis) yazılabilir; kullanıcı ayrılıp dönse dahi kaldığı yerden devam.  
- **İzinler**: Host dışındaki kullanıcıların seek/pause yetkisi opsiyoneldir; ayarlar odada tutulur.  
- **Video Sunumu**: Reel linkleri HLS/mp4 olabilir; cross-origin ve autoplay politikalarına dikkat edin.

---

##  Telif & İçerik
- Reel havuzuna eklenen videoların paylaşım ve kullanım koşulları içerik sahiplerine aittir.  
- Sadece **izinli** ve **uygun lisanslı** içerikleri havuza ekleyin.  
- Kullanıcı gizliliği ve KVKK/GDPR gereklilikleri için açık ve erişilebilir bir gizlilik politikası sağlayın.

---

## Komutlar
```bash
# geliştirme
npm run dev

# üretim derlemesi
npm run build
npm start

# lint
npm run lint
```

---

## Yol Haritası
- [ ] Oda ayarları: sadece host kontrolü / ortak kontrol modu  
- [ ] Emoji tepkileri ve izleme sırasına ekleme (queue)  
- [ ] Oda geçmişi ve yeniden oynat  
- [ ] Daha zengin moderasyon (kick/ban, oda şifresi)  
- [ ] Reaksiyon animasyonları ve küçük efektler  
- [ ] Basit yetkilendirme (örn. Firebase Auth veya magic link)  
- [ ] Testler (unit/e2e) ve CI

---

## Katkı
Issue açabilir, PR gönderebilirsiniz. Kod stili için ESLint kuralları ve TypeScript tiplerini takip edin.

---

## Teşekkürler
Bu projeye ilham veren açık kaynak kütüphaneler ve topluluklara teşekkürler.

