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
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            Prestação de Contas Mês a Mês
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Transparência financeira total: Entradas, saídas e notas fiscais
          </p>
        </div>
      </div>

      {/* Month Selector Pill */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Wallet className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Mês de Referência</span>
            <span className="text-sm font-extrabold text-slate-900">{prestacaoContas.mesAno}</span>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Aprovada pelo Conselho
        </span>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Receitas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-1 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Entradas (Receitas)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            R$ {prestacaoContas.receitasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Taxas condominiais arrecadadas</p>
        </div>

        {/* Despesas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-1 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Saídas (Despesas)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-extrabold text-rose-700">
            R$ {prestacaoContas.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Manutenção, funcionários e contratos</p>
        </div>

        {/* Saldo */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-white border border-indigo-200 rounded-3xl p-4 space-y-1 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-indigo-900">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Saldo do Mês</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-indigo-900">
            R$ {prestacaoContas.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Superávit em fundo de reserva</p>
        </div>

      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-2xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Breakdown List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Detalhamento de Lançamentos ({filteredDespesas.length})
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Clique na despesa para ver comprovantes</span>
        </div>

        <div className="space-y-2.5">
          {filteredDespesas.map((desp) => {
            const isRepairLinked = Boolean(desp.reparoId);
            return (
              <div
                key={desp.id}
                onClick={() => setSelectedExpense(desp)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isRepairLinked
                    ? 'bg-indigo-50/60 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isRepairLinked ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">
                        {desp.descricao}
                      </h4>
                      {isRepairLinked && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Reparo Vinculado
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                      <span>{desp.fornecedor}</span>
                      <span>•</span>
                      <span>{desp.data}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right shrink-0">
                  <div>
                    <span className="font-extrabold text-sm text-rose-700 block">
                      R$ {desp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{desp.categoria}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
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
