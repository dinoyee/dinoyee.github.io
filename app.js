/**
 * LLM Wiki SPA Web Portal Controller
 * Implements SPA Router, Dynamic Sidebar Parser, Alert Parser, 
 * and a Client-side TF-IDF Search Engine.
 */

// Global Error Handler for visual debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global JS Error:", message, "at", source, ":", lineno);
  const contentArea = document.getElementById('contentArea');
  if (contentArea) {
    contentArea.innerHTML = `
      <div class="markdown-body" style="padding: 40px 0; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"><i class="fa-solid fa-circle-exclamation"></i></div>
        <h3>瀏覽器執行錯誤 (Runtime Error)</h3>
        <p style="color: #ef4444; font-family: monospace; font-size: 0.9rem; text-align: left; background: rgba(0,0,0,0.1); padding: 16px; border-radius: 8px; margin-top: 16px; word-break: break-all;">
          ${message}<br><br>
          <span style="color: var(--text-muted); font-size: 0.8rem;">檔案來源: ${source} (第 ${lineno} 行，第 ${colno} 列)</span>
        </p>
      </div>
    `;
  }
  return false;
};

window.onunhandledrejection = function(event) {
  console.error("Unhandled Promise Rejection:", event.reason);
  const contentArea = document.getElementById('contentArea');
  if (contentArea) {
    contentArea.innerHTML = `
      <div class="markdown-body" style="padding: 40px 0; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"><i class="fa-solid fa-circle-exclamation"></i></div>
        <h3>非同步處理錯誤 (Promise Rejection)</h3>
        <p style="color: #ef4444; font-family: monospace; font-size: 0.9rem; text-align: left; background: rgba(0,0,0,0.1); padding: 16px; border-radius: 8px; margin-top: 16px; word-break: break-all;">
          ${event.reason}
        </p>
      </div>
    `;
  }
};

// Global Configuration
const WIKI_DIR = 'wiki';
const INDEX_FILE = `${WIKI_DIR}/index.md`;

// Application State
const appState = {
  currentRoute: '', // E.g., 'index.md' or 'concepts/flutter-layout-basics.md'
  pages: {},        // Map of path -> raw markdown text
  searchIndex: null, // Compiled TF-IDF search index
  sidebarLoaded: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  loadApplication();
});

// Theme Management (Dark/Light)
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  updateGiscusTheme(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (menuToggle && sidebar && overlay) {
    const toggleMenu = () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    };
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Hash route listener
  window.addEventListener('hashchange', handleRouteChange);

  // Search listeners
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) {
        document.getElementById('searchResults').style.display = 'block';
      }
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      document.getElementById('searchResults').style.display = 'none';
      searchInput.focus();
    });
  }

  // Hide search dropdown clicking outside
  document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(e.target)) {
      document.getElementById('searchResults').style.display = 'none';
    }
    
    // Auto-close mobile sidebar on link click
    if (window.innerWidth <= 1024 && e.target.tagName === 'A' && e.target.closest('.sidebar-nav')) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  });

  // Desktop sidebar collapse toggle
  const desktopToggle = document.getElementById('desktopSidebarToggle');
  const appContainer = document.querySelector('.app-container');
  
  if (desktopToggle && appContainer) {
    desktopToggle.addEventListener('click', () => {
      appContainer.classList.toggle('sidebar-collapsed');
      const icon = desktopToggle.querySelector('i');
      if (icon) {
        if (appContainer.classList.contains('sidebar-collapsed')) {
          icon.className = 'fa-solid fa-chevron-right';
        } else {
          icon.className = 'fa-solid fa-chevron-left';
        }
      }
    });
  }
}

// Route handling and SPA controller
async function loadApplication() {
  try {
    // 1. Fetch index.md first to build the menu
    const indexResponse = await fetch(INDEX_FILE, { cache: 'no-cache' });
    if (!indexResponse.ok) throw new Error('無法載入 index.md');
    const indexMd = await indexResponse.text();
    
    appState.pages['index.md'] = indexMd;
    
    // 2. Parse index.md to extract links & render sidebar
    renderSidebar(indexMd);
    
    // 3. Extract all local links for background pre-fetching
    const allLinks = extractLocalLinks(indexMd);
    
    // 4. Pre-fetch all pages in background for instant search & routing
    prefetchPages(allLinks);
    
    // 5. Handle initial route
    handleRouteChange();
  } catch (error) {
    console.error('Initialization error:', error);
    renderError(`<h3>系統初始化失敗</h3><p>${error.message}</p>`);
  }
}

