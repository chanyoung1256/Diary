const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "서버 통신 오류");
    }

    return await res.json();
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
}

// ✨ 로그인 요청 (Spring 연동 대비)
export async function loginAPI(email: string, password: string) {
  // 현재는 Spring 없으니 가짜 delay로 처리
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Mock Login:", email, password);

  // ✅ 나중엔 이렇게 교체
  // return apiFetch("/api/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });

  return { token: "fake_jwt_token", email };
}

// ✨ 회원가입 요청
export async function signupAPI(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Mock Signup:", email);

  // 나중에 Spring 엔드포인트로 교체
  // return apiFetch("/api/signup", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });

  return { success: true };
}
