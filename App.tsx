
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import NoteTaking from './components/NoteTaking';
import OutlookIntegration from './components/OutlookIntegration';
import AIAssistant from './components/AIAssistant';
import TabBar from './components/TabBar';
import { AppView, Email, CalendarEvent, Note } from './types';
import { MOCK_EMAILS, MOCK_EVENTS, MOCK_NOTES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [emails] = useState<Email[]>(MOCK_EMAILS);
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);

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
    <div className="flex flex-col h-full w-full bg-[#F2F2F7] text-slate-900 overflow-hidden relative">
      <div className="flex-1 overflow-hidden relative w-full h-full">
        {renderView()}
      </div>
      <TabBar currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
