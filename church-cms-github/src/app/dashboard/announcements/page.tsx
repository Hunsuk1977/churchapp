import Link from "next/link";
import { getSession } from "@/lib/session";
import { listAnnouncements } from "@/lib/store";
import { deleteAnnouncementAction } from "@/lib/actions/church";

export default async function AnnouncementsPage() {
  const session = await getSession();
  const items = await listAnnouncements(session.churchId!);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">공지사항 관리</h1>
          <p className="text-sm text-slate-500">
            여기서 작성한 공지사항이 &lsquo;공지사항 게시판&rsquo; 블록과, 메인 배너에서
            연결한 경우 배너 버튼에도 반영됩니다.
          </p>
        </div>
        <Link
          href="/dashboard/announcements/new"
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + 새 공지 작성
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
          아직 작성된 공지사항이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {a.pinned && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                        고정
                      </span>
                    )}
                    <p className="font-semibold text-slate-900">{a.title}</p>
                  </div>
                  {a.body && <p className="mt-1 text-sm text-slate-600">{a.body}</p>}
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <form action={deleteAnnouncementAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="shrink-0 text-sm text-red-500 hover:underline">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
