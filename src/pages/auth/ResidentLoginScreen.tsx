import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { Building2, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

export const ResidentLoginScreen: React.FC = () => {
  const { 
    loginResident, 
    setCurrentScreen, 
    setIsDrawerOpen, 
    targetRedirectScreen, 
    setTargetRedirectScreen,
    unidades,
    setPendingRegistrationUnit
  } = useCondo();
  const [unidade, setUnidade] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);

  const handleCadastrarDirectly = () => {
    setErro('');
    if (!unidade.trim()) {
      setErro('Por favor, selecione seu apartamento/unidade para prosseguir com o cadastro.');
      return;
    }

    const found = unidades.find(u => 
      u.numero.toLowerCase() === unidade.trim().toLowerCase() ||
      u.id === unidade.trim()
    );

    // Freio de Segurança: Verifica se o apartamento já possui morador cadastrado
    const isAlreadyRegistered = Boolean(
      found && (
        found.statusCadastro === 'Cadastrado' ||
        (found.moradores && found.moradores.length > 0) ||
        found.senhaPadraoAlterada
      )
    );

    if (isAlreadyRegistered) {
      setErro(
        `Este apartamento (${found?.numero || unidade}) já possui morador cadastrado. Se você é morador desta unidade, digite sua senha pessoal no campo abaixo. Caso precise de suporte ou troca de moradores, entre em contato com o síndico.`
      );
      return;
    }

    if (found) {
      setPendingRegistrationUnit(found);
    } else {
      setPendingRegistrationUnit({
        id: `und-${unidade}`,
        numero: unidade,
        bloco: 'Bloco A',
        moradores: [],
        statusCadastro: 'Pendente'
      });
    }

    setCurrentScreen('resident-register');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!unidade.trim()) {
      setErro('Por favor, selecione ou informe a sua unidade.');
      return;
    }

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
            Acesso ao Condomínio
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Selecione a sua unidade ou digite sua credencial para acessar o condomínio.
          </p>
        </div>

        {/* Banner de Interceptação de Rota Protegida */}
        {targetRedirectScreen && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-amber-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Área com login obrigatório. Faça login para acessar o módulo solicitado.</span>
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
            <span>Acesso autorizado! Carregando ambiente...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Selecione sua Unidade / Apartamento
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsManualInput(!isManualInput);
                  setUnidade('');
                }}
                className="text-[10px] font-bold text-amber-900 hover:text-amber-950 underline"
              >
                {isManualInput ? 'Escolher da lista' : 'Digitar e-mail / dev'}
              </button>
            </div>

            <div className="relative">
              {isManualInput ? (
                <input
                  type="text"
                  placeholder="Ex: dev@dev.com ou funcionário"
                  value={unidade}
                  autoComplete="username"
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  required
                  autoFocus
                />
              ) : (
                <select
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full bg-white/90 border border-white rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner cursor-pointer appearance-none"
                  required
                  autoFocus
                >
                  <option value="" disabled className="text-slate-500">
                    -- Escolha o seu apartamento / unidade --
                  </option>
                  {unidades.map((u) => {
                    const label = u.bloco && !u.numero.toLowerCase().includes('bloco')
                      ? `Apto ${u.numero} (${u.bloco})`
                      : `Unidade ${u.numero}`;
                    return (
                      <option key={u.id} value={u.numero} className="text-slate-950 font-semibold bg-white py-1">
                        {label}
                      </option>
                    );
                  })}
                  <option value="dev@dev.com" className="text-purple-900 font-bold bg-purple-50">
                    👑 Login Master de Desenvolvedor (dev@dev.com)
                  </option>
                </select>
              )}
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
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
                className="text-[11px] font-extrabold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showSenha ? 'text' : 'password'}
                placeholder="Digite sua senha de acesso"
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
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3.5 top-3 rounded-lg cursor-pointer"
                tabIndex={-1}
                title={showSenha ? "Ocultar senha" : "Ver senha"}
              >
                {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={sucesso}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Acessar Condomínio
            </button>

            {/* Link direto para Primeiro Acesso / Cadastro de Unidade */}
            <div className="text-center pt-2 border-t border-slate-300/60">
              <p className="text-xs text-slate-700 font-medium">
                Primeiro acesso à sua unidade?{' '}
                <button
                  type="button"
                  onClick={handleCadastrarDirectly}
                  className="text-amber-950 font-black hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-800" /> Cadastrar minha unidade
                </button>
              </p>
            </div>
          </div>
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

