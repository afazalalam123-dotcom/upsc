
import React, { useState } from 'react';
import { evaluateMainsAnswer } from '../services/geminiService';
import { EvaluationResult } from '../types';

const MainsEvaluator: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (!question || !answer) return;
    setLoading(true);
    try {
      const res = await evaluateMainsAnswer(question, answer);
      setResult(res);
    } catch (e) {
      alert("Evaluation failed. Please check the AI connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Mains Answer Evaluation</h2>
        <p className="text-slate-500">Get detailed feedback based on UPSC standards (Content, Structure, Context).</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">The Question</label>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px]"
              placeholder="Paste the Mains question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Your Answer</label>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[300px]"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Analyzing your answer...' : 'Evaluate My Answer'}
          </button>
        </div>

        {result && (
          <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-indigo-600 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <h3 className="text-2xl font-bold text-slate-800">Review Summary</h3>
              <div className="text-center">
                <span className="text-4xl font-black text-indigo-600">{result.score}</span>
                <span className="text-slate-400 font-bold">/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-green-600 flex items-center gap-2">✅ Strengths</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-red-600 flex items-center gap-2">⚠️ Areas for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                  {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t space-y-4">
              <h4 className="font-bold text-slate-800">💡 Suggestions & Model Roadmap</h4>
              <div className="bg-indigo-50 p-6 rounded-2xl text-slate-700 text-sm italic">
                {result.modelAnswerSummary}
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainsEvaluator;
