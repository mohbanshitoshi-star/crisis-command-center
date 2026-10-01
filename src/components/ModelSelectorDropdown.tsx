import React from 'react';
import { Sparkles, Zap, Brain, Check, Flame } from 'lucide-react';
import { GeminiModelId } from '../types';

interface ModelOption {
  id: GeminiModelId;
  name: string;
  badge: string;
  tagline: string;
  icon: React.ReactNode;
}

const MODELS: ModelOption[] = [
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    badge: 'COMPLEX',
    tagline: 'Deep reasoning, advanced STEM, coding & multi-step planning',
    icon: <Brain className="w-4 h-4 text-[#a855f7]" />,
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Aegis flame',
    badge: 'GENERAL',
    tagline: 'Balanced intelligence & rich comprehension for general tasks',
    icon: <Zap className="w-4 h-4 text-[#00f2fe]" />,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Aegis flame-core',
    badge: 'FAST',
    tagline: 'Ultra-low latency for instant, rapid-fire responses',
    icon: <Flame className="w-4 h-4 text-[#f59e0b]" />,
  },
];

interface Props {
  selectedModel: GeminiModelId;
  onSelect: (modelId: GeminiModelId) => void;
  onClose: () => void;
  thinkingEnabled: boolean;
  onToggleThinking: () => void;
}

export const ModelSelectorDropdown: React.FC<Props> = ({
  selectedModel,
  onSelect,
  onClose,
  thinkingEnabled,
  onToggleThinking,
}) => {
  return (
    <div className="absolute right-0 bottom-full mb-3 w-80 bg-[#0b101c]/85 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Select Intelligence Engine</span>
        <span className="text-[10px] font-mono text-[#00f2fe] bg-cyan-500/15 border border-cyan-400/30 px-1.5 py-0.5 rounded-full">v2026.9</span>
      </div>

      <div className="space-y-1">
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                onClose();
              }}
              className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white/10 border border-cyan-400/40 backdrop-blur-md shadow-sm' 
                  : 'hover:bg-white/[0.06] border border-transparent hover:border-white/10'
              }`}
            >
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 mt-0.5">
                {model.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{model.name}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">
                    {model.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">{model.tagline}</p>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[#00f2fe] mt-1 shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 px-2 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="text-xs text-gray-300 font-medium">Extended Thinking</span>
          </div>
          <button
            onClick={onToggleThinking}
            type="button"
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              thinkingEnabled ? 'bg-[#00f2fe]' : 'bg-white/15'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black transition-transform ${
                thinkingEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Allows Gemini to generate internal reasoning traces before answering.</p>
      </div>
    </div>
  );
};
