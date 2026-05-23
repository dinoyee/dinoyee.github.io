# LLM 複利知識庫系統 (LLM Compounding Wiki)

> 💡 **核心哲學**：Obsidian 是知識庫的 IDE；LLM 是程式設計師；Wiki 是代碼庫。您負責導航與指引，AI 負責所有枯燥的整理、交叉參照與簿記（Bookkeeping）工作。

本專案是一個基於 Andrej Karpathy 提出的 **LLM Wiki** 設計模式建立的「複利增長型個人知識庫」。

與傳統 RAG（檢索增強生成，每次查詢時臨時拼湊零散區塊）不同，本系統的核心思想是**「主動、增量地編譯與維護一個持久性 Markdown Wiki」**。每當您導入新資料，AI 都會將其深度融入現有的知識地圖、更新關聯概念，使知識隨時間不斷自動累積與更新。

---

## 📂 專案目錄結構

```text
llm-wiki/
├── sources/               # 原始資料庫 (不可變，如 PDF、網頁剪貼、會議紀錄)
│   └── README.md
├── wiki/                  # 持久性知識庫 (由 AI 進行全權讀寫與編譯)
│   ├── index.md           # 知識庫首頁 / 主分類目錄索引
│   ├── log.md             # 追加式的時間序列操作日誌 (追蹤變更)
│   ├── sources/           # 每篇原始文檔的 AI 摘要與關鍵提取
│   ├── concepts/          # 自動提煉出的理論、架構或核心概念頁面
│   ├── entities/          # 工具、組織、人物或具體專案的實體頁面
│   ├── synthesis/         # 跨文檔的深度對比分析、合成表格與 meta 研究
│   └── templates/         # 頁面標準化範本 (Sources & Concepts)
├── CLAUDE.md              # AI Agent 維護協定規範 (指引 AI 如何遵守格式與流程)
├── wiki.py                # 知識庫本地輔助 CLI 工具 (全文搜尋、健康檢查、統計)
└── README.md              # 本說明文件 (繁體中文指南)
```

---

## 🚀 快速起步三步驟