// Router Hash Change Handler
async function handleRouteChange() {
  const hash = window.location.hash;
  // Default to index.md if hash is empty, home, or index
  let route = 'index.md';
  
  if (hash && hash !== '#/' && hash !== '#/index.md') {
    route = hash.replace(/^#\//, '');
  }

  appState.currentRoute = route;
  
  // Highlight active sidebar item
  updateActiveNavLink(route);
  
  // Render loading state
  renderLoading();
  
  try {
    let mdContent = '';
    
    // If already pre-fetched, use cached version, else fetch dynamically
    if (appState.pages[route]) {
      mdContent = appState.pages[route];
    } else {
      const fetchPath = `${WIKI_DIR}/${route}`;
      const response = await fetch(fetchPath, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`無法載入路徑: ${route}`);
      mdContent = await response.text();
      appState.pages[route] = mdContent; // Cache it
    }
    
    renderContent(route, mdContent);
  } catch (error) {
    console.error('Routing error:', error);
    renderError(`<h3>找不到頁面</h3><p>無法載入或解析檔案: <code>wiki/${route}</code>。請檢查該檔案是否存在。</p>`);
  }
}

// Relative path resolver for SPA Links
function resolveRelativePath(currentRoute, relativePath) {
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('#')) {
    return relativePath;
  }
  
  // Normalize current path
  const currentParts = currentRoute.split('/').filter(p => p);
  currentParts.pop(); // Remove the filename to get current directory
  
  const relativeParts = relativePath.split('/');
  for (const part of relativeParts) {
    if (part === '.' || !part) continue;
    if (part === '..') {
      currentParts.pop();
    } else {
      currentParts.push(part);
    }
  }
  
  return currentParts.join('/');
}

// Sidebar Parser
function renderSidebar(indexMd) {
  const sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;
  
  // Parse index.md to find the "知識地圖目錄" section
  const sectionMatch = indexMd.match(/## 📚 知識地圖目錄\s*\n([\s\S]*?)(?=\n## |$)/);
  let catalogMd = '';
  
  if (sectionMatch) {
    catalogMd = sectionMatch[1].trim();
  } else {
    // Fallback: use the whole index file if section not found
    catalogMd = indexMd;
  }
  
  // Parse markdown into HTML
  let catalogHtml = marked.parse(catalogMd);
  
  // Convert local links to SPA hash links (e.g. href="concepts/x.md" -> href="#/concepts/x.md")
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = catalogHtml;
  
  const links = tempDiv.querySelectorAll('a');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      a.setAttribute('href', `#/${href}`);
    }
  });
  
  // Wrap H3 headers into folder style with Chevrons
  const headers = tempDiv.querySelectorAll('h3');
  headers.forEach(h3 => {
    const titleText = h3.innerHTML;
    h3.innerHTML = `<span class="folder-chevron"><i class="fa-solid fa-chevron-right"></i></span><span class="folder-title">${titleText}</span>`;
  });
  
  sidebarNav.innerHTML = tempDiv.innerHTML;
  
  // Bind click toggle events to H3 elements in sidebarNav
  bindSidebarEvents();
  
  appState.sidebarLoaded = true;
  updateActiveNavLink(appState.currentRoute);
}

// Bind folder toggle events
function bindSidebarEvents() {
  const sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;
  
  const headers = sidebarNav.querySelectorAll('h3');
  headers.forEach(h3 => {
    h3.addEventListener('click', () => {
      const nextUl = h3.nextElementSibling;
      if (nextUl && nextUl.tagName === 'UL') {
        h3.classList.toggle('expanded');
        nextUl.classList.toggle('expanded');
      }
    });
  });
}

// Active Nav highlight & Auto-expansion of parent folder
function updateActiveNavLink(route) {
  const navLinks = document.querySelectorAll('#sidebarNav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const cleanHref = href.replace(/^#\//, '');
      if (cleanHref === route || (route === 'index.md' && cleanHref === '')) {
        link.classList.add('active');
        
        // Auto-expand the folder containing this link
        let parent = link.parentElement;
        while (parent && parent.id !== 'sidebarNav') {
          if (parent.tagName === 'UL') {
            parent.classList.add('expanded');
            // Find the preceding h3 and expand it
            const prevHeader = parent.previousElementSibling;
            if (prevHeader && prevHeader.tagName === 'H3') {
              prevHeader.classList.add('expanded');
            }
          }
          parent = parent.parentElement;
        }
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// Extract all local relative markdown links from index
function extractLocalLinks(indexMd) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(indexMd)) !== null) {
    const path = match[1];
    if (!path.startsWith('http') && !path.startsWith('#') && path.endsWith('.md')) {
      links.push(path);
    }
  }
  return [...new Set(links)]; // Deduplicate
}

