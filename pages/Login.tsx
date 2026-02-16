
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <Link to="/" className="font-serif text-3xl font-bold italic text-slate-900 mb-6 block">Trendy Gadgets</Link>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                placeholder="nandinianusuri25@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-xs font-bold text-emerald-600">Forgot?</Link>
              </div>
              <input 
                required
                type="password" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>Sign In <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i></>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="flex-grow h-px bg-slate-100"></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or continue with</span>
            <div className="flex-grow h-px bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition font-medium">
              <i className="fa-brands fa-google text-rose-500"></i> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition font-medium">
              <i className="fa-solid fa-mobile-screen-button text-emerald-600"></i> OTP
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Don't have an account? <Link to="/register" className="font-bold text-emerald-600 hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
