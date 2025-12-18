
import React, { useState } from 'react';
import { Mail, Calendar, Search, Star, Lock, ExternalLink, ChevronRight, Inbox, Clock, MapPin, Trash2, Archive, Reply } from 'lucide-react';
import { Email, CalendarEvent } from '../types';

interface OutlookProps {
  emails: Email[];
  events: CalendarEvent[];
}

const OutlookIntegration: React.FC<OutlookProps> = ({ emails, events }) => {
  const [activeTab, setActiveTab] = useState<'mail' | 'calendar'>('mail');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(window.innerWidth >= 768 ? (emails[0]?.id || null) : null);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  if (!isConnected) {
    return (
      <div className="h-full bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-200 flex flex-col items-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-[#0078d4] mb-8 shadow-inner">
            <Mail size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Access Outlook</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Sync your work account to enable Gemini's AI scheduling and email summarization features.
          </p>
          <button 
            onClick={() => setIsConnected(true)}
            className="w-full py-4 bg-[#0078d4] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/30 hover:bg-[#006cc0] active:scale-95 transition-all"
          >
            <Lock size={20} /> Connect Microsoft Account
          </button>
          <p className="text-[10px] text-slate-400 mt-8 flex items-center gap-1 font-bold uppercase tracking-widest">
            Microsoft Graph Security <ExternalLink size={10} />
          </p>
        </div>
      </div>
    );
  }

  const MailView = (
    <div className="flex h-full w-full">
      <div className={`flex flex-col h-full bg-white border-r border-slate-200 ${selectedEmailId && 'hidden md:flex'} md:w-80 shrink-0`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
           <h3 className="font-bold text-slate-800">Focused Inbox</h3>
           <div className="p-1 bg-slate-100 rounded-lg flex">
             <button className="px-2 py-1 bg-white text-[10px] font-bold rounded shadow-sm text-blue-600">All</button>
             <button className="px-2 py-1 text-[10px] font-bold text-slate-500">Unread</button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmailId(email.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selectedEmailId === email.id ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-bold truncate pr-2 ${selectedEmailId === email.id ? 'text-blue-700' : 'text-slate-900'}`}>{email.sender}</span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                {email.isImportant && <Star size={10} className="text-orange-400 fill-orange-400 shrink-0" />}
                <p className="text-xs font-semibold text-slate-700 truncate">{email.subject}</p>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">{email.body}</p>
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-white overflow-hidden ${!selectedEmailId && 'hidden md:flex'}`}>
        {selectedEmail ? (
          <div className="h-full flex flex-col">
            <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <button onClick={() => setSelectedEmailId(null)} className="md:hidden text-blue-600 font-bold text-sm">Back</button>
              <div className="hidden md:flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Archive size={18}/></button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Trash2 size={18}/></button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Reply size={16} /> Reply
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">{selectedEmail.subject}</h1>
              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-bold text-slate-700 border border-slate-200">
                  {selectedEmail.sender.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{selectedEmail.sender}</p>
                  <p className="text-xs text-slate-500">Monday, May 20 • 9:30 AM</p>
                </div>
              </div>
              <div className="text-slate-700 leading-relaxed text-base md:text-lg">
                {selectedEmail.body}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-50/20">
            <Mail size={48} strokeWidth={1.5} className="mb-4 opacity-50" />
            <p className="text-lg font-bold text-slate-500">Select an email to view</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Tab Switcher (Mobile Only) */}
      <div className="px-6 pt-4 pb-4 md:hidden border-b border-slate-100">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('mail')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'mail' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Email
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Desktop Navigation Overrides */}
      <div className="hidden md:flex px-8 pt-6 pb-2 border-b border-slate-100 bg-white items-center justify-between">
         <div className="flex gap-8">
           <button onClick={() => setActiveTab('mail')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'mail' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400'}`}>Email</button>
           <button onClick={() => setActiveTab('calendar')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'calendar' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400'}`}>Calendar</button>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Search mail..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none border border-slate-100 w-64" />
         </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'mail' ? MailView : (
          <div className="h-full overflow-y-auto p-4 md:p-8 bg-slate-50/30">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Upcoming Schedule</h2>
              {events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-6 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="w-16 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">{new Date(event.startTime).getDate()}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                        <Clock size={14} className="text-blue-500" />
                        <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                          <MapPin size={14} className="text-orange-500" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors shrink-0">Join Session</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutlookIntegration;
