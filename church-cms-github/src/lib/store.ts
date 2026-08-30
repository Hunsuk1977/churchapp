import { nanoid } from "nanoid";
import { pool, query, queryOne } from "./db";
import type {
  Announcement,
  BlockType,
  BlockTypeKey,
  Church,
  ChurchUser,
  PageBlock,
  PlatformAdmin,
} from "./types";

export function newId(prefix: string) {
  return `${prefix}_${nanoid(10)}`;
}

// ---- Row -> 도메인 타입 매핑 ----

interface ChurchRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  created_at: Date;
}
function mapChurch(r: ChurchRow): Church {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? undefined,
    createdAt: r.created_at.toISOString(),
  };
}

interface PageBlockRow {
  id: string;
  church_id: string;
  type_key: BlockTypeKey;
  order_num: number;
  enabled: boolean;
  config: Record<string, string>;
}
function mapPageBlock(r: PageBlockRow): PageBlock {
  return {
    id: r.id,
    churchId: r.church_id,
    typeKey: r.type_key,
    order: r.order_num,
    enabled: r.enabled,
    config: r.config ?? {},
  };
}

interface AnnouncementRow {
  id: string;
  church_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: Date;
}
function mapAnnouncement(r: AnnouncementRow): Announcement {
  return {
    id: r.id,
    churchId: r.church_id,
    title: r.title,
    body: r.body,
    pinned: r.pinned,
    createdAt: r.created_at.toISOString(),
  };
}

// ---- Platform admins ----

export async function getPlatformAdminByUsername(username: string): Promise<PlatformAdmin | null> {
  return queryOne<PlatformAdmin>(
    `select id, username, password_hash as "passwordHash", name from platform_admins where username = $1`,
    [username]
  );
}

// ---- Block types (센터가 관리하는 카탈로그) ----

export async function listBlockTypes(): Promise<BlockType[]> {
  return query<BlockType>(`select key, name, description, active from block_types order by key`);
}

export async function toggleBlockType(key: string) {
  await query(`update block_types set active = not active where key = $1`, [key]);
}

// ---- Churches ----

export async function listChurches(): Promise<Church[]> {
  const rows = await query<ChurchRow>(`select * from churches order by created_at asc`);
  return rows.map(mapChurch);
}

export async function getChurchBySlug(slug: string): Promise<Church | null> {
  const row = await queryOne<ChurchRow>(`select * from churches where slug = $1`, [slug]);
  return row ? mapChurch(row) : null;
}

export async function getChurchById(id: string): Promise<Church | null> {
  const row = await queryOne<ChurchRow>(`select * from churches where id = $1`, [id]);
  return row ? mapChurch(row) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const row = await queryOne(`select 1 from churches where slug = $1`, [slug]);
  return !!row;
}

export async function churchUsernameExists(username: string): Promise<boolean> {
  const row = await queryOne(`select 1 from church_users where username = $1`, [username]);
  return !!row;
}

export async function createChurchWithAdmin(input: {
  name: string;
  slug: string;
  tagline?: string;
  adminUsername: string;
  adminPasswordHash: string;
  adminName: string;
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const churchId = newId("church");
    await client.query(
      `insert into churches (id, slug, name, tagline) values ($1,$2,$3,$4)`,
      [churchId, input.slug, input.name, input.tagline || null]
    );
    await client.query(
      `insert into church_users (id, church_id, username, password_hash, name) values ($1,$2,$3,$4,$5)`,
      [newId("user"), churchId, input.adminUsername, input.adminPasswordHash, input.adminName]
    );
    await client.query("COMMIT");
    return churchId;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteChurch(id: string) {
  // church_users / page_blocks / announcements 는 FK ON DELETE CASCADE로 함께 삭제됨
  await query(`delete from churches where id = $1`, [id]);
}

export async function getChurchAdminUsername(churchId: string): Promise<string | null> {
  const row = await queryOne<{ username: string }>(
    `select username from church_users where church_id = $1 limit 1`,
    [churchId]
  );
  return row?.username ?? null;
}

// ---- Church users (교회 관리자 계정) ----

export async function getChurchUserByUsername(username: string): Promise<ChurchUser | null> {
  return queryOne<ChurchUser>(
    `select id, church_id as "churchId", username, password_hash as "passwordHash", name
     from church_users where username = $1`,
    [username]
  );
}

// ---- Page blocks (교회가 배치한 블록 인스턴스) ----

export async function listPageBlocks(churchId: string): Promise<PageBlock[]> {
  const rows = await query<PageBlockRow>(
    `select * from page_blocks where church_id = $1 order by order_num asc`,
    [churchId]
  );
  return rows.map(mapPageBlock);
}

export async function getPageBlock(id: string, churchId: string): Promise<PageBlock | null> {
  const row = await queryOne<PageBlockRow>(
    `select * from page_blocks where id = $1 and church_id = $2`,
    [id, churchId]
  );
  return row ? mapPageBlock(row) : null;
}

export async function addPageBlock(
  churchId: string,
  typeKey: BlockTypeKey,
  config: Record<string, string>
) {
  const countRow = await queryOne<{ count: string }>(
    `select count(*)::text as count from page_blocks where church_id = $1`,
    [churchId]
  );
  const order = Number(countRow?.count ?? 0);
  await query(
    `insert into page_blocks (id, church_id, type_key, order_num, enabled, config)
     values ($1,$2,$3,$4,true,$5)`,
    [newId("block"), churchId, typeKey, order, JSON.stringify(config)]
  );
}

export async function updatePageBlockConfig(
  id: string,
  churchId: string,
  config: Record<string, string>
) {
  await query(`update page_blocks set config = $1 where id = $2 and church_id = $3`, [
    JSON.stringify(config),
    id,
    churchId,
  ]);
}

export async function deletePageBlock(id: string, churchId: string) {
  await query(`delete from page_blocks where id = $1 and church_id = $2`, [id, churchId]);
}

export async function toggleBlockEnabled(id: string, churchId: string) {
  await query(
    `update page_blocks set enabled = not enabled where id = $1 and church_id = $2`,
    [id, churchId]
  );
}

export async function moveBlock(id: string, churchId: string, direction: "up" | "down") {
  const blocks = await listPageBlocks(churchId);
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= blocks.length) return;

  const a = blocks[idx];
  const b = blocks[swapWith];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`update page_blocks set order_num = $1 where id = $2`, [b.order, a.id]);
    await client.query(`update page_blocks set order_num = $1 where id = $2`, [a.order, b.id]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// ---- Announcements ----

export async function listAnnouncements(churchId: string): Promise<Announcement[]> {
  const rows = await query<AnnouncementRow>(
    `select * from announcements where church_id = $1 order by pinned desc, created_at desc`,
    [churchId]
  );
  return rows.map(mapAnnouncement);
}

export async function addAnnouncement(
  churchId: string,
  title: string,
  body: string,
  pinned: boolean
) {
  await query(
    `insert into announcements (id, church_id, title, body, pinned) values ($1,$2,$3,$4,$5)`,
    [newId("ann"), churchId, title, body, pinned]
  );
}

export async function deleteAnnouncement(id: string, churchId: string) {
  await query(`delete from announcements where id = $1 and church_id = $2`, [id, churchId]);
}
