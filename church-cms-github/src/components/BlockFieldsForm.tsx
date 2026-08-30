import type { FieldDef } from "@/lib/blockSchemas";

export function BlockFieldsForm({
  fields,
  defaultValues,
}: {
  fields: FieldDef[];
  defaultValues?: Record<string, string>;
}) {
  return (
    <>
      {fields.map((f) => {
        const value = defaultValues?.[f.name] ?? "";
        return (
          <div key={f.name}>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>
            {f.type === "textarea" || f.type === "lines" ? (
              <textarea
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                defaultValue={value}
                rows={f.type === "lines" ? 4 : 3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              />
            ) : f.type === "select" ? (
              <select
                name={f.name}
                defaultValue={value || f.options?.[0]?.value}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type === "url" ? "url" : "text"}
                required={f.required}
                placeholder={f.placeholder}
                defaultValue={value}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            )}
            {f.help && <p className="mt-1 text-xs text-slate-400">{f.help}</p>}
          </div>
        );
      })}
    </>
  );
}
