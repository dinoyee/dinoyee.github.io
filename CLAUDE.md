# LLM Wiki - AI Agent Protocol (CLAUDE.md)

This document contains rules, styles, and workflows for any AI Agent (e.g., Antigravity, Claude Code) operating in this workspace. **You must read and follow this protocol strictly to maintain the Compounding LLM Wiki.**

---

## 📂 Workspace Structure

* `sources/`: Immutable raw source files (PDFs, markdown clippings, text files). **Never modify files here.**
* `wiki/`: Mutable, persistent Markdown files compiled and maintained by the LLM.
  * `wiki/index.md`: The central directory of the wiki. Contains categories and link catalogs.
  * `wiki/log.md`: Chronological log of all operations (Ingest, Query, Lint).
  * `wiki/templates/`: Standard templates for wiki pages.
  * `wiki/sources/`: Summary pages for each ingested source.
  * `wiki/concepts/`: Key concepts, theoretical frameworks, or ideas.
  * `wiki/entities/`: Specific people, organizations, tools, or projects.
  * `wiki/synthesis/`: Synthetic comparison tables, deep dives, or meta-analyses.

---

## 🎨 Design & Markdown Standards

To ensure the wiki is clean, readable, and perfectly compatible with both **GitHub Markdown** and **Obsidian**:

1. **Filenames**: Use lowercase kebab-case (e.g., `neural-networks.md`, `attention-mechanism.md`).
2. **Title Structure**: Exactly one `# Title` (H1) per page. Use hierarchical H2 (`##`), H3 (`###`) headings.
3. **Links**: Use **standard Markdown relative links** instead of absolute paths or double-bracket wiki links:
   * Correct: `[Attention Mechanism](../concepts/attention-mechanism.md)`
   * Incorrect: `[[Attention Mechanism]]` or `[Attention](/wiki/concepts/attention-mechanism.md)`
4. **Metadata**: Every page must begin with YAML frontmatter containing:
   ```yaml
   ---
   title: "Page Title"
   category: "concept" # source | concept | entity | synthesis
   tags: [tag1, tag2]
   created: YYYY-MM-DD
   sources: ["source-filename.pdf"]
   ---
   ```
5. **No Placeholders**: Avoid writing placeholders like "TODO" or "details to be added". If details are missing, state what is currently known and note what data gaps exist.

---

## 🔄 Core Workflows

### 1. Ingest (导入新資料)
When the user asks to ingest a new document (e.g., `sources/my-paper.pdf`):
1. **Analyze**: Read the raw document carefully. Identify core arguments, key entities, novel concepts, and data.
2. **Draft Summary**: Create a source summary page under `wiki/sources/my-paper.md` using the standard source template.
3. **Cross-Reference**:
   * Search the wiki/index for existing pages that relate to this new source.
   * Update existing pages under `wiki/concepts/` or `wiki/entities/` with new findings. Always link back to the source page (e.g., `...as discussed in [Paper Title](../sources/my-paper.md)`).
   * If the source introduces a new major concept, create a new file in `wiki/concepts/` and link it.
4. **Update Index**: Update `wiki/index.md` to catalog the new source and any new concept pages.
5. **Append Log**: Append an entry to `wiki/log.md` with format:
   `## [YYYY-MM-DD] Ingest | summary of my-paper`

### 2. Query (查詢與累積知識)
When the user asks a question:
1. **Explore**: Read `wiki/index.md` or run `python wiki.py search <query>` to find relevant wiki pages.
2. **Synthesize**: Read the relevant wiki pages (and raw sources if needed for depth) to construct a comprehensive answer with citations.
3. **Compound**: If the answer is an analytical synthesis or a complex comparison, ask the user if you should **file it back** into the wiki. If approved, create a page under `wiki/synthesis/` (e.g., `wiki/synthesis/transformer-vs-lstm.md`), and update the index and log.

### 3. Lint (知識庫健康檢查)
Periodically check and repair the wiki:
1. Run `python wiki.py lint` to find dead links, orphan pages, or indexing mismatches.
2. **Clean up**:
   * Fix any broken links.
   * If a page is an orphan (no incoming links), find a logical parent page and add a link.
   * Scan for contradictions or outdated information across pages and reconcile them with the user.
3. Append log: `## [YYYY-MM-DD] Lint | Health check and link repair`

## 🛑 Operational Constraints & Rules

1. **Git Commits & Push Controls**:
   * **DO NOT** push (`git push`) to the remote repository automatically after code or article updates anymore.
   * **Wait** for the user's explicit instruction: **「幫我推到 git 倉庫」** (help me push to the git repository) before executing the remote push command.
   * You may still run `git add` and `git commit` locally to keep changes safely tracked, but **remote push (`git push`) must be explicitly requested by the user**.

---

## 🛠️ CLI Operations

Feel free to shell out to `wiki.py` to automate operations:
* Search: `python wiki.py search "<keyword>"`
* Health Check: `python wiki.py lint`
* Statistics: `python wiki.py stats`
