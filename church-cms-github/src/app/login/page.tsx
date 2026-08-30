import Link from "next/link";
import { loginChurchAction } from "@/lib/actions/auth";
import { LoginForm } from "@/components/LoginForm";

export default function ChurchLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-indigo-600">교회 관리자 로그인</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">우리 교회 홈페이지 관리</h1>
        <p className="mt-4 text-xs text-slate-400">데모 계정: pastor / pastor1234</p>
        <div className="mt-4">
          <LoginForm action={loginChurchAction} submitLabel="로그인" />
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">
            ← 홈으로
          </Link>
        </p>
      </div>
    </div>
  );
}
