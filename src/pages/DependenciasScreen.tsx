import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Dependencia, TipoDependencia, ReservaDependencia } from '../types';
import { 
  Building2, 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Check, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DependenciasScreen: React.FC = () => {
  const { 
    dependencias, 
    reservas, 
    currentUser, 
    solicitarReserva, 
    cancelarReserva, 
    setCurrentScreen 
  } = useCondo();

  const [filterTipo, setFilterTipo] = useState<string>('Todas');
  const [filterRegime, setFilterRegime] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Controle de cards expandidos individualmente
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Modal Reserva State
  const [selectedDependenciaReserva, setSelectedDependenciaReserva] = useState<Dependencia | null>(null);
  const [dataReserva, setDataReserva] = useState<string>('');
  const [periodoReserva, setPeriodoReserva] = useState<ReservaDependencia['periodo']>('Tarde/Noite (16h-23h)');
  const [concordouRegras, setConcordouRegras] = useState(false);
  const [sucessoFeedback, setSucessoFeedback] = useState(false);

  const tiposOptions: string[] = [
    'Todas',
    'Lazer & Convivência',
    'Esporte & Saúde',
    'Infantil',
    'Infraestrutura & Acesso'
  ];

  // Alterna expansão de um card
  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExp: Record<string, boolean> = {};
    filteredDependencias.forEach(d => {
      allExp[d.id] = true;
    });
    setExpandedCards(allExp);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  // Filter Logic
  const filteredDependencias = dependencias.filter(d => {
    const matchesTipo = filterTipo === 'Todas' || d.tipo === filterTipo;
    const matchesRegime = filterRegime === 'Todas' || 
      (filterRegime === 'reservavel' && d.requerReserva) ||
      (filterRegime === 'livre' && !d.requerReserva);

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      d.nome.toLowerCase().includes(term) ||
      d.descricao.toLowerCase().includes(term) ||
      d.tipo.toLowerCase().includes(term) ||
      d.comodidades.some(c => c.toLowerCase().includes(term));

    return matchesTipo && matchesRegime && matchesSearch;
  });

  const minhasReservas = reservas.filter(r => r.moradorId === currentUser.id);

  const handleAbrirReserva = (dep: Dependencia, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDependenciaReserva(dep);
    setDataReserva('');
    setPeriodoReserva('Tarde/Noite (16h-23h)');
    setConcordouRegras(false);
    setSucessoFeedback(false);
  };

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDependenciaReserva || !dataReserva || !concordouRegras) return;

    // Converte YYYY-MM-DD para DD/MM/YYYY
    const [ano, mes, dia] = dataReserva.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    solicitarReserva(selectedDependenciaReserva.id, dataFormatada, periodoReserva);
    setSucessoFeedback(true);
    setTimeout(() => {
      setSelectedDependenciaReserva(null);
      setSucessoFeedback(false);
    }, 2000);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Building2 className="w-5 h-5 text-amber-400" />
          Dependências & Áreas Comuns
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Conheça as instalações do condomínio, horários de funcionamento, regras de convivência e agendamento de espaços. Toque nos cards para expandir.
        </p>
      </div>

      {/* 1. Minhas Reservas Ativas (se houver) */}
      {minhasReservas.length > 0 && (
        <div className="bg-white/50 border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 backdrop-blur-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-800 block">
                  Suas Reservas Confirmadas
                </span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Agendamentos para a Unidade {currentUser.unidade}
                </h3>
              </div>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              {minhasReservas.length} reserva(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {minhasReservas.map((res) => {
              const dep = dependencias.find(d => d.id === res.dependenciaId);
              return (
                <div 
                  key={res.id}
                  className="bg-white/85 border border-white/90 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <strong className="text-xs font-black text-slate-950 block truncate">
                      {dep?.nome || 'Espaço do Condomínio'}
                    </strong>
                    <div className="text-[11px] text-slate-800 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{res.dataReserva}</span>
                      <span>•</span>
                      <span>{res.periodo}</span>
                    </div>
                    {res.valorTaxa && (
                      <span className="text-[10px] text-emerald-900 font-bold block">
                        Taxa de limpeza: R$ {res.valorTaxa.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => cancelarReserva(res.id)}
                    className="text-[10px] text-rose-700 hover:text-rose-900 font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Filtros, Busca e Controles de Expansão */}
      <div className="space-y-2.5">
        
        {/* Categorias Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Espaços:
          </span>
          {tiposOptions.map((tp) => (
            <button
              key={tp}
              onClick={() => setFilterTipo(tp)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-xs shrink-0 cursor-pointer ${
                filterTipo === tp
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-sm'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* Barra de Busca + Filtro de Regime + Controles Expandir/Recolher */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Buscar por espaço (Piscina, Academia, Churrasqueira, Wi-Fi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/75 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'Todas', label: 'Todos' },
              { id: 'reservavel', label: '📅 Reserváveis' },
              { id: 'livre', label: '✨ Uso Livre' }
            ].map(reg => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setFilterRegime(reg.id)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-extrabold border transition-all text-center whitespace-nowrap cursor-pointer ${
                  filterRegime === reg.id
                    ? 'bg-slate-950 text-amber-300 border-slate-900 shadow-xs'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={expandAll}
              className="flex-1 py-2 px-2 rounded-xl bg-white/40 hover:bg-white/60 text-slate-900 text-[11px] font-extrabold border border-white/60 transition-colors text-center cursor-pointer"
            >
              Abrir Todos
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="flex-1 py-2 px-2 rounded-xl bg-white/40 hover:bg-white/60 text-slate-900 text-[11px] font-extrabold border border-white/60 transition-colors text-center cursor-pointer"
            >
              Fechar Todos
            </button>
          </div>

        </div>
      </div>

      {/* 3. Lista de Dependências em Cards Expansíveis com Animação Fluida */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Espaços do Condomínio ({filteredDependencias.length})
          </span>
        </div>

        {filteredDependencias.length === 0 ? (
          <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-2 backdrop-blur-xs">
            <p className="text-sm font-extrabold text-slate-900">
              Nenhuma dependência encontrada para os filtros selecionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterTipo('Todas');
                setFilterRegime('Todas');
                setSearchTerm('');
              }}
              className="text-xs text-amber-900 font-black underline cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredDependencias.map((dep) => {
              const isExpanded = !!expandedCards[dep.id];

              return (
                <div
                  key={dep.id}
                  className="bg-white/50 border border-white/70 rounded-3xl overflow-hidden shadow-xl hover:bg-white/60 transition-all duration-300 backdrop-blur-xs"
                >
                  {/* Card Header Expansível (Click para abrir/fechar) */}
                  <div
                    onClick={() => toggleCard(dep.id)}
                    className="p-4 sm:p-5 cursor-pointer select-none transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      
                      {/* Miniatura / Capa */}
                      <div className="relative w-full md:w-56 h-36 md:h-32 rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
                        <img
                          src={dep.foto}
                          alt={dep.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/Salão de festas.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                          <span className="self-start text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-400/40 backdrop-blur-xs">
                            {dep.tipo}
                          </span>

                          <span className={`self-start text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md ${
                            dep.requerReserva
                              ? 'bg-purple-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {dep.requerReserva ? '📅 Requer Reserva' : '✨ Uso Livre'}
                          </span>
                        </div>
                      </div>

                      {/* Informações Principais */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                              {dep.nome}
                            </h3>
                            <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-0.5">
                              {dep.descricao}
                            </p>
                          </div>
                        </div>

                        {/* Metas Rápidas */}
                        <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/70 border border-white/90 text-slate-900 font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                            <span>{dep.horarioFuncionamento}</span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/70 border border-white/90 text-slate-900 font-bold text-[11px]">
                            <Users className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            <span>Capacidade: {dep.capacidadePessoas} pessoas</span>
                          </div>

                          {dep.taxaReserva !== undefined && dep.taxaReserva > 0 && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-950 border border-purple-300 font-black text-[11px]">
                              <span>Taxa: R$ {dep.taxaReserva.toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {/* Chips de Comodidades Resumidas */}
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {dep.comodidades.slice(0, 3).map((com, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/60 text-slate-800 border border-white/80"
                            >
                              ✓ {com}
                            </span>
                          ))}
                          {dep.comodidades.length > 3 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-900">
                              +{dep.comodidades.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botões de Ação do Header & Chevron */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-950/10">
                        {dep.requerReserva && (
                          <button
                            type="button"
                            onClick={(e) => handleAbrirReserva(dep, e)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Agendar Reserva</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1 text-slate-800 text-xs font-black ml-auto md:ml-0">
                          <span className="text-[11px] hidden sm:inline text-slate-600">
                            {isExpanded ? 'Recolher' : 'Ver Detalhes & Regras'}
                          </span>
                          <div className="p-2 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                            <ChevronDown
                              className={`w-4 h-4 text-slate-900 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : 'rotate-0'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Seção Expansível com Transição Suave */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden border-t ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100 border-slate-950/10'
                        : 'grid-rows-[0fr] opacity-0 border-transparent'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden bg-white/30 p-4 sm:p-6 space-y-5">
                      
                      {/* Descrição Completa */}
                      <div className="bg-white/60 p-4 rounded-2xl border border-white/80 space-y-1.5 shadow-2xs">
                        <span className="text-[10px] font-black uppercase text-slate-800 block">
                          Sobre este Espaço:
                        </span>
                        <p className="text-xs text-slate-900 font-medium leading-relaxed">
                          {dep.descricao}
                        </p>
                      </div>

                      {/* Grid de Comodidades Inclusas */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-700" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">
                            Estrutura, Conforto & Comodidades Inclusas ({dep.comodidades.length})
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {dep.comodidades.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white/70 border border-white/90 flex items-center gap-2 shadow-2xs text-xs font-bold text-slate-950"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Regras de Uso & Convivência */}
                      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-800" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                            Regras de Uso & Convivência Obrigatórias ({dep.regrasUso.length})
                          </h4>
                        </div>

                        <div className="space-y-1.5">
                          {dep.regrasUso.map((regra, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex items-start gap-2 text-xs text-amber-950 font-semibold"
                            >
                              <span className="w-4 h-4 rounded-full bg-amber-400/40 text-amber-950 font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                {rIdx + 1}
                              </span>
                              <span className="leading-relaxed">{regra}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer do Card Expandido com Botão de Reserva */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-slate-700 font-medium">
                          {dep.requerReserva ? (
                            <span>
                              * A confirmação da reserva é imediata com registro em portaria e envio aos zeladores.
                            </span>
                          ) : (
                            <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              Espaço aberto a todos os moradores durante o horário de funcionamento.
                            </span>
                          )}
                        </div>

                        {dep.requerReserva && (
                          <button
                            type="button"
                            onClick={(e) => handleAbrirReserva(dep, e)}
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Solicitar Reserva deste Espaço</span>
                            {dep.taxaReserva && (
                              <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md font-mono">
                                R$ {dep.taxaReserva.toFixed(2)}
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal de Agendamento / Reserva */}
      {selectedDependenciaReserva && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pt-20 pb-24 sm:py-6 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto max-h-[calc(100vh-170px)] sm:max-h-[85vh] flex flex-col">
            
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-950">
                    Reserva: {selectedDependenciaReserva.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Unidade solicitante: {currentUser.unidade} - {currentUser.bloco}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDependenciaReserva(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <form onSubmit={handleConfirmarReserva} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {sucessoFeedback ? (
                <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-300 animate-in zoom-in-95">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-emerald-950">Reserva Confirmada com Sucesso!</h4>
                  <p className="text-xs text-emerald-900 font-medium">
                    A reserva foi cadastrada para o seu apartamento e comunicada à portaria e zeladoria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Escolha a Data do Evento:
                    </label>
                    <input
                      type="date"
                      value={dataReserva}
                      onChange={(e) => setDataReserva(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Turno / Período:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(['Manhã (09h-14h)', 'Tarde/Noite (16h-23h)', 'Dia Inteiro'] as ReservaDependencia['periodo'][]).map((per) => (
                        <button
                          key={per}
                          type="button"
                          onClick={() => setPeriodoReserva(per)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            periodoReserva === per
                              ? 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold'
                          }`}
                        >
                          {per}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDependenciaReserva.taxaReserva && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-950">Taxa de Limpeza Pós-Evento:</span>
                      <strong className="text-sm font-black text-amber-900 font-mono">
                        R$ {selectedDependenciaReserva.taxaReserva.toFixed(2)}
                      </strong>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                      Normas Obrigatórias da Reserva:
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                      <li>Horário de silêncio rigoroso a partir das 22:00.</li>
                      <li>Envio da lista de convidados na portaria com antecedência.</li>
                      <li>Vistoria de entrega do espaço no dia seguinte pela zeladoria.</li>
                    </ul>
                  </div>

                  <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={concordouRegras}
                      onChange={(e) => setConcordouRegras(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                      required
                    />
                    <span className="text-[11px] text-slate-800 font-bold">
                      Li e concordo com o regulamento interno e regras de uso do espaço.
                    </span>
                  </label>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDependenciaReserva(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!concordouRegras || !dataReserva}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
