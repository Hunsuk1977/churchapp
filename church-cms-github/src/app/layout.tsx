import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Church CMS 프로토타입",
  description: "블록으로 조립하는 교회 홈페이지 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
