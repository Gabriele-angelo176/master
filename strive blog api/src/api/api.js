const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('strive-blog-token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}
