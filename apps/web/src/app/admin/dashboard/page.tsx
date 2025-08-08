import { AdminLayout } from '@/components/layout/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-3xl font-semibold">1,234</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Total Products</h3>
            <p className="mt-2 text-3xl font-semibold">567</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-3xl font-semibold">89</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Revenue</h3>
            <p className="mt-2 text-3xl font-semibold">$12,345</p>
          </div>
        </div>

        <div className="p-6 mt-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">5 minutes ago</p>
              <p>New order #1234 received</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">2 hours ago</p>
              <p>New user registered: john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
