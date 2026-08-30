-- Church CMS 스키마

create table if not exists platform_admins (
  id text primary key,
  username text unique not null,
  password_hash text not null,
  name text not null
);

create table if not exists block_types (
  key text primary key,
  name text not null,
  description text not null,
  active boolean not null default true
);

create table if not exists churches (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text,
  created_at timestamptz not null default now()
);

create table if not exists church_users (
  id text primary key,
  church_id text not null references churches(id) on delete cascade,
  username text unique not null,
  password_hash text not null,
  name text not null
);

create table if not exists page_blocks (
  id text primary key,
  church_id text not null references churches(id) on delete cascade,
  type_key text not null,
  order_num integer not null default 0,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb
);
create index if not exists page_blocks_church_idx on page_blocks(church_id);

create table if not exists announcements (
  id text primary key,
  church_id text not null references churches(id) on delete cascade,
  title text not null,
  body text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists announcements_church_idx on announcements(church_id);
