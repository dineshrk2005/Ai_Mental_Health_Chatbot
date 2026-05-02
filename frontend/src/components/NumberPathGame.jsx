import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const NumberPathGame = () => {
    // A simplified 4x4 Zip style grid puzzle
    // 0 means empty, target is linking 1 to 16
    const [grid, setGrid] = useState(Array(16).fill(null));
    const [currentNum, setCurrentNum] = useState(1);
    const [path, setPath] = useState([]);

    const initialize = () => {
        setGrid(Array(16).fill(null));
        setCurrentNum(1);
        setPath([]);
    };

    const isAdjacent = (idx1, idx2) => {
        if (idx1 === null) return true;
        const r1 = Math.floor(idx1 / 4), c1 = idx1 % 4;
        const r2 = Math.floor(idx2 / 4), c2 = idx2 % 4;
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2);
    };

    const handleCellClick = (idx) => {
        if (grid[idx] !== null) return;
        
        const lastIdx = path.length > 0 ? path[path.length - 1] : null;
        if (isAdjacent(lastIdx, idx)) {
            const newGrid = [...grid];
            newGrid[idx] = currentNum;
            setGrid(newGrid);
            setPath([...path, idx]);
            setCurrentNum(currentNum + 1);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-6 max-w-sm">
                <h3 className="font-bold text-slate-800 text-lg">Number Path</h3>
                <button onClick={initialize} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-full transition">
                    <RefreshCw size={20} />
                </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">Connect numbers sequentially from 1 upwards by clicking adjacent squares.</p>

            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                {grid.map((val, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        className={`w-14 h-14 rounded-lg font-bold text-xl transition-all shadow-sm flex items-center justify-center ${
                            val !== null 
                            ? 'bg-indigo-500 text-white shadow-indigo-200' 
                            : 'bg-white text-slate-300 hover:bg-indigo-50 hover:text-indigo-300'
                        }`}
                        animate={val !== null ? { scale: [0.9, 1] } : {}}
                    >
                        {val}
                    </motion.button>
                ))}
            </div>
            
            {currentNum > 16 && (
                <div className="mt-6 text-indigo-600 font-bold bg-indigo-50 px-6 py-3 rounded-lg border border-indigo-200">
                    Path complete! 🌟
                </div>
            )}
        </div>
    );
};
export default NumberPathGame;
