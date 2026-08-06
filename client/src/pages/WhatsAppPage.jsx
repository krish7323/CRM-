import React, { useState } from 'react';
import { MessageSquare, Send, CheckCheck, Smartphone } from 'lucide-react';
const templates = [
    {
        id: 't1',
        title: 'Enquiry Welcome',
        content: 'Hallo {{Student_Name}}! Welcome to The European Language Hub. We received your enquiry for {{Course_Name}} ({{Level}}). Demo classes start this week!',
    },
    {
        id: 't2',
        title: 'Fee Installment Reminder',
        content: 'Dear {{Student_Name}}, your fee installment of €{{Amount}} for {{Course_Name}} is due on {{Due_Date}}. Please complete your payment via UPI or Portal.',
    },
    {
        id: 't3',
        title: 'Admission Confirmation',
        content: 'Congratulations {{Student_Name}}! Your admission to {{Course_Name}} (Batch: {{Batch_Code}}) is confirmed. Class starts {{Start_Date}}.',
    },
    {
        id: 't4',
        title: 'Certificate Ready Notice',
        content: 'Guten Tag {{Student_Name}}! Your CEFR {{Level}} Certificate for {{Course_Name}} is issued and ready for download on ELH Portal.',
    },
];
export const WhatsAppPage = () => {
    const [activeTemplate, setActiveTemplate] = useState(templates[0]);
    const [testName, setTestName] = useState('Mateo Garcia');
    const [testCourse, setTestCourse] = useState('German A1');
    const previewText = activeTemplate.content
        .replace('{{Student_Name}}', testName)
        .replace('{{Course_Name}}', testCourse)
        .replace('{{Level}}', 'A1')
        .replace('{{Amount}}', '7,000')
        .replace('{{Due_Date}}', '10th Aug')
        .replace('{{Batch_Code}}', 'GER-A1-B01')
        .replace('{{Start_Date}}', '1st July');
    return (<div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          WhatsApp Communication Hub (Meta Business API)
        </h1>
        <p className="text-xs text-slate-400">Consent-based automated triggers with dynamic variable preview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Template</h3>
          {templates.map((tpl) => (<div key={tpl.id} onClick={() => setActiveTemplate(tpl)} className={`p-4 rounded-xl border cursor-pointer transition ${activeTemplate.id === tpl.id
                ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400"/> {tpl.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.content}</p>
            </div>))}
        </div>

        {/* Live Phone Mockup Preview */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-[32px] p-4 shadow-2xl space-y-3 relative">
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2"/>
            
            <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0"/>
              <span>Official Meta Business Account</span>
            </div>

            {/* Chat bubble */}
            <div className="bg-emerald-900/60 border border-emerald-700/60 text-slate-100 p-3.5 rounded-2xl text-xs space-y-2 rounded-tl-none">
              <p className="leading-relaxed">{previewText}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-semibold">
                <span>10:42 AM</span>
                <CheckCheck className="w-3 h-3 text-cyan-400"/>
              </div>
            </div>

            <button onClick={() => alert(`Simulated WhatsApp message sent to ${testName}!`)} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2">
              <Send className="w-4 h-4"/> Send Test Message
            </button>
          </div>
        </div>
      </div>
    </div>);
};
