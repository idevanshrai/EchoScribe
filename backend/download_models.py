from huggingface_hub import snapshot_download
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

def download_asr_model():
    print("Downloading ASR model: Systran/faster-whisper-small")
    snapshot_download(
        repo_id="Systran/faster-whisper-small",
        local_dir=os.path.join(MODELS_DIR, "faster-whisper-small"),
        local_dir_use_symlinks=False
    )

def download_summarizer_model():
    print("Downloading summarizer model: philschmid/bart-large-cnn-samsum")
    snapshot_download(
        repo_id="philschmid/bart-large-cnn-samsum",
        local_dir=os.path.join(MODELS_DIR, "samsum-bart"),
        local_dir_use_symlinks=False
    )

if __name__ == "__main__":
    os.makedirs(MODELS_DIR, exist_ok=True)
    download_asr_model()
    download_summarizer_model()
    print("✅ All models downloaded locally into ./models/")
