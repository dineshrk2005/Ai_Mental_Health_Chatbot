import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationFinder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFindHelp = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Open Google Maps
                window.open(`https://www.google.com/maps/search/mental+health+clinic/@${latitude},${longitude},12z`, '_blank');
                setLoading(false);
            },
            () => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <div className="bg-navy-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-full">
            <div className="flex items-start gap-4 h-full">
                <div className="p-3 bg-teal-900/30 text-teal-400 rounded-full border border-teal-500/20">
                    <MapPin size={24} />
                </div>
                <div className="flex flex-col h-full">
                    <h3 className="font-bold text-slate-200 text-lg">Find Help Nearby</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">
                        Locate professional mental health support in your area instantly.
                    </p>

                    <button
                        onClick={handleFindHelp}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-900/20 w-full font-medium"
                    >
                        <Navigation size={18} />
                        {loading ? 'Locating...' : 'Find Clinics Near Me'}
                    </button>

                    {error && (
                        <p className="mt-2 text-xs text-red-400 bg-red-900/20 p-2 rounded">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationFinder;
