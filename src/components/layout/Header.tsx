import React from 'react';
import { useCondo } from '../../context/CondoContext';
import { Menu, ShieldAlert, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    toggleRole, 
    setIsDrawerOpen, 
    currentScreen, 
    isResidentLoggedIn, 
    setCurrentScreen 
  } = useCondo();

  const isHome = currentScreen === 'home';

  // Format name to display at most 2 words (e.g. "Carlos Eduardo" or "Dra. Mariana")
  const getTwoNames = (fullName: string) => {
    if (!fullName) return 'Morador sem dados';
    if (fullName.toLowerCase().includes('morador sem dados')) {
      return 'Morador sem dados';
    }
    const parts = fullName.trim().split(/\s+/);
    return parts.slice(0, 2).join(' ');
  };

  const formattedName = getTwoNames(currentUser.nome);

  const handleHamburgerClick = () => {
    if (!isResidentLoggedIn) {
      setCurrentScreen('resident-login');
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 px-4 py-4 transition-colors ${
      isHome 
        ? 'bg-transparent text-white' 
        : 'bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-2xs'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Left: Floating Hamburger Icon without background */}
        <button
          onClick={handleHamburgerClick}
          className={`p-2 rounded-xl transition-all flex items-center justify-center active:scale-95 ${
            isHome 
              ? 'text-white hover:text-slate-200 drop-shadow-md' 
              : 'text-slate-800 hover:text-indigo-600 hover:bg-slate-100'
          }`}
          title={isResidentLoggedIn ? 'Abrir Menu' : 'Fazer Login de Morador'}
          aria-label="Abrir Menu"
        >
          <Menu className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Right: Resident Name (NO BOLD, MAX 2 NAMES) */}
        <button
          onClick={toggleRole}
          className={`flex items-center gap-2 text-sm font-medium tracking-tight transition-all active:scale-95 ${
            isHome 
              ? 'text-white/90 drop-shadow-md hover:text-white' 
              : 'text-slate-700 hover:text-indigo-600'
          }`}
          title="Clique para alternar entre Morador e Subsíndica"
        >
          {currentUser.role === 'subsindico' ? (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <User className="w-4 h-4 text-white/80 shrink-0" />
          )}
          <span className="font-normal">{formattedName}</span>
        </button>

      </div>
    </header>
  );
};