// Background pre-fetching for instant search
async function prefetchPages(links) {
  const fetchPromises = links.map(async (path) => {
    try {
      const fetchPath = `${WIKI_DIR}/${path}`;
      const response = await fetch(fetchPath, { cache: 'no-cache' });
      if (response.ok) {
        appState.pages[path] = await response.text();
      }
    } catch (e) {
      console.warn(`Failed to prefetch: ${path}`, e);
    }
  });
  
  await Promise.all(fetchPromises);
  // Re-build the client search index with the freshly fetched pages
  buildSearchIndex();
}

// Parse YAML Frontmatter
function parseFrontmatter(content) {
  const metadata = {
    title: '',
    category: '',
    tags: [],
    created: '',
    sources: []
  };
  
  if (content.startsWith('---')) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (match) {
      const yamlText = match[1];
      const lines = yamlText.split('\n');
      lines.forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.substring(0, colonIdx).trim();
          let val = line.substring(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          
          if (key === 'tags' || key === 'sources') {
            // Parse inline arrays [a, b, c]
            if (val.startsWith('[') && val.endsWith(']')) {
              metadata[key] = val.substring(1, val.length - 1)
                                .split(',')
                                .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
                                .filter(Boolean);
            } else {
              metadata[key] = [val].filter(Boolean);
            }
          } else {
            metadata[key] = val;
          }
        }
      });
      return {
        metadata,
        cleanContent: content.substring(match[0].length)
      };
    }
  }
  
  return {
    metadata: null,
    cleanContent: content
  };
}

// Custom Callouts Parser (GitHub-style alerts: > [!NOTE])
function parseAlerts(htmlContent) {
  const calloutRegex = /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi;
  
  return htmlContent.replace(calloutRegex, (match, type, content) => {
    type = type.toUpperCase();
    let icon = 'fa-info-circle';
    let colorClass = 'alert-note';
    let displayTitle = 'NOTE';
    
    if (type === 'TIP') {
      icon = 'fa-lightbulb';
      colorClass = 'alert-note';
      displayTitle = 'TIP';
    } else if (type === 'IMPORTANT') {
      icon = 'fa-circle-exclamation';
      colorClass = 'alert-important';
      displayTitle = 'IMPORTANT';
    } else if (type === 'WARNING') {
      icon = 'fa-triangle-exclamation';
      colorClass = 'alert-warning';
      displayTitle = 'WARNING';
    } else if (type === 'CAUTION') {
      icon = 'fa-circle-radiation';
      colorClass = 'alert-warning';
      displayTitle = 'CAUTION';
    }
    
    return `
      <div class="alert ${colorClass}">
        <div class="alert-title"><i class="fa-solid ${icon}"></i> ${displayTitle}</div>
        <div class="alert-content">${content.trim()}</div>
      </div>
    `;
  });
}

