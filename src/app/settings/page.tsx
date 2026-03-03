'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setName(first.name);
        setAddress(first.address);
        setPhone(first.phone);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant) return;
    setSaving(true);
    const response = await api.put<{ restaurant: Restaurant }>(`/api/restaurants/${restaurant.id}`, {
      name,
      address,
      phone
    });
    if (response.error) {
      toast(response.error, 'error');
      setSaving(false);
      return;
    }
    toast('Settings updated', 'success');
    setRestaurant(response.data?.restaurant ?? restaurant);
    setSaving(false);
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
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Restaurant Settings</h1>
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
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-foreground">Restaurant Settings</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">No restaurant configuration available yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Restaurant Settings</h1>
        <p className="text-secondary">Update business details and contact information.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Business information</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Restaurant name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
            <Input label="Address" value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} required />
            <Input label="Phone" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} required />
            <Button type="submit" loading={saving}>Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
