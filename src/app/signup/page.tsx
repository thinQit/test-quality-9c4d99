'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await api.post<RegisterResponse>('/api/auth/register', {
      name,
      email,
      password,
      role: 'customer'
    });

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return;
    }

    const data = response.data;
    if (!data?.token || !data?.user) {
      setError('Invalid response from server.');
      setLoading(false);
      return;
    }

    localStorage.setItem('token', data.token);
    login(data.user);
    toast('Account created successfully!', 'success');
    setLoading(false);
    router.push('/account');
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
          <p className="text-sm text-secondary">Join to place orders and manage reservations.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-error">{error}</p>}
            <Button type="submit" loading={loading} fullWidth>
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
