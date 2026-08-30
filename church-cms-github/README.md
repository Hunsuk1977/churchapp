# Church CMS 프로토타입

여러 교회의 홈페이지를 "블록"을 조립해서 운영하는 멀티테넌트 CMS 프로토타입입니다.

- **센터(플랫폼) 관리자**: 블록 카탈로그(어떤 블록을 쓸 수 있게 할지)를 관리하고, 교회를 등록합니다.
- **교회 관리자**: 활성화된 블록 중에서 골라 자기 교회 홈페이지에 배치하고, 배너/공지사항 등의 내용을 직접 수정합니다.
- **공개 홈페이지**: `/[교회슬러그]` 경로에서 교회별로 실제 화면이 렌더링됩니다.

## 포함된 블록 5종

1. 메인 배너 (제목/부제/배경이미지/버튼 — 버튼은 외부 링크 또는 우리 교회 공지사항 게시판에 연결 가능)
2. 유튜브 최신 영상 (채널 ID만 입력하면 업로드 재생목록을 임베드)
3. 구글 포토 앨범 (공유 앨범 링크 카드)
4. 공지사항 게시판 (교회 관리자가 작성한 공지 목록)
5. 예배시간 안내

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

최초 실행 시 `data/db.json` 파일이 자동 생성되며 샘플 데이터(교회 1곳, 공지사항, 블록 배치)로 채워집니다.
별도의 데이터베이스 설치가 필요 없습니다 (프로토타입용 JSON 파일 기반 저장소, `src/lib/store.ts`).

### 데모 계정

- 교회 관리자: `pastor` / `pastor1234` → `/login`
- 센터 관리자: `admin` / `admin1234` → `/admin/login`

데이터를 초기 상태로 되돌리려면 `data/db.json` 파일을 삭제하고 서버를 다시 시작하세요.

## 구조

```
src/
  lib/
    types.ts          # 도메인 타입 (Church, PageBlock, Announcement 등)
    store.ts           # JSON 파일 기반 저장소 (실제 서비스에서는 Postgres 등으로 교체)
    session.ts          # 로그인 세션 (iron-session, 쿠키 기반)
    blockSchemas.ts      # 블록별 설정 필드 정의 (교회 관리자가 채우는 값)
    actions/
      auth.ts            # 로그인/로그아웃
      admin.ts            # 센터 관리자 기능 (교회 등록, 블록 카탈로그 on/off)
      church.ts           # 교회 관리자 기능 (블록 추가/편집/순서, 공지사항)
  components/
    blocks/              # 블록별 렌더러 (실제 공개 페이지에 그려지는 컴포넌트)
    BlockFieldsForm.tsx    # 블록 설정 폼 (스키마 기반 자동 생성)
    LoginForm.tsx
  app/
    page.tsx              # 랜딩 페이지
    login/, admin/login/    # 로그인
    admin/(protected)/       # 센터 관리자 대시보드
    dashboard/               # 교회 관리자 대시보드
    [slug]/                  # 공개 교회 홈페이지
```

## 다음 단계로 고려할 것들

- 실제 DB(PostgreSQL 등)와 인증(예: NextAuth, Supabase Auth)으로 교체
- 이미지 업로드 (현재는 이미지 URL만 입력)
- 새 블록 유형 추가 시: `blockSchemas.ts`에 필드 정의 추가 + `components/blocks/`에 렌더러 추가 +
  `BLOCK_TYPE_LABELS` 갱신 + 시드 데이터의 `blockTypes`에 등록
- 유튜브 최신 영상은 API 키 없이 "업로드 재생목록 임베드" 방식으로 구현되어 있음.
  더 세밀한 썸네일 그리드가 필요하면 YouTube Data API 연동 필요
- 구글 포토는 공식 임베드가 지원되지 않아 "앨범 열기" 카드 형태로 구현. Google Photos API 승인을
  받으면 실제 썸네일도 가져올 수 있음
- 커스텀 도메인 연결, 다국어, 온라인 헌금 링크, 오시는 길 지도 등 추가 블록
