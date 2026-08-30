// Postgres 스키마 생성 + 샘플 데이터 시드 스크립트
// 사용법: POSTGRES_URL=postgres://... node scripts/setup-db.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString =
  process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error("POSTGRES_URL(또는 DATABASE_URL) 환경변수를 지정해 주세요.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

function newId(prefix) {
  return `${prefix}_${nanoid(10)}`;
}

async function main() {
  const schemaSql = readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  console.log("▶ 스키마 생성 중...");
  await pool.query(schemaSql);

  console.log("▶ 블록 카탈로그 시드 중...");
  const blockTypes = [
    ["hero_banner", "메인 배너", "홈 상단에 노출되는 큰 이미지/문구 배너. 버튼을 외부 링크 또는 공지사항 게시판에 연결할 수 있습니다."],
    ["youtube_recent", "유튜브 최신 영상", "교회 유튜브 채널의 최근 영상을 보여줍니다."],
    ["google_photos_album", "구글 포토 앨범", "공유된 구글 포토 앨범 링크를 교회 사진첩처럼 보여줍니다."],
    ["announcements_board", "공지사항 게시판", "교회 공지사항 목록을 보여줍니다."],
    ["service_times", "예배시간 안내", "예배 종류별 시간을 안내합니다."],
  ];
  for (const [key, name, description] of blockTypes) {
    await pool.query(
      `insert into block_types (key, name, description, active) values ($1,$2,$3,true)
       on conflict (key) do nothing`,
      [key, name, description]
    );
  }

  console.log("▶ 센터 관리자 계정 시드 중...");
  await pool.query(
    `insert into platform_admins (id, username, password_hash, name) values ($1,$2,$3,$4)
     on conflict (username) do nothing`,
    ["admin_1", "admin", bcrypt.hashSync("admin1234", 10), "센터 관리자"]
  );

  const existingChurch = await pool.query(`select id from churches where slug = 'grace'`);
  if (existingChurch.rows.length === 0) {
    console.log("▶ 샘플 교회(은혜교회) 시드 중...");
    const churchId = newId("church");
    await pool.query(
      `insert into churches (id, slug, name, tagline) values ($1,$2,$3,$4)`,
      [churchId, "grace", "은혜교회", "함께 예배하고, 함께 성장합니다"]
    );
    await pool.query(
      `insert into church_users (id, church_id, username, password_hash, name) values ($1,$2,$3,$4,$5)`,
      [newId("user"), churchId, "pastor", bcrypt.hashSync("pastor1234", 10), "은혜교회 관리자"]
    );

    const blocks = [
      [
        "hero_banner",
        0,
        {
          title: "은혜교회에 오신 것을 환영합니다",
          subtitle: "매주 주일 오전 11시, 함께 예배드려요",
          imageUrl: "",
          buttonText: "공지사항 보기",
          linkType: "announcement_board",
          linkUrl: "",
        },
      ],
      [
        "service_times",
        1,
        {
          title: "예배 안내",
          lines:
            "주일 1부 예배|오전 9:00\n주일 2부 예배|오전 11:00\n수요 기도회|저녁 7:30\n금요 청년예배|저녁 8:00",
        },
      ],
      ["announcements_board", 2, { title: "공지사항", itemCount: "5" }],
      [
        "youtube_recent",
        3,
        { title: "최근 설교 영상", channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw", videoCount: "3" },
      ],
      [
        "google_photos_album",
        4,
        { title: "교회 사진첩", albumUrl: "https://photos.app.goo.gl/exampleAlbumShareLink" },
      ],
    ];
    for (const [typeKey, order, config] of blocks) {
      await pool.query(
        `insert into page_blocks (id, church_id, type_key, order_num, enabled, config)
         values ($1,$2,$3,$4,true,$5)`,
        [newId("block"), churchId, typeKey, order, JSON.stringify(config)]
      );
    }

    await pool.query(
      `insert into announcements (id, church_id, title, body, pinned) values ($1,$2,$3,$4,$5)`,
      [newId("ann"), churchId, "가을 전도축제 안내", "10월 넷째 주 주일, 가을 전도축제가 있습니다. 많은 초청 부탁드립니다.", true]
    );
    await pool.query(
      `insert into announcements (id, church_id, title, body, pinned) values ($1,$2,$3,$4,$5)`,
      [newId("ann"), churchId, "주차장 공사 안내", "이번 주 토요일부터 주차장 보수 공사가 진행됩니다. 이용에 참고 부탁드립니다.", false]
    );
  } else {
    console.log("▶ 샘플 교회가 이미 존재하여 건너뜁니다.");
  }

  console.log("✅ 완료되었습니다.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
