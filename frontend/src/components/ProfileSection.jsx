import React from 'react';
import { User, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileSection = () => {
    const { user } = useAuth();

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-navy-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="w-32 h-32 bg-teal-900/30 rounded-full flex items-center justify-center text-4xl border-4 border-slate-700 shadow-lg text-teal-400">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-teal-500 w-6 h-6 rounded-full border-2 border-navy-800"></div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-bold text-slate-100">{user?.name || 'User Name'}</h2>
                    <p className="text-slate-400 mb-4">{user?.email || 'user@example.com'}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-lg flex items-center gap-2 border border-orange-500/20">
                            <span className="text-xl">🔥</span>
                            <span className="font-bold">5 Day Streak</span>
                        </div>
                        <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 border border-blue-500/20">
                            <Award size={18} />
                            <span className="font-bold">Level 3 Explorer</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                    <h3 className="font-bold text-slate-200 text-lg mb-4 flex items-center gap-2">
                        <User size={20} className="text-teal-500" />
                        About Me
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        I'm on a journey to improve my mental well-being and find balance in my daily life.
                        I enjoy meditation, nature walks, and journaling.
                    </p>
                </div>

                <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                    <h3 className="font-bold text-slate-200 text-lg mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-teal-500" />
                        Wellness Goals
                    </h3>
                    <div className="space-y-3">
                        <GoalItem label="Meditate for 10 mins" completed={true} />
                        <GoalItem label="Drink 2L of water" completed={false} />
                        <GoalItem label="Sleep before 11 PM" completed={false} />
                        <GoalItem label="Take a 15 min walk" completed={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const GoalItem = ({ label, completed }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer group">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-teal-500 border-teal-500' : 'border-slate-500 group-hover:border-teal-400'}`}>
            {completed && <CheckCircle size={12} className="text-white" />}
        </div>
        <span className={`${completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{label}</span>
    </div>
);

export default ProfileSection;
