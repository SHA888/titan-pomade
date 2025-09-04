'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CrudForm } from '@/components/forms/crud-form';
import { DataTable } from '@/components/common/data-table';
import { productsService, ProductFormData } from '@/lib/services/products';
import { Product } from '@prisma/client';
import { toast } from 'sonner';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const productFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'stock', label: 'Stock', type: 'number' as const, required: true },
    { name: 'category', label: 'Category', type: 'text' as const, required: true },
    { name: 'imageUrl', label: 'Image URL', type: 'text' as const },
  ];

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setProducts(response.data);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Record<string, any>) => {
    try {
      await productsService.create(data as ProductFormData);
      setDialogOpen(false);
      fetchProducts();
      toast.success('Product created successfully');
    } catch (error) {
      toast.error('Failed to create product');
      console.error('Error creating product:', error);
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    if (!editingProduct) return;
    
    try {
      await productsService.update(editingProduct.id, data as Partial<ProductFormData>);
      setDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
    
    try {
      await productsService.delete(product.id);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const results = query 
        ? await productsService.search(query)
        : (await productsService.getAll({ page: 1, limit: pagination.limit })).data;
      
      setProducts(results);
    } catch (error) {
      toast.error('Failed to search products');
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <CrudForm
              fields={productFields}
              initialData={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdate : handleCreate}
              onCancel={() => {
                setDialogOpen(false);
                setEditingProduct(null);
              }}
              submitLabel={editingProduct ? 'Update Product' : 'Create Product'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>View and manage all products</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'category', title: 'Category' },
              { 
                key: 'price', 
                title: 'Price',
                render: (value) => `$${value.toFixed(2)}`
              },
              { 
                key: 'stock', 
                title: 'Stock',
                render: (value) => (
                  <span className={value < 10 ? 'text-red-500 font-medium' : ''}>
                    {value}
                  </span>
                )
              },
              { 
                key: 'isActive', 
                title: 'Status',
                render: (value) => (
                  <span className={value ? 'text-green-500' : 'text-red-500'}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )
              },
            ]}
            loading={loading}
            actions={[
              { label: 'Edit', onClick: (row: any) => handleEdit(row) },
              { label: 'Delete', onClick: (row: any) => handleDelete(row) },
            ]}
            onRowClick={(product: Product) => router.push(`/admin/products/${product.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}