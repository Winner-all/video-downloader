以下是为你的视频下载器浏览器扩展生成的完整 `README.md` 文件内容，格式为标准 Markdown，可直接复制粘贴保存为 `README.md` 使用：

````md
# 🎬 VideoDownloader 浏览器扩展

一个强大且可扩展的浏览器视频下载工具，支持多站点自动识别、登录态 cookie 下载、历史记录管理与站点配置等功能。适用于需要批量或定向下载视频资源的用户。

---

## 📌 项目简介

本插件通过浏览器扩展 + Native Messaging 本地服务实现与 `yt-dlp` 工具通信，支持：

- 🔗 自动识别当前网页中的视频链接
- 🍪 支持从浏览器提取登录 cookies 并保存为标准格式
- ⚙️ 多站点配置（Referer、Headers、cookie 文件）
- 🧾 历史下载记录展示与管理
- 📂 cookie 文件管理与展示
- 🖥️ 配置保存至 `chrome.storage.local`
- 💻 支持 Microsoft Edge / Chrome 等 Chromium 内核浏览器

---

## 🚀 功能特性

- 支持自动提取当前视频地址
- 支持自定义输入 URL 下载
- 支持提取并保存当前页面 Cookies
- 支持读取本地 cookie 文件进行登录态下载
- 支持下载成功后记录历史（包含时间、URL、文件名）
- 支持多站点配置（Referer / Headers / cookies）
- UI 支持多标签页管理（下载 / 历史 / 站点设置 / Cookie 管理）

---

## 🛠️ 安装步骤

### 1. 准备工作

- 安装 Python 3 和 `yt-dlp`：
  ```bash
  pip install -U yt-dlp
````

* 克隆本项目结构：

  ```
  videoDownload/
  ├── extension/         # 插件目录（浏览器加载）
  ├── downloader/        # 本地通信服务（Python）
  ```

### 2. 配置 Native Host

* 在 Windows 系统中创建一个 `.bat` 启动文件与 `manifest.json` 本地消息文件，注册 Native Host（需放置于注册表位置）
* `manifest.json` 示例配置：

  ```json
  {
    "name": "com.yourdomain.ytdlp_downloader",
    "description": "Video downloader native host",
    "path": "D:\\VSCode\\VCWork\\videoDownload\\downloader\\downloader.bat",
    "type": "stdio",
    "allowed_origins": [
      "chrome-extension://YOUR_EXTENSION_ID/"
    ]
  }
  ```

> `YOUR_EXTENSION_ID` 可在浏览器扩展页面中查看插件 ID

### 3. 安装浏览器插件

* 打开 Edge 或 Chrome 的扩展程序页面 `edge://extensions/` 或 `chrome://extensions/`
* 勾选 “开发者模式”
* 点击 “加载已解压的扩展程序”，选择 `extension/` 文件夹

---

## 📋 使用方法

### 🔽 下载视频

1. 打开目标视频网站页面
2. 点击「获取当前页面链接」自动填充
3. 可手动提取并保存 cookies
4. 点击「发送下载请求」开始下载

### 🍪 Cookies 使用说明

* 可自动提取当前页面 cookies 并保存为标准 Netscape 格式（`cookies_xxx.txt`）
* 下载时会自动匹配域名并查找对应 cookie 文件

### ⚙️ 站点设置说明

* 每个网站可配置：

  * Referer
  * Headers（JSON 格式）
  * Cookies 文件名
* 示例：

  * `bilibili.com`
  * Referer: `https://www.bilibili.com/`
  * Headers: `{ "User-Agent": "...", "Origin": "..." }`

### 📖 历史记录管理

* 自动保存下载记录（时间 / 链接 / 文件名）
* 支持删除任意历史记录

### 📂 Cookie 文件管理

* 会展示 `downloader/cookies/` 目录下所有 `.txt` cookie 文件
* 文件管理通过 native host 实现跨进程访问

---

## 📁 项目结构说明

```
videoDownload/
├── extension/                  # 插件代码目录
│   ├── popup.html              # 插件 UI 主页面
│   ├── popup.js                # 插件主逻辑
│   ├── popup.css               # 插件样式表
│   ├── cookie-utils.js         # cookie 提取与通信封装
│   └── manifest.json           # 插件描述文件
├── downloader/                # 本地 Native Host 服务
│   ├── downloader.py           # 主执行脚本
│   ├── cookies/                # 保存的 cookie 文件目录
│   ├── log.txt                 # 下载日志输出
│   └── manifest.json / .bat    # Native Host 注册文件
```

---

## ❗注意事项

* 浏览器扩展必须配合本地 Python 程序运行
* 下载功能依赖 `yt-dlp`，确保其在系统 PATH 或虚拟环境中可用
* 插件访问 cookie 需用户授权（Edge/Chrome 默认已开放）
* 所有 cookie 文件保存至 `downloader/cookies/` 目录中
* `manifest.json` 中的 Native Host 路径、ID 必须与实际匹配

---

## 💡 后续功能规划

* [ ] 视频分段多线程合并
* [ ] 支持自动识别视频资源平台
* [ ] 支持清理无效 cookie 文件
* [ ] 支持自动检测更新 yt-dlp

---

## 🙏 致谢

* [yt-dlp](https://github.com/yt-dlp/yt-dlp)
* Microsoft Edge / Chrome 插件平台
* ChatGPT + Python for automation ideas

---

> 项目作者：你自己（yang yang）
> 当前版本：v1.0.0
> License: MIT（可自定义）

```

---


```
