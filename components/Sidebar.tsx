
import React from 'react';
import { AppView } from '../types.ts';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: AppView.AI_TUTOR, label: 'AI Mentor', icon: '🤖' },
    { id: AppView.STUDY_PLANNER, label: 'Study Planner', icon: '📅' },
    { id: AppView.CURRENT_AFFAIRS, label: 'Current Affairs', icon: '🗞️' },
    { id: AppView.MAINS_EVALUATOR, label: 'Mains Review', icon: '✍️' },
    { id: AppView.PRACTICE_ZONE, label: 'Topic Wise', icon: '🎯' },
    { id: AppView.MOCK_TEST, label: 'Full Mock Test', icon: '⏱️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <span>🏛️</span> UPSC Ease
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Study Smarter</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentView === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium opacity-80">Overall Progress</p>
          <div className="mt-2 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-[40%]"></div>
          </div>
          <p className="text-xs mt-2">40% of syllabus mapped</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
