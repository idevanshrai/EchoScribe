import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydub import AudioSegment

from asr import load_asr, transcribe_file
from summarizer import load_summarizer, summarize_text

from typing import Optional
from faster_whisper import WhisperModel
from fastapi.middleware.cors import CORSMiddleware

# Single app instance
app = FastAPI(title="Voice-to-Notes Offline API")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, allow all. Later, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy globals
_ASR: Optional[WhisperModel] = None
_SUMM = None

def ensure_models():
    global _ASR, _SUMM
    if _ASR is None:
        _ASR = load_asr()
    if _SUMM is None:
        _SUMM = load_summarizer()

def convert_to_wav_mono_16k(src_path: str) -> str:
    audio = AudioSegment.from_file(src_path)
    audio = audio.set_channels(1).set_frame_rate(16000)
    fd, out_path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    audio.export(out_path, format="wav")
    return out_path

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    ensure_models()
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            data = await audio.read()
            tmp.write(data)
            tmp_path = tmp.name

        wav_path = convert_to_wav_mono_16k(tmp_path)
        text, segments = transcribe_file(_ASR, wav_path)
        os.remove(tmp_path)
        os.remove(wav_path)
        return JSONResponse({"transcript": text, "segments": segments})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize(payload: dict):
    ensure_models()
    text = payload.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Missing 'text'")
    try:
        summary = summarize_text(_SUMM, text)
        return JSONResponse({"summary": summary})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
async def process(audio: UploadFile = File(...)):
    ensure_models()
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            data = await audio.read()
            tmp.write(data)
            tmp_path = tmp.name

        wav_path = convert_to_wav_mono_16k(tmp_path)
        text, segments = transcribe_file(_ASR, wav_path)
        summary = summarize_text(_SUMM, text)

        os.remove(tmp_path)
        os.remove(wav_path)

        return JSONResponse({"transcript": text, "summary": summary, "segments": segments})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
