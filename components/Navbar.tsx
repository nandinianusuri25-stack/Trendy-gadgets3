
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../App';

const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-serif text-2xl font-bold italic text-slate-900">
            TG<span className="hidden sm:inline">.Gadgets</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <Link to="/shop" className="hover:text-emerald-600 transition">Shop</Link>
          {isAdmin && <Link to="/admin" className="text-amber-600 font-bold">Admin Panel</Link>}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <i className="fa-solid fa-magnifying-glass text-slate-600"></i>
          </button>
          
          <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition">
            <i className="fa-solid fa-bag-shopping text-slate-600"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2 group relative">
              <Link to="/profile" className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold overflow-hidden border border-emerald-200">
                  {user.profileImage ? <img src={user.profileImage} alt="User" /> : user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
              </Link>
              <div className="absolute top-full right-0 w-48 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                 <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">My Profile</Link>
                 <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">My Orders</Link>
                 <div className="border-t border-slate-100 my-1"></div>
                 <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm font-semibold bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition">
              Sign In
            </Link>
          )}

          <button className="md:hidden p-2 text-slate-600">
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="max-w-3xl mx-auto flex items-center bg-slate-100 rounded-full px-4 py-2">
            <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2"></i>
            <input 
              autoFocus
              type="text" 
              placeholder="Search unique gifts..." 
              className="bg-transparent border-none outline-none w-full text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/shop?q=${(e.target as HTMLInputElement).value}`);
                  setIsSearchOpen(false);
                }
              }}
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
