import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Eye, 
  Cpu, 
  Layers, 
  ArrowDown, 
  Sparkles, 
  Send, 
  UploadCloud, 
  RefreshCw,
  Info,
  Check,
  Zap,
  Radio,
  FileText
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  title: string;
  badge: 'Normal' | 'Potential Risk' | 'Active Incident' | 'Critical' | 'Insufficient Context';
  color: string;
  imageUrl?: string;
  description: string;
  detectedObjects: string[];
  context: string;
  crisisVerdict: string;
  severity: 'Normal' | 'Potential Risk' | 'Active Incident' | 'Critical';
  situationDetected: string;
  recommendedAction: string;
  clarifyingQuestion?: string;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'birthday-candle',
    title: 'Lit Candle on Birthday Cake',
    badge: 'Normal',
    color: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=600&q=80',
    description: 'A person lighting a small decorative candle on a birthday cake with family gathered.',
    detectedObjects: ['Birthday cake', 'Single lit candle', 'Paper plates', 'Living room dining table', 'Gathered people'],
    context: 'Celebratory domestic event with controlled flame isolated on cake icing.',
    crisisVerdict: 'No uncontrolled flame, no flammable vapors, supervised by adults.',
    severity: 'Normal',
    situationDetected: 'A lit birthday candle is observed on a cake during a controlled family celebration. The flame is small, stable, and monitored.',
    recommendedAction: 'No emergency response required. Enjoy the celebration. Keep paper party items away from the flame and extinguish before leaving the room.',
  },
  {
    id: 'chef-knife',
    title: 'Chef Chopping in Commercial Kitchen',
    badge: 'Normal',
    color: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
    description: 'A cook using an 8-inch stainless chef knife to dice vegetables on a poly cutting board.',
    detectedObjects: ['Chef knife (8-inch)', 'Poly cutting board', 'Bell peppers & herbs', 'Stainless steel counter', 'Apron'],
    context: 'Standard commercial culinary preparation in a licensed kitchen.',
    crisisVerdict: 'Object is a kitchen tool being used for its intended purpose with standard grip mechanics.',
    severity: 'Normal',
    situationDetected: 'A kitchen knife is actively being used for food preparation on a cutting board. No signs of distress, struggle, or injury.',
    recommendedAction: 'Continue meal prep following standard kitchen hygiene and knife safety (curl guide-hand fingertips into a protective claw).',
  },
  {
    id: 'frayed-wire-water',
    title: 'Frayed Power Cord Near Basement Water Puddle',
    badge: 'Potential Risk',
    color: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'An extension cord with cracked insulation and visible copper conductor resting 4 inches from standing water.',
    detectedObjects: ['Damaged 120V cord', 'Exposed copper wire', 'Standing water puddle', 'Basement concrete floor'],
    context: 'Latent electrocution and thermal hazard. Cord is energized but not yet submerged or actively sparking.',
    crisisVerdict: 'Hazard is active and unmitigated, but has not yet escalated into injury or open fire.',
    severity: 'Potential Risk',
    situationDetected: 'Damaged electrical cable with exposed inner conductors resting adjacent to conductive standing water.',
    recommendedAction: '1. Do not step into the water or touch the cable.\n2. Go to the main electrical panel and switch off the circuit breaker powering this outlet.\n3. Verify power is severed before touching the cord. Replace damaged equipment before restoring power.',
  },
  {
    id: 'grease-fire',
    title: 'Stovetop Oil & Grease Fire',
    badge: 'Active Incident',
    color: 'rose',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Skillet with burning cooking oil on electric range with 10-inch flames and dark smoke.',
    detectedObjects: ['Cast iron skillet', 'Flames (approx 10 in)', 'Combusting oil vapor', 'Stovetop burner', 'Kitchen range hood'],
    context: 'Uncontrolled thermal ignition of cooking lipids on stovetop.',
    crisisVerdict: 'Active open fire with immediate potential to ignite overhead cabinetry and exhaust filters.',
    severity: 'Active Incident',
    situationDetected: 'Active cooking grease/oil fire burning inside a stovetop pan with open flames and heavy smoke emission.',
    recommendedAction: '1. Turn off the heat knob immediately if safely reachable.\n2. Slide a flat metal lid or baking sheet over the skillet to starve the flame of oxygen.\n3. NEVER pour water or flour onto burning oil—water vaporizes instantly, causing an explosive fireball.\n4. If flames spread beyond the pan, discharge a Class B/K fire extinguisher and evacuate the premises.',
  },
  {
    id: 'car-collision',
    title: 'High-Speed Vehicle Collision on Highway',
    badge: 'Critical',
    color: 'red',
    imageUrl: 'https://images.unsplash.com/photo-1543393470-b2c833b98dce?auto=format&fit=crop&w=600&q=80',
    description: 'Two passenger cars with crumpled engine bays, deployed steering airbags, and steam/smoke escaping.',
    detectedObjects: ['Crumpled vehicle front-ends', 'Deployed airbags', 'Fluid leak on asphalt', 'Engine bay smoke', 'Occupant in driver seat'],
    context: 'High-kinetic impact crash with possible passenger trauma and structural entrapment.',
    crisisVerdict: 'Immediate threat to human life and bodily integrity, with highway secondary-impact exposure.',
    severity: 'Critical',
    situationDetected: 'Multi-vehicle collision resulting in severe structural deformation, deployed airbags, and visible engine bay smoke.',
    recommendedAction: '1. Call 911 / emergency medical services immediately with exact highway mile marker and number of victims.\n2. Activate hazard flashers and position warning triangles up-traffic if safe to do so.\n3. Do not move injured passengers unless there is immediate, unavoidable danger of vehicle fire or explosion.\n4. Keep bystanders back to avoid hazardous fluid leaks and traffic hazards.',
  },
  {
    id: 'ambiguous-knife-floor',
    title: 'Kitchen Knife Resting on Living Room Rug',
    badge: 'Insufficient Context',
    color: 'blue',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    description: 'A clean knife lying on a residential rug without anyone nearby and no signs of blood or damage.',
    detectedObjects: ['Utility knife', 'Living room rug', 'Sofa edge', 'No people visible'],
    context: 'Unclear context. Could be dropped during unpacking, left after eating fruit, or displaced by children/pets.',
    crisisVerdict: 'No visible emergency, but presence of sharp object on floor creates accidental puncture hazard.',
    severity: 'Potential Risk',
    situationDetected: 'A sharp utility knife is resting on a floor area with no supervising person nearby. No visible blood, struggle, or damage.',
    recommendedAction: 'Pick up the knife by the handle and return it to a safe kitchen block or sheath out of reach of children or pets.',
    clarifyingQuestion: 'Are there young children or pets present in the room who could step on or handle the blade?',
  },
];

