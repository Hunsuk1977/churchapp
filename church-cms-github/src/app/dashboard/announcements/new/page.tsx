import Link from "next/link";
import { addAnnouncementAction } from "@/lib/actions/church";

export default function NewAnnouncementPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link href="/dashboard/announcements" className="text-sm text-slate-400 hover:text-slate-600">
        ← 공지사항 목록으로
      </Link>
      <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">새 공지사항 작성</h1>
      <form
        action={addAnnouncementAction}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
          <input name="title" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">내용</label>
          <textarea name="body" rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="pinned" className="rounded border-slate-300" />
          상단에 고정
        </label>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
