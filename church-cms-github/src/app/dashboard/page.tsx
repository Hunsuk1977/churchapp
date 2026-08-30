import Link from "next/link";
import { getSession } from "@/lib/session";
import { listPageBlocks } from "@/lib/store";
import { BLOCK_TYPE_LABELS } from "@/lib/blockSchemas";
import { toggleBlockAction, deleteBlockAction, moveBlockAction } from "@/lib/actions/church";

export default async function DashboardHomePage() {
  const session = await getSession();
  const blocks = await listPageBlocks(session.churchId!);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">홈페이지 블록 구성</h1>
          <p className="text-sm text-slate-500">
            순서를 바꾸거나 켜고 끌 수 있습니다. 실제 화면은 &lsquo;사이트 보기&rsquo;에서 확인하세요.
          </p>
        </div>
        <Link
          href="/dashboard/blocks/new"
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + 블록 추가
        </Link>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
          아직 추가된 블록이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <li
              key={block.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {BLOCK_TYPE_LABELS[block.typeKey]}
                  {!block.enabled && (
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                      숨김
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500">
                  {block.config.title || "(제목 없음)"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <form action={moveBlockAction}>
                  <input type="hidden" name="id" value={block.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveBlockAction}>
                  <input type="hidden" name="id" value={block.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={i === blocks.length - 1}
                    className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
                <form action={toggleBlockAction}>
                  <input type="hidden" name="id" value={block.id} />
                  <button type="submit" className="rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50">
                    {block.enabled ? "숨기기" : "보이기"}
                  </button>
                </form>
                <Link
                  href={`/dashboard/blocks/${block.id}/edit`}
                  className="rounded border border-slate-200 px-2 py-1 text-indigo-600 hover:bg-indigo-50"
                >
                  편집
                </Link>
                <form action={deleteBlockAction}>
                  <input type="hidden" name="id" value={block.id} />
                  <button type="submit" className="rounded border border-slate-200 px-2 py-1 text-red-500 hover:bg-red-50">
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
