import os
import torch
from transformers import pipeline

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
SUMM_DIR = os.path.join(MODELS_DIR, "distilbart-cnn-12-6")

def load_summarizer():
    """
    Load summarization pipeline.
    Tries to use MPS (Apple GPU) if available, otherwise CPU.
    """
    device = 0 if torch.backends.mps.is_available() else -1
    print(f"[Summarizer] Using {'MPS' if device == 0 else 'CPU'} backend")
    return pipeline(
        "summarization",
        model=SUMM_DIR,
        tokenizer=SUMM_DIR,
        device=device,
        framework="pt"
    )

def summarize_text(summarizer, text: str) -> str:
    """
    Run summarization with adaptive lengths to avoid crashes on short text.
    """
    if not text or text.strip() == "":
        return ""

    # Set dynamic length params
    input_len = len(text.split())
    max_len = min(180, max(20, input_len))   # cap at 180, floor at 20
    min_len = max(5, input_len // 3)         # at least 5 tokens

    try:
        summary = summarizer(
            text,
            max_length=max_len,
            min_length=min_len,
            do_sample=False
        )
        return summary[0]["summary_text"]
    except Exception as e:
        print(f"[Summarizer] Error: {e}")
        return text  # fallback: just return original text
