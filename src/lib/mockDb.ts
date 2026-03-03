import { randomUUID } from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  restaurantId: string;
  categoryId?: string | null;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  userId: string;
  restaurantId: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  startTime?: string;
  status: string;
  restaurantId: string;
}

export const createId = () => randomUUID();

const defaultRestaurantId = createId();
const defaultUserId = createId();

export const db = {
  users: [
    {
      id: defaultUserId,
      name: 'Alex Morgan',
      email: 'alex@example.com',
      role: 'customer',
      passwordHash: ''
    }
  ] as User[],
  restaurants: [
    {
      id: defaultRestaurantId,
      name: 'Harvest Table',
      address: '123 Market Street',
      phone: '+1 (555) 123-4567'
    }
  ] as Restaurant[],
  categories: [
    { id: createId(), name: 'Starters', restaurantId: defaultRestaurantId },
    { id: createId(), name: 'Mains', restaurantId: defaultRestaurantId }
  ] as Category[],
  menuItems: [
    {
      id: createId(),
      name: 'Seasonal Soup',
      description: 'Chef curated seasonal soup.',
      price: 8.5,
      available: true,
      restaurantId: defaultRestaurantId
    },
    {
      id: createId(),
      name: 'Herb Roasted Chicken',
      description: 'Served with roasted vegetables.',
      price: 18,
      available: true,
      restaurantId: defaultRestaurantId
    }
  ] as MenuItem[],
  orders: [
    {
      id: createId(),
      status: 'pending',
      total: 26.5,
      createdAt: new Date().toISOString(),
      items: [
        { id: createId(), name: 'Seasonal Soup', quantity: 1, price: 8.5 },
        { id: createId(), name: 'Herb Roasted Chicken', quantity: 1, price: 18 }
      ],
      userId: defaultUserId,
      restaurantId: defaultRestaurantId
    }
  ] as Order[],
  reservations: [
    {
      id: createId(),
      name: 'Jamie Doe',
      email: 'jamie@example.com',
      phone: '+1 (555) 222-1111',
      partySize: 2,
      startTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      status: 'confirmed',
      restaurantId: defaultRestaurantId
    }
  ] as Reservation[]
};

export const sanitizeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});
