
import React from 'react';
import { AppView, MockTestResult } from '../types';

const Dashboard: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
  const historyRaw = localStorage.getItem('upsc_mock_history');
  const history: MockTestResult[] = historyRaw ? JSON.parse(historyRaw) : [];
  const activePlan = localStorage.getItem('upsc_active_plan');

  const stats = [
    { label: 'Topics Covered', value: '42', color: 'text-blue-600' },
    { label: 'Avg Mock Score', value: history.length ? (history.reduce((a, b) => a + b.score, 0) / history.length).toFixed(1) : '0', color: 'text-green-600' },
    { label: 'Total Quizzes', value: (18 + history.length).toString(), color: 'text-purple-600' },
    { label: 'Study Streak', value: '5 Days', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome back, Aspirant!</h2>
          <p className="text-slate-500 mt-1">"The future depends on what you do today." — Mahatma Gandhi</p>
        </div>
        {!activePlan && (
          <button 
            onClick={() => setView(AppView.STUDY_PLANNER)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
          >
            Create Study Plan 📅
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Syllabus Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-700">Indian Polity: Fundamental Rights</p>
                  <p className="text-xs text-slate-500">Last studied 2 hours ago</p>
                </div>
                <button onClick={() => setView(AppView.AI_TUTOR)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Resume</button>
              </div>
              {activePlan && (
                <div className="flex items-center justify-between p-4 border-2 border-indigo-100 bg-indigo-50/30 rounded-xl">
                  <div>
                    <p className="font-semibold text-indigo-700">Active Study Plan: Week 1</p>
                    <p className="text-xs text-indigo-500">Based on your custom roadmap</p>
                  </div>
                  <button onClick={() => setView(AppView.STUDY_PLANNER)} className="px-4 py-2 text-indigo-600 font-bold text-sm hover:underline">View</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Performance</h3>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map(h => (
                  <div key={h.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-medium text-slate-600">Mock Test - {h.date}</span>
                    <span className={`text-sm font-bold ${h.score > 10 ? 'text-green-600' : 'text-orange-500'}`}>{h.score} Pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">Take your first mock test to see trends.</p>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Sharpen Your Edge</h3>
            <p className="text-indigo-100 text-sm mb-6">Test your knowledge with mixed GS subjects simulation. Includes time pressure and negative marking.</p>
            <div className="flex gap-4">
               <button 
                onClick={() => setView(AppView.MOCK_TEST)}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-0.5"
              >
                Start Mock Test
              </button>
              <button 
                onClick={() => setView(AppView.PRACTICE_ZONE)}
                className="bg-indigo-500/50 text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition"
              >
                Topic Quiz
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 text-8xl">🏆</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
