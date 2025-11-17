"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAttendanceDates, updatePassword } from "../api/apiFetch";

export default function MyPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  const [attendance, setAttendance] = useState<string[]>([]);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);
    loadAttendance(parsed.username);
  }, []);

  const loadAttendance = async (username: string) => {
    const data = await getAttendanceDates(username);
    setAttendance(data || []);
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await updatePassword(user.username, oldPw, newPw);

    if (res?.status === "OK") {
      alert("비밀번호가 변경되었습니다!");
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
    } else {
      alert(res?.message || "비밀번호 변경 실패");
    }
  };

  if (!user) return null;

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{
        backgroundColor: "#f7f3ea",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/bedge-grunge.png')",
      }}
    >
      {/* 뒤로가기 버튼 */}
      <motion.button
        onClick={() => router.push("/main")}
        whileHover={{ scale: 1.05, rotate: -2 }}
        className="absolute top-6 right-6 px-5 py-2 rounded-xl
        bg-[#fff4c7] border border-[#e2d4a8]
        shadow-[0_4px_14px_rgba(0,0,0,0.15)]
        text-stone-800 font-semibold text-lg hover:bg-[#ffefb3]"
      >
        ← 메인으로
      </motion.button>

      {/* 큰 타이틀 */}
      <h1 className="text-center text-5xl font-extrabold tracking-wide mb-14 text-[#4d4538] drop-shadow-sm">
        🌿 마이페이지
      </h1>

      {/* 감성 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto p-10 rounded-3xl shadow-xl border
        bg-[#fffef8]/95 backdrop-blur-md relative"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/notebook.png')",
        }}
      >
        {/* 마스킹 테이프 */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-9 opacity-90 rounded-sm"
          style={{
            backgroundColor: "#f8e7aa",
            transform: "rotate(-4deg)",
          }}
        />

        {/* 이름만 표시 */}
        <div className="text-center mb-12">
          <p className="text-3xl font-bold text-[#3d352c]">
            안녕하세요,  
            <span className="ml-2 text-[#c28748] drop-shadow">
              {user.name}
            </span>
            님
          </p>
        </div>

        {/* 출석 */}
        

        {/* 비밀번호 변경 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#4c4336] mb-4">
            🔒 비밀번호 변경
          </h2>

          <input
            type="password"
            placeholder="현재 비밀번호"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl border shadow bg-white/70"
          />

          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl border shadow bg-white/70"
          />

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full p-4 mb-6 rounded-xl border shadow bg-white/70"
          />

          <motion.button
            onClick={handlePasswordChange}
            whileHover={{ scale: 1.03 }}
            className="w-full py-4 rounded-xl text-xl font-semibold
            bg-gradient-to-r from-[#f5d4ae] to-[#ffe5c4]
            text-stone-800 shadow-lg"
          >
            비밀번호 변경하기
          </motion.button>
        </section>
      </motion.div>
    </main>
  );
}
