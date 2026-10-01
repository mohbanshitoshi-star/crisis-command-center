import React, { useState } from 'react';
import { Film, Sparkles, Play, Video, Clapperboard, Clock, Settings2 } from 'lucide-react';

export const VideosView: React.FC = () => {
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial drone shot passing over a futuristic tactical intelligence base illuminated in cobalt blue, 4k 60fps');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');

  const clips = [
    {
      id: 'v-1',
      title: 'Orbital Mesh Surveillance Array',
      duration: '0:07',
      thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status: 'Ready',
      model: 'Veo 3.1 Lite'
    },
    {
      id: 'v-2',
      title: 'Autonomous Drone Fleet Vector Sweep',
      duration: '0:14',
      thumb: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      status: 'Ready',
      model: 'Veo 3.1'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Veo Video Studio</h1>
              <p className="text-xs text-gray-400">High-definition generative motion synthesis powered by Veo 3.1</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#00f2fe] bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-3 py-1 rounded-full">
            VEO 3.1 LITE // 1080P
          </span>
        </div>

        {/* Video Prompt Input */}
        <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-5 shadow-xl space-y-4">
          <textarea
            rows={3}
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            placeholder="Describe the cinematic scene, camera motion, lighting and pacing..."
            className="w-full bg-[#161c29] border border-[#263246] rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#1e2535]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Output:</span>
              {(['1080p', '720p', '4k'] as const).map(res => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  type="button"
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    resolution === res 
                      ? 'bg-[#1e2738] text-[#00f2fe] border border-[#374560]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 2400);
              }}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-[#00f2fe] hover:bg-cyan-300 disabled:opacity-40 text-[#060a12] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              <Clapperboard className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering Motion Frames...' : 'Generate 7s Video'}</span>
            </button>
          </div>
        </div>

        {/* Clips Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Synthesized Video Clips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clips.map(clip => (
              <div key={clip.id} className="bg-[#121622] border border-[#222c3d] rounded-2xl overflow-hidden group shadow-lg">
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img src={clip.thumb} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {clip.duration}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{clip.title}</h3>
                    <span className="text-xs text-gray-500 font-mono">{clip.model} • 1080p</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {clip.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
