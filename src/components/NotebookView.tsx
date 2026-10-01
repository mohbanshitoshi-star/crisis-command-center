import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Headphones, 
  Plus, 
  Share2, 
  Download, 
  ExternalLink, 
  BookOpen, 
  Search, 
  Send,
  CheckCircle2,
  Bookmark,
  Volume2
} from 'lucide-react';

export const NotebookView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'sources' | 'chat'>('notes');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [notebookChat, setNotebookChat] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: 'I have analyzed all 4 sources regarding "The AI Revolution of 2026". You can ask for synthesized takeaways, counterarguments, or ask me to draft a strategic intelligence brief.'
    }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setNotebookChat(prev => [...prev, { role: 'user', text: query }]);
    setChatInput('');

    setTimeout(() => {
      let reply = `Based on Section 3 of the 2026 AI Paradigm analysis, autonomous agentic meshes now operate with sub-millisecond local consensus. The key bottleneck shifted from token throughput to sensory grounding verification.`;
      if (query.toLowerCase().includes('quantum')) {
        reply = `Sources confirm quantum-resistant hash attestations became standard across defense and financial networks by mid-2026, mitigating Shor's algorithm vulnerabilities in distributed routing.`;
      }
      setNotebookChat(prev => [...prev, { role: 'model', text: reply }]);
    }, 800);
  };

  const sources = [
    { id: '1', title: 'Autonomous Agentic Meshes & Latency Bounds (2026)', type: 'PDF Document', size: '2.4 MB', citation: 'MIT-CSAIL & DeepMind Collaborative Paper' },
    { id: '2', title: 'Sub-2nm Photonic Inference Hardware Benchmarks', type: 'Technical Report', size: '1.8 MB', citation: 'IEEE Microelectronics Review v44' },
    { id: '3', title: 'Zero-Knowledge Tactical Consensus in Critical Infra', type: 'Defense Briefing', size: '4.1 MB', citation: 'DoD Strategic Computing Initiative' },
    { id: '4', title: 'Continuous Vector Synapse Architectures', type: 'Research Preprint', size: '940 KB', citation: 'NeurIPS 2026 Keynote' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-hidden">
      {/* Top Notebook Navigation Header */}
      <header className="h-14 border-b border-[#1f2533] px-6 flex items-center justify-between bg-[#121620] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">
              The AI Revolution of 2026: Innovations & Strategic Paradigms
            </h1>
            <p className="text-[11px] text-gray-400">4 Sources Attached • Last edited 12 minutes ago by Toshi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Overview Podcast Button */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              isPlayingAudio 
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] animate-pulse' 
                : 'bg-[#1e2433] hover:bg-[#283144] text-gray-200 border border-[#2d374d]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-purple-400" />
            <span>{isPlayingAudio ? 'Playing Deep Dive Podcast...' : 'Generate Audio Overview'}</span>
          </button>

          <button className="p-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3f] text-gray-400 hover:text-white border border-[#263042] transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Sources Shelf (280px) */}
        <div className="w-72 border-r border-[#1f2533] bg-[#0e121a] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#1f2533] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Sources (4)</span>
            <button className="text-xs text-[#00f2fe] hover:underline flex items-center gap-1 cursor-pointer">
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sources.map(src => (
              <div 
                key={src.id}
                className="p-3 rounded-xl bg-[#141824] border border-[#20283a] hover:border-[#2f3b55] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-white group-hover:text-[#00f2fe] leading-snug line-clamp-2">
                      {src.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">{src.citation}</span>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500 font-mono">
                      <span>{src.type}</span>
                      <span>•</span>
                      <span>{src.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Notebook Document Content Editor */}
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto space-y-6">
          {/* Audio Player Widget if Active */}
          {isPlayingAudio && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Deep Dive Podcast: The 2026 AI Inflection</h4>
                  <p className="text-xs text-purple-300">Hosts: Alex & Sam discussing persistent agentic swarms</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPlayingAudio(false)} 
                className="text-xs text-gray-400 hover:text-white px-3 py-1 bg-black/40 rounded-lg"
              >
                Close
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white border-b border-[#232b3d] pb-3">
              Executive Briefing: The Autonomous Inflection
            </h2>

            <p className="text-[15px] text-gray-300 leading-relaxed">
              By late 2026, artificial intelligence systems moved decisively beyond reactive chat interfaces and single-prompt generation. The technological frontier is characterized by four synchronized revolutions:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#141824] border border-[#232b3d]">
                <h3 className="text-sm font-semibold text-[#00f2fe] flex items-center gap-2 mb-1.5">
                  <span>1. Autonomous Agentic Swarms with Verifiable Tool Use</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Agents do not merely execute deterministic scripts; they conduct continuous multi-step deliberation cycles, spinning up ephemeral sub-workers that test hypotheses in sandboxed runtimes before committing transactions to production systems.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141824] border border-[#232b3d]">
                <h3 className="text-sm font-semibold text-[#a855f7] flex items-center gap-2 mb-1.5">
                  <span>2. Sub-2nm Photonic Inference Arrays</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Optical matrix-multiplication accelerators deployed across regional data centers slashed inference latency from 15ms/token to 0.4ms/token, allowing real-time voice and high-frequency telemetry control loops without perceptible cognitive lag.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141824] border border-[#232b3d]">
                <h3 className="text-sm font-semibold text-[#10b981] flex items-center gap-2 mb-1.5">
                  <span>3. Zero-Knowledge Cryptographic Consensus</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Tactical networks integrate zero-knowledge proofs into every autonomous decision payload. Operatives verify that models acted strictly within codified safety boundaries without exposing proprietary model weights or classified intelligence inputs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive AI Notebook Assistant */}
        <div className="w-80 border-l border-[#1f2533] bg-[#0f131d] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#1f2533] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f2fe]" />
            <span className="text-xs font-semibold text-white">Notebook Copilot</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {notebookChat.map((chat, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  chat.role === 'user' 
                    ? 'bg-[#21293b] text-white ml-4' 
                    : 'bg-[#151a26] text-gray-300 border border-[#252f44]'
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-[#1f2533]">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this notebook..."
                className="w-full bg-[#161c29] border border-[#28334a] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] pr-8"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 text-[#00f2fe] hover:text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
