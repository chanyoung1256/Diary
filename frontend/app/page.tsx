"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Line = { id: number; path: string; color: string };

export default function HomePage() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const pencilSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    pencilSound.current = new Audio("/sounds/pencil.mp3");
    pencilSound.current.volume = 0;
    pencilSound.current.play().then(() => {
      pencilSound.current!.pause();
      pencilSound.current!.currentTime = 0;
      pencilSound.current!.volume = 0.3;
    });
  }, []);

  useEffect(() => {
    if (bookRef.current) {
      const rect = bookRef.current.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    }
  }, []);

  // 더 감성적인 파스텔 컬러
  const colors = [
    "#e88c92", // soft red  
    "#f3c56e", // warm yellow  
    "#8db8d6", // light blue  
    "#9ed9a3", // mint green  
    "#c3a2e5", // lavender  
    "#f0a774"  // peach  
  ];

  const generatePath = () => {
    const sx = Math.random() * bounds.width;
    const sy = Math.random() * bounds.height;
    const cx1 = sx + (Math.random() * 300 - 150);
    const cy1 = sy + (Math.random() * 300 - 150);
    const cx2 = sx + (Math.random() * 300 - 150);
    const cy2 = sy + (Math.random() * 300 - 150);
    const ex = sx + (Math.random() * 300 - 150);
    const ey = sy + (Math.random() * 300 - 150);
    return `M${sx},${sy} C${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}`;
  };

  const handleHover = () => {
    if (!bounds.width || !bounds.height) return;

    if (pencilSound.current) {
      const s = pencilSound.current.cloneNode() as HTMLAudioElement;
      s.volume = 0.25;
      s.play().catch(() => {});
    }

    const count = Math.floor(Math.random() * 3) + 4;
    const newLines: Line[] = [];

    for (let i = 0; i < count; i++) {
      const id = Date.now() + i;
      const path = generatePath();
      const color = colors[Math.floor(Math.random() * colors.length)];
      newLines.push({ id, path, color });
    }

    setLines((prev) => [...prev, ...newLines]);

    setTimeout(() => {
      setLines((prev) =>
        prev.filter((l) => !newLines.map((nl) => nl.id).includes(l.id))
      );
    }, 4000);
  };

  return (
    <main
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, #f9f4ec, #f3efe7)", 
      }}
    >
      {/* 📖 감성 다이어리 */}
      <motion.div
        ref={bookRef}
        initial={{ scale: 0.95, opacity: 0, y: -40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative flex w-[92vw] max-w-6xl h-[85vh]
                   rounded-[1.8rem]
                   shadow-[0_18px_55px_rgba(0,0,0,0.25)]
                   border border-[#d6cfc4]
                   overflow-hidden bg-[#fdfbf8]"
        style={{
          transform: "rotate(0.8deg)",
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
        }}
      >
        {/* 📄 LEFT PAGE */}
        <div
          className="relative w-1/2 h-full border-r border-[#d4cbc1]
                    bg-gradient-to-b from-[#fcfbf7] to-[#f7f5f1]"
        >
          {/* 🧾 노트 줄 */}
          <div className="absolute inset-0 
                          bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_28px,#d7dce2_29px)] 
                          opacity-45"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">

            {/* Polaroid-style video */}
            <div className="relative w-[85%] max-w-[600px] aspect-[16/9]
                            rounded-xl overflow-hidden bg-white/80
                            shadow-[0_12px_28px_rgba(0,0,0,0.22)]
                            border border-[#d7d3c8] backdrop-blur-md">

              <iframe
                src="https://www.youtube.com/embed/ScMzIvxBSi4"
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            {/* 설명 */}
            <p className="mt-6 text-stone-700 text-lg text-center leading-relaxed font-medium font-serif">
              감정일기를 더 잘 활용하는 방법을<br />
              영상으로 확인해보세요 🍃
            </p>
          </div>
        </div>

        {/* 📄 RIGHT PAGE */}
        <div
          className="relative w-1/2 h-full
                     bg-gradient-to-b from-[#fffdf9] to-[#f6f4f0]"
        >
          <div className="absolute inset-0 
                          bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_28px,#e5e7eb_29px)]
                          opacity-45"></div>

          <div className="relative z-10 flex flex-col justify-between h-full p-10">

            {/* HEADER */}
            <div className="text-center mt-6">
              <h1 className="text-6xl font-serif font-bold text-stone-800 tracking-tight">
                감정일기
              </h1>
              <p className="text-stone-700 text-lg mt-4 font-serif">
                연필을 눌러 하루를 기록해보세요 ✏️
              </p>
            </div>

            {/* INPUT */}
            <div className="w-full h-[48%] border-t border-stone-300 pt-4 bg-transparent">
              <textarea
                placeholder="오늘 하루는 어떤 감정이었나요?"
                className="w-full h-full resize-none bg-transparent outline-none text-xl font-serif leading-relaxed placeholder:text-stone-400 text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* 📚 중앙 접힌 선 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[4px]
                        bg-gradient-to-b from-[#cfc8be] via-[#b9b2aa] to-[#cfc8be]
                        shadow-[inset_0_0_14px_rgba(0,0,0,0.3)]"></div>

        {/* 🎨 감성 낙서 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]">
          <defs>
            <filter id="blurFilter">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          {lines.map((line) => (
            <motion.path
              key={line.id}
              d={line.path}
              stroke={line.color}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              filter="url(#blurFilter)"
              initial={{ pathLength: 0, opacity: 0.9 }}
              animate={{ pathLength: 1, opacity: [0.9, 0.7, 0] }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ✏️ 연필 */}
      <motion.div
        onMouseEnter={handleHover}
        onClick={() => router.push("/login")}
        initial={{ rotate: 90, y: 10 }}
        animate={{ rotate: [90, 95, 90], y: [10, 15, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[5vw] bottom-[6vh]
                   text-[12rem] md:text-[14rem] lg:text-[15rem]
                   cursor-pointer select-none
                   hover:scale-110 hover:rotate-[95deg]
                   transition-all duration-300 ease-out z-[30]"
      >
        ✏️
      </motion.div>
    </main>
  );
}
