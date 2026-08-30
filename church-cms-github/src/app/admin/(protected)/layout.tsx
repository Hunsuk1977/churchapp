import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.role !== "platform") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">센터 관리자</p>
            <p className="font-bold text-slate-900">{session.name}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              대시보드
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-slate-400 hover:text-slate-700">
                로그아웃
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
