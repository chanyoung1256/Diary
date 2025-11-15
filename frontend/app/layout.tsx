import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // 1. 방금 만든 Providers 임포트

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI와 나의 감정일기",
  description: "AI로 분석하는 나의 감정",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. <html> 태그에 suppressHydrationWarning을 추가합니다.
    //    (next-themes 사용 시 권장 사항)
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 3. <Providers>로 {children}을 감싸줍니다. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}