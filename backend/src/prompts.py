SUMMARIZE_SYSTEM = """You are a product review analyst. Respond ONLY in valid JSON:
{"pros": ["..."], "cons": ["..."], "sentiment": "positive|mixed|negative", "summary": "..."}"""


def summarize_prompt(product: str, reviews: str) -> str:
    return f"Product: {product}\n\nReviews:\n{reviews}\n\nRespond with JSON only."


COMPARE_SYSTEM = """You are a product comparison expert. Respond ONLY in valid JSON:
{"verdict": "...", "recommendation": "..."}"""


def compare_prompt(a: str, b: str, context: str) -> str:
    return f"Product A: {a}\nProduct B: {b}\nContext: {context}\n\nRespond with JSON only."