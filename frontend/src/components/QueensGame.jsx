import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const QueensGame = () => {
    // 5x5 queens logic game simplified
    const size = 5;
    const [board, setBoard] = useState(Array(size * size).fill(false));
    
    // Regions map
    const regions = [
        0, 0, 1, 1, 1,
        0, 2, 2, 1, 3,
        0, 2, 2, 3, 3,
        4, 4, 2, 3, 3,
        4, 4, 4, 4, 3
    ];
    
    const regionColors = ['bg-orange-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'];

    const toggleQueen = (idx) => {
        const newBoard = [...board];
        newBoard[idx] = !newBoard[idx];
        setBoard(newBoard);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-6 max-w-sm">
                <h3 className="font-bold text-slate-800 text-lg">Logic Queens</h3>
                <button onClick={() => setBoard(Array(size * size).fill(false))} className="text-purple-500 hover:bg-purple-50 p-2 rounded-full transition">
                    <RefreshCw size={20} />
                </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">Place one Queen in each colored region, row, and column without them sharing a diagonal.</p>

            <div className="grid grid-cols-5 gap-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                {board.map((isQueen, idx) => (
                    <motion.div
                        key={idx}
                        onClick={() => toggleQueen(idx)}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-colors border border-transparent hover:border-black/20 ${regionColors[regions[idx]]}`}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isQueen && <span className="text-3xl drop-shadow-md">👑</span>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
export default QueensGame;
