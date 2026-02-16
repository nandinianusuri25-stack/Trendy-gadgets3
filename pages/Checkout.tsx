
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, useAuth } from '../App';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Track selected address
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    user?.addresses.find(a => a.isDefault)?.id || user?.addresses[0]?.id || null
  );

  // Free shipping over ₹4,999
  const shipping = cartTotal > 4999 ? 0 : 99;
  const total = cartTotal + shipping;

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      clearCart();
      alert("Order placed successfully! Redirecting to your orders...");
      navigate('/orders');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-emerald-600 underline">Go shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="flex items-center gap-4 mb-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`h-px w-10 transition-colors ${step >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`h-px w-10 transition-colors ${step >= 3 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Delivery Address</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 1 of 3</span>
              </div>
              <div className="grid gap-4 mb-8">
                {user?.addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-5 border-2 rounded-3xl flex items-start gap-4 cursor-pointer transition-all duration-200 group ${
                      selectedAddressId === addr.id 
                      ? 'border-slate-900 bg-slate-50 ring-4 ring-slate-900/5' 
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`mt-1 transition-colors ${selectedAddressId === addr.id ? 'text-emerald-500' : 'text-slate-200 group-hover:text-slate-300'}`}>
                      <i className={`fa-solid ${selectedAddressId === addr.id ? 'fa-circle-check' : 'fa-circle'} text-xl`}></i>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-bold text-slate-900">{addr.type} Address</div>
                        {addr.isDefault && <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase tracking-wider">Default</span>}
                      </div>
                      <div className="text-sm text-slate-500 leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zip}
                      </div>
                    </div>
                  </div>
                ))}
                
                {user?.addresses.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-300 mb-4">
                    <p className="text-slate-500 text-sm mb-4">No addresses found in your profile.</p>
                  </div>
                )}

                <button className="p-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all group">
                  <i className="fa-solid fa-plus mr-2 group-hover:scale-110 transition-transform"></i> Add New Delivery Address
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link to="/cart" className="text-sm font-bold text-slate-400 hover:text-slate-600">Back to Cart</Link>
                <button 
                  onClick={() => selectedAddressId && setStep(2)} 
                  disabled={!selectedAddressId}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Payment Method</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3</span>
              </div>
              <div className="space-y-4 mb-8">
                {['UPI (Google Pay / PhonePe / Paytm)', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                  <label key={method} className="flex items-center gap-4 p-5 border border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50">
                    <input type="radio" name="payment" className="w-5 h-5 accent-slate-900" defaultChecked={method.includes('UPI')} />
                    <span className="font-bold text-slate-800">{method}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button onClick={() => setStep(1)} className="border border-slate-200 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition">Back</button>
                <button onClick={() => setStep(3)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-xl shadow-slate-200">Review Order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Review & Complete</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 3 of 3</span>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-slate-900 uppercase text-xs tracking-widest">Shipping To</div>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-emerald-600 hover:underline">Change</button>
                  </div>
                  {user?.addresses.find(a => a.id === selectedAddressId) && (
                    <div className="text-sm text-slate-600">
                      <p className="font-bold text-slate-800 mb-1">{user.addresses.find(a => a.id === selectedAddressId)?.type} Address</p>
                      <p>{user.addresses.find(a => a.id === selectedAddressId)?.street}</p>
                      <p>{user.addresses.find(a => a.id === selectedAddressId)?.city}, {user.addresses.find(a => a.id === selectedAddressId)?.state} {user.addresses.find(a => a.id === selectedAddressId)?.zip}</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-4">Items Summary</div>
                  <div className="text-sm text-slate-600 flex justify-between items-center">
                    <span>Total Items in Bag</span>
                    <span className="font-bold text-slate-900">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button onClick={() => setStep(2)} className="border border-slate-200 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition">Back</button>
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading}
                  className="flex-grow bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Summary Card */}
        <div className="lg:w-1/3">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping Estimate</span>
                <span className={`font-bold ${shipping === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-slate-500 text-sm">Order Total</span>
                <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Your payment and data are secured with 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
