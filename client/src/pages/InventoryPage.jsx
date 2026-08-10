import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Package,
  Plus,
  Search,
  Barcode,
  X,
  IndianRupee,
} from 'lucide-react';

export const InventoryPage = () => {
  const { assets, addAsset, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Computers',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 45000,
    vendor: 'ProTech Hardware',
  });

  const filteredAssets = (assets || []).filter((a) => {
    const matchesSearch = a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.assetCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAssetValue = filteredAssets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (addAsset) addAsset(form);
    setIsModalOpen(false);
    setForm({
      name: '',
      category: 'Computers',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 45000,
      vendor: 'ProTech Hardware',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-400" /> Inventory & Hardware Assets
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-semibold border border-teal-500/30">
              {filteredAssets.length} Assets
            </span>
          </h1>
          <p className="text-xs text-slate-400">Computers, projectors, lab equipment, furniture & barcode tags</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Librarian') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-teal-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hardware Asset</span>
          </button>
        )}
      </div>

      {/* KPI Value Card */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Asset Valuation</span>
          <p className="text-2xl font-black text-teal-400 font-mono mt-0.5">₹{totalAssetValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search asset name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          <option value="Computers">Computers</option>
          <option value="Projectors">Projectors</option>
          <option value="Furniture">Furniture</option>
          <option value="Lab Equipment">Lab Equipment</option>
        </select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((ast) => (
          <div key={ast._id || ast.assetCode} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800 uppercase tracking-widest">
                  {ast.category}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{ast.name}</h3>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                {ast.status || 'Available'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-300 font-mono">
              <p className="flex justify-between">
                <span className="text-slate-500 text-[10px]">Barcode:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1"><Barcode className="w-3 h-3 text-amber-400" /> {ast.assetCode}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500 text-[10px]">Price:</span>
                <span className="text-teal-400 font-bold">₹{ast.purchasePrice?.toLocaleString('en-IN') || '0'}</span>
              </p>
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="col-span-full p-8 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No hardware assets found. Click "Add Hardware Asset" to register a new asset.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Inventory Asset</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Asset Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Computers">Computers</option>
                <option value="Projectors">Projectors</option>
                <option value="Furniture">Furniture</option>
                <option value="Lab Equipment">Lab Equipment</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Purchase Price (₹)</label>
              <input
                type="number"
                required
                value={form.purchasePrice}
                onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400"
              >
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
