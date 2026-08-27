import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Assembleia, StatusAssembleia } from '../types';
import { 
  Gavel, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  XCircle, 
  Search, 
  FileCheck, 
  Users, 
  ExternalLink,
  ShieldCheck,
  Hourglass,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Wrench,
  Sparkles
} from 'lucide-react';
import { AtaPdfModal } from '../components/assembleia/AtaPdfModal';
import { CreateEditAssembleiaModal } from '../components/assembleia/CreateEditAssembleiaModal';
import { PublicarAtaModal } from '../components/assembleia/PublicarAtaModal';

export const AssembleiasScreen: React.FC = () => {
  const { 
    assembleias, 
    setCurrentScreen, 
    currentUser, 
    isAdminLoggedIn,
    excluirAssembleia 
  } = useCondo();

  const [expandedAssembleiaId, setExpandedAssembleiaId] = useState<string | null>('ass-age-setembro-2026');
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals state
  const [selectedAtaAssembleia, setSelectedAtaAssembleia] = useState<Assembleia | null>(null);
  const [isModalCreateEditOpen, setIsModalCreateEditOpen] = useState(false);
  const [assembleiaToEdit, setAssembleiaToEdit] = useState<Assembleia | null>(null);
  const [isModalPublicarAtaOpen, setIsModalPublicarAtaOpen] = useState(false);
  const [assembleiaParaAta, setAssembleiaParaAta] = useState<Assembleia | null>(null);

  const [presencaConfirmada, setPresencaConfirmada] = useState<Record<string, boolean>>({});

  const isAdmin = currentUser.role === 'sindico' || currentUser.role === 'subsindico' || Boolean(isAdminLoggedIn);
  const currentUserUnit = currentUser.unidade ? currentUser.unidade.replace(/[^0-9]/g, '') : '';

  const filterOptions = [
    'Todas',
    'Assembleias Gerais',
    'Reuniões Informais',
    'Agendadas',
    'Realizadas com Ata'
  ];

  // Permissão de visualização para reuniões informais
  const checkCanViewAssembleia = (a: Assembleia) => {
    if (isAdmin) return true;
    if (a.tipoEncontro !== 'Reunião Informal' || a.participantesTipo === 'todos') return true;
    
    // Se for reunião informal específica, checar se a unidade do morador está na lista
    if (a.participantesIds && a.participantesIds.length > 0) {
      return a.participantesIds.some(p => p.replace(/[^0-9]/g, '') === currentUserUnit);
    }
    return true;
  };

  // Filter Logic
  const filteredAssembleias = assembleias.filter(a => {
    if (!checkCanViewAssembleia(a)) return false;

    let matchesFilter = true;
    if (filterStatus === 'Assembleias Gerais') matchesFilter = a.tipoEncontro !== 'Reunião Informal';
    if (filterStatus === 'Reuniões Informais') matchesFilter = a.tipoEncontro === 'Reunião Informal';
    if (filterStatus === 'Agendadas') matchesFilter = a.status === 'Agendada';
    if (filterStatus === 'Realizadas com Ata') matchesFilter = a.status === 'Realizada com Ata Publicada';

    const matchesSearch = !searchTerm || 
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descricaoGeral.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pautas.some(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedAssembleiaId(prev => (prev === id ? null : id));
  };

  const handleTogglePresenca = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresencaConfirmada(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Card theme helper based on user specification:
  // - Fundo padrão claro com glassmorphism (bg-white/50)
  // - Contorno Rosa para as que não ocorreram (Agendada)
  // - Contorno Amarelo para as que já ocorreram e não têm ata (Realizada - Aguardando Ata)
  // - Contorno Verde para as que estão completas (Realizada com Ata Publicada)
  const getCardTheme = (status: StatusAssembleia) => {
    switch (status) {
      case 'Realizada com Ata Publicada':
        return {
          cardBg: 'bg-white/50 border-2 border-emerald-400/90 hover:bg-white/60 ring-1 ring-emerald-400/30',
          headerBadgeBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-black',
          badgeText: '✓ Realizada & Ata Publicada',
          iconColor: 'text-emerald-800',
          accentBorder: 'border-emerald-300',
          indicatorColor: 'text-emerald-900'
        };
      case 'Realizada - Aguardando Ata':
        return {
          cardBg: 'bg-white/50 border-2 border-amber-400/90 hover:bg-white/60 ring-1 ring-amber-400/30',
          headerBadgeBg: 'bg-amber-100 text-amber-950 border border-amber-300 font-black',
          badgeText: '⏳ Realizada - Aguardando Ata',
          iconColor: 'text-amber-900',
          accentBorder: 'border-amber-300',
          indicatorColor: 'text-amber-950'
        };
      case 'Agendada':
      default:
        return {
          cardBg: 'bg-white/50 border-2 border-rose-400/90 hover:bg-white/60 ring-1 ring-rose-400/30',
          headerBadgeBg: 'bg-rose-100 text-rose-950 border border-rose-300 font-black',
          badgeText: '📅 Agendada (A Ocorrer)',
          iconColor: 'text-rose-800',
          accentBorder: 'border-rose-300',
          indicatorColor: 'text-rose-950'
        };
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Back button & Agendar Reunião */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              setAssembleiaToEdit(null);
              setIsModalCreateEditOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-300"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agendar Reunião</span>
          </button>
        )}
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Gavel className="w-5 h-5 text-amber-400" />
          Assembleias & Reuniões de Condomínio
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Acompanhe convocações formais, reuniões comissões, deliberações de reclamações/reparos e atas registradas com soluções.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Filtrar:
          </span>
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterStatus === opt
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por pauta, assunto, reclamação ou reparo (ex: Usina Solar, Portaria, Barulho, Infiltração)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* Lista de Cards de Assembleia */}
      <div className="space-y-3.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Histórico & Sessões Convocadas ({filteredAssembleias.length})
        </span>

        {filteredAssembleias.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-white/70 rounded-3xl space-y-3">
            <Gavel className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="text-sm font-black text-slate-950">Nenhuma reunião ou assembleia encontrada.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setAssembleiaToEdit(null);
                  setIsModalCreateEditOpen(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md cursor-pointer"
              >
                + Agendar a Primeira Reunião
              </button>
            )}
          </div>
        ) : (
          filteredAssembleias.map((assembleia) => {
            const isExpanded = expandedAssembleiaId === assembleia.id;
            const theme = getCardTheme(assembleia.status);
            const isAgendada = assembleia.status === 'Agendada';
            const isRealizadaComAta = assembleia.status === 'Realizada com Ata Publicada';
            const isAguardandoAta = assembleia.status === 'Realizada - Aguardando Ata';
            const estaConfirmado = presencaConfirmada[assembleia.id];
            const isInformal = assembleia.tipoEncontro === 'Reunião Informal';

            return (
              <div
                key={assembleia.id}
                className={`rounded-3xl border transition-all shadow-xl overflow-hidden ${theme.cardBg}`}
              >
                
                {/* Header do Card (Clicável para Expandir/Recolher) */}
                <div
                  onClick={() => toggleExpand(assembleia.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col gap-2.5 transition-colors select-none"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs ${theme.headerBadgeBg}`}>
                        {theme.badgeText}
                      </span>

                      {/* Badge Tipo de Encontro */}
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-2xs ${
                        isInformal 
                          ? 'bg-indigo-100 text-indigo-950 border-indigo-300' 
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        {isInformal ? <Users className="w-3 h-3 text-indigo-700" /> : <Building2 className="w-3 h-3 text-amber-700" />}
                        {isInformal ? '🤝 Reunião Informal' : '🏛️ Assembleia Geral'}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-slate-900 border border-white/80">
                        {assembleia.tipo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-950 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-800" />
                        {assembleia.dataHora}
                      </span>

                      {/* Ações Rápidas do Admin no Topo do Card */}
                      {isAdmin && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setAssembleiaParaAta(assembleia);
                              setIsModalPublicarAtaOpen(true);
                            }}
                            className="p-1.5 rounded-xl bg-white/80 hover:bg-emerald-100 text-emerald-800 border border-white/90 shadow-2xs hover:text-emerald-950 transition-all cursor-pointer"
                            title="Publicar / Editar Ata Oficial e Soluções"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAssembleiaToEdit(assembleia);
                              setIsModalCreateEditOpen(true);
                            }}
                            className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-white/90 shadow-2xs hover:text-amber-700 transition-all cursor-pointer"
                            title="Editar Reunião"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja excluir a reunião "${assembleia.titulo}"?`)) {
                                excluirAssembleia(assembleia.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-white/80 hover:bg-rose-100 text-rose-600 border border-white/90 shadow-2xs hover:text-rose-800 transition-all cursor-pointer"
                            title="Excluir Reunião"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="p-1.5 rounded-full bg-white/70 border border-white/90 text-slate-900 shadow-2xs">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-tight">
                        {assembleia.titulo}
                      </h3>
                      <p className="text-xs text-slate-900 font-medium line-clamp-2">
                        {assembleia.descricaoGeral}
                      </p>
                    </div>
                  </div>

                  {/* Participantes convocados quando for reunião informal */}
                  {isInformal && (
                    <div className="p-2 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span>
                        Convocados: <strong>{assembleia.participantesDescricao || (assembleia.participantesIds ? `Unidades: ${assembleia.participantesIds.join(', ')}` : 'Participantes selecionados')}</strong>
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-950/10 text-[11px] text-slate-900 font-bold">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        {assembleia.local}
                      </span>
                      <span>•</span>
                      <span>{assembleia.pautas.length} pauta(s)</span>
                    </div>

                    {isAgendada && (
                      <button
                        type="button"
                        onClick={(e) => handleTogglePresenca(assembleia.id, e)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all border shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer ${
                          estaConfirmado 
                            ? 'bg-emerald-600 text-white border-emerald-700' 
                            : 'bg-white/80 hover:bg-white text-slate-950 border-white/90'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{estaConfirmado ? '✓ Presença Confirmada' : 'Confirmar Presença'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Conteúdo Expandido do Card */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-slate-950/10 pt-4 bg-white/40 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Informações de Chamada */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-white/90 space-y-0.5">
                        <span className="text-[10px] uppercase font-extrabold text-slate-600 block">1ª Chamada:</span>
                        <strong className="text-slate-950 font-bold">{assembleia.primeiraChamada}</strong>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-white/90 space-y-0.5">
                        <span className="text-[10px] uppercase font-extrabold text-slate-600 block">2ª Chamada / Início:</span>
                        <strong className="text-slate-950 font-bold">{assembleia.segundaChamada}</strong>
                      </div>
                    </div>

                    {/* Seção 1: Pautas / Assuntos Tratados com Soluções Integradas */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-700" />
                          {isAgendada ? 'Assuntos que Serão Tratados na Pauta' : 'Questões & Pautas Deliberadas'}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {assembleia.pautas.map((pauta, idx) => (
                          <div
                            key={pauta.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 shadow-xs ${
                              pauta.aprovada === true
                                ? 'bg-white/90 border-emerald-400'
                                : pauta.aprovada === false
                                  ? 'bg-white/80 border-rose-300'
                                  : 'bg-white/80 border-white/95'
                            }`}
                          >
                            {/* Indicador de Votação (Check Verde para Aprovada / X para Reprovada / Número para Agendada) */}
                            <div className="shrink-0 mt-0.5">
                              {pauta.aprovada === true && (
                                <div className="p-1.5 rounded-full bg-emerald-600 text-white shadow-xs" title="Pauta Aprovada">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              )}

                              {pauta.aprovada === false && (
                                <div className="p-1.5 rounded-full bg-rose-600 text-white shadow-xs" title="Pauta Rejeitada">
                                  <XCircle className="w-4 h-4 stroke-[2.5]" />
                                </div>
                              )}

                              {pauta.aprovada === undefined && (
                                <div className="w-7 h-7 rounded-xl bg-amber-500/30 text-amber-950 font-black text-xs flex items-center justify-center border border-amber-400/50">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            {/* Dados da Pauta */}
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 leading-tight">
                                    {pauta.titulo}
                                  </h4>
                                  {/* Badge de Origem */}
                                  {pauta.origemTipo && (
                                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border ${
                                      pauta.origemTipo === 'reclamacao'
                                        ? 'bg-rose-100 text-rose-950 border-rose-300'
                                        : pauta.origemTipo === 'reparo'
                                        ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                                        : 'bg-slate-100 text-slate-800 border-slate-300'
                                    }`}>
                                      {pauta.origemTipo === 'reclamacao' ? '📌 Reclamação Vinculada' : pauta.origemTipo === 'reparo' ? '🔧 Reparo Vinculado' : '➕ Pauta Geral'}
                                    </span>
                                  )}
                                </div>
                                
                                {pauta.aprovada === true && (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 shrink-0">
                                    ✓ Aprovada
                                  </span>
                                )}

                                {pauta.aprovada === false && (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-300 shrink-0">
                                    ✕ Rejeitada
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                                {pauta.descricao}
                              </p>

                              {/* Solução / Deliberação Gerada para esta pauta */}
                              {pauta.solucaoAta && (
                                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 text-[11px] space-y-0.5">
                                  <strong className="block font-black flex items-center gap-1 text-emerald-900">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Solução & Deliberação Gerada na Reunião:
                                  </strong>
                                  <p className="font-semibold leading-relaxed text-slate-900">{pauta.solucaoAta}</p>
                                </div>
                              )}

                              {pauta.resultadoVotacao && (
                                <div className="pt-1 text-[11px] font-mono font-extrabold text-indigo-950">
                                  Resultado: <span className="underline">{pauta.resultadoVotacao}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seção 2: Resumo de O que Foi Resolvido (Para sessões com Ata) */}
                    {assembleia.ata && (
                      <div className="p-4 rounded-2xl bg-white/80 border border-emerald-300 shadow-sm space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-950 font-black text-xs uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>O Que Foi Resolvido Nesta Reunião (Resumo da Ata):</span>
                        </div>
                        <p className="text-xs text-slate-900 font-medium leading-relaxed">
                          {assembleia.ata.resumoDecisoes}
                        </p>
                      </div>
                    )}

                    {/* Seção 3: Status da Ata / Botão de Visualização em PDF */}
                    <div className="pt-2 border-t border-slate-950/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      
                      {/* Status 2: Realizada com Ata Publicada */}
                      {isRealizadaComAta && assembleia.ata && (
                        <>
                          <div className="text-xs text-slate-800 font-medium space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-600 block">
                              Documento Oficial Registrado:
                            </span>
                            <span className="font-mono font-bold text-slate-950">
                              {assembleia.ata.numeroAta} ({assembleia.ata.dataLavratura})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedAtaAssembleia(assembleia)}
                              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span>Abrir Ata Oficial em PDF</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAssembleiaParaAta(assembleia);
                                  setIsModalPublicarAtaOpen(true);
                                }}
                                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
                                title="Editar Ata e Soluções"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Editar Ata
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {/* Status 3: Realizada - Aguardando Ata */}
                      {isAguardandoAta && (
                        <div className="w-full p-3 bg-amber-500/20 border border-amber-400/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950 font-semibold">
                          <div className="flex items-start gap-2">
                            <Hourglass className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-xs font-black text-amber-950">
                                Ata em Fase de Redação e Coleta de Assinaturas
                              </strong>
                              <p className="text-[11px] text-amber-900 mt-0.5">
                                A reunião já ocorreu. O registro formal está sendo elaborado.
                              </p>
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setAssembleiaParaAta(assembleia);
                                setIsModalPublicarAtaOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase shadow-xs transition-all cursor-pointer shrink-0"
                            >
                              Publicar Ata & Soluções
                            </button>
                          )}
                        </div>
                      )}

                      {/* Status 1: Agendada */}
                      {isAgendada && (
                        <div className="w-full p-3 bg-white/70 border border-white/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] font-bold text-slate-800">
                            Ata será lavrada e disponibilizada logo após o encerramento da sessão.
                          </span>
                          
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setAssembleiaParaAta(assembleia);
                                setIsModalPublicarAtaOpen(true);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase shadow-xs transition-all cursor-pointer shrink-0"
                            >
                              Registrar Ata e Decisões
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação / Edição de Assembleia / Reunião */}
      <CreateEditAssembleiaModal
        isOpen={isModalCreateEditOpen}
        onClose={() => {
          setIsModalCreateEditOpen(false);
          setAssembleiaToEdit(null);
        }}
        assembleiaToEdit={assembleiaToEdit}
      />

      {/* Modal de Publicação de Ata & Soluções */}
      <PublicarAtaModal
        isOpen={isModalPublicarAtaOpen}
        onClose={() => {
          setIsModalPublicarAtaOpen(false);
          setAssembleiaParaAta(null);
        }}
        assembleia={assembleiaParaAta}
      />

      {/* Modal de Visualização da Ata em PDF */}
      {selectedAtaAssembleia && (
        <AtaPdfModal
          assembleia={selectedAtaAssembleia}
          onClose={() => setSelectedAtaAssembleia(null)}
        />
      )}

    </div>
  );
};
