"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { suggestSearch } from "../lib/search";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchInput({
  placeholder = "Search products...",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  // Debounce input
  const debouncedQ = useDebounce(q, 200);

  useEffect(() => {
    if (!debouncedQ) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    suggestSearch(debouncedQ, 5)
      .then((s) => {
        setSuggestions(s);
        setOpen(s.length > 0);
      })
      .catch(() => {
        // ignore
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [debouncedQ]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white dark:bg-neutral-900">
        <Search className="w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        <button type="submit" className="text-sm text-neutral-700 dark:text-neutral-200">Search</button>
      </form>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 shadow">
          {loading && (
            <div className="p-2 text-sm text-neutral-500">Searching...</div>
          )}
          {!loading && suggestions.length === 0 && (
            <div className="p-2 text-sm text-neutral-500">No suggestions</div>
          )}
          {!loading && suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="block w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(s)}`);
                setOpen(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
