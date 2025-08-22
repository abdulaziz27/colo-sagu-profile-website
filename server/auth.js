import bcrypt from "bcryptjs";

/**
 * Hash password menggunakan bcrypt
 * @param {string} password - Password yang akan di-hash
 * @returns {Promise<string>} Password yang sudah di-hash
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Membandingkan password dengan hash
 * @param {string} password - Password yang akan dibandingkan
 * @param {string} hashedPassword - Password hash dari database
 * @returns {Promise<boolean>} True jika password cocok
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Handler untuk endpoint login
 */
export const loginHandler = async (req, res, db) => {
  console.log("[POST] /api/login", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password diperlukan" });
  }

  try {
    // Cari user berdasarkan email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const user = users[0];

    // Log untuk debugging
    console.log(
      `[DEBUG] Attempting login for user: ${user.email}, ID: ${user.id}`
    );
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
          const isPasswordValid = await comparePassword(
            password,
            user.password
          );
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

    // Jangan kirim password ke client
    delete user.password;

    // Login berhasil
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("[DB] Error during login:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handler untuk endpoint create user
 */
export const createUserHandler = async (req, res, db) => {
  console.log("[POST] /api/users", req.body);
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  try {
    // Hash password sebelum menyimpan ke database
    const hashedPassword = await hashPassword(password);

    await db.query(
      "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
      [email, name, hashedPassword]
    );

    console.log("[DB] User created successfully with hashed password");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error creating user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handler untuk endpoint update user
 */
export const updateUserHandler = async (req, res, db) => {
  console.log("[PUT] /api/users/" + req.params.id, req.body);
  const { email, name, password } = req.body;

  try {
    if (password) {
      // Hash password baru jika ada
      const hashedPassword = await hashPassword(password);

      await db.query(
        "UPDATE users SET email=?, name=?, password=? WHERE id=?",
        [email, name, hashedPassword, req.params.id]
      );
    } else {
      await db.query("UPDATE users SET email=?, name=? WHERE id=?", [
        email,
        name,
        req.params.id,
      ]);
    }

    console.log("[DB] User updated successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error updating user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
