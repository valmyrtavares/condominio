import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  X
} from 'lucide-react';

interface AdminFirstAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  condoNome: string;
  onSuccess: () => void;
}

export const AdminFirstAccessModal: React.FC<AdminFirstAccessModalProps> = ({
  isOpen,
  onClose,
  initialEmail,
  condoNome,
  onSuccess
}) => {
  const { concluirPrimeiroAcessoAdmin } = useCondo();

  const [email, setEmail] = useState(initialEmail);
  const [nome, setNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [erro, setErro] = useState('');
  const [isSalvando, setIsSalvando] = useState(false);

  // Sincroniza initialEmail quando abre
  React.useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const emailLimpo = email.trim().toLowerCase();
    const nomeLimpo = nome.trim();
    const senhaLimpa = novaSenha.trim();

    if (!emailLimpo || !emailLimpo.includes('@')) {
      setErro('Por favor, informe um e-mail válido para gerenciamento e recuperação de senha.');
      return;
    }

    if (!nomeLimpo) {
      setErro('Por favor, informe o seu nome completo ou cargo de gestão.');
      return;
    }

    if (senhaLimpa.length < 6) {
      setErro('A nova senha deve conter no mínimo 6 caracteres para segurança no Firebase.');
      return;
    }

    if (senhaLimpa !== confirmarSenha.trim()) {
      setErro('As senhas não coincidem. Digite a mesma senha em ambos os campos.');
      return;
    }

    setIsSalvando(true);
    try {
      const res = await concluirPrimeiroAcessoAdmin(emailLimpo, senhaLimpa, nomeLimpo);
      if (res.success) {
        onSuccess();
      } else {
        setErro(res.error || 'Erro ao ativar senha de administrador.');
      }
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado ao salvar credenciais.');
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white/95 border-2 border-white rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-1.5 relative">
          <button 
            type="button" 
            onClick={onClose} 
            className="absolute -top-2 -right-2 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Ativação do Administrador
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Gestão de <strong>{condoNome}</strong>
          </p>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-amber-50 border border-amber-300/80 rounded-2xl text-xs text-amber-950 space-y-1 shadow-2xs">
          <p className="font-bold flex items-center gap-1 text-slate-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            Primeiro Acesso à Gestão
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Confirme seu e-mail pessoal e crie uma senha definitiva para ter autonomia total e poder recuperar sua senha a qualquer momento.
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
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Seu E-mail Pessoal de Recuperação:
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Seu Nome Completo:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Carlos Silva (Síndico)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Nova Senha de Acesso:
            </label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                placeholder="Mínimo de 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
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

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSalvando}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSalvando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ativando no Firebase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ativar Acesso e Entrar no Painel</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSalvando}
              className="w-full py-2 text-slate-600 hover:text-slate-950 text-xs font-extrabold transition-all text-center"
            >
              Cancelar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
