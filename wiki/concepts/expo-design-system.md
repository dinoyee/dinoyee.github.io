# 🎨 Expo 系統設計規範 (Expo Design System)

本頁面依據 [`DESIGN.md`](../../DESIGN.md) 說明 Expo 官方的視覺語言規範，這是一套為開發者工具與平台設計、展現出「低調且自信（Quietly-confident）」與代碼中心化（Code-centric）的美學體系。

---

## 🧭 設計哲學 (Design Philosophy)

Expo 的設計規範有三大核心支柱：
1. **開發者人因工程 (Developer Ergonomics)**：排除繁雜的視覺裝飾，強調代碼的清晰呈現、高可讀性的字型排版，以及流暢的導覽層級。
2. **扁平脆邊框與高對比 (Flat Crisp Borders & High Contrast)**：取消過度的漸層與模糊毛玻璃特效，改用極細的 `1px` 框線（Hairline borders）來界定內容邊界，創造極高的設計精細度（High-fidelity）。
3. **紫羅蘭霓虹主色 (Signature Violet Accent)**：以墨黑與純白作為底板畫布，僅在焦點元素與活動目錄使用 Expo 標誌性的紫羅蘭色（Expo Violet），展現專注且精緻的極客氛圍。

---

## 🎨 核心色彩 Token (Color Tokens)

在 `DESIGN.md` 的規範中，Expo 的色彩被分為三大層級：

### 1. 畫布底板與層級 (Canvas & Elevation)

| 顏色名稱 | 變數代號 | Dark Mode 數值 | Light Mode 數值 | 用途說明 |
| :--- | :--- | :--- | :--- | :--- |
| **主背景畫布** | `--bg-primary` | `#020204` | `#ffffff` | 整個頁面的背景底板（墨黑 / 純白） |
| **次級面板/側邊欄**| `--bg-secondary` | `#0c0d12` | `#fafafa` | 側邊欄、頂部狀態欄背景（有階層感） |
| **卡片背景** | `--bg-card` | `#12131a` | `#ffffff` | 獨立內容卡片、程式碼區塊底板 |
| **極細框線** | `--border-color` | `#1f2937` | `#e5e7eb` | `1px` 寬度的極細線條，用於界定邊框 |

### 2. 標誌主色與漸層 (Accent Colors)

* **Expo 紫羅蘭 (`--accent-primary`)**: `#7c3aed`（Dark Mode）/ `#0d74ce`（Light Mode，採用 Expo 經典藍色連結色）。
* **亮霓虹紫 (`--accent-secondary`)**: `#8b5cf6` / `#476cff`。
* **活動高亮漸層**: `linear-gradient(135deg, #7c3aed, #a78bfa)`。

### 3. 字體色彩層級 (Text Levels)

* **主要文字 (`--text-primary`)**: `#f8fafc`（Dark Mode，極亮白）/ `#171717`（Light Mode，墨黑色，確保可讀性）。
* **次要文字 (`--text-secondary`)**: `#cbd5e1` / `#60646c`（用於內文段落，減輕視覺疲勞）。
* **說明文字 (`--text-muted`)**: `#6b7280` / `#999999`（用於次要標籤、輔助小字）。

---

## 📝 字型與緊湊字距 (Typography)

Expo 堅定信任無襯線字型 `Inter` 的中性魅力，不使用誇張的自訂字型。同時在程式碼呈現上全面採用 `JetBrains Mono`。

### 緊湊字距原則 (Letter-spacing Principles)
為了呈現現代技術文檔的緊湊感，Expo 的字距有著嚴格的負值微調：
* **大標題/標題層級 (`h1`, `h2`, `h3`)**：套用 `letter-spacing: -0.04em` 的極窄追蹤，使大字體看起來更有張力且不鬆散。
* **內文段落 (`p`, `li`)**：套用 `letter-spacing: -0.02em` 的緊湊追蹤，使長段落閱讀更為流暢聚焦。

---

## 📐 間距與形狀半徑 (Spacing & Radius)

### 1. 間距系統 (Spacing Scale)
採用 `4px` 為基礎單元的嚴格網格系統：
* `xxs` (4px) · `xs` (8px) · `sm` (12px) · `base` (16px) · `md` (20px) · `lg` (24px) · `xl` (32px) · `xxl` (48px)。
* 閱讀內文左右留白一般設定為 `lg` 或 `xl`。

### 2. 邊角半徑 (Border Radius)
* **一般標籤/徽章**: `rounded-xs` (4px) 或 `pill` (9999px)。
* **輸入框、按鈕**: `rounded-md` (8px) — 最符合人因工學的開發者按鈕半徑。
* **內容卡片、程式碼面板**: `rounded-lg` (12px)。

---

## 🛠️ 知識庫 Expo 視覺重塑對照表

我們將在網站中套用以下具體的 Expo 風格變更：

1. **側邊欄 (Sidebar) 改造**
   * **去玻璃化**: 取消模糊毛玻璃，改為實色 `#0c0d12` 面板。
   * **去白線**: 移除底部突兀的 `<hr>` 白線，改用乾淨的 `#1f2937` 微邊框。
   * **極窄選單**: 摺疊資料夾 chevron 修改為 Expo 紫，點擊活動項目時套用紫色底色與左側高亮線。
2. **頂部狀態欄 (Top Bar) 改造**
   * 採用實色底並帶有 `1px` 底部細框。
   * 麵包屑導覽（Breadcrumbs）字體微調為 `Inter 14px` 並套用緊湊字距。
3. **主內容區 (.markdown-body) 改造**
   * **代碼高亮**: 代碼區塊背景改為高質感 `#08090d`，邊框改為極細 `#1e293b`。
   * **呼叫盒 (Callouts)**：重新定義 Note、Important、Warning 提示框，使用扁平實色與紫色、橙色、紅色的左側粗線條對照。
   * **文檔表格**: 採用扁平網格與極細邊框，使對比度維持完美平衡。
