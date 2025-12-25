import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Package, ChevronRight, X } from 'lucide-react';
import { OrderTimelineView } from './Admin'; // Reusing the timeline component

interface CustomerOrdersProps {
  onBack: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ onBack }) => {
  const { orders, t, currentUser } = useAppContext();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Filter orders: ONLY show orders belonging to the logged-in customer's ID
  const myOrders = orders
    .filter(order => order.customerId === currentUser?.fiveDigitId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-50 min-h-screen pb-safe">
      <div className="bg-white px-4 py-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="mr-3 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">{t.myOrders}</h2>
      </div>

      <div className="p-4 space-y-4">
        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Package size={48} className="mb-4 opacity-50"/>
             <p>{t.noOrders}</p>
          </div>
        ) : (
          myOrders.map(order => (
            <div 
              key={order.id} 
              onClick={() => setSelectedOrderId(order.id)}
              className="bg-white p-4 rounded-xl shadow-sm active:scale-95 transition-transform"
            >
               <div className="flex justify-between items-start mb-2">
                   <div>
                       <span className="text-xs text-gray-500">#{order.id.slice(-6)}</span>
                       <h3 className="font-bold text-gray-900 mt-1">{t[`st_${order.status}` as keyof typeof t]}</h3>
                   </div>
                   <span className="font-bold text-teal-600">{order.total} TMT</span>
               </div>
               
               <div className="flex items-center justify-between mt-4">
                   <div className="flex -space-x-2">
                       {order.items.slice(0,3).map((item, i) => (
                           <img key={i} src={item.images[0]} className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100"/>
                       ))}
                       {order.items.length > 3 && (
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                               +{order.items.length - 3}
                           </div>
                       )}
                   </div>
                   <div className="flex items-center text-xs text-gray-500">
                       {new Date(order.date).toLocaleDateString()}
                       <ChevronRight size={16} className="ml-1"/>
                   </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom-10">
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10"
                  >
                      <X size={20} />
                  </button>
                  <OrderTimelineView orderId={selectedOrderId} />
              </div>
          </div>
      )}
    </div>
  );
};