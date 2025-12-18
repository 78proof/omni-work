
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Trash2, Plus, Search, Tag, FileText, ChevronLeft } from 'lucide-react';
import { Note } from '../types';
import { GeminiService } from '../services/geminiService';

interface NoteTakingProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const NoteTaking: React.FC<NoteTakingProps> = ({ notes, setNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      console.error("Microphone error:", err);
      alert("Please allow microphone access to use voice notes.");
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
          title: `Voice Note - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          content: transcription || "No content generated.",
          timestamp: Date.now(),
          tags: ['voice']
        };
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
      };
    } catch (error) {
      console.error("Transcription failed", error);
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
    setSelectedNoteId(null);
  };

  // List View
  if (!selectedNoteId) {
    return (
      <div className="h-full bg-white flex flex-col pb-20">
        <header className="px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Journal</h2>
          <button onClick={createNewNote} className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Plus size={24} />
          </button>
        </header>

        <div className="p-4 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pt-2">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className="w-full text-left p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-slate-800 truncate pr-2">
                  {note.title || 'Untitled Note'}
                </span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(note.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{note.content || 'No text content yet...'}</p>
            </button>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>Your journal is empty.</p>
            </div>
          )}
        </div>

        {/* Floating Record Button for List View */}
        <div className="fixed bottom-24 right-6">
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition-all"
          >
            <Mic size={28} />
          </button>
        </div>
        
        {transcribing && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-blue-600 font-bold">Gemini is writing your meeting summary...</p>
          </div>
        )}
      </div>
    );
  }

  // Editor View
  return (
    <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300 pb-20">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
        <button onClick={() => setSelectedNoteId(null)} className="flex items-center gap-1 text-blue-600 font-medium">
          <ChevronLeft size={20} /> Journal
        </button>
        <button onClick={() => deleteNote(selectedNote!.id)} className="p-2 text-slate-400 hover:text-red-500">
          <Trash2 size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <input
          type="text"
          value={selectedNote?.title}
          onChange={(e) => updateNote(selectedNote!.id, { title: e.target.value })}
          className="text-2xl font-bold text-slate-900 bg-transparent border-none focus:outline-none mb-4"
          placeholder="Untitled Note"
        />
        <textarea
          value={selectedNote?.content}
          onChange={(e) => updateNote(selectedNote!.id, { content: e.target.value })}
          className="flex-1 w-full resize-none bg-transparent border-none focus:outline-none text-slate-700 leading-relaxed text-base"
          placeholder="Start writing or record a voice note..."
        />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
         <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
            }`}
          >
            {isRecording ? <Square fill="white" size={20} /> : <Mic size={24} />}
          </button>
      </div>
    </div>
  );
};

export default NoteTaking;
