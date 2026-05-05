import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';
import BreathingExercise from '../components/BreathingExercise';
import MoodChart from '../components/MoodChart';
import Journaling from '../components/Journaling';
import MeditationPlayer from '../components/MeditationPlayer';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProfileSection from '../components/ProfileSection';
import MemoryGame from '../components/MemoryGame';
import StepTracker from '../components/StepTracker';
import LocationFinder from '../components/LocationFinder';
import WellnessLibrary from '../components/WellnessLibrary';
import VoiceInput from '../components/VoiceInput';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [moodHistory, setMoodHistory] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState('English');

    const fetchMoodHistory = async () => {
        try {
            const { data } = await api.get('/moods');
            setMoodHistory(data);
        } catch (error) {
            console.error("Failed to fetch mood history");
        }
    };

    useEffect(() => {
        fetchMoodHistory();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                return <ChatInterface language={currentLanguage} />;
            case 'mood':
                return (
                    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-slate-200">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-teal-400">Mood Analytics</h2>
                            <p className="text-slate-400">Track your emotional well-being over time.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                        <LayoutDashboard className="w-5 h-5 text-teal-500" />
                                        Your Wellness Trend
                                    </h2>
                                    <span className="text-xs font-medium px-3 py-1 bg-slate-700 rounded-full text-slate-300">Last 7 Days</span>
                                </div>
                                <MoodChart data={moodHistory} />
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <MoodTracker onMoodLogged={fetchMoodHistory} />
                            </div>
                        </div>
                    </div>
                );
            case 'tools':
                return (
                    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-slate-200">
                        <header className="mb-4">
                            <h2 className="text-3xl font-bold text-teal-400">Wellness Tools</h2>
                            <p className="text-slate-400">Evidence-based techniques for mental clarity.</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Col */}
                            <div className="space-y-6">
                                <BreathingExercise />
                                <MeditationPlayer />
                                <StepTracker />
                            </div>

                            {/* Right Col */}
                            <div className="h-full">
                                <Journaling />
                            </div>
                        </div>

                        {/* New Library Section */}
                        <div className="pt-8 border-t border-slate-700/50">
                            <WellnessLibrary />
                        </div>
                    </div>
                );
            case 'relax':
                return (
                    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <header className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-teal-400 mb-2">Relax Your Mind</h2>
                            <p className="text-slate-400">Take a break with a calming memory game.</p>
                        </header>
                        <MemoryGame />
                    </div>
                );
            case 'voice':
                return (
                    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-teal-400">Voice Tone Detection</h2>
                            <p className="text-slate-400">Capture your voice and analyze emotional features like energy, pitch, and MFCC.</p>
                        </header>
                        <div className="max-w-2xl mx-auto">
                            <VoiceInput />
                        </div>
                    </div>
                );
            case 'profile':
                return <ProfileSection />;
            case 'crisis':
                return (
                    <div className="p-8 flex flex-col items-center justify-center h-full space-y-8 max-w-4xl mx-auto">
                        <div className="text-center space-y-4 w-full">
                            <h2 className="text-3xl font-bold text-red-500">Crisis Resources</h2>
                            <p className="text-slate-300">If you are in danger, please call emergency services immediately.</p>

                            <div className="grid md:grid-cols-2 gap-6 w-full mt-8">
                                <div className="bg-navy-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                                    <h3 className="text-xl font-bold text-white">Emergency Hotlines</h3>
                                    <div className="flex flex-col gap-3">
                                        <a href="tel:988" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 text-center transition-transform hover:scale-105">Call 988 (USA)</a>
                                        <a href="tel:14416" className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 text-center transition-transform hover:scale-105">Call 14416 (India)</a>
                                        <a href="tel:112" className="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold shadow-lg hover:bg-slate-600 text-center transition-transform hover:scale-105">Call 112 (Global)</a>
                                    </div>
                                </div>
                                <div className="h-full">
                                    <LocationFinder />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Work in progress...
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-navy-900 overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            
            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-300 ease-in-out flex`}>
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        setIsMobileMenuOpen(false);
                    }}
                    onLogout={handleLogout}
                    currentLanguage={currentLanguage}
                    onLanguageChange={setCurrentLanguage}
                />
            </div>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-navy-900 w-full md:w-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-teal-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <h1 className="text-xl font-bold text-white font-sans">Serenity AI</h1>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
