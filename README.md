# 🚀 Career AI - Yapay Zeka Destekli Kariyer Asistanı

Modern teknolojiler ve yapay zeka ile güçlendirilmiş, kullanıcıların kariyer gelişimini destekleyen kapsamlı bir web platformu. CV analizi, yapay zeka destekli mülakat simülasyonu ve kişiselleştirilmiş kariyer önerileri sunar.

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [API Endpoints](#-api-endpoints)
- [Lisans](#-lisans)

## 🎯 Proje Hakkında

**Career AI**, iş arayanların ve kariyer gelişimi hedefleyen bireylerin süreçlerini kolaylaştırmak amacıyla geliştirilmiş modern bir web uygulamasıdır. Google Gemini AI teknolojisi ile entegre edilerek, kullanıcılara profesyonel düzeyde geri bildirim ve analiz sağlar.

### Projenin Amacı

- ✅ CV'lerin yapay zeka ile detaylı analiz edilmesi
- ✅ ATS (Applicant Tracking System) uyumluluk kontrolü
- ✅ Gerçekçi mülakat simülasyonları ile pratik imkanı
- ✅ Kişiselleştirilmiş kariyer önerileri
- ✅ Kullanıcı dostu arayüz ve modern tasarım

## ✨ Özellikler

### 📄 CV Analizi
- **Akıllı Döküman İşleme**: PDF ve DOCX formatlarında CV yükleme desteği
- **AI Destekli Analiz**: Google Gemini AI ile detaylı özgeçmiş değerlendirmesi
- **Çok Boyutlu Skorlama**:
  - 📊 **Impact (Etki)**: İş deneyimlerinin ve başarıların somutluğu
  - ✂️ **Brevity (Öz)**: İçeriğin kısalık ve netliği
  - 🤖 **ATS Uyumu**: Başvuru takip sistemlerine uyumluluk
  - ✍️ **Style (Dil & Stil)**: Dil bilgisi, yazım ve profesyonellik
- **Anahtar Kelime Analizi**: Sektörel ve teknik yetkinliklerin tespiti
- **Gelişim Önerileri**: Kişiselleştirilmiş iyileştirme tavsiyeleri
- **Geçmiş Analiz Takibi**: Tüm CV analizlerinin kaydedilmesi ve karşılaştırılması

### 🎤 AI Mülakat Simülasyonu
- **Gerçek Zamanlı Konuşma**: Yapay zeka ile interaktif mülakat deneyimi
- **Pozisyona Özel Sorular**: Hedeflenen role uygun teknik ve davranışsal sorular
- **Akıllı Soru Derinleştirme**: Cevaplarınıza göre detaylandırılan sorular
- **Anlık Geri Bildirim**: Verilen yanıtlara göre profesyonel öneriler
- **Mülakat Geçmişi**: Tüm simülasyonların kaydedilmesi ve incelenmesi

### 📊 Dashboard ve Analytics
- **Aktivite Takibi**: Analiz ve mülakat istatistikleri
- **Görsel Grafikler**: İlerleme ve performans göstergeleri
- **Radar Charts**: Yetenek dağılımı ve gelişim alanları
- **Aktivite Zaman Çizelgesi**: Kronolojik kariyer gelişim takibi
- **Önerilen Aksiyonlar**: Kişiselleştirilmiş bir sonraki adımlar

### 🔐 Kullanıcı Yönetimi
- **Google OAuth Entegrasyonu**: Güvenli ve hızlı giriş
- **Oturum Yönetimi**: NextAuth ile güvenli kimlik doğrulama
- **Profil Yönetimi**: Kişisel bilgilerin güncellenmesi
- **Tema Desteği**: Dark/Light mode seçenekleri

## 🛠 Teknolojiler

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React tabanlı full-stack framework
- **[React 19](https://react.dev/)** - Modern UI kütüphanesi
- **[TypeScript](https://www.typescriptlang.org/)** - Tip güvenli JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Erişilebilir component kütüphanesi
- **[Framer Motion](https://www.framer.com/motion/)** - Animasyon kütüphanesi
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Lucide Icons](https://lucide.dev/)** - Modern icon seti

### Backend
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - İlişkisel veritabanı
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication kütüphanesi
- **[Neon Database](https://neon.tech/)** - Serverless Postgres

### AI & Services
- **[Google Gemini AI](https://deepmind.google/technologies/gemini/)** - Yapay zeka modeli (gemini-2.5-flash)
- **[Zod](https://zod.dev/)** - Schema validation
- **[Mammoth](https://www.npmjs.com/package/mammoth)** - DOCX text extraction
- **[PDF Parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction

## 📦 Kurulum

### Gereksinimler

- **Node.js** 18.x veya üzeri
- **npm** veya **yarn** package manager
- **PostgreSQL** veritabanı (veya Neon gibi cloud servis)
- **Google OAuth Client** credentials
- **Google Gemini API** key

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/kullaniciadi/career-ai.git
cd career-ai
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### Adım 3: Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

#### Ortam Değişkenlerini Alma:

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com/) üzerinden proje oluşturun
2. OAuth 2.0 Client ID oluşturun
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**Gemini API:**
1. [Google AI Studio](https://makersuite.google.com/app/apikey) üzerinden API key alın

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Adım 4: Veritabanını Hazırlayın

```bash
# Prisma migrate
npx prisma migrate dev

# Prisma Client generate
npx prisma generate
```

### Adım 5: Projeyi Çalıştırın

```bash
npm run dev
# veya
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🎮 Kullanım

### 1. Kayıt / Giriş
- Ana sayfada "Google ile Giriş Yap" butonuna tıklayın
- Google hesabınızla kimlik doğrulama yapın

### 2. CV Analizi
- Dashboard'dan "CV Analizi" sayfasına gidin
- PDF veya DOCX formatında CV'nizi yükleyin
- AI analiz sonucunu görüntüleyin
- Skorları ve önerileri inceleyin

### 3. Mülakat Simülasyonu
- "Mülakat" sayfasına gidin
- Pozisyon seçin veya özel pozisyon belirleyin
- AI ile gerçek zamanlı mülakat yapın
- Sorulara yanıt verin ve geri bildirim alın

### 4. Geçmiş ve Raporlar
- "CV Geçmişim" sayfasından tüm analizleri görüntüleyin
- "Mülakat Geçmişim" sayfasından geçmiş simülasyonları inceleyin
- Dashboard'da genel istatistiklerinizi takip edin

## 📁 Proje Yapısı

```
career-ai/
├── app/
│   ├── (dashboard)/          # Dashboard layout grubu
│   │   ├── dashboard/        # Ana panel sayfası
│   │   ├── cv-analysis/      # CV yükleme ve analiz
│   │   ├── interview/        # Mülakat simülasyonu
│   │   ├── me/               # Kullanıcı profil ve geçmiş
│   │   └── settings/         # Ayarlar
│   ├── (site)/               # Landing page layout grubu
│   ├── api/                  # API route handlers
│   │   ├── analyze-cv/       # CV analiz endpoint
│   │   ├── interview/        # Mülakat endpoint
│   │   ├── upload-cv/        # CV upload endpoint
│   │   └── auth/             # NextAuth endpoints
│   ├── components/           # Paylaşılan componentler
│   ├── lib/                  # Utilities ve helpers
│   └── utils/                # Yardımcı fonksiyonlar
├── components/               # Global UI componentleri
│   └── ui/                   # Radix UI wrapper'ları
├── prisma/
│   ├── schema.prisma         # Veritabanı şeması
│   └── migrations/           # Database migrations
├── types/                    # TypeScript type definitions
└── public/                   # Statik dosyalar
```

## 📸 Ekran Görüntüleri

### Landing Page
> Modern ve etkileyici karşılama sayfası

### Dashboard
> Kullanıcı aktiviteleri ve istatistikler

### CV Analiz Sonucu
> Detaylı skorlama ve öneriler

### Mülakat Simülasyonu
> AI ile gerçek zamanlı konuşma

*Not: Ekran görüntüleri projenin canlı versiyonundan alınacaktır.*

## 🔌 API Endpoints

### CV İşlemleri

**POST** `/api/upload-cv`
- CV dosyası yükleme ve text extraction
- Request: `multipart/form-data`
- Response: `{ cvId, rawText, title }`

**POST** `/api/analyze-cv`
- Yüklenmiş CV'nin AI analizi
- Request: `{ cvId, rawText, title }`
- Response: `{ summary, keywords, suggestion, score, details }`

### Mülakat İşlemleri

**POST** `/api/interview`
- Mülakat simülasyonu başlatma/devam ettirme
- Request: `{ position, message, history, start, interviewId }`
- Response: `{ reply, interviewId }`

### Kullanıcı İşlemleri

**GET** `/api/me/history`
- Kullanıcı analiz ve mülakat geçmişi
- Response: `{ analyses, interviews }`

## 🚀 Deploy

### Vercel (Önerilen)

```bash
# Vercel CLI ile
vercel

# Veya GitHub entegrasyonu ile
# 1. GitHub'a push yapın
# 2. Vercel dashboard'dan import edin
# 3. Environment variables ekleyin
```

### Diğer Platformlar
- Railway
- Render
- AWS / Google Cloud
- DigitalOcean

**Not**: PostgreSQL veritabanınızı da deploy etmeyi unutmayın (Neon, Supabase, Railway vb.)

## 🤝 Katkıda Bulunma

Bu proje bir lisans bitirme projesidir. Önerilerinizi issue açarak paylaşabilirsiniz.

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 📧 İletişim

**Geliştirici**: Tunahan Buçak  
**Proje**: Lisans Bitirme Projesi  
**Yıl**: 2025-2026

---

⭐ **Career AI** - Yapay zeka ile geleceğinizi şekillendirin!
