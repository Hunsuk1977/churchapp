import type { BlockTypeKey } from "./types";

export type FieldType = "text" | "textarea" | "url" | "select" | "lines";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

// 블록 종류별로 "교회 관리자"가 채워 넣을 수 있는 설정 필드.
// 실제 컴포넌트/필드 구조는 센터(개발팀)가 정의하고, 교회는 값만 입력한다.
export const BLOCK_FIELD_SCHEMAS: Record<BlockTypeKey, FieldDef[]> = {
  hero_banner: [
    { name: "title", label: "제목", type: "text", required: true },
    { name: "subtitle", label: "부제목", type: "text" },
    { name: "imageUrl", label: "배경 이미지 URL", type: "url", help: "비워두면 기본 배경색이 사용됩니다." },
    { name: "buttonText", label: "버튼 문구", type: "text", placeholder: "예: 공지사항 보기" },
    {
      name: "linkType",
      label: "버튼 연결 대상",
      type: "select",
      options: [
        { value: "none", label: "연결 안 함" },
        { value: "announcement_board", label: "우리 교회 공지사항 게시판" },
        { value: "url", label: "직접 입력한 링크" },
      ],
    },
    { name: "linkUrl", label: "직접 입력 링크 (연결 대상이 '직접 입력'일 때)", type: "url" },
  ],
  youtube_recent: [
    { name: "title", label: "섹션 제목", type: "text", placeholder: "예: 최근 설교 영상" },
    { name: "channelId", label: "유튜브 채널 ID", type: "text", required: true, help: "예: UCxxxxxxxxxxxxxxxxxxxxxx" },
    { name: "videoCount", label: "보여줄 영상 개수", type: "text", placeholder: "3" },
  ],
  google_photos_album: [
    { name: "title", label: "섹션 제목", type: "text", placeholder: "예: 교회 사진첩" },
    { name: "albumUrl", label: "구글 포토 공유 앨범 링크", type: "url", required: true },
  ],
  announcements_board: [
    { name: "title", label: "섹션 제목", type: "text", placeholder: "예: 공지사항" },
    { name: "itemCount", label: "목록에 보여줄 개수", type: "text", placeholder: "5" },
  ],
  service_times: [
    { name: "title", label: "섹션 제목", type: "text", placeholder: "예: 예배 안내" },
    {
      name: "lines",
      label: "예배 목록 (한 줄에 하나, '이름|시간' 형식)",
      type: "lines",
      placeholder: "주일 1부 예배|오전 9:00",
    },
  ],
};

export const BLOCK_TYPE_LABELS: Record<BlockTypeKey, string> = {
  hero_banner: "메인 배너",
  youtube_recent: "유튜브 최신 영상",
  google_photos_album: "구글 포토 앨범",
  announcements_board: "공지사항 게시판",
  service_times: "예배시간 안내",
};
