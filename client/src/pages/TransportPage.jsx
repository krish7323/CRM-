import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Bus,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';

export const TransportPage = () => {
  const { transportRoutes, vehicles, addTransportRoute, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    routeCode: 'R-101',
    routeName: 'Main Route',
    driverName: 'Sardar Singh',
    vehicleNo: 'KA-01-EQ-9988',
  });

  const filteredRoutes = (transportRoutes || []).filter((r) => {
    return (
      r.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (addTransportRoute) addTransportRoute(form);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bus className="w-5 h-5 text-amber-400" /> Transport ERP & Fleet Operations
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {filteredRoutes.length} Routes
            </span>
          </h1>
          <p className="text-xs text-slate-400">Manage bus routes, drivers, stops & vehicle fleets</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Transport Manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bus Route</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search route name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutes.map((rt) => (
          <div key={rt._id || rt.routeCode} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                  {rt.routeCode}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{rt.routeName}</h3>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <p className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" /> Driver: {rt.driverName || 'Assigned Driver'}
              </p>
              <p className="flex items-center gap-2">
                <Bus className="w-3.5 h-3.5 text-amber-400" /> Vehicle: {rt.vehicleNo || 'KA-01-EQ-9988'}
              </p>
            </div>
          </div>
        ))}

        {filteredRoutes.length === 0 && (
          <div className="col-span-full p-8 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No transport routes registered yet. Click "Add Bus Route" to create a new route.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Transport Bus Route</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Route Code</label>
              <input
                type="text"
                required
                value={form.routeCode}
                onChange={(e) => setForm({ ...form, routeCode: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Route Name</label>
              <input
                type="text"
                required
                value={form.routeName}
                onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Driver Name</label>
              <input
                type="text"
                required
                value={form.driverName}
                onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
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
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Route
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
