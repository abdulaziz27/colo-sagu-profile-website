# Autentikasi dan Enkripsi Password

Dokumen ini menjelaskan implementasi autentikasi dan enkripsi password pada aplikasi Colo Sagu.

## Masalah yang Diperbaiki

1. **Password Tidak Terenkripsi**: Sebelumnya, password disimpan dalam bentuk plaintext di database, yang merupakan risiko keamanan.
2. **Proses Login Tidak Berfungsi**: Tidak ada endpoint login yang memverifikasi kredensial pengguna.

## Solusi yang Diimplementasikan

### 1. Enkripsi Password

Menggunakan library `bcryptjs` untuk mengenkripsi password:

```javascript
import bcrypt from "bcryptjs";

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

### 2. Endpoint Login

Menambahkan endpoint `/api/login` untuk autentikasi pengguna:

```javascript
app.post("/api/login", (req, res) => loginHandler(req, res, db));
```

### 3. Migrasi Password Lama

Menambahkan mekanisme untuk otomatis mengenkripsi password lama saat pengguna login:

```javascript
// Cek apakah password belum di-hash (migrasi)
if (user.password === password) {
  // Password belum di-hash, hash dan update
  const hashedPassword = await hashPassword(password);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    user.id,
  ]);
  user.password = hashedPassword;
  console.log(`[DB] User ${user.id} password hashed during login`);
}
```

### 4. Update Endpoint User

Memperbarui endpoint untuk membuat dan mengupdate user agar menggunakan enkripsi password:

```javascript
// Create user with password encryption
app.post("/api/users", (req, res) => createUserHandler(req, res, db));

// Update user with password encryption
app.put("/api/users/:id", (req, res) => updateUserHandler(req, res, db));
```

## Cara Kerja

1. **Pembuatan User Baru**: Password dienkripsi sebelum disimpan ke database
2. **Update User**: Jika password diubah, password baru dienkripsi sebelum disimpan
3. **Login**: Password yang diinput dibandingkan dengan hash yang tersimpan di database
4. **Migrasi**: Password lama yang belum terenkripsi akan otomatis dienkripsi saat login

## Keamanan

- Menggunakan algoritma bcrypt yang aman dan tahan terhadap serangan brute force
- Salt otomatis ditambahkan ke setiap password
- Password asli tidak pernah disimpan atau dikirim kembali ke client

## Penggunaan

### Login

```javascript
fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "password123" }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      // Login berhasil, data.user berisi informasi user
    } else {
      // Login gagal
    }
  });
```

### Membuat User

```javascript
fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "newuser@example.com",
    name: "New User",
    password: "password123",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      // User berhasil dibuat
    }
  });
```
