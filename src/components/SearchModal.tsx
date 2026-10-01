import React, { useState } from 'react';
import { Search, FileText, Activity, MessageSquare, ArrowRight, X } from 'lucide-react';
import { NavigationTab } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SearchModal: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = [
    { title: 'The AI Revolution of 2026: Innovations & Strategic Paradigms', category: 'Notebook', tab: 'notebook' as NavigationTab },
    { title: 'AEGIS v2.0 Tactical Matrix & Telemetry HUD', category: 'Spark Mode', tab: 'spark' as NavigationTab },
    { title: 'Advanced Autonomous Systems & Distributed Mesh Flashcards', category: 'Students', tab: 'students' as NavigationTab },
    { title: 'Cybernetic Aerospace HUD & Tactical Visual Assets', category: 'Images', tab: 'images' as NavigationTab },
    { title: 'Gemini 3.8 Live API Voice Engine Prototype', category: 'Labs', tab: 'labs' as NavigationTab },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0b101c]/80 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats, notebooks, students, or tactical telemetry..."
            className="w-full bg-transparent border-none p-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
          />
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length > 0 ? (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(res.tab);
                  onClose();
                }}
                className="w-full p-3 rounded-xl hover:bg-white/[0.06] hover:border-white/10 border border-transparent text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="min-w-0 pr-4">
                  <div className="text-xs font-semibold text-white group-hover:text-[#00f2fe] truncate">
                    {res.title}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">{res.category}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00f2fe] shrink-0" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        <div className="p-3 bg-[#0f121a] border-t border-[#232c3d] flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
