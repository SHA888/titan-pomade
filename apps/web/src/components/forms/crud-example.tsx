'use client';

import React, { useState, useEffect } from 'react';
import { CrudForm } from './crud-form';
import { OptimisticCrudForm } from './optimistic-crud-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useOptimisticCrud } from '@/hooks/use-optimistic-crud';
import { productsService } from '@/lib/services/products';
import { Product } from '@prisma/client';

// Example form fields for a product
const productFields = [
  { name: 'name', label: 'Product Name', type: 'text' as const, placeholder: 'Enter product name', required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Enter product description', required: true },
  { name: 'price', label: 'Price', type: 'number' as const, placeholder: 'Enter price', required: true },
  { name: 'stock', label: 'Stock Quantity', type: 'number' as const, placeholder: 'Enter stock quantity', required: true },
  { name: 'category', label: 'Category', type: 'text' as const, placeholder: 'Enter category', required: true },
  { name: 'isActive', label: 'Active', type: 'text' as const },
];

export function CrudExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    items: optimisticProducts,
    createItem,
    updateItem,
    deleteItem,
  } = useOptimisticCrud({
    items: products,
    idKey: 'id',
    onSuccess: () => {
      // Refresh the product list after successful operations
      fetchProducts();
    },
    onError: (error) => {
      console.error('CRUD operation failed:', error);
    },
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: Record<string, any>) => {
    const optimisticProduct = productsService.createOptimisticProduct(data as any);
    
    return createItem(
      () => productsService.create(data as any),
      optimisticProduct
    );
  };

  const handleUpdateProduct = async (id: string, data: Record<string, any>) => {
    return updateItem(
      () => productsService.update(id, data as any),
      id,
      data
    );
  };

  const handleDeleteProduct = async (id: string) => {
    return deleteItem(
      () => productsService.delete(id),
      id
    );
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory with optimistic updates</CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateForm && !editingProduct && (
            <div className="space-y-4">
              <Button onClick={() => setShowCreateForm(true)}>
                Create New Product
              </Button>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {optimisticProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>${Number(product.price).toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Stock: {product.stock}
                        </span>
                        <span className="text-sm">
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </CardContent>
                    <div className="p-4 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteProduct(product.id as string)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {showCreateForm && (
            <CrudForm
              fields={productFields}
              onSubmit={(data) => handleCreateProduct(data).then(() => {})}
              onCancel={handleCancelCreate}
              submitLabel="Create Product"
            />
          )}

          {editingProduct && (
            <OptimisticCrudForm
              fields={productFields}
              onSubmit={(data) => handleUpdateProduct(editingProduct.id as string, data)}
              onCancel={handleCancelEdit}
              submitLabel="Update Product"
              initialData={editingProduct}
              mode="update"
              itemId={editingProduct.id as string}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}