"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// -----------------------------------------------------
// ⭐ 메인으로 이동 버튼 (차녕 스타일)
// -----------------------------------------------------
function MainButton() {
  const router = useRouter();
  return (
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
  );
}

// -----------------------------------------------------
// Chart.js 동적 import (SSR 방지)
// -----------------------------------------------------
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((m) => m.Doughnut),
  { ssr: false }
);
const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), { ssr: false });

// -----------------------------------------------------
// 타입 정의
// -----------------------------------------------------
type Diary = {
  id: number;
  username: string;
  date: string;
  content: string;
  emotion: string;
};

export default function StatsPage() {
  // -----------------------------------------------------
  // 상태값
  // -----------------------------------------------------
  const [chartLoaded, setChartLoaded] = useState(false);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [weekData, setWeekData] = useState<Diary[]>([]);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    advice: string;
    activities: string[];
  } | null>(null);

  const emotions = ["😊", "😢", "😡", "😌", "🤔", "🥰"];

  // -----------------------------------------------------
  // Chart.js 등록
  // -----------------------------------------------------
  useEffect(() => {
    async function loadChartJS() {
      const chart = await import("chart.js");
      chart.Chart.register(
        chart.BarElement,
        chart.ArcElement,
        chart.PointElement,
        chart.LineElement,
        chart.CategoryScale,
        chart.LinearScale,
        chart.Tooltip,
        chart.Legend
      );
      setChartLoaded(true);
    }
    loadChartJS();
  }, []);

  // -----------------------------------------------------
  // 유저 정보 로딩 + 일기 불러오기
  // -----------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const u = JSON.parse(stored);
    setUser(u);

    fetch(`http://localhost:8080/diary/list?username=${u.username}`)
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        const seven = new Date();
        seven.setDate(today.getDate() - 7);

        const filtered = data.filter((d: Diary) => {
          const dDate = new Date(d.date);
          return dDate >= seven && dDate <= today;
        });

        setWeekData(filtered);
      });
  }, []);

  // -----------------------------------------------------
  // GPT 분석 요청
  // -----------------------------------------------------
  async function loadAIStats() {
    if (weekData.length === 0) return;

    // FastAPI 요청
    const res = await fetch("http://localhost:5001/analyze/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diaries: weekData }),
    });

    const data = await res.json();
    setAiResult(data);

    // Spring 저장
    if (user) {
      const weekStart = weekData[0].date;
      const weekEnd = weekData[weekData.length - 1].date;

      await fetch("http://localhost:8080/stats/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          weekStart,
          weekEnd,
          summary: data.summary,
          advice: data.advice,
          activities: JSON.stringify(data.activities),
        }),
      });
    }
  }

  // GPT 자동 호출
  useEffect(() => {
    if (weekData.length > 0) loadAIStats();
  }, [weekData]);

  // -----------------------------------------------------
  // 감정 개수 계산
  // -----------------------------------------------------
  const emotionCount: Record<string, number> = {
    "😊": 0,
    "😢": 0,
    "😡": 0,
    "😌": 0,
    "🤔": 0,
    "🥰": 0,
  };

  weekData.forEach((d) => {
    emotionCount[d.emotion]++;
  });

  // -----------------------------------------------------
  // Chart 데이터 생성
  // -----------------------------------------------------
  const barData = {
    labels: emotions,
    datasets: [
      {
        label: "지난 7일 감정 빈도",
        data: emotions.map((e) => emotionCount[e]),
        backgroundColor: "#b0c9ff",
      },
    ],
  };

  const doughnutData = {
    labels: emotions,
    datasets: [
      {
        data: emotions.map((e) => emotionCount[e]),
        backgroundColor: [
          "#ffe6a7",
          "#cde2ff",
          "#ffb2b2",
          "#d6ffd6",
          "#e8d8ff",
          "#ffd3ec",
        ],
      },
    ],
  };

  const emotionScore: Record<string, number> = {
    "😊": 5,
    "🥰": 4,
    "😌": 3,
    "🤔": 2,
    "😢": 1,
    "😡": 0,
  };

  const sorted = [...weekData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lineData = {
    labels: sorted.map((d) => d.date),
    datasets: [
      {
        label: "감정 점수 변화",
        data: sorted.map((d) => emotionScore[d.emotion]),
        borderColor: "#ff9aa0",
        backgroundColor: "#ffb5bd70",
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // -----------------------------------------------------
  // 반환 UI
  // -----------------------------------------------------
  return (
    <main
      className="min-h-screen px-6 py-14 relative"
      style={{
        backgroundColor: "#f6f2e9",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      <MainButton />

      <h1 className="text-center text-5xl font-serif font-bold text-stone-800 mb-16 tracking-wide">
        📊 감정 통계
      </h1>

      {!chartLoaded ? (
        <p className="text-center text-lg">차트를 불러오는 중이에요...</p>
      ) : (
        <>
          {/* 차트 카드 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14"
          >
            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8]">
              <h2 className="text-xl font-semibold mb-6">📌 감정 빈도</h2>
              <Bar data={barData} />
            </div>

            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8]">
              <h2 className="text-xl font-semibold mb-6">📌 감정 비율</h2>
              <Doughnut data={doughnutData} />
            </div>

            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8] col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">📌 감정 변화 흐름</h2>
              <Line data={lineData} />
            </div>
          </motion.div>

          {/* GPT 분석 */}
          {aiResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto mt-20 p-10 rounded-3xl bg-white/70 shadow border border-[#e8e2d8]"
            >
              <h2 className="text-3xl font-semibold mb-6">✨ 이번 주 감정 분석 (GPT)</h2>

              <p className="text-lg mb-6 whitespace-pre-line leading-relaxed">
                {aiResult.summary}
              </p>

              <h3 className="text-2xl font-semibold mb-4">🌿 조언</h3>
              <p className="text-lg whitespace-pre-line leading-relaxed">
                {aiResult.advice}
              </p>

              <h3 className="text-2xl font-semibold mb-4">🌼 활동 추천</h3>
              <ul className="list-disc ml-6 text-lg">
                {aiResult.activities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}
