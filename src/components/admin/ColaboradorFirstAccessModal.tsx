import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  KeyRound,
  X,
  UserCheck
} from 'lucide-react';

interface ColaboradorFirstAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarioId: string;
  funcionarioNome: string;
  funcionarioEmail: string;
  onSuccess: () => void;
}

export const ColaboradorFirstAccessModal: React.FC<ColaboradorFirstAccessModalProps> = ({
  isOpen,
  onClose,
  funcionarioId,
  funcionarioNome,
  funcionarioEmail,
  onSuccess
}) => {
  const { alterarSenhaColaborador } = useCondo();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const s = novaSenha.trim();
    if (!s || s.length < 4) {
      setErro('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (s !== confirmarSenha.trim()) {
      setErro('As senhas não coincidem. Digite a mesma senha em ambos os campos.');
      return;
    }

    if (s.toLowerCase() === funcionarioEmail.toLowerCase()) {
      setErro('Por segurança, sua nova senha não pode ser igual ao seu e-mail de login.');
      return;
    }

    setIsSalvando(true);
    try {
      const res = alterarSenhaColaborador(funcionarioId, s);
      if (res) {
        setSucesso(true);
        setTimeout(() => {
          setIsSalvando(false);
          onSuccess();
        }, 1200);
      } else {
        setErro('Erro ao salvar nova senha. Tente novamente.');
        setIsSalvando(false);
      }
    } catch {
      setErro('Erro inesperado ao alterar senha.');
      setIsSalvando(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border-2 border-amber-400 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-950 border border-amber-400/50 flex items-center justify-center shadow-inner shrink-0">
              <KeyRound className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                Criar Senha Pessoal Definitiva
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Olá, <strong>{funcionarioNome}</strong>!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-xs text-amber-950 space-y-1">
          <p className="font-extrabold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-800 shrink-0" />
            Identificação & Rastreabilidade de Operações:
          </p>
          <p className="text-[11px] leading-relaxed">
            Para sua segurança, defina uma senha pessoal individual. Todas as encomendas, acessos e movimentações feitas no sistema ficarão registradas sob o seu login.
          </p>
        </div>

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
            <span>Senha pessoal configurada com sucesso! Acessando painel...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nova Senha */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Sua Nova Senha Pessoal:
            </label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                placeholder="Mínimo 4 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3 top-2 cursor-pointer"
              >
                {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Nova Senha */}
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
                className="w-full bg-slate-100/90 border border-slate-300 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3 top-2 cursor-pointer"
              >
                {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSalvando}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {isSalvando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Salvando Senha...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Salvar Senha e Entrar no Painel
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
