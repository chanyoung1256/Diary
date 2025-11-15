"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MainPage() {
  const router = useRouter();

  // 로그인된 사용자 저장
  const [user, setUser] = useState<{ name: string; username: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const cards = [
    { label: "오늘의 감정일기", emoji: "✏️", path: "/diary", color: "bg-[#fff4ba]" },
    { label: "감정 통계 보기", emoji: "📊", path: "/stats", color: "bg-[#ffd6e7]" },
    { label: "AI 감정 피드백", emoji: "🤖", path: "/ai", color: "bg-[#d9eaff]" },
    { label: "일기장 확인하기", emoji: "🌿", path: "/diaryList", color: "bg-[#e6ffd8]" },
    { label: "마이페이지", emoji: "👤", path: "/mypage", color: "bg-[#ffe7cf]" },
    { label: "감정 캘린더", emoji: "📅", path: "/calendar", color: "bg-[#f2d7ff]" },
  ];

  return (
    <main
      className="relative min-h-screen flex flex-col items-center pt-24 pb-20 overflow-hidden"
      style={{
        backgroundColor: "#f6f2e9",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      {/* 🌿 좌측 감성 장식 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute left-[6vw] top-[18vh] text-[5rem] select-none"
      >
        🍃
      </motion.div>

      {/* 🌼 우측 감성 장식 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute right-[6vw] top-[22vh] text-[4.5rem] select-none"
      >
        ✨
      </motion.div>

      {/* 제목 */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-6xl font-serif font-bold text-stone-800 drop-shadow-sm tracking-wide"
      >
        감정일기
      </motion.h1>

      {/* 로그인 사용자 문구 */}
      <p className="relative z-10 text-xl text-stone-700 mt-4 mb-16 font-medium font-serif">
        {user
          ? `${user.name}님, 오늘 마음을 가볍게 적어볼까요? 🌿`
          : "오늘 마음을 가볍게 적어볼까요? 🌿"}
      </p>

      {/* 기능 카드 */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-16 w-[90vw] max-w-5xl">

        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0.9,
              rotate: i % 2 === 0 ? -2 : 2,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: i % 2 === 0 ? -1 : 1,
              y: 0,
            }}
            transition={{ duration: 0.8, delay: i * 0.08 }}
            whileHover={{
              scale: 1.06,
              rotate: 0,
              y: -6,
              transition: { type: "spring", stiffness: 180 },
            }}
            className="relative w-full"
          >
            {/* 스티커 테이프 */}
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 w-32 h-8 opacity-90 rotate-[2deg] rounded-sm shadow-sm"
              style={{
                backgroundColor: "#f5e5a8",
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,0.58) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.58) 50%)",
                backgroundSize: "12px 12px",
                clipPath: "polygon(0% 15%, 100% 0%, 95% 90%, 5% 100%)",
              }}
            />
            
            {/* 포스트잇 카드 */}
            <motion.button
              onClick={() => router.push(card.path)}
              whileTap={{ scale: 0.97 }}
              className={`${card.color} w-full p-12 pt-16 rounded-2xl 
                          shadow-[0_6px_25px_rgba(0,0,0,0.18)]
                          hover:shadow-[0_12px_35px_rgba(0,0,0,0.28)]
                          transition-all cursor-pointer text-center 
                          border border-[#e9dec9]`}
            >
              <div className="text-5xl mb-4 drop-shadow">{card.emoji}</div>
              <div className="text-2xl font-semibold text-stone-800 font-serif">
                {card.label}
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
