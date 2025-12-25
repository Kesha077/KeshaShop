import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomeProps {
  onProductClick: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onProductClick }) => {
  const { products, t } = useAppContext();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{t.featured}</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
