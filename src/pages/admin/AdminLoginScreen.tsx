import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { AdminFirstAccessModal } from '../../components/admin/AdminFirstAccessModal';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export const AdminLoginScreen: React.FC = () => {
  const { loginAdmin, setCurrentScreen, targetRedirectScreen, setTargetRedirectScreen, currentCondo } = useCondo();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isFirstAccessModalOpen, setIsFirstAccessModalOpen] = useState(false);

  const [isCarregando, setIsCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsCarregando(true);

    try {
      const res = await loginAdmin(usuario, senha);
      if (res.success) {
        if (res.needsActivation) {
          setIsFirstAccessModalOpen(true);
        } else {
          const dest = targetRedirectScreen || 'admin';
          setTargetRedirectScreen(null);
          setCurrentScreen(dest);
        }
      } else {
        setErro(res.message || 'E-mail ou senha de administrador incorretos.');
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao realizar login.');
    } finally {
      setIsCarregando(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-3 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white/90 border-2 border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
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
            <ShieldCheck className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Painel do Administrador
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Acesso restrito ao síndico para gestão do condomínio <strong>{currentCondo.nome}</strong>.
          </p>
        </div>

        {/* Banner de Interceptação Admin */}
        {targetRedirectScreen && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-amber-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Área restrita à gestão. Faça login como síndico para continuar.</span>
          </div>
        )}

        {/* Error Alert */}
        {erro && (
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Entre com o seu email pessoal para gerenciar e recuperar senha
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="seu-email@exemplo.com"
                value={usuario}
                autoComplete="email"
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
                autoFocus
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
                placeholder="Senha inicial recebida"
                value={senha}
                autoComplete="new-password"
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
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

          <button
            type="submit"
            disabled={isCarregando}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isCarregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando credenciais...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialIdentifier={usuario || ''}
        isAdminMode={true}
      />

      {/* Modal de Primeiro Acesso com Criação no Firebase Authentication */}
      <AdminFirstAccessModal
        isOpen={isFirstAccessModalOpen}
        onClose={() => setIsFirstAccessModalOpen(false)}
        initialEmail={usuario}
        condoNome={currentCondo.nome}
        onSuccess={() => {
          setIsFirstAccessModalOpen(false);
          const dest = targetRedirectScreen || 'admin';
          setTargetRedirectScreen(null);
          setCurrentScreen(dest);
        }}
      />
    </div>
  );
};
