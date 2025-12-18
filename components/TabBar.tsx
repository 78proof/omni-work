
import React from 'react';
import { LayoutDashboard, BookOpen, Mail, MessageSquare } from 'lucide-react';
import { AppView } from '../types';

interface TabBarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const TabBar: React.FC<TabBarProps> = ({ currentView, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'notes', label: 'Journal', icon: BookOpen },
    { id: 'outlook', label: 'Outlook', icon: Mail },
    { id: 'ai', label: 'Gemini', icon: MessageSquare },
  ] as const;

  return (
    <nav className="ios-blur bg-white/85 border-t border-slate-200/50 safe-area-bottom w-full shrink-0">
      <div className="flex justify-around items-center pt-3 pb-2">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center gap-1 flex-1 transition-all active:scale-90 touch-manipulation ${
                isActive ? 'text-[#007AFF]' : 'text-[#8E8E93]'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
