import React from 'react';
import { 
  FileUp, 
  Image as ImageIcon, 
  Code2, 
  Activity, 
  Globe, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAttachContext: (contextType: string, sampleData?: string) => void;
}

export const AttachmentMenu: React.FC<Props> = ({ isOpen, onClose, onAttachContext }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 bottom-full mb-3 w-72 bg-[#161a23] border border-[#2b3345] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="px-3 py-1.5 border-b border-[#232a39] mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Add Context to Prompt</span>
      </div>

      <div className="space-y-0.5">
        <button
          onClick={() => {
            onAttachContext('document', 'Document: 2026 AI Infrastructure Blueprint.pdf (6.4 MB attached)');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-[#202636] transition-colors cursor-pointer text-gray-200"
        >
          <FileUp className="w-4 h-4 text-[#00f2fe]" />
          <div className="text-xs">
            <span className="font-medium block text-white">Upload File / Document</span>
            <span className="text-[11px] text-gray-400">PDF, TXT, CSV, or Markdown</span>
          </div>
        </button>

        <button
          onClick={() => {
            onAttachContext('image', 'Image attached: tactical_reticle_sample.png');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-[#202636] transition-colors cursor-pointer text-gray-200"
        >
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="font-medium block text-white">Upload Reference Image</span>
            <span className="text-[11px] text-gray-400">Analyze charts, HUDs, or diagrams</span>
          </div>
        </button>

        <button
          onClick={() => {
            onAttachContext('tactical', '[AEGIS TACTICAL TELEMETRY ATTACHED: DEFCON 4 | 48 Nodes | Latency 2.1ms | Anomaly: 0.02%]');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-[#202636] transition-colors cursor-pointer text-gray-200"
        >
          <Activity className="w-4 h-4 text-[#ff9f1c]" />
          <div className="text-xs">
            <span className="font-medium block text-white">Attach Spark Telemetry State</span>
            <span className="text-[11px] text-gray-400">Inject real-time node metrics</span>
          </div>
        </button>

        <button
          onClick={() => {
            onAttachContext('code', 'Code snippet: MeshRouter.ts (240 lines)');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-[#202636] transition-colors cursor-pointer text-gray-200"
        >
          <Code2 className="w-4 h-4 text-purple-400" />
          <div className="text-xs">
            <span className="font-medium block text-white">Codebase Context</span>
            <span className="text-[11px] text-gray-400">Import TypeScript or Python module</span>
          </div>
        </button>

        <button
          onClick={() => {
            onAttachContext('web', '[Web Grounding: Enabled Search for real-time 2026 sources]');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-[#202636] transition-colors cursor-pointer text-gray-200"
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <div className="text-xs">
            <span className="font-medium block text-white">Google Search Grounding</span>
            <span className="text-[11px] text-gray-400">Retrieve up-to-the-minute web intel</span>
          </div>
        </button>
      </div>
    </div>
  );
};
