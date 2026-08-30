// 도메인 타입 정의
// BlockType: "센터(플랫폼) 관리자"가 만들어 등록하는 위젯 카탈로그 항목.
//   - 실제 필드 스키마/렌더러는 코드(src/components/blocks, src/lib/blockSchemas.ts)에 정의되어 있고,
//   - DB에는 카탈로그 메타(이름/설명/활성화 여부)만 저장한다.
// PageBlock: "교회(테넌트) 관리자"가 카탈로그 중에서 선택해 자신의 홈페이지에 배치한 블록 인스턴스.

export type BlockTypeKey =
  | "hero_banner"
  | "youtube_recent"
  | "google_photos_album"
  | "announcements_board"
  | "service_times";

export interface BlockType {
  key: BlockTypeKey;
  name: string;
  description: string;
  active: boolean;
}

export interface Church {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  createdAt: string;
}

export interface ChurchUser {
  id: string;
  churchId: string;
  username: string;
  passwordHash: string;
  name: string;
}

export interface PlatformAdmin {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
}

export interface PageBlock {
  id: string;
  churchId: string;
  typeKey: BlockTypeKey;
  order: number;
  enabled: boolean;
  // 블록 종류별 설정값 (자유 형식 JSON, 각 블록의 스키마에 맞춰 저장)
  config: Record<string, string>;
}

export interface Announcement {
  id: string;
  churchId: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

export interface DB {
  platformAdmins: PlatformAdmin[];
  blockTypes: BlockType[];
  churches: Church[];
  churchUsers: ChurchUser[];
  pageBlocks: PageBlock[];
  announcements: Announcement[];
}
