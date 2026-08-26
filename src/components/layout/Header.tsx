import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  Menu, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  LogOut, 
  Repeat, 
  Building2, 
  X,
  ChevronRight,
  Shield
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    toggleRole, 
    setIsDrawerOpen, 
    currentScreen, 
    isResidentLoggedIn, 
    isAdminLoggedIn,
    logoutResident,
    logoutAdmin,
    setCurrentScreen 
  } = useCondo();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const handleLogout = () => {
    logoutResident();
    if (isAdminLoggedIn) {
      logoutAdmin();
    }
    setIsProfileOpen(false);
    setCurrentScreen('resident-login');
  };

  const handleToggleRole = () => {
    toggleRole();
    setIsProfileOpen(false);
  };

  const handleGoAdmin = () => {
    setIsProfileOpen(false);
    setCurrentScreen('admin');
  };

  return (
    <>
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

          {/* Right: Resident Name - Opens Logout / Profile Modal */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className={`flex items-center gap-2 text-sm font-medium tracking-tight transition-all active:scale-95 px-2.5 py-1.5 rounded-2xl ${
              isHome 
                ? 'text-white/90 hover:text-white bg-black/20 hover:bg-black/35 backdrop-blur-sm border border-white/20' 
                : 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 border border-slate-200'
            }`}
            title="Gerenciar perfil e sessão"
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

      {/* Profile & Logout Popup Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsProfileOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-sm bg-white/95 border-2 border-white rounded-3xl p-6 shadow-2xl backdrop-blur-xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Header with Close */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-900 shadow-inner">
                  {currentUser.role === 'subsindico' ? (
                    <ShieldAlert className="w-6 h-6 text-amber-700" />
                  ) : (
                    <User className="w-6 h-6 text-slate-800" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 leading-tight">
                    {currentUser.nome || 'Morador sem dados'}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {currentUser.unidade ? `Apt ${currentUser.unidade} (${currentUser.bloco || 'Bloco A'})` : 'Não identificado'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold">Perfil atual:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] uppercase tracking-wide ${
                currentUser.role === 'subsindico'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-indigo-100 text-indigo-900'
              }`}>
                {currentUser.role === 'subsindico' ? 'Subsíndica / Admin' : 'Morador'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              
              {/* Deslogar / Trocar Usuário (Principal) */}
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Deslogar / Trocar de Usuário
              </button>

              {/* Alternar Perfil Morador ⇋ Admin */}
              <button
                onClick={handleToggleRole}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-slate-600" />
                  Alternar Morador ⇋ Síndica
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Acessar Painel do Administrador */}
              <button
                onClick={handleGoAdmin}
                className="w-full py-3 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-950 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-700" />
                  Painel de Gestão (/admin)
                </span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

