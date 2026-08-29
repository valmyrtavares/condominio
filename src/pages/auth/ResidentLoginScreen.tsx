import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { Building2, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

export const ResidentLoginScreen: React.FC = () => {
  const { loginResident, setCurrentScreen, setIsDrawerOpen, targetRedirectScreen, setTargetRedirectScreen } = useCondo();
  const [unidade, setUnidade] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const res = loginResident(unidade, senha);
    if (!res.success) {
      setErro(res.message || 'Dados inválidos. Verifique com a administração.');
      return;
    }

    setSucesso(true);
    setTimeout(() => {
      if (res.needsRegistration) {
        setCurrentScreen('resident-register');
      } else {
        const dest = targetRedirectScreen || 'home';
        setTargetRedirectScreen(null);
        setCurrentScreen(dest);
        setIsDrawerOpen(true);
      }
    }, 500);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-3 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white/55 border-2 border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Back button */}
        <button
          onClick={() => {
            setTargetRedirectScreen(null);
            setCurrentScreen('home');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-slate-950 font-extrabold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Acesso do Morador
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Digite o número do seu apartamento e sua senha para liberar o menu completo do condomínio.
          </p>
        </div>

        {/* Banner de Interceptação de Rota Protegida */}
        {targetRedirectScreen && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-amber-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Área exclusiva para moradores. Faça login para acessar o módulo solicitado.</span>
          </div>
        )}


        {/* Error Alert */}
        {erro && (
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Success Alert */}
        {sucesso && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Apartamento localizado! Carregando...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Número da Unidade / Apartamento
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 001, 002, 101 Bloco A, 102..."
                value={unidade}
                autoComplete="off"
                onChange={(e) => {
                  setUnidade(e.target.value);
                  // Se o morador ainda não digitou senha, preenche automaticamente para facilitar o primeiro acesso
                  if (!senha || senha === unidade) {
                    setSenha(e.target.value);
                  }
                }}
                className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
                autoFocus
              />
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] font-extrabold text-amber-900 hover:text-amber-950 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showSenha ? 'text' : 'password'}
                placeholder="Sua senha ou o número do apto"
                value={senha}
                autoComplete="new-password"
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3.5 top-3 rounded-lg"
                tabIndex={-1}
                title={showSenha ? "Ocultar senha" : "Ver senha"}
              >
                {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-[11px] text-amber-950 font-bold flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-800 shrink-0" />
            <span>💡 No primeiro acesso, sua senha é o próprio <strong>número do seu apartamento</strong>.</span>
          </div>

          <button
            type="submit"
            disabled={sucesso}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95"
          >
            Acessar Condomínio
          </button>
        </form>

      </div>

      {/* Modal de Recuperação de Senha */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialIdentifier={unidade}
      />
    </div>
  );
};

