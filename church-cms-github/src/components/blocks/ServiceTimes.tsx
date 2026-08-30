import type { PageBlock } from "@/lib/types";

export function ServiceTimes({ block }: { block: PageBlock }) {
  const { title, lines } = block.config;
  const items = (lines || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, time] = l.split("|").map((s) => s?.trim());
      return { name: name || l, time: time || "" };
    });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title || "예배 안내"}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">예배 시간을 설정해 주세요.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <span className="font-medium text-slate-800">{it.name}</span>
              <span className="text-sm text-slate-500">{it.time}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
