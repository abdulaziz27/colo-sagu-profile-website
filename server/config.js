import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  // Midtrans Configuration
  midtrans: {
    serverKey:
      process.env.MIDTRANS_SERVER_KEY ||
      "SB-Mid-server-Z3-Zp_tYja3x2e6t4BYPq_gw",
    clientKey:
      process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-yTb4hQknvTM4U0qb",
    merchantId: process.env.MIDTRANS_MERCHANT_ID || "G262060243",
    isProduction: process.env.NODE_ENV === "production",
  },

  // Database Configuration
  database: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "colo_sagu_db",
    port: process.env.MYSQL_PORT || 3306,
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || "development",
  },
};
