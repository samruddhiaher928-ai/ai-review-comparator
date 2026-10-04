import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.llm import ask_llm
from src.prompts import (
    SUMMARIZE_SYSTEM, summarize_prompt,
    COMPARE_SYSTEM, compare_prompt,
)
from src.models import (
    SummarizeRequest, SummaryResponse,
    CompareRequest, CompareResponse,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="AI Review Comparator", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw
        raw = raw.rsplit("```", 1)[0]
    return raw.strip()


@app.post("/summarize", response_model=SummaryResponse)
def summarize(req: SummarizeRequest):
    try:
        raw = ask_llm(SUMMARIZE_SYSTEM, summarize_prompt(req.product, req.reviews))
        data = json.loads(_clean_json(raw))
    except Exception as e:
        logger.exception("summarize failed")
        raise HTTPException(500, str(e))

    return SummaryResponse(
        product=req.product,
        pros=data.get("pros", []),
        cons=data.get("cons", []),
        sentiment=data.get("sentiment", "mixed"),
        summary=data.get("summary", ""),
    )


@app.post("/compare", response_model=CompareResponse)
def compare(req: CompareRequest):
    try:
        raw = ask_llm(COMPARE_SYSTEM, compare_prompt(req.product_a, req.product_b, req.context))
        data = json.loads(_clean_json(raw))
    except Exception as e:
        logger.exception("compare failed")
        raise HTTPException(500, str(e))

    return CompareResponse(
        product_a=req.product_a,
        product_b=req.product_b,
        verdict=data.get("verdict", ""),
        recommendation=data.get("recommendation", ""),
    )