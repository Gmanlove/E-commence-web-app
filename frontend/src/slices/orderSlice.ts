import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, fetchOrderById, fetchUserOrders, initiatePayment, verifyPayment } from '../services/api';

interface OrderState {
  orders: any[];
  orderDetails: any;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
};

// Create Order Action
export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData: any) => {
  const response = await createOrder(orderData);
  return response;
});

// Fetch Orders Action
export const getUserOrders = createAsyncThunk('orders/getUserOrders', async () => {
  const response = await fetchUserOrders();
  return response;
});

// Fetch Order Details by ID Action
export const getOrderDetails = createAsyncThunk('orders/getOrderDetails', async (orderId: string) => {
  const response = await fetchOrderById(orderId);
  return response;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to place order';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order details';
      });
  },
});

export default orderSlice.reducer;
