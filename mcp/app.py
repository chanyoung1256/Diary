from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os

# ----------------------------------------
# Load .env
# ----------------------------------------
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_KEY:
    raise Exception("❌ .env에 OPENAI_API_KEY가 없습니다!")

openai.api_key = OPENAI_KEY

# ----------------------------------------
# FastAPI 설정
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
# 모델
# ----------------------------------------
class DiaryItems(BaseModel):
    contents: list[str]


# ----------------------------------------
# 2) 여러 문장 감정 분석 + 위로 + 조절 팁 + 추천 활동
# ----------------------------------------
@app.post("/analyze/multiple")
async def analyze_multiple(diary: DiaryItems):
    results = []

    for content in diary.contents:

        # 1) 감정 분석
        emotion_prompt = f"다음 문장의 감정을 한 단어로 알려줘: {content}"
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": emotion_prompt}],
        )
        emotion = response.choices[0].message.content.strip()

        # 2) 위로 메시지
        comfort_prompt = f"""
        감정: {emotion}
        일기: {content}

        사용자에게 진심어린 위로 한 문장을 작성해줘.
        과한 표현 없이 부드럽고 현실적인 문장으로.
        """
        comfort_res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": comfort_prompt}],
        )
        comfort_message = comfort_res.choices[0].message.content.strip()

        # 3) 감정 조절 팁
        regulate_prompt = f"""
        감정: {emotion}
        간단하고 효과적인 감정 조절 팁 1~2개를 작성해줘.
        """
        regulate_res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": regulate_prompt}],
        )
        regulate_tip = regulate_res.choices[0].message.content.strip()

        # 4) 추천 활동
        activity_prompt = f"""
        감정: {emotion}
        감정 회복을 도와줄 활동 2개만 추천해줘. (산책, 음식, 음악 등)
        """
        activity_res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": activity_prompt}],
        )
        activity_recommendation = activity_res.choices[0].message.content.strip()

        results.append({
            "content": content,
            "emotion": emotion,
            "comfort_message": comfort_message,
            "regulate_tip": regulate_tip,
            "activity_recommendation": activity_recommendation
        })

    return {"results": results}


# ----------------------------------------
# 테스트 라우트
# ----------------------------------------
@app.get("/")
def root():
    return {"status": "FastAPI Running"}
