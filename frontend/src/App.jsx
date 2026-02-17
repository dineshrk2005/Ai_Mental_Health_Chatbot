import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Heart, Activity, MessageCircle } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
    <header className="mb-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
        AI Mental Health Companion
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Your empathetic partner for emotional well-being, growth, and support.
      </p>
    </header>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
      <FeatureCard
        icon={<Heart className="w-8 h-8 text-rose-500" />}
        title="Emotional Support"
        description="24/7 empathetic listening and conversation adapted to your mood."
      />
      <FeatureCard
        icon={<Activity className="w-8 h-8 text-emerald-500" />}
        title="Wellness Tracking"
        description="Monitor your mental health trends and gain personal insights."
      />
      <FeatureCard
        icon={<MessageCircle className="w-8 h-8 text-indigo-500" />}
        title="Guided Self-Help"
        description="CBT-based exercises and tools to help you navigate life's challenges."
      />
    </div>

    <div className="flex gap-4">
      <a href="/login" className="px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-full text-lg font-semibold shadow-sm hover:shadow-md transition-all">
        Login
      </a>
      <a href="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
        Get Started
      </a>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
    <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
