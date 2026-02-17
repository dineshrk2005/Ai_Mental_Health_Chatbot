import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import CrisisModal from './CrisisModal';


const ChatInterface = ({ language = 'English' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const messagesEndRef = useRef(null);

    // Map user-friendly language names to BCP-47 codes for Speech API
    const langMap = {
        'English': 'en-US',
        'Tamil': 'ta-IN',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Hindi': 'hi-IN'
    };
    const userLang = langMap[language] || 'en-US';

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/chat');
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to fetch history");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Voice Input Handler
    const toggleListening = () => {
        if (!recognition) {
            alert("Your browser does not support voice input. Try Chrome.");
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.lang = userLang;
            recognition.start();
            setIsListening(true);
        }
    };

    if (recognition) {
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };
        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            setIsListening(false);
        };
    }

    // Text to Speech
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speaking
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = userLang;
            utterance.rate = 0.9; // Slightly slower, more calming
            utterance.pitch = 1.0;

            // Try to select a "Google" voice if available for better quality
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes(userLang) && v.name.includes('Google'));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempMessage = {
            _id: Date.now(),
            message: input,
            sender: 'user',
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', {
                message: tempMessage.message,
                language: language
            });

            // New API structure: { userMessage, aiMessage, analysis }
            const { aiMessage, analysis } = data;

            setMessages(prev => prev.map(msg => msg._id === tempMessage._id ? data.userMessage : msg).concat(aiMessage));

            // Handle Crisis
            if (analysis && analysis.isCrisis) {
                setShowCrisisModal(true);
            }

            // Read out loud automatically
            speakText(aiMessage.message);

        } catch (error) {
            console.error("Failed to send message", error);
            // Fallback UI update if needed
            const errorMessage = {
                _id: Date.now() + 1,
                message: "I'm having trouble connecting right now. Please try again.",
                sender: 'system'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const WelcomeScreen = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-teal-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.28 3.6-1.69 3.6-4.96C22.6 5.11 19.5 2 16 2c-1.54 0-3.04.51-4.16 1.48C10.64 2.51 9.14 2 7.6 2 4.1 2 1 5.11 1 9.04c0 3.27 2.11 3.68 3.6 4.96.06.05.12.09.18.14L12 21.61l7.22-7.47c.06-.05.12-.09.18-.14z" />
                </svg>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-light text-slate-700">Hello friend. I'm Serenity.</h2>
                <p className="text-slate-400 max-w-sm">
                    I can listen and talk. Tap code microphone to talk.
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Main Chat Area */}
            <div className="flex-1 overflow-y-auto relative">
                {messages.length === 0 ? (
                    <WelcomeScreen />
                ) : (
                    <div className="p-6 space-y-6 max-w-4xl mx-auto pt-10">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg._id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`px-6 py-4 rounded-2xl max-w-[80%] text-[15px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-teal-600 text-white rounded-br-sm'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-slate-100'
                                        }`}
                                >
                                    {msg.message}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 max-w-4xl mx-auto w-full">
                <form
                    onSubmit={handleSend}
                    className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-full p-2 px-4 focus-within:ring-2 focus-within:ring-teal-100 transition-all"
                >
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-2 transition-colors rounded-full ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50'}`}
                    >
                        <Mic size={20} />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type or speak..."}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
                    />

                    <div className="flex items-center gap-2">
                        {isSpeaking ? (
                            <button type="button" onClick={stopSpeaking} className="p-2 text-teal-600 hover:text-teal-700 transition-colors animate-pulse">
                                <StopCircle size={20} />
                            </button>
                        ) : (
                            <button type="button" onClick={() => messages.length > 0 && speakText(messages[messages.length - 1].message)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <Volume2 size={20} />
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-200"
                        >
                            <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                        </button>
                    </div>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-300">AI can make mistakes. Please verify important information.</p>
                </div>
            </div>

            <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
        </div>
    );
};

export default ChatInterface;
