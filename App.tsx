
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import NoteTaking from './components/NoteTaking';
import OutlookIntegration from './components/OutlookIntegration';
import AIAssistant from './components/AIAssistant';
import TabBar from './components/TabBar';
import Sidebar from './components/Sidebar';
import { AppView, Email, CalendarEvent, Note } from './types';
import { MOCK_EMAILS, MOCK_EVENTS, MOCK_NOTES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [emails] = useState<Email[]>(MOCK_EMAILS);
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard emails={emails} events={events} setView={setCurrentView} />;
      case 'notes':
        return <NoteTaking notes={notes} setNotes={setNotes} />;
      case 'outlook':
        return <OutlookIntegration emails={emails} events={events} />;
      case 'ai':
        return <AIAssistant emails={emails} calendar={events} notes={notes} />;
      default:
        return <Dashboard emails={emails} events={events} setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {!isMobile && <Sidebar currentView={currentView} setView={setCurrentView} />}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Responsive Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {isMobile && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">O</div>
            )}
            <h1 className="text-lg font-bold text-slate-800 capitalize">{currentView === 'ai' ? 'Gemini Assistant' : currentView}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Outlook Connected
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                AJ
             </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative w-full">
          {renderView()}
        </div>

        {isMobile && <TabBar currentView={currentView} setView={setCurrentView} />}
      </main>
    </div>
  );
};

export default App;
