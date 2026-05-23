---
title: "Obsidian"
category: "entity"
tags: [tools, markdown, pkms]
created: 2026-05-24
sources: ["karpathy-llm-wiki.md"]
---

# Obsidian

---

## 📖 Definition / Overview
**Obsidian** 是一款功能強大的本地端 Markdown 筆記軟體。它基於本地檔案系統（Vault），以雙向連結（Backlinks）與圖形化關聯圖（Graph View）為核心特色，被廣泛用於建立個人知識管理系統（PKMS）。在 **LLM Wiki** 架構中，Obsidian 被定位為**「知識庫的 IDE」**。

---

## 🛠️ Detailed Explanation & Mechanics

在 Karpathy 的 LLM Wiki 架構中，人類、AI 與 Obsidian 形成了完美的三角協同關係：
1. **儲存底層**：Obsidian 使用純 Markdown 檔案作為儲存格式，使 AI Agent（如 Antigravity）能夠利用標準的檔案讀寫與 shell 工具直接編輯知識庫。
2. **圖形化 IDE**：人類開啟 Obsidian 在一側，AI Agent 在另一側的終端機執行編輯。人類可透過 Obsidian 的 **Graph View（關係圖）** 即時觀察 AI 如何將新概念與現有概念相連，並在頁面間跳轉閱讀。

### 推薦搭配的 Obsidian 插件 (Plugins)
* **Dataview**：透過在 Markdown 前置資料 (YAML Frontmatter) 中加入 `category: "concept"` 等標籤，Dataview 能在索引頁自動生成動態表格，展示最新的知識頁面與其狀態。
* **Marp**：可以直接將 Markdown 格式的 Wiki 頁面渲染成精美的幻燈片簡報，適合做 Synthesis 的成果展示。

---

## ⚖️ Critical Analysis / Pros & Cons

### 🟢 優勢 (Advantages)
* **本地優先與隱私**：所有檔案均在本地，不依賴雲端服務，讀寫速度極快，且便於 AI 讀取。
* **豐富的生態系統**：社群提供上千種外觀主題與功能插件，極易進行客製化。
* **強大的關係圖視覺化**：一眼就能看出知識庫中哪些頁面是「核心樞紐（Hubs）」，哪些是「孤立節點（Orphans）」。

### 🔴 挑戰與局限 (Limitations)
* **圖片管理較為繁瑣**：剪貼網頁時圖片預設為網路連結，若要本地化保存需手動下載（可搭配 Obsidian Web Clipper 與下載附件快捷鍵解決）。

---

## 🎓 Evolution & Evolving Insights

* **[2026-05-24]**: 在 [Andrej Karpathy LLM Wiki Gist](../sources/karpathy-llm-wiki.md) 中，作者強調了 Obsidian 作為編譯產物檢視器的關鍵角色：*"Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."*

---

## 🔗 Related Topics
* [Andrej Karpathy LLM Wiki Gist](../sources/karpathy-llm-wiki.md) — 複利知識庫設計來源。
* [複利知識庫 (Compounding Knowledge Base)](../concepts/compounding-knowledge.md) — 運作於 Obsidian 之上的核心哲學。
