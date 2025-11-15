import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const username = "chanyoung"; // 로그인 사용자에 맞게 설정 가능

  const SPRING_URL = `http://localhost:8080/ai/analyze?username=${username}&date=${date}`;

  const res = await fetch(SPRING_URL);
  const data = await res.json();

  return NextResponse.json(data);
}
