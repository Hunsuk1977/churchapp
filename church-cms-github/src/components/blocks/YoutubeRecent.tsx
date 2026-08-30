import type { PageBlock } from "@/lib/types";

export function YoutubeRecent({ block }: { block: PageBlock }) {
  const { title, channelId } = block.config;
  // 채널 ID(UC...)를 업로드 재생목록 ID(UU...)로 변환하면
  // 별도의 API 키 없이도 "최근 업로드 영상" 재생목록을 임베드할 수 있습니다.
  const uploadsPlaylistId = channelId?.startsWith("UC")
    ? "UU" + channelId.slice(2)
    : channelId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title || "최근 영상"}</h2>
      {uploadsPlaylistId ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`}
            title={title || "유튜브 최근 영상"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">유튜브 채널 ID를 설정해 주세요.</p>
      )}
    </section>
  );
}
