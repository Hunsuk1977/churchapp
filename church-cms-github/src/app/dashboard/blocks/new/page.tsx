import Link from "next/link";
import { listBlockTypes } from "@/lib/store";
import { BLOCK_FIELD_SCHEMAS } from "@/lib/blockSchemas";
import { BlockFieldsForm } from "@/components/BlockFieldsForm";
import { addBlockAction } from "@/lib/actions/church";
import type { BlockTypeKey } from "@/lib/types";

export default async function NewBlockPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const blockTypes = await listBlockTypes();
  const activeTypes = blockTypes.filter((bt) => bt.active);

  if (!type) {
    return (
      <div>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600">
          ← 블록 관리로
        </Link>
        <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">추가할 블록 유형 선택</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeTypes.map((bt) => (
            <Link
              key={bt.key}
              href={`/dashboard/blocks/new?type=${bt.key}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <p className="font-semibold text-slate-900">{bt.name}</p>
              <p className="mt-1 text-sm text-slate-500">{bt.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const typeKey = type as BlockTypeKey;
  const fields = BLOCK_FIELD_SCHEMAS[typeKey];
  const blockType = blockTypes.find((bt) => bt.key === typeKey);

  if (!fields || !blockType?.active) {
    return (
      <div>
        <p className="text-sm text-red-500">사용할 수 없는 블록 유형입니다.</p>
        <Link href="/dashboard/blocks/new" className="text-sm text-indigo-600 hover:underline">
          ← 다시 선택
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/dashboard/blocks/new" className="text-sm text-slate-400 hover:text-slate-600">
        ← 다른 유형 선택
      </Link>
      <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">{blockType.name} 추가</h1>
      <form
        action={addBlockAction}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="typeKey" value={typeKey} />
        <BlockFieldsForm fields={fields} />
        <button
          type="submit"
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          블록 추가하기
        </button>
      </form>
    </div>
  );
}
