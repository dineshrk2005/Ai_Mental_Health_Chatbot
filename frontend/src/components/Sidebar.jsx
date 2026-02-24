import React from 'react';
import { MessageCircle, BarChart2, BookOpen, User, Shield, Globe, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, onLogout, currentLanguage, onLanguageChange }) => {
    const [showLangMenu, setShowLangMenu] = React.useState(false);

    const languages = [
        'English', 'Tamil', 'Hindi', 'Spanish', 'French', 'German',
        'Chinese', 'Japanese', 'Korean', 'Arabic', 'Portuguese',
        'Italian', 'Russian', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 flex-shrink-0 transition-all duration-300">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-10 px-2 mt-2">
                <div className="text-teal-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-teal-400"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold font-sans">Serenity AI</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <NavItem
                    icon={<MessageCircle size={20} />}
                    label="Companion Chat"
                    active={activeTab === 'chat'}
                    onClick={() => onTabChange('chat')}
                />
                <NavItem
                    icon={<BarChart2 size={20} />}
                    label="Mood Analytics"
                    active={activeTab === 'mood'}
                    onClick={() => onTabChange('mood')}
                />
                <NavItem
                    icon={<BookOpen size={20} />}
                    label="Wellness Tools"
                    active={activeTab === 'tools'}
                    onClick={() => onTabChange('tools')}
                />
                <NavItem
                    icon={<span className="text-xl">🧩</span>} // Using emoji or icon for game
                    label="Relax Mind"
                    active={activeTab === 'relax'}
                    onClick={() => onTabChange('relax')}
                />
                <NavItem
                    icon={<User size={20} />}
                    label="Profile"
                    active={activeTab === 'profile'}
                    onClick={() => onTabChange('profile')}
                />
                <NavItem
                    icon={<Shield size={20} />}
                    label="Crisis Resources"
                    active={activeTab === 'crisis'}
                    onClick={() => onTabChange('crisis')}
                />
            </nav>

            {/* Footer Controls */}
            <div className="mt-auto space-y-4 pt-4 border-t border-slate-800">
                <div className="relative">
                    <div
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="bg-slate-800 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Globe size={16} />
                            <span>{currentLanguage || 'English'}</span>
                        </div>
                        <span className="text-xs text-slate-500">▼</span>
                    </div>

                    {showLangMenu && (
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 z-50">
                            {languages.map(lang => (
                                <div
                                    key={lang}
                                    onClick={() => {
                                        onLanguageChange(lang);
                                        setShowLangMenu(false);
                                    }}
                                    className={`px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer ${currentLanguage === lang ? 'text-teal-400 font-medium' : 'text-slate-300'}`}
                                >
                                    {lang}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 px-2 text-sm w-full transition">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50 font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
};

export default Sidebar;
