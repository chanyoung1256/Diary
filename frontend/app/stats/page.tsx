"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// ------------------------
// 메인으로 버튼 (차녕 스타일)
// ------------------------
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

// ------------------------
// Chart.js 동적 import
// ------------------------
const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((m) => m.Doughnut),
  { ssr: false }
);
const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), { ssr: false });

type Diary = {
  id: number;
  username: string;
  date: string;
  content: string;
  emotion: string;
};

export default function StatsPage() {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [weekData, setWeekData] = useState<Diary[]>([]);

  const emotions = ["😊", "😢", "😡", "😌", "🤔", "🥰"];

  // ------------------------
  // Chart.js register
  // ------------------------
  useEffect(() => {
    async function loadCharts() {
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
    loadCharts();
  }, []);

  // ------------------------
  // 데이터 불러오기
  // ------------------------
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

  // ------------------------
  // 감정 집계
  // ------------------------
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

  // ------------------------
  // 감정 점수화
  // ------------------------
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
        tension: 0.35,
        backgroundColor: "#ffb5bd70",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // ------------------------
  // GPT 감성 메시지
  // ------------------------
  const summaryGPT =
    weekData.length === 0
      ? "지난 7일 동안 작성된 일기가 없어서 감정을 분석하기 어려웠어요."
      : (() => {
          const most = emotions.reduce((a, b) =>
            emotionCount[a] > emotionCount[b] ? a : b
          );

          return `지난 7일 동안 가장 두드러진 감정은 ${most} 이었어요.
이 감정은 차녕님의 최근 하루하루가 어떤 느낌으로 흘러갔는지 알려주는 중요한 신호예요.`;
        })();

  const activityGPT = `
감정을 억누르는 대신, 조용히 바라보는 시간을 가져보면 도움이 될 수 있어요.
오늘은 산책 10분, 좋아하는 음악 한 곡, 따뜻한 차 한 잔으로
마음을 천천히 풀어보는 건 어떨까요?
`;

  return (
    <main
      className="min-h-screen px-6 py-14 relative"
      style={{
        backgroundColor: "#f6f2e9",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      {/* 메인으로 버튼 */}
      <MainButton />

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-5xl font-serif font-bold text-stone-800 mb-16 tracking-wide"
      >
        📊 감정 통계
      </motion.h1>

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
            {/* Bar */}
            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8]">
              <h2 className="text-xl font-semibold mb-6">📌 감정 빈도</h2>
              <Bar data={barData} />
            </div>

            {/* Doughnut */}
            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8]">
              <h2 className="text-xl font-semibold mb-6">📌 감정 비율</h2>
              <Doughnut data={doughnutData} />
            </div>

            {/* Line */}
            <div className="p-8 rounded-3xl bg-white/80 shadow border border-[#e8e2d8] col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">📌 감정 변화 흐름</h2>
              <Line data={lineData} />
            </div>
          </motion.div>

          {/* GPT 분석 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto mt-20 p-10 rounded-3xl bg-white/70 shadow border border-[#e8e2d8]"
          >
            <h2 className="text-3xl font-semibold mb-6">✨ 감정 요약</h2>
            <p className="text-lg mb-6 whitespace-pre-line leading-relaxed">{summaryGPT}</p>

            <h3 className="text-2xl font-semibold mb-4">🌿 추천 활동</h3>
            <p className="text-lg whitespace-pre-line leading-relaxed">{activityGPT}</p>
          </motion.div>
        </>
      )}
    </main>
  );
}
