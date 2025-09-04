'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CrudForm } from '@/components/forms/crud-form';
import { OptimisticCrudForm } from '@/components/forms/optimistic-crud-form';
import { DataTable } from '@/components/common/data-table';
import { Pagination } from '@/components/common/pagination';
import { useOptimisticCrud } from '@/hooks/use-optimistic-crud';

interface CrudPageProps<T extends { id: string | number }> {
  title: string;
  description: string;
  fields: any[];
  columns: any[];
  fetchData: (params: any) => Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>;
  createItem: (data: any) => Promise<T>;
  updateItem: (id: string | number, data: any) => Promise<T>;
  deleteItem: (id: string | number) => Promise<void>;
  idKey?: keyof T;
  initialFormData?: Record<string, any>;
  searchPlaceholder?: string;
}

export function CrudPage<T extends { id: string | number }>({
  title,
  description,
  fields,
  columns,
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  idKey = 'id',
  initialFormData = {},
  searchPlaceholder = 'Search...',
}: CrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    items: optimisticItems,
    createItem: optimisticCreate,
    updateItem: optimisticUpdate,
    deleteItem: optimisticDelete,
  } = useOptimisticCrud({
    items,
    idKey,
    onSuccess: () => {
      // Refresh the list after successful operations
      fetchItems();
    },
    onError: (error) => {
      console.error('CRUD operation failed:', error);
    },
  });

  // Fetch items when page, pageSize, or searchQuery changes
  useEffect(() => {
    fetchItems();
  }, [currentPage, pageSize, searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
      };
      
      const response = await fetchData(params);
      setItems(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Record<string, any>) => {
    try {
      await optimisticCreate(() => createItem(data), data as any);
      setShowCreateForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: Record<string, any>) => {
    try {
      await optimisticUpdate(() => updateItem(id, data), id, data as Partial<T>);
      setEditingItem(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (item: T) => {
    try {
      await optimisticDelete(() => deleteItem(item[idKey] as string | number), item[idKey] as string | number);
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateForm && !editingItem && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create {title}
                </Button>
              </div>

              <DataTable
                data={optimisticItems}
                columns={columns}
                onEdit={setEditingItem}
                onDelete={handleDelete}
                loading={loading}
                emptyState={`No ${title.toLowerCase()} found`}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </div>
          )}

          {showCreateForm && (
            <CrudForm
              fields={fields}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              submitLabel={`Create ${title}`}
              initialData={initialFormData}
            />
          )}

          {editingItem && (
            <OptimisticCrudForm
              fields={fields}
              onSubmit={(data) => handleUpdate(editingItem![idKey] as string | number, data)}
              onCancel={() => setEditingItem(null)}
              submitLabel={`Update ${title}`}
              initialData={editingItem}
              mode="update"
              itemId={String(editingItem[idKey])}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}