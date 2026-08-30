"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { BlockTypeKey } from "@/lib/types";
import {
  churchUsernameExists,
  createChurchWithAdmin,
  deleteChurch as deleteChurchRow,
  slugExists,
  toggleBlockType as toggleBlockTypeRow,
} from "@/lib/store";

async function requirePlatformSession() {
  const session = await getSession();
  if (session.role !== "platform") {
    redirect("/admin/login");
  }
  return session;
}

export async function createChurchAction(_prev: string | undefined, formData: FormData) {
  await requirePlatformSession();

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const tagline = String(formData.get("tagline") || "").trim();
  const adminUsername = String(formData.get("adminUsername") || "").trim();
  const adminPassword = String(formData.get("adminPassword") || "");
  const adminName = String(formData.get("adminName") || "").trim();

  if (!name || !slug || !adminUsername || !adminPassword) {
    return "필수 항목을 모두 입력해 주세요.";
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return "슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.";
  }

  if (await slugExists(slug)) {
    return "이미 사용 중인 슬러그입니다.";
  }
  if (await churchUsernameExists(adminUsername)) {
    return "이미 사용 중인 관리자 아이디입니다.";
  }

  await createChurchWithAdmin({
    name,
    slug,
    tagline,
    adminUsername,
    adminPasswordHash: bcrypt.hashSync(adminPassword, 10),
    adminName: adminName || `${name} 관리자`,
  });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function toggleBlockTypeAction(formData: FormData) {
  await requirePlatformSession();
  const key = String(formData.get("key")) as BlockTypeKey;
  await toggleBlockTypeRow(key);
  revalidatePath("/admin");
}

export async function deleteChurchAction(formData: FormData) {
  await requirePlatformSession();
  const id = String(formData.get("id"));
  await deleteChurchRow(id);
  revalidatePath("/admin");
}
