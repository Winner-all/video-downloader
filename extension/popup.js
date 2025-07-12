// extension/popup.js

document.getElementById("sendBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value;

  if (!url) {
    alert("请输入视频链接！");
    return;
  }

  const port = chrome.runtime.connectNative("com.yourdomain.ytdlp_downloader");

  let hasResponse = false;

  port.onMessage.addListener((msg) => {
    hasResponse = true;

    document.getElementById("result").textContent =
      msg.success
        ? "✅ 下载成功:\n" + msg.stdout
        : "❌ 下载失败:\n" + (msg.stderr || msg.error || "未知错误");
  });

  port.onDisconnect.addListener(() => {
    // 如果之前已经成功收到消息，就不再报通信错误
    if (chrome.runtime.lastError && !hasResponse) {
      document.getElementById("result").textContent =
        "❌ 通信错误: " + chrome.runtime.lastError.message;
    }
  });

  port.postMessage({
    url: url,
    headers: {
      "User-Agent": navigator.userAgent,
      "Referer": "https://www.bilibili.com/"
    },
    cookies: "D:/VSCode/VCWork/videoDownload/downloader/cookies.txt",  // 确保这个路径存在
    output_dir: "D:/VideoDownloader/downloads",
    proxy: null
  });
});
