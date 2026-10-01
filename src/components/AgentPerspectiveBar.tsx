import React, { useState } from 'react';
import { AgentPerspective } from '../types';
import { 
  Target, 
  Calculator, 
  Code2, 
  Briefcase, 
  Scale, 
  Sliders, 
  CheckCircle2, 
  X,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';

interface Props {
  perspective: AgentPerspective;
  onChangePerspective: (p: AgentPerspective) => void;
  temperature: number;
  onChangeTemperature: (t: number) => void;
  depth: 'detailed' | 'concise';
  onChangeDepth: (d: 'detailed' | 'concise') => void;
}

const PERSPECTIVES: {
  id: AgentPerspective;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: 'tactical',
    label: 'Tactical Intel',
    shortLabel: 'Tactical',
    icon: Target,
    description: 'Structured situational analysis, risk arbitration & operational directives',
  },
  {
    id: 'crisis',
    label: 'Crisis Resolution',
    shortLabel: 'Crisis',
    icon: ShieldAlert,
    description: 'Situation-aware crisis detection & risk classification (Normal / Potential Risk / Active Incident / Critical)',
  },
  {
    id: 'stem',
    label: 'Precision STEM',
    shortLabel: 'STEM Math',
    icon: Calculator,
    description: 'Exact mathematical derivations, loan math, physics & zero-approximation rigor',
  },
  {
    id: 'code',
    label: 'Code & Architecture',
    shortLabel: 'Code',
    icon: Code2,
    description: 'Bug-free, fully typed implementations, Big-O complexity & defensive checks',
  },
  {
    id: 'executive',
    label: 'Executive Brief',
    shortLabel: 'Executive',
    icon: Briefcase,
    description: 'Bottom-line upfront (BLUF), strategic trade-offs & governance recommendations',
  },
  {
    id: 'balanced',
    label: 'Balanced Analyst',
    shortLabel: 'Balanced',
    icon: Scale,
    description: 'Clear, direct, and sensible answers with verified facts and context',
  },
];

export const AgentPerspectiveBar: React.FC<Props> = ({
  perspective,
  onChangePerspective,
  temperature,
  onChangeTemperature,
  depth,
  onChangeDepth,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const activeObj = PERSPECTIVES.find((p) => p.id === perspective) || PERSPECTIVES[0];
  const IconComponent = activeObj.icon;

  return (
    <div className="w-full mb-3 flex flex-col gap-2">
      {/* Horizontal Perspective Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Perspective:
          </span>

          {PERSPECTIVES.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = item.id === perspective;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePerspective(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/10 hover:bg-white/[0.08]'
                }`}
                title={item.description}
              >
                <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00f2fe]' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Parameters Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-full text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono hidden md:inline">
              Temp: <strong className="text-white">{temperature}</strong> &bull; {depth}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* Settings Modal Popover */}
          {showSettings && (
            <div className="absolute right-0 bottom-full mb-2 w-72 bg-[#0b101c]/85 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] p-4 z-50 text-xs space-y-3.5 animate-in fade-in duration-100 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Agent Parameters</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-gray-300 font-medium">Temperature</label>
                  <span className="text-[11px] font-mono text-blue-400 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>0.0 (Strict / Exact)</span>
                  <span>0.5 (Balanced)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              {/* Reasoning Depth */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-300 font-medium">Reasoning Depth</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0c0f16] rounded-lg border border-[#1e2535]">
                  <button
                    type="button"
                    onClick={() => onChangeDepth('detailed')}
                    className={`py-1 text-center rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                      depth === 'detailed' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Step-by-Step
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeDepth('concise')}
                    className={`py-1 text-center rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                      depth === 'concise' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Concise &amp; Direct
                  </button>
                </div>
              </div>

              {/* Verification & Correctness Guarantee */}
              <div className="pt-1 border-t border-[#1f283a] flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Anti-Hallucination &amp; Mathematical Guardrails Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
