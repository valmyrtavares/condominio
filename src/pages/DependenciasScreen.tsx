import React, { useState, useMemo } from 'react';
import { useCondo } from '../context/CondoContext';
import { Dependencia, TipoDependencia, ReservaDependencia, StatusReserva } from '../types';
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
  ChevronRight,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock3,
  ExternalLink,
  Ban
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
  const [observacoes, setObservacoes] = useState<string>('');
  const [comprovanteBase64, setComprovanteBase64] = useState<string>('');
  const [comprovanteNome, setComprovanteNome] = useState<string>('');
  const [concordouRegras, setConcordouRegras] = useState(false);
  const [sucessoFeedback, setSucessoFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroConflito, setErroConflito] = useState<string | null>(null);

  // Modal para visualizar comprovante
  const [viewComprovanteModal, setViewComprovanteModal] = useState<string | null>(null);

  // Filtro de Minhas Reservas
  const [filterMinhasReservas, setFilterMinhasReservas] = useState<'todas' | 'pendentes' | 'confirmadas' | 'recusadas'>('todas');

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

  const minhasReservasFiltradas = minhasReservas.filter(r => {
    if (filterMinhasReservas === 'pendentes') {
      return r.status === 'Pendente de Aprovação' || r.status === 'Pendente de Pagamento';
    }
    if (filterMinhasReservas === 'confirmadas') {
      return r.status === 'Confirmada' || r.status === 'Concluída';
    }
    if (filterMinhasReservas === 'recusadas') {
      return r.status === 'Recusada' || r.status === 'Cancelada';
    }
    return true;
  });

  // Reservas ativas do espaço aberto no modal
  const reservasAtivasDoEspaco = useMemo(() => {
    if (!selectedDependenciaReserva) return [];
    return reservas.filter(r => 
      r.dependenciaId === selectedDependenciaReserva.id && 
      r.status !== 'Recusada' && 
      r.status !== 'Cancelada'
    );
  }, [reservas, selectedDependenciaReserva]);

  // Função para checar disponibilidade da data selecionada
  const disponibilidadeAtual = useMemo(() => {
    if (!selectedDependenciaReserva || !dataReserva) {
      return {
        dataFormatada: '',
        totalmenteOcupado: false,
        diaInteiroOcupado: false,
        manhaOcupada: false,
        tardeOcupada: false,
        detalhes: [] as string[]
      };
    }

    const [ano, mes, dia] = dataReserva.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const reservasNoDia = reservasAtivasDoEspaco.filter(r => r.dataReserva === dataFormatada);

    const diaInteiroOcupado = reservasNoDia.some(r => r.periodo === 'Dia Inteiro');
    const manhaOcupada = diaInteiroOcupado || reservasNoDia.some(r => r.periodo === 'Manhã (09h-14h)');
    const tardeOcupada = diaInteiroOcupado || reservasNoDia.some(r => r.periodo === 'Tarde/Noite (16h-23h)');
    const totalmenteOcupado = diaInteiroOcupado || (manhaOcupada && tardeOcupada);

    return {
      dataFormatada,
      totalmenteOcupado,
      diaInteiroOcupado,
      manhaOcupada,
      tardeOcupada,
      detalhes: reservasNoDia.map(r => `${r.periodo} (${r.unidade})`)
    };
  }, [selectedDependenciaReserva, dataReserva, reservasAtivasDoEspaco]);

  const handleAbrirReserva = (dep: Dependencia, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDependenciaReserva(dep);
    setDataReserva('');
    setPeriodoReserva('Tarde/Noite (16h-23h)');
    setObservacoes('');
    setComprovanteBase64('');
    setComprovanteNome('');
    setConcordouRegras(false);
    setSucessoFeedback(false);
    setErroConflito(null);
  };

  const handleDataChange = (novaData: string) => {
    setDataReserva(novaData);
    setErroConflito(null);

    if (!selectedDependenciaReserva || !novaData) return;

    const [ano, mes, dia] = novaData.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const reservasNoDia = reservasAtivasDoEspaco.filter(r => r.dataReserva === dataFormatada);

    const diaInteiro = reservasNoDia.some(r => r.periodo === 'Dia Inteiro');
    const manha = diaInteiro || reservasNoDia.some(r => r.periodo === 'Manhã (09h-14h)');
    const tarde = diaInteiro || reservasNoDia.some(r => r.periodo === 'Tarde/Noite (16h-23h)');

    if (diaInteiro || (manha && tarde)) {
      setErroConflito(`Esta data já está 100% ocupada (${reservasNoDia.map(r => `${r.periodo} - ${r.unidade}`).join(', ')}). Por favor, escolha outra data.`);
    } else if (periodoReserva === 'Dia Inteiro' && (manha || tarde)) {
      if (!manha) setPeriodoReserva('Manhã (09h-14h)');
      else if (!tarde) setPeriodoReserva('Tarde/Noite (16h-23h)');
    } else if (periodoReserva === 'Manhã (09h-14h)' && manha) {
      if (!tarde) setPeriodoReserva('Tarde/Noite (16h-23h)');
    } else if (periodoReserva === 'Tarde/Noite (16h-23h)' && tarde) {
      if (!manha) setPeriodoReserva('Manhã (09h-14h)');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComprovanteNome(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setComprovanteBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDependenciaReserva || !dataReserva || !concordouRegras) return;

    if (disponibilidadeAtual.totalmenteOcupado) {
      setErroConflito(`Data indisponível: este espaço já possui reserva ativa no dia ${disponibilidadeAtual.dataFormatada}.`);
      return;
    }

    if (
      (periodoReserva === 'Manhã (09h-14h)' && disponibilidadeAtual.manhaOcupada) ||
      (periodoReserva === 'Tarde/Noite (16h-23h)' && disponibilidadeAtual.tardeOcupada) ||
      (periodoReserva === 'Dia Inteiro' && (disponibilidadeAtual.manhaOcupada || disponibilidadeAtual.tardeOcupada))
    ) {
      setErroConflito(`O turno "${periodoReserva}" não está disponível no dia ${disponibilidadeAtual.dataFormatada}. Escolha um turno livre.`);
      return;
    }

    setIsSubmitting(true);
    setErroConflito(null);
    try {
      const res = await solicitarReserva(
        selectedDependenciaReserva.id, 
        disponibilidadeAtual.dataFormatada, 
        periodoReserva,
        observacoes,
        comprovanteBase64 || undefined
      );

      if (!res.success) {
        setErroConflito(res.error || 'Não foi possível realizar o agendamento.');
        return;
      }

      setSucessoFeedback(true);
      setTimeout(() => {
        setSelectedDependenciaReserva(null);
        setSucessoFeedback(false);
      }, 2500);
    } catch (err: any) {
      setErroConflito(err?.message || 'Erro ao processar reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: StatusReserva) => {
    switch (status) {
      case 'Confirmada':
      case 'Concluída':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Confirmada pelo Admin
          </span>
        );
      case 'Pendente de Aprovação':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 animate-pulse">
            <Clock3 className="w-3 h-3 text-amber-600" />
            Aguardando Aprovação
          </span>
        );
      case 'Pendente de Pagamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-950 border border-purple-300">
            <DollarSign className="w-3 h-3 text-purple-600" />
            Pendente de Pagamento
          </span>
        );
      case 'Recusada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-950 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" />
            Reserva Recusada
          </span>
        );
      case 'Cancelada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
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
          Conheça as instalações do condomínio, horários de funcionamento, regras de convivência e agendamento de espaços com aprovação direta da administração.
        </p>
      </div>

      {/* 1. Minhas Reservas Ativas (se houver) */}
      {minhasReservas.length > 0 && (
        <div className="bg-white/95 border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 backdrop-blur-xs">
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-700 block">
                  Painel de Acompanhamento
                </span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Minhas Solicitações de Reserva ({currentUser.unidade})
                </h3>
              </div>
            </div>

            {/* Filtros rápidos do morador */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['todas', 'pendentes', 'confirmadas', 'recusadas'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterMinhasReservas(tab)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer capitalize ${
                    filterMinhasReservas === tab
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
            {minhasReservasFiltradas.map((res) => {
              const dep = dependencias.find(d => d.id === res.dependenciaId);
              return (
                <div 
                  key={res.id}
                  className="bg-white border-2 border-slate-200 hover:border-slate-300 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Topo do Card de Reserva */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {dep?.foto ? (
                          <img 
                            src={dep.foto} 
                            alt={dep.nome} 
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <strong className="text-xs font-black text-slate-950 block truncate">
                            {dep?.nome || res.dependenciaNome || 'Espaço do Condomínio'}
                          </strong>
                          <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="flex items-center gap-1 text-indigo-700 font-black">
                              <Calendar className="w-3.5 h-3.5" />
                              {res.dataReserva}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600 font-semibold">{res.periodo}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getStatusBadge(res.status)}
                      </div>
                    </div>

                    {/* Taxa e Comprovante */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] pt-1">
                      {res.valorTaxa ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 font-bold">Taxa:</span>
                          <span className="font-extrabold text-amber-950 font-mono">
                            R$ {res.valorTaxa.toFixed(2)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            res.pago ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            {res.pago ? '✓ Paga' : '⏳ Aguardando Pagamento'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-emerald-800 font-bold text-[10px]">
                          ✓ Reserva Isenta de Taxa
                        </span>
                      )}

                      {res.comprovanteUrl && (
                        <button
                          type="button"
                          onClick={() => setViewComprovanteModal(res.comprovanteUrl || null)}
                          className="text-[10px] font-black text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ImageIcon className="w-3 h-3" />
                          Ver Comprovante Anexado
                        </button>
                      )}
                    </div>

                    {/* Observações do Morador */}
                    {res.observacoes && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-medium">
                        <span className="text-[10px] font-black text-slate-500 uppercase block">
                          Sua Observação / Finalidade:
                        </span>
                        {res.observacoes}
                      </div>
                    )}

                    {/* Resposta / Instruções da Administração */}
                    {res.respostaAdmin && (
                      <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1 animate-in fade-in">
                        <div className="flex items-center gap-1.5 text-indigo-950 font-black text-[11px]">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                          Orientação da Administração:
                        </div>
                        <p className="text-[11px] text-indigo-900 font-medium whitespace-pre-wrap leading-relaxed">
                          {res.respostaAdmin}
                        </p>
                      </div>
                    )}

                    {/* Motivo de Recusa */}
                    {res.motivoRecusa && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 animate-in fade-in">
                        <div className="flex items-center gap-1.5 text-rose-950 font-black text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Motivo da Recusa:
                        </div>
                        <p className="text-[11px] text-rose-900 font-medium whitespace-pre-wrap">
                          {res.motivoRecusa}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rodapé com botão de Cancelamento */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-600 font-medium">
                      Solicitado em: {res.solicitadoEm || 'Hoje'}
                    </span>

                    {res.status !== 'Cancelada' && res.status !== 'Concluída' && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja realmente cancelar esta solicitação de reserva?')) {
                            cancelarReserva(res.id);
                          }
                        }}
                        className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>

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
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar espaço, comodidade ou regras..."
              className="w-full bg-white/95 border border-white/80 rounded-2xl pl-9 pr-8 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterRegime}
              onChange={(e) => setFilterRegime(e.target.value)}
              className="w-full bg-white/95 border border-white/80 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="Todas">Todos os Regimes de Uso</option>
              <option value="reservavel">Exige Reserva Prévia</option>
              <option value="livre">Uso Livre / Sem Reserva</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-1.5">
            <button
              onClick={expandAll}
              className="flex-1 px-3 py-2 rounded-2xl bg-white/40 hover:bg-white/60 border border-white/60 text-slate-950 text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" /> Expandir
            </button>
            <button
              onClick={collapseAll}
              className="flex-1 px-3 py-2 rounded-2xl bg-white/40 hover:bg-white/60 border border-white/60 text-slate-950 text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" /> Recolher
            </button>
          </div>

        </div>

      </div>

      {/* 3. Lista de Áreas Comuns e Dependências */}
      <div className="space-y-4">
        {filteredDependencias.length === 0 ? (
          <div className="bg-white/40 border border-white/60 rounded-3xl p-8 text-center text-slate-900 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-amber-500/80" />
            <h4 className="font-extrabold text-sm">Nenhum espaço encontrado</h4>
            <p className="text-xs text-slate-800 font-medium max-w-sm mx-auto">
              Nenhuma dependência corresponde aos filtros aplicados. Tente alterar os termos de busca ou categoria.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredDependencias.map((dep) => {
              const isExpanded = !!expandedCards[dep.id];
              return (
                <div
                  key={dep.id}
                  className="bg-white/95 border-2 border-white/90 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  
                  {/* Card Header / Summary - Toque para expandir */}
                  <div 
                    onClick={() => toggleCard(dep.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {dep.foto ? (
                        <img
                          src={dep.foto}
                          alt={dep.nome}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-800 font-bold shrink-0">
                          <Building2 className="w-7 h-7" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
                            {dep.tipo}
                          </span>
                          {dep.requerReserva ? (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-700" />
                              Requer Reserva
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              Uso Livre
                            </span>
                          )}
                          {dep.taxaReserva && dep.taxaReserva > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-950 border border-indigo-200">
                              Taxa: R$ {dep.taxaReserva.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-sm sm:text-base text-slate-950 truncate">
                          {dep.nome}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-600 font-bold flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            {dep.horarioFuncionamento}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            Capacidade: {dep.capacidadePessoas} pessoas
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {dep.requerReserva && (
                        <button
                          onClick={(e) => handleAbrirReserva(dep, e)}
                          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Reservar
                        </button>
                      )}

                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 ${
                      isExpanded ? 'max-h-[2000px] opacity-100 p-4 sm:p-5 bg-slate-50/50' : 'max-h-0 opacity-0 p-0'
                    }`}
                  >
                    <div className="space-y-4 text-xs">
                      
                      {/* Descrição */}
                      <div>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                          Sobre este espaço
                        </h4>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {dep.descricao}
                        </p>
                      </div>

                      {/* Fotos Adicionais (se houver) */}
                      {dep.fotosAdicionais && dep.fotosAdicionais.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                            Fotos do Espaço
                          </h4>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {dep.fotosAdicionais.map((imgUrl, idx) => (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`${dep.nome} foto ${idx + 1}`}
                                onClick={() => setViewComprovanteModal(imgUrl)}
                                className="w-24 h-20 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0 cursor-pointer hover:opacity-90"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comodidades */}
                      {dep.comodidades && dep.comodidades.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                            Comodidades & Itens Disponíveis
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {dep.comodidades.map((com, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-extrabold text-[11px] flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                {com}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regras de Uso */}
                      {dep.regrasUso && dep.regrasUso.length > 0 && (
                        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            Regras de Uso & Convivência
                          </h4>
                          <ul className="space-y-1.5 text-[11px] text-amber-950 font-medium">
                            {dep.regrasUso.map((regra, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                                <span>{regra}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ações / Botão de Solicitar Reserva */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium">
                          {dep.requerReserva ? (
                            <span className="text-amber-900 font-bold flex items-center gap-1.5">
                              <Info className="w-4 h-4 text-amber-600" />
                              Solicitação sujeita à confirmação e liberação do administrador.
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

      {/* 4. Modal de Agendamento / Solicitação de Reserva com Validação Anti-Conflito */}
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
                    Unidade solicitante: {currentUser.unidade} {currentUser.bloco ? `- ${currentUser.bloco}` : ''}
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
                  <h4 className="font-black text-base text-emerald-950">Solicitação Enviada com Sucesso!</h4>
                  <p className="text-xs text-emerald-900 font-medium">
                    Sua reserva foi enviada diretamente para o painel do administrador. Você receberá a confirmação e as instruções por aqui.
                  </p>
                </div>
              ) : (
                <>
                  {/* Painel de Datas Já Ocupadas deste Espaço */}
                  {reservasAtivasDoEspaco.length > 0 && (
                    <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5 text-rose-500" /> Datas com Reservas Cadastradas:
                        </span>
                        <span className="text-[9px] font-bold text-slate-500">
                          {reservasAtivasDoEspaco.length} agendamento(s)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {reservasAtivasDoEspaco.map(r => (
                          <span 
                            key={r.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                              r.periodo === 'Dia Inteiro' 
                                ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                                : 'bg-amber-100 text-amber-950 border border-amber-300'
                            }`}
                          >
                            <span>📅 {r.dataReserva}</span>
                            <span className="opacity-75">({r.periodo.split(' ')[0]})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input de Data */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span>Escolha a Data do Evento:</span>
                      {dataReserva && (
                        <span className="text-slate-500 font-mono font-normal">
                          {disponibilidadeAtual.dataFormatada}
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      value={dataReserva}
                      onChange={(e) => handleDataChange(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none transition-all ${
                        disponibilidadeAtual.totalmenteOcupado 
                          ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300' 
                          : dataReserva 
                            ? 'bg-emerald-50/50 border-emerald-400 text-slate-900' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                      }`}
                      required
                    />

                    {/* Feedback visual imediato da data escolhida */}
                    {dataReserva && (
                      <div className="pt-0.5">
                        {disponibilidadeAtual.totalmenteOcupado ? (
                          <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-[11px] font-bold flex items-center gap-1.5 animate-in shake">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              ⛔ Data Ocupada: Já existe reserva neste dia ({disponibilidadeAtual.detalhes.join(', ')}). Selecione outra data.
                            </span>
                          </div>
                        ) : disponibilidadeAtual.manhaOcupada || disponibilidadeAtual.tardeOcupada ? (
                          <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-[11px] font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              ⚠️ Ocupação parcial: {disponibilidadeAtual.manhaOcupada ? 'Manhã ocupada' : 'Tarde/Noite ocupada'}. Turno oposto disponível!
                            </span>
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-[11px] font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>✓ Data 100% disponível para agendamento!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Seleção de Turno / Período com Bloqueio Dinâmico */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Turno / Período:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'Manhã (09h-14h)' as const, label: 'Manhã (09h-14h)', bloqueado: disponibilidadeAtual.manhaOcupada },
                        { id: 'Tarde/Noite (16h-23h)' as const, label: 'Tarde/Noite (16h-23h)', bloqueado: disponibilidadeAtual.tardeOcupada },
                        { id: 'Dia Inteiro' as const, label: 'Dia Inteiro', bloqueado: disponibilidadeAtual.manhaOcupada || disponibilidadeAtual.tardeOcupada || disponibilidadeAtual.diaInteiroOcupado }
                      ].map((per) => {
                        const isSelected = periodoReserva === per.id;
                        const isBlocked = per.bloqueado;

                        return (
                          <button
                            key={per.id}
                            type="button"
                            disabled={isBlocked}
                            onClick={() => {
                              if (!isBlocked) {
                                setPeriodoReserva(per.id);
                                setErroConflito(null);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all relative ${
                              isBlocked
                                ? 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-xs cursor-pointer'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer'
                            }`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold">{per.label}</span>
                              <div className="flex items-center justify-between mt-0.5">
                                {isBlocked ? (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-rose-200 text-rose-950 rounded font-black">
                                    ⛔ Ocupado
                                  </span>
                                ) : (
                                  <span className={`text-[9px] font-black ${isSelected ? 'text-slate-950' : 'text-emerald-700'}`}>
                                    ✓ Livre
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Banner de Erro / Conflito */}
                  {erroConflito && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-950 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      <span>{erroConflito}</span>
                    </div>
                  )}

                  {/* Finalidade / Observações */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Finalidade da Reserva & Estimativa de Convidados (Opcional):
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows={2}
                      placeholder="Ex: Aniversário de família, estimativa de 15 pessoas."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white resize-none"
                    />
                  </div>

                  {/* Informação sobre Taxa & Anexo de Comprovante */}
                  {selectedDependenciaReserva.taxaReserva && selectedDependenciaReserva.taxaReserva > 0 ? (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-950">Taxa de Limpeza / Uso:</span>
                        <strong className="text-sm font-black text-amber-900 font-mono">
                          R$ {selectedDependenciaReserva.taxaReserva.toFixed(2)}
                        </strong>
                      </div>
                      
                      <div className="space-y-1 pt-1 border-t border-amber-200/60">
                        <label className="text-[10px] font-extrabold uppercase text-amber-900 block">
                          Anexar Comprovante de Pagamento (Opcional ou a Combinar):
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-100/50 cursor-pointer shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-amber-700" />
                            <span>{comprovanteNome ? 'Trocar Comprovante' : 'Selecionar Arquivo / Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {comprovanteNome && (
                            <span className="text-[11px] text-amber-900 font-bold truncate max-w-[180px]">
                              ✓ {comprovanteNome}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

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
                      disabled={!concordouRegras || !dataReserva || disponibilidadeAtual.totalmenteOcupado || isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Enviando...</span>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Solicitar Reserva</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

      {/* 5. Lightbox Modal para Comprovante */}
      {viewComprovanteModal && (
        <div 
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setViewComprovanteModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-4 max-w-lg w-full max-h-[90vh] flex flex-col items-center gap-3 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" /> Visualização de Imagem / Comprovante
              </span>
              <button
                onClick={() => setViewComprovanteModal(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="w-full overflow-auto max-h-[70vh] flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              <img 
                src={viewComprovanteModal} 
                alt="Comprovante" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-md"
              />
            </div>

            <button
              onClick={() => setViewComprovanteModal(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
