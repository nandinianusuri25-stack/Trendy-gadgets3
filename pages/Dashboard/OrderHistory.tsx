
import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistory: React.FC = () => {
  const mockOrders = [
    { id: '#TG-9981', date: 'May 24, 2024', total: 129.50, status: 'Delivered', items: 2 },
    { id: '#TG-8820', date: 'April 12, 2024', total: 45.99, status: 'Shipped', items: 1 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold italic mb-10">My Order History</h1>
      
      {mockOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
          <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {mockOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-6 items-center w-full md:w-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <i className="fa-solid fa-box text-2xl"></i>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{order.id}</div>
                  <div className="text-xs text-slate-500">{order.date} • {order.items} items</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total</div>
                  <div className="font-bold">${order.total.toFixed(2)}</div>
                </div>
                <div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {order.status}
                  </span>
                </div>
                <button className="w-10 h-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                  <i className="fa-solid fa-chevron-right text-xs text-slate-400"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
