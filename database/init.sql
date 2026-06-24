-- =============================================================
--  E-Commerce Platform — Database Initialisation Script
--  Runs automatically when PostgreSQL container first starts
-- =============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)        NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255)        NOT NULL,
    created_at    TIMESTAMP           DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2)  NOT NULL,
    stock       INTEGER         NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP       DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER        NOT NULL REFERENCES users(id),
    total      DECIMAL(10, 2) NOT NULL,
    status     VARCHAR(50)    NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP      DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER        NOT NULL REFERENCES products(id),
    quantity   INTEGER        NOT NULL,
    price      DECIMAL(10, 2) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);

-- =============================================================
--  Seed Data — Sample Products
-- =============================================================
INSERT INTO products (name, description, price, stock) VALUES
    ('Wireless Noise-Cancelling Headphones', 'Premium over-ear headphones with 40-hour battery life and active noise cancellation.', 89.99, 45),
    ('Mechanical Gaming Keyboard', 'TKL mechanical keyboard with RGB backlight, tactile switches, and USB-C connectivity.', 129.99, 30),
    ('Ergonomic Gaming Mouse', '16000 DPI optical sensor, 7 programmable buttons, and lightweight honeycomb shell.', 59.99, 60),
    ('27" 4K IPS Monitor', 'Ultra-sharp 4K display with 99% sRGB, HDR400, and 75Hz refresh rate.', 399.99, 15),
    ('USB-C 7-in-1 Hub', 'Expands your laptop with HDMI 4K, 3x USB-A, SD card reader, PD charging port.', 49.99, 80),
    ('1080p HD Webcam', 'Crystal-clear 1080p webcam with built-in stereo microphone and auto light correction.', 79.99, 40),
    ('NVMe SSD 1TB', 'PCIe 4.0 NVMe SSD delivering up to 7000 MB/s read speeds.', 89.99, 25),
    ('Smart Bluetooth Speaker', 'Room-filling 360° sound with built-in voice assistant and 12-hour battery.', 39.99, 70),
    ('Laptop Stand Aluminium', 'Adjustable aluminium stand compatible with all laptops 10"–17". Improves posture.', 34.99, 100),
    ('Portable Charger 20000mAh', 'Dual USB-A + USB-C power bank with 65W PD fast charging. Charges laptops.', 54.99, 55)
ON CONFLICT DO NOTHING;
