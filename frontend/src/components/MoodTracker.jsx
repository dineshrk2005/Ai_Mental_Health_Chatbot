import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Save } from 'lucide-react';
import api from '../utils/api';

const MoodTracker = ({ onMoodLogged }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const moods = [
        { score: 1, label: 'Very Sad', icon: Frown, color: 'text-red-500 bg-red-50' },
        { score: 2, label: 'Sad', icon: Frown, color: 'text-orange-500 bg-orange-50' },
        { score: 3, label: 'Neutral', icon: Meh, color: 'text-yellow-500 bg-yellow-50' },
        { score: 4, label: 'Good', icon: Smile, color: 'text-green-500 bg-green-50' },
        { score: 5, label: 'Amazing', icon: Smile, color: 'text-emerald-500 bg-emerald-50' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMood) return;

        setLoading(true);
        try {
            await api.post('/moods', {
                score: selectedMood.score,
                emotion: selectedMood.label,
                note
            });
            setSelectedMood(null);
            setNote('');
            if (onMoodLogged) onMoodLogged();
        } catch (error) {
            console.error("Failed to log mood", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">How are you feeling?</h3>

            <div className="flex justify-between gap-2 mb-6">
                {moods.map((mood) => (
                    <button
                        key={mood.score}
                        onClick={() => setSelectedMood(mood)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${selectedMood?.score === mood.score
                                ? 'ring-2 ring-indigo-500 scale-105 shadow-md bg-white'
                                : 'hover:bg-gray-50 opacity-70 hover:opacity-100'
                            }`}
                        type="button"
                    >
                        <mood.icon className={`w-8 h-8 ${mood.color.split(' ')[0]}`} />
                    </button>
                ))}
            </div>

            {selectedMood && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                >
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's making you feel this way? (Optional)"
                        className="w-full p-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                        rows="3"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        {loading ? 'Saving...' : <><Save size={16} /> Log Mood</>}
                    </button>
                </motion.form>
            )}
        </div>
    );
};

export default MoodTracker;
