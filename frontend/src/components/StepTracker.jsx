import React, { useState } from 'react';
import { Footprints } from 'lucide-react';

const StepTracker = () => {
    const [steps, setSteps] = useState(0);
    const GOAL = 10000;
    const progress = Math.min((steps / GOAL) * 100, 100);
    const circumference = 2 * Math.PI * 40; // r=40
    const dashoffset = circumference - (progress / 100) * circumference;

    const addSteps = (amount) => {
        setSteps(prev => Math.min(prev + amount, GOAL * 1.5));
    };

    return (
        <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center">
            <h3 className="font-bold text-slate-200 text-lg mb-6 w-full flex items-center gap-2">
                <Footprints size={20} className="text-teal-500" />
                Step Tracker
            </h3>

            <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-700"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        className="text-teal-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-100">{steps.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/ {GOAL.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex gap-2 w-full">
                <button
                    onClick={() => addSteps(500)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-teal-900/30 text-slate-300 hover:text-teal-400 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-teal-500/30"
                >
                    +500
                </button>
                <button
                    onClick={() => addSteps(1000)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-teal-900/30 text-slate-300 hover:text-teal-400 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-teal-500/30"
                >
                    +1k
                </button>
            </div>
        </div>
    );
};

export default StepTracker;
