import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { DataTable } from '@/components/common/data-table';
import Link from 'next/link';
import { 
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2
} from 'lucide-react';

export default function ProductsPage() {
  // Sample data - in a real app, this would come from an API
  const products = [
    {
      id: "1",
      name: "Premium Pomade",
      category: "Hair Care",
      price: 29.99,
      stock: 150,
      status: "Active"
    },
    {
      id: "2",
      name: "Matte Finish Pomade",
      category: "Hair Care",
      price: 24.99,
      stock: 89,
      status: "Active"
    },
    {
      id: "3",
      name: "Strong Hold Gel",
      category: "Hair Care",
      price: 19.99,
      stock: 23,
      status: "Low Stock"
    },
    {
      id: "4",
      name: "Beard Oil",
      category: "Beard Care",
      price: 22.99,
      stock: 0,
      status: "Out of Stock"
    }
  ];

  const columns = [
    { key: 'name', title: 'Product' },
    { key: 'category', title: 'Category' },
    { 
      key: 'price', 
      title: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'stock', 
      title: 'Stock',
      render: (value: number) => (
        <span className={value < 10 ? 'text-red-500 font-medium' : ''}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => (
        <span className={
          value === 'Active' ? 'text-green-500' : 
          value === 'Low Stock' ? 'text-yellow-500' : 'text-red-500'
        }>
          {value}
        </span>
      )
    }
  ];

  return (
    <MainLayout>
      <Section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Product List</CardTitle>
                  <CardDescription>View and manage all products</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="Search products..."
                      className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={products}
                columns={columns}
                actions={[
                  { label: 'Edit', onClick: (row) => console.log('Edit', row) },
                  { label: 'Delete', onClick: (row) => console.log('Delete', row) }
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    </MainLayout>
  );
}