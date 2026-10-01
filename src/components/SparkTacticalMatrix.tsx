import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Shield, 
  Terminal, 
  Cpu, 
  Radar, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Maximize2, 
  Filter, 
  Crosshair,
  Sliders,
  Send,
  Zap,
  Globe,
  Flame,
  Power
} from 'lucide-react';
import { TacticalNode, TacticalLog } from '../types';

export const SparkTacticalMatrix: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SECURE' | 'ELEVATED' | 'CRIT'>('ALL');
  const [selectedNode, setSelectedNode] = useState<TacticalNode | null>(null);
  const [isSweepActive, setIsSweepActive] = useState(false);
  const [defconState, setDefconState] = useState<'DEFCON 4' | 'DEFCON 3' | 'DEFCON 2'>('DEFCON 4');
  const [terminalInput, setTerminalInput] = useState('');
  
  // Real-time metrics
  const [metrics, setMetrics] = useState({
    latticeLoad: 42.8,
    meshLatency: 2.14,
    anomalyScore: 0.038,
    throughput: 128.4,
    verifiedNodes: 48,
    threatVectors: 0,
  });

  // Logs stream
  const [logs, setLogs] = useState<TacticalLog[]>([
    { id: '1', timestamp: '22:40:12.401', severity: 'INFO', source: 'MESH_INIT', message: 'AEGIS tactical topology synchronized across 48 quantum edge nodes.' },
    { id: '2', timestamp: '22:40:18.892', severity: 'EXEC', source: 'CRYPTO_CORE', message: 'Zero-knowledge consensus proof verified. Epoch delta: +12ms.' },
    { id: '3', timestamp: '22:40:45.104', severity: 'INFO', source: 'RADAR_SWEEP', message: 'Atmospheric telemetry scan completed. No RF perimeter intrusions.' },
    { id: '4', timestamp: '22:41:02.771', severity: 'WARN', source: 'CLUSTER_GAMMA', message: 'Node-07 telemetry jitter delta +4.2ms. Automatic vector rebalance queued.' },
    { id: '5', timestamp: '22:41:20.910', severity: 'EXEC', source: 'AUTONOMOUS', message: 'Autonomous load equalizer dispatched to Sector 3 cluster.' },
  ]);

  // Nodes for the interactive topology graph
  const [nodes, setNodes] = useState<TacticalNode[]>([
    { id: 'NODE-01', name: 'Alpha Core Gateway', sector: 'SEC-1', x: 22, y: 35, status: 'nominal', latency: 1.8, traffic: 89, threatScore: 0.01 },
    { id: 'NODE-02', name: 'Beta Orbital Link', sector: 'SEC-1', x: 38, y: 22, status: 'nominal', latency: 2.4, traffic: 64, threatScore: 0.02 },
    { id: 'NODE-03', name: 'Gamma Deep Relay', sector: 'SEC-2', x: 62, y: 28, status: 'elevated', latency: 4.6, traffic: 92, threatScore: 0.28 },
    { id: 'NODE-04', name: 'Delta Synapse Node', sector: 'SEC-2', x: 78, y: 45, status: 'nominal', latency: 2.1, traffic: 45, threatScore: 0.04 },
    { id: 'NODE-05', name: 'Epsilon Quantum Cache', sector: 'SEC-3', x: 65, y: 72, status: 'nominal', latency: 1.5, traffic: 110, threatScore: 0.01 },
    { id: 'NODE-06', name: 'Zeta Perimeter Reticle', sector: 'SEC-3', x: 35, y: 75, status: 'nominal', latency: 2.9, traffic: 58, threatScore: 0.05 },
    { id: 'NODE-07', name: 'Eta Telemetry Bastion', sector: 'SEC-4', x: 48, y: 50, status: 'nominal', latency: 2.0, traffic: 125, threatScore: 0.02 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic telemetry fluctuation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        latticeLoad: +(40 + Math.random() * 6).toFixed(1),
        meshLatency: +(1.9 + Math.random() * 0.5).toFixed(2),
        anomalyScore: +(0.02 + Math.random() * 0.03).toFixed(3),
        throughput: +(124 + Math.random() * 8).toFixed(1),
        verifiedNodes: 48,
        threatVectors: prev.threatVectors,
      }));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Canvas Node Topology Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle radar sweep circle in center
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maxRadius = Math.min(width, height) * 0.44;

      ctx.save();
      // Outer radar rings
      ctx.strokeStyle = 'rgba(30, 45, 74, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.33, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, maxRadius * 0.66, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Axis crosshairs
      ctx.strokeStyle = 'rgba(30, 45, 74, 0.3)';
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();

      // Sweeping radar beam
      angle += 0.015;
      const sweepGradient = ctx.createConicGradient(angle, centerX, centerY);
      sweepGradient.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
      sweepGradient.addColorStop(0.12, 'rgba(0, 242, 254, 0.0)');
      sweepGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw inter-node connection lines
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const x1 = (n1.x / 100) * width;
          const y1 = (n1.y / 100) * height;
          const x2 = (n2.x / 100) * width;
          const y2 = (n2.y / 100) * height;

          const dist = Math.hypot(x2 - x1, y2 - y1);
          if (dist < width * 0.45) {
            ctx.strokeStyle = n1.status === 'elevated' || n2.status === 'elevated'
              ? 'rgba(255, 159, 28, 0.35)'
              : 'rgba(0, 242, 254, 0.22)';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Moving pulse packet on line
            const packetPos = (Date.now() / 1500 + i * 0.2 + j * 0.3) % 1;
            const px = x1 + (x2 - x1) * packetPos;
            const py = y1 + (y2 - y1) * packetPos;
            ctx.fillStyle = '#00f2fe';
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const nx = (node.x / 100) * width;
        const ny = (node.y / 100) * height;
        const isSelected = selectedNode?.id === node.id;

        // Node glow
        const glowColor = node.status === 'elevated' 
          ? 'rgba(255, 159, 28, 0.5)' 
          : 'rgba(0, 242, 254, 0.5)';

        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isSelected ? 16 : 8;

        // Outer halo
        ctx.strokeStyle = node.status === 'elevated' ? '#ff9f1c' : '#00f2fe';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(nx, ny, isSelected ? 12 : 8, 0, Math.PI * 2);
        ctx.stroke();

        // Inner core
        ctx.fillStyle = node.status === 'elevated' ? '#ff9f1c' : '#00f2fe';
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(node.id, nx + 12, ny - 6);
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${node.latency}ms`, nx + 12, ny + 7);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [nodes, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    // Check hit
    let clicked: TacticalNode | null = null;
    nodes.forEach(n => {
      const nx = (n.x / 100) * width;
      const ny = (n.y / 100) * height;
      if (Math.hypot(clickX - nx, clickY - ny) < 20) {
        clicked = n;
      }
    });

    setSelectedNode(clicked);
  };

  const handleInitiateSweep = () => {
    setIsSweepActive(true);
    const now = new Date().toTimeString().split(' ')[0] + '.042';
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: now, severity: 'EXEC', source: 'MANUAL_TRIGGER', message: 'HIGH-FREQUENCY SENSOR SWEEP INITIATED ACROSS ALL SECTOR VECTORS.' }
    ]);

    setTimeout(() => {
      setIsSweepActive(false);
      const doneTime = new Date().toTimeString().split(' ')[0] + '.812';
      setLogs(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), timestamp: doneTime, severity: 'INFO', source: 'SWEEP_COMPLETE', message: 'Sensor sweep resolved: 0 anomalies, 48 node links authenticated at 99.8% precision.' }
      ]);
    }, 2000);
  };

  const handlePurgeVectors = () => {
    const time = new Date().toTimeString().split(' ')[0] + '.119';
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: time, severity: 'EXEC', source: 'CACHE_PURGE', message: 'Flushed ephemeral route cache. Re-indexing routing matrices.' }
    ]);
  };

  const handleElevateDefense = () => {
    const nextDefcon = defconState === 'DEFCON 4' ? 'DEFCON 3' : defconState === 'DEFCON 3' ? 'DEFCON 2' : 'DEFCON 4';
    setDefconState(nextDefcon);
    const time = new Date().toTimeString().split(' ')[0] + '.550';
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: time, severity: 'WARN', source: 'DEFCON_OVERRIDE', message: `Operational posture shifted to ${nextDefcon}. Tightened telemetry gatekeeper threshold.` }
    ]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toUpperCase();
    const time = new Date().toTimeString().split(' ')[0] + '.201';

    let responseMsg = `Executed directive [${cmd}]: verified.`;
    let sev: 'INFO' | 'EXEC' | 'WARN' = 'EXEC';

    if (cmd === 'STATUS') {
      responseMsg = `Matrix Nominal | 48 Nodes | Latency: ${metrics.meshLatency}ms | Posture: ${defconState}`;
      sev = 'INFO';
    } else if (cmd === 'CLEAR') {
      setLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd.includes('ISOLATE')) {
      responseMsg = `Node isolation vector triggered. Synthetic sandbox created.`;
      sev = 'WARN';
    }

    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), timestamp: time, severity: 'EXEC', source: 'OPERATOR', message: `> ${cmd}` },
      { id: (Date.now() + 1).toString(), timestamp: time, severity: sev, source: 'SYSTEM', message: responseMsg }
    ]);

    setTerminalInput('');
  };

  const filteredNodes = nodes.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SECURE') return n.status === 'nominal';
    if (activeFilter === 'ELEVATED') return n.status === 'elevated';
    if (activeFilter === 'CRIT') return n.threatScore > 0.15;
    return true;
  });

  return (
    <div className="ambient-tactical-bg tactical-grid flex-1 flex flex-col h-full overflow-hidden text-[#dfe2ee] font-sans select-none relative">
      {/* Top Tactical Status Bar */}
      <header className="h-14 bg-[#0a0e16]/90 border-b border-[#1e2d4a]/80 px-6 flex items-center justify-between shrink-0 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
            <h2 className="font-['Space_Grotesk'] text-sm tracking-widest font-bold text-white uppercase">
              AEGIS v2.0 TACTICAL MATRIX
            </h2>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#171c24] text-[#00f2fe] border border-[#1e2d4a]">
            NODE_GRID // ACTIVE
          </span>
          <span className={`text-[11px] font-['JetBrains_Mono'] px-2.5 py-0.5 rounded font-bold border ${
            defconState === 'DEFCON 4' 
              ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' 
              : 'bg-[#ff9f1c]/10 text-[#ff9f1c] border-[#ff9f1c]/40 shadow-[0_0_10px_rgba(255,159,28,0.2)]'
          }`}>
            {defconState}
          </span>
        </div>

        {/* Global Tactical Control Triggers */}
        <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
          <button
            onClick={handleInitiateSweep}
            disabled={isSweepActive}
            type="button"
            className="px-3 py-1.5 rounded bg-[#00f2fe]/10 hover:bg-[#00f2fe] hover:text-[#04070d] text-[#00f2fe] border border-[#00f2fe] transition-all duration-150 uppercase tracking-wider font-semibold cursor-pointer shadow-[0_0_8px_rgba(0,242,254,0.25)] flex items-center gap-1.5"
          >
            <Radar className={`w-3.5 h-3.5 ${isSweepActive ? 'animate-spin' : ''}`} />
            <span>{isSweepActive ? 'SWEEPING...' : 'INITIATE SWEEP'}</span>
          </button>

          <button
            onClick={handleElevateDefense}
            type="button"
            className="px-3 py-1.5 rounded bg-[#ff9f1c]/10 hover:bg-[#ff9f1c] hover:text-[#04070d] text-[#ff9f1c] border border-[#ff9f1c] transition-all duration-150 uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>POSTURE OVERRIDE</span>
          </button>

          <button
            onClick={handlePurgeVectors}
            type="button"
            className="px-3 py-1.5 rounded bg-[#171c24] hover:bg-[#262a33] text-gray-300 border border-[#1e2d4a] transition-colors uppercase tracking-wider cursor-pointer"
          >
            PURGE CACHE
          </button>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-3 overflow-hidden">
        {/* Metric HUD Cards Strip (Top 12 cols) */}
        <div className="col-span-12 grid grid-cols-4 gap-3 h-20 shrink-0">
          {/* Card 1: Lattice Load */}
          <div className="bg-[#0b1220]/80 border border-[#1e2d4a]/70 rounded-md p-3 backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-[#00f2fe]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] tracking-wider text-[#64748b] uppercase">
              <span>LATTICE LOAD</span>
              <span className="text-[#00f2fe]">NOMINAL</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f1f5f9] tracking-tight">
                {metrics.latticeLoad}%
              </span>
              <div className="flex items-center gap-1 text-[11px] font-['JetBrains_Mono'] text-emerald-400">
                <span>Δ -0.4%</span>
              </div>
            </div>
            {/* Visual Micro Progress Bar */}
            <div className="w-full bg-[#171c24] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#00f2fe] h-full transition-all duration-500 shadow-[0_0_8px_#00f2fe]" 
                style={{ width: `${metrics.latticeLoad}%` }}
              />
            </div>
          </div>

          {/* Card 2: Mesh Latency */}
          <div className="bg-[#0b1220]/80 border border-[#1e2d4a]/70 rounded-md p-3 backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-[#00f2fe]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] tracking-wider text-[#64748b] uppercase">
              <span>MESH LATENCY</span>
              <span className="text-emerald-400">ULTRA-LOW</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f1f5f9] tracking-tight">
                {metrics.meshLatency} <span className="text-xs font-normal text-gray-400">ms</span>
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400">99.98% SLA</span>
            </div>
            <div className="w-full bg-[#171c24] h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[24%]" />
            </div>
          </div>

          {/* Card 3: Threat Vectors */}
          <div className="bg-[#0b1220]/80 border border-[#1e2d4a]/70 rounded-md p-3 backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-[#ff9f1c]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] tracking-wider text-[#64748b] uppercase">
              <span>ACTIVE THREAT ANOMALIES</span>
              <span className="text-[#ff9f1c]">DEFENSE BARRIER</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f1f5f9] tracking-tight">
                {metrics.anomalyScore} <span className="text-xs font-normal text-gray-400">INDEX</span>
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400">0 CRITICAL</span>
            </div>
            <div className="w-full bg-[#171c24] h-1 rounded-full overflow-hidden">
              <div className="bg-[#ff9f1c] h-full w-[8%]" />
            </div>
          </div>

          {/* Card 4: Throughput */}
          <div className="bg-[#0b1220]/80 border border-[#1e2d4a]/70 rounded-md p-3 backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-[#00f2fe]/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] tracking-wider text-[#64748b] uppercase">
              <span>SYNAPSE THROUGHPUT</span>
              <span className="text-[#00f2fe]">48/48 NODES</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f1f5f9] tracking-tight">
                {metrics.throughput} <span className="text-xs font-normal text-gray-400">Gbps</span>
              </span>
              <span className="text-[11px] font-['JetBrains_Mono'] text-[#00f2fe]">+4.2% PEAK</span>
            </div>
            <div className="w-full bg-[#171c24] h-1 rounded-full overflow-hidden">
              <div className="bg-[#00f2fe] h-full w-[85%]" />
            </div>
          </div>
        </div>

        {/* Center: Autonomous Node Graph Viewport (8 cols) */}
        <div className="col-span-8 bg-[#0b1220]/85 border border-[#1e2d4a] rounded-md backdrop-blur flex flex-col relative overflow-hidden">
          {/* Panel Top Header Bar */}
          <div className="h-10 border-b border-[#1e2d4a] px-4 flex items-center justify-between bg-[#0e1729]/70 shrink-0">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-wider text-white uppercase">
                AUTONOMOUS TOPOLOGY MAP
              </span>
              <span className="text-[10px] font-['JetBrains_Mono'] text-gray-400">
                (Click node to inspect telemetry vector)
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 text-[10px] font-['JetBrains_Mono']">
              {(['ALL', 'SECURE', 'ELEVATED'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    activeFilter === filter 
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/50' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Topology Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={420}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-crosshair"
            />

            {/* Selected Node Telemetry HUD Popover */}
            {selectedNode && (
              <div className="absolute top-4 right-4 w-64 bg-[#0e1729]/95 border border-[#00f2fe]/60 rounded-md p-3 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[#1e2d4a] pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_6px_#00f2fe]" />
                    <span className="text-xs font-['JetBrains_Mono'] font-bold text-white">{selectedNode.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px] font-['JetBrains_Mono']">
                  <div className="text-gray-300 font-semibold">{selectedNode.name}</div>
                  <div className="flex justify-between text-gray-400">
                    <span>SECTOR:</span>
                    <span className="text-white">{selectedNode.sector}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>LATENCY:</span>
                    <span className="text-[#00f2fe]">{selectedNode.latency} ms</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>TRAFFIC:</span>
                    <span className="text-white">{selectedNode.traffic} MB/s</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>STATUS:</span>
                    <span className={selectedNode.status === 'nominal' ? 'text-emerald-400' : 'text-[#ff9f1c]'}>
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1e2d4a] flex gap-1.5">
                  <button
                    onClick={() => {
                      const t = new Date().toTimeString().split(' ')[0] + '.310';
                      setLogs(prev => [
                        ...prev,
                        { id: Date.now().toString(), timestamp: t, severity: 'EXEC', source: 'NODE_REROUTE', message: `Calibrated telemetry routing vector on ${selectedNode.id}` }
                      ]);
                      setSelectedNode(null);
                    }}
                    className="flex-1 py-1 text-[10px] font-['JetBrains_Mono'] font-bold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 rounded hover:bg-[#00f2fe] hover:text-black transition-colors cursor-pointer"
                  >
                    CALIBRATE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Flank: Telemetry Inspector & Node Registry (4 cols) */}
        <div className="col-span-4 bg-[#0b1220]/85 border border-[#1e2d4a] rounded-md backdrop-blur flex flex-col overflow-hidden">
          <div className="h-10 border-b border-[#1e2d4a] px-4 flex items-center justify-between bg-[#0e1729]/70 shrink-0">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-wider text-white uppercase">
                ACTIVE NODE MATRIX
              </span>
            </div>
            <span className="text-[10px] font-['JetBrains_Mono'] text-[#10b981]">ALL SECURE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-2.5 rounded border transition-all cursor-pointer font-['JetBrains_Mono'] ${
                  selectedNode?.id === node.id
                    ? 'bg-[#15233d] border-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                    : 'bg-[#0f1726]/60 border-[#1e2d4a]/80 hover:bg-[#151e30]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{node.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                    node.status === 'nominal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {node.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-gray-300 truncate">{node.name}</div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 pt-1.5 border-t border-[#1e2d4a]/50">
                  <span>{node.sector}</span>
                  <span className="text-[#00f2fe]">{node.latency}ms</span>
                  <span>{node.traffic} MB/s</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Panel: Log Stream Terminal (12 cols) */}
        <div className="col-span-12 h-44 bg-[#060a12]/95 border border-[#1e2d4a] rounded-md flex flex-col overflow-hidden shrink-0">
          <div className="h-8 border-b border-[#1e2d4a] px-4 flex items-center justify-between bg-[#0b1220] shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-wider text-white uppercase">
                REAL-TIME TELEMETRY LOG STREAM
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-['JetBrains_Mono'] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                120Hz STREAM
              </span>
              <span>BUFFER: 1024K</span>
            </div>
          </div>

          {/* Scrolling log text */}
          <div 
            ref={logContainerRef}
            className="flex-1 overflow-y-auto p-2 font-['JetBrains_Mono'] text-[11px] space-y-1 select-text"
          >
            {logs.map((log) => {
              let sevColor = 'text-gray-400';
              if (log.severity === 'EXEC') sevColor = 'text-[#00f2fe] font-bold';
              if (log.severity === 'WARN') sevColor = 'text-[#ff9f1c] font-bold';
              if (log.severity === 'CRIT') sevColor = 'text-red-400 font-bold';
              if (log.severity === 'INFO') sevColor = 'text-emerald-400';

              return (
                <div key={log.id} className="flex gap-2 items-baseline leading-relaxed">
                  <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`px-1 rounded bg-[#171c24] shrink-0 text-[10px] ${sevColor}`}>
                    {log.severity}
                  </span>
                  <span className="text-gray-400 shrink-0">[{log.source}]</span>
                  <span className="text-gray-200">{log.message}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive Operator CLI input line */}
          <form 
            onSubmit={handleTerminalSubmit}
            className="h-8 border-t border-[#1e2d4a] px-3 flex items-center gap-2 bg-[#0a0e16]"
          >
            <span className="text-xs font-['JetBrains_Mono'] text-[#00f2fe] select-none">&gt;</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Enter tactical command (e.g., STATUS, INITIATE_SWEEP, CLEAR)..."
              className="flex-1 bg-transparent border-none p-0 text-white font-['JetBrains_Mono'] text-[11.5px] focus:outline-none focus:ring-0 placeholder-gray-600"
            />
            <button 
              type="submit" 
              className="text-[10px] font-['JetBrains_Mono'] text-[#00f2fe] hover:underline uppercase"
            >
              EXEC
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
