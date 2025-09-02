import { api } from '../api';
import { User, Role } from '@prisma/client';

export interface UserFormData {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  isEmailVerified?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UsersService {
  async getAll(params?: UserQueryParams): Promise<UserResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    return api.get<UserResponse>(endpoint);
  }

  async getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }

  async getByEmail(email: string): Promise<User | null> {
    return api.get<User>(`/users/email/${email}`);
  }

  async create(data: UserFormData): Promise<User> {
    return api.post<User>('/users', data);
  }

  async update(id: string, data: Partial<UserFormData>): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  }
}

export const usersService = new UsersService();