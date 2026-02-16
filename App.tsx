
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Dashboard/Profile';
import OrderHistory from './pages/Dashboard/OrderHistory';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import AddProduct from './pages/Admin/AddProduct';
import { User, CartItem, Product } from './types';
import { MOCK_PRODUCTS as INITIAL_PRODUCTS } from './mockData';

// Context
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAdmin: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ProductContext = createContext<ProductContextType | undefined>(undefined);
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize products and persistent cart
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, pass: string) => {
    if (email === 'nandinianusuri25@gmail.com') {
      const adminUser: User = {
        id: 'admin1',
        name: 'Admin User',
        email: 'nandinianusuri25@gmail.com',
        role: 'Admin',
        mobile: '9032957545',
        addresses: [{ id: 'a1', type: 'Work', street: 'Gorsa', city: 'Kakinada Dist', state: 'AP', zip: '533449', isDefault: true }]
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    const mockUser: User = { id: 'u1', name: 'John Doe', email, role: 'User', addresses: [] };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addProduct = (product: Partial<Product>) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Lifestyle',
      subcategory: product.subcategory || '',
      price: product.price || 0,
      discountPrice: product.discountPrice,
      oldPrice: product.oldPrice,
      stock: product.stock || 0,
      brand: product.brand || 'Trendy Gadgets',
      tags: product.tags || [],
      images: product.images || ['https://picsum.photos/seed/new/600/600'],
      rating: 0,
      reviewsCount: 0,
      isFeatured: !!product.isFeatured,
      deliveryCharge: product.deliveryCharge || 0,
      status: (product.stock || 0) > 0 ? 'Active' : 'Out of Stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addToCart = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { productId, quantity, price: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin: user?.role === 'Admin' }}>
      <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pb-20 md:pb-0 pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                  <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                  <Route path="/orders" element={user ? <OrderHistory /> : <Navigate to="/login" />} />
                  
                  <Route path="/admin" element={user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                  <Route path="/admin/products" element={user?.role === 'Admin' ? <ProductManagement /> : <Navigate to="/" />} />
                  <Route path="/admin/add-product" element={user?.role === 'Admin' ? <AddProduct /> : <Navigate to="/" />} />
                  <Route path="/admin/edit-product/:id" element={user?.role === 'Admin' ? <AddProduct /> : <Navigate to="/" />} />
                  
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <BottomNav />
              <footer className="hidden md:block bg-slate-900 text-white py-12 px-6">
                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-serif text-2xl mb-4 italic">Trendy Gadgets</h3>
                      <p className="text-slate-400">Premium gift shop for the modern individual.</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Quick Links</h4>
                      <ul className="space-y-2 text-slate-400">
                        <li>Shop</li>
                        <li>About Us</li>
                        <li>Contact</li>
                        <li>FAQs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Categories</h4>
                      <ul className="space-y-2 text-slate-400">
                        <li>Smart Home</li>
                        <li>Wearables</li>
                        <li>Office Tech</li>
                        <li>Gaming</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Newsletter</h4>
                      <div className="flex">
                        <input type="email" placeholder="Email address" className="bg-slate-800 border-none px-4 py-2 rounded-l-md w-full focus:ring-1 focus:ring-emerald-500" />
                        <button className="bg-emerald-600 px-4 py-2 rounded-r-md hover:bg-emerald-700 transition">Join</button>
                      </div>
                    </div>
                 </div>
                 <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                   &copy; 2024 Trendy Gadgets. All rights reserved.
                 </div>
              </footer>
            </div>
          </Router>
        </CartContext.Provider>
      </ProductContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
