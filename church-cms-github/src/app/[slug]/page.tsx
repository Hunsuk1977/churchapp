import { notFound } from "next/navigation";
import { getChurchBySlug, listAnnouncements, listPageBlocks } from "@/lib/store";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export default async function ChurchPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const church = await getChurchBySlug(slug);
  if (!church) notFound();

  const [allBlocks, announcements] = await Promise.all([
    listPageBlocks(church.id),
    listAnnouncements(church.id),
  ]);
  const blocks = allBlocks.filter((b) => b.enabled);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-bold text-slate-900">{church.name}</p>
            {church.tagline && <p className="text-sm text-slate-500">{church.tagline}</p>}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {blocks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
            아직 구성된 블록이 없습니다. 관리자 페이지에서 블록을 추가해 보세요.
          </p>
        ) : (
          blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              churchSlug={slug}
              announcements={announcements}
            />
          ))
        )}
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {church.name} · Powered by Church CMS
      </footer>
    </div>
  );
}
