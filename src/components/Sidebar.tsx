import React from 'react';
import { 
  PenSquare, 
  Search, 
  GraduationCap, 
  Image as ImageIcon, 
  Film, 
  Library, 
  FlaskConical, 
  Plus, 
  FileText, 
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ClipboardList,
  Calculator,
  Database,
  Sun,
  Moon
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onOpenActivity: () => void;
  onNewNotebook: () => void;
  recentChatsCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onNewChat,
  onOpenSearch,
  onOpenActivity,
  onNewNotebook,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isSpark = currentTab === 'spark';

  return (
    <aside 
      className="w-[280px] h-full bg-[#0b101c]/65 backdrop-blur-2xl flex flex-col justify-between border-r border-white/10 shrink-0 z-20 select-none text-[#e3e8f0] shadow-[4px_0_30px_rgba(0,0,0,0.4)]"
      data-purpose="sidebar-navigation"
    >
      {/* Sidebar Upper Section */}
      <div className="p-4 flex flex-col gap-6 overflow-y-auto">
        {/* Top Toggle Switch: Chat / Spark BETA + (Light and Dark) Theme Button */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 p-1 rounded-full flex items-center gap-1 w-fit shadow-inner" data-purpose="mode-toggle">
          <button
            onClick={() => onSelectTab('chat')}
            type="button"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              !isSpark
                ? 'bg-white/15 text-white shadow-sm border border-white/15 backdrop-blur-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => onSelectTab('spark')}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              isSpark
                ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.3)] backdrop-blur-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className={isSpark ? 'font-semibold tracking-wide' : ''}>Spark</span>
            <span className={`text-[9px] tracking-wide font-bold px-1.5 py-0.5 rounded ${
              isSpark ? 'bg-[#00f2fe]/30 text-[#00f2fe]' : 'bg-white/10 text-cyan-300'
            }`}>
              BETA
            </span>
          </button>

          {/* Theme (Light and Dark) Button Next to Spark Button */}
          <div className="w-px h-3.5 bg-white/15 mx-0.5" />
          <button
            onClick={onToggleTheme}
            type="button"
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-white/10"
            title={theme === 'dark' ? "Switch to Light theme" : "Switch to Dark theme"}
            aria-label="Toggle light and dark theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex flex-col space-y-1 text-sm text-[#9ba3af]" data-purpose="primary-links">
          {/* New chat */}
          <button
            onClick={onNewChat}
            type="button"
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10 border border-transparent transition-all text-left w-full cursor-pointer group"
          >
            <PenSquare className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 stroke-[1.8] transition-colors" />
            <span className="font-normal text-[14px] text-gray-300 group-hover:text-white">New chat</span>
          </button>

          {/* Search chats */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10 border border-transparent transition-all text-left w-full cursor-pointer group"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 stroke-[1.8] transition-colors" />
            <span className="font-normal text-[14px] text-gray-300 group-hover:text-white">Search chats</span>
            <span className="ml-auto text-[11px] font-mono text-gray-400 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
          </button>

          {/* Situation-Aware Crisis Resolution */}
          <button
            onClick={() => onSelectTab('crisis')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'crisis' 
                ? 'bg-white/[0.09] text-white font-medium border-rose-500/30 backdrop-blur-md shadow-[0_4px_16px_rgba(244,63,94,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 stroke-[1.8] ${currentTab === 'crisis' ? 'text-rose-400' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Crisis Resolution</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">AGENT</span>
          </button>

          {/* Decision & Action Planner */}
          <button
            onClick={() => onSelectTab('decision')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'decision' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <ClipboardList className={`w-4 h-4 stroke-[1.8] ${currentTab === 'decision' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Decision Planner</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">CORE</span>
          </button>

          {/* Step-by-Step Problem Solver */}
          <button
            onClick={() => onSelectTab('solver')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'solver' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <Calculator className={`w-4 h-4 stroke-[1.8] ${currentTab === 'solver' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Problem Solver</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00f2fe]/20 text-[#00f2fe] border border-cyan-400/30">NEW</span>
          </button>

          {/* Supabase / Cloud SQL Database Tables */}
          <button
            onClick={() => onSelectTab('database')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'database' 
                ? 'bg-white/[0.09] text-white font-medium border-emerald-500/30 backdrop-blur-md shadow-[0_4px_16px_rgba(16,185,129,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <Database className={`w-4 h-4 stroke-[1.8] ${currentTab === 'database' ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Database Tables</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">SQL</span>
          </button>

          {/* Students */}
          <button
            onClick={() => onSelectTab('students')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'students' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <GraduationCap className={`w-4 h-4 stroke-[1.8] ${currentTab === 'students' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Students</span>
          </button>

          {/* Images */}
          <button
            onClick={() => onSelectTab('images')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'images' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <ImageIcon className={`w-4 h-4 stroke-[1.8] ${currentTab === 'images' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Images</span>
          </button>

          {/* Videos */}
          <button
            onClick={() => onSelectTab('videos')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'videos' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <Film className={`w-4 h-4 stroke-[1.8] ${currentTab === 'videos' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Videos</span>
          </button>

          {/* Library */}
          <button
            onClick={() => onSelectTab('library')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'library' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <Library className={`w-4 h-4 stroke-[1.8] ${currentTab === 'library' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Library</span>
          </button>

          {/* Labs */}
          <button
            onClick={() => onSelectTab('labs')}
            type="button"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer group border ${
              currentTab === 'labs' 
                ? 'bg-white/[0.09] text-white font-medium border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,242,254,0.15)]' 
                : 'border-transparent hover:bg-white/[0.06] hover:text-gray-100 hover:border-white/10'
            }`}
          >
            <FlaskConical className={`w-4 h-4 stroke-[1.8] ${currentTab === 'labs' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[14px]">Labs</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">EXP</span>
          </button>
        </nav>

        {/* Notebooks Section */}
        <div className="pt-2 flex flex-col space-y-1.5" data-purpose="notebooks-section">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">Notebooks</span>
          </div>

          {/* New notebook button */}
          <button
            onClick={onNewNotebook}
            type="button"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent rounded-xl transition-all text-left w-full cursor-pointer group"
          >
            <Plus className="w-4 h-4 stroke-[2] text-gray-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-[13.5px]">New notebook</span>
          </button>

          {/* Saved Notebook Item */}
          <button
            onClick={() => onSelectTab('notebook')}
            type="button"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all text-left w-full cursor-pointer group truncate border ${
              currentTab === 'notebook' 
                ? 'bg-white/[0.09] text-white border-cyan-400/30 backdrop-blur-md' 
                : 'border-transparent text-gray-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 stroke-[1.8] ${currentTab === 'notebook' ? 'text-[#00f2fe]' : 'text-gray-400 group-hover:text-cyan-300'}`} />
            <span className="truncate text-[13.5px]">The AI Revolution of 2026: Innovat...</span>
          </button>
        </div>
      </div>

      {/* Sidebar Bottom Section / Status */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-md" data-purpose="sidebar-footer">
        <div className="flex items-start gap-3 text-xs text-gray-400">
          <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5 stroke-[1.8]" />
          <div className="flex flex-col space-y-0.5 leading-snug">
            <span className="text-gray-200 font-medium text-[13px]">Gemini Apps Activity is off</span>
            <button
              onClick={onOpenActivity}
              type="button"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors text-left cursor-pointer"
            >
              Turn it on here
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
