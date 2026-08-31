import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { MudancaAgendamento, StatusMudanca } from '../types';
import { 
  Truck, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Building, 
  Phone, 
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';
import { CreateAgendamentoMudancaModal } from '../components/mudancas/CreateAgendamentoMudancaModal';

export const MudancasScreen: React.FC = () => {
  const { 
    mudancas, 
    regrasMudanca, 
    currentUser, 
    atualizarStatusMudanca, 
    excluirMudanca, 
    setCurrentScreen 
  } = useCondo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mudancaToEdit, setMudancaToEdit] = useState<MudancaAgendamento | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExp: Record<string, boolean> = {};
    filteredMudancas.forEach(m => {
      allExp[m.id] = true;
    });
    setExpandedCards(allExp);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  // Minhas mudanças (do morador logado)
  const minhasMudancas = mudancas.filter(m => m.moradorId === currentUser.id || m.unidade === currentUser.unidade);

  // Mudanças filtradas
  const filteredMudancas = mudancas.filter(m => {
    const matchTipo = filterTipo === 'Todas' || m.tipo.includes(filterTipo);
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      m.moradorNome.toLowerCase().includes(termo) ||
      m.unidade.includes(termo) ||
      (m.transportadora && m.transportadora.toLowerCase().includes(termo)) ||
      (m.placaVeiculo && m.placaVeiculo.toLowerCase().includes(termo));

    return matchTipo && matchBusca;
  });

  const getStatusBadge = (status: StatusMudanca) => {
    switch (status) {
      case 'Confirmada':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Confirmada pela Portaria'
        };
      case 'Pendente de Aprovação':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Clock className="w-3.5 h-3.5 text-amber-700" />,
          label: 'Pendente de Aprovação'
        };
      case 'Recusada':
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-700" />,
          label: 'Não Autorizada'
        };
      case 'Concluída':
      default:
        return {
          bg: 'bg-slate-100 text-slate-900 border-slate-300',
          icon: <Check className="w-3.5 h-3.5 text-slate-700" />,
          label: 'Realizada'
        };
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <Truck className="w-5 h-5 text-amber-400" />
            Mudanças & Carretos do Condomínio
          </h2>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            Agende transportes de mudança ou carretos, consulte horários permitidos e reserve o elevador de serviço.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMudancaToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Agendar Mudança / Carreto</span>
        </button>
      </div>

      {/* 1. Card de Regras e Horários de Mudança */}
      <div className="bg-white/50 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-1 border-b border-amber-950/10">
          <div className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950">
              Horários Permitidos para Mudanças & Carretos
            </h3>
            <p className="text-[11px] text-slate-700 font-medium">
              Normas estabelecidas pela convenção do condomínio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-white/70 border border-white/90 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase text-slate-600 block">Segunda a Sexta-Feira:</span>
            <strong className="text-slate-950 block text-xs font-black">{regrasMudanca.horarioSegundaSexta}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-white/90 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase text-slate-600 block">Sábados:</span>
            <strong className="text-slate-950 block text-xs font-black">{regrasMudanca.horarioSabado}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase text-rose-800 block">Domingos e Feriados:</span>
            <strong className="text-rose-950 block text-xs font-black">
              {regrasMudanca.domingosFeriadosPermitido ? 'Permitido mediante autorização' : '🚫 Terminantemente Proibido'}
            </strong>
          </div>
        </div>

        {/* Regras Gerais Accordion/Bullet points */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5 text-xs">
          <span className="text-[10px] font-extrabold uppercase text-amber-950 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" /> Diretrizes Obrigatórias:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-amber-950 font-medium">
            {regrasMudanca.regrasGerais.slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-amber-800 font-bold">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Minhas Mudanças Agendadas */}
      {minhasMudancas.length > 0 && (
        <div className="bg-white/50 border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-800 block">
                  Seus Agendamentos
                </span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Mudanças para a Unidade {currentUser.unidade}
                </h3>
              </div>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              {minhasMudancas.length} solicitação(ões)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {minhasMudancas.map((mud) => {
              const badge = getStatusBadge(mud.status);
              return (
                <div
                  key={mud.id}
                  className="bg-white/85 border border-white/90 p-4 rounded-2xl space-y-2.5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                        {mud.tipo}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-950">
                      📅 Data: {mud.dataMudanca} ({mud.periodo})
                    </h4>

                    {mud.transportadora && (
                      <p className="text-xs text-slate-700 font-semibold">
                        Empresa: {mud.transportadora} {mud.placaVeiculo && `(Placa: ${mud.placaVeiculo})`}
                      </p>
                    )}

                    {mud.motivoRecusa && (
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 font-bold">
                        Motivo: {mud.motivoRecusa}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Elevador de serviço: {mud.precisaAcolchoamentoElevador ? 'Com acolchoado' : 'Padrão'}
                    </span>

                    {mud.status === 'Pendente de Aprovação' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Deseja realmente cancelar esta solicitação de mudança?')) {
                            excluirMudanca(mud.id);
                          }
                        }}
                        className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Filtros e Lista de Mudanças no Condomínio (Cards Expansíveis) */}
      <div className="space-y-3">
        
        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Buscar por morador, apto, transportadora, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/75 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {['Todas', 'Entrada', 'Saída', 'Carreto'].map(tp => (
              <button
                key={tp}
                type="button"
                onClick={() => setFilterTipo(tp)}
                className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all text-center whitespace-nowrap cursor-pointer ${
                  filterTipo === tp
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {tp}
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

        {/* Lista de Cards Accordion */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Próximas Mudanças & Transportes Programados ({filteredMudancas.length})
          </span>

          {filteredMudancas.length === 0 ? (
            <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-2 backdrop-blur-xs">
              <p className="text-sm font-extrabold text-slate-900">
                Nenhum agendamento de mudança encontrado para os filtros selecionados.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterTipo('Todas');
                  setSearchTerm('');
                }}
                className="text-xs text-amber-900 font-black underline cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredMudancas.map((mud) => {
              const isExpanded = !!expandedCards[mud.id];
              const badge = getStatusBadge(mud.status);

              return (
                <div
                  key={mud.id}
                  className="bg-white/50 border border-white/70 rounded-3xl overflow-hidden shadow-xl hover:bg-white/60 transition-all duration-300 backdrop-blur-xs"
                >
                  {/* Card Header Expansível */}
                  <div
                    onClick={() => toggleCard(mud.id)}
                    className="p-4 sm:p-5 cursor-pointer select-none transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                          <Truck className="w-6 h-6 text-slate-950" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-950 text-amber-300">
                              {mud.tipo}
                            </span>
                            <span className="text-xs font-black text-slate-950">
                              Unidade {mud.unidade} {mud.bloco && `(${mud.bloco})`}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-bold text-slate-800 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-indigo-700" />
                              {mud.dataMudanca}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-800" />
                              {mud.periodo}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600 font-semibold">
                              Morador: {mud.moradorNome}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-[11px] font-extrabold text-slate-600 hidden sm:inline">
                          {isExpanded ? 'Recolher detalhes' : 'Ver autorização da portaria'}
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

                  {/* Seção Expansível com Transição Fluida */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden border-t ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100 border-slate-950/10'
                        : 'grid-rows-[0fr] opacity-0 border-transparent'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden bg-white/30 p-4 sm:p-6 space-y-4 text-xs">
                      
                      {/* Grid de Informações Detalhadas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        
                        <div className="p-3 bg-white/70 border border-white/90 rounded-2xl space-y-1 shadow-2xs">
                          <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                            Empresa Transportadora:
                          </span>
                          <strong className="text-slate-950 block">
                            {mud.transportadora || 'Não informada (particular)'}
                          </strong>
                          {mud.placaVeiculo && (
                            <span className="text-[11px] font-mono text-indigo-900 font-bold block">
                              Placa: {mud.placaVeiculo}
                            </span>
                          )}
                        </div>

                        <div className="p-3 bg-white/70 border border-white/90 rounded-2xl space-y-1 shadow-2xs">
                          <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                            Motorista / Acesso:
                          </span>
                          <strong className="text-slate-950 block">
                            {mud.nomeMotorista || 'Motorista a identificar na portaria'}
                          </strong>
                          {mud.rgMotorista && (
                            <span className="text-[11px] text-slate-600 font-medium block">
                              Doc: {mud.rgMotorista}
                            </span>
                          )}
                        </div>

                        <div className="p-3 bg-white/70 border border-white/90 rounded-2xl space-y-1 shadow-2xs">
                          <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                            Elevador & Logística:
                          </span>
                          <span className="text-emerald-950 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            {mud.precisaElevadorServico ? 'Elevador de Serviço Reservado' : 'Sem uso de elevador'}
                          </span>
                          {mud.precisaAcolchoamentoElevador && (
                            <span className="text-[11px] text-amber-900 font-semibold block">
                              🛡️ Proteção de cabine acolchoada requerida
                            </span>
                          )}
                        </div>

                      </div>

                      {mud.observacoes && (
                        <div className="p-3 bg-white/60 rounded-2xl border border-white/80 text-slate-800">
                          <span className="text-[10px] font-black uppercase text-slate-600 block mb-0.5">
                            Observações do Morador:
                          </span>
                          <p className="font-medium text-xs">{mud.observacoes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                        <span>Solicitado em: {mud.criadoEm}</span>
                        <span className="font-bold text-slate-800">Termo de responsabilidade assinado digitalmente</span>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal de Agendamento */}
      <CreateAgendamentoMudancaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMudancaToEdit(null);
        }}
        mudancaToEdit={mudancaToEdit}
      />

    </div>
  );
};
