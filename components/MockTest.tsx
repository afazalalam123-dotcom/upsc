
import React, { useState, useEffect } from 'react';
import { generateMockTest } from '../services/geminiService.ts';
import { QuizQuestion, MockTestResult } from '../types.ts';

const MockTest: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<MockTestResult[]>([]);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('upsc_mock_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startMock = async () => {
    setLoading(true);
    try {
      const q = await generateMockTest(10);
      setQuestions(q);
      setAnswers(new Array(q.length).fill(null));
      setCurrentIdx(0);
      setFinished(false);
      setTimer(0);
      setIsActive(true);
    } catch (e) {
      alert("Failed to fetch test questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };

  const finishTest = () => {
    setIsActive(false);
    setFinished(true);
    
    let score = 0;
    const breakdown: Record<string, number> = {};
    
    questions.forEach((q, i) => {
      const subject = q.subject || 'General';
      if (!breakdown[subject]) breakdown[subject] = 0;
      if (answers[i] === q.correctAnswer) {
        score += 2; // UPSC prelims style (2 marks each)
        breakdown[subject] += 2;
      } else if (answers[i] !== null) {
        score -= 0.66; // Negative marking
        breakdown[subject] -= 0.66;
      }
    });

    const result: MockTestResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      score: parseFloat(score.toFixed(2)),
      totalQuestions: questions.length,
      subjectBreakdown: breakdown
    };

    const newHistory = [result, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('upsc_mock_history', JSON.stringify(newHistory));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold">Curating your Mock Test...</p>
      </div>
    );
  }

  if (finished) {
    const score = history[0].score;
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-300">
        <div className="bg-white p-12 rounded-3xl shadow-lg border-t-8 border-indigo-600 text-center">
          <h3 className="text-4xl font-bold text-slate-800 mb-2">Result Card</h3>
          <p className="text-slate-500">Test Duration: {formatTime(timer)}</p>
          <div className="my-10">
            <span className="text-7xl font-black text-indigo-600">{score}</span>
            <span className="text-slate-400 font-bold text-2xl">/{questions.length * 2}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {/* Fix: Explicitly cast entries to [string, number][] to resolve 'unknown' type errors for subject breakdown values */}
            {(Object.entries(history[0].subjectBreakdown) as [string, number][]).map(([sub, val]) => (
              <div key={sub} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{sub}</p>
                <p className={`text-lg font-bold ${val > 0 ? 'text-green-600' : 'text-red-500'}`}>{val.toFixed(1)}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setQuestions([])}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition"
          >
            Back to Mock Center
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📝</span> Answer Review
          </h4>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${answers[i] === q.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
                <p className="font-bold text-slate-800 mb-2">{i+1}. {q.question}</p>
                <div className="text-sm space-y-1 mb-4">
                   <p className="text-slate-500">Your Answer: <span className="font-bold text-slate-700">{answers[i] !== null ? q.options[answers[i]!] : 'Not attempted'}</span></p>
                   <p className="text-indigo-600 font-bold">Correct: {q.options[q.correctAnswer]}</p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl text-xs text-slate-600 leading-relaxed italic">
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">Q {currentIdx + 1}</span>
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-indigo-600 font-mono font-bold text-xl">{formatTime(timer)}</div>
             <button onClick={finishTest} className="text-red-500 font-bold text-sm hover:underline">Finish Test</button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 block">{q.subject}</span>
            <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-10">{q.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`p-5 rounded-2xl border text-left transition-all font-medium flex items-center gap-4 ${
                    answers[currentIdx] === i 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${answers[currentIdx] === i ? 'bg-white/20' : 'bg-white text-slate-400 border'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition disabled:opacity-30"
            >
              Previous
            </button>
            <div className="flex gap-2">
               <button
                  onClick={() => {
                    const newAns = [...answers];
                    newAns[currentIdx] = null;
                    setAnswers(newAns);
                  }}
                  className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-slate-600"
               >
                 Clear
               </button>
               {currentIdx < questions.length - 1 ? (
                 <button
                   onClick={() => setCurrentIdx(currentIdx + 1)}
                   className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                 >
                   Next Question
                 </button>
               ) : (
                 <button
                   onClick={finishTest}
                   className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition"
                 >
                   Review & Submit
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Mock Test Center</h2>
        <p className="text-slate-500">Full-length prelims simulations with real-time feedback and negative marking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Available Tests</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <div>
                      <p className="font-bold text-indigo-900">General Studies Mock #1 (Standard)</p>
                      <p className="text-xs text-indigo-600 font-medium">10 Questions • All GS Subjects • 2 Marks/Q</p>
                   </div>
                   <button onClick={startMock} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition">Start Now</button>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 opacity-60">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="font-bold text-slate-600">CSAT Aptitude Test</p>
                         <p className="text-xs text-slate-500">Requires Advanced Subscription</p>
                      </div>
                      <span className="text-xs font-black text-slate-400 border border-slate-300 px-2 py-1 rounded">LOCKED</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Performance Trend</h3>
             {history.length > 0 ? (
               <div className="space-y-4">
                 {history.map((h, i) => (
                   <div key={h.id} className="flex items-center gap-4">
                     <div className="w-12 text-xs font-bold text-slate-400">{h.date}</div>
                     <div className="flex-1 h-8 bg-slate-50 rounded-lg relative overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-1000" 
                          style={{ width: `${(h.score / (h.totalQuestions * 2)) * 100}%` }}
                        ></div>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-900">{h.score} Pts</span>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2">
                 <span className="text-4xl">📉</span>
                 <p className="text-sm font-medium">No test history available yet</p>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-800 p-8 rounded-3xl text-white shadow-xl">
              <h4 className="text-lg font-bold mb-4">Exam Guidelines</h4>
              <ul className="text-xs space-y-4 opacity-80 list-disc pl-4">
                <li>Negative marking of 0.66 applies for every wrong answer.</li>
                <li>You can skip questions and return later using the navigation.</li>
                <li>Avoid switching tabs to simulate real exam environment.</li>
                <li>Results are saved locally to track your weekly progress.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
