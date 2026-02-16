
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../App';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        {product.oldPrice && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition shadow-sm">
          <i className="fa-regular fa-heart"></i>
        </button>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-amber-400 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-slate-200'}`}></i>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition line-clamp-2 mb-2 flex-grow">
          {product.name}
        </Link>
        
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
            {product.oldPrice && <div className="text-[10px] text-slate-400 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</div>}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id, 1);
            }}
            className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition shadow-lg shadow-slate-200 active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
