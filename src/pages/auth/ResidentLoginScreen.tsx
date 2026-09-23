import React, { useState, useRef, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { Building2, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, Lock, Eye, EyeOff, Search, ChevronDown, X } from 'lucide-react';

export const ResidentLoginScreen: React.FC = () => {
  const { 
    loginResident, 
    setCurrentScreen, 
    setIsDrawerOpen, 
    targetRedirectScreen, 
    setTargetRedirectScreen,
    unidades,
    setPendingRegistrationUnit,
    currentCondo
  } = useCondo();
  const isCasas = currentCondo?.tipoCondominio === 'casas';
  const [unidade, setUnidade] = useState('');
  const [houseSearchText, setHouseSearchText] = useState('');
  const [isHouseDropdownOpen, setIsHouseDropdownOpen] = useState(false);
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);

  const houseDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (houseDropdownRef.current && !houseDropdownRef.current.contains(event.target as Node)) {
        setIsHouseDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHouseLabel = (u: { numero: string; rua?: string }) => {
    if (u.rua) {
      return `Casa ${u.numero} (${u.rua})`;
    }
    return u.numero.toLowerCase().startsWith('casa') ? u.numero : `Casa ${u.numero}`;
  };

  const filteredCasas = unidades.filter(u => {
    if (!houseSearchText.trim()) return true;
    const q = houseSearchText.toLowerCase().trim();
    const num = (u.numero || '').toLowerCase();
    const rua = (u.rua || '').toLowerCase();
    const full = `casa ${num} (${rua})`.toLowerCase();
    return num.includes(q) || rua.includes(q) || full.includes(q);
  });

  const normalizeUnitStr = (str?: string) => (str || '').toLowerCase().replace(/^(apt|apto|unidade|apartamento|casa)\s*/i, '').trim();

  const selectedUnitObj = unidade.trim() ? unidades.find(u => 
    u.id === unidade.trim() ||
    (u.rua ? getHouseLabel(u).toLowerCase() === unidade.trim().toLowerCase() : false) ||
    normalizeUnitStr(u.numero) === normalizeUnitStr(unidade.trim()) ||
    u.numero.toLowerCase() === unidade.trim().toLowerCase()
  ) : null;

  const isUnitRegistered = selectedUnitObj ? Boolean(
    (selectedUnitObj.statusCadastro === 'Cadastrado' || selectedUnitObj.senhaPadraoAlterada) &&
    selectedUnitObj.moradores && 
    selectedUnitObj.moradores.length > 0 &&
    !selectedUnitObj.semMoradores
  ) : true;

  const isPasswordDisabled = Boolean(selectedUnitObj && !isUnitRegistered && !isManualInput);
  const passwordPlaceholder = isPasswordDisabled
    ? "Você ainda não tem senha, cadastre-se"
    : "Digite sua senha de acesso";

  useEffect(() => {
    if (selectedUnitObj && isUnitRegistered && !isManualInput) {
      const savedPass = localStorage.getItem(`condo_saved_pass_${selectedUnitObj.id}`) || localStorage.getItem('condo_resident_saved_password') || '';
      if (savedPass) {
        setSenha(savedPass);
      }
    } else if (selectedUnitObj && !isUnitRegistered) {
      setSenha('');
    }
  }, [unidade, selectedUnitObj?.id, isUnitRegistered, isManualInput]);

  const handleCadastrarDirectly = () => {
    setErro('');
    if (!unidade.trim()) {
      setErro(isCasas ? 'Por favor, informe ou selecione sua casa para prosseguir com o cadastro.' : 'Por favor, selecione seu apartamento/unidade para prosseguir com o cadastro.');
      return;
    }

    const found = selectedUnitObj || unidades.find(u => 
      u.id === unidade.trim() ||
      (u.rua ? getHouseLabel(u).toLowerCase() === unidade.trim().toLowerCase() : false) ||
      normalizeUnitStr(u.numero) === normalizeUnitStr(unidade.trim()) ||
      u.numero.toLowerCase() === unidade.trim().toLowerCase()
    );

    if (!found) {
      setErro(isCasas ? 'Casa não encontrada no condomínio.' : 'Unidade não encontrada no condomínio.');
      return;
    }

    // 1. Freio de Segurança: Verifica se a residência já possui morador cadastrado
    const isAlreadyRegistered = Boolean(
      (found.statusCadastro === 'Cadastrado' || found.senhaPadraoAlterada) &&
      found.moradores && 
      found.moradores.length > 0 &&
      !found.semMoradores
    );

    if (isAlreadyRegistered) {
      setErro(
        isCasas
          ? 'Essa casa já tem morador e não está disponivel.'
          : 'Esse apartamento já tem morador e não está disponivel.'
      );
      return;
    }

    // 2. Verifica se a residência está suspensa pelo síndico
    const isSuspensa = Boolean(
      found.suspensa || 
      found.statusCadastro === 'Suspenso'
    );

    if (isSuspensa) {
      setErro(
        isCasas
          ? 'Esta casa está suspensa pelo síndico e não está disponível.'
          : 'Este apartamento está suspenso pelo síndico e não está disponível.'
      );
      return;
    }

    // 3. Residência vazia e não suspensa: abre diretamente a tela de cadastro para criar a primeira senha
    setPendingRegistrationUnit(found);
    setCurrentScreen('resident-register');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!unidade.trim()) {
      setErro('Por favor, selecione ou informe a sua unidade.');
      return;
    }

    if (selectedUnitObj && !isUnitRegistered && !isManualInput) {
      setErro(
        isCasas
          ? 'Esta casa ainda não possui morador cadastrado. Clique em "Cadastrar minha casa" abaixo.'
          : 'Esta unidade ainda não possui morador cadastrado. Clique em "Cadastrar minha unidade" abaixo.'
      );
      return;
    }

    const res = loginResident(unidade, senha);
    if (!res.success) {
      setErro(res.message || 'Dados inválidos. Verifique com a administração.');
      return;
    }

    if (senha.trim()) {
      try {
        localStorage.setItem('condo_resident_saved_password', senha.trim());
        if (selectedUnitObj?.id) {
          localStorage.setItem(`condo_saved_pass_${selectedUnitObj.id}`, senha.trim());
        }
      } catch {}
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
            {isCasas 
              ? 'Digite o número e nome da rua para encontrar sua casa.' 
              : 'Selecione a sua unidade ou digite sua credencial para acessar o condomínio.'}
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
                {isCasas ? 'Digite sua Casa / Rua' : 'Selecione sua Unidade / Apartamento'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsManualInput(!isManualInput);
                  setUnidade('');
                  setHouseSearchText('');
                  setIsHouseDropdownOpen(false);
                }}
                className="text-[10px] font-bold text-amber-900 hover:text-amber-950 underline cursor-pointer"
              >
                {isManualInput ? (isCasas ? 'Buscar por número/rua' : 'Escolher da lista') : 'Digitar e-mail / dev'}
              </button>
            </div>

            <div className="relative" ref={houseDropdownRef}>
              {isManualInput ? (
                <input
                  type="text"
                  placeholder={isCasas ? "Ex: Casa 12 ou dev@dev.com" : "Ex: dev@dev.com ou funcionário"}
                  value={unidade}
                  autoComplete="username"
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full bg-white/80 border border-white rounded-2xl px-4 py-3 pl-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  required
                  autoFocus
                />
              ) : isCasas ? (
                /* CONDOCASAS: Autocomplete interativo para buscar por número e rua */
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o número e nome da rua"
                    value={houseSearchText}
                    onFocus={() => setIsHouseDropdownOpen(true)}
                    onChange={(e) => {
                      const text = e.target.value;
                      setHouseSearchText(text);
                      setUnidade(text);
                      setIsHouseDropdownOpen(true);
                    }}
                    className="w-full bg-white/90 border border-white rounded-2xl px-4 py-3 pl-10 pr-10 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner cursor-text"
                    required
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  
                  {houseSearchText ? (
                    <button
                      type="button"
                      onClick={() => {
                        setHouseSearchText('');
                        setUnidade('');
                        setIsHouseDropdownOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 absolute right-3 top-2.5 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsHouseDropdownOpen(!isHouseDropdownOpen)}
                      className="p-1 text-slate-400 hover:text-slate-700 absolute right-3 top-2.5 rounded-lg cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isHouseDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {/* Dropdown de Sugestões de Casas */}
                  {isHouseDropdownOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2">
                      {filteredCasas.length > 0 ? (
                        filteredCasas.map((u) => {
                          const label = getHouseLabel(u);
                          const isSelected = unidade === u.id || unidade === label;
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setHouseSearchText(label);
                                setUnidade(u.id);
                                setIsHouseDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-amber-500 text-slate-950 shadow-sm' 
                                  : 'text-slate-900 hover:bg-amber-100/80 hover:text-amber-950'
                              }`}
                            >
                              <span>{label}</span>
                              {u.rua && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                                  isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {u.rua}
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-slate-500 font-semibold">
                          Nenhuma casa encontrada para "{houseSearchText}"
                        </div>
                      )}

                      {/* Opção Dev no final da lista */}
                      <button
                        type="button"
                        onClick={() => {
                          setHouseSearchText('dev@dev.com');
                          setUnidade('dev@dev.com');
                          setIsHouseDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-between cursor-pointer border-t border-purple-100 mt-1"
                      >
                        <span>👑 Login Master de Desenvolvedor (dev@dev.com)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* CONDOAPARTAMENTOS: Mantido intacto com select padrão */
                <>
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
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                </>
              )}
              {isManualInput && (
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              )}
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
                placeholder={passwordPlaceholder}
                value={senha}
                disabled={isPasswordDisabled}
                autoComplete="new-password"
                onChange={(e) => setSenha(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 pl-10 pr-10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner ${
                  isPasswordDisabled 
                    ? 'bg-slate-100/90 border-rose-200/80 text-slate-500 placeholder-rose-800/80 cursor-not-allowed font-semibold' 
                    : 'bg-white/80 border-white text-slate-950 placeholder-slate-500'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                disabled={isPasswordDisabled}
                className="p-1 text-slate-500 hover:text-slate-800 absolute right-3.5 top-3 rounded-lg cursor-pointer disabled:opacity-40"
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
              disabled={sucesso || isPasswordDisabled}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                isPasswordDisabled 
                  ? 'bg-amber-500/50 text-slate-700 cursor-not-allowed shadow-none' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 active:scale-95'
              }`}
            >
              Acessar Condomínio
            </button>

            {/* Link direto para Primeiro Acesso / Cadastro de Unidade */}
            <div className="text-center pt-2 border-t border-slate-300/60">
              <p className="text-xs text-slate-700 font-medium">
                {isCasas ? 'Primeiro acesso à sua casa?' : 'Primeiro acesso à sua unidade?'}{' '}
                <button
                  type="button"
                  onClick={handleCadastrarDirectly}
                  className="text-amber-950 font-black hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-800" /> {isCasas ? 'Cadastrar minha casa' : 'Cadastrar minha unidade'}
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


