import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface SessionData {
  role?: "platform" | "church";
  userId?: string;
  churchId?: string;
  name?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "dev-only-secret-please-change-32chars!!", // 32자 이상
  cookieName: "church_cms_session",
  cookieOptions: {
    secure: false, // 프로토타입: 로컬 http 환경 기준
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
