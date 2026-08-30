"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createChurchAction } from "@/lib/actions/admin";

export default function NewChurchPage() {
  const [error, formAction, isPending] = useActionState(createChurchAction, undefined);

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600">
        ← 대시보드로
      </Link>
      <h1 className="mt-2 mb-6 text-xl font-bold text-slate-900">새 교회 등록</h1>
      <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">교회 이름</label>
          <input name="name" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            슬러그 (사이트 주소용, 영문 소문자/숫자/하이픈)
          </label>
          <input name="slug" required placeholder="예: grace" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">한 줄 소개 (선택)</label>
          <input name="tagline" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <hr className="my-2 border-slate-100" />
        <p className="text-sm font-semibold text-slate-700">교회 관리자 계정</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">담당자 이름</label>
          <input name="adminName" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">관리자 아이디</label>
          <input name="adminUsername" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">관리자 비밀번호</label>
          <input
            name="adminPassword"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isPending ? "등록 중..." : "교회 등록"}
        </button>
      </form>
    </div>
  );
}
