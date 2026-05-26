# LLM Wiki - Activity Log

這是此知識庫的追加式（Append-only）操作日誌。每筆記錄均使用標準時間格式與操作前綴，便於 CLI 工具或 Shell 指令解析。

---

## [2026-05-27] feat | Mermaid Dynamic Diagram Rendering
* **操作**: Feat
* **描述**: 引入了 Mermaid.js 10.6.1 CDN，在 SPA 的 `app.js` 中實現了動態攔截並渲染 Mermaid 圖表，完美避開 Prism 代碼高亮包裹。此外，實作了「雙主題無刷同步（Zero-refresh Theme Sync）」熱重繪機制，當使用者切換明/暗主題時，流程圖能即時、無痛重繪為相符的色彩風格。
* **變更檔案**:
  - `[MODIFY] index.html`
  - `[MODIFY] app.js`
  - `[MODIFY] CLAUDE.md`

## [2026-05-27] ingest | macOS Homebrew Auto-Backup Guide
* **操作**: Ingest
* **描述**: 編譯並導入了 macOS Homebrew 環境自動化備份指南，基於真實案例拆解 `backup.sh` 自動化核心腳本，介紹 Zsh 別名觸發與 `launchd` plist 定時守護進程，倡導「環境即代碼」（EaC）的 DevOps 最佳實踐。
* **變更檔案**:
  - `[NEW] wiki/concepts/homebrew-auto-backup.md`
  - `[MODIFY] wiki/index.md`

## [2026-05-27] ingest | macOS Homebrew Guide
* **操作**: Ingest
* **描述**: 編譯並導入了 macOS Homebrew 套件管理器完整使用指南，涵蓋 Formula/Cask 概念、常規指令、後台啟動服務（Brew Services）、備份復原工具（Brewfile）以及釀酒術語白話對照。
* **變更檔案**:
  - `[NEW] wiki/entities/homebrew.md`
  - `[MODIFY] wiki/index.md`

## [2026-05-27] ingest | Android Kotlin Flow Guide
* **操作**: Ingest
* **描述**: 編譯並導入了 Android Kotlin Flow 異步串流指南，涵蓋 Cold/Hot 流對比、StateFlow/SharedFlow 設計、生命週期安全收集人因實作與雙語術語白話對照，並在目錄中註冊全新 Android & Kotlin 進階板塊。
* **變更檔案**:
  - `[NEW] wiki/concepts/android-kotlin-flow.md`
  - `[MODIFY] wiki/index.md`

## [2026-05-24] ingest | Expo Design System Guide
* **操作**: Ingest
* **描述**: 透過 `npx getdesign@latest add expo` 工具下載了 Expo 官方 `DESIGN.md` 設計規範，並在知識庫中撰寫了中文化的說明文件，同時將網站視覺重新塑造為高質感的 Expo 極深色調、代碼中心化、紫羅蘭高亮主題。
* **變更檔案**:
  - `[NEW] DESIGN.md`
  - `[NEW] wiki/concepts/expo-design-system.md`
  - `[MODIFY] wiki/index.md`
  - `[MODIFY] style.css`

## [2026-05-24] ingest | Flutter Dio Package Guide
* **操作**: Ingest
* **描述**: 導入了 Flutter 最受歡迎的 HTTP 網路請求套件 `dio` 的教學，包含基礎 GET/POST 語法與雙語術語白話對照，並提供企業級 Singleton 單例封裝、自動 Token 注入、中文錯誤攔截器的完整程式碼實作。
* **變更檔案**:
  - `[NEW] wiki/concepts/flutter-dio-client.md`
  - `[NEW] wiki/synthesis/flutter-dio-senior-wrapper.md`
  - `[MODIFY] wiki/index.md`

## [2026-05-24] ingest | Flutter Senior UI Layout Guide
* **操作**: Ingest
* **描述**: 基於使用者想學習 Flutter 的需求，由 AI 專家編譯並導入了 Flutter 畫面切版、文字設計與色彩整合知識庫，並提供高品質 Premium 實戰範例程式碼。
* **變更檔案**:
  - `[NEW] wiki/concepts/flutter-widget-tree.md`
  - `[NEW] wiki/concepts/flutter-layout-basics.md`
  - `[NEW] wiki/concepts/flutter-text-styling.md`
  - `[NEW] wiki/synthesis/flutter-senior-ui-guide.md`
  - `[MODIFY] wiki/index.md`

## [2026-05-24] ingest | Andrej Karpathy LLM Wiki Gist
* **操作**: Ingest
* **描述**: 導入了 Karpathy 的原始 LLM Wiki 設計理念 Gist。
* **變更檔案**:
  - `[NEW] wiki/sources/karpathy-llm-wiki.md`
  - `[NEW] wiki/concepts/compounding-knowledge.md`
  - `[NEW] wiki/entities/obsidian.md`

## [2026-05-24] init | 系統初始化
* **操作**: Init
* **描述**: 建立 LLM Wiki 的基礎資料夾結構、`CLAUDE.md` 協定規範、輔助 CLI 工具 `wiki.py`、頁面範本及 `index.md` 索引。
* **變更檔案**:
  - `CLAUDE.md`
  - `wiki.py`
  - `wiki/index.md`
  - `wiki/log.md`
  - `wiki/templates/source_template.md`
  - `wiki/templates/concept_template.md`
