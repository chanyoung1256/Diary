"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Diary = {
  id: number;
  username: string;
  date: string;
  content: string;
  emotion: string;
};

export default function DiaryListPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [list, setList] = useState<Diary[]>([]);
  const [filteredList, setFilteredList] = useState<Diary[]>([]);

  const [editing, setEditing] = useState<Diary | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editEmotion, setEditEmotion] = useState("");

  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("전체");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const emotions = ["전체", "😊", "😢", "😡", "😌", "🤔", "🥰"];

  const emotionColor = {
    "😊": "bg-[#fff5c8]/90",
    "😢": "bg-[#d9eaff]/85",
    "😡": "bg-[#ffd6d6]/85",
    "😌": "bg-[#e6ffe6]/85",
    "🤔": "bg-[#f2eaff]/85",
    "🥰": "bg-[#ffe0ef]/85",
    "전체": "bg-[#fffdf6]/90",
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);

      fetch(`http://localhost:8080/diary/list?username=${u.username}`)
        .then((res) => res.json())
        .then((data) => {
          setList(data);
          setFilteredList(data);
        });
    }
  }, []);

  useEffect(() => {
    let result = [...list];

    result = result.filter(
      (item) =>
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.date.includes(search) ||
        item.emotion.includes(search)
    );

    if (emotionFilter !== "전체") {
      result = result.filter((item) => item.emotion === emotionFilter);
    }

    result.sort((a, b) =>
      sortOrder === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

    setFilteredList(result);
  }, [search, emotionFilter, sortOrder, list]);

  const deleteDiary = async (id: number) => {
    const res = await fetch(`http://localhost:8080/diary/delete/${id}`, {
      method: "DELETE",
    });

    alert(await res.text());
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };

  const startEdit = (item: Diary) => {
    setEditing(item);
    setEditContent(item.content);
    setEditEmotion(item.emotion);
  };

  const submitEdit = async () => {
    if (!editing) return;

    const res = await fetch("http://localhost:8080/diary/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        username: editing.username,
        date: editing.date,
        content: editContent,
        emotion: editEmotion,
      }),
    });

    alert(await res.text());

    const updatedList = list.map((item) =>
      item.id === editing.id
        ? { ...item, content: editContent, emotion: editEmotion }
        : item
    );

    setList(updatedList);
    setEditing(null);
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
      {/* 🌟 메인 페이지로 이동 버튼 */}
      <motion.button
        onClick={() => (window.location.href = "/main")}
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

      <h1 className="text-4xl font-bold text-center mb-10 text-[#4f473b] tracking-wide">
        🌙 감정일기 기록 모음
      </h1>

      {/* 검색 / 필터 박스 */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-10 p-6 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl border border-[#e8e2d8]"
      >
        <input
          type="text"
          placeholder="🔍 검색 (내용, 날짜, 감정)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border bg-[#fdfbf6] mb-4"
        />

        <div className="flex flex-wrap gap-4">
          <select
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
            className="p-3 rounded-xl bg-[#fcf8f1] border"
          >
            {emotions.map((e) => (
              <option key={e} value={e}>
                감정: {e}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="p-3 rounded-xl bg-[#fcf8f1] border"
          >
            <option value="desc">✨ 최신순</option>
            <option value="asc">📁 오래된순</option>
          </select>
        </div>
      </motion.div>

      {/* 리스트 */}
      <div className="grid gap-10 max-w-4xl mx-auto">
        {filteredList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -45 : 45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className={`p-7 rounded-2xl shadow-[0_5px_16px_rgba(0,0,0,0.08)]
             border border-[#e7dfd4] relative hover:shadow-xl transition
             ${emotionColor?.[item.emotion as keyof typeof emotionColor]}`}
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/notebook.png')",
            }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-6 rounded-sm opacity-90"
              style={{
                backgroundColor: "#f4e4a1",
                transform: "rotate(-3deg)",
              }}
            />

            <div className="flex justify-between items-center mb-3">
              <div className="text-4xl drop-shadow">{item.emotion}</div>

              <div className="text-lg font-semibold px-4 py-1 bg-white/70 rounded-full shadow-sm border border-[#e6dfd3]">
                {item.date}
              </div>
            </div>

            {editing?.id === item.id ? (
              <>
                <textarea
                  className="w-full p-3 border rounded-xl bg-white/70 mt-3"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />

                <input
                  value={editEmotion}
                  onChange={(e) => setEditEmotion(e.target.value)}
                  className="w-full p-3 mt-3 border rounded-xl bg-white/70"
                />

                <button
                  onClick={submitEdit}
                  className="mt-4 w-full py-3 bg-[#7fcf9a] rounded-xl text-white font-semibold"
                >
                  수정 완료
                </button>
              </>
            ) : (
              <>
                <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-[#544c40]">
                  {item.content}
                </p>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 py-2 bg-[#ffe2a9] rounded-xl shadow text-[#4a3f2d]"
                  >
                    ✏️ 수정
                  </button>

                  <button
                    onClick={() => deleteDiary(item.id)}
                    className="flex-1 py-2 bg-[#f8b4a6] rounded-xl shadow text-[#4a3f2d]"
                  >
                    🗑 삭제
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
