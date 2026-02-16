
import React, { useState } from 'react';
import { useAuth } from '../../App';
import { Address } from '../../types';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    profileImage: user?.profileImage || ''
  });

  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const currentAddresses = user.addresses || [];
      const newAddress: Address = {
        ...addressForm,
        id: `addr-${Date.now()}`,
        isDefault: currentAddresses.length === 0 ? true : addressForm.isDefault
      };

      updateUser({
        addresses: [...currentAddresses, newAddress]
      });

      setIsAddingAddress(false);
      setAddressForm({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        isDefault: false
      });
    } catch (error) {
      console.error("Failed to add address", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdate = () => {
    const newImg = `https://picsum.photos/seed/${Math.random()}/200/200`;
    setEditForm(prev => ({ ...prev, profileImage: newImg }));
  };

  const userAddresses = user?.addresses || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 h-32 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex items-end gap-4">
            <div className="w-32 h-32 rounded-3xl bg-emerald-100 border-4 border-white flex items-center justify-center text-4xl text-emerald-600 font-bold overflow-hidden shadow-lg">
              {editForm.profileImage || user?.profileImage ? (
                <img src={isEditing ? editForm.profileImage : user?.profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                user?.name.charAt(0)
              )}
            </div>
            {isEditing && (
              <button 
                onClick={handleImageUpdate}
                className="mb-2 bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-sm"
              >
                <i className="fa-solid fa-camera mr-2"></i> Change Photo
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            {isEditing ? (
              <div className="w-full max-w-md space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input 
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-slate-500 font-medium">{user?.email}</p>
                {user?.mobile && <p className="text-sm text-slate-400 mt-1"><i className="fa-solid fa-phone mr-2 text-xs"></i> {user.mobile}</p>}
              </div>
            )}

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: user?.name || '', mobile: user?.mobile || '', profileImage: user?.profileImage || '' });
                    }}
                    className="bg-slate-100 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2 text-slate-900">
                  <i className="fa-solid fa-location-dot text-emerald-600"></i> Saved Addresses
                </h3>
                {!isAddingAddress && (
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-widest"
                  >
                    Add New
                  </button>
                )}
              </div>
              
              {isAddingAddress ? (
                <form onSubmit={handleAddAddress} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setAddressForm({...addressForm, type: 'Home'})}
                      className={`py-2 rounded-xl text-xs font-bold transition ${addressForm.type === 'Home' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      Home
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddressForm({...addressForm, type: 'Work'})}
                      className={`py-2 rounded-xl text-xs font-bold transition ${addressForm.type === 'Work' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      Work
                    </button>
                  </div>
                  <input 
                    required
                    type="text"
                    placeholder="Street Address"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      required
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input 
                      required
                      type="text"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <input 
                    required
                    type="text"
                    placeholder="Zip Code"
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-grow bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Save Address'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : userAddresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400 mb-4">No addresses saved yet.</p>
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-xs font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-50 transition"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAddresses.map(addr => (
                    <div key={addr.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 relative group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${addr.type === 'Home' ? 'fa-house-chimney' : 'fa-briefcase'} text-xs`}></i>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{addr.type}</div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{addr.street}, {addr.city}, {addr.state} {addr.zip}</div>
                      </div>
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-bold uppercase">Default</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-colors">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-900">
                <i className="fa-solid fa-shield-halved text-emerald-600"></i> Account Security
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-4 bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl text-sm font-medium transition flex justify-between items-center shadow-sm">
                  Change Password 
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-emerald-500 transition-colors"></i>
                </button>
                <button className="w-full text-left p-4 bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl text-sm font-medium transition flex justify-between items-center shadow-sm">
                  Two-Factor Authentication
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase font-bold">Disabled</span>
                </button>
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <button onClick={logout} className="w-full text-center p-4 text-rose-600 hover:bg-rose-50 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Sign Out Securely
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
