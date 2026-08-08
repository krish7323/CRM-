import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Phone, MessageSquare, Clock } from 'lucide-react';
export const FollowupsPage = () => {
    const { leads } = useAppStore();
    const [tab, setTab] = useState('today');
    const followUpLeads = leads.filter((l) => l.status === 'Follow-up' || l.nextFollowUpAt);
    return (<div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Follow-up & Reminder System
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {followUpLeads.length} Tasks
            </span>
          </h1>
          <p className="text-xs text-slate-400">Scheduled candidate follow-ups with one-click call & WhatsApp triggers</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          {['today', 'overdue', 'tomorrow', 'all'].map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider capitalize transition ${tab === t ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}>
              {t}
            </button>))}
        </div>
      </div>

      {/* Followups Table List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Course & Level</th>
                <th className="p-4">Follow-up Time</th>
                <th className="p-4">Assigned Counsellor</th>
                <th className="p-4">Last Conversation</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {followUpLeads.map((lead) => (<tr key={lead._id} className="hover:bg-slate-900/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-100">{lead.name}</p>
                    <p className="text-[10px] text-slate-400">{lead.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/40">
                      {lead.course} {lead.level}
                    </span>
                  </td>
                  <td className="p-4 text-amber-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5"/>
                    {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Today'}
                  </td>
                  <td className="p-4 text-slate-300">{lead.counsellorName || 'Sophie Martin'}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {lead.notes?.[lead.notes?.length - 1]?.text || 'Scheduled call'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition">
                      <Phone className="w-3 h-3 text-cyan-400"/> Call
                    </a>
                    <a href={`https://wa.me/${(lead.whatsapp || '').replace(/\D/g, '')}?text=Hallo%20${encodeURIComponent(lead.name || '')},%20this%20is%20The%20European%20Language%20Hub.%20Following%20up%20on%20your%20${lead.course || ''}%20enquiry!`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition">
                      <MessageSquare className="w-3 h-3"/> WhatsApp
                    </a>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
