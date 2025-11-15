"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Diary = {
  id: number;
  username: string;
  date: string;
  content: string;
  emotion: string;
};

export default function CalendarPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const [selectedDate, setSelectedDate] = useState("");
  const [diaries, setDiaries] = useState<Diary[]>([]);

  const [writtenDates, setWrittenDates] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      fetchWrittenDates(parsed.username, year, month);
    }
  }, [year, month]);

  const fetchWrittenDates = async (username: string, year: number, month: number) => {
    const res = await fetch(`http://localhost:8080/diary/list?username=${username}`);
    const data = await res.json();

    const diariesData = data as Diary[];

    const monthStr = String(month + 1).padStart(2, "0");

    setWrittenDates(
      diariesData
        .map((d) => d.date)
        .filter((d) => typeof d === "string" && d.startsWith(`${year}-${monthStr}`))
    );
  };


  const fetchDiary = async (date: string) => {
    if (!user) return;

    const res = await fetch(
      `http://localhost:8080/diary/date?username=${user.username}&date=${date}`
    );

    if (!res.ok) return setDiaries([]);

    const data = await res.json();
    setDiaries(data);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

  const goPrevMonth = () => {
    setSelectedDate("");
    setDiaries([]);
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goNextMonth = () => {
    setSelectedDate("");
    setDiaries([]);
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <main
      className="min-h-screen py-12 px-6 relative"
      style={{
        backgroundColor: "#f6f1e6",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      {/* ⭐ 메인 버튼 */}
      <motion.button
        onClick={() => router.push("/main")}
        whileHover={{ scale: 1.05, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 px-5 py-2 rounded-xl
                   bg-[#fff4c7] border border-[#e2d4a8]
                   shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                   text-stone-800 font-semibold text-lg
                   hover:bg-[#ffefb3] transition-all"
      >
        ← 메인으로
      </motion.button>

      {/* 제목 */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-serif font-bold text-center mb-10 text-stone-800"
      >
        📅 감정 캘린더
      </motion.h1>

      {/* 월 이동 */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goPrevMonth}
          className="px-4 py-2 bg-white shadow rounded-xl border font-semibold hover:bg-[#faf6ec]"
        >
          ←
        </motion.button>

        <span className="text-3xl font-serif text-stone-800">
          {year}년 {monthNames[month]}
        </span>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goNextMonth}
          className="px-4 py-2 bg-white shadow rounded-xl border font-semibold hover:bg-[#faf6ec]"
        >
          →
        </motion.button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 w-[90vw] max-w-3xl mx-auto text-center 
                      text-lg font-semibold mb-4 text-stone-600">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* 달력 */}
      <div className="grid grid-cols-7 gap-4 w-[90vw] max-w-3xl mx-auto">

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={"empty-" + i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const hasDiary = writtenDates.includes(dateStr);

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedDate(dateStr);
                fetchDiary(dateStr);
              }}
              className={`p-4 rounded-2xl shadow-md cursor-pointer transition-all border text-lg
                ${
                  hasDiary
                    ? "bg-[#ffe7aa] border-[#d5a500] text-stone-900 font-bold"
                    : "bg-white hover:bg-[#f7f3ec]"
                }`}
            >
              {day}
            </motion.div>
          );
        })}
      </div>

      {/* 선택 날짜 일기들 */}
      {selectedDate && (
        <div className="mt-12 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-stone-800 mb-6">
            {selectedDate} 일기 모음
          </h2>

          {diaries.length > 0 ? (
            diaries.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/diaryDetail/${d.id}`)} // ⭐ 상세로 이동
                className="p-6 bg-white rounded-3xl shadow border cursor-pointer transition-all"
              >
                <p className="text-xl font-semibold mb-2">감정: {d.emotion}</p>
                <p className="whitespace-pre-line leading-relaxed text-lg text-stone-700">
                  {d.content.length > 80
                    ? d.content.substring(0, 80) + "..."
                    : d.content}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-stone-500 text-xl text-center">
              📭 이 날짜에는 작성된 일기가 없습니다.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
