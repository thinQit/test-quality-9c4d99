export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

const getAuthHeader = () => {
  if (typeof window === 'undefined') return undefined;
  const token = window.localStorage.getItem('token');
  return token ? `Bearer ${token}` : undefined;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const authHeader = getAuthHeader();
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(options.headers ?? {})
      }
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T) : undefined;

    if (!response.ok) {
      const message = (data as { error?: string })?.error ?? 'Request failed';
      return { status: response.status, error: message };
    }

    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error instanceof Error ? error.message : 'Unexpected error' };
  }
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })
};
