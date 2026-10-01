import React, { useState } from 'react';
import { Clock, Shield, Check, X, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activityEnabled, setActivityEnabled] = useState(false);
  const [retentionPeriod, setRetentionPeriod] = useState<'3' | '18' | '36'>('18');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#141822] border border-[#2b3548] rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#232c3d] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00f2fe]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Gemini Apps Activity</h2>
              <p className="text-xs text-gray-400">Manage privacy, conversation retention, and human review settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#202737] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle State */}
        <div className="p-4 rounded-xl bg-[#1b2230] border border-[#2b374d] flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <span className="text-sm font-medium text-white block">
              Gemini Apps Activity is {activityEnabled ? 'On' : 'Off'}
            </span>
            <p className="text-xs text-gray-400 leading-snug">
              When turned on, your chats and prompt history are saved to your account to improve model responses and personalization.
            </p>
          </div>
          <button
            onClick={() => setActivityEnabled(!activityEnabled)}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              activityEnabled ? 'bg-[#00f2fe]' : 'bg-[#2a3449]'
            }`}
          >
            <div 
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                activityEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>

        {/* Retention Settings */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Auto-delete retention</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '3', label: '3 months' },
              { id: '18', label: '18 months' },
              { id: '36', label: '36 months' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setRetentionPeriod(item.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                  retentionPeriod === item.id 
                    ? 'bg-[#1e2638] text-[#00f2fe] border-[#00f2fe]/50' 
                    : 'bg-[#151a24] text-gray-400 border-[#232c3d] hover:bg-[#1a202c]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-[#232c3d] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete all past activity</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00f2fe] text-black text-xs font-bold uppercase rounded-xl hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.3)]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
