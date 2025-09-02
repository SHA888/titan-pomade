import { api } from '../api';
import { Product } from '@prisma/client';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  isActive?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  search?: string;
}

export interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ProductsService {
  async getAll(params?: ProductQueryParams): Promise<ProductResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return api.get<ProductResponse>(endpoint);
  }

  async getById(id: string): Promise<Product> {
    return api.get<Product>(`/products/${id}`);
  }

  async create(data: ProductFormData): Promise<Product> {
    return api.post<Product>('/products', data);
  }

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    return api.put<Product>(`/products/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/products/${id}`);
  }

  async search(query: string): Promise<Product[]> {
    return api.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getByCategory(category: string): Promise<Product[]> {
    return api.get<Product[]>(`/products/category/${category}`);
  }
}

export const productsService = new ProductsService();