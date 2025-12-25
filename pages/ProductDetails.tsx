import React, { useState } from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Clock, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const { t, addToCart } = useAppContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      alert(t.sizeRequired);
      return;
    }
    addToCart(product, selectedSize);
    onBack();
  };

  return (
    <div className="bg-white min-h-screen pb-safe">
      {/* Header Image Gallery */}
      <div className="relative bg-gray-100">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        
        <div className="aspect-square relative overflow-hidden">
             <img 
                src={product.images[currentImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-contain"
            />
            
            {product.images.length > 1 && (
                <>
                    <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white">
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {product.images.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-teal-600' : 'bg-gray-300'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${currentImageIndex === idx ? 'border-teal-600' : 'border-transparent'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        )}
      </div>

      <div className="p-5 bg-white relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <span className="text-xs text-teal-600 font-bold bg-teal-50 px-2 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2 leading-snug">{product.title}</h1>
          </div>
          <span className="text-2xl font-bold text-teal-700 whitespace-nowrap">
            {product.price} TMT
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-6 border-b border-gray-100 pb-4">
          <Clock size={16} className="mr-2" />
          <span>{t.delivery}: {product.deliveryTime} {t.days}</span>
        </div>

        {/* Size Selection */}
        {product.sizes.length > 0 && (
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{t.selectSize}</h3>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[48px] px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                selectedSize === size 
                                ? 'bg-teal-600 text-white border-teal-600' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">{t.description}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description}
          </p>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 active:scale-95 transition-transform"
        >
          <ShoppingCart className="mr-2" />
          {t.addToCart}
        </button>
      </div>
    </div>
  );
};