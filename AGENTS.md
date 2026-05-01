# AGENTS.md — DinoYee Blog

## 技術堆疊
- **Astro** v5（靜態網站框架）
- **React** v19（UI 元件，透過 `@astrojs/react`）
- **MDX** v4（部落格文章，透過 `@astrojs/mdx`）
- **Tailwind CSS** v3（樣式，透過 `@astrojs/tailwind`）
- **TypeScript**（strict 模式）

## 指令
| 指令 | 說明 |
|---------|-------------|
| `npm run dev` | 啟動開發伺服器（預設 `localhost:4321`，路徑為 `/`） |
| `npm run build` | 建置靜態網站到 `dist/`（路徑為 `base: /dinoyee-blog/`） |
| `npm run preview` | 本地預覽生產版本 |
| `npm run lint` | 執行型別檢查（`astro check`） |

**驗證順序：** `npm run build` → `npm run preview`

## 架構
```
src/
├── content.config.ts      # 部落格集合結構描述（Zod 驗證）
├── content/blog/          # MDX 部落格文章（內容集合）
├── layouts/
│   └── BaseLayout.astro   # 共用 HTML 外殼（標頭、導航、頁尾）
├── pages/
│   ├── index.astro        # 首頁
│   └── blog/
│       ├── index.astro    # 文章列表（依日期排序，過濾草稿）
│       └── [...slug].astro # 動態路由文章頁面（透過 getStaticPaths）
└── styles/
    └── global.css         # Tailwind 指示詞 + 基礎樣式
```

**重要檔案：**
- `astro.config.mjs` — 網站網址、base 路徑、整合插件、輸出模式
- `src/content.config.ts` — 部落格集合結構描述（Zod 驗證 frontmatter）
- `.github/workflows/deploy.yml` — CI/CD：推送到 `main` → 建置 → GitHub Pages

## 內容撰寫流程
1. 在 `src/content/blog/` 新增 MDX 檔案
2. 必填 frontmatter：`title`、`description`、`date`
3. 選填：`tags`（陣列）、`draft: true`（不顯示於列表）
4. 若 frontmatter 不符合 `src/content.config.ts` 的結構描述，建置會失敗

## 慣例
- 路徑別名：`@/*` 對應到 `src/*`
- 部落格文章日期使用 `zh-TW` 語系格式化
- 文章內容套用 Tailwind `prose` 樣式（若需要可加入 `@tailwindcss/typography` 插件）
- React 元件可在 `.astro` 檔案中匯入；僅在需要互動時使用 `client:load`/`client:visible`
- 路由 slug 會自動移除 `.md` 或 `.mdx` 副檔名

## 部署
- 推送到 `main` 分支會觸發 `.github/workflows/deploy.yml`
- 從 `dist/` 上傳構件，部署到 GitHub Pages
- 生產環境網址：`https://dinoyee.github.io/dinoyee-blog/`
- **重要：** `astro.config.mjs` 中的 `base: '/dinoyee-blog'` 必須與儲存庫名稱一致

## 注意事項
- 開發伺服器路徑為 `/`，但生產環境為 `/dinoyee-blog/` — Astro 透過 `base` 設定自動處理
- 草稿文章會從 `blog/index.astro` 排除但仍會被建置 — 使用 `draft: true` 在生產環境隱藏
- 若 Tailwind `prose` 樣式未生效，需在 `tailwind.config.mjs` 的 plugins 中加入 `@tailwindcss/typography`
- 依賴衝突：`@astrojs/tailwind` 需要 `tailwindcss@^3`，不能使用 v4
