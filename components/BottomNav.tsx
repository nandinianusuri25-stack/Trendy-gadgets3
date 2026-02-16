
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';

const BottomNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-slate-200 h-16 flex items-center justify-around px-2">
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <i className="fa-solid fa-house text-lg"></i>
        <span className="text-[10px] font-medium uppercase tracking-widest">Home</span>
      </NavLink>
      <NavLink 
        to="/shop" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <i className="fa-solid fa-store text-lg"></i>
        <span className="text-[10px] font-medium uppercase tracking-widest">Shop</span>
      </NavLink>
      <NavLink 
        to="/cart" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <i className="fa-solid fa-bag-shopping text-lg"></i>
        <span className="text-[10px] font-medium uppercase tracking-widest">Cart</span>
      </NavLink>
      <NavLink 
        to={user ? "/profile" : "/login"} 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <i className="fa-solid fa-user text-lg"></i>
        <span className="text-[10px] font-medium uppercase tracking-widest">{user ? 'Me' : 'Login'}</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
