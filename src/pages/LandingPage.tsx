import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onEnterApp: (role?: UserRole) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-rose-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="flex h-24 w-24 mb-8 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-2xl shadow-rose-600/40">
          <ShieldAlert className="h-12 w-12" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Girls Safety System
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl">
          A unified safety platform designed for instant emergency response, guardian protection, and seamless rapid dispatch.
        </p>
        
        <button
          onClick={onOpenLogin}
          className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-rose-600/30 active:scale-95"
        >
          <span>Login</span>
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

