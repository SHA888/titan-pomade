'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CrudForm } from '@/components/forms/crud-form';
import { productsService, ProductFormData } from '@/lib/services/products';
import { Product } from '@prisma/client';
import { toast } from 'sonner';
import { ArrowLeft, Edit } from 'lucide-react';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const productFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'stock', label: 'Stock', type: 'number' as const, required: true },
    { name: 'category', label: 'Category', type: 'text' as const, required: true },
    { name: 'imageUrl', label: 'Image URL', type: 'text' as const },
    { name: 'isActive', label: 'Active', type: 'checkbox' as const },
  ];

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsService.getById(productId);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to fetch product');
      console.error('Error fetching product:', error);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<ProductFormData>) => {
    try {
      await productsService.update(productId, data);
      setDialogOpen(false);
      fetchProduct();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm(`Are you sure you want to delete ${product.name}?`)) return;
    
    try {
      await productsService.delete(productId);
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2"></div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 flex-1 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">Product details and management</p>
        </div>
        <Badge variant={product.isActive ? 'default' : 'destructive'}>
          {product.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic details about this product</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                  </DialogHeader>
                  <CrudForm
                    fields={productFields}
                    initialData={product}
                    onSubmit={handleUpdate}
                    onCancel={() => setDialogOpen(false)}
                    submitLabel="Update Product"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Stock</h3>
                <p className={`font-medium ${product.stock < 10 ? 'text-red-500' : ''}`}>
                  {product.stock} {product.stock < 10 && '(Low stock)'}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="font-medium">{product.description}</p>
              </div>
              {product.imageUrl && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Image</h3>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="mt-2 max-w-xs rounded-md border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDelete}
              >
                Delete Product
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>Technical information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-sm">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}