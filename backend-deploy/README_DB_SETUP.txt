-- Buat tabel donations di database MySQL kamu

CREATE TABLE `donations` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(128) DEFAULT NULL,
  `amount` INT NOT NULL,
  `status` VARCHAR(32) DEFAULT 'pending',
  `snap_token` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);