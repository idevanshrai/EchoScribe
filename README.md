# Voice-to-Notes (Offline) — FastAPI Backend

This is a minimal, **offline-first** backend for a Voice-to-Notes Summarizer.
It runs *speech-to-text* with **faster-whisper** (CTranslate2) and *summarization* with a local **Transformers** model.
Tested on macOS Apple Silicon (M-series).

## Features
- Offline ASR (Whisper via `faster-whisper`).
- Offline summarization (`transformers` with `sshleifer/distilbart-cnn-12-6`).
- Endpoints to transcribe, summarize, and process audio end-to-end.
- Script to **pre-download** model weights into `./models` so you can run completely offline afterward.

## Prereqs (macOS)
- **Homebrew** (https://brew.sh)
- **Python 3.10+** (or pyenv)
- **ffmpeg**: `brew install ffmpeg`

## Setup (one time)
```bash
cd backend
# 1) Create virtualenv
python3 -m venv .venv
source .venv/bin/activate

# 2) Install deps
pip install --upgrade pip wheel
pip install -r requirements.txt

# 3) (If not installed) ffmpeg
#   brew install ffmpeg

# 4) Download models to ./models (so you can work offline)
python download_models.py
```

> The download step will fetch:  
> - Whisper (CT2) model: `Systran/faster-whisper-small`  
> - Summarizer model: `sshleifer/distilbart-cnn-12-6`

## Run
```bash
# Activate env first:
source .venv/bin/activate

# Start API
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

## API
- `POST /transcribe` — form-data file: `audio` → `{ transcript, segments }`
- `POST /summarize` — JSON: `{ "text": "..." }` → `{ summary }`
- `POST /process` — form-data file: `audio` → full pipeline → `{ transcript, summary }`

## Notes
- Adjust model sizes in `download_models.py` if you want faster or more accurate ASR (`tiny`, `base`, `small`, `medium`, `large-v3`).
- For long audio, consider chunking (not implemented in this scaffold).

## Frontend (later)
You can add a simple Next.js/React frontend that hits these endpoints.
