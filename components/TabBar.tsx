
import React from 'react';
import { LayoutDashboard, BookOpen, Mail, MessageSquare } from 'lucide-react';
import { AppView } from '../types';

interface TabBarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const TabBar: React.FC<TabBarProps> = ({ currentView, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Summary', icon: LayoutDashboard },
    { id: 'notes', label: 'Journal', icon: BookOpen },
    { id: 'outlook', label: 'Outlook', icon: Mail },
    { id: 'ai', label: 'Gemini', icon: MessageSquare },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 ios-blur bg-white/80 border-t border-slate-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
              currentView === tab.id ? 'text-blue-600 scale-110' : 'text-slate-400'
            }`}
          >
            <tab.icon size={22} strokeWidth={currentView === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
