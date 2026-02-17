
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

const PracticeZone: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const startQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    setFinished(false);
    setScore(0);
    setCurrentIdx(0);
    try {
      const q = await generateQuiz(topic);
      setQuestions(q);
    } catch (e) {
      alert("Error generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-lg text-center max-w-2xl mx-auto border border-slate-100">
        <h3 className="text-4xl font-bold text-slate-800 mb-2">Quiz Complete! 🎯</h3>
        <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
        <div className="text-8xl mb-8">
          {score === questions.length ? '🏆' : score >= questions.length / 2 ? '💪' : '📚'}
        </div>
        <button 
          onClick={() => setQuestions([])} 
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          Try Another Topic
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-slate-400">Question {currentIdx + 1} of {questions.length}</span>
          <span className="text-sm font-bold text-indigo-600">Score: {score}</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-8">{q.question}</h3>
          <div className="space-y-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full p-4 rounded-xl border text-left transition-all font-medium ${
                  selected === i 
                    ? (i === q.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                    : (selected !== null && i === q.correctAnswer ? 'bg-green-100 border-green-500 text-green-800' : 'bg-slate-50 border-slate-200 hover:border-indigo-300')
                }`}
              >
                <span className="mr-3 text-slate-400">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-bold text-indigo-700 mb-2">Explanation:</p>
              <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
              <button 
                onClick={nextQuestion}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Practice Zone</h2>
        <p className="text-slate-500">Generate custom quizzes on any UPSC topic instantly.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">What do you want to test today?</label>
          <input
            type="text"
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. Fundamental Rights, Ashokan Edicts, Climate Change..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={startQuiz}
            disabled={loading || !topic}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Preparing your quiz...' : 'Generate AI Quiz'}
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {['Indian Polity', 'Modern History', 'Economy', 'Environment'].map((t) => (
            <button 
              key={t}
              onClick={() => {setTopic(t);}}
              className="p-3 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition"
            >
              Quick Test: {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeZone;
