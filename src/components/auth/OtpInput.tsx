import React, { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

export const OtpInput: React.FC<Props> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first empty input or the first one on mount
    const firstEmptyIndex = value.length < length ? value.length : 0;
    inputRefs.current[firstEmptyIndex]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // only digits
    if (!rawVal) return;

    // Handle single digit typing
    const newDigit = rawVal[rawVal.length - 1];
    const digits = value.split('');
    digits[index] = newDigit;
    const newOtp = digits.join('').slice(0, length);
    onChange(newOtp);

    // Auto-focus next input
    if (index < length - 1 && newDigit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move back and clear previous
        const digits = value.split('');
        digits[index - 1] = '';
        onChange(digits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const digits = value.split('');
        digits[index] = '';
        onChange(digits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-2.5 w-full">
      {Array.from({ length }).map((_, index) => {
        const char = value[index] || '';
        return (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={char}
            disabled={disabled}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold font-mono rounded-lg border bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 ${
              hasError
                ? 'border-red-400 focus:ring-red-100 focus:border-red-500 text-red-600'
                : char
                ? 'border-blue-500 focus:ring-blue-100 focus:border-blue-600 text-slate-900'
                : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
            } disabled:opacity-50`}
          />
        );
      })}
    </div>
  );
};
