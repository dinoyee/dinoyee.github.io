#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
LLM Wiki Helper CLI
Provides Search (TF-IDF), Lint (link checks & orphan finder), and Stats for the LLM Wiki.
No external dependencies. Works on Python 3.6+.
"""

import os
import sys
import re
import math
from collections import Counter, defaultdict

# Color constants for terminal output
COLOR_HEADER = "\033[95m"
COLOR_BLUE = "\033[94m"
COLOR_CYAN = "\033[96m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_RED = "\033[91m"
COLOR_END = "\033[0m"
COLOR_BOLD = "\033[1m"

def print_success(msg):
    print(f"{COLOR_GREEN}✔ {msg}{COLOR_END}")

def print_warning(msg):
    print(f"{COLOR_YELLOW}⚠ {msg}{COLOR_END}")

def print_error(msg):
    print(f"{COLOR_RED}✘ {msg}{COLOR_END}")

def print_header(msg):
    print(f"\n{COLOR_BOLD}{COLOR_HEADER}=== {msg} ==={COLOR_END}\n")

# Tokenizer supporting English words and Chinese characters
def tokenize(text):
    text = text.lower()
    tokens = []
    # English words and numbers
    words = re.findall(r'[a-zA-Z0-9]+', text)
    tokens.extend(words)
    # Chinese characters
    chinese = re.findall(r'[\u4e00-\u9fff]', text)
    tokens.extend(chinese)
    return tokens

# Read YAML Frontmatter
def parse_frontmatter(content):
    metadata = {}
    if content.startswith("---"):
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if match:
            yaml_text = match.group(1)
            for line in yaml_text.split("\n"):
                if ":" in line:
                    key, val = line.split(":", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    # Try to parse list if starts with [ and ends with ]
                    if val.startswith("[") and val.endswith("]"):
                        val = [item.strip().strip('"').strip("'") for item in val[1:-1].split(",") if item.strip()]
                    metadata[key] = val
    return metadata

# Find all markdown files in wiki/ (excluding templates)
def get_wiki_files(base_dir):
    wiki_dir = os.path.join(base_dir, "wiki")
    if not os.path.isdir(wiki_dir):
        return []
    
    md_files = []
    for root, dirs, files in os.walk(wiki_dir):
        # Exclude templates directory
        if "templates" in os.path.relpath(root, wiki_dir).split(os.sep):
            continue
        for file in files:
            if file.endswith(".md"):
                md_files.append(os.path.join(root, file))
    return md_files

# Search Command using TF-IDF ranking
def cmd_search(base_dir, query_str):
    if not query_str:
        print_error("Please specify a search query.")
        return
    
    print_header(f"Searching Wiki for: '{query_str}'")
    
    md_files = get_wiki_files(base_dir)
    if not md_files:
        print_warning("No wiki files found.")
        return
    
    # Preprocess all documents
    documents = {}
    doc_tokens = {}
    doc_titles = {}
    
    for file_path in md_files:
        rel_path = os.path.relpath(file_path, base_dir)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            documents[rel_path] = content
            doc_tokens[rel_path] = tokenize(content)
            
            # Extract title
            meta = parse_frontmatter(content)
            title = meta.get("title")
            if not title:
                title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                title = title_match.group(1).strip() if title_match else os.path.basename(file_path)
            doc_titles[rel_path] = title
        except Exception as e:
            continue
            
    # Calculate Term Frequencies (TF) and Document Frequencies (DF)
    df = defaultdict(int)
    all_terms = set()
    tfs = {}
    
    for rel_path, tokens in doc_tokens.items():
        tf = Counter(tokens)
        tfs[rel_path] = tf
        for term in tf:
            df[term] += 1
            all_terms.add(term)
            
    N = len(documents)
    query_tokens = tokenize(query_str)
    
    if not query_tokens:
        print_warning("Query resulted in empty tokens.")
        return
        
    scores = {}
    for rel_path, tokens in doc_tokens.items():
        score = 0.0
        tf = tfs[rel_path]
        for term in query_tokens:
            if term in tf:
                # TF-IDF Score formula
                term_tf = tf[term]
                term_idf = math.log((N / (df[term])) + 0.01) + 1
                score += term_tf * term_idf
        if score > 0:
            scores[rel_path] = score
            
    if not scores:
        print_warning("No matching pages found.")
        return
        
    # Sort results
    sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    print(f"Found {len(sorted_results)} matching pages:\n")
    for idx, (rel_path, score) in enumerate(sorted_results[:5], 1):
        title = doc_titles[rel_path]
        content = documents[rel_path]
        
        # Get a snippet
        snippet = ""
        query_words = [q for q in query_tokens if len(q) > 1 or re.match(r'[\u4e00-\u9fff]', q)]
        best_match_idx = -1
        
        if query_words:
            # Find the best paragraph containing query words
            paragraphs = content.split("\n\n")
            best_score = 0
            for para in paragraphs:
                para_lower = para.lower()
                para_score = sum(1 for word in query_words if word in para_lower)
                if para_score > best_score:
                    best_score = para_score
                    snippet = para.replace("\n", " ").strip()
                    if len(snippet) > 150:
                        snippet = snippet[:150] + "..."
        
        if not snippet:
            # Fallback to first H2 or beginning text
            fallback_match = re.search(r"^##\s+(.+)$", content, re.MULTILINE)
            if fallback_match:
                snippet = "Section: " + fallback_match.group(1).strip()
            else:
                text_only = re.sub(r"---.*?---", "", content, flags=re.DOTALL).strip()
                text_only = re.sub(r"[#*`\-]", "", text_only).strip()
                snippet = text_only[:120].replace("\n", " ") + "..."
                
        print(f"{COLOR_BOLD}{idx}. {title}{COLOR_END} ({COLOR_BLUE}{rel_path}{COLOR_END}) [Score: {score:.2f}]")
        print(f"   {COLOR_CYAN}\"{snippet}\"{COLOR_END}\n")

# Lint Command: dead link checks and orphan files finder
def cmd_lint(base_dir):
    print_header("Running LLM Wiki Health Check (Lint)")
    
    md_files = get_wiki_files(base_dir)
    wiki_dir = os.path.join(base_dir, "wiki")
    
    # Store standard paths of all files for fast lookup
    existing_files = {os.path.abspath(f) for f in md_files}
    
    broken_links = 0
    inbound_links = defaultdict(int)
    
    for file_path in md_files:
        rel_path = os.path.relpath(file_path, base_dir)
        dir_path = os.path.dirname(file_path)
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print_error(f"Cannot read file: {rel_path} - {e}")
            continue
            
        # 1. Parse markdown links [text](path)
        links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
        for text, path in links:
            # Skip web links, email, or pure page anchors
            if path.startswith("http://") or path.startswith("https://") or path.startswith("mailto:") or path.startswith("#"):
                continue
            
            # Strip anchors (e.g. file.md#section -> file.md)
            clean_path = path.split("#")[0]
            if not clean_path:
                continue
                
            # Resolve path relative to current file's directory
            target_abs = os.path.abspath(os.path.join(dir_path, clean_path))
            
            if target_abs not in existing_files and not os.path.exists(target_abs):
                print_error(f"Broken Link in {COLOR_BOLD}{rel_path}{COLOR_END}: link points to '{path}' which does not exist.")
                broken_links += 1
            else:
                if target_abs in existing_files:
                    inbound_links[target_abs] += 1
                    
        # 2. Parse Obsidian double-bracket links [[link]] or [[link|label]]
        obsidian_links = re.findall(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', content)
        for raw_link in obsidian_links:
            raw_link = raw_link.strip()
            # Standardize Obsidian links: they often omit directory and extension.
            # We will search if there exists a file ending with raw_link.md or matching raw_link
            link_found = False
            for f in md_files:
                f_name = os.path.basename(f)
                f_name_no_ext = os.path.splitext(f_name)[0]
                if f_name_no_ext.lower() == raw_link.lower() or f_name.lower() == raw_link.lower():
                    inbound_links[os.path.abspath(f)] += 1
                    link_found = True
                    break
            if not link_found:
                # Also try matching absolute/relative paths if typed
                target_abs = os.path.abspath(os.path.join(dir_path, raw_link))
                if os.path.exists(target_abs) or os.path.exists(target_abs + ".md"):
                    inbound_links[target_abs if os.path.exists(target_abs) else target_abs + ".md"] += 1
                    link_found = True
                    
            if not link_found:
                print_warning(f"Obsidian WikiLink unresolved in {COLOR_BOLD}{rel_path}{COLOR_END}: [[{raw_link}]]")
                broken_links += 1

    # 3. Find Orphan Pages (excluding index.md)
    index_abs = os.path.abspath(os.path.join(wiki_dir, "index.md"))
    orphans = []
    
    for file_path in md_files:
        abs_path = os.path.abspath(file_path)
        if abs_path == index_abs:
            continue
        if inbound_links[abs_path] == 0:
            orphans.append(os.path.relpath(file_path, base_dir))
            
    # Print Results
    if broken_links == 0:
        print_success("No broken links found!")
    else:
        print_error(f"Found {broken_links} broken/unresolved links.")
        
    if not orphans:
        print_success("No orphan pages found! Every page is interlinked.")
    else:
        print_warning(f"Found {len(orphans)} orphan pages (no inbound links):")
        for orphan in orphans:
            print(f"  - {COLOR_YELLOW}{orphan}{COLOR_END}")
        print("  💡 Suggestion: Link these files from relevant topic pages or from index.md to maintain a compounding graph.")
        
    if broken_links == 0 and not orphans:
        print_success("Wiki is perfectly healthy! ✨")

# Stats Command: Count files, categories, links
def cmd_stats(base_dir):
    print_header("LLM Wiki Statistics")
    
    md_files = get_wiki_files(base_dir)
    sources_dir = os.path.join(base_dir, "sources")
    raw_sources_count = 0
    if os.path.isdir(sources_dir):
        raw_sources_count = len([f for f in os.listdir(sources_dir) if os.path.isfile(os.path.join(sources_dir, f)) and not f.startswith(".")])
        
    category_counts = defaultdict(int)
    total_links = 0
    tag_counts = defaultdict(int)
    
    for file_path in md_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Parse Frontmatter Category
            meta = parse_frontmatter(content)
            cat = meta.get("category", "uncategorized")
            category_counts[cat] += 1
            
            # Parse Tags
            tags = meta.get("tags", [])
            if isinstance(tags, list):
                for t in tags:
                    tag_counts[t] += 1
            
            # Count local links
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            for _, path in links:
                if not (path.startswith("http") or path.startswith("#")):
                    total_links += 1
            obsidian_links = re.findall(r'\[\[([^\]]+)\]\]', content)
            total_links += len(obsidian_links)
            
        except Exception:
            continue
            
    # Count Log Entries
    log_file = os.path.join(base_dir, "wiki", "log.md")
    log_entries_count = 0
    if os.path.exists(log_file):
        try:
            with open(log_file, "r", encoding="utf-8") as f:
                log_content = f.read()
            # Count markdown header rows starting with ## [YYYY-MM-DD]
            log_entries_count = len(re.findall(r"^##\s+\[\d{4}-\d{2}-\d{2}\]", log_content, re.MULTILINE))
        except Exception:
            pass
            
    print(f"📁 {COLOR_BOLD}Directory Structure:{COLOR_END}")
    print(f"  - Total Raw Sources: {COLOR_CYAN}{raw_sources_count}{COLOR_END} files in sources/")
    print(f"  - Total Wiki Pages:  {COLOR_CYAN}{len(md_files)}{COLOR_END} files in wiki/ (excluding templates)\n")
    
    print(f"🏷️  {COLOR_BOLD}Categories Breakdown:{COLOR_END}")
    for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {cat.capitalize():<15}: {COLOR_BLUE}{count}{COLOR_END} pages")
    print("")
        
    print(f"🔗 {COLOR_BOLD}Link Density:{COLOR_END}")
    print(f"  - Total Internal Links: {COLOR_CYAN}{total_links}{COLOR_END}")
    if len(md_files) > 1:
        avg_links = total_links / (len(md_files) - 1)
        print(f"  - Average Link Density: {COLOR_CYAN}{avg_links:.2f}{COLOR_END} links per page\n")
        
    print(f"📈 {COLOR_Bold if 'COLOR_Bold' in globals() else COLOR_BOLD}Activity Log:{COLOR_END}")
    print(f"  - Total Recorded Operations: {COLOR_CYAN}{log_entries_count}{COLOR_END} events in log.md\n")

    if tag_counts:
        print(f"🏷️  {COLOR_BOLD}Top Tags:{COLOR_END}")
        for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  - #{tag:<15}: {COLOR_BLUE}{count}{COLOR_END} occurrences")
        print("")

def print_help():
    print(f"""
{COLOR_BOLD}LLM Wiki Helper CLI{COLOR_END}
A CLI tool designed to help search, lint, and gather stats from your compounding LLM Wiki.

{COLOR_BOLD}Usage:{COLOR_END}
  python wiki.py search "<query>"   全文檢索 Wiki 內容 (支援中英文 TF-IDF 權重比對)
  python wiki.py lint               健康檢查 (偵測死連結、孤立頁面)
  python wiki.py stats              顯示知識庫統計數據 (頁面數、分類比例、連結密度)
  python wiki.py help               顯示此說明
""")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    if len(sys.argv) < 2:
        print_help()
        return
        
    cmd = sys.argv[1].lower()
    
    if cmd == "search":
        query_str = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else ""
        cmd_search(base_dir, query_str)
    elif cmd == "lint":
        cmd_lint(base_dir)
    elif cmd == "stats":
        cmd_stats(base_dir)
    elif cmd in ("help", "--help", "-h"):
        print_help()
    else:
        print_error(f"Unknown command: {cmd}")
        print_help()

if __name__ == "__main__":
    main()
