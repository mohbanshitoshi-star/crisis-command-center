import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const PasswordInput: React.FC<Props> = ({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  className = '',
  error = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name || id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 bg-white text-slate-900 border rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors pr-10 ${
          error
            ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
            : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
        } ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
