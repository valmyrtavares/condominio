import React from 'react';
import { useCondo } from '../context/CondoContext';

export const HomeScreen: React.FC = () => {
  const { currentCondo } = useCondo();

  const nomeCondo = currentCondo?.nome || 'Residencial Jardim Paulista';
  const fotoCondo = currentCondo?.fotoFachada || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90';

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center z-0">
      {/* Fullscreen Building Image — 100% Width & Height */}
      <img
        src={fotoCondo}
        alt={nomeCondo}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Light tint overlay for icon/text contrast without dark sidebars */}
      <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />

      {/* Floating Condominium Name ONLY — Perfectly Centered */}
      <div className="relative z-10 text-center px-4 w-full max-w-xs sm:max-w-md mx-auto animate-float pointer-events-none">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-tight leading-snug text-glow">
          {nomeCondo}
        </h1>
      </div>
    </div>
  );
};

