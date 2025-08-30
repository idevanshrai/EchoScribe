#!/usr/bin/env bash
set -e

# macOS bootstrap for offline Voice-to-Notes backend
# Requires Homebrew installed.

echo "[1/7] Ensuring ffmpeg is installed..."
if ! command -v ffmpeg >/dev/null 2>&1; then
  brew install ffmpeg
fi

echo "[2/7] Creating virtualenv..."
python3 -m venv .venv
source .venv/bin/activate

echo "[3/7] Upgrading pip..."
pip install --upgrade pip wheel

echo "[4/7] Installing Python dependencies..."
pip install -r requirements.txt

echo "[5/7] Downloading models locally to ./models ..."
python download_models.py

echo "[6/7] Setting environment variables for PyTorch + Hugging Face..."
# Enable CPU fallback for unsupported MPS ops
export PYTORCH_ENABLE_MPS_FALLBACK=1
# Disable tokenizer parallelism warnings
export TOKENIZERS_PARALLELISM=false

echo "[7/7] Done. Start the server with:"
echo "source .venv/bin/activate && PYTORCH_ENABLE_MPS_FALLBACK=1 TOKENIZERS_PARALLELISM=false uvicorn app:app --host 127.0.0.1 --port 8000 --reload"
