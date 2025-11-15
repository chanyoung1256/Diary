"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function DiaryDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string; // 안전 처리

  const [diary, setDiary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/diary/get?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDiary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center mt-20 text-xl">로딩 중...</p>;

  if (!diary)
    return <p className="text-center mt-20 text-xl">일기를 불러올 수 없습니다.</p>;

  return (
    <main
      className="min-h-screen py-12 px-6 relative"
      style={{
        backgroundColor: "#f6f1e6",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      }}
    >
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.05 }}
        className="absolute top-6 left-6 px-4 py-2 bg-white rounded-xl shadow border"
      >
        ← 뒤로
      </motion.button>

      <div className="max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow border">
        <h1 className="text-4xl font-bold mb-4">{diary.date}</h1>
        <p className="text-2xl mb-4">감정: {diary.emotion}</p>

        <p className="whitespace-pre-line text-lg leading-relaxed">
          {diary.content}
        </p>
      </div>
    </main>
  );
}
