import os, re, uuid
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="STAT-ADAPT API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COURSES = [
    {"id":1,"title":"Python for Official Statistics","provider":"iGOT / Demo Catalogue","level":"Beginner","domain":"Python","duration":"4 weeks","progress":0},
    {"id":2,"title":"Statistical Analysis & Inference","provider":"NSSTA / Demo Catalogue","level":"Intermediate","domain":"Statistical Analysis","duration":"3 weeks","progress":0},
    {"id":3,"title":"Data Visualization with Python","provider":"iGOT / Demo Catalogue","level":"Intermediate","domain":"Data Visualization","duration":"2 weeks","progress":0},
    {"id":4,"title":"Machine Learning Fundamentals","provider":"iGOT / Demo Catalogue","level":"Advanced","domain":"Machine Learning","duration":"5 weeks","progress":0},
]

class AssessmentItem(BaseModel):
    domain: str
    score: int

class Assessment(BaseModel):
    items: List[AssessmentItem]

@app.get("/api/health")
def health():
    return {"status":"ok","service":"STAT-ADAPT API"}

@app.get("/api/courses")
def courses():
    return COURSES

@app.post("/api/assessment")
def assessment(payload: Assessment):
    scores = {}
    for item in payload.items:
        scores.setdefault(item.domain, []).append(item.score)
    result = {k: round(sum(v)/len(v)) for k,v in scores.items()}
    gaps = sorted(
        [{"domain": k, "score": v, "gap": 100-v} for k,v in result.items()],
        key=lambda x: x["score"]
    )
    return {
        "scores": result,
        "gaps": gaps,
        "overall": round(sum(result.values())/len(result)) if result else 0
    }

def extract_text(data: bytes, filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        try:
            from pypdf import PdfReader
            import io
            reader = PdfReader(io.BytesIO(data))
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            return ""
    return data.decode("utf-8", errors="ignore")

def make_mcqs(text: str, count: int = 5):
    # Demo RAG-style generation: selects informative sentences from the uploaded source.
    sentences = [re.sub(r"\s+", " ", s).strip() for s in re.split(r"(?<=[.!?])\s+", text)]
    sentences = [s for s in sentences if len(s) > 45]
    if not sentences:
        sentences = ["Official statistics provide reliable information for evidence-based decision making."]
    questions = []
    for i in range(min(count, len(sentences))):
        source = sentences[i]
        words = re.findall(r"[A-Za-z][A-Za-z-]{5,}", source)
        answer = words[0] if words else "statistics"
        question = f"According to the uploaded material, which statement is most directly supported by this passage?"
        options = [
            source[:140],
            "The passage contains no relevant information.",
            "The material only discusses unrelated administrative procedures.",
            "The passage states that the topic should never be measured."
        ]
        questions.append({
            "id": str(uuid.uuid4()),
            "question": question,
            "options": options,
            "answer": options[0],
            "explanation": "The correct option is grounded in the uploaded passage.",
            "difficulty": "Medium",
            "source": source[:300]
        })
    return questions

@app.post("/api/generate-quiz")
async def generate_quiz(file: UploadFile = File(...)):
    data = await file.read()
    text = extract_text(data, file.filename or "material.txt")
    if not text.strip():
        raise HTTPException(400, "Could not extract readable text from this file.")
    return {"filename": file.filename, "questions": make_mcqs(text), "source_chars": len(text)}

@app.get("/api/dashboard")
def dashboard():
    return {
        "overall": 68,
        "gaps": [
            {"domain":"Machine Learning","score":42,"priority":"High"},
            {"domain":"Data Visualization","score":55,"priority":"High"},
            {"domain":"Python","score":64,"priority":"Medium"},
            {"domain":"Statistical Analysis","score":82,"priority":"Low"},
        ],
        "progress": 61,
        "quiz_average": 78,
        "courses_completed": 3
    }
