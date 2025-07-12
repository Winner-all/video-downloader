// extension/popup.js
import { extractCookiesAsNetscapeFormat, sendCookiesToNativeHost } from "./cookie-utils.js";

// --- Tab 切换逻辑 ---
document.querySelectorAll(".tab").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));

    const selected = tabBtn.dataset.tab;
    tabBtn.classList.add("active");
    document.getElementById(`tab-${selected}`).classList.remove("hidden");
  });
});

// 自动填充当前标签页地址
document.getElementById("detectBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url && tab.url.startsWith("http")) {
    document.getElementById("urlInput").value = tab.url;
  } else {
    alert("无法获取当前标签页的链接！");
  }
});

// 发送下载请求
document.getElementById("sendBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value;

  if (!url) {
    alert("请输入视频链接！");
    return;
  }

  // ✅ 自动根据 URL 构造 cookies 文件路径
  const hostname = new URL(url).hostname.replace(/\./g, "_");
  const cookiesPath = `D:/VSCode/VCWork/videoDownload/downloader/cookies_${hostname}.txt`;

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
      "Referer": url  // ✅ 改为自动使用当前视频地址作为 Referer
    },
    cookies: cookiesPath,
    output_dir: "D:/VideoDownloader/downloads",
    proxy: null
  });
});

// 提取当前页面 cookies 并保存
document.getElementById("getCookiesBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const cookieText = await extractCookiesAsNetscapeFormat(tab.url);

    const hostname = new URL(tab.url).hostname.replace(/\./g, "_");
    const filename = `cookies_${hostname}.txt`;

    const response = await sendCookiesToNativeHost(cookieText, filename);

    if (response.success) {
      alert(`✅ Cookies 已保存为 ${filename}`);
    } else {
      alert("❌ 保存失败：" + (response.error || response.stderr));
    }
  } catch (err) {
    alert("❌ 提取 cookies 失败：" + err.message);
  }
});

// --- 保存站点配置 ---
document.getElementById("saveSiteConfig").addEventListener("click", () => {
  const domain = document.getElementById("siteDomain").value.trim();
  const referer = document.getElementById("siteReferer").value.trim();
  const headers = document.getElementById("siteHeaders").value.trim();
  const cookieFile = document.getElementById("siteCookieFile").value.trim();

  if (!domain) {
    alert("请输入域名！");
    return;
  }

  let parsedHeaders = {};
  try {
    parsedHeaders = headers ? JSON.parse(headers) : {};
  } catch (err) {
    alert("Headers 格式错误，请输入合法 JSON！");
    return;
  }

  chrome.storage.local.get("siteConfigs", (data) => {
    const allConfigs = data.siteConfigs || {};
    allConfigs[domain] = {
      referer,
      headers: parsedHeaders,
      cookies: cookieFile
    };

    chrome.storage.local.set({ siteConfigs: allConfigs }, () => {
      document.getElementById("siteConfigStatus").textContent = `✅ 已保存配置：${domain}`;
    });
  });
});
