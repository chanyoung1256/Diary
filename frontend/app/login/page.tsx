"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (typeof data === "string" && data.includes("실패")) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          name: data.name,
          phone: data.phone,
        })
      );

      router.push("/main");
    } catch (err) {
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center font-[var(--font-body)]"
      style={{
        backgroundColor: "#f4eee3",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/old-wall.png')",
      }}
    >
      {/* 좌측 장식(잎사귀) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute left-[8vw] top-[20vh] text-[6rem] select-none"
      >
        🍃
      </motion.div>

      {/* 우측 장식(스티커 메모) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute right-[12vw] top-[14vh] rotate-6 text-[4rem] select-none"
      >
        📒
      </motion.div>

      {/* 로그인 박스 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative bg-[#fffaf0] w-[90vw] max-w-lg px-10 py-12 rounded-[2.2rem]
                   shadow-[0_12px_45px_rgba(0,0,0,0.25)] border-2 border-[#eadfcb]
                   backdrop-blur-lg"
      >
        {/* 마스킹 테이프 */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-44 h-8 rotate-[-3deg] opacity-90 rounded-sm"
          style={{
            backgroundColor: "#f7e7a1",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.45) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.45) 50%)",
            backgroundSize: "12px 12px",
            clipPath: "polygon(0% 15%, 100% 0%, 95% 85%, 5% 100%)",
          }}
        />

        <div className="text-center relative z-10 mb-10">
          <h1 className="text-5xl font-extrabold text-stone-900 tracking-wide drop-shadow-md">
            감정일기
          </h1>
          <p className="text-stone-600 text-xl mt-4 italic">
            마음을 기록하는 조용한 공간 🍂
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-stone-700 text-xl mb-2">아이디</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6] border border-[#e5d6b6]
                         shadow-inner focus:ring-4 focus:ring-[#f0d7a6]/60 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-700 text-xl mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6] border border-[#e5d6b6]
                         shadow-inner focus:ring-4 focus:ring-[#f0d7a6]/60 outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="mt-4 py-3 rounded-xl bg-gradient-to-r from-[#f2d7a2] to-[#ffe5b8]
                       text-stone-900 text-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? "잠시만요..." : "일기장 열기 🌙"}
          </motion.button>
        </form>

        <p className="text-center mt-7 text-stone-600 text-lg">
          계정이 없나요?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-stone-800 font-semibold underline underline-offset-4"
          >
            회원가입하기
          </button>
        </p>
      </motion.div>

      {/* 바닥 연필 */}
      <motion.div
        initial={{ rotate: 95 }}
        animate={{ rotate: [95, 115, 90] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10vw] bottom-[10vh] text-[6rem] opacity-70 select-none"
      >
        ✏️
      </motion.div>
    </main>
  );
}
