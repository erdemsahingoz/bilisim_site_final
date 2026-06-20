# ⚡ Bilişim Mağazası — Full-Stack E-Ticaret Projesi

> **Teknoloji Yığını:** React 18 + MUI v5 | Spring Boot 3 | PostgreSQL 15 | Firebase Auth | Stripe

---

## 📁 Klasör Yapısı

```
SourceCode/
├── frontend/        → React uygulaması (localhost:3000)
├── backend/         → Spring Boot REST API (localhost:8080)
└── database/        → PostgreSQL şema ve seed SQL dosyaları
```

---

## 🗄️ 1. Veritabanı Kurulumu (PostgreSQL)

### Gereksinimler
- PostgreSQL 13 veya üzeri kurulu ve çalışıyor olmalı.

### Adımlar

```bash
# PostgreSQL'e postgres kullanıcısıyla bağlan
psql -U postgres

# Veritabanını oluştur
CREATE DATABASE bilisim_db ENCODING 'UTF8';

# Çık
\q

# Şemayı uygula (tablolar oluşturulur)
psql -U postgres -d bilisim_db -f database/schema.sql

# Örnek verileri yükle (ürünler + admin kullanıcısı)
psql -U postgres -d bilisim_db -f database/seed.sql
```

> **Not:** PostgreSQL şifreniz `postgres` değilse `backend/src/main/resources/application.yml` dosyasındaki
> `spring.datasource.password` değerini kendi şifrenizle güncelleyin.

---

## 🖥️ 2. Backend Başlatma (Spring Boot)

### Gereksinimler
- Java 21 (LTS) kurulu olmalı
- Maven 3.8+ kurulu olmalı veya `./mvnw` wrapper kullanılabilir

### Ortam Değişkenleri (İsteğe bağlı)

Stripe gerçek ödeme kullanmak için:
```bash
set STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx   # Windows
export STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx  # macOS/Linux
```

Firebase gerçek auth kullanmak için:
- `backend/src/main/resources/firebase-service-account.json` dosyasını oluşturun
  (Firebase Console → Proje Ayarları → Hizmet Hesapları → JSON indir)

### Çalıştırma

```bash
cd backend

# Maven ile çalıştır
mvn spring-boot:run

# veya Maven Wrapper ile (Maven kurulu değilse)
./mvnw spring-boot:run     # macOS/Linux
mvnw.cmd spring-boot:run   # Windows
```

✅ Backend `http://localhost:8080` adresinde çalışmaya başlayacak.

### Önemli API Uç Noktaları

| Method | URL | Açıklama | Yetki |
|--------|-----|----------|-------|
| GET | `/api/products` | Tüm ürünleri listele | Herkese açık |
| GET | `/api/products/{id}` | Ürün detayı | Herkese açık |
| POST | `/api/products` | Yeni ürün ekle | ADMIN |
| PATCH | `/api/products/{id}/stock` | Stok güncelle | ADMIN |
| GET | `/api/reviews/product/{id}` | Ürün yorumları | Herkese açık |
| POST | `/api/reviews` | Yorum gönder | USER/ADMIN |
| GET | `/api/questions/product/{id}` | Ürün soruları | Herkese açık |
| POST | `/api/questions` | Soru sor | USER/ADMIN |
| PATCH | `/api/questions/{id}/answer` | Soruyu yanıtla | ADMIN |
| GET | `/api/orders/my` | Sipariş geçmişi | USER/ADMIN |
| POST | `/api/orders` | Sipariş oluştur | USER/ADMIN |
| POST | `/api/payments/create-intent` | Stripe PaymentIntent | USER/ADMIN |
| POST | `/api/auth/register` | Kullanıcı kayıt/sync | Herkese açık |

---

## 🌐 3. Frontend Başlatma (React)

### Gereksinimler
- Node.js 18 veya üzeri kurulu olmalı

### .env Dosyası Ayarları

`frontend/.env` dosyası zaten hazırlanmış durumda.
Backend URL varsayılan olarak `http://localhost:8080` ayarlı.

**Firebase kullanmak isterseniz** (isteğe bağlı):
```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=proje-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=proje-id
REACT_APP_FIREBASE_STORAGE_BUCKET=proje-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Stripe kullanmak isterseniz** (isteğe bağlı):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

> Boş bırakılırsa uygulama **Demo/Mock modunda** çalışır (Firebase ve Stripe olmadan).

### Çalıştırma

```bash
cd frontend

# Bağımlılıkları yükle (ilk defa çalıştırırken)
npm install

# Geliştirme sunucusunu başlat
npm start
```

✅ Frontend `http://localhost:3000` adresinde açılacak.

---

## 🔐 4. Giriş Yapma

### Demo Mod (Firebase olmadan)

Login sayfasında iki hızlı giriş butonu var:

| Buton | Rol | Kullanım |
|-------|-----|----------|
| **Müşteri Girişi** | USER | Ürün satın alma, yorum/soru gönderme, sipariş geçmişi |
| **Yönetici Girişi** | ADMIN | Tüm USER yetkileri + ürün ekleme, stok güncelleme, soruları yanıtlama |

