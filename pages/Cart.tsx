import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, MessageCircle, X, Copy, Instagram, Phone, ExternalLink, Plane, Truck, Zap } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, addOrder, t, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Constants
  const WHATSAPP_NUMBER = '99362430206';
  const IMO_NUMBER = '+99362430206';
  const INSTAGRAM_SHOP = 'keshashopping';
  const INSTAGRAM_PERSONAL = 'bezirgenov_kemal';
  const TIKTOK_USER = 'hugobosss355';
  const TIKTOK_DISPLAY_NAME = 'Keshashopping';

  const handleCreateOrder = () => {
     // Create order in local history
    addOrder({
        id: Date.now().toString(),
        customerId: currentUser?.fiveDigitId || 'GUEST',
        customerContact: currentUser?.identifier || 'N/A',
        items: [...cart],
        total,
        date: new Date().toISOString(),
        status: 'pending'
    });
    setIsModalOpen(true);
  };

  const getOrderMessage = () => {
    const orderText = cart.map(item => `- ${item.title} ${item.selectedSize ? `[${item.selectedSize}]` : ''} (${item.quantity}x) - ${item.price * item.quantity} TMT`).join('\n');
    return encodeURIComponent(
      `Sargyt / Order Request:\nID: ${currentUser?.fiveDigitId}\n\n${orderText}\n\nJemi / Total: ${total} TMT\n\n`
    );
  };

  const openWhatsApp = () => {
    const message = getOrderMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    clearCart();
    setIsModalOpen(false);
  };

  const copyImo = () => {
      navigator.clipboard.writeText(IMO_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const openLink = (url: string) => {
      window.open(url, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </div>
        <p className="text-lg font-medium">{t.emptyCart}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h2 className="text-xl font-bold mb-4 px-2">{t.cart}</h2>
      
      <div className="space-y-4 mb-24">
        {cart.map((item, index) => (
          <div key={`${item.id}-${item.selectedSize || index}`} className="bg-white p-4 rounded-xl shadow-sm flex items-center">
            <div className="relative">
                <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                {item.selectedSize && (
                    <span className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded border border-white">
                        {item.selectedSize}
                    </span>
                )}
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</h3>
              <p className="text-teal-600 font-bold mt-1">{item.price} TMT <span className="text-gray-400 text-xs font-normal">x {item.quantity}</span></p>
            </div>
            <button 
              onClick={() => removeFromCart(item.id, item.selectedSize)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 w-full p-4 bg-white border-t border-gray-100 shadow-lg rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">{t.total}</span>
          <span className="text-2xl font-bold text-gray-900">{total} TMT</span>
        </div>
        <button 
          onClick={handleCreateOrder}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
        >
          <MessageCircle className="mr-2" />
          {t.checkout}
        </button>
      </div>

      {/* Checkout Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Header / Logo Area */}
              <div className="bg-gray-50 p-6 flex flex-col items-center border-b border-gray-100 relative">
                 <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-500 shadow-sm"
                 >
                    <X size={20} />
                 </button>
                 
                 {/* Logo Representation */}
                 <div className="h-20 w-auto flex items-center justify-center mb-2">
                    {APP_CONFIG.logoUrl ? (
                         <img src={APP_CONFIG.logoUrl} className="h-full w-auto object-contain" alt="Logo"/>
                    ) : (
                        <div className="flex flex-col items-center leading-none">
                            <div className="w-10 h-6 border-2 border-teal-600 rounded-t-full mb-1"></div>
                            <span className="text-4xl font-serif font-bold text-gray-800">KS</span>
                        </div>
                    )}
                 </div>
                 <h2 className="text-xl font-serif font-bold text-gray-800 tracking-wide mt-2">KESHA SHOP</h2>
                 <p className="text-sm text-gray-500 mt-1">{t.total}: <span className="font-bold text-teal-600">{total} TMT</span></p>
                 <div className="mt-2 text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                     ID: {currentUser?.fiveDigitId}
                 </div>
              </div>

              <div className="p-6 space-y-6">
                 
                 {/* Shipping Info */}
                 <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                        <Plane size={16} className="mr-2 text-teal-600"/>
                        {t.shippingRates} (1kg)
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                            <span className="text-gray-600">{t.airCargo}</span>
                            <span className="font-bold text-gray-900">140 TMT</span>
                        </div>
                         <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                            <span className="text-gray-600 flex items-center"><Truck size={14} className="mr-1"/>{t.roadCargo}</span>
                            <span className="font-bold text-gray-900">60 TMT</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-orange-100">
                            <span className="text-gray-600 flex items-center"><Zap size={14} className="mr-1 text-orange-500"/>{t.expressCargo}</span>
                            <span className="font-bold text-orange-600">200 TMT</span>
                        </div>
                    </div>
                 </div>

                 {/* Contact Options */}
                 <div>
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">{t.contactUs}</h3>
                    <div className="space-y-3">
                        {/* WhatsApp */}
                        <button 
                            onClick={openWhatsApp}
                            className="w-full bg-[#25D366] text-white p-3 rounded-xl flex items-center justify-center font-bold shadow-md hover:brightness-95 active:scale-95 transition-all"
                        >
                            <MessageCircle className="mr-2" />
                            {t.orderVia} WhatsApp
                        </button>

                         {/* IMO */}
                        <button 
                            onClick={copyImo}
                            className="w-full bg-white border-2 border-blue-500 text-blue-600 p-3 rounded-xl flex items-center justify-center font-bold active:bg-blue-50 transition-all relative"
                        >
                            {copied ? <span className="text-green-600 flex items-center"><span className="mr-2">✓</span> {t.copied}</span> : (
                                <>
                                    <span className="font-serif font-black mr-2 bg-blue-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">imo</span>
                                    {t.copyNumber} ({IMO_NUMBER})
                                    <Copy size={16} className="ml-2" />
                                </>
                            )}
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Instagram */}
                            <button 
                                onClick={() => openLink(`https://instagram.com/${INSTAGRAM_SHOP}`)}
                                className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white p-3 rounded-xl flex flex-col items-center justify-center font-bold shadow-md active:scale-95 transition-all"
                            >
                                <Instagram size={24} className="mb-1" />
                                <span className="text-xs">@{INSTAGRAM_SHOP}</span>
                            </button>

                            {/* TikTok */}
                            <button 
                                onClick={() => openLink(`https://tiktok.com/@${TIKTOK_USER}`)}
                                className="bg-black text-white p-3 rounded-xl flex flex-col items-center justify-center font-bold shadow-md active:scale-95 transition-all"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="mb-1">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                                <span className="text-xs">{TIKTOK_DISPLAY_NAME}</span>
                            </button>
                        </div>
                        
                        {/* Personal Insta */}
                         <button 
                                onClick={() => openLink(`https://instagram.com/${INSTAGRAM_PERSONAL}`)}
                                className="w-full bg-gray-100 text-gray-600 p-2 rounded-lg flex items-center justify-center text-xs font-medium hover:bg-gray-200"
                            >
                                <Instagram size={14} className="mr-2" />
                                {t.personalAccount}: @{INSTAGRAM_PERSONAL}
                            </button>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
};