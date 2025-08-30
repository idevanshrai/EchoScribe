#!/usr/bin/env bash
set -e

# macOS bootstrap for offline Voice-to-Notes backend
# Requires Homebrew installed.

echo "[1/6] Ensuring ffmpeg is installed..."
if ! command -v ffmpeg >/dev/null 2>&1; then
  brew install ffmpeg
fi

echo "[2/6] Creating virtualenv..."
python3 -m venv .venv
source .venv/bin/activate

echo "[3/6] Upgrading pip..."
pip install --upgrade pip wheel

echo "[4/6] Installing Python dependencies..."
pip install -r requirements.txt

echo "[5/6] Downloading models locally to ./models ..."
python download_models.py

echo "[6/6] Done. Start the server with:"
echo "source .venv/bin/activate && uvicorn app:app --host 127.0.0.1 --port 8000 --reload"
