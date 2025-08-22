import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import midtransClient from "midtrans-client";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import { createUserHandler, updateUserHandler, loginHandler } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.server.port;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://31.97.187.17",
      "https://31.97.187.17",
      "https://colosagu.id",
      "https://www.colosagu.id",
      "http://colosagu.id",
      "http://www.colosagu.id",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Static file serving for frontend build
app.use(express.static(path.join(process.cwd(), "dist")));

// Static file serving for persistent upload directories
app.use("/gallery", express.static("/srv/data/colosagu/gallery"));
app.use("/blog-images", express.static("/srv/data/colosagu/blog-images"));
app.use(
  "/lovable-uploads",
  express.static("/srv/data/colosagu/lovable-uploads")
);

// Database connection
const db = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
  clientKey: config.midtrans.clientKey,
});

// Multer setup for gallery uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tentukan folder tujuan berdasarkan rute
    let uploadPath = "/srv/data/colosagu/gallery";
    if (req.originalUrl.includes("/blog-images")) {
      uploadPath = "/srv/data/colosagu/blog-images";
    } else if (req.originalUrl.includes("/lovable-uploads")) {
      uploadPath = "/srv/data/colosagu/lovable-uploads";
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});
// Hapus batasan ukuran dan tipe file
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (batas ukuran file)
  },
  fileFilter: (req, file, cb) => {
    // Terima semua tipe file
    if (true) {
      // Terima semua tipe file
      cb(null, true);
    } else {
      cb(new Error("File tidak valid"), false); // Tidak akan pernah dipanggil karena semua file diterima
    }
  },
});

// Upload endpoint for gallery
app.post("/api/gallery/upload", upload.single("image"), (req, res) => {
  console.log("[POST] /api/gallery/upload", req.file);
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return relative URL for frontend
  const url = "/gallery/" + req.file.filename;
  console.log("[UPLOAD] File saved:", url);
  res.json({ url });
});

// Upload endpoint for blog images
app.post("/api/blog-images/upload", upload.single("image"), (req, res) => {
  console.log("[POST] /api/blog-images/upload", req.file);
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return relative URL for frontend
  const url = "/blog-images/" + req.file.filename;
  console.log("[UPLOAD] Blog image saved:", url);
  // Tambahkan informasi ukuran file dalam respons
  const fileSize = req.file.size;
  const fileType = req.file.mimetype;
  res.json({
    url,
    fileSize,
    fileType,
    success: true,
  });
});

