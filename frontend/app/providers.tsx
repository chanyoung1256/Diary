"use client"; 

import { ThemeProvider } from "next-themes";
import { type ReactNode, useState, useEffect } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // 서버와 클라이언트의 테마가 달라서 생기는 오류(Hydration Mismatch)를
  // 방지하기 위해, 클라이언트에서 렌더링이 준비됐는지 확인합니다.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 마운트(준비)가 되기 전에는 아무것도 렌더링하지 않습니다.
  if (!isMounted) {
    return null;
  }

  // 준비가 되면 ThemeProvider를 렌더링합니다.
  // attribute="class"가 Tailwind v4가 다크 모드를 인식하는 방식입니다.
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}