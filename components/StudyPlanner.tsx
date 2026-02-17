
import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlanParams } from '../types';

const StudyPlanner: React.FC = () => {
  const [params, setParams] = useState<StudyPlanParams>({
    hoursPerDay: 4,
    durationWeeks: 4,
    focusTopics: [],
    level: 'Beginner'
  });
  const [topicInput, setTopicInput] = useState('');
  const [plan, setPlan] = useState<string | null>(localStorage.getItem('upsc_active_plan'));
  const [loading, setLoading] = useState(false);

  const addTopic = () => {
    if (topicInput.trim() && !params.focusTopics.includes(topicInput.trim())) {
      setParams(p => ({ ...p, focusTopics: [...p.focusTopics, topicInput.trim()] }));
      setTopicInput('');
    }
  };

  const removeTopic = (t: string) => {
    setParams(p => ({ ...p, focusTopics: p.focusTopics.filter(x => x !== t) }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedPlan = await generateStudyPlan(params);
      setPlan(generatedPlan);
      localStorage.setItem('upsc_active_plan', generatedPlan);
    } catch (e) {
      alert("Plan generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const clearPlan = () => {
    if (confirm("Delete current plan?")) {
      setPlan(null);
      localStorage.removeItem('upsc_active_plan');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Study Planner</h2>
        <p className="text-slate-500">Craft a schedule that works for your life and your goals.</p>
      </header>

      {!plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Planner Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Daily Commitment (Hours)</label>
                <input 
                  type="range" min="1" max="16" step="1" 
                  value={params.hoursPerDay} 
                  onChange={(e) => setParams({ ...params, hoursPerDay: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <p className="text-right text-indigo-600 font-bold">{params.hoursPerDay} hours</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Plan Duration (Weeks)</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
                  value={params.durationWeeks}
                  onChange={(e) => setParams({ ...params, durationWeeks: parseInt(e.target.value) })}
                >
                  {[2, 4, 8, 12, 24].map(w => <option key={w} value={w}>{w} Weeks</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Preparation Level</label>
                <div className="flex gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setParams({ ...params, level: lvl })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${
                        params.level === lvl ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Focus Subjects/Topics</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                    placeholder="e.g. Modern History, Ethics, Mapping..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200"
                  />
                  <button onClick={addTopic} className="bg-slate-800 text-white px-4 rounded-xl font-bold">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {params.focusTopics.map(t => (
                    <span key={t} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-indigo-100">
                      {t}
                      <button onClick={() => removeTopic(t)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  {params.focusTopics.length === 0 && <p className="text-xs text-slate-400 italic">No specific focus added (General GS plan will be created)</p>}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Consulting the Mentor...' : 'Create My Study Plan'}
            </button>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white flex flex-col justify-center relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Why use a custom plan?</h3>
                <ul className="space-y-4 opacity-90">
                  <li className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-1">✓</span>
                    Tailored to your daily schedule and constraints.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-1">✓</span>
                    Focuses on your weak areas while maintaining GS depth.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0 mt-1">✓</span>
                    Includes realistic break times and revision cycles.
                  </li>
                </ul>
             </div>
             <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-10">📅</div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 relative">
            <button 
              onClick={clearPlan}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-500 text-sm font-bold flex items-center gap-2"
            >
              Reset Plan
            </button>
            <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
              {plan}
            </div>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition"
            >
              📥 Save/Print Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
