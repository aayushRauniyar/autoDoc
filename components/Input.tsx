import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-primary mb-2 font-mono">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-colors outline-none font-medium placeholder-gray-400 ${
          error ? 'border-red-500 bg-red-50' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-primary mb-2 font-mono">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-colors outline-none font-medium placeholder-gray-400 ${
          error ? 'border-red-500 bg-red-50' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
};