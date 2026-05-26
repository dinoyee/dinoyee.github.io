---
category: entity
title: macOS Homebrew 套件管理器完整使用指南
tags: [macos, homebrew, devops, package-manager, cli]
created: 2026-05-27
---

# 🍺 macOS Homebrew 套件管理器完整使用指南

**Homebrew** 是 macOS 上最受歡迎的**開源套件管理器**，被譽為「macOS 缺少的套件管理工具」（The Missing Package Manager for macOS）。

不論是開發用的編譯器（Git, Node.js, Python）、資料庫（PostgreSQL, Redis），甚至是日常桌面軟體（Google Chrome, VS Code, Slack），都能透過簡單的一行終端機指令完成安裝、更新與移除。

---

## 🧭 Homebrew 核心架構：Formula vs Cask

在開始使用之前，理解 Homebrew 的兩大核心軟體分類至關重要：

1. **Formulae（配方/常規套件）**：
   * **對象**：命令列工具（CLI）、開發庫、編譯器與後台服務（如 `node`, `git`, `python`, `nginx`）。
   * **安裝路徑**：Apple Silicon (M1/M2/M3) Mac 安裝於 `/opt/homebrew/Cellar/`；Intel Mac 安裝於 `/usr/local/Cellar/`。
2. **Casks（桶/桌面應用程式）**：
   * **對象**：帶有圖形化介面（GUI）的 macOS 桌面軟體（如 `google-chrome`, `visual-studio-code`, `docker`）。
   * **安裝路徑**：直接安裝至 macOS 系統的 `/Applications/`（應用程式）資料夾中，與手動下載安裝無異。

---

## 📥 安裝與環境變數配置 (Installation)

### 1. 執行安裝指令
開啟 macOS 終端機，執行以下官方安裝腳本：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. 環境變數設定（Apple Silicon M1/M2/M3 必做！）
在 Apple Silicon 晶片的 Mac 上，Homebrew 的預設安裝路徑為 `/opt/homebrew`。安裝完成後，必須將其加入您的 Zsh 環境變數中，否則終端機會出現 `command not found: brew` 錯誤：

```bash
# 將 brew 加入 Zsh 設定檔 (.zprofile)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
# 立即讓設定生效
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

## 🛠️ 常用核心指令大全 (Core Commands)

### 1. 搜尋與資訊查詢
```bash
brew search <keyword>     # 搜尋軟體（如 brew search git）
brew info <package>       # 查看軟體詳細資訊、依賴關係與安裝路徑
```

### 2. 安裝與移除
```bash
# 常規命令列工具 (Formula)
brew install <formula>    # 安裝工具（如 brew install wget）
brew uninstall <formula>  # 移除工具

# 桌面應用程式 (Cask)
brew install --cask <app> # 安裝桌面軟體（如 brew install --cask visual-studio-code）
brew uninstall --cask <app> # 移除桌面軟體
```

### 3. 更新與維護（定期執行）
```bash
brew update               # 更新 Homebrew 系統本身與所有軟體清單目錄
brew outdated             # 列出目前電腦中哪些已安裝的軟體有新版本
brew upgrade <formula>    # 升級指定軟體（不加名字則升級所有已過期的軟體）
```

### 4. 磁碟清理（釋放空間）
Homebrew 在升級軟體時，預設會保留舊版本的實體檔案。定期清理可以為 Mac 釋放出數 GB 甚至數十 GB 的空間：
```bash
brew cleanup              # 清理所有舊版本的快取與安裝包
brew cleanup -n           # 預覽清理（只列出哪些檔案會被刪除，不真正動手）
```

### 5. 系統健康診斷
如果您的 brew 執行起來怪怪的，可以使用內建醫生進行檢測：
```bash
brew doctor               # 診斷當前系統環境，並給出修復建議（如權限錯誤、路徑衝突）
```

---

## 🔄 Brew Services：後台服務管理

當您透過 Homebrew 安裝了資料庫（MySQL, PostgreSQL）或網頁伺服器（Nginx）時，您可以使用 `brew services` 輕鬆管理它們的背景啟動狀態，完全免去複雜的 `launchctl` 配置：

```bash
brew services list        # 列出當前所有後台運行的服務與狀態
brew services start <svc> # 啟動服務並設定為「開機自動啟動」（如 brew services start redis）
brew services stop <svc>  # 停止服務，並取消開機自啟
brew services restart <svc> # 重啟指定服務
```

---

## 📦 進階：Homebrew Bundle (備份與移植電腦神器)

當您更換新 Mac 時，您不需要一個一個重新安裝軟體。Homebrew 提供了 `Bundle` 工具，讓您能用一個文字檔（`Brewfile`）備份並一鍵還原整台電腦的軟體配置！

### 1. 匯出當前電腦的所有軟體清單
在舊電腦的終端機執行：
```bash
brew bundle dump --global # 這會在您的個人家目錄 (~/) 下生成一個名為 .Brewfile 的備份檔案
```
這份檔案會詳細記錄您用 brew 安裝的所有 CLI 工具、Cask 桌面軟體，甚至是 Mac App Store 下裝的軟體！

### 2. 在新電腦一鍵還原安裝
將 `.Brewfile` 複製到新電腦的家目錄，在新電腦的終端機執行：
```bash
brew bundle --global      # Homebrew 會自動依序下載並安裝檔案內記錄的所有軟體！
```

---

## 📖 Homebrew 常用中英文術語白話對照表

Homebrew 的命名極具「釀酒廠（Brewery）」的極客趣味風格，以下為您進行名詞對照：

| 英文術語 | 中文對照 | 💡 白話大意解釋 |
| :--- | :--- | :--- |
| **Formula** | 配方 / 套件 | 指一個常規套件的安裝腳本（以 Ruby 編寫），用來安裝 CLI 程式。 |
| **Cask** | 桶 / 桌面軟體 | 專門用來安裝 macOS 桌面應用程式（GUI 軟體）的延伸功能。 |
| **Cellar** | 酒窖 / 安裝目錄 | Homebrew 在您電腦上存放所有已安裝軟體實體檔案的本地資料夾。 |
| **Keg** | 小酒桶 | 指某個特定軟體特定版本的安裝資料夾（例如 `/Cellar/git/2.40.0`）。 |
| **Bottle** | 瓶裝酒 / 二進位包 | 預先編譯好的二進位安裝包。直接下載即可用，不需要在您電腦上現場編譯，速度極快。 |
| **Tap** | 水龍頭 / 第三方軟體源 | 擴充軟體倉庫。當您要安裝非官方收錄的軟體時，需要先 `brew tap <creator/repo>`。 |
| **Bundle** | 綑綁包 | 用於備份與還原整台電腦所有套件、桌面軟體配置的 DevOps 工具。 |
