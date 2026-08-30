import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPageBlock } from "@/lib/store";
import { BLOCK_FIELD_SCHEMAS, BLOCK_TYPE_LABELS } from "@/lib/blockSchemas";
import { BlockFieldsForm } from "@/components/BlockFieldsForm";
import { updateBlockAction } from "@/lib/actions/church";

export default async function EditBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const block = await getPageBlock(id, session.churchId!);
  if (!block) notFound();

  const fields = BLOCK_FIELD_SCHEMAS[block.typeKey];

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600">
        ← 블록 관리로
      </Link>
      <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">
        {BLOCK_TYPE_LABELS[block.typeKey]} 편집
      </h1>
      <form
        action={updateBlockAction}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={block.id} />
        <BlockFieldsForm fields={fields} defaultValues={block.config} />
        <button
          type="submit"
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
