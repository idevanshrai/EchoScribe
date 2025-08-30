# 🎙️ EchoScribe (Voice-to-Notes Offline)

EchoScribe is a lightweight backend service that lets you **transcribe and summarize audio locally** — no internet, no external APIs. Powered by modern speech recognition and summarization models, it’s ideal for privacy-focused note-taking, research, and productivity.

---

## ✨ Features
- 🔊 **Automatic Speech Recognition (ASR)** – Convert spoken audio into accurate transcripts.  
- 📝 **Summarization** – Generate concise summaries from transcripts.  
- ⏱️ **Segmented Transcripts** – Time-stamped segments for better readability.  
- 🛡️ **Offline First** – Runs fully on your machine (no API calls).  
- ⚡ **FastAPI Backend** – Simple REST API that can be used with any frontend.  

---

## 🗂️ Project Structure
```

voice-notes-offline/
├── backend/
│   ├── app.py              # FastAPI app (entrypoint)
│   ├── asr.py              # Speech-to-text pipeline
│   ├── summarizer.py       # Summarization pipeline
│   ├── client.py           # Example API client
│   ├── download\_models.py  # Script to fetch required models
│   ├── requirements.txt    # Python dependencies
│   └── setup.sh            # One-click environment setup
├── .gitignore
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/idevanshrai/EchoScribe.git
cd voice-notes-offline/backend
````

### 2. Set up environment

```bash
python3 -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows (PowerShell)
pip install -r requirements.txt
```

### 3. Download models

```bash
python download_models.py
```

### 4. Start the server

```bash
uvicorn app:app --reload
```

Your API will be available at:
👉 `http://127.0.0.1:8000`

---

## 🎯 Usage

### API Endpoints

* **POST /process**
  Upload an audio file and get the transcript, summary, and segments.
  Example using `curl`:

  ```bash
  curl -s -X POST -F "audio=@test.wav" http://127.0.0.1:8000/process
  ```

* **POST /transcribe**
  Get raw transcription only.

* **POST /summarize**
  Summarize raw text input.

---

## 🧪 Example

Using a sample 40-second `.wav` file:

```bash
curl -L -o test.wav https://github.com/pyannote/pyannote-audio/raw/develop/tutorials/assets/sample.wav
curl -s -X POST -F "audio=@test.wav" http://127.0.0.1:8000/process
```

**Response (shortened):**

```json
{
  "transcript": "Hello. Hello. Oh, hello. I didn't know you were there...",
  "summary": "Two people greet each other, talk about being from Chicago/New Jersey/Texas.",
  "segments": [
    {"start": 6.38, "end": 12.38, "text": "Hello. Hello. Oh, hello..."},
    {"start": 12.38, "end": 17.38, "text": "This is Diane in New Jersey..."}
  ]
}
```

---

## ⚙️ Requirements

* Python 3.10
* [FFmpeg](https://ffmpeg.org/) (for audio format handling)
* CPU is enough for smaller models, GPU recommended for speed

---

## 📌 Roadmap

* [ ] Add speaker diarization (who said what)
* [ ] Frontend dashboard for easy upload/playback
* [ ] Model customization (choose between small, base, large)

---

## 🤝 Contributing

Pull requests are welcome! If you’d like to contribute major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.
