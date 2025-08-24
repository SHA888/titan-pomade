"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { searchProducts, type SearchHit } from "../../lib/search";
import Image from "next/image";

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get("q") || "";
  const pageParam = Number(params.get("page") || 1);
  const categoryParam = params.get("category") || "";
  const minPriceParam = params.get("minPrice");
  const maxPriceParam = params.get("maxPrice");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(pageParam);
  const [category, setCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState<string>(minPriceParam ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(maxPriceParam ?? "");
  const limit = 12;

  useEffect(() => {
    if (!q) {
      setHits([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    searchProducts({ q, page, limit, category: category || undefined, minPrice: min, maxPrice: max })
      .then((res) => {
        setHits(res.hits);
        setTotal(res.total);
      })
      .catch((e) => setError(e?.message || "Search failed"))
      .finally(() => setLoading(false));
  }, [q, page, category, minPrice, maxPrice]);

  // Keep URL in sync when page or filters change (on explicit actions below)
  const pushQuery = (overrides: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(params.toString());
    const entries: Array<[string, string | undefined]> = [
      ["q", q || undefined],
      ["page", overrides.page ?? String(page)],
      ["category", overrides.category ?? (category || undefined)],
      ["minPrice", overrides.minPrice ?? (minPrice || undefined)],
      ["maxPrice", overrides.maxPrice ?? (maxPrice || undefined)],
    ];
    for (const [k, v] of entries) {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    }
    router.push(`${pathname}?${sp.toString()}`);
  };

  const onApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // reset to first page when filters change
    setPage(1);
    pushQuery({ page: "1" });
  };

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Search results</h1>
      {q && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Query: <span className="font-mono">{q}</span></p>
      )}

      {/* Filters */}
      <form onSubmit={onApplyFilters} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. pomade"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Min Price</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0.00"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Price</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="100.00"
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="px-4 py-2 border rounded w-full md:w-auto">Apply</button>
        </div>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hits.map((h) => (
              <div key={h.id} className="border rounded-md p-3">
                {h.imageUrl ? (
                  <div className="relative w-full h-40 mb-2">
                    <Image src={h.imageUrl} alt={h.name} fill className="object-cover rounded" />
                  </div>
                ) : null}
                <div className="font-medium">{h.name}</div>
                <div className="text-xs text-neutral-500 line-clamp-2">{h.description}</div>
                <div className="mt-2 text-sm">${'{'}h.price.toFixed(2){'}'}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">{total} results</div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  pushQuery({ page: String(next) });
                }}
                disabled={page <= 1}
              >Prev</button>
              <div className="text-sm">Page {page} of {pages}</div>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => {
                  const next = Math.min(pages, page + 1);
                  setPage(next);
                  pushQuery({ page: String(next) });
                }}
                disabled={page >= pages}
              >Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
