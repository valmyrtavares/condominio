import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { DespesaItem } from '../types';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ExpenseDetailModal } from '../components/financeiro/ExpenseDetailModal';

export const PrestacaoContasScreen: React.FC = () => {
  const { prestacaoContas } = useCondo();
  const [selectedExpense, setSelectedExpense] = useState<DespesaItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Manutenção & Reparos', 'Segurança & Portaria', 'Energia Elétrica', 'Água e Esgoto', 'Limpeza & Conservação', 'Elevadores', 'Jardinagem & Paisagismo'];

  const filteredDespesas = prestacaoContas.despesas.filter(d => 
    filterCategory === 'Todas' || d.categoria === filterCategory
  );

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Prestação de Contas Mês a Mês
          </h2>
        </div>
      </div>

      {/* Month Selector Pill */}
      <div className="flex items-center justify-between bg-white/45 border border-white/60 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-950 border border-emerald-400/40">
            <Wallet className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-800 block">Mês de Referência</span>
            <span className="text-sm font-extrabold text-slate-950">{prestacaoContas.mesAno}</span>
          </div>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-950 border border-emerald-400/40">
          Aprovada pelo Conselho
        </span>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Receitas */}
        <div className="bg-white/45 border border-white/60 rounded-3xl p-4 space-y-1 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Entradas (Receitas)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800">
            R$ {prestacaoContas.receitasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-800 font-semibold">Taxas condominiais arrecadadas</p>
        </div>

        {/* Despesas */}
        <div className="bg-white/45 border border-white/60 rounded-3xl p-4 space-y-1 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Saídas (Despesas)</span>
            <TrendingDown className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-xl font-extrabold text-rose-800">
            R$ {prestacaoContas.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-800 font-semibold">Manutenção, funcionários e contratos</p>
        </div>

        {/* Saldo */}
        <div className="bg-white/45 border border-amber-400/60 rounded-3xl p-4 space-y-1 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-900">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Saldo do Mês</span>
            <ShieldCheck className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-extrabold text-slate-950">
            R$ {prestacaoContas.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-800 font-semibold">Superávit em fundo de reserva</p>
        </div>

      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105'
                : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Breakdown List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow">
            Detalhamento de Lançamentos ({filteredDespesas.length})
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredDespesas.map((desp) => {
            const isRepairLinked = Boolean(desp.reparoId);
            return (
              <div
                key={desp.id}
                onClick={() => setSelectedExpense(desp)}
                className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg ${
                  isRepairLinked
                    ? 'bg-white/65 border-amber-400/80 hover:bg-white/75 scale-101'
                    : 'bg-white/45 border-white/60 hover:bg-white/55'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border shrink-0 ${
                    isRepairLinked ? 'bg-amber-500/20 text-amber-950 border-amber-400/40' : 'bg-white/60 text-slate-800 border-white/80'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-950">
                        {desp.descricao}
                      </h4>
                      {isRepairLinked && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-slate-950 border border-amber-400/50">
                          Reparo Vinculado
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-800 font-bold mt-0.5 flex items-center gap-2">
                      <span>{desp.fornecedor}</span>
                      <span>•</span>
                      <span>{desp.data}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right shrink-0">
                  <div>
                    <span className="font-extrabold text-sm text-rose-800 block">
                      R$ {desp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      {/* Detail Modal */}
      {selectedExpense && (
        <ExpenseDetailModal
          despesa={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}

    </div>
  );
};
