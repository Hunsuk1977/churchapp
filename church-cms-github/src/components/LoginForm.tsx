"use client";

import { useActionState } from "react";

export function LoginForm({
  action,
  submitLabel,
}: {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  submitLabel: string;
}) {
  const [error, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">아이디</label>
        <input
          name="username"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">비밀번호</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {isPending ? "로그인 중..." : submitLabel}
      </button>
    </form>
  );
}
