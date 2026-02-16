
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../mockData';
import ProductCard from '../components/ProductCard';
import { getGiftGuide } from '../services/geminiService';
import { useProducts } from '../App';

const Home: React.FC = () => {
  const { products } = useProducts();
  const [aiSnippet, setAiSnippet] = useState<string>('Curating the perfect gadget collection for you...');
  
  const featured = products.filter(p => p.isFeatured).slice(0, 4);

  useEffect(() => {
    if (featured.length > 0) {
      const fetchSnippet = async () => {
        const snippet = await getGiftGuide(featured);
        setAiSnippet(snippet);
      };
      fetchSnippet();
    }
  }, [featured.length]);

  return (
    <div className="pb-12">
      <section className="relative px-4 pt-4 md:pt-10 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[2rem] overflow-hidden min-h-[500px] flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-emerald-400 to-transparent"></div>
          
          <div className="z-10 text-center md:text-left md:w-1/2">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              Limited Edition Drops
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white italic mb-6 leading-tight">
              Elevate Your <br />
              <span className="text-emerald-400">Daily Life</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 max-w-md">
              Discover unique tech and lifestyle gifts designed to blend functionality with stunning aesthetics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link 
                to="/shop" 
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-500 hover:text-white transition w-full sm:w-auto text-center"
              >
                Shop Collection
              </Link>
              <Link 
                to="/shop?filter=featured" 
                className="text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition w-full sm:w-auto text-center"
              >
                Featured Gadgets
              </Link>
            </div>
          </div>

          <div className="hidden md:block w-1/2 h-[450px] relative">
            <img 
              src="https://picsum.photos/seed/gadget-hero/800/800" 
              alt="Hero Gadget" 
              className="w-full h-full object-cover rounded-3xl shadow-2xl rotate-3 scale-95"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-emerald-50 border border-emerald-100 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200 shrink-0">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              AI Gift Assistant Recommendation
              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">Beta</span>
            </h3>
            <p className="text-slate-600 italic">"{aiSnippet}"</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold italic mb-2">Our Curated Picks</h2>
            <p className="text-slate-500">The most loved gadgets this month.</p>
          </div>
          <Link to="/shop" className="text-emerald-600 font-bold hover:underline transition">
            View All Shop <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-24 bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <h2 className="text-center text-2xl font-serif font-bold italic mb-12">Explore by Lifestyle</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.slice(1).map((cat, i) => (
              <Link 
                key={cat} 
                to={`/shop?category=${cat}`}
                className="shrink-0 group relative w-48 h-48 rounded-3xl overflow-hidden bg-white shadow-sm"
              >
                <img 
                  src={`https://picsum.photos/seed/${cat}${i}/400/400`} 
                  alt={cat} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white font-bold">{cat}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
