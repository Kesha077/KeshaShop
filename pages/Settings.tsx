import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';
import { Globe, User, Package, LogOut, Copy } from 'lucide-react';
import { CustomerOrders } from './CustomerOrders';

export const Settings: React.FC = () => {
  const { language, setLanguage, t, currentUser, setCurrentUser } = useAppContext();
  const [showOrders, setShowOrders] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'Русский' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'tm', label: 'Türkmençe' },
    { code: 'en', label: 'English' },
  ];

  if (showOrders) {
      return <CustomerOrders onBack={() => setShowOrders(false)} />;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h2 className="text-xl font-bold mb-6 px-2">{t.settings}</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                  {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                  <h3 className="font-bold text-gray-900">{currentUser?.name}</h3>
                  <p className="text-xs text-gray-500">{currentUser?.identifier}</p>
              </div>
          </div>
          {currentUser?.role === 'customer' && (
              <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{t.yourId}</p>
                  <p className="text-xl font-mono font-bold text-teal-600">{currentUser?.fiveDigitId}</p>
              </div>
          )}
          {currentUser?.role === 'admin' && (
               <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">ADMIN</div>
          )}
      </div>
      
      {/* Customer Orders Section */}
      {currentUser?.role === 'customer' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <button 
                onClick={() => setShowOrders(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    <Package className="text-teal-600 mr-3" size={20}/>
                    <h3 className="font-medium text-gray-900">{t.trackOrder}</h3>
                </div>
                <div className="text-gray-400">→</div>
            </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center">
            <Globe className="text-teal-600 mr-3" size={20}/>
            <h3 className="font-medium text-gray-900">{t.language}</h3>
        </div>
        <div className="divide-y divide-gray-100">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-sm text-gray-700">{lang.label}</span>
                    <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center ${language === lang.code ? 'border-teal-600' : ''}`}>
                         {language === lang.code && <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />}
                    </div>
                </button>
            ))}
        </div>
      </div>

       <button 
        onClick={() => setCurrentUser(null)}
        className="w-full bg-white text-red-500 font-bold py-3 rounded-xl shadow-sm flex items-center justify-center"
       >
           <LogOut size={20} className="mr-2"/>
           {t.logout}
       </button>
       
       <p className="text-center text-xs text-gray-400 mt-6 pb-6">App Version 1.0.0</p>
    </div>
  );
};