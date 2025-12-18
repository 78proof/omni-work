
import React from 'react';
import { Calendar, Mail, Sparkles, ChevronRight, Bell } from 'lucide-react';
import { Email, CalendarEvent, AppView } from '../types';

interface DashboardProps {
  emails: Email[];
  events: CalendarEvent[];
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ emails, events, setView }) => {
  const importantEmails = emails.filter(e => e.isImportant && !e.isRead);
  const nextEvent = events[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F2F2F7] pb-24">
      {/* iOS Style Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-end bg-white border-b border-slate-200">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monday, May 20</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Today</h2>
        </div>
        <button className="p-2 bg-slate-100 rounded-full text-slate-600">
          <Bell size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Next Event Card */}
        {nextEvent && (
          <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4 border border-slate-100">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Calendar size={16} />
              <span>NEXT EVENT</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{nextEvent.title}</h3>
              <p className="text-slate-500 font-medium">{new Date(nextEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {nextEvent.location}</p>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              Join Teams Meeting
            </button>
          </div>
        )}

        {/* AI Morning Brief */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles size={20} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">Morning Briefing</h3>
          <p className="text-indigo-50/80 text-sm leading-relaxed mb-4">
            You have {importantEmails.length} priority emails from Sarah and Mike. Your design review is at 2 PM.
          </p>
          <button 
            onClick={() => setView('ai')}
            className="w-full flex items-center justify-between py-2 text-sm font-bold border-t border-white/20 pt-4"
          >
            Ask Gemini for details <ChevronRight size={18} />
          </button>
        </div>

        {/* Outlook Glance */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-sm font-bold text-slate-500 uppercase">Recent Emails</h4>
            <button onClick={() => setView('outlook')} className="text-sm text-blue-600 font-semibold">See All</button>
          </div>
          <div className="space-y-2">
            {emails.slice(0, 3).map(email => (
              <div 
                key={email.id} 
                className="bg-white p-4 rounded-2xl flex items-center gap-4 active:bg-slate-50 transition-colors shadow-sm"
                onClick={() => setView('outlook')}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {email.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-900 truncate">{email.sender}</p>
                    <p className="text-[10px] text-slate-400">10:45 AM</p>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{email.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
