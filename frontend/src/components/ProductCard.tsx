import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl mt-2">{product.name}</h2>
      <p className="text-lg mt-1">₦{product.price}</p>
      <Link to={`/product/${product._id}`} className="text-blue-500 mt-2 block">View Details</Link>
    </div>
  );
};

export default ProductCard;
