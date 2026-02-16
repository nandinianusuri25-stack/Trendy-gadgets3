
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart, useProducts } from '../App';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { products } = useProducts();

  const cartProducts = cart.map(item => ({
    ...item,
    details: products.find(p => p.id === item.productId)!
  })).filter(item => item.details);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300 text-4xl">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <h2 className="text-3xl font-serif font-bold italic mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10">Looks like you haven't added anything to your cart yet. Discover our latest gadget collection.</p>
        <Link to="/shop" className="inline-block bg-slate-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-emerald-600 transition">
          Browse Shop
        </Link>
      </div>
    );
  }

  // Free shipping over ₹4,999
  const shippingFee = cartTotal > 4999 ? 0 : 99;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl font-serif font-bold italic mb-10">Your Shopping Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items */}
        <div className="lg:w-2/3 space-y-6">
          {cartProducts.map(item => (
            <div key={item.productId} className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm flex gap-4 md:gap-6 items-center">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                <img src={item.details.images[0]} alt={item.details.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 md:text-lg">{item.details.name}</h3>
                  <button onClick={() => removeFromCart(item.productId)} className="text-slate-400 hover:text-rose-500 p-1">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div className="text-slate-500 text-xs mb-4 uppercase tracking-wider">{item.details.category}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-slate-100 rounded-xl px-1 py-0.5">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition"><i className="fa-solid fa-minus text-xs"></i></button>
                    <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition"><i className="fa-solid fa-plus text-xs"></i></button>
                  </div>
                  <div className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          ))}
          <Link to="/shop" className="inline-flex items-center text-emerald-600 font-bold hover:underline">
            <i className="fa-solid fa-arrow-left mr-2"></i> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-24">
            <h3 className="text-xl font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-white font-medium">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount</span>
                <span className="text-emerald-400 font-medium">-₹0</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-end">
                <span className="text-lg">Total Amount</span>
                <span className="text-2xl font-bold">₹{(cartTotal + shippingFee).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="space-y-4">
                <div className="bg-white/5 rounded-xl border border-white/10 flex p-1 mb-6">
                    <input type="text" placeholder="Coupon Code" className="bg-transparent border-none outline-none px-4 py-2 text-sm flex-grow" />
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-400 transition">Apply</button>
                </div>
                <Link to="/checkout" className="block w-full bg-emerald-500 text-slate-900 font-bold text-center py-4 rounded-2xl hover:bg-emerald-400 transition shadow-xl shadow-emerald-500/20">
                    Proceed to Checkout
                </Link>
                <div className="flex items-center justify-center gap-4 text-white/40 pt-4">
                    <i className="fa-brands fa-cc-visa text-xl"></i>
                    <i className="fa-brands fa-cc-mastercard text-xl"></i>
                    <i className="fa-solid fa-building-columns text-xl"></i>
                    <i className="fa-solid fa-mobile-screen-button text-xl"></i>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
