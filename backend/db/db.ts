import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set in environment variables. Database operations will fail.");
}

export const pool = new pg.Pool({
  connectionString,
  ssl: connectionString?.includes("supabase") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
