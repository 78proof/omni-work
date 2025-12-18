
import React, { useState } from 'react';
import { Mail, Calendar, Search, Star, Filter, Lock, ExternalLink, ChevronRight, Inbox, Clock, MapPin } from 'lucide-react';
import { Email, CalendarEvent } from '../types';

interface OutlookProps {
  emails: Email[];
  events: CalendarEvent[];
}

const OutlookIntegration: React.FC<OutlookProps> = ({ emails, events }) => {
  const [activeTab, setActiveTab] = useState<'mail' | 'calendar'>('mail');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  if (!isConnected) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0078d4] mb-6 shadow-sm">
          <Mail size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Outlook</h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          Sync your work emails and calendar to let Gemini help you manage your day.
        </p>
        <button 
          onClick={() => setIsConnected(true)}
          className="w-full max-w-xs py-4 bg-[#0078d4] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-[#006cc0] active:scale-95 transition-all"
        >
          <Lock size={18} /> Sign in with Microsoft
        </button>
        <p className="text-[10px] text-slate-400 mt-6 flex items-center gap-1 justify-center">
          Secure connection powered by Microsoft Graph <ExternalLink size={10} />
        </p>
      </div>
    );
  }

  if (selectedEmail) {
    return (
      <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300 pb-20">
        <header className="px-6 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 bg-white">
          <button onClick={() => setSelectedEmail(null)} className="text-blue-600 font-medium">Back</button>
          <h2 className="flex-1 text-center font-bold text-slate-800 truncate px-4">Email</h2>
          <div className="w-10"></div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-4">{selectedEmail.subject}</h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
              {selectedEmail.sender.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{selectedEmail.sender}</p>
              <p className="text-xs text-slate-400">{new Date(selectedEmail.receivedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
            {selectedEmail.body}
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700">Reply</button>
          <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700">Forward</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Outlook</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('mail')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'mail' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Mail
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'mail' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {emails.map(email => (
            <div 
              key={email.id} 
              onClick={() => setSelectedEmail(email)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 active:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                {email.sender.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-sm font-bold text-slate-900 truncate">{email.sender}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {email.isImportant && <Star size={10} className="text-orange-400 fill-orange-400" />}
                  <p className="text-xs font-semibold text-slate-700 truncate">{email.subject}</p>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{email.body}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 mt-1" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {events.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
              <div className="w-12 text-center flex flex-col justify-center border-r border-slate-100 pr-4">
                <p className="text-lg font-bold text-slate-900 leading-none">{new Date(event.startTime).getDate()}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-1">{event.title}</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock size={12} />
                    <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin size={12} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="self-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">Join</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutlookIntegration;
