
import React from 'react';
import { Calendar, Mail, Sparkles, ChevronRight, Bell, ArrowUpRight } from 'lucide-react';
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
    <div className="h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Overview</p>
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome back, Alex.</h2>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
             Monday, May 20
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Event Card */}
        {nextEvent && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">Upcoming</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{nextEvent.title}</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">
                  {new Date(nextEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {nextEvent.location}
                </p>
              </div>
            </div>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              Join Meeting <ArrowUpRight size={16} />
            </button>
          </div>
        )}

        {/* AI Briefing Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-xl text-white flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="p-2 bg-white/10 rounded-xl w-fit">
              <Sparkles size={20} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Smart Morning Recap</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gemini analyzed your {importantEmails.length} priority threads. You have follow-ups needed for Sarah's update and Mike's feedback.
            </p>
          </div>
          <button 
            onClick={() => setView('ai')}
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            Review Briefing <ChevronRight size={18} />
          </button>
        </div>

        {/* Quick Email Access */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inbox Activity</h4>
            <button onClick={() => setView('outlook')} className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3 flex-1">
            {emails.slice(0, 3).map(email => (
              <div 
                key={email.id} 
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                onClick={() => setView('outlook')}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
                  {email.sender.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{email.sender}</p>
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
