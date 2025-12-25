export type Language = 'ru' | 'tr' | 'tm' | 'en';

export type ImageSize = '1K' | '2K' | '4K';

export interface User {
  id: string; // Unique internal ID (timestamp)
  name: string;
  identifier: string; // Phone or Email
  password?: string; // User password
  role: 'admin' | 'customer';
  fiveDigitId?: string; // The random Customer ID (e.g. 59201) used for Login
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  deliveryTime: string;
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

// Updated Status Types for granular tracking
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'arrived' | 'delivered';

export interface OrderTimeline {
  status: OrderStatus;
  date: string; // ISO String
}

export interface Order {
  id: string;
  customerId: string; // The 5-digit ID of the customer
  customerContact: string; // Phone or Email used for login
  items: CartItem[];
  total: number; // This is Product Total
  shippingPrice?: number; // Shipping Cost
  weight?: number; // Weight in KG
  date: string;
  status: OrderStatus;
  timeline: OrderTimeline[]; // History of status changes
}

export interface Translations {
  home: string;
  cart: string;
  admin: string;
  settings: string;
  featured: string;
  addToCart: string;
  buyNow: string;
  description: string;
  delivery: string;
  price: string;
  total: string;
  checkout: string;
  contact: string;
  language: string;
  addProduct: string;
  editProduct: string;
  update: string;
  cancel: string;
  title: string;
  image: string;
  category: string;
  save: string;
  delete: string;
  days: string;
  orderHistory: string;
  emptyCart: string;
  uploadPhoto: string;
  orUrl: string;
  adminPanel: string;
  products: string;
  orders: string;
  images: string;
  sizes: string;
  addSize: string;
  selectSize: string;
  selectCategory: string;
  sizeRequired: string;
  shippingRates: string;
  airCargo: string;
  roadCargo: string;
  expressCargo: string;
  contactUs: string;
  orderVia: string;
  followUs: string;
  personalAccount: string;
  copyNumber: string;
  copied: string;
  // Order Statuses
  status: string;
  date: string;
  items: string;
  noOrders: string;
  orderDetails: string;
  myOrders: string;
  trackOrder: string;
  // Detailed Statuses
  st_pending: string;
  st_processing: string;
  st_shipped: string;
  st_arrived: string;
  st_delivered: string;
  updateStatus: string;
  // Weight & Shipping
  weight: string;
  shippingCost: string;
  enterWeightPrice: string;
  productTotal: string;
  grandTotal: string;
  kg: string;
  setDetails: string;
  // Auth
  login: string;
  signup: string;
  logout: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  fullName: string;
  customerID: string;
  welcome: string;
  adminLogin: string;
  customerLogin: string;
  loginError: string;
  fillAllFields: string;
  yourId: string;
  enterCustomerId: string;
  createPassword: string;
  registrationSuccess: string;
  saveYourId: string;
  loginToContinue: string;
  userNotFound: string;
  // OTP
  sendCode: string;
  enterCode: string;
  verify: string;
  wrongCode: string;
  codeSentTo: string;
  resend: string;
  confirmPassword: string;
  passwordMismatch: string;
}