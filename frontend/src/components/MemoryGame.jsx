import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const CARDS = [
    { id: 1, content: '🌿' },
    { id: 2, content: '🌸' },
    { id: 3, content: '🌊' },
    { id: 4, content: '☀️' },
    { id: 5, content: '🌙' },
    { id: 6, content: '⭐' },
];

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);

    const initializeGame = () => {
        const duplicated = [...CARDS, ...CARDS];
        const shuffled = duplicated.sort(() => Math.random() - 0.5).map((card, index) => ({ ...card, uniqueId: index }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setWon(false);
        setDisabled(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(cards.find(c => c.uniqueId === id).id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([...flipped, id]);
            const firstCard = cards.find(c => c.uniqueId === flipped[0]);
            const secondCard = cards.find(c => c.uniqueId === id);

            if (firstCard.id === secondCard.id) {
                setSolved([...solved, firstCard.id]);
                setFlipped([]);
                setDisabled(false);
                if (solved.length + 1 === CARDS.length) setWon(true);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center">
            <div className="flex justify-between w-full mb-6">
                <h3 className="font-bold text-slate-200 text-lg">Relax Mind</h3>
                <button onClick={initializeGame} className="text-teal-400 hover:text-teal-300 bg-slate-700/50 p-2 rounded-full hover:bg-slate-700 transition">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
                {cards.map((card) => (
                    <motion.div
                        key={card.uniqueId}
                        className={`aspect-square rounded-xl cursor-pointer text-2xl flex items-center justify-center transition-all ${flipped.includes(card.uniqueId) || solved.includes(card.id)
                                ? 'bg-teal-900/50 border-2 border-teal-500 shadow-teal-500/20 shadow-md'
                                : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                            }`}
                        onClick={() => handleClick(card.uniqueId)}
                        animate={{ rotateY: flipped.includes(card.uniqueId) || solved.includes(card.id) ? 180 : 0 }}
                    >
                        {(flipped.includes(card.uniqueId) || solved.includes(card.id)) && (
                            <span className="transform rotate-180 inline-block">{card.content}</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {won && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-teal-300 font-bold bg-teal-900/30 px-6 py-3 rounded-lg border border-teal-500/30"
                >
                    Peace found! 🌿
                </motion.div>
            )}
        </div>
    );
};

export default MemoryGame;
