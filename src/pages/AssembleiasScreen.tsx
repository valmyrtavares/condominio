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
  Hourglass
} from 'lucide-react';
import { AtaPdfModal } from '../components/assembleia/AtaPdfModal';

export const AssembleiasScreen: React.FC = () => {
  const { assembleias, setCurrentScreen } = useCondo();

  const [expandedAssembleiaId, setExpandedAssembleiaId] = useState<string | null>('ass-age-setembro-2026');
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [selectedAtaAssembleia, setSelectedAtaAssembleia] = useState<Assembleia | null>(null);
  const [presencaConfirmada, setPresencaConfirmada] = useState<Record<string, boolean>>({});

  const filterOptions = [
    'Todas',
    'Agendadas',
    'Realizadas com Ata',
    'Aguardando Ata'
  ];

  // Filter Logic
  const filteredAssembleias = assembleias.filter(a => {
    let matchesStatus = true;
    if (filterStatus === 'Agendadas') matchesStatus = a.status === 'Agendada';
    if (filterStatus === 'Realizadas com Ata') matchesStatus = a.status === 'Realizada com Ata Publicada';
    if (filterStatus === 'Aguardando Ata') matchesStatus = a.status === 'Realizada - Aguardando Ata';

    const matchesSearch = !searchTerm || 
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descricaoGeral.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pautas.some(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
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
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Gavel className="w-5 h-5 text-amber-400" />
          Assembleias do Condomínio
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Acompanhe convocações, pautas em discussão, deliberações com checks de votação e atas oficiais em PDF.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Status:
          </span>
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterStatus(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
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
            placeholder="Buscar por pauta ou assunto (ex: Usina Solar, Portaria, Eleição, Fachada)..."
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

        {filteredAssembleias.map((assembleia) => {
          const isExpanded = expandedAssembleiaId === assembleia.id;
          const theme = getCardTheme(assembleia.status);
          const isAgendada = assembleia.status === 'Agendada';
          const isRealizadaComAta = assembleia.status === 'Realizada com Ata Publicada';
          const isAguardandoAta = assembleia.status === 'Realizada - Aguardando Ata';
          const estaConfirmado = presencaConfirmada[assembleia.id];

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
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs ${theme.headerBadgeBg}`}>
                      {theme.badgeText}
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
                      className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all border shadow-xs active:scale-95 flex items-center gap-1 ${
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
                      <span className="text-[10px] uppercase font-extrabold text-slate-600 block">2ª Chamada:</span>
                      <strong className="text-slate-950 font-bold">{assembleia.segundaChamada}</strong>
                    </div>
                  </div>

                  {/* Seção 1: Pautas / Assuntos Tratados */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-700" />
                        {isAgendada ? 'Assuntos que Serão Tratados na Pauta' : 'Questões & Pautas Deliberadas'}
                      </span>
                    </div>

                    <div className="space-y-2">
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
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 leading-tight">
                                {pauta.titulo}
                              </h4>
                              
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

                        <button
                          type="button"
                          onClick={() => setSelectedAtaAssembleia(assembleia)}
                          className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span>Abrir Ata Oficial em PDF</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </>
                    )}

                    {/* Status 3: Realizada - Aguardando Ata */}
                    {isAguardandoAta && (
                      <div className="w-full p-3 bg-amber-500/20 border border-amber-400/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 font-semibold">
                        <Hourglass className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs font-black text-amber-950">
                            Ata em Fase de Redação e Coleta de Assinaturas
                          </strong>
                          <p className="text-[11px] text-amber-900 mt-0.5">
                            A assembleia já foi realizada. O Secretário da mesa está finalizando a redação formal e colhendo as assinaturas digitais antes do registro cartorial e disponibilização do PDF.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status 1: Agendada */}
                    {isAgendada && (
                      <div className="w-full p-3 bg-white/70 border border-white/90 rounded-2xl flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-bold text-slate-800">
                          Ata será lavrada e disponibilizada logo após o encerramento da sessão.
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                          Sessão Pendente
                        </span>
                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal de Visualização da Ata em PDF (Estilo Nota Fiscal / Cartório) */}
      {selectedAtaAssembleia && (
        <AtaPdfModal
          assembleia={selectedAtaAssembleia}
          onClose={() => setSelectedAtaAssembleia(null)}
        />
      )}

    </div>
  );
};
