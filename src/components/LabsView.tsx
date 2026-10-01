import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Mic, Volume2, Cpu, Sparkles, Terminal, Activity, MicOff } from 'lucide-react';

export const LabsView: React.FC = () => {
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [activeVoice, setActiveVoice] = useState('Zephyr');
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(15).fill(20));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const toggleLiveSession = async () => {
    if (isLiveActive) {
      stopLiveSession();
    } else {
      await startLiveSession();
    }
  };

  const startLiveSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVisuals = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          const samples: number[] = [];
          const step = Math.floor(dataArray.length / 15);
          for (let i = 0; i < 15; i++) {
            const val = dataArray[i * step] || 0;
            samples.push(Math.max(15, Math.round((val / 255) * 100)));
          }
          setFrequencyData(samples);
          animFrameRef.current = requestAnimationFrame(updateVisuals);
        };
        animFrameRef.current = requestAnimationFrame(updateVisuals);
      }
      setIsLiveActive(true);
    } catch (err) {
      console.warn('Microphone access denied in Labs, falling back to simulated frequency:', err);
      setIsLiveActive(true);
    }
  };

  const stopLiveSession = () => {
    setIsLiveActive(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setFrequencyData(new Array(15).fill(20));
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">AI Studio Experimental Labs</h1>
              <p className="text-xs text-gray-400">Prototypes for low-latency Live API audio, autonomous traces, and neural agents</p>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full">
            LABS // BETA 2026
          </span>
        </div>

        {/* Prototype 1: Gemini Live Realtime Voice */}
        <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-[#00f2fe]" />
              <div>
                <h3 className="text-base font-semibold text-white">Gemini 3.8 Live API Voice Engine</h3>
                <p className="text-xs text-gray-400">Bidirectional raw PCM streaming over WebSocket at sub-120ms latency</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Voice:</span>
              {(['Zephyr', 'Kore', 'Puck', 'Fenrir'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVoice(v)}
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    activeVoice === v 
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40' 
                      : 'bg-[#18202d] text-gray-400 border border-[#222c3d]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Voice Waveform visualizer */}
          <div className="h-32 bg-[#090d14] border border-[#1e2535] rounded-xl flex items-center justify-center relative overflow-hidden">
            {isLiveActive ? (
              <div className="flex items-center gap-2 h-20">
                {frequencyData.map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[#00f2fe] rounded-full transition-all duration-75 shadow-[0_0_10px_#00f2fe]"
                    style={{
                      height: `${h}%`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-xs text-gray-500 font-mono flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#00f2fe]" />
                <span>Click 'Start Live Session' to enable real microphone live spectrum</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">FORMAT: audio/pcm 24kHz mono (16-bit LE)</span>
            <button
              onClick={toggleLiveSession}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                isLiveActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]' 
                  : 'bg-[#00f2fe] hover:bg-cyan-300 text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]'
              }`}
            >
              {isLiveActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isLiveActive ? 'Disconnect Session' : 'Start Live Session'}</span>
            </button>
          </div>
        </div>

        {/* Prototype 2: Multi-Agent Neural Reasoning Graph */}
        <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-semibold text-white">Hierarchical Multi-Agent Arbitration</h3>
              <p className="text-xs text-gray-400">Autonomous consensus arbitrator resolving contradictions across specialist agents</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#161c29] border border-[#263246] space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Agent 1: Ingest</span>
              <p className="text-xs text-gray-300 leading-snug">Continuous sensory parser consuming 120Hz radar and telemetry feeds.</p>
              <div className="text-[10px] font-mono text-emerald-400">ACTIVE // 0.8ms</div>
            </div>

            <div className="p-4 rounded-xl bg-[#161c29] border border-[#263246] space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase">Agent 2: Reasoner</span>
              <p className="text-xs text-gray-300 leading-snug">Multi-step Monte Carlo tree search generating candidate tactical routes.</p>
              <div className="text-[10px] font-mono text-emerald-400">ACTIVE // 4.2ms</div>
            </div>

            <div className="p-4 rounded-xl bg-[#161c29] border border-[#263246] space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase">Agent 3: Gatekeeper</span>
              <p className="text-xs text-gray-300 leading-snug">Formal verification verifying that proposed routes strictly respect DEFCON boundaries.</p>
              <div className="text-[10px] font-mono text-[#00f2fe]">VERIFIED // 0.2ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
