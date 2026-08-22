import React from 'react';
import { useCondo } from '../context/CondoContext';
import { StatusReparo } from '../types';
import { Wrench, Clock, ShieldCheck, Calendar, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { BudgetComparator } from '../components/reparos/BudgetComparator';
import { TimelineView } from '../components/reparos/TimelineView';

export const ReparosScreen: React.FC = () => {
  const { 
    reparos, 
    currentUser, 
    selectedReparoId, 
    setSelectedReparoId, 
    atualizarStatusReparo,
    setCurrentScreen
  } = useCondo();

  const selectedReparo = reparos.find(r => r.id === selectedReparoId) || reparos[0];
  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  const statusOptions: StatusReparo[] = [
    'Solicitado', 
    'Em análise', 
    'Aguardando Conserto',
    'Orçamento', 
    'Aprovado', 
    'Agendado', 
    'Executado', 
    'Confirmado'
  ];

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            Reparos & Manutenção Geral
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Acompanhe a solução de problemas, orçamentos e a execução dos consertos
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Repairs List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Lista de Reparos ({reparos.length})
          </span>

          {reparos.map((rep) => {
            const isSelected = rep.id === selectedReparoId;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReparoId(rep.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-400 ring-2 ring-indigo-400/20 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {rep.categoria}
                  </span>
                  <StatusBadge status={rep.status} />
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {rep.titulo}
                </h3>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-slate-700 font-medium">
                    Empresa: <strong className="text-slate-900">{rep.empresaEscolhida || 'Em cotação'}</strong>
                  </span>
                  <span className="text-emerald-700 font-extrabold text-xs">
                    {rep.valorFinal ? `R$ ${rep.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '---'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Repair Detail Page */}
        {selectedReparo ? (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
            
            {/* Header Detail */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">
                  {selectedReparo.categoria}
                </span>
                <StatusBadge status={selectedReparo.status} />
              </div>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedReparo.dataSolicitacao}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {selectedReparo.titulo}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Origem: <span className="text-slate-900 font-bold">{selectedReparo.solicitanteNome}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
              {selectedReparo.descricao}
            </div>

            {/* Admin Control Bar: Evolution of Repair Status */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Alterar Status do Reparo (Administração)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Evolução do Fluxo</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {statusOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => atualizarStatusReparo(selectedReparo.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        selectedReparo.status === st
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Before / After */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                Evidências do Serviço (Fotos Antes & Conclusão)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 group">
                  <img
                    src={selectedReparo.fotosAntes[0] || 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80'}
                    alt="Antes do reparo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-end p-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
                      Problema Constatado
                    </span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 group">
                  <img
                    src={selectedReparo.fotosDepois[0] || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'}
                    alt="Depois do reparo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-end p-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                      Serviço Concluído
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Quotes Competitor Comparator */}
            <BudgetComparator
              reparoId={selectedReparo.id}
              orcamentos={selectedReparo.orcamentos}
            />

            {/* Timeline View */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Linha do Tempo de Evolução ({selectedReparo.timeline.length} etapas)
              </h4>

              <TimelineView steps={selectedReparo.timeline} />
            </div>

            {/* Link to Accounts */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">
                Gasto de <strong className="text-emerald-700">R$ {selectedReparo.valorFinal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> registrado na Prestação de Contas.
              </span>
              <button
                onClick={() => setCurrentScreen('prestacao-contas')}
                className="text-indigo-600 font-extrabold hover:underline flex items-center gap-1"
              >
                Consultar Contas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
