import React, { useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { PhoneAuthForm } from './PhoneAuthForm';
import { authService, User } from '../../services/authService';
import { AlertCircle, Mail, Phone } from 'lucide-react';

interface Props {
  onSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
  const [method, setMethod] = useState<'options' | 'email' | 'phone'>('options');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await authService.loginWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google account creation could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.signupWithEmail(fullName, email, password);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If Phone method is selected
  if (method === 'phone') {
    return (
      <PhoneAuthForm
        mode="signup"
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
        <h2 className="text-lg font-semibold text-slate-900">Create your AEGIS account</h2>
        <p className="text-xs text-slate-500 mt-1">Start using intelligent decision support.</p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Screen 1: Options Hub */}
      {method === 'options' ? (
        <div className="space-y-3">
          {/* Option 1: Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
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
            <span>{isLoading ? 'Creating account with Google...' : 'Continue with Google'}</span>
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
        /* Screen 2: Email Sign Up Form */
        <div>
          <button
            type="button"
            onClick={() => setMethod('options')}
            className="text-xs text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center gap-1 cursor-pointer"
          >
            &larr; Back to all options
          </button>

          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                placeholder="e.g. Toshi Banshi"
                className={`w-full px-3.5 py-2.5 bg-white text-slate-900 border rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="name@example.com"
                className={`w-full px-3.5 py-2.5 bg-white text-slate-900 border rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password (minimum 8 characters)
              </label>
              <PasswordInput
                id="signup-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                placeholder="At least 8 characters"
                error={!!errors.password}
              />
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <PasswordInput
                id="signup-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Re-enter your password"
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      )}

      {/* Switch to Sign In */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
