import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Bell,
  Calendar,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: "Total Users", value: "1,234", change: "+12%", icon: <Users className="h-6 w-6" /> },
    { title: "Products", value: "56", change: "+3%", icon: <Package className="h-6 w-6" /> },
    { title: "Orders", value: "1,892", change: "+8%", icon: <ShoppingCart className="h-6 w-6" /> },
    { title: "Revenue", value: "$45,231", change: "+5%", icon: <BarChart3 className="h-6 w-6" /> }
  ];

  const recentOrders = [
    { id: "#12345", customer: "John Doe", amount: "$120.00", status: "Completed" },
    { id: "#12344", customer: "Sarah Smith", amount: "$89.50", status: "Processing" },
    { id: "#12343", customer: "Mike Johnson", amount: "$245.75", status: "Completed" },
    { id: "#12342", customer: "Emily Davis", amount: "$67.25", status: "Pending" }
  ];

  return (
    <MainLayout>
      <Section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="text-muted-foreground">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest transactions from your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <p className="text-sm text-muted-foreground">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks you can perform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/products">
                      <Package className="mr-2 h-4 w-4" />
                      Manage Products
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Orders
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/customers">
                      <Users className="mr-2 h-4 w-4" />
                      Customer List
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/reports">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Reports
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Important dates and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Monthly Report</p>
                        <p className="text-xs text-muted-foreground">Due in 3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Inventory Check</p>
                        <p className="text-xs text-muted-foreground">Due in 1 week</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}