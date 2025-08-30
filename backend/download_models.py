import os
from huggingface_hub import snapshot_download

# Download locations (kept inside project so you can stay offline later)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# 1) Faster-Whisper (CTranslate2) model (small is a good balance on Apple Silicon)
ASR_REPO = "Systran/faster-whisper-small"

# 2) Summarizer model (DistilBART CNN)
SUMM_REPO = "sshleifer/distilbart-cnn-12-6"

def main():
    print(f"Downloading ASR model: {ASR_REPO}")
    asr_path = snapshot_download(
        repo_id=ASR_REPO,
        local_dir=os.path.join(MODELS_DIR, "faster-whisper-small"),
        local_dir_use_symlinks=False,
        revision=None,
    )
    print("ASR model saved to:", asr_path)

    print(f"Downloading summarizer model: {SUMM_REPO}")
    sum_path = snapshot_download(
        repo_id=SUMM_REPO,
        local_dir=os.path.join(MODELS_DIR, "distilbart-cnn-12-6"),
        local_dir_use_symlinks=False,
        revision=None,
    )
    print("Summarizer model saved to:", sum_path)

    print("All set. You can now run fully offline.")

if __name__ == "__main__":
    main()
