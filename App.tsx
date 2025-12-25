import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Settings } from './pages/Settings';
import { ProductDetails } from './pages/ProductDetails';
import { Login } from './pages/Login';
import { Product } from './types';

const Main: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // If no user is logged in, show Login Screen
  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetails 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Home onProductClick={setSelectedProduct} />;
      case 'cart':
        return <Cart />;
      case 'admin':
        // Only allow admin access to admin tab. If customer tries, go home.
        if (currentUser.role !== 'admin') return <Home onProductClick={setSelectedProduct} />;
        return <Admin />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onProductClick={setSelectedProduct} />;
    }
  };

  if (selectedProduct) {
    return renderContent();
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

export default App;