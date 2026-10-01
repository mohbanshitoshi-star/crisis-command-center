import React, { useState, useEffect } from 'react';
import { OtpInput } from './OtpInput';
import { authService, User } from '../../services/authService';
import { AlertCircle, ArrowLeft, CheckCircle2, RotateCw, Phone } from 'lucide-react';

interface Props {
  mode: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onBackToOptions: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA / Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+81', label: 'Japan (+81)' },
];

export const PhoneAuthForm: React.FC<Props> = ({ mode, onSuccess, onBackToOptions }) => {
  const [step, setStep] = useState<'input-phone' | 'verify-otp'>('input-phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Countdown timer for resend OTP (30s)
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 'verify-otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessBanner(null);

    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 8) {
      setErrorMessage('Please enter a valid phone number (at least 8-10 digits).');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendPhoneOtp(countryCode, cleanNum);
      setStep('verify-otp');
      setCountdown(30);
      setCanResend(false);
      setSuccessBanner(`OTP sent to ${countryCode} ${cleanNum}. Demo OTP: 123456`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please check the phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const cleanNum = phoneNumber.replace(/\D/g, '');
      await authService.sendPhoneOtp(countryCode, cleanNum);
      setCountdown(30);
      setCanResend(false);
      setOtp('');
      setSuccessBanner(`New OTP sent! Demo code: 123456`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanNum = phoneNumber.replace(/\D/g, '');
      const user = await authService.verifyPhoneOtp(
        countryCode,
        cleanNum,
        otp,
        mode === 'signup',
        fullName
      );
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Top back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            if (step === 'verify-otp') {
              setStep('input-phone');
              setErrorMessage(null);
            } else {
              onBackToOptions();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 'verify-otp' ? 'Change phone number' : 'Back to all options'}</span>
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 mb-2 border border-blue-100">
          <Phone className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          {step === 'input-phone'
            ? mode === 'signup'
              ? 'Sign up with Phone'
              : 'Sign in with Phone'
            : 'Verify phone number'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {step === 'input-phone'
            ? 'We will send a 6-digit verification code via SMS.'
            : `Enter the 6-digit code sent to ${countryCode} ${phoneNumber}`}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success / Info Banner */}
      {successBanner && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">OTP Sent</p>
            <p className="text-[11px] text-blue-700 mt-0.5">{successBanner}</p>
          </div>
        </div>
      )}

      {/* Step 1: Input Phone Form */}
      {step === 'input-phone' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="phone-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                id="phone-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Toshi Banshi"
                required
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-colors"
              />
            </div>
          )}

          <div>
            <label htmlFor="phone-number" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98765 43210"
                required
                className="flex-1 px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !phoneNumber.trim()}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP Form */}
      {step === 'verify-otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Enter 6-digit Code
              </label>
              <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Demo OTP: 123456
              </span>
            </div>

            <OtpInput
              value={otp}
              onChange={(newOtp) => {
                setOtp(newOtp);
                if (errorMessage) setErrorMessage(null);
              }}
              length={6}
              disabled={isLoading}
              hasError={!!errorMessage}
            />
          </div>

          {/* Countdown & Resend */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">
              {countdown > 0 ? (
                <>Resend code in <strong className="font-mono text-slate-700">00:{countdown < 10 ? `0${countdown}` : countdown}</strong></>
              ) : (
                "Didn't receive the code?"
              )}
            </span>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Resend OTP</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Verifying OTP...' : 'Verify & Continue'}
          </button>
        </form>
      )}
    </div>
  );
};
