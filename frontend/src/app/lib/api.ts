const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('auth_token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },
  assets: {
    list: () => request('/assets'),
    get: (id: string) => request(`/assets/${id}`),
    updateHealth: (id: string, data: any) => request(`/assets/${id}/health`, { method: 'PATCH', body: JSON.stringify(data) }),
    create: (data: any) => request('/assets', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/assets/${id}`, { method: 'DELETE' }),
  },
  workorders: {
    list: () => request('/workorders'),
    create: (data: any) => request('/workorders', { method: 'POST', body: JSON.stringify(data) }),
    assign: (id: string, data: any) => request(`/workorders/${id}/assign`, { method: 'PATCH', body: JSON.stringify(data) }),
    complete: (id: string, data: any) => request(`/workorders/${id}/complete`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  inventory: {
    list: () => request('/inventory'),
    create: (data: any) => request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
    restock: (id: string, quantity: number) => request(`/inventory/${id}/restock`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    consume: (id: string, quantity: number) => request(`/inventory/${id}/consume`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    delete: (id: string) => request(`/inventory/${id}`, { method: 'DELETE' }),
  },
  technicians: {
    list: () => request('/workorders/technicians'),
    create: (data: any) => request('/workorders/technicians', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/workorders/technicians/${id}`, { method: 'DELETE' }),
  },
  ai: {
    predict: (data: number[]) => request('/ai/predict', { method: 'POST', body: JSON.stringify({ data }) }),
  }
};
