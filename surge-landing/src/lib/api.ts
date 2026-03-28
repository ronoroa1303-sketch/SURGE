const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred with the API');
  }

  return data;
};

export const signup = (data: any) => fetchApi('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const getProducts = () => fetchApi('/products');
export const addToCart = (data: any) => fetchApi('/cart', { method: 'POST', body: JSON.stringify(data) });
export const getCart = () => fetchApi('/cart');
export const removeFromCart = (productId: string) => fetchApi(`/cart/${productId}`, { method: 'DELETE' });
export const createOrder = (data: any) => fetchApi('/order', { method: 'POST', body: JSON.stringify(data) });
export const createPayment = (data: any) => fetchApi('/payment/create-order', { method: 'POST', body: JSON.stringify(data) });
export const verifyPayment = (data: any) => fetchApi('/payment/verify', { method: 'POST', body: JSON.stringify(data) });

// Preorder integration
export const submitPreorder = (data: { name: string; email: string; quantity: number }) => 
  fetchApi('/preorder', { method: 'POST', body: JSON.stringify(data) });
