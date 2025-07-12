// popup.js

// ✅ 按钮 1：提取当前页面视频链接
// document.getElementById("detectBtn").addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => {
//       return window.__EXTRACTED_VIDEO_URL__ || null;
//     }
//   }, (results) => {
//     const result = results?.[0]?.result;
//     if (result) {
//       document.getElementById("urlInput").value = result;
//     } else {
//       alert("未检测到当前页面的视频链接！");
//     }
//   });
// });
    document.getElementById("detectBtn").addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab && tab.url && tab.url.startsWith("http")) {
        document.getElementById("urlInput").value = tab.url;
      } else {
        alert("无法获取当前标签页的链接！");
      }
    });



// ✅ 按钮 2：发送链接给本地服务下载
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
    cookies: "D:/VSCode/VCWork/videoDownload/downloader/cookies.txt",
    output_dir: "D:/VideoDownloader/downloads",
    proxy: null
  });
});
