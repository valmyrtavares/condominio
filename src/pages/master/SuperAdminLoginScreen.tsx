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
  Lock,
  Mail,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginFirebaseEmailSenha, enviarEmailRecuperacaoSenha } from '../../services/firebase';

export const SuperAdminLoginScreen: React.FC = () => {
  const { loginMaster, setCurrentScreen } = useCondo();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [modoRecuperacao, setModoRecuperacao] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!senha.trim()) {
      setErroMsg('Por favor, informe a senha.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Se informou e-mail, autentica diretamente no Firebase Auth
      if (email.trim()) {
        const res = await loginFirebaseEmailSenha(email.trim(), senha);
        if (res.success) {
          loginMaster('firebase_authenticated');
          return;
        } else {
          setErroMsg(res.error || 'Falha ao autenticar no Firebase.');
          setIsLoading(false);
          return;
        }
      }

      // 2. Se informou apenas a senha master fixa local (fallback)
      const sucessoLocal = loginMaster(senha.trim());
      if (!sucessoLocal) {
        setErroMsg('Senha master incorreta. Use seu e-mail e senha cadastrados no Firebase, ou "master2026".');
      }
    } catch (err: any) {
      setErroMsg(err.message || 'Erro inesperado durante o login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!email.trim()) {
      setErroMsg('Digite seu e-mail cadastrado para receber o link de redefinição.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await enviarEmailRecuperacaoSenha(email.trim());
      if (res.success) {
        setSucessoMsg(`E-mail enviado com sucesso para ${email}! Verifique sua caixa de entrada e spam para redefinir sua senha.`);
      } else {
        setErroMsg(res.error || 'Não foi possível enviar o e-mail de recuperação.');
      }
    } catch (err: any) {
      setErroMsg('Erro ao solicitar recuperação de senha.');
    } finally {
      setIsLoading(false);
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
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Crown className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest block">
            Acesso Master Central
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            SuperAdmin Condomínios
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {modoRecuperacao 
              ? 'Digite seu e-mail para receber o link seguro de redefinição de senha.' 
              : 'Painel de controle global para criação, clonagem e gestão de instâncias de condomínios.'}
          </p>
        </div>

        {/* Error Notification */}
        {erroMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 font-bold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        {/* Success Notification */}
        {sucessoMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sucessoMsg}</span>
          </div>
        )}

        {!modoRecuperacao ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Seu E-mail Master:
              </label>
              <input
                type="email"
                autoFocus
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErroMsg('');
                }}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Senha:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setModoRecuperacao(true);
                    setErroMsg('');
                    setSucessoMsg('');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  required
                  placeholder="Digite sua senha..."
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    setErroMsg('');
                  }}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1 cursor-pointer"
                  title={showSenha ? "Ocultar senha" : "Ver senha digitada"}
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando no Firebase...</span>
                </>
              ) : (
                <>
                  <span>Acessar Painel SuperAdmin</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Password Reset Form */
          <form onSubmit={handleRecuperarSenha} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> E-mail da Conta:
              </label>
              <input
                type="email"
                autoFocus
                required
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErroMsg('');
                }}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando link por e-mail...</span>
                </>
              ) : (
                <>
                  <span>Enviar Link de Redefinição</span>
                  <Mail className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setModoRecuperacao(false);
                setErroMsg('');
                setSucessoMsg('');
              }}
              className="w-full text-xs text-slate-400 hover:text-white font-bold text-center pt-2 cursor-pointer transition-colors"
            >
              ← Voltar para o Login
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 font-semibold">
            Firebase Auth Ativo • Conexão Criptografada SSL
          </span>
        </div>

      </div>

    </div>
  );
};

