from pydantic import BaseModel
from typing import List, Literal


class SummarizeRequest(BaseModel):
    product: str
    reviews: str


class SummaryResponse(BaseModel):
    product: str
    pros: List[str]
    cons: List[str]
    sentiment: Literal["positive", "mixed", "negative"]
    summary: str


class CompareRequest(BaseModel):
    product_a: str
    product_b: str
    context: str = ""


class CompareResponse(BaseModel):
    product_a: str
    product_b: str
    verdict: str
    recommendation: str