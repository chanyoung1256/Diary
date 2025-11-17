// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// export async function apiFetch(endpoint: string, options: RequestInit = {}) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// // ==========================
// // 기존 기능
// // ==========================
// export function getDiariesByDate(username: string, date: string) {
//   return apiFetch(`/diary/date?username=${username}&date=${date}`);
// }

// export function analyzeDiaries(username: string, date: string) {
//   return apiFetch(`/ai/analyze?username=${username}&date=${date}`);
// }

// // ==========================
// // ⭐ 추가된 마이페이지 기능
// // ==========================

// // 📌 1) 전체 일기 가져오기
// export function getAllDiaries(username: string) {
//   return apiFetch(`/diary/all?username=${username}`);
// }

// // 📌 2) AI 분석 기록 가져오기
// export function getAiHistory(username: string) {
//   return apiFetch(`/ai/history?username=${username}`);
// }

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ==========================
// 기존 기능
// ==========================
export function getDiariesByDate(username: string, date: string) {
  return apiFetch(`/diary/date?username=${username}&date=${date}`);
}

export function analyzeDiaries(username: string, date: string) {
  return apiFetch(`/ai/analyze?username=${username}&date=${date}`);
}

// ==========================
// ⭐ 마이페이지 기능 추가
// ==========================

// 📌 1) 전체 일기 가져오기
export function getAllDiaries(username: string) {
  return apiFetch(`/diary/all?username=${username}`);
}

// 📌 2) AI 분석 기록 가져오기
export function getAiHistory(username: string) {
  return apiFetch(`/ai/history?username=${username}`);
}

// 📌 3) 출석 날짜 불러오기
export function getAttendanceDates(username: string) {
  return apiFetch(`/attendance/list?username=${username}`);
}

// 📌 4) 비밀번호 변경
export function updatePassword(username: string, oldPassword: string, newPassword: string) {
  return apiFetch(`/user/change-password`, {
    method: "POST",
    body: JSON.stringify({
      username,
      oldPassword,
      newPassword,
    }),
  });
}

// 📌 5) (선택) 회원 정보 가져오기
export function getUserInfo(username: string) {
  return apiFetch(`/user/info?username=${username}`);
}
