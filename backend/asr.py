import os
from faster_whisper import WhisperModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
ASR_DIR = os.path.join(MODELS_DIR, "faster-whisper-small")

def load_asr():
    """
    Load the Whisper ASR model.
    On Apple Silicon (M1/M2/M3/M4), 'metal' is preferred.
    If unsupported, fall back to 'cpu' automatically.
    """
    # Default to metal unless CT2_USE_METAL is explicitly set to 0
    use_metal = os.environ.get("CT2_USE_METAL", "1") == "1"
    compute_type = os.environ.get("CT2_COMPUTE_TYPE", "int8")

    device = "cpu"
    if use_metal:
        try:
            # Try initializing with metal
            model = WhisperModel(ASR_DIR, device="metal", compute_type=compute_type)
            print("[ASR] Running on Apple Metal backend")
            return model
        except ValueError:
            print("[ASR] Metal not supported in this ctranslate2 build, falling back to CPU")

    # Fallback: CPU
    model = WhisperModel(ASR_DIR, device="cpu", compute_type=compute_type)
    print("[ASR] Running on CPU backend")
    return model


def transcribe_file(model: WhisperModel, audio_path: str):
    """
    Transcribe audio file into text + segments.
    """
    segments, info = model.transcribe(audio_path, beam_size=1, vad_filter=True)
    transcript_text = []
    seg_list = []
    for seg in segments:
        transcript_text.append(seg.text.strip())
        seg_list.append({
            "start": seg.start,
            "end": seg.end,
            "text": seg.text.strip()
        })
    return " ".join(transcript_text).strip(), seg_list
