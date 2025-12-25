import React from 'react';
import { ShoppingBag, Home, Settings, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { APP_CONFIG } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { cart, t, currentUser } = useAppContext();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
            {APP_CONFIG.logoUrl ? (
                // Use w-auto to allow rectangular logos to retain their aspect ratio
                // Use h-10 to constrain height to navbar size
                <img 
                    src={APP_CONFIG.logoUrl} 
                    alt="Kesha Shop Logo" 
                    className="h-10 w-auto object-contain"
                />
            ) : (
                <div className="w-10 h-10 border border-teal-600 rounded flex items-center justify-center">
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-[10px] font-serif font-bold text-gray-700">KS</span>
                    </div>
                </div>
            )}
            <span className="text-xl font-serif font-bold text-gray-800 tracking-wide">KESHA SHOP</span>
        </div>
        
        {/* Right side - Show ID for customer */}
        {currentUser?.role === 'customer' && (
            <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono font-bold text-gray-600">
                ID: {currentUser.fiveDigitId}
            </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-20 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'home' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <Home size={24} />
            <span className="text-[10px] mt-1">{t.home}</span>
          </button>
          
          <button 
            onClick={() => onTabChange('cart')}
            className={`flex flex-col items-center justify-center w-full h-full relative ${activeTab === 'cart' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">{t.cart}</span>
          </button>

          {/* Only Show Admin Tab if User is Admin */}
          {currentUser?.role === 'admin' && (
              <button 
                onClick={() => onTabChange('admin')}
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'admin' ? 'text-teal-600' : 'text-gray-400'}`}
              >
                <ShieldCheck size={24} />
                <span className="text-[10px] mt-1">{t.admin}</span>
              </button>
          )}

          <button 
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'settings' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <Settings size={24} />
            <span className="text-[10px] mt-1">{t.settings}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};