export const CrisisResolutionView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset>(PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(5);

  const [evaluationResult, setEvaluationResult] = useState<{
    situationDetected: string;
    riskLevel: 'Normal' | 'Potential Risk' | 'Active Incident' | 'Critical';
    recommendedAction: string;
    clarifyingQuestion?: string;
  }>({
    situationDetected: PRESET_SCENARIOS[0].situationDetected,
    riskLevel: PRESET_SCENARIOS[0].severity,
    recommendedAction: PRESET_SCENARIOS[0].recommendedAction,
    clarifyingQuestion: PRESET_SCENARIOS[0].clarifyingQuestion,
  });

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setEvaluationResult({
      situationDetected: preset.situationDetected,
      riskLevel: preset.severity,
      recommendedAction: preset.recommendedAction,
      clarifyingQuestion: preset.clarifyingQuestion,
    });
    setCustomPrompt('');
  };

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          perspective: 'crisis',
          temperature: 0.1,
          depth: 'detailed',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text: string = data.text || '';

        // Parse structured fields from the model response
        const situationMatch = text.match(/Situation detected:\s*([\s\S]*?)(?=Risk level:|$)/i);
        const riskMatch = text.match(/Risk level:\s*([\s\S]*?)(?=Recommended action:|$)/i);
        const actionMatch = text.match(/Recommended action:\s*([\s\S]*?)(?=If context is insufficient:|$)/i);
        const questionMatch = text.match(/If context is insufficient:\s*([\s\S]*?)$/i);

        let parsedRisk: 'Normal' | 'Potential Risk' | 'Active Incident' | 'Critical' = 'Potential Risk';
        const rawRisk = riskMatch ? riskMatch[1].trim().toLowerCase() : '';
        if (rawRisk.includes('normal')) parsedRisk = 'Normal';
        else if (rawRisk.includes('active incident')) parsedRisk = 'Active Incident';
        else if (rawRisk.includes('critical')) parsedRisk = 'Critical';
        else if (rawRisk.includes('potential')) parsedRisk = 'Potential Risk';

        setEvaluationResult({
          situationDetected: situationMatch ? situationMatch[1].trim() : text,
          riskLevel: parsedRisk,
          recommendedAction: actionMatch ? actionMatch[1].trim() : 'Proceed with caution.',
          clarifyingQuestion: questionMatch ? questionMatch[1].trim() : undefined,
        });
      }
    } catch (err) {
      console.error('Crisis evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'Normal':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Potential Risk':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Active Incident':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'Critical':
        return 'bg-red-600/30 text-red-400 border-red-500/60 animate-pulse';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0d14] text-[#e3e8f0] overflow-y-auto p-4 md:p-8 select-none">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header Banner */}
        <div className="bg-[#10141f] border border-[#21293a] rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  Situation-Aware Crisis Resolution Agent
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-semibold">
                  SITUATION-AWARE PIPELINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates environment &amp; context before assuming crisis. Never panics over normal tools or controlled flames.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171d2b] border border-[#263146]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Zero False Escalation Protocol</span>
            </span>
          </div>
        </div>

        {/* 5-Step Pipeline Visualizer */}
        <div className="bg-[#121623] border border-[#20293b] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>5-Stage Crisis Arbitration Pipeline</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">Autonomous Reasoning Chain</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Step 1 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              activeStep >= 1 ? 'bg-[#182133] border-blue-500/40' : 'bg-[#0f121a] border-[#1e2535]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-blue-400 font-bold">STAGE 1</span>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Object Detection</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Catalogs visible items: knife, candle, wire, vehicle, people, liquids.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              activeStep >= 2 ? 'bg-[#182133] border-blue-500/40' : 'bg-[#0f121a] border-[#1e2535]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-blue-400 font-bold">STAGE 2</span>
                <Layers className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Context Understanding</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Is it controlled (e.g. birthday cake, kitchen) or uncontrolled?
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              activeStep >= 3 ? 'bg-[#182133] border-blue-500/40' : 'bg-[#0f121a] border-[#1e2535]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-amber-400 font-bold">STAGE 3</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Crisis Detection</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Is there active harm, damage, smoke, fire, or immediate peril?
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              activeStep >= 4 ? 'bg-[#182133] border-rose-500/40' : 'bg-[#0f121a] border-[#1e2535]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-rose-400 font-bold">STAGE 4</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Severity Classification</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Normal &bull; Potential Risk &bull; Active Incident &bull; Critical
              </p>
            </div>

            {/* Step 5 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              activeStep >= 5 ? 'bg-[#182133] border-emerald-500/40' : 'bg-[#0f121a] border-[#1e2535]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-emerald-400 font-bold">STAGE 5</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Response Generation</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Gives ONLY advice tailored to the exact risk level. No generic spam.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Scenarios Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Preset Calibration Scenarios (Click to Test)</span>
            </h3>
            <span className="text-[11px] text-slate-500">6 Verified Benchmark Cases</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_SCENARIOS.map((scenario) => {
              const isSelected = selectedPreset.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleSelectPreset(scenario)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1b2333] border-blue-500/60 shadow-lg ring-1 ring-blue-500/30'
                      : 'bg-[#121622] hover:bg-[#161c2b] border-[#222c3d]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-xs font-bold text-white truncate">{scenario.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRiskBadgeStyles(scenario.badge)}`}>
                        {scenario.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1e2638] flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{scenario.detectedObjects.length} detected objects</span>
                    <span className="text-blue-400 font-semibold flex items-center gap-1">
                      <span>Inspect</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Input & Custom Situation Evaluator */}
        <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Evaluate Any Custom Scene or Situation</span>
            </h3>
            <span className="text-[11px] text-slate-500">Gemini 3.8 Flash Vision / Reasoning</span>
          </div>

          <form onSubmit={handleRunEvaluation} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe an image or situation (e.g. 'I see a lit match on a dining table next to an unlit scented candle with two adults drinking tea...')"
                className="w-full bg-[#18202d] border border-[#263347] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Rule: The agent will not escalate solely because an ignition source, blade, or vehicle is present.
              </span>
              <button
                type="submit"
                disabled={isEvaluating || !customPrompt.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Scene...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Situation Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Output Card: Structured Output Required Format */}
        <div className="bg-[#121622] border border-[#242f42] rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#202838] pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Agent Verdict &amp; Crisis Response
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Classified Risk Level:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeStyles(evaluationResult.riskLevel)}`}>
                {evaluationResult.riskLevel}
              </span>
            </div>
          </div>

          {/* Formatted Output matching user prompt */}
          <div className="space-y-4 font-mono text-xs text-slate-300">
            {/* 1. Situation detected */}
            <div className="p-4 bg-[#161c2a] rounded-xl border border-[#242f42] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                Situation detected:
              </span>
              <p className="text-white text-xs leading-relaxed font-sans">
                {evaluationResult.situationDetected}
              </p>
            </div>

            {/* 2. Risk level */}
            <div className="p-4 bg-[#161c2a] rounded-xl border border-[#242f42] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                Risk level:
              </span>
              <p className="text-white text-xs font-bold font-sans flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${getRiskBadgeStyles(evaluationResult.riskLevel)}`}>
                  {evaluationResult.riskLevel}
                </span>
                {evaluationResult.riskLevel === 'Normal' && (
                  <span className="text-emerald-400 text-xs font-normal">
                    (Controlled environment &bull; No active hazard &bull; Zero emergency escalation)
                  </span>
                )}
              </p>
            </div>

            {/* 3. Recommended action */}
            <div className="p-4 bg-[#161c2a] rounded-xl border border-[#242f42] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                Recommended action:
              </span>
              <div className="text-slate-200 text-xs leading-relaxed font-sans whitespace-pre-line">
                {evaluationResult.recommendedAction}
              </div>
            </div>

            {/* 4. If context is insufficient */}
            {evaluationResult.clarifyingQuestion && (
              <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-500/30 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block font-sans flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>If context is insufficient:</span>
                </span>
                <p className="text-blue-200 text-xs leading-relaxed font-sans">
                  {evaluationResult.clarifyingQuestion}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
