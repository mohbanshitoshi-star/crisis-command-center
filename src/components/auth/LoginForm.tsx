import React, { useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PhoneAuthForm } from './PhoneAuthForm';
import { authService, User } from '../../services/authService';
import { AlertCircle, CheckCircle2, Mail, Phone } from 'lucide-react';

interface Props {
  onSuccess: (user: User) => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSuccess, onSwitchToSignup }) => {
  const [method, setMethod] = useState<'options' | 'email' | 'phone'>('options');
  const [email, setEmail] = useState('mohbanshitoshi@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await authService.loginWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.loginWithEmail(email, password);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive a password reset link.');
      return;
    }
    setForgotPasswordSent(true);
    setErrorMessage(null);
  };

  // If Phone method is selected
  if (method === 'phone') {
    return (
      <PhoneAuthForm
        mode="login"
        onSuccess={onSuccess}
        onBackToOptions={() => setMethod('options')}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Top Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-lg tracking-wider mb-2.5 shadow-sm">
          A
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          AEGIS
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
          Agentic Intelligence &amp; Decision System
        </p>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to continue to AEGIS</p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Forgot Password Confirmation Banner */}
      {forgotPasswordSent && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>Password reset link sent to <strong>{email}</strong>. Check your inbox.</span>
        </div>
      )}

      {/* Screen 1: Options Hub */}
      {method === 'options' ? (
        <div className="space-y-3">
          {/* Option 1: Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">or</span>
            </div>
          </div>

          {/* Option 2: Continue with Email */}
          <button
            type="button"
            onClick={() => setMethod('email')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Continue with Email</span>
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">or</span>
            </div>
          </div>

          {/* Option 3: Continue with Phone */}
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-500" />
            <span>Continue with Phone</span>
          </button>
        </div>
      ) : (
        /* Screen 2: Email Form */
        <div>
          <button
            type="button"
            onClick={() => setMethod('options')}
            className="text-xs text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center gap-1 cursor-pointer"
          >
            &larr; Back to all options
          </button>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      )}

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};