// Render Markdown Content into the view
function renderContent(route, rawMd) {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;
  
  // 1. Parse Frontmatter
  const { metadata, cleanContent } = parseFrontmatter(rawMd);
  
  // 2. Parse Markdown to HTML
  let parsedHtml = marked.parse(cleanContent);
  
  // 3. Inject custom premium alert blocks
  parsedHtml = parseAlerts(parsedHtml);
  
  // 4. Sanitize HTML for security (DOMPurify)
  const safeHtml = DOMPurify.sanitize(parsedHtml);
  
  // 5. Build full HTML view (with Frontmatter panel if exists)
  let htmlView = '';
  
  if (metadata && route !== 'index.md') {
    let tagsHtml = '';
    if (metadata.tags && metadata.tags.length > 0) {
      tagsHtml = metadata.tags.map(t => `<span class="frontmatter-tag">#${t}</span>`).join('');
    }
    
    htmlView = `
      <div class="frontmatter-panel">
        ${metadata.category ? `
          <div class="frontmatter-item">
            <span class="frontmatter-label">分類 / Category</span>
            <span class="frontmatter-value">${metadata.category.toUpperCase()}</span>
          </div>
        ` : ''}
        ${metadata.created ? `
          <div class="frontmatter-item">
            <span class="frontmatter-label">日期 / Date</span>
            <span class="frontmatter-value">${metadata.created}</span>
          </div>
        ` : ''}
        ${tagsHtml ? `
          <div class="frontmatter-item" style="flex: 1 1 100%;">
            <span class="frontmatter-label">標籤 / Tags</span>
            <span class="frontmatter-value">${tagsHtml}</span>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  htmlView += `<div class="markdown-body">${safeHtml}</div>`;
  
  // Inject Giscus comment board at the bottom of non-homepage articles
  if (route !== 'index.md') {
    htmlView += `
      <div id="giscusContainer" style="margin-top: 60px; border-top: 1px solid var(--border-color); padding-top: 40px;"></div>
    `;
  }
  
  // 6. Push to page view
  contentArea.innerHTML = htmlView;
  
  // 6b. Dynamic load Giscus comment board
  loadGiscus(route);
  
  // 7. Resolve relative links inside rendered body to hash links
  const renderedLinks = contentArea.querySelectorAll('.markdown-body a');
  renderedLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      // Resolve path against current route
      const resolvedRoute = resolveRelativePath(route, href);
      a.setAttribute('href', `#/${resolvedRoute}`);
    }
  });
  
  // 8. Re-apply syntax highlighting via Prism
  Prism.highlightAll();
  
  // 9. Update top bar breadcrumbs
  updateBreadcrumbs(route, metadata?.title);
  
  // 10. Scroll content back to top
  contentArea.scrollTop = 0;
}

// Breadcrumb updating
function updateBreadcrumbs(route, pageTitle) {
  const crumbs = document.getElementById('breadcrumbs');
  if (!crumbs) return;
  
  if (route === 'index.md') {
    crumbs.innerHTML = '<span class="breadcrumb-item"><i class="fa-solid fa-house"></i> Home</span>';
    return;
  }
  
  const parts = route.split('/');
  let breadcrumbHtml = '<a href="#/index.md" class="breadcrumb-item"><i class="fa-solid fa-house"></i> Home</a>';
  
  parts.forEach((part, index) => {
    breadcrumbHtml += ' <span class="breadcrumb-separator"><i class="fa-solid fa-chevron-right"></i></span> ';
    if (index === parts.length - 1) {
      // Filename: use frontmatter pageTitle, or fallback to cleaned name
      const displayName = pageTitle || part.replace(/\.md$/, '').replace(/-/g, ' ');
      breadcrumbHtml += `<span class="breadcrumb-item breadcrumb-active">${displayName}</span>`;
    } else {
      // Directory name
      breadcrumbHtml += `<span class="breadcrumb-item">${part.toUpperCase()}</span>`;
    }
  });
  
  crumbs.innerHTML = breadcrumbHtml;
}

// Helpers for loading and error screens
function renderLoading() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;
  contentArea.innerHTML = `
    <div class="content-loading">
      <i class="fa-solid fa-circle-notch fa-spin loading-icon"></i>
      <p>載入中...</p>
    </div>
  `;
}

function renderError(htmlMsg) {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;
  contentArea.innerHTML = `
    <div class="markdown-body" style="padding: 40px 0; text-align: center; color: var(--text-secondary);">
      <div style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"><i class="fa-solid fa-circle-exclamation"></i></div>
      ${htmlMsg}
    </div>
  `;
}

// ==========================================
// 🔍 CLIENT SIDE TF-IDF SEARCH ENGINE
// ==========================================

// Tokenizer matching Chinese characters and English words
function jsTokenize(text) {
  text = text.toLowerCase();
  const tokens = [];
  // English words and numbers
  const words = text.match(/[a-zA-Z0-9]+/g) || [];
  tokens.push(...words);
  // Chinese characters
  const Chinese = text.match(/[\u4e00-\u9fff]/g) || [];
  tokens.push(...Chinese);
  return tokens;
}

