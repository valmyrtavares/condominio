import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  Crown, 
  ArrowLeft,
  Lock
} from 'lucide-react';

export const SuperAdminLoginScreen: React.FC = () => {
  const { loginMaster, setCurrentScreen } = useCondo();
  const [senha, setSenha] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senha.trim()) {
      setErroMsg('Por favor, informe a senha master.');
      return;
    }

    const sucesso = loginMaster(senha.trim());
    if (!sucesso) {
      setErroMsg('Senha master incorreta. Tente "master2026", "admin" ou "master".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto">
      
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-extrabold cursor-pointer transition-colors bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Crown Master Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 animate-bounce">
            <Crown className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest block">
            Acesso Master Central
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            SuperAdmin Condomínios
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Painel de controle global para criação, clonagem e gestão de instâncias de condomínios.
          </p>
        </div>

        {/* Error Notification */}
        {erroMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 font-bold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Senha Master Global:
            </label>
            <input
              type="password"
              autoFocus
              required
              placeholder="Digite a senha master..."
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErroMsg('');
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-white font-mono text-center font-black tracking-widest text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:font-sans placeholder:text-xs placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Acessar Painel SuperAdmin</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 font-semibold">
            Dica: Senha padrão de teste: <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">master2026</code> ou <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">admin</code>
          </span>
        </div>

      </div>

    </div>
  );
};
