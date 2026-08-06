import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Bus,
  Plus,
  Search,
  MapPin,
  Clock,
  User,
  Phone,
  FileCheck,
  ShieldCheck,
  Fuel,
  X,
  CheckCircle2,
} from 'lucide-react';

export const TransportPage = () => {
  const { transportRoutes, vehicles, addTransportRoute, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    routeCode: 'R-102',
    routeName: 'Whitefield - Marathahalli - Campus',
    stopsText: 'Whitefield Main (07:20 AM - ₹2500), Marathahalli Bridge (07:45 AM - ₹2200)',
    vehicleNo: 'KA-01-EQ-9988',
    driverName: 'Sardar Singh',
  });

  const filteredRoutes = transportRoutes.filter((r) => {
    return r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) || r.routeCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addTransportRoute(form);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bus className="w-5 h-5 text-amber-400" /> School Bus Transport ERP & Fleet Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {transportRoutes.length} Transport Routes
            </span>
          </h1>
          <p className="text-xs text-slate-400">Routes, bus stops, driver details, vehicle insurance/fitness docs, and fuel logs</p>
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

      {/* Vehicles Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <div key={v._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 bg-slate-950/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 uppercase tracking-widest font-mono">
                  {v.vehicleNo}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{v.model}</h3>
                <p className="text-xs text-slate-400">Capacity: {v.capacity} Seats • Driver: {v.driverName}</p>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                {v.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px]">Insurance Expiry</span>
                <p className="text-slate-200 font-bold">{v.insuranceExpiry}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Fitness Expiry</span>
                <p className="text-emerald-400 font-bold">{v.fitnessExpiry}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routes Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutes.map((rt) => (
          <div key={rt._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
                  {rt.routeCode}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{rt.routeName}</h3>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" /> Driver: {rt.driverName} ({rt.driverPhone})
              </p>
              <p className="flex items-center gap-2">
                <Bus className="w-3.5 h-3.5 text-amber-400" /> Vehicle No: {rt.vehicleNo}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bus Stops & Pickup Schedule</span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {rt.stops?.map((stp, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] flex justify-between font-mono">
                    <span className="font-sans font-semibold text-slate-200">{stp.stopName}</span>
                    <span className="text-amber-400">{stp.pickupTime} • ₹{stp.fee}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Route Modal */}
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
