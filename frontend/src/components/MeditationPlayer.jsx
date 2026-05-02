import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Volume2, Search, Loader2 } from 'lucide-react';
import api from '../utils/api';

const MeditationPlayer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTrackCode, setCurrentTrackCode] = useState(null);

    const presetPlaylists = [
        { id: '37i9dQZF1DWZqd5JICZI0u', name: 'Peaceful Meditation' },
        { id: '37i9dQZF1DX4sWSpwq3LiO', name: 'Peaceful Piano' },
        { id: '37i9dQZF1DX8ymr6UES7vc', name: 'Rain Sounds' }
    ];

    const [activePlaylist, setActivePlaylist] = useState(presetPlaylists[0].id);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/spotify/search?q=${encodeURIComponent(searchQuery)}`);
            setTracks(data);
            setCurrentTrackCode(null);
        } catch (error) {
            console.error('Failed to search Spotify', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-50" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                    <Music size={24} />
                </div>
                <div>
                    <h3 className="font-bold var(--color-slate-800)">Music Therapy</h3>
                    <p className="text-xs var(--color-slate-500)">Powered by Spotify</p>
                </div>
            </div>

            <div className="flex gap-2 justify-start mb-6 z-10 overflow-x-auto pb-2">
                {presetPlaylists.map((pl) => (
                    <button
                        key={pl.id}
                        onClick={() => {
                            setActivePlaylist(pl.id);
                            setCurrentTrackCode(null);
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition-all whitespace-nowrap ${
                            activePlaylist === pl.id && !currentTrackCode
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                        {pl.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className="mb-4 relative z-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for a song or artist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
            </form>

            <div className="flex-1 flex flex-col relative z-10">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                ) : tracks.length > 0 && !currentTrackCode ? (
                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] mb-4 pr-2">
                        {tracks.map((track) => (
                            <div 
                                key={track.id}
                                onClick={() => setCurrentTrackCode(track.id)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors border border-transparent hover:border-indigo-100"
                            >
                                <img src={track.album.images[2]?.url} alt="" className="w-10 h-10 rounded shadow-sm" />
                                <div className="flex-1 truncate">
                                    <h4 className="text-sm font-semibold truncate text-gray-800">{track.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{track.artists.map(a => a.name).join(', ')}</p>
                                </div>
                                <Play size={16} className="text-indigo-400 opacity-50" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 rounded-xl overflow-hidden bg-[#121212] shadow-inner mt-2">
                        <iframe
                            src={`https://open.spotify.com/embed/${currentTrackCode ? `track/${currentTrackCode}` : `playlist/${activePlaylist}`}?utm_source=generator&theme=0`}
                            width="100%"
                            height="152"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="border-none w-full"
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeditationPlayer;