// Pre-build the TF-IDF search index
function buildSearchIndex() {
  const docTokens = {};
  const docTitles = {};
  const df = {};
  
  // Tokenize and index all pages in memory
  Object.entries(appState.pages).forEach(([path, content]) => {
    // Skip template folder
    if (path.startsWith('templates/')) return;
    
    const tokens = jsTokenize(content);
    docTokens[path] = tokens;
    
    // Extract Title
    const { metadata } = parseFrontmatter(content);
    let title = metadata?.title || '';
    if (!title) {
      const h1Match = content.match(/^#\s+(.+)$/m);
      title = h1Match ? h1Match[1].trim() : path.split('/').pop().replace(/\.md$/, '');
    }
    docTitles[path] = title;
    
    // Document frequency (DF)
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(t => {
      df[t] = (df[t] || 0) + 1;
    });
  });
  
  appState.searchIndex = {
    docTokens,
    docTitles,
    df,
    N: Object.keys(docTokens).length
  };
}

// Search execution
function handleSearch(e) {
  const query = e.target.value.trim();
  const dropdown = document.getElementById('searchResults');
  const clearBtn = document.getElementById('searchClearBtn');
  
  if (!query) {
    dropdown.style.display = 'none';
    clearBtn.style.display = 'none';
    return;
  }
  
  clearBtn.style.display = 'block';
  dropdown.style.display = 'block';
  
  if (!appState.searchIndex) {
    buildSearchIndex();
  }
  
  const { docTokens, docTitles, df, N } = appState.searchIndex;
  const qTokens = jsTokenize(query);
  
  if (qTokens.length === 0) {
    dropdown.innerHTML = '<div class="search-no-results">輸入中...</div>';
    return;
  }
  
  const scores = [];
  
  // Calculate TF-IDF score for each document
  Object.entries(docTokens).forEach(([path, tokens]) => {
    // Term frequencies in this document
    const tf = {};
    tokens.forEach(t => {
      tf[t] = (tf[t] || 0) + 1;
    });
    
    let score = 0.0;
    qTokens.forEach(term => {
      if (tf[term]) {
        const termTf = tf[term];
        const termIdf = Math.log((N / (df[term] || 1)) + 0.01) + 1;
        score += termTf * termIdf;
      }
    });
    
    if (score > 0) {
      scores.push({ path, score, title: docTitles[path] });
    }
  });
  
  if (scores.length === 0) {
    dropdown.innerHTML = '<div class="search-no-results">找不到匹配的內容</div>';
    return;
  }
  
  // Sort descending
  scores.sort((a, b) => b.score - a.score);
  
  // Render results
  let resultsHtml = '';
  scores.slice(0, 5).forEach(res => {
    // Create a beautiful snippet
    const rawContent = appState.pages[res.path];
    const cleanContent = rawContent.replace(/---[\s\S]*?---/, '').replace(/[#*`\-]/g, ' ').replace(/\n/g, ' ');
    let snippet = cleanContent.trim().substring(0, 80) + '...';
    
    // Highlight matched words in snippet
    let highlightedSnippet = snippet;
    qTokens.forEach(term => {
      if (term.length > 1 || /[\u4e00-\u9fff]/.test(term)) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedSnippet = highlightedSnippet.replace(regex, '<mark>$1</mark>');
      }
    });
    
    resultsHtml += `
      <div class="search-result-item" onclick="navigateSPA('${res.path}')">
        <div class="search-result-title">${res.title}</div>
        <div class="search-result-snippet">${highlightedSnippet}</div>
      </div>
    `;
  });
  
  dropdown.innerHTML = resultsHtml;
}

// Direct Navigation helper
window.navigateSPA = function(path) {
  window.location.hash = `#/${path}`;
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClearBtn').style.display = 'none';
  document.getElementById('searchResults').style.display = 'none';
};

// Dynamic Giscus Comment System Loader
function loadGiscus(route) {
  const container = document.getElementById('giscusContainer');
  if (!container) return;
  container.innerHTML = ''; // Clear previous board
  
  if (route === 'index.md') return;

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'dinoyee/dinoyee.github.io');
  script.setAttribute('data-repo-id', 'R_kgDOSR_3uw');
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDOSR_3u84C95G-');
  
  // Map discussions to unique wiki route filenames to keep threads completely isolated
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', route);
  
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  
  // Sync Giscus visual theme with current site settings
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  script.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : 'light');
  
  script.setAttribute('data-lang', 'zh-TW');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  
  container.appendChild(script);
}

// Seamless dynamic theme switching without reloading Giscus iframe
function updateGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) return;
  const giscusTheme = theme === 'dark' ? 'dark' : 'light';
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  );
}
