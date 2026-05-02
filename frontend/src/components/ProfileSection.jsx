import React, { useState } from 'react';
import { User, Award, CheckCircle, Edit2, Camera, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileSection = () => {
    const { user } = useAuth();
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState("I'm on a journey to improve my mental well-being and find balance in my daily life.\nI enjoy meditation, nature walks, and journaling.");
    const [profileImage, setProfileImage] = useState(null);
    const [goals, setGoals] = useState([
        { id: 1, label: "Meditate for 10 mins", completed: true },
        { id: 2, label: "Drink 2L of water", completed: false },
        { id: 3, label: "Sleep before 11 PM", completed: false },
        { id: 4, label: "Take a 15 min walk", completed: true }
    ]);
    const [newGoal, setNewGoal] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const toggleGoal = (id) => {
        setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const addGoal = (e) => {
        e.preventDefault();
        if (newGoal.trim()) {
            setGoals([...goals, { id: Date.now(), label: newGoal, completed: false }]);
            setNewGoal("");
        }
    };

    const removeGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-navy-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col md:flex-row items-center gap-8">
                <div className="relative group cursor-pointer">
                    <label htmlFor="profile-upload" className="cursor-pointer">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg" />
                        ) : (
                            <div className="w-32 h-32 bg-teal-900/30 rounded-full flex items-center justify-center text-4xl border-4 border-slate-700 shadow-lg text-teal-400 group-hover:bg-teal-900/50 transition">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </label>
                    <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                            <User size={20} className="text-teal-500" />
                            About Me
                        </h3>
                        <button 
                            onClick={() => setIsEditingAbout(!isEditingAbout)}
                            className="text-slate-400 hover:text-teal-400 transition"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                    
                    {isEditingAbout ? (
                        <div className="space-y-3">
                            <textarea
                                value={aboutText}
                                onChange={(e) => setAboutText(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-teal-500 min-h-[100px]"
                                placeholder="Tell us about yourself..."
                            />
                            <button 
                                onClick={() => setIsEditingAbout(false)}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {aboutText || "Click the edit icon to add something about yourself."}
                        </p>
                    )}
                </div>

                <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                    <h3 className="font-bold text-slate-200 text-lg mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-teal-500" />
                        Wellness Goals
                    </h3>
                    <div className="space-y-3 mb-4">
                        {goals.map(goal => (
                            <GoalItem 
                                key={goal.id} 
                                label={goal.label} 
                                completed={goal.completed} 
                                onToggle={() => toggleGoal(goal.id)}
                                onDelete={() => removeGoal(goal.id)}
                            />
                        ))}
                    </div>
                    <form onSubmit={addGoal} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newGoal} 
                            onChange={(e) => setNewGoal(e.target.value)} 
                            placeholder="Add a new goal..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                        />
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-colors">
                            <Plus size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const GoalItem = ({ label, completed, onToggle, onDelete }) => (
    <div className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors group">
        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={onToggle}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-teal-500 border-teal-500' : 'border-slate-500 group-hover:border-teal-400'}`}>
                {completed && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className={`${completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{label}</span>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete goal"
        >
            <Trash2 size={16} />
        </button>
    </div>
);

export default ProfileSection;
