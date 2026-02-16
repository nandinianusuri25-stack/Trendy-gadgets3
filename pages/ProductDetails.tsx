
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart, useProducts } from '../App';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-emerald-600 font-bold underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm mb-4">
            <img 
              src={product.images[0] || 'https://picsum.photos/600/600'} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer opacity-80 hover:opacity-100 transition">
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="mb-8">
            <Link to="/shop" className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 inline-block hover:text-slate-600">
               &larr; Back to {product.category}
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold italic text-slate-900 mb-2">{product.name}</h1>
            <div className="text-xs font-bold text-emerald-600 mb-4 uppercase tracking-wider">{product.brand}</div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-slate-200'}`}></i>
                  ))}
                </div>
                <span className="text-sm font-bold ml-1">{product.rating}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <span className="text-sm text-slate-500 font-medium">{product.reviewsCount} reviews</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <span className={`text-xs font-bold uppercase ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.oldPrice && <span className="text-xl text-slate-400 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</span>}
            </div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-slate-100 rounded-2xl px-2 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-xl transition"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-xl transition"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              <button 
                onClick={() => addToCart(product.id, quantity)}
                disabled={product.stock === 0}
                className="flex-grow bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 disabled:bg-slate-300 transition shadow-xl shadow-slate-200"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
