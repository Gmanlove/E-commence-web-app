import React, { useEffect, useState } from 'react';
import { fetchUserOrders, initiatePayment, verifyPayment } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

interface Order {
  _id: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  paymentResult?: {
    reference: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const ordersData = await fetchUserOrders(); // Call fetchUserOrders API function
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handlePayment = async (orderId: string) => {
    setLoading(true);
    setError('');
    try {
      const paymentDetails = await initiatePayment(orderId, 'user@example.com', 100); // Mock email and amount
      console.log('Payment Initiated:', paymentDetails);
    } catch (err) {
      setError('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Orders</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4">
              <h2>Order ID: {order._id}</h2>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Status: {order.isPaid ? 'Paid' : 'Not Paid'}</p>
              <button onClick={() => handlePayment(order._id)} className="bg-green-500 text-white px-2 py-1">
                Pay Now
              </button>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
