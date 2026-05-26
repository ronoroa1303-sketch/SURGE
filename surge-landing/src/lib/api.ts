const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_URL = configuredApiUrl || (import.meta.env.DEV ? '/api' : '');

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
  if (!API_URL) {
    throw new Error(
      'VITE_API_URL is not configured. Set it to your deployed backend API URL, for example https://your-backend.up.railway.app/api.'
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });
  } catch (error) {
    console.error(`Network error calling API endpoint ${endpoint}:`, error);
    throw new Error(
      'Unable to reach the SURGE API. Check that the backend is running and VITE_API_URL points to the deployed API.'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (response.ok && Object.keys(data).length === 0) {
    throw new Error(
      'The API returned an unexpected response. Check VITE_API_URL and backend deployment settings.'
    );
  }

  if (!response.ok) {
    // Extract error from multiple possible backend response formats
    const errorMsg =
      data.message ||
      data.error ||
      (Array.isArray(data.errors) ? data.errors.map((e: any) => e.msg).join(', ') : null) ||
      `Request failed (${response.status})`;
    console.error(`API Error [${response.status}] ${endpoint}:`, data);
    throw new Error(errorMsg);
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

// Auth profile (for token hydration)
export const getProfile = () => fetchApi('/auth/profile');
