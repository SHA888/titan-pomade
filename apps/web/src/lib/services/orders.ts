import { api } from '../api';
import { Order, OrderStatus } from '@prisma/client';
import { generateId } from '../utils';

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderFormData {
  userId: string;
  items: OrderItemDto[];
  total: number;
  status?: OrderStatus;
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  status?: string;
}

export interface OrderResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class OrdersService {
  async getAll(params?: OrderQueryParams): Promise<OrderResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    return api.get<OrderResponse>(endpoint);
  }

  async getById(id: string): Promise<Order> {
    return api.get<Order>(`/orders/${id}`);
  }

  async create(data: OrderFormData): Promise<Order> {
    return api.post<Order>('/orders', data);
  }

  async update(id: string, data: Partial<OrderFormData>): Promise<Order> {
    return api.put<Order>(`/orders/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/orders/${id}`);
  }

  async getByUser(userId: string): Promise<Order[]> {
    return api.get<Order[]>(`/orders/user/${userId}`);
  }

  async getByStatus(status: string): Promise<Order[]> {
    return api.get<Order[]>(`/orders/status/${status}`);
  }
  
  // Helper method to create an optimistic order for UI updates
  createOptimisticOrder(data: OrderFormData): any {
    return {
      id: `optimistic-${generateId()}`,
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: data.status || OrderStatus.PENDING,
      shippingAddress: data.shippingAddress || null,
      paymentMethod: data.paymentMethod || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const ordersService = new OrdersService();