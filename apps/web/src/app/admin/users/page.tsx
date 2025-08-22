'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { withRole } from '@/utils/roles';
import { hasPermission, Permission } from '@/utils/permissions';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: Role | string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const roles = useMemo(() => Object.values(Role) as (Role | string)[], []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<AdminUser[]>('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const onChangeRole = async (userId: string, newRole: Role | string) => {
    try {
      setSavingId(userId);
      const updated = await api.patch<AdminUser>(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      toast.success('User role updated');
    } catch (err) {
      console.error('Failed to update role', err);
      toast.error('Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  const AdminOnlyButton = useMemo(() => withRole<React.ComponentProps<typeof Button>>([Role.ADMIN], Button), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <AdminOnlyButton userRole={user?.role} onClick={() => void loadUsers()} disabled={loading}>
          Refresh
        </AdminOnlyButton>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded-lg shadow">Loading users...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Verified</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">{u.name ?? '—'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {hasPermission(user?.role ?? null, Permission.MANAGE_USERS) ? (
                      <select
                        className="px-2 py-1 border rounded"
                        value={u.role}
                        onChange={(e) => onChangeRole(u.id, e.target.value)}
                        disabled={savingId === u.id}
                      >
                        {roles.map((r) => (
                          <option key={String(r)} value={String(r)}>
                            {String(r)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">
                        {String(u.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{u.isEmailVerified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void loadUsers()}
                      disabled={savingId === u.id}
                    >
                      {savingId === u.id ? 'Saving...' : 'Reload'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