### Firebase Mod

`.env` dosyasına Firebase anahtarlarını ekledikten sonra gerçek e-posta/şifre ile kayıt olup giriş yapabilirsiniz.

> **Admin yapmak için:** `admin` kelimesini içeren bir e-posta (örn. `admin@test.com`) kullanın.
> Firebase token doğrulaması sırasında bu kural otomatik uygulanır.

---

## 💳 5. Ödeme Sistemi (Stripe)

### Demo Mod (Stripe olmadan)

`.env` dosyasında `REACT_APP_STRIPE_PUBLISHABLE_KEY` boş bırakılırsa, ödeme formunda simüle mod devreye girer.
Herhangi bir kart bilgisi girebilirsiniz (örn. `4242 4242 4242 4242`), ödeme başarılı sayılır.

### Gerçek Stripe

1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys
2. `pk_test_xxx` → frontend `.env`
3. `sk_test_xxx` → backend `STRIPE_SECRET_KEY` ortam değişkeni

---

## 🏗️ 6. Proje Mimarisi

```
Backend Katmanlar:
  controller/   → HTTP isteklerini karşılar, DTO ile veri alır/verir
  service/      → İş mantığı burada bulunur
  repository/   → JPA arayüzleri, veritabanı sorguları
  entity/       → JPA varlıkları (DB tabloları ile eşleşir)
  dto/          → Request/Response veri transfer nesneleri
  security/     → FirebaseTokenFilter, SecurityUser, SecurityConfig
  exception/    → GlobalExceptionHandler, özel exception sınıfları
  config/       → FirebaseConfig, SecurityConfig

Frontend Sayfalar:
  /             → Home.js          (ürün listeleme grid'i)
  /products/:id → ProductDetail.js (detay + yorum + soru)
  /login        → Login.js         (Firebase + Demo giriş)
  /register     → Register.js      (Firebase kayıt)
  /checkout     → Checkout.js      (Stripe ödeme formu)
  /orders       → OrderHistory.js  (sipariş geçmişi)
  /admin        → AdminPanel.js    (sadece ADMIN)

Frontend Bileşenler:
  Header.js           → Sepet badge, kullanıcı menüsü
  ProductCard.js      → Ürün listesi kartı
  ReviewList.js       → Yorum listesi
  ReviewForm.js       → Yorum gönderme formu (1-5 yıldız)
  QuestionList.js     → Soru-cevap listesi
  QuestionForm.js     → Soru gönderme formu
  StripePaymentForm.js → Kart ödeme formu (gerçek + mock)
  OrderCard.js        → Sipariş detay kartı
  RequireAuth.js      → Kimlik doğrulama koruyucusu
  RequireAdmin.js     → Yönetici rolü koruyucusu
```

---

## ⚠️ Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| `ECONNREFUSED localhost:8080` | Backend çalışmıyor — `mvn spring-boot:run` ile başlatın |
| `Unable to locate PostgreSQL` | PostgreSQL servisi çalışmıyor — başlatın |
| `Schema validation failed` | `schema.sql` çalıştırılmamış — veritabanı adımlarını tekrarlayın |
| `Firebase config missing` | Normal — uygulama Demo modunda çalışır, `.env`'e key ekleyip `npm start` ile yeniden başlatın |
| `Stripe key missing` | Normal — Simüle ödeme modu devreye girer |

---

## 📋 Özellikler Özeti

| Özellik | Backend | Frontend |
|---------|---------|----------|
| Ürün Listeleme | ✅ `GET /api/products` | ✅ Home.js |
| Ürün Detayı | ✅ `GET /api/products/{id}` | ✅ ProductDetail.js |
| Firebase / Mock Kimlik Doğrulama | ✅ FirebaseTokenFilter | ✅ AuthContext.js |
| Kullanıcı Kayıt | ✅ `POST /api/auth/register` | ✅ Register.js |
| Rol Tabanlı Yetkilendirme | ✅ SecurityConfig + @PreAuthorize | ✅ RequireAuth / RequireAdmin |
| Yıldızlı Yorum Sistemi | ✅ Review Entity + Controller | ✅ ReviewForm + ReviewList |
| Soru-Cevap Sistemi | ✅ Question Entity + Controller | ✅ QuestionForm + QuestionList |
| Stripe Ödeme | ✅ StripeService + PaymentController | ✅ StripePaymentForm.js |
| Sipariş Oluşturma | ✅ OrderService (stok düşme) | ✅ Checkout.js |
| Sipariş Geçmişi | ✅ `GET /api/orders/my` | ✅ OrderHistory.js |
| Sepet (LocalStorage) | — | ✅ CartContext.js |
| Admin Paneli | ✅ Tüm admin endpointleri | ✅ AdminPanel.js (3 sekme) |
| CORS Desteği | ✅ SecurityConfig | — |
| Global Hata Yönetimi | ✅ GlobalExceptionHandler | — |
