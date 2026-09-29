import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../utils/excelFinanceUtils';

interface FinanceGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinanceGraphModal: React.FC<FinanceGraphModalProps> = ({
  isOpen,
  onClose
}) => {
  const { mesesPrestacao } = useCondo();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // 1. Filtrar apenas meses que possuem lançamentos (receitas ou despesas) para pular meses sem dados
  const monthKeysWithData = Object.keys(mesesPrestacao).filter(key => {
    const data = mesesPrestacao[key];
    const numDespesas = data?.despesas?.length || 0;
    const numReceitas = data?.receitas?.length || 0;
    return numDespesas > 0 || numReceitas > 0;
  });

  // Pegar até os últimos 12 meses disponíveis com movimentação
  const last12MonthsKeys = monthKeysWithData.slice(-12);

  const chartData = last12MonthsKeys.map(mesKey => {
    const monthObj = mesesPrestacao[mesKey];
    const totalReceitas = (monthObj?.receitas || []).reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
    const totalDespesas = (monthObj?.despesas || []).reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
    const saldo = totalReceitas - totalDespesas;
    const isLucro = saldo >= 0;

    return {
      mesKey,
      totalReceitas,
      totalDespesas,
      saldo,
      isLucro
    };
  });

  // Totais Acumulados do Período
  const totalReceitasGeral = chartData.reduce((acc, d) => acc + d.totalReceitas, 0);
  const totalDespesasGeral = chartData.reduce((acc, d) => acc + d.totalDespesas, 0);
  const saldoGeral = totalReceitasGeral - totalDespesasGeral;
  const isLucroGeral = saldoGeral >= 0;

  // Geometria e coordenadas do Gráfico de Linha (SVG)
  const svgWidth = 1000;
  const svgHeight = 360;
  const padLeft = 70;
  const padRight = 70;
  const padTop = 50;
  const padBottom = 50;
  const graphWidth = svgWidth - padLeft - padRight;
  const graphHeight = svgHeight - padTop - padBottom;

  const maxVal = Math.max(
    ...chartData.flatMap(d => [d.totalReceitas, d.totalDespesas]),
    100
  ) * 1.15; // Margem no topo para as curvas de linha

  const points = chartData.map((d, i) => {
    const x = chartData.length === 1 
      ? svgWidth / 2 
      : padLeft + (i / (chartData.length - 1)) * graphWidth;

    const yReceita = (padTop + graphHeight) - (d.totalReceitas / maxVal) * graphHeight;
    const yDespesa = (padTop + graphHeight) - (d.totalDespesas / maxVal) * graphHeight;

    return {
      ...d,
      x,
      yReceita,
      yDespesa,
      index: i
    };
  });

  const receitasPathD = points.length > 0 
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yReceita}`).join(' ')
    : '';

  const despesasPathD = points.length > 0 
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yDespesa}`).join(' ')
    : '';

  // Ponto Ativo (Mouse sobre ele ou Selecionado por clique, ou último mês por padrão)
  const activeIndex = hoveredIndex !== null 
    ? hoveredIndex 
    : (selectedIndex !== null ? selectedIndex : (points.length > 0 ? points.length - 1 : null));

  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto relative z-10">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-teal-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Gráfico de Tendência Financeira (Linhas)
              </h3>
              <p className="text-xs text-teal-200/80 font-medium">
                Passe o mouse ou toque nos nós de cada mês para visualizar Receitas, Gastos e Saldo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Fechar gráfico"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">

          {/* Cards de Resumo Acumulado Geral */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Receitas Acumuladas
              </span>
              <strong className="text-lg font-black text-emerald-700 block">
                + {formatCurrency(totalReceitasGeral)}
              </strong>
              <span className="text-[10px] text-emerald-800/80 font-semibold block">
                {chartData.length} meses com movimentação
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                Despesas Acumuladas
              </span>
              <strong className="text-lg font-black text-rose-700 block">
                - {formatCurrency(totalDespesasGeral)}
              </strong>
              <span className="text-[10px] text-rose-800/80 font-semibold block">
                {chartData.length} meses com movimentação
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl border shadow-2xs space-y-0.5 ${
              isLucroGeral 
                ? 'bg-emerald-600 text-white border-emerald-700' 
                : 'bg-rose-600 text-white border-rose-700'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/90 flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5" />
                Balanço Geral do Período
              </span>
              <strong className="text-lg font-black text-white block">
                {isLucroGeral ? '+ ' : ''}{formatCurrency(saldoGeral)}
              </strong>
              <span className="text-[10px] text-white/90 font-bold block">
                {isLucroGeral ? '✓ Superávit Financeiro Geral' : '⚠️ Déficit Geral Acumulado'}
              </span>
            </div>

          </div>

          {/* ÁREA DO GRÁFICO DE LINHAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white space-y-4 shadow-xl relative">
            
            {/* Header com Nomes dos Meses (Estilo Esboço do Usuário) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mr-2 shrink-0 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" /> Meses Ativos:
              </span>
              {points.map((p, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={p.mesKey}
                    type="button"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {p.mesKey}
                  </button>
                );
              })}
            </div>

            {/* Legenda das Linhas */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-3.5 h-1 rounded-full bg-emerald-400" /> Linha Verde: Receitas (Entradas)
                </span>
                <span className="flex items-center gap-1.5 font-bold text-rose-400">
                  <span className="w-3.5 h-1 rounded-full bg-rose-400" /> Linha Vermelha: Gastos (Despesas)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 italic">
                * Passe o mouse nos pontos para ler os 3 valores numéricos do mês
              </span>
            </div>

            {/* GRÁFICO SVG DE LINHAS */}
            {points.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                Nenhum lançamento encontrado para gerar o gráfico.
              </div>
            ) : (
              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto max-h-[360px] overflow-visible select-none"
                >
                  <defs>
                    <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="despesaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Linhas de Grade Horizontais do Gráfico */}
                  {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
                    const y = padTop + graphHeight * (1 - ratio);
                    return (
                      <line
                        key={idx}
                        x1={padLeft - 20}
                        y1={y}
                        x2={svgWidth - padRight + 20}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Linha Vertical Guia ao passar o mouse / nó selecionado */}
                  {activePoint && (
                    <line
                      x1={activePoint.x}
                      y1={padTop - 10}
                      x2={activePoint.x}
                      y2={padTop + graphHeight + 10}
                      stroke="#38bdf8"
                      strokeDasharray="4 4"
                      strokeWidth="2"
                    />
                  )}

                  {/* Caminhos das Linhas (Linha Verde Receitas & Linha Vermelha Despesas) */}
                  <path
                    d={receitasPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={despesasPathD}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nóculos / Pontos (Nodes) dos Meses */}
                  {points.map((p, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <g 
                        key={p.mesKey} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => setSelectedIndex(idx)}
                      >
                        {/* Área transparente ampla para toque e passar o mouse facil */}
                        <rect
                          x={p.x - (graphWidth / Math.max(1, points.length)) / 2}
                          y={padTop}
                          width={graphWidth / Math.max(1, points.length)}
                          height={graphHeight}
                          fill="transparent"
                        />

                        {/* Rótulo do Mês na base do nó */}
                        <text
                          x={p.x}
                          y={svgHeight - 15}
                          textAnchor="middle"
                          fill={isActive ? '#38bdf8' : '#94a3b8'}
                          fontSize="12"
                          fontWeight={isActive ? '900' : '700'}
                        >
                          {p.mesKey.split('/')[0].trim()}
                        </text>

                        {/* Nó Círculo Linha Verde (Receita) */}
                        <circle
                          cx={p.x}
                          cy={p.yReceita}
                          r={isActive ? "8" : "6"}
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all duration-150"
                        />

                        {/* Nó Círculo Linha Vermelha (Despesa) */}
                        <circle
                          cx={p.x}
                          cy={p.yDespesa}
                          r={isActive ? "8" : "6"}
                          fill="#f43f5e"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all duration-150"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* POPUP / TOOLTIP COM OS 3 NÚMEROS DO MÊS SELECIONADO/HOVERED */}
            {activePoint && (
              <div className="bg-slate-950/95 border-2 border-teal-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-150">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      Detalhamento do Mês: {activePoint.mesKey}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    Valores em R$
                  </span>
                </div>

                {/* Grid dos 3 Números Exatos solicitados pelo usuário */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Número 1: Receita */}
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 1. Receita (Ganho)
                    </span>
                    <strong className="text-base sm:text-lg font-black text-emerald-300 block">
                      + {formatCurrency(activePoint.totalReceitas)}
                    </strong>
                  </div>

                  {/* Número 2: Gasto */}
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-rose-400 block flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> 2. Gasto (Despesa)
                    </span>
                    <strong className="text-base sm:text-lg font-black text-rose-300 block">
                      - {formatCurrency(activePoint.totalDespesas)}
                    </strong>
                  </div>

                  {/* Número 3: Saldo Final / Resultado (Lucro ou Prejuízo) */}
                  <div className={`p-3 rounded-xl border space-y-0.5 ${
                    activePoint.saldo > 0
                      ? 'bg-emerald-900/80 border-emerald-400 text-white'
                      : activePoint.saldo < 0
                        ? 'bg-rose-900/80 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-600 text-white'
                  }`}>
                    <span className="text-[10px] font-black uppercase block text-white/90 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" /> 3. Resultado (Saldo Final)
                    </span>
                    <strong className="text-base sm:text-lg font-black block">
                      {activePoint.saldo >= 0 ? '+ ' : ''}{formatCurrency(activePoint.saldo)}
                    </strong>
                    <span className="text-[10px] font-bold block text-white/80">
                      {activePoint.saldo > 0 ? '✓ Mês de Lucro (Superávit)' : activePoint.saldo < 0 ? '⚠️ Mês de Prejuízo (Déficit)' : 'Mês Equilibrado'}
                    </span>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Tabela Detalhada dos Meses no Rodapé do Modal */}
          {chartData.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-extrabold text-xs text-slate-800 flex items-center justify-between">
                <span>Tabela de Registros ({chartData.length} Meses Processados)</span>
                <span className="text-[10px] text-slate-500 uppercase">Valores calculados em R$</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black border-b border-slate-200">
                    <tr>
                      <th className="p-3">Mês de Referência</th>
                      <th className="p-3 text-right">Receitas (Ganho)</th>
                      <th className="p-3 text-right">Gastos (Despesas)</th>
                      <th className="p-3 text-right">Saldo (Resultado)</th>
                      <th className="p-3 text-center">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {chartData.map((item, idx) => (
                      <tr 
                        key={item.mesKey} 
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => setSelectedIndex(idx)}
                        className={`transition-colors cursor-pointer ${
                          activeIndex === idx ? 'bg-teal-50/80 font-black' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 text-slate-950 font-black">{item.mesKey}</td>
                        <td className="p-3 text-right font-black text-emerald-700">
                          + {formatCurrency(item.totalReceitas)}
                        </td>
                        <td className="p-3 text-right font-black text-rose-700">
                          - {formatCurrency(item.totalDespesas)}
                        </td>
                        <td className={`p-3 text-right font-black ${item.saldo >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {item.saldo >= 0 ? '+ ' : ''}{formatCurrency(item.saldo)}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border inline-block ${
                            item.saldo > 0
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              : item.saldo < 0
                                ? 'bg-rose-100 text-rose-950 border-rose-300'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}>
                            {item.saldo > 0 ? '✓ Lucro' : item.saldo < 0 ? '⚠️ Prejuízo' : 'Equilibrado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            * Meses não cadastrados são omitidos automaticamente do gráfico.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Fechar Gráfico
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
};
