import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { X, ChevronRight } from 'lucide-react';

export const EspinhaDorsalDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, espinhaDorsalItems, setCurrentScreen } = useCondo();
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      setShouldRender(false);
      setIsClosing(false);
    }, 300);
  };

  const handleNavigate = (rota: string) => {
    const screen = rota.replace('/', '');
    setCurrentScreen(screen || 'home');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Soft Overlay with Fade-In / Fade-Out */}
      <div 
        className={`fixed inset-0 bg-slate-950/25 ${
          isClosing ? 'overlay-fade-out' : 'overlay-fade-in'
        }`}
        onClick={handleClose}
      />

      {/* Translucent White Drawer with Explicit Slide-In / Slide-Out Animations */}
      <div 
        className={`relative w-full max-w-xs glass-drawer-light text-slate-900 flex flex-col h-full shadow-2xl z-10 overflow-hidden ${
          isClosing ? 'drawer-slide-out' : 'drawer-slide-in'
        }`}
      >
        
        {/* Floating Close Button Top Right */}
        <div className="p-4 flex justify-end">
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-white/40 transition-colors active:scale-95"
            aria-label="Fechar Menu"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Clean Menu Items List — White Translucent Background & Dark Slate Text */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-white/30">
          {espinhaDorsalItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigate(item.rota)}
              className="group px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-all cursor-pointer active:scale-98"
            >
              <span className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all">
                {item.titulo}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
