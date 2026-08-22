import React from 'react';
import { Orcamento } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { CheckCircle, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';

interface BudgetComparatorProps {
  reparoId: string;
  orcamentos: Orcamento[];
}

export const BudgetComparator: React.FC<BudgetComparatorProps> = ({ reparoId, orcamentos }) => {
  const { currentUser, selecionarOrcamento } = useCondo();
  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          Cotações Concorrentes (3 Orçamentos)
        </h4>
        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
          Transparência da Escolha
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {orcamentos.map((orc) => {
          const isSelected = orc.selecionado;
          return (
            <div
              key={orc.id}
              className={`p-4 rounded-2xl border transition-all relative ${
                isSelected
                  ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ORÇAMENTO ESCOLHIDO
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    {orc.empresa}
                    <a
                      href={orc.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-xs font-bold inline-flex items-center gap-0.5 hover:underline"
                      title="Visitar site oficial da empresa"
                    >
                      Site <ExternalLink className="w-3 h-3" />
                    </a>
                  </h5>
                  {orc.cnpj && (
                    <p className="text-[10px] text-slate-500 font-mono">CNPJ: {orc.cnpj}</p>
                  )}
                </div>

                <div className="text-left sm:text-right mt-1 sm:mt-0">
                  <div className="text-base font-extrabold text-slate-900">
                    R$ {orc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Prazo: <span className="text-slate-800 font-bold">{orc.prazoDias} dias úteis</span>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-2 font-medium">
                {orc.descricao}
              </p>

              {isAdmin && !isSelected && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => selecionarOrcamento(reparoId, orc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all active:scale-95 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Aprovar Este Orçamento
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
