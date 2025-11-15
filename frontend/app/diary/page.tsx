"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DiaryPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; username: string } | null>(null);
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("");

  const emotions = ["😊", "😢", "😡", "😌", "🤔", "🥰"];

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  // ✔ 일기 저장
  const saveDiary = async () => {
    if (!content.trim()) {
      alert("일기 내용을 입력해주세요!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await fetch("http://localhost:8080/diary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          date: today,
          content,
          emotion,
        }),
      });

      if (!res.ok) {
        alert("저장 실패");
        return;
      }

      alert("저장되었습니다!");
      router.push("/main");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-4 py-12
                 bg-[#f7f3ea] font-[var(--font-body)]"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      {/* ⭐ 메인 페이지로 버튼 */}
      <motion.button
        onClick={() => router.push("/main")}
        whileHover={{ scale: 1.05, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 px-5 py-2 rounded-xl
                   bg-[#fff4c7] border border-[#e2d4a8]
                   shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                   text-stone-800 font-semibold text-lg
                   hover:bg-[#ffefb3] transition-all z-30"
      >
        ← 메인으로
      </motion.button>

      {/* ✨ 일기장 박스 */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[92vw] max-w-5xl min-h-[75vh] bg-[#fffdf8] rounded-[2rem]
                   border border-stone-300 shadow-[0_25px_45px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        {/* 마스킹테이프 */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-9 rotate-[-4deg] opacity-90 rounded-sm z-30"
          style={{
            backgroundColor: "#f5e5a2",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.6) 50%)",
            backgroundSize: "10px 10px",
            clipPath: "polygon(0% 10%, 100% 0%, 95% 95%, 5% 100%)",
          }}
        />

        {/* 좌/우 페이지 레이아웃 */}
        <div className="flex h-full">

          {/* 💛 왼쪽 감정 선택 */}
          <div
            className="relative w-1/3 border-r border-stone-300 
                       bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]
                       bg-[#fffdf7]/80 p-10 flex flex-col items-center gap-8"
          >
            <h2 className="text-3xl font-bold text-stone-800">오늘의 감정</h2>

            <div className="grid grid-cols-2 gap-5 text-5xl select-none">
              {emotions.map((e, idx) => (
                <motion.span
                  key={idx}
                  onClick={() => setEmotion(e)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.15 }}
                  className={`cursor-pointer transition 
                    ${emotion === e ? "scale-125 drop-shadow-xl" : "opacity-70"}`}
                >
                  {e}
                </motion.span>
              ))}
            </div>

            <p className="mt-3 text-stone-700 text-xl font-medium">
              선택된 감정:  
              <span className="ml-2 text-2xl">{emotion || "없음"}</span>
            </p>
          </div>

          {/* 💚 오른쪽 일기 입력 */}
          <div
            className="relative flex-1 p-12 
                       bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]
                       bg-[#fffefb]/80"
          >
            <h1 className="text-4xl font-bold text-stone-800 text-center mb-6">
              🌿 오늘의 감정일기
            </h1>

            <p className="text-stone-600 text-center mb-8 text-lg">
              {user ? `${user.name} 님의 하루를 기록해보세요.` : ""}
            </p>

            <textarea
              placeholder="오늘 어떤 하루였나요? 마음을 편하게 기록해보세요 🌿"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[330px] p-6 text-xl bg-transparent
                         rounded-2xl resize-none outline-none 
                         text-stone-900 leading-relaxed tracking-wide
                         placeholder:text-stone-400 border border-stone-300 shadow-inner"
            />

            <motion.button
              onClick={saveDiary}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 w-full py-4 rounded-xl text-2xl font-semibold text-stone-900
                         bg-gradient-to-r from-[#eccfae] to-[#fde2c2]
                         shadow-lg hover:shadow-xl transition-all"
            >
              ✨ 오늘의 기록 저장하기
            </motion.button>
          </div>
        </div>

        {/* 접힌 중앙선 */}
        <div className="absolute left-1/3 top-0 bottom-0 w-[3px]
                        bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 opacity-60"></div>
      </motion.div>
    </main>
  );
}
