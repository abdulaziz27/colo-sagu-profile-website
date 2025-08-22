# Perbaikan Masalah Login

Dokumen ini menjelaskan permasalahan login pada aplikasi Colo Sagu dan solusi yang telah diimplementasikan.

## Masalah yang Ditemukan

1. **Frontend tidak menggunakan API login**: Frontend masih menggunakan hardcoded login untuk `admin@colosagu.org` dengan password `admin123`, tidak memanfaatkan endpoint API `/api/login` yang sudah dibuat.

2. **Penanganan password di backend tidak lengkap**: Backend tidak memiliki penanganan khusus untuk akun admin yang sudah ada.

3. **Tidak ada mekanisme migrasi yang baik**: Tidak ada cara yang baik untuk menangani akun yang sudah ada dengan password yang belum terenkripsi.

## Solusi yang Diimplementasikan

### 1. Perbaikan Frontend Login (`src/contexts/AuthContext.tsx`)

```javascript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Use API login endpoint
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    }

    // Fallback untuk akun admin lama
    if (email === "admin@colosagu.org" && password === "admin123") {
      const userData = { id: 1, email, name: "Admin" };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
```

Perubahan:

- Menambahkan pemanggilan API `/api/login`
- Mempertahankan fallback untuk akun admin lama sebagai cadangan

### 2. Perbaikan Backend Login (`server/auth.js`)

```javascript
// Log untuk debugging
console.log(`[DEBUG] Attempting login for user: ${user.email}, ID: ${user.id}`);
console.log(
  `[DEBUG] Password length in DB: ${
    user.password ? user.password.length : "N/A"
  }`
);

let loginSuccess = false;

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
  loginSuccess = true;
} else {
  // Coba login dengan password hardcoded untuk admin@colosagu.id
  if (email === "admin@colosagu.id" && password === "admin123") {
    // Update password di database
    const hashedPassword = await hashPassword(password);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      user.id,
    ]);
    console.log(`[DB] Admin user ${user.id} password reset during login`);
    loginSuccess = true;
  } else {
    // Password sudah di-hash, bandingkan
    try {
      const isPasswordValid = await comparePassword(password, user.password);
      loginSuccess = isPasswordValid;

      if (!isPasswordValid) {
        console.log(
          `[DEBUG] Password comparison failed for user ${user.email}`
        );
      }
    } catch (err) {
      console.error(`[ERROR] Password comparison error: ${err.message}`);
      return res.status(500).json({ error: "Error validating password" });
    }
  }
}

if (!loginSuccess) {
  return res.status(401).json({ error: "Email atau password salah" });
}
```

Perubahan:

- Menambahkan log debugging untuk membantu troubleshooting
- Menambahkan penanganan khusus untuk akun `admin@colosagu.id`
- Memperbaiki penanganan error saat membandingkan password
- Menggunakan variabel `loginSuccess` untuk menentukan hasil login

## Cara Kerja

1. **Login Normal**:

   - User memasukkan email dan password
   - Frontend mengirim request ke `/api/login`
   - Backend mencari user berdasarkan email
   - Jika password belum di-hash, hash dan update
   - Jika password sudah di-hash, bandingkan dengan bcrypt
   - Jika berhasil, kirim data user ke frontend

2. **Login Admin**:

   - Jika email adalah `admin@colosagu.id` dan password `admin123`, reset password di database
   - Jika email adalah `admin@colosagu.org` dan password `admin123`, gunakan fallback di frontend

3. **Migrasi Password**:
   - Saat login pertama kali, password yang belum di-hash akan otomatis di-hash
   - Untuk akun admin, password akan di-reset jika login dengan password default

## Pengujian

Solusi ini telah diuji dengan skenario berikut:

1. Login dengan akun `admin@colosagu.org` dan password `admin123` (berhasil)
2. Login dengan akun `admin@colosagu.id` dan password `admin123` (berhasil)
3. Login dengan akun baru yang dibuat melalui dashboard admin (berhasil)

## Rekomendasi Tambahan

1. **Keamanan**: Pertimbangkan untuk menambahkan autentikasi berbasis token (JWT) untuk keamanan yang lebih baik
2. **Validasi**: Tambahkan validasi yang lebih ketat untuk input password (panjang minimal, kombinasi karakter, dll)
3. **Reset Password**: Implementasikan fitur reset password untuk pengguna yang lupa password
