-- Seeder untuk kebutuhan CMS Donasi Colo Sagu

-- Tabel users (admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(128) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(128) DEFAULT NULL
);

INSERT INTO `users` (`email`, `password`, `name`) VALUES
('admin@colosagu.org', '$2b$10$Q9Qw1Qw1Qw1Qw1Qw1Qw1QeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1', 'Admin');
-- Password di atas adalah hash bcrypt dari 'admin123' (ganti sesuai kebutuhan)

-- Tabel donation_events
CREATE TABLE IF NOT EXISTS `donation_events` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE
);

INSERT INTO `donation_events` (`name`, `start_date`, `end_date`, `is_active`) VALUES
('Donasi Tahun Baru', '2025-01-01', '2025-12-31', 1);

-- Tabel donations
CREATE TABLE IF NOT EXISTS `donations` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(128) DEFAULT NULL,
  `amount` INT NOT NULL,
  `status` VARCHAR(32) DEFAULT 'pending',
  `snap_token` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `event_id` INT DEFAULT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `donation_events`(`id`)
); 

-- Tabel gallery
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(128) NOT NULL,
  `url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- Tabel videos (Colo Sagu Channel)
CREATE TABLE IF NOT EXISTS `videos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `youtube_url` VARCHAR(500) NOT NULL,
  `thumbnail_url` VARCHAR(500),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data untuk videos
INSERT INTO `videos` (`title`, `description`, `youtube_url`, `thumbnail_url`, `is_featured`) VALUES
('Tutorial Budidaya Sagu Modern', 'Panduan lengkap cara budidaya sagu dengan teknik modern yang ramah lingkungan', 'https://www.youtube.com/watch?v=example1', 'https://img.youtube.com/vi/example1/maxresdefault.jpg', 1),
('Cara Mengolah Sagu Tradisional', 'Teknik tradisional mengolah sagu menjadi makanan bergizi tinggi', 'https://www.youtube.com/watch?v=example2', 'https://img.youtube.com/vi/example2/maxresdefault.jpg', 1),
('Cerita Petani Sagu Papua', 'Kisah inspiratif petani sagu di Papua yang berhasil mengembangkan usaha', 'https://www.youtube.com/watch?v=example3', 'https://img.youtube.com/vi/example3/maxresdefault.jpg', 0),
('Manfaat Sagu untuk Kesehatan', 'Penjelasan lengkap manfaat sagu untuk kesehatan dan nutrisi', 'https://www.youtube.com/watch?v=example4', 'https://img.youtube.com/vi/example4/maxresdefault.jpg', 0);

-- Tabel programs (Aksi Colo Sagu)
CREATE TABLE IF NOT EXISTS `programs` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Aktif',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data untuk programs
INSERT INTO `programs` (`title`, `description`, `icon`, `status`, `is_active`) VALUES
('Program Budidaya Sagu', 'Membantu masyarakat Papua dalam teknik budidaya sagu yang berkelanjutan dan ramah lingkungan', 'Sprout', 'Aktif', 1),
('Edukasi Pangan Lokal', 'Workshop dan pelatihan tentang nilai gizi dan cara pengolahan pangan lokal Papua', 'BookOpen', 'Berkelanjutan', 1),
('Pemberdayaan Komunitas', 'Membentuk kelompok tani dan koperasi untuk memperkuat ekonomi masyarakat lokal', 'Users', 'Ekspansi', 1),
('Konservasi Hutan Sagu', 'Program pelestarian hutan sagu dan ekosistem alam Papua untuk generasi mendatang', 'TreePine', 'Prioritas', 1);

-- Tabel blog_posts (Blog Colo)
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT,
  `author` VARCHAR(100) DEFAULT 'Colo Sagu Team',
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data untuk blog_posts
INSERT INTO `blog_posts` (`title`, `excerpt`, `content`, `author`, `is_published`) VALUES
('Manfaat Sagu untuk Ketahanan Pangan Papua', 'Mengapa sagu menjadi harapan ketahanan pangan berkelanjutan di Papua dan bagaimana implementasinya dalam kehidupan sehari-hari masyarakat lokal.', '<p>Sagu merupakan makanan pokok tradisional masyarakat Papua yang memiliki nilai gizi tinggi dan dapat menjadi solusi ketahanan pangan yang berkelanjutan.</p><p>Artikel ini membahas berbagai manfaat sagu dan cara mengoptimalkannya untuk ketahanan pangan Papua.</p>', 'Colo Sagu Team', 1),
('Cara Tradisional Mengolah Sagu yang Perlu Dilestarikan', 'Kearifan lokal masyarakat Papua dalam mengolah sagu menjadi makanan bergizi tinggi dan teknik tradisional yang perlu dilestarikan untuk generasi mendatang.', '<p>Teknik tradisional mengolah sagu telah diturunkan dari generasi ke generasi di Papua.</p><p>Artikel ini mengulas berbagai cara tradisional mengolah sagu yang kaya akan nilai budaya dan nutrisi.</p>', 'Colo Sagu Team', 1),
('Program Budidaya Sagu: Harapan Ekonomi Masyarakat', 'Bagaimana program budidaya sagu dapat menjadi harapan ekonomi masyarakat Papua dan strategi pengembangannya yang berkelanjutan.', '<p>Program budidaya sagu tidak hanya memberikan manfaat ekonomi bagi masyarakat Papua, tetapi juga membantu melestarikan budaya dan lingkungan.</p><p>Artikel ini membahas strategi pengembangan budidaya sagu yang berkelanjutan.</p>', 'Colo Sagu Team', 1); 