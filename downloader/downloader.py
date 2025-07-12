# downloader/downloader.py

import struct
import sys
import json
import subprocess
import os

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('<I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('<I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def run_yt_dlp(url, headers=None, cookies=None, output_dir=None, proxy=None):
    cmd = ["yt-dlp", url]

    if headers:
        for k, v in headers.items():
            cmd += ["--add-header", f"{k}: {v}"]

    if cookies and os.path.isfile(cookies):
        cmd += ["--cookies", cookies]

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        cmd += ["-o", os.path.join(output_dir, "%(title)s.%(ext)s")]
    else:
        cmd += ["-o", "%(title)s.%(ext)s"]

    cmd += ["--merge-output-format", "mp4"]

    if proxy:
        cmd += ["--proxy", proxy]

    # 日志
    with open("log.txt", "a", encoding="utf-8") as f:
        f.write("运行命令: " + " ".join(cmd) + "\n")

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "success": result.returncode == 0
    }

if __name__ == '__main__':
    try:
        with open("log.txt", "a", encoding="utf-8") as f:
            f.write("✅ downloader.py 被调用\n")

        data = read_message()
        url = data.get("url")
        headers = data.get("headers", {})
        cookies = data.get("cookies")
        output_dir = data.get("output_dir")
        proxy = data.get("proxy")

        if url:
            result = run_yt_dlp(url, headers, cookies, output_dir, proxy)
            send_message(result)
        else:
            send_message({"success": False, "error": "未收到URL"})
    except Exception as e:
        send_message({"success": False, "error": str(e)})
