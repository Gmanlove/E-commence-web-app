import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:3000/api';

// Set up the axios instance with interceptors for token handling
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product APIs

// Fetch all products
export const fetchProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

// Fetch a product by ID
export const fetchProductById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// User APIs

// User Login
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data; // Contains user data and token
};

// User Registration
export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/users`, { name, email, password });
  return response.data; // Contains user data
};

// Fetch user profile
export const fetchUserProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data; // Contains user profile data
};

// Update user profile
export const updateUserProfile = async (name: string, email: string, password?: string) => {
  const response = await axiosInstance.put('/users/profile', { name, email, password });
  return response.data; // Contains updated user data
};

// Cart APIs

// Fetch cart items
export const fetchCartAPI = async () => {
  try {
    const response = await axiosInstance.get('/cart'); // Correct endpoint and method
    return response.data; // Cart data
  } catch (error: any) {
    console.error('Error fetching cart items:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add item to cart
export const addToCartAPI = async (productId: string, qty: number) => {
  try {
    const response = await axiosInstance.post('/cart/add', { productId, qty });
    return response.data; // Updated cart data
  } catch (error: any) {
    console.error('Error adding to cart:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Remove item from cart
export const removeFromCartAPI = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${productId}`);
    return response.data; // Updated cart data
  } catch (error: any) {
    console.error('Error removing item from cart:', error.response ? error.response.data : error.message);
    throw error;
  }
};
// Order APIs

// Create a new order
export const createOrder = async (orderData: any) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data; // Contains created order details
};

// Fetch order details by ID
export const fetchOrderById = async (orderId: string) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data; // Contains order details
};

// Fetch all orders for the logged-in user
export const fetchUserOrders = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data; // Contains list of user's orders
};

// Payment APIs

// Initiate a payment
export const initiatePayment = async (orderId: string, email: string, amount: number) => {
  const response = await axiosInstance.put(`/orders/${orderId}/payment`, { email, amount });
  return response.data; // Contains payment initiation details
};

// Verify payment
export const verifyPayment = async (orderId: string, reference: string) => {
  const response = await axiosInstance.get(`/orders/${orderId}/verify-payment`, { params: { reference } });
  return response.data; // Contains payment verification result
};
