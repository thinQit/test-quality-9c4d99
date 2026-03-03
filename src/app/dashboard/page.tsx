'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';

interface Restaurant {
  id: string;
  name: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt?: string;
}

interface Reservation {
  id: string;
  name?: string;
  partySize: number;
  status: string;
  startTime?: string;
}

interface SalesResponse {
  totalSales: number;
  orders: number;
  breakdown: { byCategory: unknown[] };
}

export default function DashboardPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sales, setSales] = useState<SalesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const restaurantsResponse = await api.get<{ items: Restaurant[]; total: number }>('/api/restaurants');
      if (restaurantsResponse.error) {
        setError(restaurantsResponse.error);
        setLoading(false);
        return;
      }

      const restaurantItem = restaurantsResponse.data?.items?.[0] ?? null;
      setRestaurant(restaurantItem);

      if (!restaurantItem) {
        setLoading(false);
        return;
      }

      const [ordersResponse, reservationsResponse, salesResponse] = await Promise.all([
        api.get<{ items: Order[]; total: number }>(`/api/restaurants/${restaurantItem.id}/orders?status=pending`),
        api.get<{ items: Reservation[]; total: number }>(`/api/restaurants/${restaurantItem.id}/reservations?status=confirmed`),
        api.get<SalesResponse>(`/api/dashboard/sales?restaurantId=${restaurantItem.id}`)
      ]);

      if (ordersResponse.error) {
        setError(ordersResponse.error);
      }
      if (reservationsResponse.error) {
        setError(reservationsResponse.error);
      }
      if (salesResponse.error) {
        setError(salesResponse.error);
      }

      setOrders(ordersResponse.data?.items ?? []);
      setReservations(reservationsResponse.data?.items ?? []);
      setSales(salesResponse.data ?? null);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Staff Dashboard</h1>
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
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Staff Dashboard</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">No restaurants available yet. Add a restaurant to start managing operations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">Staff Dashboard</h1>
        <p className="text-secondary">Live overview for {restaurant.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Today&apos;s Sales</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">${sales?.totalSales?.toFixed(2) ?? '0.00'}</p>
            <p className="text-xs text-secondary">Orders: {sales?.orders ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Pending Orders</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{orders.length}</p>
            <p className="text-xs text-secondary">Awaiting acceptance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Confirmed Reservations</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{reservations.length}</p>
            <p className="text-xs text-secondary">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Live Orders</h2>
              <Button variant="outline" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-secondary">No pending orders right now.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 6)}</p>
                    <p className="text-xs text-secondary">Placed {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{order.status}</Badge>
                    <span className="text-sm font-semibold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Reservations</h2>
              <Button variant="outline" size="sm">View calendar</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservations.length === 0 ? (
              <p className="text-sm text-secondary">No confirmed reservations today.</p>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{reservation.name || 'Guest'}</p>
                    <p className="text-xs text-secondary">Party of {reservation.partySize}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">{reservation.status}</Badge>
                    <p className="text-xs text-secondary">
                      {reservation.startTime ? new Date(reservation.startTime).toLocaleTimeString() : 'Time TBD'}
                    </p>
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
