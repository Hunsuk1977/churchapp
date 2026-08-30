import type { PageBlock } from "@/lib/types";

export function GooglePhotosAlbum({ block }: { block: PageBlock }) {
  const { title, albumUrl } = block.config;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title || "교회 사진첩"}</h2>
      {albumUrl ? (
        <a
          href={albumUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:bg-slate-100"
        >
          <span className="text-3xl">📷</span>
          <span className="font-medium text-slate-800">공유된 구글 포토 앨범 열기</span>
          <span className="text-xs text-slate-500 break-all">{albumUrl}</span>
        </a>
      ) : (
        <p className="text-sm text-slate-500">구글 포토 공유 앨범 링크를 설정해 주세요.</p>
      )}
    </section>
  );
}
