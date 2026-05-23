# LLM Wiki - Master Index

> "The wiki is a persistent, compounding artifact. The cross-references are already there. The contradictions have already been flagged."
> — Andrej Karpathy

歡迎使用您的 **LLM 知識庫系統 (LLM Wiki)**。這是一個由您負責導航、AI 負責整理與維護的增長型知識庫。

---

## 📊 知識庫概覽

* **狀態**: 🟢 運行中 (Healthy)
* **活動日誌**: [Activity Log](log.md)
* **核心規範**: [`CLAUDE.md`](../CLAUDE.md)
* **維護工具**: `wiki.py` (支援 `search`, `lint`, `stats`)

---

## 📚 知識地圖目錄

### 🧭 核心與哲學 (Philosophy & Architecture)
* [Andrej Karpathy LLM Wiki Gist](sources/karpathy-llm-wiki.md) — Karpathy 提出的 LLM Wiki 核心概念與哲學說明。
* [複利知識庫 (Compounding Knowledge Base)](concepts/compounding-knowledge.md) — 知識隨時間積累與演進的系統，對比傳統 RAG 每次重新檢索的缺點。
* [AI Agent 維護協定 (AI Agent Protocol)](../CLAUDE.md) — 指引 AI 如何操作與維護此 Wiki 的標準規範。

### 💙 Flutter 基礎起步 (Flutter Basics)
* [Flutter 元件樹與宣告式 UI](concepts/flutter-widget-tree.md) — 了解 StatelessWidget/StatefulWidget 與 UI 渲染機制。

### 🎨 畫面處理與切版 (Flutter UI & Layout)
* [Expo 系統設計規範](concepts/expo-design-system.md) — 基於 getdesign.md 下載的的 Expo 官方視覺與 Token 設計規範說明。
* [Flutter 基礎切版佈局](concepts/flutter-layout-basics.md) — Row, Column, Stack, Padding, Container 等基礎佈局元件屬性。
* [Flutter 文字樣式與色彩設計](concepts/flutter-text-styling.md) — TextStyle、色彩定義與 Theme 主題化運用。
* [資深工程師必備 Flutter UI 指南](synthesis/flutter-senior-ui-guide.md) — 融合佈局、文字、色彩與高質感商品卡片的實戰程式碼 analysis。

### 🌐 網路傳輸與 API (Flutter Networking)
* [Flutter Dio 網路請求套件](concepts/flutter-dio-client.md) — 了解強大的 HTTP 客戶端、基礎 GET/POST 語法與術語白話解釋。
* [資深工程師級 Dio 單例封裝與攔截器設計](synthesis/flutter-dio-senior-wrapper.md) — 企業級 Singleton 網路層封裝、Token 注入、中文化錯誤攔截器的完整實作程式碼。

### 🛠️ 知識庫工具箱 (Wiki Toolbox)
* [Obsidian](entities/obsidian.md) — 作為本知識庫 IDE 的雙向連結 Markdown 筆記軟體。

## 🧭 快速起步指引

1. **新增資料**：將任何 `.md`、`.txt`、PDF 或圖片放入 `sources/` 目旅下。
2. **命令 AI Agent 導入**：
   > *"請幫我導入 `sources/new-file.pdf`，提取關鍵概念並更新 Wiki。"*
3. **進行查詢**：
   > *"根據 Wiki 內容，請幫我分析 Compounding 知識庫與 RAG 的本質差異，並將分析結果整理成 Synthesis 頁面。"*
4. **定期維護**：
   > *"請幫我執行 Wiki 的健康檢查（Lint），修復無效連結並找出孤立頁面。"*
