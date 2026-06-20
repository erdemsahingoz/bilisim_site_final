-- ============================================================
-- BİLİŞİM MAĞAZASI — PostgreSQL Veritabanı Şeması
-- Dosya: SourceCode/database/schema.sql
--
-- Çalıştırma:
--   psql -U postgres -d bilisim_db -f schema.sql
--
-- Tablolar:
--   users, products, orders, order_items, reviews, questions
-- ============================================================

-- Veritabanını sıfırdan oluşturmak isterseniz (isteğe bağlı):
-- DROP DATABASE IF EXISTS bilisim_db;
-- CREATE DATABASE bilisim_db ENCODING 'UTF8';

-- ──────────────────────────────────────────────────
-- 1) USERS TABLOSU
--    Firebase Authentication ile senkronize çalışır.
--    uid: Firebase'den gelen benzersiz kullanıcı kimliği
--    role: 'USER' veya 'ADMIN'
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL    PRIMARY KEY,               -- Otomatik artan PK
    uid          VARCHAR(128) NOT NULL UNIQUE,           -- Firebase Auth UID (benzersiz)
    email        VARCHAR(255) NOT NULL UNIQUE,           -- Kullanıcı e-posta adresi
    display_name VARCHAR(255),                           -- Görünen ad (opsiyonel)
    role         VARCHAR(20)  NOT NULL DEFAULT 'USER',   -- 'USER' veya 'ADMIN'
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()     -- Kayıt tarihi
);

-- ──────────────────────────────────────────────────
-- 2) PRODUCTS TABLOSU
--    Mağazadaki tüm ürünlerin bilgilerini tutar.
--    image_path: /images/ssd.png gibi public klasörü yolu
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id           BIGSERIAL      PRIMARY KEY,             -- Otomatik artan PK
    name         VARCHAR(255)   NOT NULL,                -- Ürün adı
    description  TEXT           NOT NULL,                -- Kısa açıklama (kartlarda)
    details      TEXT,                                   -- Teknik özellikler (detay sayfasında)
    price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),  -- Fiyat (ondalıklı)
    stock        INT            NOT NULL DEFAULT 0 CHECK (stock >= 0), -- Stok adedi
    image_path   VARCHAR(500),                           -- Resim yolu (/images/ssd.png)
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW()   -- Ürün eklenme tarihi
);

-- ──────────────────────────────────────────────────
-- 3) ORDERS TABLOSU
--    Kullanıcıların verdiği siparişleri tutar.
--    stripe_payment_intent_id: Stripe'dan dönen intent ID
--    status: 'PENDING', 'PAID', 'CANCELLED'
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id                       BIGSERIAL      PRIMARY KEY,
    user_id                  BIGINT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price              NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    stripe_payment_intent_id VARCHAR(255),               -- Stripe'dan dönen pi_xxx ID
    status                   VARCHAR(20)    NOT NULL DEFAULT 'PENDING', -- PENDING / PAID / CANCELLED
    created_at               TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 4) ORDER_ITEMS TABLOSU
--    Her siparişin içindeki ürün kalemlerini tutar.
--    Bir sipariş birden fazla ürün içerebilir (OneToMany).
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGSERIAL      PRIMARY KEY,
    order_id    BIGINT         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,   -- Ait olduğu sipariş
    product_id  BIGINT         NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Satın alınan ürün
    quantity    INT            NOT NULL DEFAULT 1 CHECK (quantity > 0),            -- Adet
    unit_price  NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)                    -- Sipariş anındaki fiyat
);

-- ──────────────────────────────────────────────────
-- 5) REVIEWS TABLOSU
--    Kullanıcıların ürünlere yaptığı yıldızlı yorumlar.
--    rating: 1-5 arası tam sayı
--    Bir kullanıcı bir ürüne yalnızca 1 yorum yapabilir (UNIQUE kısıtı).
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id          BIGSERIAL  PRIMARY KEY,
    user_id     BIGINT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- Yorum yapan kullanıcı
    product_id  BIGINT     NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- Yorumlanan ürün
    rating      INT        NOT NULL CHECK (rating BETWEEN 1 AND 5),            -- 1-5 yıldız
    comment     TEXT,                                                           -- Yorum metni (opsiyonel)
    created_at  TIMESTAMP  NOT NULL DEFAULT NOW(),                             -- Yorum tarihi

    -- Bir kullanıcı aynı ürüne yalnızca 1 yorum yapabilir
    UNIQUE (user_id, product_id)
);

-- ──────────────────────────────────────────────────
-- 6) QUESTIONS TABLOSU
--    Kullanıcıların ürünler hakkında sorduğu sorular
--    ve adminlerin verdiği cevaplar.
--    answered_by: Cevap veren admin kullanıcısının ID'si
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
    id              BIGSERIAL  PRIMARY KEY,
    user_id         BIGINT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- Soran kullanıcı
    product_id      BIGINT     NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- Soru ürünü
    question_text   TEXT       NOT NULL,                                            -- Soru içeriği
    answer_text     TEXT,                                                           -- Admin cevabı (NULL ise cevaplanmamış)
    answered_by     BIGINT     REFERENCES users(id) ON DELETE SET NULL,            -- Cevap veren admin
    created_at      TIMESTAMP  NOT NULL DEFAULT NOW(),                             -- Soru tarihi
    answered_at     TIMESTAMP                                                       -- Cevaplanma tarihi
);

-- ──────────────────────────────────────────────────
-- İNDEKSLER — Sık sorgulanan alanlara index eklenerek
-- veritabanı sorgu performansı artırılır.
-- ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user_id       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id   ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_questions_product_id ON questions(product_id);
CREATE INDEX IF NOT EXISTS idx_users_uid            ON users(uid);
