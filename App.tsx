
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AITutor from './components/AITutor';
import CurrentAffairs from './components/CurrentAffairs';
import MainsEvaluator from './components/MainsEvaluator';
import PracticeZone from './components/PracticeZone';
import StudyPlanner from './components/StudyPlanner';
import MockTest from './components/MockTest';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case AppView.AI_TUTOR:
        return <AITutor />;
      case AppView.CURRENT_AFFAIRS:
        return <CurrentAffairs />;
      case AppView.MAINS_EVALUATOR:
        return <MainsEvaluator />;
      case AppView.PRACTICE_ZONE:
        return <PracticeZone />;
      case AppView.STUDY_PLANNER:
        return <StudyPlanner />;
      case AppView.MOCK_TEST:
        return <MockTest />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pt-4 pb-12">
          {renderView()}
        </div>
        
        {/* Floating AI Helper Toggle - for quick access across any view */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setCurrentView(AppView.AI_TUTOR)}
            className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-200 active:scale-95 group relative"
          >
            <span>💬</span>
            <div className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Need Help? Ask Mentor
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
