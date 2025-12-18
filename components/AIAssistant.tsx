
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Email, CalendarEvent, Note, ChatMessage } from '../types';

interface AIAssistantProps {
  emails: Email[];
  calendar: CalendarEvent[];
  notes: Note[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ emails, calendar, notes }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello Alex! I'm your OmniWork Assistant. I have context on your emails, calendar, and notes. How can I help you be productive today?", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const gemini = new GeminiService();
      const response = await gemini.chat(input, { emails, calendar, notes });
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: response || "I'm sorry, I couldn't process that request.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! Something went wrong while connecting to Gemini. Please check your connection.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Sparkles size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-white border border-indigo-100 text-slate-800' 
                  : 'bg-indigo-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-2 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-indigo-200'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div className="bg-white border border-indigo-100 p-5 rounded-3xl shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={18} />
                <span className="text-sm text-slate-500">Gemini is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto flex gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your meetings, emails, or summarize a note..."
              className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-wider font-bold">
            Powered by Gemini 3 Flash
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
