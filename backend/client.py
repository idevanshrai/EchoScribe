import requests, sys

# Quick test client for /process endpoint
# Usage: python client.py path/to/audio-file.wav

url = "http://127.0.0.1:8000/process"

path = sys.argv[1] if len(sys.argv) > 1 else None
if not path:
    print("Usage: python client.py <audio_file>")
    sys.exit(1)

with open(path, "rb") as f:
    files = {"audio": (path, f, "application/octet-stream")}
    r = requests.post(url, files=files, timeout=600)
    print(r.status_code)
    print(r.json())
