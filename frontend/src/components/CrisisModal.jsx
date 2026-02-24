import React from 'react';
import { TriangleAlert, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CrisisModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-t-4 border-red-500"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 text-red-600">
                                <div className="p-2 bg-red-50 rounded-full">
                                    <TriangleAlert size={24} />
                                </div>
                                <h2 className="text-xl font-bold">You are not alone.</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            It sounds like you might be going through a difficult time. Please reach out to someone who can help. There are people ready to listen.
                        </p>

                        <div className="space-y-3">
                            <a href="tel:108" className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <div className="font-bold text-red-900">108 Lifeline (India)</div>
                                        <div className="text-xs text-red-600">24/7 Confidential Support</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-white text-red-600 text-sm font-bold rounded-full shadow-sm">Call</span>
                            </a>

                            <a href="tel:108" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-slate-500 group-hover:scale-110 transition-transform" size={20} />
                                    <div>
                                        <div className="font-bold text-slate-900">Emergency Services</div>
                                        <div className="text-xs text-slate-600">India Emergency Number</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-white text-slate-600 text-sm font-bold rounded-full shadow-sm">Call 112</span>
                            </a>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                        Help is available. Speak with a counselor today.
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CrisisModal;
