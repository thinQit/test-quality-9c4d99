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

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  categoryId?: string | null;
}

export default function MenuManagementPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const loadData = async (restaurantId: string) => {
    const [categoriesResponse, itemsResponse] = await Promise.all([
      api.get<{ categories: Category[] }>(`/api/restaurants/${restaurantId}/categories`),
      api.get<{ items: MenuItem[] }>(`/api/restaurants/${restaurantId}/menu-items`)
    ]);

    if (categoriesResponse.error) {
      setError(categoriesResponse.error);
    }
    if (itemsResponse.error) {
      setError(itemsResponse.error);
    }

    setCategories(categoriesResponse.data?.categories ?? []);
    setItems(itemsResponse.data?.items ?? []);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      const restaurantsResponse = await api.get<{ items: Restaurant[] }>(`/api/restaurants`);
      if (restaurantsResponse.error) {
        setError(restaurantsResponse.error);
        setLoading(false);
        return;
      }

      const first = restaurantsResponse.data?.items?.[0] ?? null;
      setRestaurant(first);

      if (first) {
        await loadData(first.id);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant) return;
    const response = await api.post<{ category: Category }>(`/api/restaurants/${restaurant.id}/categories`, {
      name: newCategory
    });
    if (response.error) {
      toast(response.error, 'error');
      return;
    }
    setNewCategory('');
    toast('Category created', 'success');
    await loadData(restaurant.id);
  };

  const handleCreateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant) return;
    const price = Number(itemPrice);
    const response = await api.post<{ menuItem: MenuItem }>(`/api/restaurants/${restaurant.id}/menu-items`, {
      name: itemName,
      description: itemDescription,
      price: Number.isNaN(price) ? 0 : price
    });
    if (response.error) {
      toast(response.error, 'error');
      return;
    }
    setItemName('');
    setItemPrice('');
    setItemDescription('');
    toast('Menu item added', 'success');
    await loadData(restaurant.id);
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
            <h1 className="text-2xl font-semibold text-foreground">Menu Management</h1>
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
            <h1 className="text-2xl font-semibold text-foreground">Menu Management</h1>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">Create a restaurant to begin managing menu items.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Menu Management</h1>
        <p className="text-secondary">Manage categories and items for {restaurant.name}.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <Input
                label="New category"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                required
              />
              <Button type="submit">Add category</Button>
            </form>
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-secondary">No categories yet.</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Menu Items</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateItem} className="space-y-3">
              <Input
                label="Item name"
                value={itemName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemName(e.target.value)}
                required
              />
              <Input
                label="Price"
                type="number"
                value={itemPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemPrice(e.target.value)}
                required
              />
              <Input
                label="Description"
                value={itemDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemDescription(e.target.value)}
              />
              <Button type="submit">Add item</Button>
            </form>
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-sm text-secondary">No menu items available.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-secondary">${item.price.toFixed(2)}</p>
                    </div>
                    <Badge variant={item.available ? 'success' : 'warning'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
