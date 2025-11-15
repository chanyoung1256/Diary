// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// export async function apiFetch(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<any> {
//   try {
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//       },
//       ...options,
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(errorText || "서버 통신 오류");
//     }

//     return await res.json();
//   } catch (err) {
//     console.error("API Fetch Error:", err);
//     throw err;
//   }
// }

// /* --------------------------------------------------
//    📌 ① 날짜별 일기 조회 - Spring Boot 연동
//    GET /diary/date?username=xxx&date=xxx
// -------------------------------------------------- */
// export async function getDiariesByDate(username: string, date: string) {
//   return apiFetch(`/diary/date?username=${username}&date=${date}`, {
//     method: "GET",
//   });
// }

// /* --------------------------------------------------
//    📌 ② AI 감정 분석 - Spring Boot → FastAPI
//    GET /ai/analyze?username=xxx&date=xxx
// -------------------------------------------------- */
// export async function analyzeDiaries(username: string, date: string) {
//   return apiFetch(`/ai/analyze?username=${username}&date=${date}`, {
//     method: "GET",
//   });
// }

// /* ----------------------- 기존 코드 유지 ----------------------- */
// export async function loginAPI(email: string, password: string) {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return { token: "fake_jwt_token", email };
// }

// export async function signupAPI(email: string, password: string) {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return { success: true };
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

export function getDiariesByDate(username: string, date: string) {
  return apiFetch(`/diary/date?username=${username}&date=${date}`);
}

export function analyzeDiaries(username: string, date: string) {
  return apiFetch(`/ai/analyze?username=${username}&date=${date}`);
}
