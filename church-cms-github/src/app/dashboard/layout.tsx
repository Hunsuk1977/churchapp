import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions/auth";
import { getChurchById } from "@/lib/store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.role !== "church" || !session.churchId) {
    redirect("/login");
  }

  const church = await getChurchById(session.churchId!);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-indigo-500">교회 관리자</p>
            <p className="font-bold text-slate-900">{church?.name}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              블록 관리
            </Link>
            <Link href="/dashboard/announcements" className="text-slate-600 hover:text-slate-900">
              공지사항
            </Link>
            {church && (
              <Link href={`/${church.slug}`} target="_blank" className="text-slate-600 hover:text-slate-900">
                사이트 보기
              </Link>
            )}
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
