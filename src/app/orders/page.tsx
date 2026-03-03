'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface Restaurant {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt?: string;
  items: OrderItem[];
}

const statusOptions = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (restaurantId: string, status?: string) => {
    const query = status ? `?status=${status}` : '';
    const response = await api.get<{ items: Order[]; total: number }>(`/api/restaurants/${restaurantId}/orders${query}`);
    if (response.error) {
      setError(response.error);
      return;
    }
    setOrders(response.data?.items ?? []);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      const restaurantsResponse = await api.get<{ items: Restaurant[] }>('/api/restaurants');
      if (restaurantsResponse.error) {
        setError(restaurantsResponse.error);
        setLoading(false);
        return;
      }
      const first = restaurantsResponse.data?.items?.[0] ?? null;
      setRestaurant(first);
      if (first) {
        await fetchOrders(first.id);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStatusFilter(value);
    if (restaurant) {
      await fetchOrders(restaurant.id, value);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const response = await api.put<{ order: Order }>(`/api/orders/${orderId}`, { status });
    if (response.error) {
      toast(response.error, 'error');
      return;
    }
    toast('Order updated', 'success');
    if (restaurant) {
      await fetchOrders(restaurant.id, statusFilter || undefined);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          </CardHeader>
          <CardContent>
            <p className="text-error">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">No restaurants found. Create one to view orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
        <p className="text-secondary">Track and update order statuses for {restaurant.name}.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-secondary">Filter by status</p>
            <select
              className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-secondary">No orders match the selected filters.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Order #{order.id.slice(0, 6)}</h2>
                    <p className="text-xs text-secondary">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{order.status}</Badge>
                    <span className="text-sm font-semibold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {order.items?.length ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-secondary">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary">No items listed.</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={order.status === status ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