// Endpoint: Get active donation event
app.get("/api/active-event", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM donation_events WHERE is_active = 1 AND CURDATE() BETWEEN start_date AND end_date LIMIT 1"
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "No active event" });
    res.json(rows[0]);
  } catch (err) {
    console.error("[DB] Error fetching active event:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint: Create donation & get Snap token (now with event_id)
app.post("/api/donate", async (req, res) => {
  console.log("[POST] /api/donate", req.body);
  try {
    const { name, amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount required" });

    // Cari event aktif
    const [eventRows] = await db.query(
      "SELECT * FROM donation_events WHERE is_active = 1 AND CURDATE() BETWEEN start_date AND end_date LIMIT 1"
    );
    if (eventRows.length === 0)
      return res.status(400).json({ error: "Tidak ada event donasi aktif" });
    const event = eventRows[0];

    // Create transaction details
    const orderId = "order-" + Date.now();
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: "DONATION",
          price: amount,
          quantity: 1,
          name: "Donasi Sagu",
        },
      ],
      customer_details: {
        first_name: name || "Donatur",
      },
      callbacks: {
        finish: `https://colosagu.id/donate?status=success&order_id=${orderId}`,
        unfinish: `https://colosagu.id/donate?status=pending&order_id=${orderId}`,
        error: `https://colosagu.id/donate?status=error&order_id=${orderId}`,
      },
    };

    let transaction, snapToken;
    try {
      transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
      console.log("[MIDTRANS] Transaction created successfully:", snapToken);
      console.log("[MIDTRANS] Full transaction response:", transaction);
      console.log("[MIDTRANS] Using order_id:", orderId);
    } catch (err) {
      console.error(
        "[MIDTRANS] Error creating transaction:",
        err.message,
        err.response?.data || err
      );
      return res.status(500).json({
        error: "Gagal membuat transaksi Midtrans",
        detail: err.message,
      });
    }

    try {
      // Insert dengan status 'pending' - menunggu konfirmasi pembayaran
      await db.query(
        "INSERT INTO donations (order_id, name, amount, status, snap_token, event_id) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, name || "Donatur", amount, "pending", snapToken, event.id]
      );
      console.log("[DB] Donation inserted with status 'pending'");

      // Return response dengan snapToken dan orderId
      res.json({ snapToken, orderId });
    } catch (err) {
      console.error("[DB] Error inserting donation:", err.message, err);
      return res.status(500).json({
        error: "Gagal menyimpan donasi ke database",
        detail: err.message,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint: List donations
app.get("/api/donations", async (req, res) => {
  console.log("[GET] /api/donations");
  const [rows] = await db.query(`
    SELECT 
      d.*,
      e.name as event_name
    FROM donations d
    LEFT JOIN donation_events e ON d.event_id = e.id
    ORDER BY d.created_at DESC
  `);
  res.json(rows);
});

// Endpoint: Total donations for active event
app.get("/api/total-donations", async (req, res) => {
  console.log("[GET] /api/total-donations");
  // Cari event aktif
  const [eventRows] = await db.query(
    "SELECT * FROM donation_events WHERE is_active = 1 AND CURDATE() BETWEEN start_date AND end_date LIMIT 1"
  );
  if (eventRows.length === 0) return res.json({ total: 0 });
  const event = eventRows[0];
  const [rows] = await db.query(
    'SELECT SUM(amount) as total FROM donations WHERE status = "settlement" AND event_id = ?',
    [event.id]
  );
  res.json({ total: rows[0].total || 0 });
});

// Webhook endpoint (Midtrans callback)
app.post("/api/midtrans-callback", async (req, res) => {
  console.log("[POST] /api/midtrans-callback", req.body);
  try {
    const { order_id, transaction_status } = req.body;
    if (!order_id) return res.status(400).json({ error: "order_id required" });

    console.log(
      `[MIDTRANS CALLBACK] Order ${order_id} status: ${transaction_status}`
    );

    // Check current status in database
    const [currentDonation] = await db.query(
      "SELECT status FROM donations WHERE order_id = ?",
      [order_id]
    );

    if (currentDonation.length === 0) {
      console.log(
        `[MIDTRANS CALLBACK] Order ${order_id} not found in database`
      );
      return res.status(404).json({ error: "Order not found" });
    }

    const currentStatus = currentDonation[0].status;
    console.log(
      `[MIDTRANS CALLBACK] Current status in DB: ${currentStatus}, Midtrans status: ${transaction_status}`
    );

    // Only update if status is different
    if (currentStatus !== transaction_status) {
      if (transaction_status == "settlement") {
        await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
          "settlement",
          order_id,
        ]);
        console.log(
          `[MIDTRANS CALLBACK] Order ${order_id} status updated to settlement (BERHASIL)`
        );
      } else if (
        transaction_status == "cancel" ||
        transaction_status == "deny" ||
        transaction_status == "expire"
      ) {
        await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
          "failed",
          order_id,
        ]);
        console.log(
          `[MIDTRANS CALLBACK] Order ${order_id} status updated to failed`
        );
      } else {
        // For other statuses like pending, capture, etc.
        await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
          transaction_status,
          order_id,
        ]);
        console.log(
          `[MIDTRANS CALLBACK] Order ${order_id} status updated to ${transaction_status}`
        );
      }
    } else {
      console.log(
        `[MIDTRANS CALLBACK] Order ${order_id} status unchanged (${currentStatus})`
      );
    }

    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("[MIDTRANS CALLBACK] Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// USERS CRUD
app.get("/api/users", async (req, res) => {
  console.log("[GET] /api/users");
  try {
    const [rows] = await db.query("SELECT id, email, name FROM users");
    console.log("[DB] Users data:", rows);
    res.json(rows);
  } catch (err) {
    console.error("[DB] Error fetching users:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create user with password encryption
app.post("/api/users", (req, res) => createUserHandler(req, res, db));
// Update user with password encryption
app.put("/api/users/:id", (req, res) => updateUserHandler(req, res, db));
app.delete("/api/users/:id", async (req, res) => {
  console.log("[DELETE] /api/users/" + req.params.id);
  try {
    await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
    console.log("[DB] User deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error deleting user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// EVENTS CRUD
app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donation_events");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/events", async (req, res) => {
  const { name, start_date, end_date, is_active } = req.body;
  if (!name || !start_date || !end_date)
    return res.status(400).json({ error: "Data required" });
  try {
    await db.query(
      "INSERT INTO donation_events (name, start_date, end_date, is_active) VALUES (?, ?, ?, ?)",
      [name, start_date, end_date, !!is_active]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/api/events/:id", async (req, res) => {
  const { name, start_date, end_date, is_active } = req.body;
  try {
    await db.query(
      "UPDATE donation_events SET name=?, start_date=?, end_date=?, is_active=? WHERE id=?",
      [name, start_date, end_date, !!is_active, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/events/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM donation_events WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GALLERY CRUD
app.get("/api/gallery", async (req, res) => {
  console.log("[GET] /api/gallery");
  try {
    const [rows] = await db.query("SELECT * FROM gallery");
    console.log("[DB] Gallery data:", rows);
    res.json(rows);
  } catch (err) {
    console.error("[DB] Error fetching gallery:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/gallery", async (req, res) => {
  console.log("[POST] /api/gallery", req.body);
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Data required" });
  try {
    await db.query("INSERT INTO gallery (title, url) VALUES (?, ?)", [
      title,
      url,
    ]);
    console.log("[DB] Gallery created successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error creating gallery:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/api/gallery/:id", async (req, res) => {
  console.log("[PUT] /api/gallery/" + req.params.id, req.body);
  const { title, url } = req.body;
  try {
    await db.query("UPDATE gallery SET title=?, url=? WHERE id=?", [
      title,
      url,
      req.params.id,
    ]);
    console.log("[DB] Gallery updated successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error updating gallery:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/gallery/:id", async (req, res) => {
  console.log("[DELETE] /api/gallery/" + req.params.id);
  try {
    await db.query("DELETE FROM gallery WHERE id=?", [req.params.id]);
    console.log("[DB] Gallery deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error deleting gallery:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// VIDEOS CRUD
app.get("/api/videos", async (req, res) => {
  console.log("[GET] /api/videos");
  try {
    const [rows] = await db.query(
      "SELECT * FROM videos ORDER BY created_at DESC"
    );
    console.log("[DB] Videos data:", rows);
    res.json(rows);
  } catch (err) {
    console.error("[DB] Error fetching videos:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/videos", async (req, res) => {
  console.log("[POST] /api/videos", req.body);
  const { title, description, youtube_url, thumbnail_url, is_featured } =
    req.body;
  if (!title || !youtube_url)
    return res.status(400).json({ error: "Title and YouTube URL required" });
  try {
    await db.query(
      "INSERT INTO videos (title, description, youtube_url, thumbnail_url, is_featured) VALUES (?, ?, ?, ?, ?)",
      [title, description, youtube_url, thumbnail_url, !!is_featured]
    );
    console.log("[DB] Video created successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error creating video:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/videos/:id", async (req, res) => {
  console.log("[PUT] /api/videos/" + req.params.id, req.body);
  const { title, description, youtube_url, thumbnail_url, is_featured } =
    req.body;
  try {
    await db.query(
      "UPDATE videos SET title=?, description=?, youtube_url=?, thumbnail_url=?, is_featured=? WHERE id=?",
      [
        title,
        description,
        youtube_url,
        thumbnail_url,
        !!is_featured,
        req.params.id,
      ]
    );
    console.log("[DB] Video updated successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error updating video:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/videos/:id", async (req, res) => {
  console.log("[DELETE] /api/videos/" + req.params.id);
  try {
    await db.query("DELETE FROM videos WHERE id=?", [req.params.id]);
    console.log("[DB] Video deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error deleting video:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PROGRAMS CRUD
app.get("/api/programs", async (req, res) => {
  console.log("[GET] /api/programs");
  try {
    const [rows] = await db.query(
      "SELECT * FROM programs ORDER BY created_at DESC"
    );
    console.log("[DB] Programs data:", rows);
    res.json(rows);
  } catch (err) {
    console.error("[DB] Error fetching programs:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/programs", async (req, res) => {
  console.log("[POST] /api/programs", req.body);
  const { title, description, icon, status, is_active } = req.body;
  if (!title || !description || !icon)
    return res
      .status(400)
      .json({ error: "Title, description, and icon required" });
  try {
    await db.query(
      "INSERT INTO programs (title, description, icon, status, is_active) VALUES (?, ?, ?, ?, ?)",
      [title, description, icon, status || "Aktif", !!is_active]
    );
    console.log("[DB] Program created successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error creating program:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/programs/:id", async (req, res) => {
  console.log("[PUT] /api/programs/" + req.params.id, req.body);
  const { title, description, icon, status, is_active } = req.body;
  try {
    await db.query(
      "UPDATE programs SET title=?, description=?, icon=?, status=?, is_active=? WHERE id=?",
      [title, description, icon, status, !!is_active, req.params.id]
    );
    console.log("[DB] Program updated successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error updating program:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/programs/:id", async (req, res) => {
  console.log("[DELETE] /api/programs/" + req.params.id);
  try {
    await db.query("DELETE FROM programs WHERE id=?", [req.params.id]);
    console.log("[DB] Program deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error deleting program:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// BLOG POSTS CRUD
app.get("/api/blog-posts", async (req, res) => {
  console.log("[GET] /api/blog-posts");
  try {
    const [rows] = await db.query(
      "SELECT * FROM blog_posts ORDER BY created_at DESC"
    );
    console.log("[DB] Blog posts data:", rows);
    res.json(rows);
  } catch (err) {
    console.error("[DB] Error fetching blog posts:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/blog-posts", async (req, res) => {
  console.log("[POST] /api/blog-posts", req.body);
  const { title, excerpt, content, author, is_published } = req.body;
  if (!title || !excerpt)
    return res.status(400).json({ error: "Title and excerpt required" });
  try {
    await db.query(
      "INSERT INTO blog_posts (title, excerpt, content, author, is_published) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        excerpt,
        content || "",
        author || "Colo Sagu Team",
        !!is_published,
      ]
    );
    console.log("[DB] Blog post created successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error creating blog post:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/blog-posts/:id", async (req, res) => {
  console.log("[PUT] /api/blog-posts/" + req.params.id, req.body);
  const { title, excerpt, content, author, is_published } = req.body;
  try {
    await db.query(
      "UPDATE blog_posts SET title=?, excerpt=?, content=?, author=?, is_published=? WHERE id=?",
      [
        title,
        excerpt,
        content || "",
        author || "Colo Sagu Team",
        !!is_published,
        req.params.id,
      ]
    );
    console.log("[DB] Blog post updated successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error updating blog post:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/blog-posts/:id", async (req, res) => {
  console.log("[DELETE] /api/blog-posts/" + req.params.id);
  try {
    await db.query("DELETE FROM blog_posts WHERE id=?", [req.params.id]);
    console.log("[DB] Blog post deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error("[DB] Error deleting blog post:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint: Update transaction status (manual or from Midtrans)
app.post("/api/check-transaction", async (req, res) => {
  console.log("[POST] /api/check-transaction", req.body);
  try {
    const { order_id, manual_status } = req.body;
    if (!order_id) return res.status(400).json({ error: "order_id required" });

    let finalStatus = manual_status;

    // If manual status not provided, check with Midtrans
    if (!manual_status) {
      try {
        const transaction = await snap.transaction.status(order_id);
        console.log("[MIDTRANS] Transaction status:", transaction);
        finalStatus = transaction.transaction_status;
      } catch (midtransError) {
        console.error(
          "[MIDTRANS] Error checking status:",
          midtransError.message
        );
        return res
          .status(500)
          .json({ error: "Failed to check Midtrans status" });
      }
    }

    // Update database status
    console.log(`[DB] Updating ${order_id} to status: ${finalStatus}`);

    if (finalStatus === "settlement") {
      await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
        "settlement",
        order_id,
      ]);
      console.log(`[DB] Order ${order_id} status updated to settlement`);
    } else if (
      finalStatus === "failed" ||
      finalStatus === "cancel" ||
      finalStatus === "deny" ||
      finalStatus === "expire"
    ) {
      await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
        "failed",
        order_id,
      ]);
      console.log(`[DB] Order ${order_id} status updated to failed`);
    } else {
      await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
        finalStatus,
        order_id,
      ]);
      console.log(`[DB] Order ${order_id} status updated to ${finalStatus}`);
    }

    res.json({
      status: finalStatus,
      message: "Transaction status updated",
    });
  } catch (err) {
    console.error("[CHECK TRANSACTION] Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint: Auto-check transaction status (called from frontend after Snap)
app.get("/api/donation-status/:order_id", async (req, res) => {
  console.log("[GET] /api/donation-status/" + req.params.order_id);
  try {
    const { order_id } = req.params;

    // First check current status in database
    const [currentDonation] = await db.query(
      "SELECT status FROM donations WHERE order_id = ?",
      [order_id]
    );

    if (currentDonation.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const currentStatus = currentDonation[0].status;
    console.log(`[DB] Current status for ${order_id}: ${currentStatus}`);

    // If still pending, check with Midtrans
    if (currentStatus === "pending") {
      try {
        const transaction = await snap.transaction.status(order_id);
        const transactionStatus = transaction.transaction_status;
        console.log(`[MIDTRANS] Status from Midtrans: ${transactionStatus}`);

        // Update database if status changed
        if (transactionStatus !== currentStatus) {
          if (transactionStatus === "settlement") {
            await db.query(
              "UPDATE donations SET status = ? WHERE order_id = ?",
              ["settlement", order_id]
            );
            console.log(`[DB] Order ${order_id} status updated to settlement`);
          } else if (
            transactionStatus === "cancel" ||
            transactionStatus === "deny" ||
            transactionStatus === "expire"
          ) {
            await db.query(
              "UPDATE donations SET status = ? WHERE order_id = ?",
              ["failed", order_id]
            );
            console.log(`[DB] Order ${order_id} status updated to failed`);
          } else {
            await db.query(
              "UPDATE donations SET status = ? WHERE order_id = ?",
              [transactionStatus, order_id]
            );
            console.log(
              `[DB] Order ${order_id} status updated to ${transactionStatus}`
            );
          }

          return res.json({
            status: transactionStatus,
            updated: true,
            message: "Status updated from Midtrans",
          });
        }
      } catch (midtransError) {
        console.error(
          "[MIDTRANS] Error checking status:",
          midtransError.message
        );
        // Return current status if Midtrans check fails
        return res.json({
          status: currentStatus,
          updated: false,
          message: "Could not check Midtrans status",
        });
      }
    }

    // Return current status
    res.json({
      status: currentStatus,
      updated: false,
      message: "Status unchanged",
    });
  } catch (err) {
    console.error("[DONATION STATUS] Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// Login endpoint
app.post("/api/login", (req, res) => loginHandler(req, res, db));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
