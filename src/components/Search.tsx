'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchItem {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  body: string;
}

interface SearchResult extends SearchItem {
  score: number;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-expo-surface-strong text-expo-ink font-semibold">{part}</mark> : part
  );
}

function calculateScore(item: SearchItem, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  if (item.title.toLowerCase().includes(lowerQuery)) score += 10;
  if (item.description.toLowerCase().includes(lowerQuery)) score += 5;
  if (item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 3;
  if (item.body.toLowerCase().includes(lowerQuery)) score += 1;

  return score;
}

function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchData, setSearchData] = useState<SearchItem[]>([]);

  useEffect(() => {
    fetch('/api/search.json')
      .then(res => res.json())
      .then(data => setSearchData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const scored = searchData
      .map(item => ({ ...item, score: calculateScore(item, query) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setResults(scored);
  }, [query, searchData]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="fixed inset-0 bg-expo-surface-dark/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div
        className="relative w-full max-w-xl bg-expo-canvas rounded-lg shadow-expo-card-hover overflow-hidden border border-expo-hairline"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4 border-b border-expo-hairline">
          <svg
            className="w-5 h-5 text-expo-muted mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋文章..."
            className="w-full bg-transparent outline-none text-expo-body-md font-sans placeholder:text-expo-muted"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-medium text-expo-muted bg-expo-surface-strong rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query && (
            <div className="px-5 py-8 text-center text-expo-muted text-caption">
              輸入關鍵字搜尋文章
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-5 py-8 text-center text-expo-muted text-caption">
              找不到符合「{query}」的文章
            </div>
          )}

          {results.map((result, index) => (
            <a
              key={result.slug}
              href={`/blog/${result.slug}`}
              className={`flex flex-col px-5 py-4 hover:bg-expo-canvas-soft transition-colors no-underline border-t ${
                index === 0 ? 'border-transparent' : 'border-expo-hairline'
              }`}
            >
              <h3 className="text-title-md text-expo-ink mb-1">
                {highlightText(result.title, query)}
              </h3>
              <p className="text-body-sm text-expo-body line-clamp-2">
                {highlightText(result.description, query)}
              </p>
              <div className="flex items-center mt-3 gap-2">
                <time className="text-[11px] text-expo-muted">
                  {new Date(result.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short' })}
                </time>
                {result.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 bg-expo-surface-strong text-expo-body rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger() {
  const [_, setIsOpen] = useState(false);

  const openSearch = () => {
    setIsOpen(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <>
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-1.5 bg-expo-surface-strong text-expo-ink rounded-md text-button font-medium hover:bg-expo-hairline-strong transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline">搜尋</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-expo-canvas border border-expo-hairline rounded">
          ⌘K
        </kbd>
      </button>
      <SearchModal />
    </>
  );
}
