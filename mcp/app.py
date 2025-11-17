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

class MultipleRequest(BaseModel):
    contents: list[str]


# ---------------------------------------------------------
# ⭐ 1) 하루 여러 일기 분석 엔드포인트 (Spring → FastAPI)
# ---------------------------------------------------------
@app.post("/analyze/multiple")
async def analyze_multiple(req: MultipleRequest):

    results = []

    for content in req.contents:
        prompt = f"""
        아래 감정일기 내용을 분석해줘:

        "{content}"

        아래 JSON 형식으로만 대답해줘:

        {{
            "emotion": "감정 한 단어",
            "comfort_message": "짧은 위로 문장",
            "regulate_tip": "감정 조절 팁 한 문장",
            "activity_recommendation": "추천 활동 한 문장"
        }}

        형식 벗어나면 안 돼.
        """

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
        )

        raw = response.choices[0].message.content.strip()

        try:
            data = json.loads(raw)
        except:
            data = {
                "emotion": "모름",
                "comfort_message": "AI 응답 오류",
                "regulate_tip": "",
                "activity_recommendation": ""
            }

        results.append({
            "content": content,
            **data
        })

    return {"results": results}


# ---------------------------------------------------------
# ⭐ 2) 주간 통계 분석 엔드포인트 (Next.js → FastAPI)
# ---------------------------------------------------------
@app.post("/analyze/stats")
async def analyze_stats(data: DiaryStats):
    texts = [d.content for d in data.diaries]

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

    형식 틀리면 안 돼.
    """

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content.strip()

    try:
        result_json = json.loads(content)
    except:
        result_json = {
            "summary": "AI 응답 오류",
            "advice": "",
            "activities": []
        }

    return result_json


# ----------------------------------------
# 기본
# ----------------------------------------
@app.get("/")
def root():
    return {"status": "FastAPI Running OK"}
