import type { PageBlock } from "@/lib/types";

export function HeroBanner({ block, churchSlug }: { block: PageBlock; churchSlug: string }) {
  const { title, subtitle, imageUrl, buttonText, linkType, linkUrl } = block.config;

  let href: string | null = null;
  if (linkType === "announcement_board") href = `/${churchSlug}#announcements`;
  else if (linkType === "url" && linkUrl) href = linkUrl;

  return (
    <section
      className="relative flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl px-6 py-16 text-center text-white shadow-sm"
      style={{
        backgroundImage: imageUrl
          ? `linear-gradient(rgba(15,23,42,0.55),rgba(15,23,42,0.55)), url(${imageUrl})`
          : undefined,
        backgroundColor: imageUrl ? undefined : "#1e293b",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold sm:text-4xl">{title || "제목을 입력해 주세요"}</h1>
      {subtitle && <p className="max-w-xl text-base text-white/90 sm:text-lg">{subtitle}</p>}
      {href && buttonText && (
        <a
          href={href}
          className="mt-2 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
        >
          {buttonText}
        </a>
      )}
    </section>
  );
}
