import type { Announcement, PageBlock } from "@/lib/types";

export function AnnouncementsBoard({
  block,
  announcements,
}: {
  block: PageBlock;
  announcements: Announcement[];
}) {
  const { title, itemCount } = block.config;
  const limit = Number(itemCount) > 0 ? Number(itemCount) : 5;

  const sorted = [...announcements]
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);

  return (
    <section id="announcements" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title || "공지사항"}</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">등록된 공지사항이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sorted.map((a) => (
            <li key={a.id} className="py-3">
              <div className="flex items-center gap-2">
                {a.pinned && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                    고정
                  </span>
                )}
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
              </div>
              {a.body && <p className="mt-1 text-sm text-slate-600">{a.body}</p>}
              <p className="mt-1 text-xs text-slate-400">
                {new Date(a.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
