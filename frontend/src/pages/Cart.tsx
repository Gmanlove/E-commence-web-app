import React, { useEffect, useState } from 'react';
import { addToCartAPI, removeFromCartAPI, fetchCartAPI } from '../services/api'; // Correct imports
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

interface CartItem {
  product: {
    _id: string; // Updated to match nested product structure
    name: string;
    price: number;
    image: string;
  };
  qty: number;
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
      console.log('Fetched cart items:', cart.items); // Debugging log to check the structure
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
    console.log('Attempting to remove product with ID:', productId); // Debugging log

    if (!productId) {
      setError('Invalid product ID');
      console.error('Error: productId is undefined or invalid'); // Debugging log to identify the issue
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedCart = await removeFromCartAPI(productId); // Correct function call
      console.log('Updated cart after removal:', updatedCart); // Debugging log to verify removal
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
          cartItems.map((item) => {
            console.log('Rendering cart item:', item); // Debugging log for each cart item
            return (
              <div key={item.product._id} className="border p-4 mb-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16" />
                <h2>{item.product.name}</h2>
                <p>Qty: {item.qty}</p>
                <p>Price: ${item.product.price}</p>
                <button
                  onClick={() => handleRemoveFromCart(item.product._id)} // Access `product._id` correctly
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
