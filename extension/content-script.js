// extension/content-script.js

(() => {
  let videoUrl = null;

  const video = document.querySelector("video");

  if (video) {
    videoUrl = video.currentSrc || video.src;
  } else {
    // 尝试抓取 source 元素
    const source = document.querySelector("source");
    if (source) {
      videoUrl = source.src;
    }
  }

  if (videoUrl) {
    // 将视频链接存到页面全局变量中（方便 popup.js 获取）
    window.__EXTRACTED_VIDEO_URL__ = videoUrl;
  }
})();
