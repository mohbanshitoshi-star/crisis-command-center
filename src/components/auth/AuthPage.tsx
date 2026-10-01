import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { User } from '../../services/authService';

interface Props {
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<Props> = ({ onAuthSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 antialiased">
      {/* Centered Authentication Card */}
      <div className="w-full max-w-[440px] bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onAuthSuccess}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={onAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} AEGIS. Agentic Intelligence &amp; Decision System.
      </div>
    </div>
  );
};
