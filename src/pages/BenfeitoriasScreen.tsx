import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { TipoBenfeitoria, StatusFaseBenfeitoria } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  TrendingDown, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Send, 
  Upload, 
  Layers, 
  DollarSign, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Star,
  Users,
  Clock,
  Building2,
  AlertTriangle,
  Check,
  Award
} from 'lucide-react';
import { otimizarImagemArquivo } from '../utils/imageOptimizer';

const STATUS_CONFIG_MORADOR: Record<
  StatusFaseBenfeitoria,
  { label: string; stepNumber: number; badgeColor: string }
> = {
  proposta: { label: '1. Proposta', stepNumber: 1, badgeColor: 'bg-rose-100 text-rose-950 border-rose-300' },
  orcamento: { label: '2. Buscando Orçamento', stepNumber: 2, badgeColor: 'bg-sky-100 text-sky-950 border-sky-300' },
  votacao: { label: '3. Votação Eletrônica', stepNumber: 3, badgeColor: 'bg-amber-500 text-white border-amber-600' },
  contratada: { label: '4. Empresa Contratada', stepNumber: 4, badgeColor: 'bg-blue-100 text-blue-950 border-blue-300' },
  execucao: { label: '5. Em Execução', stepNumber: 5, badgeColor: 'bg-orange-100 text-orange-950 border-orange-300' },
  avaliacao: { label: '6. Avaliação dos Condôminos', stepNumber: 6, badgeColor: 'bg-purple-100 text-purple-950 border-purple-300' },
  entregue: { label: '7. Entregue & Concluída', stepNumber: 7, badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
  cancelada: { label: '8. CANCELADO / QUEBRA DE CONTRATO', stepNumber: 8, badgeColor: 'bg-red-600 text-white border-red-700' }
};

export const BenfeitoriasScreen: React.FC = () => {
  const { 
    benfeitorias, 
    currentUser, 
    adicionarBenfeitoria, 
    setCurrentScreen,
    toggleRole,
    votarOrcamentoBenfeitoria,
    avaliarBenfeitoria
  } = useCondo();

  const [expandedId, setExpandedId] = useState<string | null>('initial');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [filterTipo, setFilterTipo] = useState<string>('Todas');

  // Estados de Votação e Avaliação pelo Morador
  const [submittingVoteId, setSubmittingVoteId] = useState<string | null>(null);
  const [ratingInput, setRatingInput] = useState<{ [benfeitoriaId: string]: number }>({});
  const [ratingComment, setRatingComment] = useState<{ [benfeitoriaId: string]: string }>({});
  const [submittingRatingId, setSubmittingRatingId] = useState<string | null>(null);
  const [showTimelineId, setShowTimelineId] = useState<string | null>(null);

  // Form State para admin rápido
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [tipo, setTipo] = useState<TipoBenfeitoria>('Nova Aquisição & Modernização');
  const [descricao, setDescricao] = useState('');
  const [impactoGestao, setImpactoGestao] = useState('');
  const [investimento, setInvestimento] = useState<string>('');
  const [economiaMensal, setEconomiaMensal] = useState<string>('');
  const [regrasUso, setRegrasUso] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  const tiposOptions: TipoBenfeitoria[] = [
    'Grande Reparo & Manutenção',
    'Nova Aquisição & Modernização',
    'Equilíbrio Financeiro & Economia',
    'Área Comum & Convivência'
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => {
      const isCurrentlyExpanded = prev === id || (prev === 'initial' && benfeitorias[0]?.id === id);
      return isCurrentlyExpanded ? 'closed' : id;
    });
  };

  const handleVotar = async (benfeitoriaId: string, orcamentoId: string) => {
    setSubmittingVoteId(benfeitoriaId);
    await votarOrcamentoBenfeitoria(benfeitoriaId, orcamentoId);
    setSubmittingVoteId(null);
  };

  const handleAvaliar = async (benfeitoriaId: string) => {
    const nota = ratingInput[benfeitoriaId] || 5;
    const comentario = ratingComment[benfeitoriaId] || '';
    setSubmittingRatingId(benfeitoriaId);
    await avaliarBenfeitoria(benfeitoriaId, nota, comentario);
    setSubmittingRatingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!titulo.trim() || !descricao.trim() || !impactoGestao.trim()) return;

    const investNum = investimento ? parseFloat(investimento) : undefined;
    const econNum = economiaMensal ? parseFloat(economiaMensal) : undefined;

    if (fotoFile) {
      try {
        const result = await otimizarImagemArquivo(fotoFile, { maxBytes: 120 * 1024 });
        adicionarBenfeitoria(
          titulo,
          subtitulo || 'Melhoria entregue pela administração',
          tipo,
          descricao,
          impactoGestao,
          [result],
          investNum,
          econNum,
          regrasUso
        );
      } catch (err) {
        console.error('Erro ao otimizar foto:', err);
      }
    } else {
      adicionarBenfeitoria(
        titulo,
        subtitulo || 'Melhoria entregue pela administração',
        tipo,
        descricao,
        impactoGestao,
        [],
        investNum,
        econNum,
        regrasUso
      );
    }

    setTitulo('');
    setSubtitulo('');
    setDescricao('');
    setImpactoGestao('');
    setInvestimento('');
    setEconomiaMensal('');
    setRegrasUso('');
    setFotoFile(null);
    setIsFormOpen(false);
  };

  // Filter Logic
  const filteredBenfeitorias = benfeitorias.filter(b => {
    if (filterTipo === 'Todas') return true;
    return b.tipo === filterTipo;
  });

  // Calculate stats
  const totalInvestimento = benfeitorias.reduce((acc, curr) => acc + (curr.investimento || 0), 0);
  const totalEconomiaMensal = benfeitorias.reduce((acc, curr) => acc + (curr.economiaMensal || 0), 0);

  const getTipoBadgeStyle = (t: TipoBenfeitoria) => {
    switch (t) {
      case 'Grande Reparo & Manutenção':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Nova Aquisição & Modernização':
        return 'bg-indigo-100 text-indigo-950 border-indigo-300';
      case 'Equilíbrio Financeiro & Economia':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'Área Comum & Convivência':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const formatPrazoEntrega = (prazoStr?: string) => {
    if (!prazoStr) return 'Não informado';
    if (prazoStr.includes('-')) {
      const parts = prazoStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return prazoStr;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header com Botão Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 border border-white/60 text-slate-900 text-xs font-bold transition-all shadow-xs backdrop-blur-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isFormOpen ? 'Fechar Proposta' : 'Nova Proposta'}</span>
            </button>
          )}

          <button
            onClick={toggleRole}
            className="text-[11px] font-bold text-slate-800 bg-white/40 border border-white/50 px-2.5 py-1 rounded-full shadow-2xs hover:bg-white/60"
          >
            Modo: <span className="font-extrabold text-slate-950">{currentUser.role === 'morador' ? 'Morador' : 'Síndico'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Inspirador */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-xl border border-white/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold tracking-wide uppercase border border-white/30 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Obras, Aquisições & Conquistas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm leading-tight">
            Transparência, Melhorias e Economia Coletiva
          </h1>

          <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">
            Acompanhe o ciclo completo de cada obra e melhoria: desde a proposta inicial e os 3 orçamentos, passando pela votação eletrônica, diário de execução, até a entrega e avaliação pelos moradores.
          </p>
        </div>

        {/* Círculos de Fundo Decorativos */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Cards de Métricas e Impacto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/45 border border-white/60 p-4 rounded-3xl shadow-lg backdrop-blur-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-sm shrink-0">
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
              Total de Projetos
            </span>
            <span className="text-lg font-black text-slate-950">
              {benfeitorias.length} Realizações
            </span>
          </div>
        </div>

        <div className="bg-white/45 border border-white/60 p-4 rounded-3xl shadow-lg backdrop-blur-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-sm shrink-0">
            <DollarSign className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
              Investimento Geral
            </span>
            <span className="text-lg font-black text-purple-950">
              R$ {totalInvestimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-white/45 border border-white/60 p-4 rounded-3xl shadow-lg backdrop-blur-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm shrink-0">
            <TrendingDown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
              Economia Estimada
            </span>
            <span className="text-lg font-black text-emerald-950">
              + R$ {totalEconomiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Proposta Rápida (Admin) */}
      {isFormOpen && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white/60 border border-white/80 rounded-3xl p-5 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-950/10 pb-3">
            <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Cadastrar Proposta de Melhoria
            </h3>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Fase 1: Proposta
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Título da Obra / Conquista *</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Pintura Externa e Restauração das Fachadas"
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white/70 border border-white/90 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Categoria da Conquista</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoBenfeitoria)}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white/70 border border-white/90 focus:border-amber-500 outline-hidden cursor-pointer"
              >
                {tiposOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-800">Subtítulo ou Resumo do Benefício</label>
              <input
                type="text"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
                placeholder="Ex: Valorização patrimonial, vedação térmica e fim das infiltrações."
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white/70 border border-white/90 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-800">Descrição Detalhada do que será Realizado *</label>
              <textarea
                required
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhe o escopo pretendido, os benefícios e a justificativa..."
                className="w-full text-xs font-medium p-3 rounded-xl bg-white/70 border border-white/90 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-800">Impacto na Gestão & Contas *</label>
              <input
                type="text"
                required
                value={impactoGestao}
                onChange={(e) => setImpactoGestao(e.target.value)}
                placeholder="Ex: Executado sem chamada de capital extra, utilizando verba do fundo de reserva."
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white/70 border border-white/90 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Foto / Imagem Ilustrativa</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-semibold px-2 py-1.5 rounded-xl bg-white/70 border border-white/90"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-950/10">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/50 text-slate-800 text-xs font-bold hover:bg-white/70 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Proposta</span>
            </button>
          </div>
        </form>
      )}

      {/* Filtros por Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterTipo('Todas')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
            filterTipo === 'Todas'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white/40 text-slate-800 hover:bg-white/60 border border-white/50'
          }`}
        >
          Todas ({benfeitorias.length})
        </button>

        {tiposOptions.map(t => {
          const count = benfeitorias.filter(b => b.tipo === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilterTipo(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                filterTipo === t
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white/40 text-slate-800 hover:bg-white/60 border border-white/50'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de Cards Expansíveis de Benfeitorias */}
      <div className="space-y-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Projetos, Obras & Realizações ({filteredBenfeitorias.length})
        </span>

        {filteredBenfeitorias.length === 0 ? (
          <div className="bg-white/45 border border-white/60 rounded-3xl p-8 text-center space-y-2 shadow-xl">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto opacity-90 drop-shadow" />
            <h3 className="text-sm font-extrabold text-slate-950">Nenhuma Benfeitoria Registrada</h3>
            <p className="text-xs text-slate-800 font-semibold max-w-sm mx-auto">
              As benfeitorias, propostas e obras do condomínio serão exibidas aqui.
            </p>
          </div>
        ) : (
          filteredBenfeitorias.map((item) => {
            const isExpanded = expandedId === item.id || (expandedId === 'initial' && item === filteredBenfeitorias[0]);
            const statusAtual = item.statusAtual || 'entregue';
            const statusConfig = STATUS_CONFIG_MORADOR[statusAtual] || STATUS_CONFIG_MORADOR.entregue;
            const isCancelado = statusAtual === 'cancelada';

            // Dados do morador atual nesta benfeitoria
            const meuVoto = (item.votos || []).find(v => 
              (currentUser.id && v.moradorId === currentUser.id) ||
              (currentUser.unidade && v.unidade.includes(currentUser.unidade))
            );

            const minhaAvaliacao = (item.avaliacoes || []).find(a => 
              (currentUser.id && a.moradorId === currentUser.id) ||
              (currentUser.unidade && a.unidade.includes(currentUser.unidade))
            );

            return (
              <div
                key={item.id}
                className={`bg-white/55 border rounded-3xl overflow-hidden shadow-xl hover:bg-white/65 transition-all duration-300 ${
                  isCancelado ? 'border-red-400/80 bg-red-50/40' : 'border-white/70'
                }`}
              >
                {/* Header Compacto (Sempre Visível) */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${getTipoBadgeStyle(item.tipo)}`}>
                        {item.tipo}
                      </span>

                      {/* Badge do Status Atual */}
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${statusConfig.badgeColor}`}>
                        {statusConfig.label}
                      </span>

                      {item.notaMediaFinal && (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {item.notaMediaFinal}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-700 font-mono font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.dataEntrega || item.dataCriacao}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                      {item.titulo}
                    </h3>

                    {item.subtitulo && (
                      <p className="text-xs text-slate-800 font-semibold line-clamp-1 italic">
                        "{item.subtitulo}"
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 p-2 rounded-full bg-white/70 border border-white/90 text-slate-900 shadow-xs">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Corpo Expansível */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 space-y-5 border-t border-slate-950/10 pt-4 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Stepper Horizontal das 7 Fases */}
                    <div className="bg-white/70 border border-white/90 p-3 sm:p-4 rounded-2xl overflow-x-auto shadow-xs">
                      <div className="flex items-center justify-between min-w-[580px] gap-2">
                        {(['proposta', 'orcamento', 'votacao', 'contratada', 'execucao', 'avaliacao', 'entregue'] as StatusFaseBenfeitoria[]).map((st, idx) => {
                          const isPastOrCurrent = statusAtual === st || (STATUS_CONFIG_MORADOR[statusAtual]?.stepNumber >= idx + 1 && statusAtual !== 'cancelada');
                          const isCurrent = statusAtual === st;
                          return (
                            <div key={st} className="flex-1 flex flex-col items-center text-center">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-xs ${
                                  isCurrent
                                    ? 'bg-amber-600 text-white ring-4 ring-amber-300 scale-105'
                                    : isPastOrCurrent
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isPastOrCurrent && !isCurrent ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                              </div>
                              <span className={`text-[10px] mt-1 font-bold line-clamp-1 ${isCurrent ? 'text-amber-950 font-black' : isPastOrCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                                {STATUS_CONFIG_MORADOR[st].label.split('. ')[1]}
                              </span>
                            </div>
                          );
                        })}

                        {isCancelado && (
                          <div className="flex flex-col items-center text-center">
                            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs ring-4 ring-red-300">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] mt-1 font-black text-red-700">Cancelado</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FASE 8: CANCELAMENTO / QUEBRA DE CONTRATO */}
                    {isCancelado && item.cancelamentoInfo && (
                      <div className="bg-red-50 border-2 border-red-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-md">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <h4 className="text-sm font-black text-red-950 uppercase tracking-wide">
                            Contrato / Obra Cancelada
                          </h4>
                          <span className="text-[11px] font-bold text-red-800 ml-auto">
                            Em {item.cancelamentoInfo.dataCancelamento}
                          </span>
                        </div>

                        <div className="bg-white/80 p-3 rounded-xl border border-red-200 text-xs font-semibold text-red-950 leading-relaxed">
                          <strong>Justificativa da Administração:</strong>
                          <p className="mt-1 whitespace-pre-line text-slate-800">
                            {item.cancelamentoInfo.motivo}
                          </p>
                        </div>

                        {item.cancelamentoInfo.fotos && item.cancelamentoInfo.fotos.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-red-900 block">
                              Fotos Probatórias / Notificações:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {item.cancelamentoInfo.fotos.map((f, i) => (
                                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-red-300 bg-slate-950 flex items-center justify-center p-1">
                                  <img src={f} alt="Cancelamento" className="w-full h-full object-contain" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Galeria de Fotos da Benfeitoria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center">
                      {item.fotosAntes && item.fotosAntes.length > 0 && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/80 w-full max-w-[280px] aspect-square mx-auto bg-slate-950 flex items-center justify-center p-1.5 shadow-md">
                          <img 
                            src={item.fotosAntes[0]} 
                            alt="Antes da melhoria" 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none flex items-end p-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white shadow-xs">
                              Estado Anterior
                            </span>
                          </div>
                        </div>
                      )}

                      {item.fotos && item.fotos.length > 0 && (
                        <div className={`relative rounded-2xl overflow-hidden border border-white/80 w-full max-w-[280px] aspect-square mx-auto bg-slate-950 flex items-center justify-center p-1.5 shadow-md ${
                          !item.fotosAntes || item.fotosAntes.length === 0 ? 'sm:col-span-2' : ''
                        }`}>
                          <img 
                            src={item.fotos[0]} 
                            alt={item.titulo} 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none flex items-end p-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                              {statusAtual === 'entregue' ? 'Obra Entregue ✓' : 'Registro Fotográfico'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descrição Detalhada */}
                    <div className="bg-white/60 border border-white/80 p-3.5 rounded-2xl text-xs space-y-2">
                      <h4 className="font-extrabold text-slate-950 uppercase tracking-wide text-[11px]">
                        Descrição & Benefícios Pretendidos:
                      </h4>
                      <p className="text-slate-900 leading-relaxed font-semibold">
                        {item.descricao}
                      </p>
                    </div>

                    {/* FASE 2 & 3: OS 3 ORÇAMENTOS & VOTAÇÃO ELETRÔNICA */}
                    {item.orcamentos && item.orcamentos.length > 0 && (
                      <div className="bg-white/70 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-sky-600" />
                              3 Orçamentos Comparativos
                            </h4>
                            <p className="text-[11px] text-slate-600 font-semibold">
                              Avalie os prazos de entrega, valores e histórico de prestação de serviços.
                            </p>
                          </div>

                          {item.votacaoAberta && (
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                                🗳️ Votação Aberta aos Condôminos
                              </span>
                              {item.prazoFimVotacao && (
                                <span className="text-[10px] font-bold text-slate-600">
                                  até {formatPrazoEntrega(item.prazoFimVotacao)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Cards dos 3 Orçamentos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {item.orcamentos.map((orc, idx) => {
                            const votosDesteOrc = (item.votos || []).filter(v => v.orcamentoIdEscolhido === orc.id);
                            const totalVotos = item.votos?.length || 0;
                            const percentual = totalVotos > 0 ? Math.round((votosDesteOrc.length / totalVotos) * 100) : 0;
                            const isVotedByMe = meuVoto?.orcamentoIdEscolhido === orc.id;

                            return (
                              <div
                                key={orc.id}
                                className={`rounded-2xl p-3.5 border-2 transition-all flex flex-col justify-between space-y-3 ${
                                  isVotedByMe
                                    ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300'
                                    : 'bg-white border-slate-200 hover:border-amber-300'
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-900">
                                      Opção {idx + 1}
                                    </span>
                                    {isVotedByMe && (
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3 stroke-[3]" /> Seu Voto
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <h5 className="text-sm font-black text-slate-950 leading-snug">
                                      {orc.empresaNome || `Empresa ${idx + 1}`}
                                    </h5>
                                    {orc.site && (
                                      <a
                                        href={orc.site}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-indigo-700 font-bold hover:underline inline-flex items-center gap-0.5 mt-0.5"
                                      >
                                        <span>Visitar site</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>

                                  {/* Dados do Orçamento */}
                                  <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-600 font-semibold">Valor Total:</span>
                                      <strong className="text-slate-950 font-black">
                                        R$ {orc.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </strong>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-600 font-semibold">Prazo de Entrega:</span>
                                      <strong className="text-slate-900 font-bold text-[11px]">
                                        {formatPrazoEntrega(orc.prazoEntrega)}
                                      </strong>
                                    </div>

                                    <div className="text-[11px] text-slate-700 pt-0.5">
                                      <span className="text-slate-500 font-bold">Pagamento: </span>
                                      <span>{orc.formaPagamento || 'A combinar'}</span>
                                    </div>
                                  </div>

                                  {/* Histórico da Empresa */}
                                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                                    <span className="font-bold text-slate-700 block">
                                      Histórico no Condomínio:
                                    </span>
                                    {orc.jaPrestouServico ? (
                                      <div className="flex items-center justify-between">
                                        <span className="text-emerald-700 font-bold">Já prestou serviços</span>
                                        <div className="flex items-center gap-0.5 text-amber-500 font-black">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                          <span>{orc.avaliacaoMediaAnterior || 5} ★</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-slate-500 italic block">
                                        Primeira prestação de serviço
                                      </span>
                                    )}
                                  </div>

                                  {/* Contagem Anônima de Votos (Sem nomes, conforme especificação) */}
                                  <div className="pt-1 space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                      <span>Total de Votos:</span>
                                      <span className="font-black text-slate-950">
                                        {votosDesteOrc.length} {votosDesteOrc.length === 1 ? 'voto' : 'votos'} ({percentual}%)
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${percentual}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Botão de Votação para o Morador */}
                                {item.votacaoAberta && (
                                  <button
                                    type="button"
                                    disabled={submittingVoteId === item.id}
                                    onClick={() => handleVotar(item.id, orc.id)}
                                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                                      isVotedByMe
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95'
                                    }`}
                                  >
                                    {submittingVoteId === item.id
                                      ? 'Salvando voto...'
                                      : isVotedByMe
                                      ? 'Voto Registrado ✓ (Alterar)'
                                      : `Votar no Orçamento ${idx + 1}`}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FASE 4: DADOS DA EMPRESA CONTRATADA */}
                    {item.empresaEleita && (
                      <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl space-y-2 shadow-xs">
                        <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                          <span className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-blue-700" />
                            Empresa Contratada Oficialmente
                          </span>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                            Fase 4 Concluída
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Empresa</span>
                            <strong className="text-slate-950 font-black">{item.empresaEleita.empresaNome}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Início / Término</span>
                            <strong className="text-slate-900">{formatPrazoEntrega(item.empresaEleita.dataInicio)} até {formatPrazoEntrega(item.empresaEleita.dataTerminoPrevista)}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Valor Contratado</span>
                            <strong className="text-slate-950 font-black">R$ {item.empresaEleita.valorContratado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Valor Já Pago</span>
                            <strong className="text-emerald-700 font-black">R$ {item.empresaEleita.valorPago?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FASE 5: DIÁRIO DE OBRAS & ATUALIZAÇÕES DA EXECUÇÃO */}
                    {item.diarioObras && item.diarioObras.length > 0 && (
                      <div className="bg-orange-50/80 border border-orange-200 p-4 rounded-2xl space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-orange-200 pb-1.5">
                          <span className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-orange-600" />
                            Diário de Execução da Obra ({item.diarioObras.length})
                          </span>
                        </div>

                        <div className="space-y-2">
                          {item.diarioObras.map((diario) => (
                            <div key={diario.id} className="bg-white p-3 rounded-xl border border-orange-200 shadow-2xs space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-orange-950">
                                <span>{diario.data}</span>
                                {diario.autorNome && <span className="text-slate-400">por {diario.autorNome}</span>}
                              </div>
                              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                                {diario.descricao}
                              </p>
                              {diario.fotos && diario.fotos.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {diario.fotos.map((f, i) => (
                                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-orange-200 bg-slate-950 flex items-center justify-center p-1">
                                      <img src={f} alt="Diário" className="w-full h-full object-contain" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FASE 6: AVALIAÇÃO DOS CONDÔMINOS (1 a 5 Estrelas) */}
                    {(item.avaliacaoAberta || (item.avaliacoes && item.avaliacoes.length > 0)) && (
                      <div className="bg-purple-50/80 border border-purple-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                              Avaliação dos Condôminos sobre a Obra Entregue
                            </h4>
                            <p className="text-[11px] text-purple-900 font-semibold">
                              Nota Média Geral:{' '}
                              <strong className="text-purple-950 text-sm font-black">
                                {item.notaMediaFinal ? `${item.notaMediaFinal} ★` : 'Em apuração'}
                              </strong>{' '}
                              ({item.avaliacoes?.length || 0} avaliações registradas)
                            </p>
                          </div>

                          {item.avaliacaoAberta && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white shadow-xs">
                              ⭐ Avaliação Aberta
                            </span>
                          )}
                        </div>

                        {/* Widget de Envio da Nota pelo Condômino */}
                        {item.avaliacaoAberta && (
                          <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-3 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-900">
                                {minhaAvaliacao ? 'Sua Avaliação Registrada:' : 'Dê sua nota de satisfação (1 a 5 estrelas):'}
                              </span>

                              {/* Estrelas interativas */}
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const currentVal = ratingInput[item.id] || minhaAvaliacao?.nota || 5;
                                  return (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRatingInput({ ...ratingInput, [item.id]: star })}
                                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                      <Star
                                        className={`w-6 h-6 ${
                                          star <= currentVal
                                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                                <span className="ml-1 text-xs font-black text-amber-600">
                                  {ratingInput[item.id] || minhaAvaliacao?.nota || 5} de 5
                                </span>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={ratingComment[item.id] !== undefined ? ratingComment[item.id] : (minhaAvaliacao?.comentario || '')}
                              onChange={(e) => setRatingComment({ ...ratingComment, [item.id]: e.target.value })}
                              placeholder="Deixe um comentário sobre a qualidade da entrega (opcional)..."
                              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                            />

                            <div className="flex justify-end">
                              <button
                                type="button"
                                disabled={submittingRatingId === item.id}
                                onClick={() => handleAvaliar(item.id)}
                                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95"
                              >
                                {submittingRatingId === item.id
                                  ? 'Enviando...'
                                  : minhaAvaliacao
                                  ? 'Atualizar Minha Nota'
                                  : 'Enviar Avaliação'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Destaques de Gestão & Finanças */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-amber-500/15 border border-amber-400/50 p-3 rounded-2xl text-xs space-y-1">
                        <span className="text-[10px] font-extrabold text-amber-950 uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Impacto na Gestão & Contas
                        </span>
                        <p className="text-slate-950 font-bold leading-snug">
                          {item.impactoGestao}
                        </p>
                      </div>

                      <div className="bg-emerald-500/15 border border-emerald-400/50 p-3 rounded-2xl text-xs space-y-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-800 font-extrabold">Investimento Total:</span>
                          <strong className="text-slate-950 font-extrabold">
                            {item.investimento ? `R$ ${item.investimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Ver prestação'}
                          </strong>
                        </div>
                        {item.economiaMensal && (
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-400/30">
                            <span className="text-emerald-950 font-extrabold">Economia Estimada:</span>
                            <strong className="text-emerald-800 font-extrabold">
                              + R$ {item.economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Regras de Uso (se houver) */}
                    {item.regrasUso && (
                      <div className="p-3 rounded-2xl bg-white/50 border border-white/70 text-xs">
                        <span className="text-[10px] font-extrabold text-slate-800 uppercase block mb-1">
                          Regras de Utilização:
                        </span>
                        <p className="text-slate-900 font-medium">
                          {item.regrasUso}
                        </p>
                      </div>
                    )}

                    {/* Botão para Expandir a Linha do Tempo Histórica */}
                    {item.timeline && item.timeline.length > 0 && (
                      <div className="pt-2 border-t border-slate-950/10">
                        <button
                          type="button"
                          onClick={() => setShowTimelineId(showTimelineId === item.id ? null : item.id)}
                          className="w-full p-2.5 rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-800 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 font-black">
                            <Clock className="w-4 h-4 text-amber-600" />
                            Linha do Tempo Completa do Projeto ({item.timeline.length} fases registradas)
                          </span>
                          {showTimelineId === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showTimelineId === item.id && (
                          <div className="mt-3 p-4 bg-white/80 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in duration-200">
                            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-300">
                              {item.timeline.map((p, pIdx) => {
                                const cfg = STATUS_CONFIG_MORADOR[p.status] || STATUS_CONFIG_MORADOR.proposta;
                                return (
                                  <div key={p.id || pIdx} className="relative">
                                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className={`font-black uppercase px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                                          {cfg.label}
                                        </span>
                                        <span className="text-slate-500 font-bold">{p.data}</span>
                                      </div>
                                      <h6 className="text-xs font-black text-slate-900">{p.titulo}</h6>
                                      <p className="text-[11px] text-slate-700">{p.descricao}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link para Prestação de Contas */}
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => setCurrentScreen('prestacao-contas')}
                        className="inline-flex items-center gap-1 text-xs text-indigo-900 font-extrabold hover:underline cursor-pointer"
                      >
                        Consultar lançamento na Prestação de Contas <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
