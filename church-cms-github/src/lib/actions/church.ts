"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { BLOCK_FIELD_SCHEMAS } from "@/lib/blockSchemas";
import type { BlockTypeKey } from "@/lib/types";
import {
  addAnnouncement,
  addPageBlock,
  deleteAnnouncement,
  deletePageBlock,
  getPageBlock,
  moveBlock,
  toggleBlockEnabled,
  updatePageBlockConfig,
} from "@/lib/store";

async function requireChurchSession() {
  const session = await getSession();
  if (session.role !== "church" || !session.churchId) {
    redirect("/login");
  }
  return session;
}

export async function addBlockAction(formData: FormData) {
  const session = await requireChurchSession();
  const typeKey = String(formData.get("typeKey")) as BlockTypeKey;
  const schema = BLOCK_FIELD_SCHEMAS[typeKey];
  if (!schema) throw new Error("알 수 없는 블록 유형입니다.");

  const config: Record<string, string> = {};
  for (const f of schema) {
    config[f.name] = String(formData.get(f.name) || "");
  }

  await addPageBlock(session.churchId!, typeKey, config);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateBlockAction(formData: FormData) {
  const session = await requireChurchSession();
  const id = String(formData.get("id"));
  const block = await getPageBlock(id, session.churchId!);
  if (!block) throw new Error("블록을 찾을 수 없습니다.");

  const schema = BLOCK_FIELD_SCHEMAS[block.typeKey];
  const config: Record<string, string> = { ...block.config };
  for (const f of schema) {
    config[f.name] = String(formData.get(f.name) || "");
  }
  await updatePageBlockConfig(id, session.churchId!, config);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteBlockAction(formData: FormData) {
  const session = await requireChurchSession();
  const id = String(formData.get("id"));
  await deletePageBlock(id, session.churchId!);
  revalidatePath("/dashboard");
}

export async function toggleBlockAction(formData: FormData) {
  const session = await requireChurchSession();
  const id = String(formData.get("id"));
  await toggleBlockEnabled(id, session.churchId!);
  revalidatePath("/dashboard");
}

export async function moveBlockAction(formData: FormData) {
  const session = await requireChurchSession();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction")) as "up" | "down";
  await moveBlock(id, session.churchId!, direction);
  revalidatePath("/dashboard");
}

export async function addAnnouncementAction(formData: FormData) {
  const session = await requireChurchSession();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const pinned = formData.get("pinned") === "on";
  if (!title) return;

  await addAnnouncement(session.churchId!, title, body, pinned);
  revalidatePath("/dashboard/announcements");
  redirect("/dashboard/announcements");
}

export async function deleteAnnouncementAction(formData: FormData) {
  const session = await requireChurchSession();
  const id = String(formData.get("id"));
  await deleteAnnouncement(id, session.churchId!);
  revalidatePath("/dashboard/announcements");
}
