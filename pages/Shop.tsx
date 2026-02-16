
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../mockData';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../App';

const Shop: React.FC = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || 
                            p.description.toLowerCase().includes(query.toLowerCase()) ||
                            p.brand.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        if (sort === 'rating') return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [query, categoryFilter, sort, products]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' && key === 'category') {
        newParams.delete(key);
    } else {
        newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold italic mb-6">Discover Extraordinary</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search gadgets by name or brand..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              value={query}
              onChange={(e) => updateParam('q', e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition ${categoryFilter === cat ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-6 text-emerald-600 font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
