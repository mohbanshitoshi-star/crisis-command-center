import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  FileCheck, 
  PlusCircle, 
  RotateCw, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export interface DecisionState {
  situation: string;
  isAnalyzing: boolean;
  step: 'describe' | 'analyzer' | 'verification' | 'risk' | 'action_planner' | 'results';
  analysisResult?: {
    entities: string[];
    criticalFactors: string[];
    causalLinks: string[];
  };
  verification?: {
    confidence: number;
    verifiedFacts: string[];
    ambiguities: string[];
  };
  riskAssessment?: {
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    risks: { title: string; severity: string; mitigation: string }[];
  };
  actionPlan?: {
    phase1: string[];
    phase2: string[];
    contingency: string[];
  };
  newInformation?: string;
  whatChanged?: {
    deltaSummary: string;
    previousState: string;
    updatedState: string;
    riskDelta: string;
  };
}

export const DecisionAnalysisWorkflow: React.FC = () => {
  const [situationText, setSituationText] = useState(
    'Sub-sea communications link latency spike detected across Sector 3. Telemetry packet jitter increased by 42ms. Three autonomous routing nodes have degraded to standby mode.'
  );
  const [newInfoText, setNewInfoText] = useState('');
  const [currentStep, setCurrentStep] = useState<DecisionState['step']>('describe');
  const [isProcessing, setIsProcessing] = useState(false);

  const [state, setState] = useState<DecisionState>({
    situation: situationText,
    isAnalyzing: false,
    step: 'describe',
  });

  const handleAnalyze = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setState({
        situation: situationText,
        isAnalyzing: false,
        step: 'analyzer',
        analysisResult: {
          entities: ['Sector 3 Sub-sea Mesh', 'Autonomous Nodes Alpha-03/Beta-07', 'Regional Switching Hub'],
          criticalFactors: ['42ms Packet Jitter Delta', 'Standby Degraded State', 'Redundant Optical Line Capacity'],
          causalLinks: ['Physical strain or acoustic disturbance -> Loss of synchronous timing pulse -> Fallback to asynchronous routing'],
        },
        verification: {
          confidence: 0.96,
          verifiedFacts: [
            'Packet jitter confirmed by 4 redundant telemetry monitors.',
            'Zero cryptographic breach detected on hardware perimeter.',
            'Primary core gateway remains operating at 99.8% capacity.',
          ],
          ambiguities: [
            'Awaiting acoustic sensor telemetry from ocean floor probe gamma.',
          ],
        },
        riskAssessment: {
          overallRisk: 'MEDIUM',
          risks: [
            { title: 'Cascading Route Overflow', severity: 'High', mitigation: 'Activate optical link bypass via Epsilon Node cache.' },
            { title: 'Temporary Decoupling of Swarm Sync', severity: 'Medium', mitigation: 'Relax Byzantine consensus window to 25ms.' },
          ],
        },
        actionPlan: {
          phase1: ['Isolate fluctuating Sector 3 link.', 'Reroute high-priority encrypted streams via Orbital Link Beta.'],
          phase2: ['Dispatch autonomous underwater diagnostic vehicle.', 'Recalibrate clock synchronization pulse.'],
          contingency: ['Switch to decentralized distributed consensus if latency exceeds 60ms.'],
        },
      });
      setCurrentStep('analyzer');
      setIsProcessing(false);
    }, 1000);
  };

  const handleRePlan = () => {
    if (!newInfoText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        step: 'results',
        situation: `${prev.situation}\n\n[NEW UPDATE]: ${newInfoText}`,
        whatChanged: {
          deltaSummary: `Integrated new intelligence: "${newInfoText}"`,
          previousState: 'Standby mode on Alpha-03/Beta-07 with 42ms packet jitter.',
          updatedState: 'Rerouting activated via Orbital Link Beta; autonomous node mesh stabilized at 99.9% precision.',
          riskDelta: 'Overall risk decreased from MEDIUM to LOW-CONTROLLED.',
        },
        actionPlan: {
          phase1: ['Execute tactical reroute based on: ' + newInfoText.slice(0, 50), 'Isolate fluctuating Sector 3 link.'],
          phase2: ['Autonomous node rebalance confirmed at 99.9% precision.'],
          contingency: ['Maintain real-time monitor.'],
        },
      }));
      setNewInfoText('');
      setCurrentStep('results');
      setIsProcessing(false);
    }, 800);
  };

  const steps = [
    { id: 'describe', label: '1. Situation Input' },
    { id: 'analyzer', label: '2. Analyzer Agent' },
    { id: 'verification', label: '3. Verification Agent' },
    { id: 'risk', label: '4. Risk Agent' },
    { id: 'action_planner', label: '5. Action Planner' },
    { id: 'results', label: '6. Dynamic Re-planning' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2533] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">AEGIS Decision &amp; Action Support</h1>
              <p className="text-xs text-gray-400">
                End-to-end tactical deliberation pipeline: Analyze &bull; Verify &bull; Risk &bull; Plan &bull; Re-plan
              </p>
            </div>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id as any)}
              className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                currentStep === s.id
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-sm'
                  : 'bg-[#121622] text-gray-400 border-[#222c3d] hover:bg-[#1a202c]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step 1: Describe Situation */}
        {currentStep === 'describe' && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Describe Operational Situation</span>
            </div>
            <textarea
              rows={5}
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              placeholder="Detail the active operational scenario, incoming sensor readings, anomalies, or system alerts..."
              className="w-full bg-[#161c29] border border-[#263246] rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing || !situationText.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>{isProcessing ? 'Analyzing Situation...' : 'Analyze Situation'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Analyzer */}
        {currentStep === 'analyzer' && state.analysisResult && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Analyzer: Entity &amp; Causal Breakdown</span>
              </h3>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                STAGE 2 // VERIFIED
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-gray-300 block mb-1.5 uppercase font-mono text-[10px]">Identified Entities:</span>
                <div className="flex flex-wrap gap-2">
                  {state.analysisResult.entities.map((e, i) => (
                    <span key={i} className="px-3 py-1 bg-[#1a2130] border border-[#27344c] rounded-lg text-white font-medium">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-300 block mb-1.5 uppercase font-mono text-[10px]">Critical Factors:</span>
                <ul className="space-y-1 text-gray-300 list-disc list-inside">
                  {state.analysisResult.criticalFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#151a26] border border-[#232b3d] rounded-xl">
                <span className="font-semibold text-blue-400 block mb-1">Causal Hypothesis:</span>
                <p className="text-gray-300">{state.analysisResult.causalLinks[0]}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep('verification')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {currentStep === 'verification' && state.verification && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verification &amp; Grounding Check</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                Confidence: {(state.verification.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-emerald-400 block">Verified Empirical Facts:</span>
                {state.verification.verifiedFacts.map((fact, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-amber-400 block">Remaining Ambiguities:</span>
                {state.verification.ambiguities.map((amb, idx) => (
                  <div key={idx} className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{amb}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep('risk')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Risk Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Risk Assessment */}
        {currentStep === 'risk' && state.riskAssessment && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Risk Assessment Matrix</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                OVERALL: {state.riskAssessment.overallRisk}
              </span>
            </div>

            <div className="space-y-3">
              {state.riskAssessment.risks.map((r, i) => (
                <div key={i} className="p-4 bg-[#151a26] border border-[#232b3d] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{r.title}</span>
                    <span className="font-mono text-amber-400 font-semibold">{r.severity} Severity</span>
                  </div>
                  <p className="text-gray-400 pt-1">Mitigation Vector: <strong className="text-gray-200">{r.mitigation}</strong></p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep('action_planner')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate Action Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5 & 6: Action Planner & Results */}
        {(currentStep === 'action_planner' || currentStep === 'results') && state.actionPlan && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Action Plan &amp; Tactical Directives</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                READY FOR EXECUTION
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#141a26] border border-[#222d42] rounded-xl space-y-2">
                <span className="font-bold text-blue-400 uppercase font-mono text-[11px]">Phase 1: Immediate Containment (T+0 to T+15m)</span>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {state.actionPlan.phase1.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#141a26] border border-[#222d42] rounded-xl space-y-2">
                <span className="font-bold text-emerald-400 uppercase font-mono text-[11px]">Phase 2: Tactical Remediation &amp; Stabilization</span>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {state.actionPlan.phase2.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#141a26] border border-[#222d42] rounded-xl space-y-2">
                <span className="font-bold text-amber-400 uppercase font-mono text-[11px]">Contingency Protocol</span>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {state.actionPlan.contingency.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* What Changed (Delta Analysis) if re-plan executed */}
              {state.whatChanged && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>What Changed? (Dynamic Re-planning Delta)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                      LIVE DELTA
                    </span>
                  </div>
                  <p className="text-emerald-200 font-medium">{state.whatChanged.deltaSummary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 bg-[#0c1017] rounded-lg border border-emerald-900/60">
                      <span className="text-gray-400 block mb-0.5 font-semibold">Previous Baseline:</span>
                      <span className="text-gray-300">{state.whatChanged.previousState}</span>
                    </div>
                    <div className="p-2 bg-[#0c1017] rounded-lg border border-emerald-900/60">
                      <span className="text-emerald-400 block mb-0.5 font-semibold">Re-planned State:</span>
                      <span className="text-gray-200">{state.whatChanged.updatedState}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-300 pt-0.5 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Risk Impact: {state.whatChanged.riskDelta}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Add New Information & Re-plan Section */}
            <div className="mt-6 pt-5 border-t border-[#222c3d] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Add New Information &amp; Re-plan</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInfoText}
                  onChange={(e) => setNewInfoText(e.target.value)}
                  placeholder="Enter new sensor reading, satellite update, or tactical confirmation..."
                  className="flex-1 bg-[#161c29] border border-[#263246] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleRePlan}
                  disabled={isProcessing || !newInfoText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Re-plan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
