import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { DespesaItem, ReceitaItem, PrestacaoContas } from '../types';
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

export const PrestacaoContasScreen: React.FC = () => {
  const { 
    prestacaoContas: defaultPrestacaoContas, 
    mesesPrestacao, 
    categoriasDespesa, 
    categoriasReceita 
  } = useCondo();
  
  const availableMonths = Object.keys(mesesPrestacao).length > 0 
    ? Object.keys(mesesPrestacao) 
    : ['Mês Atual'];

  // Month selector state
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || 'Mês Atual');
  
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
  const fallbackContas: PrestacaoContas = {
    id: 'pc-padrao',
    mesAno: selectedMonth || 'Mês Atual',
    saldo: 0,
    receitasTotal: 0,
    despesasTotal: 0,
    receitas: [],
    despesas: [],
    condominioId: ''
  };

  const currentContas = mesesPrestacao[selectedMonth] || defaultPrestacaoContas || fallbackContas;

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
              className="bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 text-xs text-slate-950 font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer transition-all"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-600 text-white border border-emerald-500 inline-flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            Aprovada pelo Conselho
          </span>
        </div>
      </div>

      {/* 2. Card SALDO DO MÊS (No Topo - Fundo Branco Sólido!) */}
      <div className="bg-white border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-xl w-full relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-950 border border-amber-300">
              <Wallet className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Saldo do Mês ({selectedMonth})
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                R$ {currentContas.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch sm:self-center bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
            Destinação Contábil:
          </span>
          <span className="font-extrabold text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Superávit retido 100% em Fundo de Reserva
          </span>
        </div>
      </div>

      {/* 3. BLOCO: ENTRADAS (RECEITAS) COM EXPANSÃO DIRETAMENTE EMBAIXO */}
      <div className="space-y-3">
        
        {/* Card Botão de Entradas - Fundo Branco Sólido */}
        <button
          type="button"
          onClick={() => setIsReceitasOpen(!isReceitasOpen)}
          className={`p-4 rounded-3xl border-2 transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none cursor-pointer bg-white ${
            isReceitasOpen
              ? 'border-emerald-500 ring-2 ring-emerald-400/30'
              : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-600">
              Entradas (Receitas)
            </span>
            <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            R$ {currentContas.receitasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 font-extrabold border-t border-slate-100 pt-2">
            <span>{isReceitasOpen ? 'Clique para recolher lançamentos' : 'Clique para ver entradas detalhadas'}</span>
            <div className="flex items-center gap-1 text-emerald-800 font-black">
              <span>{filteredReceitas.length} lançamentos</span>
              {isReceitasOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Detalhamento de Entradas - Fundo Branco Sólido */}
        {isReceitasOpen && (
          <div className="bg-white border border-emerald-400 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-300 w-full">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">
                    Detalhamento de Entradas & Receitas
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Origens de arrecadação do condomínio em {selectedMonth}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200">
                {filteredReceitas.length} lançamentos
              </span>
            </div>

            {/* Receitas Categories Filter Pills - Cores Sólidas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
              {receitasCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterReceitaCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-xs shrink-0 cursor-pointer ${
                    filterReceitaCat === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-sm'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
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
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-950">
                        {rec.descricao}
                      </h4>
                      <p className="text-[10px] text-slate-600 font-bold mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Origem: <strong>{rec.origem}</strong></span>
                        <span>•</span>
                        <span>{rec.data}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="font-black text-sm text-emerald-700 block">
                        + R$ {rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{rec.categoria}</span>
                    </div>

                    {/* Botão de PDF da Nota Fiscal / Comprovante */}
                    <button
                      type="button"
                      onClick={() => setPdfModalItem({ item: rec, tipo: 'receita' })}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-extrabold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
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

      {/* 4. BLOCO: SAÍDAS (DESPESAS) - Fundo Branco Sólido com Contorno e Número Vermelhos */}
      <div className="space-y-3">
        
        {/* Card Botão de Saídas */}
        <button
          type="button"
          onClick={() => setIsDespesasOpen(!isDespesasOpen)}
          className={`p-4 rounded-3xl border-2 transition-all text-left shadow-lg w-full relative overflow-hidden group focus:outline-none cursor-pointer bg-white ${
            isDespesasOpen
              ? 'border-rose-500 ring-2 ring-rose-400/30'
              : 'border-rose-300 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-600">
              Saídas (Despesas)
            </span>
            <div className="p-1.5 rounded-full bg-rose-100 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            R$ {currentContas.despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 font-extrabold border-t border-slate-100 pt-2">
            <span>{isDespesasOpen ? 'Clique para recolher lançamentos' : 'Clique para ver saídas detalhadas'}</span>
            <div className="flex items-center gap-1 text-rose-700 font-black">
              <span>{filteredDespesas.length} lançamentos</span>
              {isDespesasOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Detalhamento de Saídas - Fundo Branco Sólido */}
        {isDespesasOpen && (
          <div className="bg-white border-2 border-rose-300 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-300 w-full">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">
                    Detalhamento de Saídas & Despesas
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Contratos, manutenções e despesas operacionais em {selectedMonth}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200">
                {filteredDespesas.length} lançamentos
              </span>
            </div>

            {/* Despesas Categories Filter Pills - Cores Sólidas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
              {despesasCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterDespesaCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-xs shrink-0 cursor-pointer ${
                    filterDespesaCat === cat
                      ? 'bg-rose-600 text-white border-rose-600 scale-105 shadow-sm'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
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
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs ${
                      isRepairLinked
                        ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        isRepairLinked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-xs text-slate-950">
                            {desp.descricao}
                          </h4>
                          {isRepairLinked && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Reparo Vinculado
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{desp.fornecedor}</span>
                          <span>•</span>
                          <span>{desp.data}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="font-black text-sm text-rose-600 block">
                          - R$ {desp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{desp.categoria}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Botão de PDF da Nota Fiscal Paga */}
                        <button
                          type="button"
                          onClick={() => setPdfModalItem({ item: desp, tipo: 'despesa' })}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] font-extrabold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ver PDF da NF</span>
                        </button>

                        {/* Detalhe modal de rastreabilidade de reparo */}
                        <button
                          type="button"
                          onClick={() => setSelectedExpenseDetail(desp)}
                          className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs cursor-pointer"
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
