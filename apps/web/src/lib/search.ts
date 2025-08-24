import { api } from './api';

export type SearchHit = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SearchResponse = {
  hits: SearchHit[];
  total: number;
  page: number;
  limit: number;
};

export async function searchProducts(params: {
  q: string;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price:asc' | 'price:desc' | 'createdAt:asc' | 'createdAt:desc';
}): Promise<SearchResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.category) query.set('category', params.category);
  if (typeof params.minPrice === 'number') query.set('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') query.set('maxPrice', String(params.maxPrice));
  if (params.sort) query.set('sort', params.sort);

  return api.get<SearchResponse>(`/search?${query.toString()}`);
}

export async function suggestSearch(q: string, limit = 5): Promise<string[]> {
  const query = new URLSearchParams({ q, limit: String(limit) });
  const res = await api.get<{ suggestions: string[] }>(`/search/suggest?${query.toString()}`);
  return res.suggestions;
}
