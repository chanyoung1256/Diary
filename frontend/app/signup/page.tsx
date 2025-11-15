"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, username, password }),
      });

      const text = await res.text();

      if (text.includes("성공")) {
        alert("회원가입 완료! 이제 로그인해주세요 🌿");
        router.push("/login");
      } else {
        setError("이미 존재하는 아이디일 수 있습니다.");
      }
    } catch (err) {
      setError("서버 연결이 원활하지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center font-[var(--font-body)] overflow-hidden"
      style={{
        backgroundColor: "#f5efe6",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      {/* 🌿 좌측 장식 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute left-[8vw] top-[18vh] text-[6rem] select-none"
      >
        🌾
      </motion.div>

      {/* ✨ 우측 장식 */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute right-[10vw] top-[12vh] text-[4.5rem] rotate-6 select-none"
      >
        📘
      </motion.div>

      {/* 🎀 회원가입 박스 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[90vw] max-w-lg px-10 py-12 rounded-[2.2rem]
                   bg-[#fffaf3] shadow-[0_15px_45px_rgba(0,0,0,0.25)]
                   border-2 border-[#e8dfc8] backdrop-blur-lg"
      >
        {/* 마스킹테이프 */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-48 h-8 rotate-[-3.5deg] opacity-90 rounded-sm shadow"
          style={{
            backgroundColor: "#f3e2a8",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.45) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.45) 50%)",
            backgroundSize: "12px 12px",
            clipPath: "polygon(0% 20%, 100% 0%, 92% 100%, 8% 95%)",
          }}
        />

        {/* 제목 */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-stone-900 tracking-tight drop-shadow">
            회원가입
          </h1>
          <p className="text-stone-600 text-xl mt-4 italic">
            새로운 감정일기를 시작해볼까요? ✨
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSignup} className="flex flex-col gap-6">

          {/* 이름 */}
          <div>
            <label className="block text-stone-700 text-xl mb-2">이름</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6]
                         border border-[#e6d6b1] shadow-inner
                         focus:ring-4 focus:ring-[#f0d8a8]/60 outline-none"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-stone-700 text-xl mb-2">전화번호</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6]
                         border border-[#e6d6b1] shadow-inner
                         focus:ring-4 focus:ring-[#f0d8a8]/60 outline-none"
            />
          </div>

          {/* 아이디 */}
          <div>
            <label className="block text-stone-700 text-xl mb-2">아이디</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6]
                         border border-[#e6d6b1] shadow-inner
                         focus:ring-4 focus:ring-[#f0d8a8]/60 outline-none"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-stone-700 text-xl mb-2">비밀번호</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6]
                         border border-[#e6d6b1] shadow-inner
                         focus:ring-4 focus:ring-[#f0d8a8]/60 outline-none"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-stone-700 text-xl mb-2">
              비밀번호 확인
            </label>
            <input
              required
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full px-5 py-3 rounded-xl text-xl bg-[#fff7e6]
                         border border-[#e6d6b1] shadow-inner
                         focus:ring-4 focus:ring-[#f0d8a8]/60 outline-none"
            />
          </div>

          {/* 에러 */}
          {error && (
            <p className="text-red-500 text-center font-semibold mt-2">
              {error}
            </p>
          )}

          {/* 버튼 */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="mt-3 py-4 rounded-xl text-2xl font-semibold
                       bg-gradient-to-r from-[#f3d59e] to-[#ffe7b7]
                       text-stone-900 shadow-md hover:shadow-xl"
          >
            {loading ? "가입 중..." : "가입하기 🌼"}
          </motion.button>
        </form>

        {/* 로그인 링크 */}
        <p className="text-center mt-7 text-stone-600 text-lg">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-stone-900 font-semibold underline underline-offset-4"
          >
            로그인하기
          </button>
        </p>
      </motion.div>

      {/* ✏️ 연필 애니메이션 */}
      <motion.div
        initial={{ rotate: 95 }}
        animate={{ rotate: [95, 112, 89] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10vw] bottom-[10vh] text-[6.5rem] opacity-70 select-none"
      >
        ✏️
      </motion.div>
    </main>
  );
}
