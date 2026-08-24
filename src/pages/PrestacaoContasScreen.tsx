import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { DespesaItem, ReceitaItem } from '../types';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { ExpenseDetailModal } from '../components/financeiro/ExpenseDetailModal';
import { MOCK_MESES_PRESTACAO } from '../mock/seedData';

export const PrestacaoContasScreen: React.FC = () => {
  const { prestacaoContas: defaultPrestacaoContas } = useCondo();
  
  // Month selector state
  const [selectedMonth, setSelectedMonth] = useState<string>('Abril / 2026');
  
  // Expansion state: 'receitas' | 'despesas' | null
  const [expandedSection, setExpandedSection] = useState<'receitas' | 'despesas' | null>(null);

  // Filters State
  const [filterDespesaCat, setFilterDespesaCat] = useState<string>('Todas');
  const [filterReceitaCat, setFilterReceitaCat] = useState<string>('Todas');
  
  const [selectedExpense, setSelectedExpense] = useState<DespesaItem | null>(null);

  // Current month's financial data
  const currentContas = MOCK_MESES_PRESTACAO[selectedMonth] || defaultPrestacaoContas;

  const despesasCategories = [
    'Todas', 
    'Manutenção & Reparos', 
    'Segurança & Portaria', 
    'Energia Elétrica', 
    'Água e Esgoto', 
    'Limpeza & Conservação', 
    'Elevadores', 
    'Jardinagem & Paisagismo'
  ];

  const receitasCategories = [
    'Todas', 
    'Taxa Condominial', 
    'Fundo de Reserva', 
    'Aplicações Financeiras', 
    'Locações & Serviços', 
    'Multas & Juros'
  ];

  const filteredDespesas = (currentContas.despesas || []).filter(d => 
    filterDespesaCat === 'Todas' || d.categoria === filterDespesaCat
  );

  const filteredReceitas = (currentContas.receitas || []).filter(r => 
    filterReceitaCat === 'Todas' || r.categoria === filterReceitaCat
  );

  const toggleSection = (section: 'receitas' | 'despesas') => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const availableMonths = Object.keys(MOCK_MESES_PRESTACAO);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Prestação de Contas Mês a Mês
          </h2>
        </div>
      </div>

      {/* 1. Month Selector Card */}
      <div className="bg-white/45 border border-white/60 p-4 rounded-3xl shadow-xl w-full max-w-full box-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-950 border border-emerald-400/40 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-800 block">
                Mês de Referência
              </span>
              <div className="relative mt-0.5">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setFilterDespesaCat('Todas');
                    setFilterReceitaCat('Todas');
                  }}
                  className="bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-extrabold focus:outline-none focus:bg-white shadow-xs cursor-pointer"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-950 border border-emerald-400/40 inline-flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Aprovada pelo Conselho
            </span>
          </div>
        </div>
      </div>

      {/* 2. Financial Summary Cards (Clickable & Expandable) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-full">
        
        {/* Entradas (Receitas) Button Card */}
        <button
          onClick={() => toggleSection('receitas')}
          className={`p-4 rounded-3xl border transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none ${
            expandedSection === 'receitas'
              ? 'bg-emerald-500/25 border-emerald-500 ring-2 ring-emerald-400/40 scale-102'
              : 'bg-white/45 border-white/60 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Entradas (Receitas)</span>
            <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-extrabold text-emerald-800 mt-1">
            R$ {currentContas.receitasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-800 font-bold border-t border-slate-950/10 pt-2">
            <span>{expandedSection === 'receitas' ? 'Clique para recolher' : 'Clique para ver entradas'}</span>
            {expandedSection === 'receitas' ? (
              <ChevronUp className="w-4 h-4 text-emerald-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600 group-hover:translate-y-0.5 transition-transform" />
            )}
          </div>
        </button>

        {/* Saídas (Despesas) Button Card */}
        <button
          onClick={() => toggleSection('despesas')}
          className={`p-4 rounded-3xl border transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none ${
            expandedSection === 'despesas'
              ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400/40 scale-102'
              : 'bg-white/45 border-white/60 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Saídas (Despesas)</span>
            <div className="p-1.5 rounded-full bg-rose-500/20 text-rose-800">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-extrabold text-rose-800 mt-1">
            R$ {currentContas.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-800 font-bold border-t border-slate-950/10 pt-2">
            <span>{expandedSection === 'despesas' ? 'Clique para recolher' : 'Clique para ver saídas'}</span>
            {expandedSection === 'despesas' ? (
              <ChevronUp className="w-4 h-4 text-rose-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600 group-hover:translate-y-0.5 transition-transform" />
            )}
          </div>
        </button>

        {/* Saldo do Mês (Summary) */}
        <div className="bg-white/45 border border-amber-400/60 rounded-3xl p-4 shadow-lg w-full relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-900">
              <span className="font-extrabold uppercase tracking-wider text-[10px]">Saldo do Mês</span>
              <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-900">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-slate-950 mt-1">
              R$ {currentContas.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-800 font-bold border-t border-slate-950/10 pt-2">
            Superávit retido em Fundo de Reserva
          </div>
        </div>

      </div>

      {/* 3. EXPANDED SECTION: Receitas (Entradas) */}
      {expandedSection === 'receitas' && (
        <div className="bg-white/45 border border-emerald-400/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-300 w-full max-w-full overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-950/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-950">
                <ArrowDownLeft className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Detalhamento de Entradas & Receitas
                </h3>
                <p className="text-[10px] text-slate-800 font-medium">
                  Origens de arrecadação do condomínio em {selectedMonth}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-900 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              {filteredReceitas.length} lançamentos
            </span>
          </div>

          {/* Receitas Categories Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
            {receitasCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterReceitaCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                  filterReceitaCat === cat
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105'
                    : 'bg-white/50 text-slate-900 border-white/70 hover:bg-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Receitas Items List */}
          <div className="space-y-2.5">
            {filteredReceitas.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-900 border border-emerald-400/30 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-950 truncate">
                      {rec.descricao}
                    </h4>
                    <p className="text-[10px] text-slate-800 font-bold mt-0.5 flex flex-wrap items-center gap-2">
                      <span>Origem: <strong>{rec.origem}</strong></span>
                      <span>•</span>
                      <span>{rec.data}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-sm text-emerald-800 block">
                    + R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-slate-700 font-bold">{rec.categoria}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. EXPANDED SECTION: Despesas (Saídas) */}
      {expandedSection === 'despesas' && (
        <div className="bg-white/45 border border-rose-400/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-300 w-full max-w-full overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-950/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-950">
                <ArrowUpRight className="w-5 h-5 text-rose-800" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Detalhamento de Saídas & Despesas
                </h3>
                <p className="text-[10px] text-slate-800 font-medium">
                  Contratos, manutenções e despesas operacionais em {selectedMonth}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-rose-900 bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-500/30">
              {filteredDespesas.length} lançamentos
            </span>
          </div>

          {/* Despesas Categories Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
            {despesasCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterDespesaCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                  filterDespesaCat === cat
                    ? 'bg-rose-500 text-white border-rose-400 scale-105'
                    : 'bg-white/50 text-slate-900 border-white/70 hover:bg-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Despesas Items List */}
          <div className="space-y-2.5">
            {filteredDespesas.map((desp) => {
              const isRepairLinked = Boolean(desp.reparoId);
              return (
                <div
                  key={desp.id}
                  onClick={() => setSelectedExpense(desp)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md ${
                    isRepairLinked
                      ? 'bg-white/70 border-amber-400/80 hover:bg-white/85 scale-101'
                      : 'bg-white/60 border-white/80 hover:bg-white/75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      isRepairLinked ? 'bg-amber-500/20 text-amber-950 border-amber-400/40' : 'bg-white/80 text-slate-800 border-white/90'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-xs text-slate-950 truncate">
                          {desp.descricao}
                        </h4>
                        {isRepairLinked && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-slate-950 border border-amber-400/50">
                            Reparo Vinculado
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-800 font-bold mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{desp.fornecedor}</span>
                        <span>•</span>
                        <span>{desp.data}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div>
                      <span className="font-extrabold text-sm text-rose-800 block">
                        - R$ {desp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-700 font-bold">{desp.categoria}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseDetailModal
          despesa={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}

    </div>
  );
};
