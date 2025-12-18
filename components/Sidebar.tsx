
import React from 'react';
import { LayoutDashboard, BookOpen, Mail, MessageSquare, Settings, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Work Journal', icon: BookOpen },
    { id: 'outlook', label: 'Outlook Hub', icon: Mail },
    { id: 'ai', label: 'Gemini AI', icon: MessageSquare },
  ] as const;

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">OmniWork</h1>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all text-sm font-medium">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
