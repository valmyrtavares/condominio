import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Building2,
  ShieldCheck,
  Loader2,
  Sparkles
} from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
  onSuccess?: () => void;
  isAdminMode?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
  onSuccess,
  isAdminMode = false
}) => {
  const { solicitarRecuperacaoSenha, redefinirSenhaComCodigo } = useCondo();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [identificador, setIdentificador] = useState(initialIdentifier);
  const [emailMascarado, setEmailMascarado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [codigoSimulado, setCodigoSimulado] = useState('');
  const [isFirebaseSent, setIsFirebaseSent] = useState(false);
  const [isCarregando, setIsCarregando] = useState(false);

  React.useEffect(() => {
    if (initialIdentifier) {
      setIdentificador(initialIdentifier);
    }
  }, [initialIdentifier]);

  if (!isOpen) return null;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsCarregando(true);

    try {
      const res = await solicitarRecuperacaoSenha(identificador, isAdminMode);
      if (!res.success) {
        setErro(res.message || 'Não foi possível localizar este cadastro.');
        return;
      }

      setEmailMascarado(res.emailMascarado || '');
      setCodigoSimulado(res.codigoSimulado || '123456');
      setCodigo(res.codigoSimulado || '123456'); // pre-fill for convenient validation
      setIsFirebaseSent(Boolean(res.isFirebaseSent));
      setStep('verify');
    } catch (err: any) {
      setErro(err.message || 'Erro ao processar solicitação de recuperação.');
    } finally {
      setIsCarregando(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem. Digite a mesma senha em ambos os campos.');
      return;
    }

    if (isAdminMode && novaSenha.length < 6) {
      setErro('A nova senha de administrador deve conter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha.length < 3) {
      setErro('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }

    setIsCarregando(true);
    try {
      const res = await redefinirSenhaComCodigo(identificador, codigo, novaSenha);
      if (!res.success) {
        setErro(res.message || 'Erro ao redefinir a senha.');
        return;
      }

      setSucesso(res.message || 'Senha redefinida com sucesso!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado ao salvar a nova senha.');
    } finally {
      setIsCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white/95 border-2 border-white rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-900 shadow-inner">
              <KeyRound className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 leading-tight">
                Recuperação de Senha
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {step === 'request' 
                  ? (isAdminMode ? 'Informe seu e-mail pessoal para receber o código' : 'Informe sua unidade ou e-mail para receber o código')
                  : 'Digite o código e crie sua nova senha'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
            <span>{sucesso}</span>
          </div>
        )}

        {/* Step 1: Solicitar Código */}
        {step === 'request' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                {isAdminMode ? 'E-mail Pessoal do Administrador:' : 'Número do Apto ou E-mail Cadastrado:'}
              </label>
              <div className="relative">
                <input
                  type={isAdminMode ? 'email' : 'text'}
                  placeholder={isAdminMode ? 'seu-email@exemplo.com' : 'Ex: 101 Bloco A, 001 ou seu@email.com'}
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  required
                  autoFocus
                />
                {isAdminMode ? (
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                ) : (
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                )}
              </div>
            </div>

            <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-[11px] text-amber-950 font-medium">
              💡 {isAdminMode 
                ? 'Um código de validação e o link oficial do Firebase serão enviados para o seu e-mail pessoal para redefinir sua senha com segurança.'
                : 'Um código de validação será enviado para o e-mail cadastrado na unidade para que você possa redefinir sua senha com segurança.'}
            </div>

            <button
              type="submit"
              disabled={isCarregando}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isCarregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verificando e Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" /> Enviar Código para meu E-mail
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Inserir Código e Nova Senha */}
        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="p-3 bg-emerald-50 border border-emerald-300/80 rounded-2xl text-xs text-emerald-950 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                Código enviado para: <strong className="text-slate-900">{emailMascarado}</strong>
              </p>
              {isFirebaseSent && (
                <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Link oficial enviado pelo Firebase Auth! Você também pode redefinir pelo código abaixo:
                </p>
              )}
              <p className="text-[10px] text-slate-600">
                (Código de validação: <span className="font-mono font-black text-amber-900 text-xs">{codigoSimulado}</span>)
              </p>
            </div>

            {/* Código de 6 dígitos */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Código de 6 dígitos:
              </label>
              <input
                type="text"
                placeholder="Ex: 123456"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-300/80 rounded-2xl px-4 py-2.5 text-center text-sm tracking-widest font-mono font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
            </div>

            {/* Nova Senha com Olho */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Nova Senha de Acesso:
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? 'text' : 'password'}
                  placeholder={isAdminMode ? "Mínimo 6 caracteres" : "Mínimo 3 caracteres"}
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

            {/* Confirmar Nova Senha com Olho */}
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

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isCarregando}
                onClick={() => setStep('request')}
                className="px-3.5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isCarregando}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isCarregando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Salvar Nova Senha
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
