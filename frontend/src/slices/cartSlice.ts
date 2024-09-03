import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCartAPI, fetchCartAPI, removeFromCartAPI } from '../services/api'; // Import API functions

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Async thunk to add an item to the cart
export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ productId, qty }: { productId: string; qty: number }, { rejectWithValue }) => {
    try {
      const response = await addToCartAPI(productId, qty); // Call API to add to cart
      return response; // Return updated cart data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCartAPI(); // Call API to fetch cart items
      return response; // Return cart data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart items');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items; // Ensure `items` matches the API response structure
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Handle error message
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items; // Ensure `items` matches the API response structure
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Handle error message
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
