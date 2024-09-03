import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../services/api';
import { addCartItem } from '../slices/cartSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { RootState } from '../store/store';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useSelector((state: RootState) => state.auth); // Get user info from Redux store

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const productData = await fetchProductById(id!); // Fetch product details from API
        setProduct(productData);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (userInfo) {
      try {
        const result = await dispatch(addCartItem({ productId: id!, qty: 1 })).unwrap(); // Dispatch action to add to cart
        console.log('Cart updated:', result); // Debugging log
        navigate('/cart'); // Navigate to the cart page after adding the product
      } catch (error: any) {
        console.error('Error adding to cart:', error.message || (error.response && error.response.data.message));
        alert('Failed to add item to cart. Please check the console for more details.'); // Display a user-friendly error message
      }
    } else {
      navigate('/login'); // Redirect to login if the user is not logged in
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : product && (
          <div>
            <h1 className="text-3xl">{product.name}</h1>
            <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-md" />
            <p className="mt-4">{product.description}</p>
            <p className="text-2xl mt-2">${product.price}</p>
            {userInfo ? (
              <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 mt-4">
                Add to Cart
              </button>
            ) : (
              <p className="text-red-500 mt-4">
                Please <Link to="/login" className="text-blue-500">login</Link> to add products to your cart.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
