
import React, { useState, useEffect } from 'react';
import { getDailyCurrentAffairs } from '../services/geminiService';

const CurrentAffairs: React.FC = () => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const text = await getDailyCurrentAffairs();
        setSummary(text || 'No news found for today.');
      } catch (e) {
        setSummary('Error loading news.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Daily Current Affairs</h2>
          <p className="text-slate-500">UPSC-relevant news summarized and linked to the GS syllabus.</p>
        </div>
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </header>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Scouring the web for UPSC news...</p>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 leading-relaxed text-slate-700 whitespace-pre-wrap prose prose-indigo max-w-none">
          {summary}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairs;
