import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Connecting to Secure Safety Network...',
  subtext = 'Calibrating GPS and establishing encrypted connection',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-rose-500/20" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 shadow-sm text-rose-600">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800">{message}</h3>
      {subtext && <p className="mt-1 max-w-sm text-xs text-slate-500">{subtext}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
