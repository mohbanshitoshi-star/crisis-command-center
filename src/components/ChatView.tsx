import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Mic, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Bot, 
  User, 
  Activity, 
  Cpu, 
  ExternalLink,
  ChevronUp,
  Volume2,
  Paperclip,
  Share2
} from 'lucide-react';
import { GeminiModelId, Message, AgentPerspective } from '../types';
import { ModelSelectorDropdown } from './ModelSelectorDropdown';
import { AttachmentMenu } from './AttachmentMenu';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import { AgentPerspectiveBar } from './AgentPerspectiveBar';

interface Props {
  messages: Message[];
  onSendMessage: (
    text: string, 
    model: GeminiModelId,
    perspective?: AgentPerspective,
    temperature?: number,
    depth?: 'detailed' | 'concise'
  ) => Promise<void>;
  isLoading: boolean;
  selectedModel: GeminiModelId;
  onSelectModel: (model: GeminiModelId) => void;
  onSwitchToTactical: () => void;
}

export const ChatView: React.FC<Props> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  onSelectModel,
  onSwitchToTactical,
}) => {
  const [inputText, setInputText] = useState('');
  const [perspective, setPerspective] = useState<AgentPerspective>('tactical');
  const [temperature, setTemperature] = useState<number>(0.2);
  const [depth, setDepth] = useState<'detailed' | 'concise'>('detailed');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedContext, setAttachedContext] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedContext) return;
    
    let fullPrompt = inputText.trim();
    if (attachedContext) {
      fullPrompt = `${attachedContext}\n\n${fullPrompt}`;
    }

    const textToSend = fullPrompt;
    setInputText('');
    setAttachedContext(null);
    setShowModelPicker(false);
    setShowAttachmentMenu(false);

    await onSendMessage(textToSend, selectedModel, perspective, temperature, depth);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModelDisplayName = (id: GeminiModelId) => {
    switch (id) {
      case 'gemini-3.1-pro-preview': return 'Gemini 3.1 Pro (Complex)';
      case 'gemini-3.5-flash': return 'Aegis flame';
      case 'gemini-3.1-flash-lite': return 'Aegis flame-core';
      case 'gemini-3.8-flash': return 'Aegis flame';
      default: return 'Aegis flame';
    }
  };

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSpeechInput = () => {
    setIsVoiceModalOpen(true);
  };

  const handleTranscriptComplete = (transcript: string, autoSend = false) => {
    if (autoSend) {
      onSendMessage(transcript, selectedModel);
    } else {
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const promptSuggestions = [
    { label: "Synthesize 2026 AI strategic paradigms", query: "Synthesize the key architectural breakthroughs in AI models and autonomous systems by 2026." },
    { label: "Inspect Spark Tactical Matrix telemetry", query: "Evaluate the current AEGIS tactical telemetry: what is the status of active nodes and threat thresholds?" },
    { label: "Generate high-concurrency TypeScript pipeline", query: "Write a high-performance concurrent processing pipeline in TypeScript for telemetry ingest." },
    { label: "Prepare university study guide for quantum algorithms", query: "Generate a structured academic study guide on quantum key distribution and Byzantine fault tolerance." },
  ];

  const hasMessages = messages.length > 0;

  return (
    <main 
      className="ambient-bg flex-1 flex flex-col relative h-full overflow-hidden" 
      data-purpose="hero-prompt-interface"
    >
      {/* If No messages yet: Centered Hero Screen matching image exactly */}
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
          <div className="w-full max-w-3xl flex flex-col items-center -mt-10">
            {/* Greeting Headline */}
            <h1 className="text-4xl md:text-[44px] font-normal tracking-tight text-[#e2e8f0] mb-8 text-center select-text font-sans">
              Your move, Toshi!
            </h1>

            {/* Attached Context Banner if any */}
            {attachedContext && (
              <div className="w-full mb-3 px-4 py-2 bg-[#1b2230] border border-[#2b3548] rounded-xl flex items-center justify-between text-xs text-cyan-300">
                <span className="truncate">{attachedContext}</span>
                <button 
                  onClick={() => setAttachedContext(null)} 
                  className="text-gray-400 hover:text-white ml-2 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Agent Perspective & Parameters Control Bar */}
            <AgentPerspectiveBar
              perspective={perspective}
              onChangePerspective={setPerspective}
              temperature={temperature}
              onChangeTemperature={setTemperature}
              depth={depth}
              onChangeDepth={setDepth}
            />

            {/* Omnibox Prompt Input Container */}
            <form 
              onSubmit={handleSubmit}
              className="w-full relative"
            >
              <div 
                className="w-full bg-white/[0.07] hover:bg-white/[0.09] backdrop-blur-2xl border border-white/20 hover:border-white/30 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.5)] px-6 py-4 flex items-center justify-between transition-all duration-200 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_30px_rgba(0,242,254,0.2)] focus-within:ring-1 focus-within:ring-cyan-400/30" 
                data-purpose="prompt-pill-container"
              >
                {/* Left Section: Add context (+) button and simulated blinking prompt */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                  {/* Add Attachment (+) Icon */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAttachmentMenu(!showAttachmentMenu);
                      setShowModelPicker(false);
                    }}
                    aria-label="Add file or context" 
                    className="text-gray-400 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full shrink-0 cursor-pointer hover:bg-white/10"
                  >
                    <Plus className="w-5 h-5 stroke-[2]" />
                  </button>

                  {/* Input Text & Cursor Simulation */}
                  <div className="flex items-center text-[16px] text-gray-300 w-full overflow-hidden select-text relative">
                    {!inputText && (
                      <span className="blinking-cursor text-gray-400 font-light text-lg select-none mr-0.5 pointer-events-none">
                        |
                      </span>
                    )}
                    <input 
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask Aegis"
                      className="w-full bg-transparent border-none p-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-[15.5px]"
                    />
                  </div>
                </div>

                {/* Right Section: Model dropdown badge and Audio mic button */}
                <div className="flex items-center gap-3 shrink-0 relative">
                  {/* Model Selector Pill: Flash ▾ */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShowModelPicker(!showModelPicker);
                      setShowAttachmentMenu(false);
                    }}
                    className="bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 backdrop-blur-md shadow-sm"
                  >
                    <span>{getModelDisplayName(selectedModel)}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
                  </button>

                  {/* Audio / Mic Icon Button */}
                  <button 
                    type="button"
                    onClick={handleSpeechInput}
                    aria-label="Use voice input" 
                    className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                    title="Speak with Aegis (Microphone)"
                  >
                    <Mic className="w-5 h-5 stroke-[1.8]" />
                  </button>

                  {/* Send Button */}
                  {inputText.trim() && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#00f2fe] text-[#060a12] p-1.5 rounded-full hover:bg-cyan-300 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.5)]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Popups */}
              <AttachmentMenu 
                isOpen={showAttachmentMenu} 
                onClose={() => setShowAttachmentMenu(false)}
                onAttachContext={(type, sample) => setAttachedContext(sample || `[Attached ${type}]`)}
              />

              {showModelPicker && (
                <ModelSelectorDropdown
                  selectedModel={selectedModel}
                  onSelect={(m) => {
                    onSelectModel(m);
                    setShowModelPicker(false);
                  }}
                  onClose={() => setShowModelPicker(false)}
                  thinkingEnabled={thinkingEnabled}
                  onToggleThinking={() => setThinkingEnabled(!thinkingEnabled)}
                />
              )}
            </form>

            {/* Quick Starter Suggestions */}
            <div className="mt-8 flex flex-wrap gap-2.5 justify-center max-w-2xl">
              {promptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.query, selectedModel)}
                  type="button"
                  className="px-4 py-2 rounded-full text-xs font-medium text-gray-300 bg-white/[0.05] hover:bg-white/[0.1] hover:text-white border border-white/10 hover:border-cyan-400/40 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#00f2fe]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Conversation View with Messages */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Session Header */}
          <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-[#080d16]/65 backdrop-blur-2xl shrink-0 z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">Active Session</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#00f2fe] border border-white/15 font-mono backdrop-blur-md">
                {getModelDisplayName(selectedModel)}
              </span>
              {thinkingEnabled && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                  Thinking Active
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onSwitchToTactical}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#00f2fe] bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 backdrop-blur-md transition-all cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.15)]"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>SPARK MATRIX HUD</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isThinkingOpen = expandedThinking[msg.id];

              return (
                <div key={msg.id} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                      <Sparkles className="w-4 h-4 text-[#060a12]" />
                    </div>
                  )}

                  <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* User Message Bubble */}
                    {isUser ? (
                      <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/20 backdrop-blur-xl text-white px-5 py-3 rounded-2xl rounded-tr-sm border border-cyan-400/30 shadow-[0_4px_20px_rgba(0,242,254,0.15)] text-[15px] leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      /* Model Response Box */
                      <div className="space-y-3 w-full">
                        {/* Internal Thinking Process Accordion if present */}
                        {msg.thinkingProcess && (
                          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl overflow-hidden text-xs">
                            <button
                              onClick={() => toggleThinking(msg.id)}
                              type="button"
                              className="w-full px-3.5 py-2 flex items-center justify-between text-gray-400 hover:text-gray-200 transition-colors bg-white/[0.04] cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                                <span className="font-mono text-[11px] text-purple-300">THOUGHT TRACE (2,140 tokens verified)</span>
                              </div>
                              {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            {isThinkingOpen && (
                              <div className="p-3 font-mono text-[11px] text-gray-400 bg-black/30 leading-relaxed border-t border-white/10 whitespace-pre-line">
                                {msg.thinkingProcess}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Model Main Content */}
                        <div className="bg-[#0e1422]/65 backdrop-blur-xl border border-white/10 rounded-2xl rounded-tl-sm p-6 shadow-[0_12px_36px_rgba(0,0,0,0.35)] text-[15px] text-[#e2e8f0] leading-relaxed prose prose-invert max-w-none">
                          {msg.perspective && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold tracking-wide backdrop-blur-md">
                                Perspective: {msg.perspective}
                              </span>
                            </div>
                          )}
                          <div className="whitespace-pre-line">{msg.content}</div>

                          {/* Sources Grounding if any */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-[#232a39] flex flex-wrap gap-2">
                              <span className="text-[11px] text-gray-500 font-mono self-center">GROUNDED SOURCES:</span>
                              {msg.sources.map((src, idx) => (
                                <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-[#1e2535] text-cyan-300 border border-[#28344c] flex items-center gap-1 font-mono">
                                  <ExternalLink className="w-3 h-3" />
                                  {src}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons below Model response */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            type="button"
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => onSendMessage(`Regenerate previous answer with enhanced technical depth: "${msg.content.slice(0, 50)}..."`, selectedModel)}
                            type="button"
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#273042] border border-[#3b4760] flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-gray-200">T</span>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#3b82f6] flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#060a12]" />
                </div>
                <div className="bg-[#0e1422]/70 backdrop-blur-xl border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
                  <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce [animation-delay:0.2s] shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
                  <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce [animation-delay:0.4s] shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
                  <span className="text-xs font-mono text-gray-300 ml-1">Aegis synthesizing response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Omnibox Input in Active Conversation */}
          <div className="p-4 bg-[#070b14]/75 backdrop-blur-2xl border-t border-white/10 shrink-0">
            <div className="max-w-4xl mx-auto relative">
              <AgentPerspectiveBar
                perspective={perspective}
                onChangePerspective={setPerspective}
                temperature={temperature}
                onChangeTemperature={setTemperature}
                depth={depth}
                onChangeDepth={setDepth}
              />
              <form onSubmit={handleSubmit}>
                <div className="w-full bg-white/[0.06] hover:bg-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-white/25 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-5 py-3 flex items-center justify-between transition-all duration-200 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_25px_rgba(0,242,254,0.2)] focus-within:ring-1 focus-within:ring-cyan-400/30">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:bg-white/10 p-1 rounded-full"
                    >
                      <Plus className="w-5 h-5 stroke-[2]" />
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask Aegis a follow up..."
                      className="w-full bg-transparent border-none p-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-[15px]"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 backdrop-blur-md"
                    >
                      <span>{getModelDisplayName(selectedModel)}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSpeechInput}
                      className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Speak with Aegis (Microphone)"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="bg-[#00f2fe] disabled:opacity-30 disabled:cursor-not-allowed text-[#060a12] p-1.5 rounded-full hover:bg-cyan-300 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.4)]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AttachmentMenu 
                  isOpen={showAttachmentMenu} 
                  onClose={() => setShowAttachmentMenu(false)}
                  onAttachContext={(type, sample) => setAttachedContext(sample || `[Attached ${type}]`)}
                />

                {showModelPicker && (
                  <ModelSelectorDropdown
                    selectedModel={selectedModel}
                    onSelect={(m) => {
                      onSelectModel(m);
                      setShowModelPicker(false);
                    }}
                    onClose={() => setShowModelPicker(false)}
                    thinkingEnabled={thinkingEnabled}
                    onToggleThinking={() => setThinkingEnabled(!thinkingEnabled)}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Voice Dictation & Speech Recognition Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={handleTranscriptComplete}
      />
    </main>
  );
};
