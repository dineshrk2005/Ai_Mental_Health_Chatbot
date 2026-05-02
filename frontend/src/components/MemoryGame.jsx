import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueensGame from './QueensGame';
import NumberPathGame from './NumberPathGame';

const MemoryGame = () => {
    // We repurpose "MemoryGame" into a generalized "Mindful Games Hub" since the user's nav points to relax/MemoryGame
    const [activeGame, setActiveGame] = useState('queens');

    return (
        <div className="glass-card flex flex-col w-full max-w-2xl mx-auto min-h-[500px]">
            <div className="flex border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveGame('queens')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeGame === 'queens' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    👑 Logic Queens
                </button>
                <button 
                    onClick={() => setActiveGame('path')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeGame === 'path' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    🧩 Number Path
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {activeGame === 'queens' && (
                        <motion.div 
                            key="queens"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <QueensGame />
                        </motion.div>
                    )}
                    {activeGame === 'path' && (
                        <motion.div 
                            key="path"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <NumberPathGame />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemoryGame;
