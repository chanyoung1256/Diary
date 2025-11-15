"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDiariesByDate, analyzeDiaries } from "../api/apiFetch";

export default function AiAnalyzePage() {
  const [date, setDate] = useState("");
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const loadDiaries = async () => {
    if (!user || !date) return;
    const data = await getDiariesByDate(user.username, date);
    setDiaries(data);
  };

  const handleAnalyze = async () => {
    if (!user || !date) return;
    const data = await analyzeDiaries(user.username, date);
    setResults(data.results);
  };

  return (
    <main
      className="min-h-screen px-6 py-10 relative"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-1.png')",
        backgroundColor: "#f8f4ec",
      }}
    >
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-10 text-[#4f473b]">
        🤖 AI 감정 분석 & 위로 메시지
      </h1>

      {/* 날짜 선택 박스 */}
      <div className="max-w-3xl mx-auto mb-10 p-6 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl border">
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl border bg-[#fdfbf6]"
          />
          <button
            onClick={loadDiaries}
            className="px-6 py-3 bg-[#79a6f2] text-white rounded-xl shadow"
          >
            불러오기
          </button>
        </div>
      </div>

      {/* 일기 카드 */}
      {diaries.length > 0 && (
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4">📘 해당 날짜의 일기</h2>

          <div className="flex flex-col gap-6">
            {diaries.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-[#fff7d4]/90 border shadow relative"
              >
                <p className="text-lg">{d.content}</p>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            className="mt-8 w-full py-4 bg-[#9b7df5] text-white rounded-xl shadow"
          >
            🤖 AI 감정 분석 실행
          </button>
        </div>
      )}

      {/* 분석 결과 */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-3xl font-semibold mb-6">✨ 분석 결과</h2>

          <div className="flex flex-col gap-10">
            {results.map((r, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-7 bg-white rounded-2xl shadow border"
              >
                {/* 감정 */}
                <div className="text-2xl font-bold text-[#6c54a3] mb-3">
                  {r.emotion} 감정
                </div>

                {/* 원본 일기 */}
                <p className="text-lg leading-relaxed mb-4">
                  📝 {r.content}
                </p>

                {/* 위로 메시지 */}
                <div className="p-4 bg-[#fff5d6] rounded-xl border mb-4">
                  <p className="font-semibold mb-1">💛 위로 메시지</p>
                  <p>{r.comfort_message}</p>
                </div>

                {/* 감정 조절 팁 */}
                <div className="p-4 bg-[#e9f5ff] rounded-xl border mb-4">
                  <p className="font-semibold mb-1">🌿 감정 조절 팁</p>
                  <p>{r.regulate_tip}</p>
                </div>

                {/* 활동 추천 */}
                <div className="p-4 bg-[#e8ffe9] rounded-xl border">
                  <p className="font-semibold mb-1">✨ 추천 활동</p>
                  <p>{r.activity_recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
