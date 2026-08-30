import { Pool } from "pg";

// Vercel Postgres(구 Neon 연동)는 POSTGRES_URL 환경변수를 자동으로 주입합니다.
// 로컬 개발 시에는 .env.local에 POSTGRES_URL=postgres://... 형태로 넣어주세요.
const connectionString =
  process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "POSTGRES_URL(또는 DATABASE_URL) 환경변수가 설정되어 있지 않습니다. .env.local을 확인하세요."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool =
  global.__pgPool ||
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
