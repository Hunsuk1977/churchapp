"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getPlatformAdminByUsername, getChurchUserByUsername } from "@/lib/store";
import { getSession } from "@/lib/session";

export async function loginPlatformAction(_prev: string | undefined, formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const admin = await getPlatformAdminByUsername(username);
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  }

  const session = await getSession();
  session.role = "platform";
  session.userId = admin.id;
  session.name = admin.name;
  await session.save();
  redirect("/admin");
}

export async function loginChurchAction(_prev: string | undefined, formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await getChurchUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  }

  const session = await getSession();
  session.role = "church";
  session.userId = user.id;
  session.churchId = user.churchId;
  session.name = user.name;
  await session.save();
  redirect("/dashboard");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
