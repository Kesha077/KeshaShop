import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product, OrderStatus } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2, Upload, Image as ImageIcon, X, Edit, Clock, Package, Truck, MapPin, Home, Scale, User } from 'lucide-react';

export const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrder, t } = useAppContext();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'orders'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');

  // Order UI State
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Weight & Price Modal State
  const [weightModalOrder, setWeightModalOrder] = useState<string | null>(null);
  const [inputWeight, setInputWeight] = useState('');
  const [inputShippingPrice, setInputShippingPrice] = useState('');

  const handleSaveProduct = () => {
    if (!title || !price || images.length === 0) {
        alert("Please fill required fields and add at least one image.");
        return;
    }
    
    const productData: Product = {
      id: editingId || Date.now().toString(),
      title,
      price: Number(price),
      description,
      category: category || 'General',
      deliveryTime: deliveryTime || '15',
      images: images,
      sizes: sizes
    };
    
    if (editingId) {
        updateProduct(productData);
    } else {
        addProduct(productData);
    }
    
    resetForm();
    setActiveTab('list');
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setDeliveryTime(product.deliveryTime);
    setImages([...product.images]);
    setSizes([...product.sizes]);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab('list');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setCategory('');
    setDeliveryTime('');
    setImages([]);
    setSizes([]);
    setSizeInput('');
    setUrlInput('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file as Blob);
      });
    }
  };

  const addImageUrl = () => {
      if(urlInput) {
          setImages(prev => [...prev, urlInput]);
          setUrlInput('');
      }
  };

  const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
      if(sizeInput.trim()) {
          setSizes(prev => [...prev, sizeInput.trim()]);
          setSizeInput('');
      }
  };

  const removeSize = (sizeToRemove: string) => {
      setSizes(prev => prev.filter(s => s !== sizeToRemove));
  };

  // Simplified: Just update status. Weight modal is separate now.
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
      updateOrder(orderId, newStatus);
  };

  const openWeightModal = (orderId: string, currentWeight?: number, currentShipPrice?: number) => {
      setWeightModalOrder(orderId);
      setInputWeight(currentWeight?.toString() || '');
      setInputShippingPrice(currentShipPrice?.toString() || '');
  }

  const confirmWeightAndPrice = () => {
      if (weightModalOrder) {
          // Update order without changing status, just adding data
          const currentOrder = orders.find(o => o.id === weightModalOrder);
          if (currentOrder) {
              updateOrder(weightModalOrder, currentOrder.status, {
                  weight: Number(inputWeight) || 0,
                  shippingPrice: Number(inputShippingPrice) || 0
              });
          }
          setWeightModalOrder(null);
      }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'processing': return 'bg-orange-100 text-orange-700';
        case 'shipped': return 'bg-blue-100 text-blue-700';
        case 'arrived': return 'bg-purple-100 text-purple-700';
        case 'delivered': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: OrderStatus) => {
      return t[`st_${status}` as keyof typeof t] || status;
  };

  const timelineSteps: {status: OrderStatus, icon: any}[] = [
      { status: 'pending', icon: Clock },
      { status: 'processing', icon: Package },
      { status: 'shipped', icon: Truck },
      { status: 'arrived', icon: MapPin },
      { status: 'delivered', icon: Home },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t.adminPanel}</h2>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button 
            onClick={() => { resetForm(); setActiveTab('list'); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            {t.products}
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            {editingId ? t.editProduct : t.addProduct}
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('orders'); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            {t.orders} ({orders.length})
          </button>
        </div>

      {activeTab === 'list' && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
                <p>No products added yet.</p>
            </div>
          ) : (
            products.map(p => (
                <div key={p.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                    <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded object-cover bg-gray-100" />
                    <div className="ml-3">
                    <p className="font-medium text-sm text-gray-900 line-clamp-1 w-40">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.price} TMT</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleEditClick(p)}
                        className="text-teal-600 p-2 bg-teal-50 rounded-full"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-500 p-2 bg-red-50 rounded-full"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
          <div className="space-y-4 pb-20">
              {orders.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                      <p>{t.noOrders}</p>
                  </div>
              ) : (
                  orders.map(order => (
                      <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          {/* Order Header */}
                          <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">#{order.id.slice(-4)}</span>
                                      <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                                  </div>
                                  
                                  {/* Customer ID Display */}
                                  <div className="flex items-center gap-1 text-teal-700 font-bold text-sm mb-1">
                                      <User size={14} />
                                      {t.customerID}: {order.customerId}
                                  </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                              </div>
                          </div>
                          
                          {/* Items Summary & Totals */}
                          <div className="p-4">
                               {order.items.slice(0, 2).map((item, idx) => (
                                   <div key={idx} className="flex justify-between text-sm mb-1">
                                       <span className="text-gray-700 line-clamp-1 flex-1 mr-2">
                                           {item.title} {item.selectedSize && `[${item.selectedSize}]`}
                                       </span>
                                       <span className="text-gray-500 whitespace-nowrap">x{item.quantity}</span>
                                   </div>
                               ))}
                               {order.items.length > 2 && <p className="text-xs text-gray-400 mt-1">+{order.items.length - 2} more items</p>}
                               
                               <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-end">
                                   <div>
                                       {order.weight && (
                                            <p className="text-xs text-gray-500">{t.weight}: {order.weight} {t.kg}</p>
                                       )}
                                       {order.shippingPrice ? (
                                           <p className="text-xs text-gray-500">{t.shippingCost}: {order.shippingPrice} TMT</p>
                                       ) : null}
                                   </div>
                                   <div className="text-right">
                                       <p className="font-bold text-lg text-gray-900">{order.total + (order.shippingPrice || 0)} TMT</p>
                                   </div>
                               </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="p-4 bg-gray-50 flex flex-col gap-3">
                              
                              {/* Status Controller */}
                              <div className="grid grid-cols-5 gap-1">
                                  {timelineSteps.map((step) => {
                                      const isActive = order.status === step.status;
                                      return (
                                          <button
                                              key={step.status}
                                              onClick={() => handleStatusUpdate(order.id, step.status)}
                                              className={`h-8 rounded flex items-center justify-center
                                                ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-200'}
                                              `}
                                              title={getStatusText(step.status)}
                                          >
                                              <step.icon size={14} />
                                          </button>
                                      );
                                  })}
                              </div>
                              
                              <div className="flex gap-2">
                                  {/* Details Button */}
                                  <button 
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className="flex-1 py-2 bg-gray-800 text-white rounded text-sm font-bold"
                                  >
                                      {t.orderDetails}
                                  </button>
                                  
                                  {/* Manual Weight/Price Entry Button */}
                                  <button
                                    onClick={() => openWeightModal(order.id, order.weight, order.shippingPrice)}
                                    className="w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded"
                                    title="Edit Shipping Info"
                                  >
                                      <Scale size={18} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}

      {/* Product Form Logic remains same... omitted for brevity if not changed */}
      {activeTab === 'add' && (
        <div className="space-y-4 pb-20">
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
             {/* Images */}
             <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">{t.images} ({images.length})</label>
              {images.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                      {images.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 flex-shrink-0">
                              <img src={img} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                              <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                          </div>
                      ))}
                  </div>
              )}
              <div className="flex flex-col gap-3">
                 <div onClick={() => fileInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="text-gray-400 mb-1" size={20} />
                    <span className="text-xs text-gray-500 font-medium">{t.uploadPhoto}</span>
                 </div>
                 <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                 <div className="flex gap-2">
                    <div className="relative flex-1"><input className="w-full p-2 border border-gray-200 rounded-lg text-xs" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder={t.orUrl} /></div>
                    <button onClick={addImageUrl} className="bg-gray-100 text-gray-700 px-3 rounded-lg text-xs font-bold">+</button>
                 </div>
              </div>
            </div>

            {/* Fields */}
            <div><label className="block text-xs font-medium text-gray-700 mb-1">{t.title}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="flex gap-4">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-700 mb-1">{t.price} (TMT)</label><input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={price} onChange={e => setPrice(e.target.value)} /></div>
               <div className="flex-1"><label className="block text-xs font-medium text-gray-700 mb-1">{t.delivery} ({t.days})</label><input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">{t.category}</label><select className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white" value={category} onChange={e => setCategory(e.target.value)} ><option value="">{t.selectCategory}</option>{CATEGORIES.map(cat => (<option key={cat} value={cat.split(' / ')[0]}>{cat}</option>))}</select></div>
            <div>
                 <label className="block text-xs font-medium text-gray-700 mb-2">{t.sizes}</label>
                 <div className="flex gap-2 mb-2"><input className="flex-1 p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. XL, 42, 120cm..." value={sizeInput} onChange={e => setSizeInput(e.target.value)} /><button onClick={addSize} className="bg-teal-600 text-white px-4 rounded-lg font-medium text-sm">{t.addSize}</button></div>
                 {sizes.length > 0 && (<div className="flex flex-wrap gap-2 mt-2">{sizes.map(size => (<span key={size} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-200">{size}<button onClick={() => removeSize(size)}><X size={10} /></button></span>))}</div>)}
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">{t.description}</label><textarea className="w-full p-2 border border-gray-200 rounded-lg text-sm" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>

            <div className="flex gap-2 mt-2">
                 <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg">{t.cancel}</button>
                 <button onClick={handleSaveProduct} className="flex-[2] bg-teal-600 text-white font-bold py-3 rounded-lg">{editingId ? t.update : t.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* Weight & Price Input Modal */}
      {weightModalOrder && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-xl animate-in zoom-in-95">
                  <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600">
                        <Scale size={24} />
                      </div>
                      <h3 className="font-bold text-lg">{t.enterWeightPrice}</h3>
                  </div>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-xs text-gray-500 font-bold">{t.weight} ({t.kg})</label>
                          <input 
                              type="number" 
                              value={inputWeight}
                              onChange={e => setInputWeight(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-center font-bold text-lg"
                              placeholder="0.0"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-gray-500 font-bold">{t.shippingCost} (TMT)</label>
                          <input 
                              type="number" 
                              value={inputShippingPrice}
                              onChange={e => setInputShippingPrice(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-center font-bold text-lg"
                              placeholder="0"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                      <button 
                        onClick={() => setWeightModalOrder(null)}
                        className="py-2 bg-gray-100 rounded-lg font-bold text-gray-600"
                      >
                          {t.cancel}
                      </button>
                      <button 
                        onClick={confirmWeightAndPrice}
                        className="py-2 bg-teal-600 rounded-lg font-bold text-white"
                      >
                          {t.setDetails}
                      </button>
                  </div>
              </div>
           </div>
      )}

      {/* Order Details Modal (Shared logic with Customer view basically) */}
      {selectedOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md h-[80vh] overflow-y-auto relative">
                  <button onClick={() => setSelectedOrderId(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10"><X size={20} /></button>
                  <OrderTimelineView orderId={selectedOrderId} />
              </div>
          </div>
      )}
    </div>
  );
};

// Reusable Order View Component (Timeline) - No changes needed, logic holds.
export const OrderTimelineView: React.FC<{ orderId: string }> = ({ orderId }) => {
    const { orders, t } = useAppContext();
    const order = orders.find(o => o.id === orderId);

    if (!order) return null;

    const timelineSteps: {status: OrderStatus, icon: any}[] = [
      { status: 'pending', icon: Clock },
      { status: 'processing', icon: Package },
      { status: 'shipped', icon: Truck },
      { status: 'arrived', icon: MapPin },
      { status: 'delivered', icon: Home },
    ];

    const currentStepIndex = timelineSteps.findIndex(s => s.status === order.status);
    const hasShippingInfo = order.shippingPrice !== undefined || order.weight !== undefined;

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold mb-1">{t.orderDetails}</h3>
            <p className="text-sm text-gray-500 mb-6">#{order.id}</p>
            
            {/* Customer ID Badge */}
            <div className="mb-6 bg-teal-50 border border-teal-100 p-3 rounded-lg flex items-center">
                <User className="text-teal-600 mr-2" size={18} />
                <span className="text-teal-900 font-bold text-sm">{t.customerID}: {order.customerId}</span>
            </div>

            <div className="relative mb-8 pl-4 border-l-2 border-gray-100 space-y-8">
                {timelineSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const historyEntry = order.timeline?.filter(h => h.status === step.status).pop();
                    const dateStr = historyEntry ? new Date(historyEntry.date).toLocaleString() : '';

                    return (
                        <div key={step.status} className="relative pl-6">
                            <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${isCompleted ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}>
                                <step.icon size={16} />
                            </div>
                            <div className={`${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                <h4 className="font-bold text-sm text-gray-900">{t[`st_${step.status}` as keyof typeof t]}</h4>
                                {dateStr && <p className="text-xs text-teal-600 mt-1 font-medium">{dateStr}</p>}
                                {step.status === 'processing' && hasShippingInfo && (
                                    <div className="mt-1 flex gap-2 text-xs font-bold text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded">
                                        <span>{order.weight} {t.kg}</span><span>•</span><span>{order.shippingPrice} TMT</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{t.items}</h4>
                {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 mb-3 last:mb-0">
                        <img src={item.images[0]} className="w-12 h-12 rounded object-cover bg-white" />
                        <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.selectedSize ? `Size: ${item.selectedSize} • ` : ''} {item.quantity} x {item.price} TMT</p>
                        </div>
                    </div>
                ))}
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm"><span className="text-gray-500">{t.productTotal}</span><span className="font-bold text-gray-900">{order.total} TMT</span></div>
                    {hasShippingInfo && (<div className="flex justify-between items-center text-sm"><span className="text-gray-500">{t.shippingCost} ({order.weight} {t.kg})</span><span className="font-bold text-gray-900">{order.shippingPrice} TMT</span></div>)}
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center"><span className="font-bold text-gray-900">{t.grandTotal}</span><span className="font-bold text-teal-700 text-xl">{order.total + (order.shippingPrice || 0)} TMT</span></div>
                </div>
            </div>
        </div>
    );
};