import React, { useState } from 'react';
import { Library, Search, FileText, Sparkles, Folder, ArrowUpRight, Clock, Star } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const items = [
    { id: '1', title: 'The AI Revolution of 2026: Innovations & Strategic Paradigms', type: 'Notebook', date: 'Sept 30, 2026', tags: ['Autonomous', 'Photonics', 'Defense'] },
    { id: '2', title: 'AEGIS Mesh Latency Optimization Script', type: 'Code Asset', date: 'Sept 28, 2026', tags: ['TypeScript', 'Consensus'] },
    { id: '3', title: 'Strategic Defense Brief: Zero-Knowledge Attestation', type: 'Briefing Doc', date: 'Sept 24, 2026', tags: ['ZKP', 'Security'] },
    { id: '4', title: 'High-Velocity Telemetry Visualizer Prompt', type: 'Prompt Template', date: 'Sept 20, 2026', tags: ['Gemini 2.5', 'HUD'] },
  ];

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Intelligence Library</h1>
              <p className="text-xs text-gray-400">Archived briefs, saved model outputs, notebooks, and prompt templates</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved assets, notebooks, or tags..."
            className="w-full bg-[#121622] border border-[#222c3d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe]"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div 
              key={item.id}
              className="bg-[#121622] border border-[#222c3d] hover:border-[#00f2fe]/40 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c2333] text-cyan-300 border border-[#2a3750]">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00f2fe] leading-snug">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1d2535]">
                <div className="flex gap-1.5">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] text-gray-400 bg-[#161d2a] px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
