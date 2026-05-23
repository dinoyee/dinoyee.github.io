---
title: "複利知識庫 (Compounding Knowledge Base)"
category: "concept"
tags: [knowledge-engineering, philosophy, rag]
created: 2026-05-24
sources: ["karpathy-llm-wiki.md"]
---

# 複利知識庫 (Compounding Knowledge Base)

---

## 📖 Definition / Overview
**複利知識庫 (Compounding Knowledge Base)** 是一種知識表示與管理哲學。它的核心特徵是：**知識的整合、關聯性與合成在「資料導入期 (Ingestion Time)」或「探索期 (Exploration Time)」即被固化並持續更新，而不是在「查詢期 (Query Time)」臨時推導。** 隨著新文檔的加入與新問題的解答，知識庫的結構、摘要與元數據會不斷沉澱與自我演進，使知識庫的價值呈現指數型增長（即複利效應）。

---

## 🛠️ Detailed Explanation & Mechanics

在傳統的 RAG (Retrieval-Augmented Generation) 系統中，運作流程是拉取原始資料的 Chunk，然後交給 LLM 合成。這相當於 **「每次查詢都從零重新推導知識」**。

複利知識庫的機制如下：
1. **主動寫入 (Write-Active Ingestion)**:
   當導入一篇新論文 $D_{new}$ 時，AI 不僅僅對其進行向量索引。AI 會：
   * 分析 $D_{new}$ 對現有概念頁面 $C_1, C_2, ...$ 的影響。
   * 將 $D_{new}$ 中的新證據融入 $C_i$，甚至修改過時的推論。
   * 自動在相關頁面之間建立相對連結。
2. **知識固化 (Filing Back)**:
   當使用者提出一個需要深度合成的複雜問題（如：*「請對比這三種機制的優缺點」*）時，AI 合成的精美對比表，會作為一個全新的 **Synthesis** 頁面保存回 Wiki 中，供未來檢索。

---

## ⚖️ Critical Analysis / Pros & Cons

### 🟢 優勢 (Advantages)
* **高品質的深度解答**：跨文件的知識關聯早已在導入時由 AI 理清，查詢時能直接獲取具備高度合成性的全局視野。
* **低檢索負載**：省去了每次都要比對數百個原始塊的計算，僅需檢索幾頁經過 AI 精煉的 Wiki 概念頁面即可。
* **版本控制與透明度**：因為 Wiki 是一組 Markdown 檔案，可直接使用 Git 進行版本管理，追蹤 AI 的知識修改紀錄。

### 🔴 挑戰與局限 (Limitations)
* **導入開銷較高**：每導入一個 Source，AI 需要修改或生成多個檔案，這需要較多的 Token 消耗。
* **大規模一致性維持**：當知識庫達到數百頁時，AI 容易在更新時遺漏次要的關聯頁面。這需要像 `wiki.py lint` 這樣的工具進行定期維護。

---

## 🎓 Evolution & Evolving Insights

* **[2026-05-24]**: 根據 [Andrej Karpathy LLM Wiki Gist](../sources/karpathy-llm-wiki.md)，複利知識庫能夠解決人類維護知識庫時因「簿記成本（Bookkeeping Cost）」過高而最終放棄的痛點。

---

## 🔗 Related Topics
* [Andrej Karpathy LLM Wiki Gist](../sources/karpathy-llm-wiki.md) — 複利知識庫概念的起源。
* [Obsidian](../entities/obsidian.md) — 複利知識庫的最佳圖形化呈現平台。
