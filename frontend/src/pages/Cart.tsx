import React, { useEffect, useState } from 'react';
import { addToCartAPI, removeFromCartAPI, fetchCartAPI } from '../services/api'; // Correct imports
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const cart = await fetchCartAPI(); // Fetch cart items from the API
      setCartItems(cart.items); // Ensure items are set correctly
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleAddToCart = async (productId: string, qty: number) => {
    setLoading(true);
    setError('');
    try {
      const updatedCart = await addToCartAPI(productId, qty); // Correct function call
      setCartItems(updatedCart.items); // Updated cart items
    } catch (err) {
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    setLoading(true);
    setError('');
    try {
      const updatedCart = await removeFromCartAPI(productId); // Correct function call
      setCartItems(updatedCart.items); // Updated cart items
    } catch (err) {
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Cart</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId} className="border p-4 mb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16" />
              <h2>{item.name}</h2>
              <p>Qty: {item.qty}</p>
              <p>Price: ${item.price}</p>
              <button onClick={() => handleRemoveFromCart(item.productId)} className="bg-red-500 text-white px-2 py-1">
                Remove
              </button>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
