import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t } = useAppContext();

  // Note: Direct add to cart removed from card because size selection is now required if sizes exist.
  // Clicking anywhere opens details.

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full active:scale-95 transition-transform duration-100"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400'} 
          alt={product.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {product.deliveryTime} {t.days}
        </div>
        {product.sizes.length > 0 && (
           <div className="absolute top-2 right-2 bg-white/90 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
             {product.sizes.length} variants
           </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 leading-tight h-10">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-lg font-bold text-teal-700">
            {product.price} TMT
          </span>
          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <Plus size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};