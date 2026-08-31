import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { EventoCondominio } from '../types';
import { 
  Calendar, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Users, 
  Clock, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Search,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  PartyPopper
} from 'lucide-react';
import { CreateEditEventoModal } from '../components/eventos/CreateEditEventoModal';

export const EventosScreen: React.FC = () => {
  const { 
    eventos, 
    setCurrentScreen, 
    currentUser, 
    excluirEvento,
    isAdminLoggedIn
  } = useCondo();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterVisibilidade, setFilterVisibilidade] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmados, setConfirmados] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<EventoCondominio | null>(null);

  const visibilidadeOptions = ['Todos', 'Públicos', 'Privados'];
  const isAdmin = currentUser.role === 'sindico' || currentUser.role === 'subsindico' || Boolean(isAdminLoggedIn);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleTogglePresenca = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpenCreate = () => {
    setEventoToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evento: EventoCondominio, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventoToEdit(evento);
    setIsModalOpen(true);
  };

  const handleDeleteEvento = (id: string, titulo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o evento "${titulo}"?`)) {
      excluirEvento(id);
    }
  };

  const checkIsOwner = (evt: EventoCondominio) => {
    if (isAdmin) return true;
    const userUnidade = currentUser.unidade ? currentUser.unidade.replace(/[^0-9]/g, '') : '';
    const evtUnidade = evt.organizadorUnidade ? evt.organizadorUnidade.replace(/[^0-9]/g, '') : (evt.organizador.replace(/[^0-9]/g, ''));
    
    return (
      (evt.organizadorId && evt.organizadorId === currentUser.id) ||
      (userUnidade && evtUnidade && userUnidade === evtUnidade) ||
      (currentUser.nome && evt.organizador.toLowerCase().includes(currentUser.nome.toLowerCase()))
    );
  };

  const filteredEventos = eventos.filter(evt => {
    const isOwner = checkIsOwner(evt);
    const isAtivo = evt.ativo !== false;

    // Se o evento estiver fora do ar/suspenso, só exibe para o dono ou admin
    if (!isAtivo && !isOwner && !isAdmin) return false;

    const matchesFilter = filterVisibilidade === 'Todos' ||
      (filterVisibilidade === 'Públicos' && evt.visibilidade === 'Público') ||
      (filterVisibilidade === 'Privados' && evt.visibilidade === 'Privado');

    const matchesSearch = !searchTerm ||
      evt.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizador.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button + Anunciar Evento */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        {/* Botão Anunciar Evento */}
        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-300"
          title="Clique para anunciar um novo evento ou celebração no condomínio"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Anunciar Evento</span>
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Calendar className="w-5 h-5 text-amber-400" />
          Eventos & Celebrações
        </h2>
        <p className="text-[11px] text-white/90 font-medium">
          Mural de confraternizações públicas do condomínio e celebrações privadas agendadas.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Tipo:
          </span>
          {visibilidadeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterVisibilidade(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterVisibilidade === opt
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
            placeholder="Buscar por evento (ex: Aniversário, Dia das Mães, Festa Junina, Churrasco)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* Events List (Cards Curtos Expansíveis) */}
      <div className="space-y-3">
        {filteredEventos.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-white/70 rounded-3xl space-y-3">
            <PartyPopper className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="text-sm font-black text-slate-950">Nenhum evento encontrado no momento.</p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md cursor-pointer"
            >
              + Anunciar o Primeiro Evento
            </button>
          </div>
        ) : (
          filteredEventos.map((evento) => {
            const isExpanded = expandedId === evento.id;
            const isPublico = evento.visibilidade === 'Público';
            const isConfirmado = confirmados[evento.id];
            const isOwner = checkIsOwner(evento);
            const isSuspenso = evento.ativo === false;

            return (
              <div 
                key={evento.id}
                className={`bg-white/45 border-2 rounded-3xl overflow-hidden shadow-xl hover:bg-white/50 transition-all duration-300 backdrop-blur-xs ${
                  isSuspenso 
                    ? 'border-rose-400/80 bg-rose-50/40 opacity-90' 
                    : 'border-white/60'
                }`}
              >
                {/* Banner de Suspensão se estiver fora do ar */}
                {isSuspenso && (
                  <div className="px-4 py-2 bg-rose-500 text-white text-xs font-extrabold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Evento Fora do Ar / Suspenso: {evento.motivoSuspensao || 'Moderação da administração'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-black/30 rounded-md">
                      Moderação
                    </span>
                  </div>
                )}

                {/* Header section (Always visible) */}
                <button
                  onClick={() => toggleExpand(evento.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
                        {evento.titulo}
                      </h3>
                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border flex items-center gap-1 shadow-2xs ${
                        isPublico
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-purple-100 text-purple-950 border-purple-300'
                      }`}>
                        {isPublico ? <Globe className="w-2.5 h-2.5 text-emerald-700" /> : <Lock className="w-2.5 h-2.5 text-purple-700" />}
                        {evento.visibilidade}
                      </span>
                    </div>

                    <p className="text-[10px] text-amber-950 font-bold flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-700" />
                        {evento.data} • {evento.horario}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-800" />
                        {evento.local}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botões do Dono / Admin no Header do Card */}
                    {isOwner && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(evento, e)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-white/90 shadow-2xs hover:text-amber-700 transition-all cursor-pointer"
                          title="Editar este evento"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteEvento(evento.id, evento.titulo, e)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-rose-100 text-rose-600 border border-white/90 shadow-2xs hover:text-rose-800 transition-all cursor-pointer"
                          title="Excluir este evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Botão Chevron com rotação animada */}
                    <div className="p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                  </div>
                </button>

                {/* Expandable Section com Animação Suave Grid */}
                <div 
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-950/10 pt-3">
                      {/* Event Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/50 shadow-sm bg-slate-900">
                        <img 
                          src={evento.imagem} 
                          alt={evento.titulo} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                          <div className="text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>{evento.local}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2.5">
                        <div className="bg-white/50 border border-white/40 p-3 rounded-2xl text-xs space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-1 border-b border-slate-900/10 pb-1.5">
                            <span className="font-extrabold text-slate-950 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-indigo-700" />
                              Organizado por: <strong className="text-indigo-950">{evento.organizador}</strong>
                            </span>
                            
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isPublico 
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' 
                                : 'bg-purple-100 text-purple-950 border border-purple-300'
                            }`}>
                              {isPublico ? 'Aberto a Todos os Moradores' : 'Evento Particular Fechado'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-800 leading-relaxed font-medium">
                            {evento.descricao}
                          </p>
                        </div>

                        {/* Botão de Ação / Confirmação de Presença */}
                        {isPublico ? (
                          <button
                            type="button"
                            onClick={(e) => handleTogglePresenca(evento.id, e)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 w-full justify-center rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer ${
                              isConfirmado
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isConfirmado ? '✓ Presença Confirmada no Evento' : 'Confirmar Presença no Evento'}</span>
                          </button>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-400/40 text-center">
                            <span className="text-[11px] font-extrabold text-purple-950 flex items-center justify-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-purple-800" />
                              Espaço reservado pelo morador para celebração privativa
                            </span>
                          </div>
                        )}

                        {/* Ações adicionais do Dono */}
                        {isOwner && (
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-950/10">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(evento, e)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Editar Evento
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteEvento(evento.id, evento.titulo, e)}
                              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black flex items-center gap-1 border border-rose-300 shadow-xs cursor-pointer active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação / Edição de Evento */}
      <CreateEditEventoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventoToEdit(null);
        }}
        eventoToEdit={eventoToEdit}
      />

    </div>
  );
};
