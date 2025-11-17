from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os
import json

# ----------------------------------------
# Load env
# ----------------------------------------
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_KEY:
    raise Exception("❌ .env에 OPENAI_API_KEY 없음!")

openai.api_key = OPENAI_KEY

# ----------------------------------------
# FastAPI
# ----------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# Models
# ----------------------------------------
class DiaryItem(BaseModel):
    id: int
    username: str
    date: str
    content: str
    emotion: str

class DiaryStats(BaseModel):
    diaries: list[DiaryItem]


# ---------------------------------------------------------
# ⭐ 2) 통계 분석 엔드포인트 (Next.js → FastAPI)
# ---------------------------------------------------------
@app.post("/analyze/stats")
async def analyze_stats(data: DiaryStats):
    texts = [d.content for d in data.diaries]

    # GPT에게 JSON으로 응답하도록 강제
    prompt = f"""
    다음 사용자의 7일 간 일기를 분석해줘.

    일기 내용:
    {texts}

    아래 JSON 형식으로만 대답해줘:

    {{
      "summary": "이번 주 감정 경향 한 문단 요약",
      "advice": "마음 관리 조언 한 문단",
      "activities": ["추천활동1", "추천활동2"]
    }}

    형식 틀리면 안 돼. 설명 절대 하지 마.
    """

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content.strip()

    # 💥 먼저 content가 비어 있는지 체크
    if not content:
        return {
            "summary": "AI 응답이 비어 있습니다.",
            "advice": "서버에서 분석을 다시 시도하세요.",
            "activities": []
        }

    try:
        result_json = json.loads(content)
    except Exception as e:
        print("❌ JSON 파싱 실패 → GPT 원본 출력:", content)
        return {
            "summary": "AI 응답을 처리하는 중 문제가 발생했습니다.",
            "advice": "서버를 다시 시도해 주세요.",
            "activities": []
        }

    return result_json


# ----------------------------------------
# 기본 루트
# ----------------------------------------
@app.get("/")
def root():
    return {"status": "FastAPI Running OK"}
