import React, { useState } from 'react';
import { Wind, Activity, PenTool, Eye, Anchor, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXERCISES = [
    {
        category: "Breathing & Mental Grounding",
        color: "bg-teal-900/40",
        icon: <Wind size={20} className="text-teal-400" />,
        items: [
            {
                title: "4-7-8 Breathing",
                description: "Inhale through your nose for 4 seconds, hold for 7, and exhale through your mouth for 8.",
                icon: <Wind size={16} />
            },
            {
                title: "5-4-3-2-1 Grounding",
                description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you can taste to anchor yourself.",
                icon: <Anchor size={16} />
            },
            {
                title: "Visualization Journey",
                description: "Close your eyes and vividly imagine a peaceful place, engaging all five senses in your mental image.",
                icon: <Eye size={16} />
            },
            {
                title: "Body Scan Meditation",
                description: "Lie down and mentally 'scan' your body from head to toe, consciously releasing any tension you find.",
                icon: <Activity size={16} />
            }
        ]
    },
    {
        category: "Gentle Physical Movement",
        color: "bg-indigo-900/40",
        icon: <Activity size={20} className="text-indigo-400" />,
        items: [
            {
                title: "Progressive Muscle Relaxation (PMR)",
                description: "Systematically tense each muscle group for 5 seconds and then suddenly release.",
                icon: <Activity size={16} />
            },
            {
                title: "Legs-Up-the-Wall Pose",
                description: "Lie back with legs vertically against a wall for 10 mins to calm the nervous system.",
                icon: <Activity size={16} />
            },
            {
                title: "Mindful Walking",
                description: "Take a slow walk, focusing entirely on the sensation of your feet and the rhythm of your breath.",
                icon: <Activity size={16} />
            },
            {
                title: "Child’s Pose (Balasana)",
                description: "Kneel and fold forward until your forehead touches the floor to release back tension.",
                icon: <Activity size={16} />
            }
        ]
    },
    {
        category: "Expressive & Creative Outlets",
        color: "bg-purple-900/40",
        icon: <PenTool size={20} className="text-purple-400" />,
        items: [
            {
                title: "Journaling / Brain Dump",
                description: "Write down everything currently bothering you for 5–10 minutes to 'externalize' the stress.",
                icon: <PenTool size={16} />
            },
            {
                title: "Mindful Drawing / Coloring",
                description: "Focus on the repetitive motion of drawing circles or patterns as 'muscular meditation'.",
                icon: <PenTool size={16} />
            }
        ]
    }
];

const WellnessLibrary = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <span className="text-2xl">📚</span> Wellness Library
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXERCISES.map((section, idx) => (
                    <div key={idx} className={`rounded-2xl border border-slate-700 overflow-hidden ${section.color}`}>
                        <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                                {section.icon}
                            </div>
                            <h4 className="font-bold text-slate-100">{section.category}</h4>
                        </div>

                        <div className="p-4 space-y-4">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="group bg-slate-800/30 hover:bg-slate-800/60 p-3 rounded-xl transition-all border border-slate-700/50 hover:border-slate-600">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-teal-400">{item.icon}</span>
                                        <h5 className="font-semibold text-slate-200 text-sm">{item.title}</h5>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed pl-6">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WellnessLibrary;