### 第一步：使用 Obsidian 開啟本資料夾
本系統的 Markdown 格式與連結完美相容於 [Obsidian](https://obsidian.md/) 筆記軟體。
1. 下載並開啟 Obsidian。
2. 選擇「開啟本地 Vault」(Open folder as vault)，選取此 `llm-wiki` 資料夾。
3. 您可以開啟 Obsidian 的 **Graph View (關係圖)**，即時觀看您的知識網格是如何隨時間不斷生長、相互連結的。

### 第二步：放入原始文檔
將您想學習或分析的論文、文章剪貼（Markdown 格式最佳）、PDF 放入 `sources/` 資料夾下。例如，我們已經預先為您導入了 Karpathy 的 LLM Wiki 原文作為範例。

### 第三步：命令您的 AI 助手 (如 Antigravity / Claude Code)
當您與 AI 對話時，您可以直接使用以下 Prompt 語法，AI 將會自動遵循 `CLAUDE.md` 中的協定，為您執行維護工作：

#### 📥 1. 導入新文檔 (Ingest)
> 💬 *"請幫我導入 `sources/your-document.pdf`，提取它的核心概念、產出摘要頁面並更新 Wiki 的相關概念，最後更新索引與日誌。"*

#### 🔍 2. 深度查詢與知識回填 (Query & Compound)
> 💬 *"請在 Wiki 中尋找與 'Transformer 結構' 相關的所有內容，幫我分析它與 RNN 的優劣勢。請將這個對比分析回填（File back）到 Wiki 的 synthesis 目錄下建立新頁面，並幫我更新索引。"*

#### 🧹 3. 知識庫健康檢查 (Lint & Resolve)
> 💬 *"請幫我執行 Wiki 的 Lint 健康檢查，找出所有死連結、孤立頁面，並幫我把孤立的頁面連回相關概念。"*

---

## 🛠️ 本地輔助 CLI 工具 (`wiki.py`)

本專案提供了一個無任何外部套件依賴、開箱即用的 Python CLI 腳本，用以加強終端機下的操作效率：

### 1. 全文 TF-IDF 檢索 (Search)
在終端機輸入以下指令，系統會自動對 `wiki/` 目錄下的所有檔案進行中英文混合的 TF-IDF 權重計算，精準排序並給出最佳匹配的段落摘要：
```bash
python wiki.py search "複利知識庫"
```

### 2. 連結健康檢查 (Lint)
自動檢測 Wiki 中是否有破碎連結 (Broken Links)、或是沒有被任何頁面提及的「孤立頁面 (Orphan Pages)」，方便 AI 或您自己補齊關聯連結：
```bash
python wiki.py lint
```

### 3. 統計數據 (Stats)
即時分析您的知識庫體量、分類佔比、內鏈密度與日誌活動量：
```bash
python wiki.py stats
```

---

## 🌐 知識庫 Web 門戶與一鍵發佈 (Web Portal & GitHub Pages)

本專案已配備一個**高質感、免設定的單頁面 Web 門戶**。它會自動抓取 `wiki/index.md` 生成側邊欄導覽選單，並在網頁端支援 **即時 TF-IDF 搜尋**、**代碼語法高亮**與**毛玻璃極致美學**。

### 1. 本地預覽 (Local Preview)
由於瀏覽器的安全性限制（CORS），直接雙擊開啟 `index.html` 會阻擋網頁讀取本地 Markdown 檔案。請依以下簡單步驟在本地啟動預覽：

1. 開啟終端機，切換到本資料夾目錄。
2. 執行以下指令啟動極輕量伺服器：
   ```bash
   python3 -m http.server 8000
   ```
3. 在瀏覽器打開：`http://localhost:8000` 即可流暢閱讀與搜尋！

### 2. 免費發佈到 GitHub Pages (3 步驟一鍵上線)
您可以非常輕鬆地將這個 Wiki 網站發佈到網路上，分享給他人或作為個人雲端筆記：

1. **上傳至 GitHub**：
   在終端機執行以下 Git 指令將本專案推送到您的 GitHub 新倉庫：
   ```bash
   git init
   git add .
   git commit -m "feat: init compounding llm wiki web portal"
   git branch -M main
   git remote add origin <您的 GitHub 倉庫網址>
   git push -u origin main
   ```
2. **啟用 GitHub Pages**：
   登入 GitHub 網頁，進入您的倉庫 $\rightarrow$ 點擊右上方 **Settings** $\rightarrow$ 左側選單選擇 **Pages**。
3. **設定分支與發佈**：
   在 **Build and deployment** 下，將 Source 設定為 **Deploy from a branch**。
   Branch 選擇 **`main`** 分支，資料夾選擇 **`/ (root)`**，點擊 **Save**。

> ⏱️ **恭喜！** 約 1 分鐘後，您的專案將會成功上線，任何人皆可透過 `https://<您的帳號>.github.io/<您的倉庫名>/` 流暢存取您的精美複利知識庫網站！

---

## 💡 Obsidian 高級搭配技巧

1. **Obsidian Web Clipper**：在瀏覽器安裝此套件，可以一鍵將優質的網路文章轉為標準 Markdown，直接下載至 `sources/` 目錄下。
2. **Dataview 插件**：在 Obsidian 安裝 `Dataview` 插件，即可在 `wiki/index.md` 中利用簡單語法自動生成依據 Frontmatter 排序的最新概念表格，完全無需手動更新。
3. **Marp 插件**：可直接將您的 Synthesis 深度分析頁面一鍵轉換為精美投影片，非常適合用於週會報告或主題分享。

---

## 📜 聲明與哲學

複利知識庫之所以有效，是因為它將**「繁重的記帳工作」**交給了不知疲倦、擅長模式匹配的 AI。人類的精力應被釋放於：
* **篩選高品質的原始資料** (Sourcing)
* **進行高層次的探索與啟發式提問** (Direction)
* **思考這些知識整合對您的研究、工作或生活的本質意義** (Synthesis)

祝您的知識複利旅程愉快！如有任何需要，隨時命令您的 AI 助手為您更新與維護知識庫！
