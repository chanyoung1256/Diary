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
