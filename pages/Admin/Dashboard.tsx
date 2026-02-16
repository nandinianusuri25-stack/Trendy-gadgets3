
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, users: 2400 },
  { name: 'Tue', sales: 3000, users: 1398 },
  { name: 'Wed', sales: 2000, users: 9800 },
  { name: 'Thu', sales: 2780, users: 3908 },
  { name: 'Fri', sales: 1890, users: 4800 },
  { name: 'Sat', sales: 2390, users: 3800 },
  { name: 'Sun', sales: 3490, users: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-72 bg-slate-900 text-white shrink-0 p-8">
         <div className="font-serif text-2xl font-bold italic text-emerald-400 mb-12">Admin Console</div>
         <nav className="space-y-4">
           <Link to="/admin" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl text-white font-bold">
              <i className="fa-solid fa-chart-pie"></i> Dashboard
           </Link>
           <Link to="/admin/products" className="flex items-center gap-4 p-4 text-slate-400 hover:bg-white/5 rounded-2xl transition">
              <i className="fa-solid fa-box"></i> Products
           </Link>
           <Link to="/admin/orders" className="flex items-center gap-4 p-4 text-slate-400 hover:bg-white/5 rounded-2xl transition">
              <i className="fa-solid fa-receipt"></i> Orders
           </Link>
           <Link to="/admin/users" className="flex items-center gap-4 p-4 text-slate-400 hover:bg-white/5 rounded-2xl transition">
              <i className="fa-solid fa-users"></i> Customers
           </Link>
           <Link to="/admin/coupons" className="flex items-center gap-4 p-4 text-slate-400 hover:bg-white/5 rounded-2xl transition">
              <i className="fa-solid fa-ticket"></i> Coupons
           </Link>
         </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
             <Link to="/admin/add-product" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                <i className="fa-solid fa-plus"></i> Quick Add Product
             </Link>
             <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/seed/admin/200/200" alt="Admin" />
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Revenue', value: '₹3,45,280', icon: 'fa-indian-rupee-sign', color: 'bg-emerald-100 text-emerald-600' },
             { label: 'Active Orders', value: '124', icon: 'fa-shopping-bag', color: 'bg-amber-100 text-amber-600' },
             { label: 'New Customers', value: '48', icon: 'fa-user-plus', color: 'bg-indigo-100 text-indigo-600' },
             { label: 'Satisfaction', value: '98%', icon: 'fa-heart', color: 'bg-rose-100 text-rose-600' }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl`}>
                   <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
             </div>
           ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold mb-8 flex justify-between">
                Revenue Growth
                <span className="text-xs text-slate-400">Trendline</span>
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold mb-8 flex justify-between">
                User Acquisition
                <span className="text-xs text-slate-400">Weekly View</span>
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#1e293b" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold">Recent Transactions</h3>
             <button className="text-emerald-600 font-bold text-sm">View All History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#ORD-7892', user: 'Alex Rivers', status: 'Delivered', color: 'text-emerald-600 bg-emerald-50', total: '₹1,442', date: 'Oct 12, 2024' },
                  { id: '#ORD-7893', user: 'Sarah Jenkins', status: 'Shipped', color: 'text-indigo-600 bg-indigo-50', total: '₹3,450', date: 'Oct 12, 2024' },
                  { id: '#ORD-7894', user: 'Mike Ross', status: 'Pending', color: 'text-amber-600 bg-amber-50', total: '₹890', date: 'Oct 11, 2024' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{row.id}</td>
                    <td className="px-8 py-5 text-sm text-slate-600">{row.user}</td>
                    <td className="px-8 py-5 text-sm">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.color}`}>
                          {row.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{row.total}</td>
                    <td className="px-8 py-5 text-sm text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
