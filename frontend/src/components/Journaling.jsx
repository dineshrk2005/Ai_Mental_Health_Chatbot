import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Calendar } from 'lucide-react';

const Journaling = () => {
    const [entry, setEntry] = useState('');
    const [savedEntries, setSavedEntries] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('journal_entries') || '[]');
        setSavedEntries(saved);
    }, []);

    const saveEntry = () => {
        if (!entry.trim()) return;
        const newEntry = {
            id: Date.now(),
            text: entry,
            date: new Date().toLocaleDateString()
        };
        const updated = [newEntry, ...savedEntries];
        setSavedEntries(updated);
        localStorage.setItem('journal_entries', JSON.stringify(updated));
        setEntry('');
    };

    const deleteEntry = (id) => {
        const updated = savedEntries.filter(e => e.id !== id);
        setSavedEntries(updated);
        localStorage.setItem('journal_entries', JSON.stringify(updated));
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <PenTool size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Daily Journal</h3>
            </div>

            <textarea
                className="w-full flex-1 p-4 bg-gray-50 rounded-xl border-none resize-none focus:ring-2 focus:ring-indigo-100 outline-none text-gray-700 placeholder:text-gray-400 mb-4"
                placeholder="Write your thoughts here... How are you feeling today?"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
            />

            <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-slate-400">{entry.length} chars</span>
                <button
                    onClick={saveEntry}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Save size={16} />
                    Save Entry
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
                {savedEntries.map(e => (
                    <div key={e.id} className="p-3 bg-slate-50 rounded-xl group relative">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <Calendar size={12} />
                            {e.date}
                        </div>
                        <p className="text-sm text-slate-700">{e.text}</p>
                        <button
                            onClick={() => deleteEntry(e.id)}
                            className="absolute top-2 right-2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                {savedEntries.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-4">No entries yet. Start writing!</p>
                )}
            </div>
        </div>
    );
};

export default Journaling;
