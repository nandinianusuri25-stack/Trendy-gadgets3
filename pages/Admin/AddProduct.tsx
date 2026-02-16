
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../App';
import { Product } from '../../types';
import { CATEGORIES } from '../../mockData';
import { GoogleGenAI } from "@google/genai";

const AddProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();
  
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Lifestyle',
    subcategory: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    brand: 'Trendy Gadgets',
    tags: [],
    images: [],
    isFeatured: false,
    deliveryCharge: 0,
    status: 'Active'
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const existingProduct = products.find(p => p.id === id);
      if (existingProduct) {
        setFormData(existingProduct);
        setImagePreview(existingProduct.images);
      }
    }
  }, [id, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value as string) : val
    }));
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const generateWithAI = async () => {
    if (!formData.name) {
      alert("Please enter a product name first for AI to help!");
      return;
    }
    
    setAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a creative marketing copywriter for "Trendy Gadgets".
          Write a compelling 2-sentence description and provide 5 relevant keywords for a product named "${formData.name}".
          Return the result in JSON format with keys "description" and "tags" (array).`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const result = JSON.parse(response.text);
      setFormData(prev => ({
        ...prev,
        description: result.description,
        tags: [...new Set([...(prev.tags || []), ...result.tags])]
      }));
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Final validation
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      setLoading(false);
      return;
    }

    if (id) {
      updateProduct(id, formData);
    } else {
      addProduct(formData);
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/products');
    }, 1000);
  };

  const simulateImageUpload = () => {
    const newImg = `https://picsum.photos/seed/${Date.now()}/600/600`;
    setImagePreview(prev => [...prev, newImg]);
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImg]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link to="/admin/products" className="text-sm font-bold text-emerald-600 mb-2 inline-block">
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <button 
          onClick={generateWithAI}
          disabled={aiGenerating}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {aiGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          AI Assistant
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Minimalist Desk Organizer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                placeholder="Tell customers about this gadget..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subcategory</label>
                <input 
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                <input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Discount Price (₹)</label>
                <input 
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Stock Qty</label>
                <input 
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                <input 
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Images (Max 5)</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {imagePreview.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const newImgs = imagePreview.filter((_, idx) => idx !== i);
                        setImagePreview(newImgs);
                        setFormData(prev => ({ ...prev, images: newImgs }));
                      }}
                      className="absolute top-1 right-1 bg-rose-500 text-white w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  </div>
                ))}
                {imagePreview.length < 5 && (
                  <button 
                    type="button"
                    onClick={simulateImageUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition"
                  >
                    <i className="fa-solid fa-camera mb-1"></i>
                    <span className="text-[10px] font-bold uppercase">Add</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Keywords / Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map(tag => (
                  <span key={tag} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                    {tag}
                    <i onClick={() => removeTag(tag)} className="fa-solid fa-xmark cursor-pointer hover:text-rose-600"></i>
                  </span>
                ))}
              </div>
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                placeholder="Type and press Enter"
              />
            </div>

            <div className="flex items-center gap-8 pt-4">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input 
                   type="checkbox"
                   name="isFeatured"
                   checked={formData.isFeatured}
                   onChange={handleInputChange}
                   className="w-5 h-5 accent-emerald-600"
                 />
                 <span className="text-sm font-bold text-slate-700">Featured Product</span>
               </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-check"></i> {id ? 'Update Product' : 'Create Product'}</>}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-10 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
