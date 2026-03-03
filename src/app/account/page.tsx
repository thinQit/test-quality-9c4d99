'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/api';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt?: string;
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const response = await api.get<{ items: Order[]; total: number }>(`/api/users/${user.id}/orders`);
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      setOrders(response.data?.items ?? []);
      setLoading(false);
    };

    if (!authLoading) {
      loadOrders();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">My Account</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">Log in to view your profile and order history.</p>
            <div className="mt-4">
              <Button>Go to login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">My Account</h1>
        <p className="text-secondary">Manage your profile and view past orders.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-secondary">
            <p><span className="font-medium text-foreground">Name:</span> {user.name}</p>
            <p><span className="font-medium text-foreground">Email:</span> {user.email}</p>
            <p><span className="font-medium text-foreground">Role:</span> {user.role}</p>
            <Button variant="outline" size="sm">Edit profile</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Order History</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-error">{error}</p>}
            {orders.length === 0 ? (
              <p className="text-sm text-secondary">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 6)}</p>
                    <p className="text-xs text-secondary">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge>{order.status}</Badge>
                    <p className="text-sm font-semibold text-foreground">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
