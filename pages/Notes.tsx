import React, { useState } from 'react';
import { useTrip, Note } from '../context/TripContext';
import { motion } from 'motion/react';
import { BookOpen, Plus, Save, Calendar as CalendarIcon } from 'lucide-react';

export const Notes: React.FC = () => {
  const { activeTrip, saveNote } = useTrip();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  if (!activeTrip) return null;

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: ''
    };
    saveNote(newNote);
    setActiveNoteId(newNote.id);
    setNoteContent('');
  };

  const handleSave = () => {
    if (activeNoteId) {
      saveNote({
        id: activeNoteId,
        date: new Date().toISOString().split('T')[0],
        content: noteContent
      });
      setActiveNoteId(null);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#2A4D3A]">Trip Journal</h1>
          <p className="text-slate-500 mt-1">Document your adventures.</p>
        </div>
        <button 
          onClick={handleCreateNote}
          className="bg-[#2A4D3A] text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-[#1f382a] transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Notes List */}
        <div className="col-span-1 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm overflow-y-auto max-h-[600px] space-y-3">
          {activeTrip.notes.map((note) => (
            <div 
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                setNoteContent(note.content);
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                activeNoteId === note.id 
                  ? 'bg-[#FDFBF7] border-[#F5B041] shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-[#2A4D3A]/30'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                <CalendarIcon size={14} />
                <span>{new Date(note.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-700 text-sm line-clamp-3 leading-relaxed">
                {note.content || 'Empty note...'}
              </p>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeNoteId || 'empty'}
          className="col-span-1 md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
        >
          {activeNoteId ? (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#FDFBF7]">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <BookOpen size={18} className="text-[#2A4D3A]" />
                  <span>Editing Note</span>
                </div>
                <button 
                  onClick={handleSave}
                  className="text-[#2A4D3A] font-bold flex items-center gap-1 hover:text-[#F5B041] transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 w-full p-6 text-slate-800 resize-none focus:outline-none focus:ring-0 text-lg leading-relaxed bg-transparent"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <BookOpen size={48} className="mb-4 text-slate-200" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">Select a note</h3>
              <p>Choose a note from the list or create a new one to start writing.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
