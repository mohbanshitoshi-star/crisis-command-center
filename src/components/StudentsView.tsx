import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Award,
  Calculator
} from 'lucide-react';
import { Flashcard } from '../types';
import { ProblemSolverView } from './ProblemSolverView';

export const StudentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solver' | 'flashcards' | 'quiz'>('solver');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const flashcards: Flashcard[] = [
    {
      id: '1',
      question: 'What constitutes the Byzantine Fault Tolerance (BFT) threshold in distributed AI meshes?',
      answer: 'A distributed mesh can tolerate up to f faulty or adversarial nodes if total nodes N >= 3f + 1, ensuring mathematical consensus even during Byzantine partitions.',
      category: 'Distributed Systems',
      mastered: false,
    },
    {
      id: '2',
      question: 'How do 2026 Continuous Vector Synapses improve upon standard Transformer KV caches?',
      answer: 'Instead of storing growing discrete token key-value pairs, vector synapses compress state into a continuous neural manifold with O(1) memory complexity during decoding.',
      category: 'Neural Architecture',
      mastered: true,
    },
    {
      id: '3',
      question: 'What is the primary operational purpose of Zero-Knowledge State Attestations in autonomous defense fleets?',
      answer: 'To mathematically prove that an autonomous unit adhered to mission constraints and safety bounds without disclosing proprietary navigational weights or tactical payloads.',
      category: 'Cryptographic Security',
      mastered: false,
    },
  ];

  const quizQuestions = [
    {
      q: 'Which scaling law dimension in 2026 proved most critical for sub-millisecond tactile reasoning loops?',
      options: [
        'Pure Parameter Count (Dense weights)',
        'Photonic matrix-multiplier latency & optical interconnect bandwidth',
        'Traditional spinning magnetic storage arrays',
        'Batch size expansion beyond 65,536'
      ],
      correct: 1,
    },
    {
      q: 'Under DEFCON 4 operational posture, what is the default behavior of the AEGIS telemetry gatekeeper?',
      options: [
        'Total communications blackout across all 48 nodes',
        'Elevated surveillance with passive cryptographic telemetry verification',
        'Unconditional autonomous kinetic weapon authorization',
        'Forced memory flush of all node caches'
      ],
      correct: 1,
    },
  ];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Student Intelligence Hub</h1>
            <p className="text-xs text-gray-400">Adaptive curriculum synthesis, algorithmic flashcards, and technical problem sets</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 mt-6 border-b border-[#1f2533] pb-3">
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'solver' 
                ? 'bg-[#1e2535] text-[#00f2fe] border border-[#2a354c]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Step-by-Step Problem Solver</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'flashcards' 
                ? 'bg-[#1e2535] text-[#00f2fe] border border-[#2a354c]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Smart Flashcards ({flashcards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'quiz' 
                ? 'bg-[#1e2535] text-[#00f2fe] border border-[#2a354c]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice Exam</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full flex-1">
        {activeTab === 'solver' && (
          <div className="-mx-6 -my-8">
            <ProblemSolverView />
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="flex flex-col items-center">
            {/* Flashcard container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-xl h-80 bg-gradient-to-br from-[#131722] to-[#181e2b] border border-[#263145] rounded-3xl p-8 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-[#00f2fe]/40 transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1e2638] text-cyan-300 border border-[#2a3750]">
                  {currentCard.category}
                </span>
                <span className="font-mono">Card {currentCardIndex + 1} of {flashcards.length}</span>
              </div>

              <div className="my-auto text-center">
                {!isFlipped ? (
                  <div>
                    <h3 className="text-xl font-medium text-white leading-relaxed">
                      {currentCard.question}
                    </h3>
                    <p className="text-xs text-gray-500 mt-4 group-hover:text-cyan-400 transition-colors">
                      Click card to reveal synthesized answer
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-normal text-cyan-200 leading-relaxed">
                      {currentCard.answer}
                    </h3>
                    <p className="text-xs text-emerald-400 mt-4 font-mono">
                      ✓ Concept grounded in 2026 IEEE specs
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-[#232d3f] pt-4">
                <span>Tap space or card to flip</span>
                <span className="text-[#00f2fe] font-mono">Active Deck</span>
              </div>
            </div>

            {/* Flashcard Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-5 py-2.5 rounded-full bg-[#1b2230] hover:bg-[#252f44] text-xs font-semibold text-gray-200 border border-[#2b374d] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </button>
              <button
                onClick={handleNextCard}
                className="px-6 py-2.5 rounded-full bg-[#00f2fe] text-[#060a12] text-xs font-bold hover:bg-cyan-300 flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all"
              >
                <span>Next Concept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Autonomous Distributed Intelligence Exam</h3>
                <p className="text-xs text-gray-400">Automated evaluation with instant reasoning validation</p>
              </div>
              {quizScore !== null && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Score: {quizScore} / {quizQuestions.length}</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-200">
                    {qIdx + 1}. {q.q}
                  </h4>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[#1e283b] border-[#00f2fe] text-white shadow-[0_0_8px_rgba(0,242,254,0.2)]' 
                              : 'bg-[#161b28] border-[#252f42] text-gray-300 hover:bg-[#1b2232]'
                          }`}
                        >
                          <span className="font-mono text-gray-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmitQuiz}
              className="w-full py-3 bg-[#00f2fe] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              Submit and Validate Solutions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
