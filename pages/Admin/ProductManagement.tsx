
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../App';
import { Product } from '../../types';

const ProductManagement: React.FC = () => {
  const { products, deleteProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  
  // Search, Sort and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'name-asc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 1. Filter and Sort Logic
  const processedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [products, searchTerm, sortBy]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(start, start + itemsPerPage);
  }, [processedProducts, currentPage]);

  const toggleStock = (id: string, currentStock: number) => {
    const newStock = currentStock === 0 ? 10 : 0;
    updateProduct(id, { 
      stock: newStock, 
      status: newStock > 0 ? 'Active' : 'Out of Stock' 
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <i className="fa-solid fa-boxes-stacked text-emerald-600"></i>
            Inventory Control
          </h1>
          <p className="text-slate-500 mt-1">Manage, track, and update your product catalog.</p>
        </div>
        <Link 
          to="/admin/add-product" 
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-slate-200"
        >
          <i className="fa-solid fa-plus"></i> New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Search by name, brand or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low First</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
            <i className="fa-solid fa-sort absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
          
          <div className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm whitespace-nowrap flex items-center">
            {processedProducts.length} Products
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Pricing</th>
                <th className="px-8 py-6">Stock Status</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{product.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs bg-indigo-50 px-3 py-1.5 rounded-xl text-indigo-600 font-bold">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
                    {product.oldPrice ? (
                      <div className="text-[10px] text-slate-400 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</div>
                    ) : product.discountPrice ? (
                      <div className="text-[10px] text-emerald-500 font-bold">Sale: ₹{product.discountPrice.toLocaleString('en-IN')}</div>
                    ) : null}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                         <span className="text-xs font-bold text-slate-700">{product.stock} units</span>
                      </div>
                      <button 
                        onClick={() => toggleStock(product.id, product.stock)}
                        className={`text-[9px] font-bold uppercase tracking-widest w-fit px-2 py-0.5 rounded transition ${product.stock === 0 ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}
                      >
                        {product.stock === 0 ? 'Restock' : 'Mark Out'}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition shadow-sm"
                        title="Edit Product"
                      >
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-sm"
                        title="Delete Product"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {processedProducts.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">No results found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search terms or filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSortBy('newest'); }} 
                className="mt-6 text-emerald-600 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{Math.min(processedProducts.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedProducts.length, currentPage * itemsPerPage)}</span> of <span className="text-slate-900 font-bold">{processedProducts.length}</span> products
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
