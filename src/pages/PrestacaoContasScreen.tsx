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
  ArrowUpRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { ExpenseDetailModal } from '../components/financeiro/ExpenseDetailModal';
import { ReceiptPdfModal } from '../components/financeiro/ReceiptPdfModal';
import { MOCK_MESES_PRESTACAO } from '../mock/seedData';

export const PrestacaoContasScreen: React.FC = () => {
  const { 
    prestacaoContas: defaultPrestacaoContas, 
    mesesPrestacao, 
    categoriasDespesa, 
    categoriasReceita 
  } = useCondo();
  
  const availableMonths = Object.keys(mesesPrestacao).length > 0 
    ? Object.keys(mesesPrestacao) 
    : Object.keys(MOCK_MESES_PRESTACAO);

  // Month selector state
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || 'Abril / 2026');
  
  // Independent expansion state for each section
  const [isReceitasOpen, setIsReceitasOpen] = useState<boolean>(false);
  const [isDespesasOpen, setIsDespesasOpen] = useState<boolean>(true); // Aberto por padrão para visualização das despesas

  // Filters State
  const [filterDespesaCat, setFilterDespesaCat] = useState<string>('Todas');
  const [filterReceitaCat, setFilterReceitaCat] = useState<string>('Todas');
  
  // Modal states
  const [selectedExpenseDetail, setSelectedExpenseDetail] = useState<DespesaItem | null>(null);
  const [pdfModalItem, setPdfModalItem] = useState<{ item: DespesaItem | ReceitaItem; tipo: 'despesa' | 'receita' } | null>(null);

  // Current month's financial data
  const currentContas = mesesPrestacao[selectedMonth] || defaultPrestacaoContas || MOCK_MESES_PRESTACAO[selectedMonth];

  const despesasCategories = ['Todas', ...categoriasDespesa];
  const receitasCategories = ['Todas', ...categoriasReceita];

  const filteredDespesas = (currentContas?.despesas || []).filter(d => 
    filterDespesaCat === 'Todas' || d.categoria === filterDespesaCat
  );

  const filteredReceitas = (currentContas?.receitas || []).filter(r => 
    filterReceitaCat === 'Todas' || r.categoria === filterReceitaCat
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <PieChart className="w-5 h-5 text-emerald-400" />
          Prestação de Contas Mês a Mês
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Transparência financeira total: receitas, despesas e notas fiscais com comprovantes autenticados.
        </p>
      </div>

      {/* 1. Mês de Referência (Inline, Sem Card grande) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 py-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-extrabold text-amber-100 drop-shadow">
              Mês de Referência:
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setFilterDespesaCat('Todas');
                setFilterReceitaCat('Todas');
              }}
              className="bg-white/85 hover:bg-white border border-white/90 rounded-xl px-3 py-1 text-xs text-slate-950 font-extrabold focus:outline-none focus:bg-white shadow-sm cursor-pointer transition-all"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/50 inline-flex items-center gap-1.5 shadow-sm backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Aprovada pelo Conselho
          </span>
        </div>
      </div>

      {/* 2. Card SALDO DO MÊS (No Topo!) */}
      <div className="bg-white/50 border-2 border-amber-400/90 rounded-3xl p-4 sm:p-5 shadow-xl w-full relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="p-2 rounded-2xl bg-amber-500/30 text-amber-950 border border-amber-400/50">
              <Wallet className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                Saldo do Mês ({selectedMonth})
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                R$ {currentContas.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch sm:self-center bg-white/70 border border-white/90 p-3 rounded-2xl text-xs space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
            Destinação Contábil:
          </span>
          <span className="font-extrabold text-emerald-900 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Superávit retido 100% em Fundo de Reserva
          </span>
        </div>
      </div>

      {/* 3. BLOCO: ENTRADAS (RECEITAS) COM EXPANSÃO DIRETAMENTE EMBAIXO */}
      <div className="space-y-3">
        
        {/* Card Botão de Entradas */}
        <button
          type="button"
          onClick={() => setIsReceitasOpen(!isReceitasOpen)}
          className={`p-4 rounded-3xl border transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none ${
            isReceitasOpen
              ? 'bg-emerald-500/30 border-emerald-500 ring-2 ring-emerald-400/50'
              : 'bg-white/45 border-white/60 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-900">
              Entradas (Receitas)
            </span>
            <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 mt-1">
            R$ {currentContas.receitasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-900 font-extrabold border-t border-slate-950/10 pt-2">
            <span>{isReceitasOpen ? 'Clique para recolher lançamentos' : 'Clique para ver entradas detalhadas'}</span>
            <div className="flex items-center gap-1 text-emerald-950 font-black">
              <span>{filteredReceitas.length} lançamentos</span>
              {isReceitasOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Detalhamento de Entradas (Surge logo abaixo do card de Entradas com animação) */}
        {isReceitasOpen && (
          <div className="bg-white/45 border border-emerald-400/60 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-300 w-full">
            
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
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
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

            {/* Receitas Items List com Link do PDF da Nota Fiscal */}
            <div className="space-y-2.5">
              {filteredReceitas.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:bg-white/75 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-900 border border-emerald-400/30 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-950">
                        {rec.descricao}
                      </h4>
                      <p className="text-[10px] text-slate-800 font-bold mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Origem: <strong>{rec.origem}</strong></span>
                        <span>•</span>
                        <span>{rec.data}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900/10 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="font-black text-sm text-emerald-800 block">
                        + R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-700 font-bold">{rec.categoria}</span>
                    </div>

                    {/* Botão de PDF da Nota Fiscal / Comprovante */}
                    <button
                      type="button"
                      onClick={() => setPdfModalItem({ item: rec, tipo: 'receita' })}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-extrabold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver PDF da NF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* 4. BLOCO: SAÍDAS (DESPESAS) COM EXPANSÃO DIRETAMENTE EMBAIXO */}
      <div className="space-y-3">
        
        {/* Card Botão de Saídas */}
        <button
          type="button"
          onClick={() => setIsDespesasOpen(!isDespesasOpen)}
          className={`p-4 rounded-3xl border transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none ${
            isDespesasOpen
              ? 'bg-rose-500/25 border-rose-400 ring-2 ring-rose-400/50'
              : 'bg-white/45 border-white/60 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-900">
              Saídas (Despesas)
            </span>
            <div className="p-1.5 rounded-full bg-rose-500/20 text-rose-800">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-rose-800 mt-1">
            R$ {currentContas.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-900 font-extrabold border-t border-slate-950/10 pt-2">
            <span>{isDespesasOpen ? 'Clique para recolher lançamentos' : 'Clique para ver saídas detalhadas'}</span>
            <div className="flex items-center gap-1 text-rose-950 font-black">
              <span>{filteredDespesas.length} lançamentos</span>
              {isDespesasOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Detalhamento de Saídas (Surge logo abaixo do card de Saídas com animação) */}
        {isDespesasOpen && (
          <div className="bg-white/45 border border-rose-400/60 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-300 w-full">
            
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
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
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

            {/* Despesas Items List com Link do PDF da Nota Fiscal */}
            <div className="space-y-2.5">
              {filteredDespesas.map((desp) => {
                const isRepairLinked = Boolean(desp.reparoId);
                return (
                  <div
                    key={desp.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md ${
                      isRepairLinked
                        ? 'bg-white/70 border-amber-400/80 hover:bg-white/85'
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
                          <h4 className="font-extrabold text-xs text-slate-950">
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

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900/10 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="font-black text-sm text-rose-800 block">
                          - R$ {desp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-700 font-bold">{desp.categoria}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Botão de PDF da Nota Fiscal Paga */}
                        <button
                          type="button"
                          onClick={() => setPdfModalItem({ item: desp, tipo: 'despesa' })}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-extrabold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ver PDF da NF</span>
                        </button>

                        {/* Detalhe modal de rastreabilidade de reparo */}
                        <button
                          type="button"
                          onClick={() => setSelectedExpenseDetail(desp)}
                          className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-700 border border-white/90 shadow-2xs"
                          title="Ver detalhes completos e vínculo com reparo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* PDF Receipt / Nota Fiscal Modal */}
      {pdfModalItem && (
        <ReceiptPdfModal
          item={pdfModalItem.item}
          tipo={pdfModalItem.tipo}
          onClose={() => setPdfModalItem(null)}
        />
      )}

      {/* Expense Detail Modal */}
      {selectedExpenseDetail && (
        <ExpenseDetailModal
          despesa={selectedExpenseDetail}
          onClose={() => setSelectedExpenseDetail(null)}
        />
      )}

    </div>
  );
};
