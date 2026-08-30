import Link from "next/link";
import { listChurches } from "@/lib/store";

export default async function Home() {
  const churches = await listChurches();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Church CMS 프로토타입</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            블록으로 조립하는 교회 홈페이지
          </h1>
          <p className="mt-3 text-slate-600">
            센터 관리자가 만들어둔 블록(메인 배너, 유튜브 최신 영상, 구글 포토 앨범, 공지사항
            게시판, 예배시간 안내) 중에서 각 교회가 원하는 것을 골라 배치하고, 내용을 직접
            수정할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <p className="text-sm font-semibold text-indigo-600">교회 관리자</p>
            <p className="mt-1 text-lg font-bold text-slate-900">교회 홈페이지 관리하기</p>
            <p className="mt-2 text-sm text-slate-500">
              블록 배치, 배너/공지사항 내용 수정
            </p>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <p className="text-sm font-semibold text-slate-500">센터 관리자</p>
            <p className="mt-1 text-lg font-bold text-slate-900">플랫폼 관리하기</p>
            <p className="mt-2 text-sm text-slate-500">교회 등록, 블록 카탈로그 관리</p>
          </Link>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">등록된 교회 사이트</h2>
          <ul className="flex flex-col gap-2">
            {churches.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-indigo-300"
                >
                  {c.name}
                  <span className="text-slate-400">/{c.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 text-xs text-slate-400">
          데모 계정 — 교회 관리자: <code>pastor</code> / <code>pastor1234</code> · 센터 관리자:{" "}
          <code>admin</code> / <code>admin1234</code>
        </div>
      </main>
    </div>
  );
}
