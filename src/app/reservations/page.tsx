'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface Restaurant {
  id: string;
  name: string;
}

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  startTime?: string;
  status: string;
}

export default function ReservationsPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [startTime, setStartTime] = useState('');

  const loadReservations = async (restaurantId: string) => {
    const response = await api.get<{ items: Reservation[]; total: number }>(
      `/api/restaurants/${restaurantId}/reservations`
    );
    if (response.error) {
      setError(response.error);
      return;
    }
    setReservations(response.data?.items ?? []);
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
        await loadReservations(first.id);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleCreateReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant) return;

    const response = await api.post<{ reservation: Reservation }>(
      `/api/restaurants/${restaurant.id}/reservations`,
      {
        name,
        email,
        phone,
        partySize: Number(partySize),
        startTime
      }
    );

    if (response.error) {
      toast(response.error, 'error');
      return;
    }

    toast('Reservation created', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setPartySize('2');
    setStartTime('');
    await loadReservations(restaurant.id);
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
            <h1 className="text-2xl font-semibold text-foreground">Reservations</h1>
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
            <h1 className="text-2xl font-semibold text-foreground">Reservations</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">No restaurants available for reservations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Reservations</h1>
        <p className="text-secondary">Manage upcoming bookings for {restaurant.name}.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Create reservation</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateReservation} className="space-y-3">
              <Input label="Guest name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
              <Input label="Phone" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} required />
              <Input label="Party size" type="number" value={partySize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPartySize(e.target.value)} required />
              <Input label="Date & time" type="datetime-local" value={startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} required />
              <Button type="submit" fullWidth>Create reservation</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {reservations.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-sm text-secondary">No reservations yet.</p>
              </CardContent>
            </Card>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{reservation.name}</h3>
                      <p className="text-xs text-secondary">Party of {reservation.partySize}</p>
                    </div>
                    <Badge variant={reservation.status === 'confirmed' ? 'success' : 'secondary'}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 text-sm text-secondary">
                    <span>{reservation.email}</span>
                    <span>{reservation.phone}</span>
                    <span>{reservation.startTime ? new Date(reservation.startTime).toLocaleString() : 'Time TBD'}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
