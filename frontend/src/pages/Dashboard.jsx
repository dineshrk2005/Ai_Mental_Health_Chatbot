import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';
import BreathingExercise from '../components/BreathingExercise';
import MoodChart from '../components/MoodChart';
import Journaling from '../components/Journaling';
import MeditationPlayer from '../components/MeditationPlayer';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProfileSection from '../components/ProfileSection';
import MemoryGame from '../components/MemoryGame';
import StepTracker from '../components/StepTracker';
import LocationFinder from '../components/LocationFinder';
import WellnessLibrary from '../components/WellnessLibrary';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');
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
        <div className="flex h-screen bg-navy-900 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
            />
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-navy-900">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
