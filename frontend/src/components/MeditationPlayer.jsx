import React, { useState, useRef } from 'react';
import { Play, Pause, Music, Volume2 } from 'lucide-react';

const MeditationPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);


    const [currentSound, setCurrentSound] = useState('rain');
    const audioRef = useRef(null);

    const SOUNDS = {
        rain: {
            name: 'Gentle Rain',
            url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' // Placeholder rain
        },
        forest: {
            name: 'Forest Birds',
            // Using a different placeholder for forest
            url: 'https://cdn.pixabay.com/audio/2021/09/06/audio_9b46be68e5.mp3'
        },
        noise: {
            name: 'White Noise',
            // Using a different placeholder
            url: 'https://cdn.pixabay.com/audio/2022/11/04/audio_c36c4b26f5.mp3'
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const changeSound = (soundKey) => {
        setCurrentSound(soundKey);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = SOUNDS[soundKey].url;
            // Auto play on switch if desired, or let user press play
            audioRef.current.load();
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden relative">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-50" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                        <Music size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Soundscape</h3>
                        <p className="text-xs text-gray-500">{SOUNDS[currentSound].name} • Continuous</p>
                    </div>
                </div>
                {isPlaying && (
                    <div className="flex items-end gap-1 h-5">
                        <span className="w-1 bg-teal-400 animate-[bounce_1s_infinite] h-2"></span>
                        <span className="w-1 bg-teal-400 animate-[bounce_1.2s_infinite] h-4"></span>
                        <span className="w-1 bg-teal-400 animate-[bounce_0.8s_infinite] h-3"></span>
                        <span className="w-1 bg-teal-400 animate-[bounce_1.1s_infinite] h-5"></span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 justify-center mb-6 z-10">
                {['rain', 'forest', 'noise'].map((key) => (
                    <button
                        key={key}
                        onClick={() => changeSound(key)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${currentSound === key
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300'
                            }`}
                    >
                        {key === 'rain' ? 'Rain' : key === 'forest' ? 'Forest' : 'Noise'}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center py-2 relative z-10">
                <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-200 transition-all hover:scale-105"
                >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
            </div>

            <audio ref={audioRef} src={SOUNDS[currentSound].url} loop />
        </div>
    );
};

export default MeditationPlayer;
