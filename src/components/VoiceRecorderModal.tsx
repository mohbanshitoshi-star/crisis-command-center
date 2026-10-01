import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Info,
  Lock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string, autoSend?: boolean) => void;
}

export const VoiceRecorderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onTranscriptComplete,
}) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('prompt');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check initial permission status if supported
  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'microphone' as any });
          setPermissionStatus(status.state as any);
          status.onchange = () => {
            setPermissionStatus(status.state as any);
            if (status.state === 'granted') {
              setErrorMessage(null);
            }
          };
        } catch (e) {
          setPermissionStatus('unknown');
        }
      }
    };
    checkPermission();
  }, []);

  // Listen to Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopVoice();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      stopVoice();
      return;
    }

    startVoice();

    return () => {
      stopVoice();
    };
  }, [isOpen]);

  const requestMicrophoneAccess = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setPermissionStatus('granted');
      startAudioVisualizer(stream);
      startRecognition();
    } catch (err: any) {
      console.warn('Microphone permission request error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setErrorMessage(
          'Microphone permission is blocked by your browser. Click the lock or camera icon in your address bar to allow it.'
        );
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('No physical microphone was detected on this device.');
      } else {
        setErrorMessage(`Microphone access notice: ${err.message || err.name}`);
      }
    }
  };

  const startAudioVisualizer = (stream: MediaStream) => {
    try {
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
        const checkAudio = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkAudio);
        };
        animFrameRef.current = requestAnimationFrame(checkAudio);
      }
    } catch (e) {
      console.warn('AudioContext setup error:', e);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              currentFinal += result[0].transcript + ' ';
            } else {
              currentInterim += result[0].transcript;
            }
          }

          setTranscript(currentFinal);
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setPermissionStatus('denied');
            setErrorMessage('Microphone access is blocked in this browser tab.');
          } else if (event.error === 'no-speech') {
            // normal silence
          } else {
            setErrorMessage(`Recognition note: ${event.error}`);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (e: any) {
        console.warn('Failed to start speech recognition:', e);
      }
    } else {
      setErrorMessage('Speech recognition is not natively supported by this browser. You can use preset samples below.');
    }
  };

  const startVoice = async () => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    await requestMicrophoneAccess();
  };

  const stopVoice = () => {
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

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

    setAudioLevel(0);
  };

  const handleDone = (autoSend = false) => {
    const fullText = (transcript + ' ' + interimTranscript).trim();
    stopVoice();
    if (fullText) {
      onTranscriptComplete(fullText, autoSend);
    }
    onClose();
  };

  const handleInsertSample = (sample: string) => {
    setTranscript(sample);
    setInterimTranscript('');
  };

  if (!isOpen) return null;

  const currentDisplay = (transcript + ' ' + interimTranscript).trim();

  // Render directly into document.body using React Portal so it is never clipped by sidebar or parent stacking contexts
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopVoice();
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-lg max-h-[90vh] bg-[#141822] border border-[#2b3548] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Title and Close Button */}
        <div className="shrink-0 px-5 py-3 border-b border-[#202737] flex items-center justify-between bg-[#11151f]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-[#00f2fe] animate-pulse' : 'bg-gray-500'}`} />
            <h3 className="text-sm font-semibold text-white">
              {isListening ? 'Voice Input Active' : 'Microphone Ready'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Permission Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b2230] border border-[#2b374d] text-[10px] font-mono text-gray-300">
              {permissionStatus === 'granted' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Allowed</span>
                </>
              ) : permissionStatus === 'denied' ? (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-400 font-semibold">Blocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300 font-semibold">Prompt</span>
                </>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                stopVoice();
                onClose();
              }}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#202737] transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Center Body Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 flex flex-col items-center">
          {/* Glowing Microphone Orb Button */}
          <div className="relative my-1 flex items-center justify-center">
            <div
              className="absolute rounded-full border border-[#00f2fe]/40 transition-all duration-100 pointer-events-none"
              style={{
                width: `${74 + audioLevel * 0.5}px`,
                height: `${74 + audioLevel * 0.5}px`,
                opacity: isListening ? 0.6 : 0.2,
              }}
            />
            <button
              onClick={() => {
                if (isListening) {
                  stopVoice();
                } else {
                  startVoice();
                }
              }}
              type="button"
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-[#00f2fe] to-[#3b82f6] text-[#060a12] shadow-[0_0_20px_rgba(0,242,254,0.5)]'
                  : 'bg-[#252d3d] text-gray-400 hover:text-white'
              }`}
            >
              {isListening ? (
                <Mic className="w-6 h-6 animate-pulse stroke-[2.2]" />
              ) : (
                <MicOff className="w-6 h-6 stroke-[2]" />
              )}
            </button>
          </div>

          {/* Subtitle instructions */}
          <p className="text-xs text-gray-400 max-w-sm">
            {isListening 
              ? 'Listening in real-time... Speak your math problem or daily question clearly.'
              : 'Tap the microphone to begin voice transcription.'}
          </p>

          {/* Live Audio Frequency Equalizer Bar Display */}
          <div className="flex items-center justify-center gap-1 h-5 my-0.5">
            {[10, 24, 40, 65, 90, 55, 75, 35, 60, 80, 45, 25, 70, 40, 15].map((baseH, idx) => {
              const dynamicHeight = isListening ? Math.max(8, (baseH * (audioLevel + 30)) / 100) : 6;
              return (
                <div
                  key={idx}
                  className="w-1 rounded-full bg-[#00f2fe] transition-all duration-75 shadow-[0_0_4px_rgba(0,242,254,0.3)]"
                  style={{ height: `${Math.min(20, dynamicHeight)}px` }}
                />
              );
            })}
          </div>

          {/* Transcript Box */}
          <div className="w-full bg-[#0e121a] border border-[#232c3f] rounded-xl p-3 min-h-[65px] max-h-24 overflow-y-auto text-left shadow-inner">
            {currentDisplay ? (
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                <span>{transcript}</span>
                <span className="text-[#00f2fe] font-medium">{interimTranscript}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 italic">
                "Listening... say 'Calculate loan payment for 25k' or 'Find derivative of x squared'..."
              </p>
            )}
          </div>

          {/* Permission Denied Notice if blocked */}
          {errorMessage && (
            <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-300">Microphone Permission Notice</p>
                  <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">{errorMessage}</p>
                </div>
              </div>

              <div className="bg-[#10141d] p-2 rounded-lg border border-amber-500/20 text-[11px] text-gray-300 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-[#00f2fe]" />
                  <span>How to allow microphone access in your browser:</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-gray-400 pl-1 text-[10px]">
                  <li>Click the <strong>Lock / Settings icon</strong> in your browser address bar.</li>
                  <li>Find <strong>Microphone</strong> and switch it to <strong>Allow</strong>.</li>
                  <li>Click the button below to re-test access.</li>
                </ol>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={requestMicrophoneAccess}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-request Permission</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Spoken Samples */}
          <div className="w-full pt-1">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider block mb-1 text-left">
              Or test with one-click spoken samples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Calculate monthly payment for $25,000 loan at 6.5% interest",
                "50/30/20 budget breakdown on $4,800 monthly income",
                "Find derivative of f(x) = x^3 * e^(2x)",
                "How many gallons of paint for 450 sq ft room?",
              ].map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInsertSample(sample)}
                  className="text-[11px] text-gray-300 hover:text-white bg-[#1a202c] hover:bg-[#252f42] border border-[#293448] px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left truncate max-w-[210px]"
                >
                  "{sample.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Bottom Action Footer Bar */}
        <div className="shrink-0 w-full px-5 py-3 border-t border-[#232c3d] bg-[#10141d] flex items-center justify-between">
          <button
            onClick={() => {
              setTranscript('');
              setInterimTranscript('');
            }}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#1a202c] transition-colors cursor-pointer"
          >
            Clear
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDone(false)}
              disabled={!currentDisplay}
              className="px-3.5 py-1.5 bg-[#202737] hover:bg-[#2b3548] disabled:opacity-40 text-gray-200 text-xs font-semibold rounded-lg border border-[#303c52] transition-colors cursor-pointer"
            >
              Insert into Input
            </button>

            <button
              onClick={() => handleDone(true)}
              disabled={!currentDisplay}
              className="px-4 py-1.5 bg-[#00f2fe] hover:bg-cyan-300 disabled:opacity-40 text-[#060a12] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Aegis</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
