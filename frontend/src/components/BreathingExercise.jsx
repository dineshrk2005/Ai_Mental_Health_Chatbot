import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BreathingExercise = () => {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
    const [seconds, setSeconds] = useState(4);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!active) return;

        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev === 1) {
                    // Transition phase
                    if (phase === 'inhale') {
                        setPhase('hold');
                        return 4;
                    } else if (phase === 'hold') {
                        setPhase('exhale');
                        return 4;
                    } else {
                        setPhase('inhale');
                        return 4;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [active, phase]);

    const getInstruction = () => {
        if (!active) return "Start Exercise";
        if (phase === 'inhale') return "Breathe In...";
        if (phase === 'hold') return "Hold...";
        if (phase === 'exhale') return "Breathe Out...";
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="font-semibold text-gray-800 mb-6 w-full">Box Breathing</h3>

            <div className="relative flex items-center justify-center mb-6">
                {/* Ripple circles */}
                {active && (
                    <>
                        <motion.div
                            className="absolute bg-indigo-100 rounded-full"
                            animate={{
                                scale: phase === 'inhale' ? 2.5 : (phase === 'hold' ? 2.5 : 1),
                                opacity: 0.5
                            }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                            style={{ width: 60, height: 60 }}
                        />
                        <motion.div
                            className="absolute bg-indigo-200 rounded-full"
                            animate={{
                                scale: phase === 'inhale' ? 1.8 : (phase === 'hold' ? 1.8 : 1),
                                opacity: 0.5
                            }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                            style={{ width: 60, height: 60 }}
                        />
                    </>
                )}

                <button
                    onClick={() => {
                        setActive(!active);
                        setPhase('inhale');
                        setSeconds(4);
                    }}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg ${active
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'
                        }`}
                >
                    {active ? seconds : 'START'}
                </button>
            </div>

            <p className="text-gray-600 font-medium">{getInstruction()}</p>
        </div>
    );
};

export default BreathingExercise;
