import React, { useEffect, useState } from 'react';

interface Props {
  theme?: 'dark' | 'light';
}

export const GlassBackground: React.FC<Props> = ({ theme = 'dark' }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const isLight = theme === 'light';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700 ${
        isLight ? 'bg-[#f0f4f9]' : 'bg-[#07090e]'
      }`}
      aria-hidden="true"
    >
      {/* Base Frosted Mesh Gradient Field */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 opacity-90"
        style={{
          background: isLight 
            ? `
              radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(6, 182, 212, 0.18) 0%, rgba(99, 102, 241, 0.12) 28%, transparent 55%),
              radial-gradient(circle at 15% 20%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
              radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.16) 0%, transparent 50%),
              radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(45, 212, 191, 0.15) 0%, transparent 45%),
              #f0f4f9
            `
            : `
              radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 242, 254, 0.12) 0%, rgba(99, 102, 241, 0.08) 28%, transparent 55%),
              radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.16) 0%, transparent 45%),
              radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.14) 0%, transparent 45%),
              #07090e
            `
        }}
      />

      {/* Fluted & Ribbed Glass Refraction Lines (Architectural Glass Sheen) */}
      <div 
        className={`absolute inset-0 mix-blend-overlay ${isLight ? 'opacity-[0.06]' : 'opacity-[0.035]'}`}
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -45deg,
              ${isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'} 0px,
              ${isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'} 2px,
              transparent 2px,
              transparent 14px
            )
          `
        }}
      />

      {/* Floating Prismatic Glass Sphere 1 (Top-Right) */}
      <div 
        className="absolute -top-12 right-[12%] w-[420px] h-[420px] rounded-full animate-pulse [animation-duration:10s]"
        style={{
          background: isLight 
            ? 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(6, 182, 212, 0.25) 35%, rgba(147, 51, 234, 0.12) 65%, transparent 80%)'
            : 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.22) 0%, rgba(0, 242, 254, 0.15) 30%, rgba(99, 102, 241, 0.08) 60%, rgba(10, 14, 22, 0) 75%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isLight ? 'inset 0 2px 20px rgba(255, 255, 255, 0.9), 0 20px 40px rgba(0, 0, 0, 0.08)' : 'inset 0 2px 18px rgba(255, 255, 255, 0.25), 0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Floating Prismatic Glass Sphere 2 (Bottom-Left) */}
      <div 
        className="absolute -bottom-24 left-[8%] w-[480px] h-[480px] rounded-full"
        style={{
          background: isLight 
            ? 'radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.85) 0%, rgba(168, 85, 247, 0.18) 35%, rgba(14, 165, 233, 0.1) 65%, transparent 80%)'
            : 'radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.18) 0%, rgba(168, 85, 247, 0.12) 35%, rgba(14, 165, 233, 0.06) 65%, transparent 80%)',
          backdropFilter: 'blur(45px)',
          WebkitBackdropFilter: 'blur(45px)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.75)' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isLight ? 'inset 0 -2px 24px rgba(255, 255, 255, 0.8), 0 25px 50px rgba(0, 0, 0, 0.06)' : 'inset 0 -2px 20px rgba(255, 255, 255, 0.18), 0 30px 80px rgba(0, 0, 0, 0.6)',
        }}
      />

      {/* Prismatic Glass Pill / Capsule Accent (Center-Right Refraction) */}
      <div 
        className="absolute top-[38%] -right-16 w-[340px] h-[520px] rounded-[140px] rotate-[28deg] opacity-70"
        style={{
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(6, 182, 212, 0.15) 35%, rgba(139, 92, 246, 0.1) 70%, rgba(255, 255, 255, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 242, 254, 0.08) 35%, rgba(139, 92, 246, 0.06) 70%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(35px)',
          WebkitBackdropFilter: 'blur(35px)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: isLight ? 'inset 1px 1px 16px rgba(255, 255, 255, 0.8), 0 20px 40px rgba(0, 0, 0, 0.05)' : 'inset 1px 1px 12px rgba(255, 255, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* Center Caustic Glass Light Beam (Refracted Specular Sheen) */}
      <div 
        className={`absolute top-0 left-1/4 w-[60vw] h-[80vh] pointer-events-none ${isLight ? 'opacity-30' : 'opacity-40 mix-blend-screen'}`}
        style={{
          background: isLight 
            ? 'radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.8) 0%, rgba(6, 182, 212, 0.12) 40%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 242, 254, 0.06) 40%, transparent 70%)',
        }}
      />

      {/* Prismatic Rainbow Glass Sheen (Subtle Chromatic Aberration Edge) */}
      <div 
        className={`absolute -top-32 left-[40%] w-[500px] h-[500px] rounded-full blur-[90px] ${isLight ? 'opacity-25' : 'opacity-30'}`}
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, #00f2fe 0deg, #3b82f6 90deg, #a855f7 180deg, #ec4899 270deg, #00f2fe 360deg)'
        }}
      />

      {/* Frosted Vignette Border */}
      <div className={`absolute inset-0 pointer-events-none ${isLight ? 'shadow-[inset_0_0_100px_rgba(255,255,255,0.7)]' : 'shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]'}`} />
    </div>
  );
};

