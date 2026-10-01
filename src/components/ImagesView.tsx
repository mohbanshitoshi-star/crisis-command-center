import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Wand2, 
  Ratio,
  Maximize2
} from 'lucide-react';
import { GeneratedImageItem } from '../types';

export const ImagesView: React.FC = () => {
  const [prompt, setPrompt] = useState('Cybernetic aerospace HUD tactical interface with glowing cyan reticles and obsidian glassmorphism, 8k resolution');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState('Tactical Aerospace HUD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [gallery, setGallery] = useState<GeneratedImageItem[]>([
    {
      id: 'img-1',
      prompt: 'AEGIS tactical defense command center with holographic radar sweeps and glowing telemetry matrix',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16:9',
      model: 'gemini-3.1-flash-image',
      createdAt: '2 mins ago',
    },
    {
      id: 'img-2',
      prompt: 'Autonomous quantum edge node mesh floating in deep indigo atmosphere with laser interconnects',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16:9',
      model: 'gemini-3.1-flash-image',
      createdAt: '15 mins ago',
    },
    {
      id: 'img-3',
      prompt: 'Minimalist cyber-intelligence workstation displaying orbital tracking satellites and real-time nodes',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16:9',
      model: 'gemini-3.1-flash-image',
      createdAt: '1 hour ago',
    },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newImg: GeneratedImageItem = {
        id: `img-${Date.now()}`,
        prompt: `${selectedStyle}: ${prompt}`,
        url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
        aspectRatio,
        model: 'gemini-3.1-flash-image',
        createdAt: 'Just now',
      };
      setGallery(prev => [newImg, ...prev]);
      setIsGenerating(false);
    }, 1800);
  };

  const styles = [
    'Tactical Aerospace HUD',
    'Photorealistic 8K',
    'Cyberpunk Obsidian',
    'Vector Schematic',
    'Architectural Blueprint',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-6 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Multimodal Image Studio</h1>
              <p className="text-xs text-gray-400">High-fidelity visual synthesis powered by Imagen & Gemini Vision</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#00f2fe] bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-3 py-1 rounded-full">
            NANO BANANA 2 // 2K/4K
          </span>
        </div>

        {/* Prompt Input Box */}
        <form onSubmit={handleGenerate} className="bg-[#121622] border border-[#222c3d] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate in detail..."
              className="w-full bg-[#161c29] border border-[#263246] rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Style Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Style:</span>
              {styles.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStyle(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    selectedStyle === s 
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40' 
                      : 'bg-[#18202d] text-gray-400 hover:text-white border border-[#222c3d]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Ratio:</span>
              {(['16:9', '1:1', '4:3', '9:16'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    aspectRatio === r 
                      ? 'bg-[#1e2738] text-white border border-[#374560]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#1e2535]">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 bg-[#00f2fe] hover:bg-cyan-300 disabled:opacity-40 text-[#060a12] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Visual Asset'}</span>
            </button>
          </div>
        </form>

        {/* Gallery */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Recent Synthesized Artifacts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(item => (
              <div 
                key={item.id}
                className="bg-[#121622] border border-[#222c3d] rounded-2xl overflow-hidden group hover:border-[#00f2fe]/50 transition-all duration-300 flex flex-col shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img 
                    src={item.url} 
                    alt={item.prompt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-[#00f2fe]">
                    {item.aspectRatio}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{item.prompt}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-2 border-t border-[#1d2535]">
                    <span>{item.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.prompt);
                          setCopiedId(item.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Copy prompt"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Open image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
