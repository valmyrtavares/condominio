import React, { useState } from 'react';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  unidadeNumero: string;
  email: string;
  onSaveNewPassword: (senha: string) => void;
  onSkip: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  unidadeNumero,
  email,
  onSaveNewPassword,
  onSkip
}) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!novaSenha.trim()) {
      setErro('Digite uma nova senha para sua unidade.');
      return;
    }

    if (novaSenha.length < 3) {
      setErro('A senha deve conter no mínimo 3 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem. Digite a mesma senha nos dois campos.');
      return;
    }

    onSaveNewPassword(novaSenha.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white/95 border-2 border-white rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
            <KeyRound className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Verificação & Troca de Senha
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Unidade <strong>{unidadeNumero}</strong> • Quase pronto!
          </p>
        </div>

        {/* Email verification banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-300/80 rounded-2xl text-xs text-amber-950 space-y-1.5 shadow-2xs">
          <p className="font-bold flex items-center gap-1.5 text-slate-950">
            <Mail className="w-4 h-4 text-amber-800 shrink-0" />
            E-mail cadastrado: <strong>{email || 'Não informado'}</strong>
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Para garantir sua segurança, substitua a senha padrão (<strong>{unidadeNumero}</strong>) por uma senha pessoal de sua preferência.
          </p>
        </div>

        {/* Error Alert */}
        {erro && (
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Nova Senha */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Nova Senha de Acesso:
            </label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                placeholder="Digite sua nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3 top-2 rounded-lg"
                tabIndex={-1}
              >
                {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Confirmar Nova Senha:
            </label>
            <div className="relative">
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                placeholder="Repita a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3 top-2 rounded-lg"
                tabIndex={-1}
              >
                {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Salvar Nova Senha e Entrar
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2.5 text-slate-700 hover:text-slate-950 text-xs font-extrabold transition-all hover:underline text-center"
            >
              Fazer isso depois (Manter senha padrão)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
