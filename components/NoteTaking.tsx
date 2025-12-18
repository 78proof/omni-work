
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Trash2, Plus, Search, Tag, FileText, ChevronLeft, MoreVertical } from 'lucide-react';
import { Note } from '../types';
import { GeminiService } from '../services/geminiService';

interface NoteTakingProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const NoteTaking: React.FC<NoteTakingProps> = ({ notes, setNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(window.innerWidth >= 768 ? (notes[0]?.id || null) : null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/pcm' });
        await handleTranscription(audioBlob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is required for voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const gemini = new GeminiService();
        const transcription = await gemini.transcribeAudio(base64Audio);
        const newNote: Note = {
          id: Date.now().toString(),
          title: `Voice Meeting - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          content: transcription || "",
          timestamp: Date.now(),
          tags: ['voice']
        };
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
      };
    } finally {
      setTranscribing(false);
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      timestamp: Date.now(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    setSelectedNoteId(window.innerWidth >= 768 ? (updated[0]?.id || null) : null);
  };

  const ListView = (
    <div className={`flex flex-col h-full bg-white border-r border-slate-200 ${selectedNoteId && 'hidden md:flex'} md:w-80 shrink-0`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Journal</h3>
          <button onClick={createNewNote} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search entries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-24 md:pb-4">
        {filteredNotes.map(note => (
          <button
            key={note.id}
            onClick={() => setSelectedNoteId(note.id)}
            className={`w-full text-left p-4 rounded-2xl transition-all ${
              selectedNoteId === note.id ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-bold truncate pr-2 ${selectedNoteId === note.id ? 'text-blue-700' : 'text-slate-800'}`}>
                {note.title || 'Untitled Note'}
              </span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {new Date(note.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{note.content || 'Empty entry...'}</p>
          </button>
        ))}
      </div>

      {/* Recording Trigger */}
      <div className="p-4 border-t border-slate-50 flex justify-center md:hidden">
        <button
          onClick={startRecording}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all"
        >
          <Mic size={24} />
        </button>
      </div>
    </div>
  );

  const EditorView = (
    <div className={`flex-1 flex flex-col bg-white overflow-hidden ${!selectedNoteId && 'hidden md:flex'}`}>
      {selectedNote ? (
        <>
          <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSelectedNoteId(null)} className="md:hidden text-blue-600 p-1">
                <ChevronLeft size={24} />
              </button>
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                className="text-xl font-bold text-slate-900 bg-transparent border-none focus:outline-none truncate w-full"
                placeholder="Entry Title"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={isRecording ? stopRecording : startRecording} className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-50 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-50'}`}>
                {isRecording ? <Square fill="currentColor" size={20} /> : <Mic size={20} />}
              </button>
              <button onClick={() => deleteNote(selectedNote.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </header>
          <div className="flex-1 p-6 overflow-y-auto">
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              className="w-full h-full resize-none bg-transparent border-none focus:outline-none text-slate-700 leading-relaxed text-lg placeholder:text-slate-300"
              placeholder="What's on your mind? Record voice to let Gemini transcribe..."
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
             <FileText size={32} strokeWidth={1.5} className="text-slate-300" />
          </div>
          <p className="text-lg font-bold text-slate-600">Select a journal entry</p>
          <p className="text-sm max-w-xs mt-1">Pick an item from the list or start a new record to capture your thoughts.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {ListView}
      {EditorView}
      {transcribing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center">
           <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-6 max-w-sm animate-in zoom-in duration-300">
             <div className="w-14 h-14 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <div className="space-y-2">
               <p className="text-xl font-bold text-slate-900">Gemini is writing...</p>
               <p className="text-sm text-slate-500 leading-relaxed">Transcribing audio and generating a structured summary for your journal.</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NoteTaking;
