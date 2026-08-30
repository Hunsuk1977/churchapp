import Link from "next/link";
import { getChurchAdminUsername, listBlockTypes, listChurches } from "@/lib/store";
import { toggleBlockTypeAction, deleteChurchAction } from "@/lib/actions/admin";

export default async function AdminDashboardPage() {
  const [blockTypes, churches] = await Promise.all([listBlockTypes(), listChurches()]);
  const adminUsernames = await Promise.all(churches.map((c) => getChurchAdminUsername(c.id)));

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">블록 카탈로그</h1>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          여기서 활성화한 블록만 교회 관리자 화면에서 선택할 수 있습니다. 새 블록 종류 자체는
          개발팀이 컴포넌트로 추가합니다.
        </p>
        <ul className="flex flex-col gap-2">
          {blockTypes.map((bt) => (
            <li
              key={bt.key}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{bt.name}</p>
                <p className="text-sm text-slate-500">{bt.description}</p>
              </div>
              <form action={toggleBlockTypeAction}>
                <input type="hidden" name="key" value={bt.key} />
                <button
                  type="submit"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bt.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {bt.active ? "활성" : "비활성"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">등록된 교회</h1>
          <Link
            href="/admin/churches/new"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + 새 교회 등록
          </Link>
        </div>
        <ul className="flex flex-col gap-2">
          {churches.map((c, i) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {c.name} <span className="font-normal text-slate-400">/{c.slug}</span>
                </p>
                <p className="text-sm text-slate-500">관리자 계정: {adminUsernames[i] ?? "-"}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/${c.slug}`} target="_blank" className="text-indigo-600 hover:underline">
                  사이트 보기
                </Link>
                <form action={deleteChurchAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-red-500 hover:underline">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
