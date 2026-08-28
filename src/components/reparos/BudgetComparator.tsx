import React from 'react';
import { Orcamento } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { CheckCircle, ExternalLink, ShieldCheck, DollarSign, FileText } from 'lucide-react';

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
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-700" />
          Cotações Concorrentes & Orçamentos ({orcamentos.length})
        </h4>
        <span className="text-[10px] text-slate-800 bg-white/80 px-2 py-0.5 rounded-md border border-slate-300 font-bold shadow-2xs">
          Transparência Pública
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
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/30 shadow-md'
                  : 'bg-white/80 border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ORÇAMENTO ESCOLHIDO
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-950 flex items-center gap-2 flex-wrap">
                    {orc.empresa}
                    {orc.siteUrl && (
                      <a
                        href={orc.siteUrl.startsWith('http') ? orc.siteUrl : `https://${orc.siteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:text-indigo-800 text-xs font-bold inline-flex items-center gap-0.5 hover:underline"
                        title="Visitar site oficial da empresa"
                      >
                        Site <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </h5>
                  {orc.cnpj && (
                    <p className="text-[10px] text-slate-600 font-mono font-semibold">CNPJ: {orc.cnpj}</p>
                  )}
                </div>

                <div className="text-left sm:text-right mt-1 sm:mt-0">
                  <div className="text-base font-black text-slate-950">
                    R$ {orc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    Prazo de Entrega: <span className="text-slate-950 font-bold">{orc.prazoDias} dias úteis</span>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-800 leading-relaxed border-t border-slate-200/80 pt-2 font-medium">
                {orc.descricao}
              </p>

              {/* Documento em Anexo */}
              <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 flex-wrap">
                {orc.documentoUrl ? (
                  <a
                    href={orc.documentoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black transition-all shadow-2xs hover:underline cursor-pointer"
                    title="Abrir proposta técnica / documento em PDF para conferência"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{orc.documentoNome || 'Ver Documento da Proposta (PDF)'}</span>
                    <ExternalLink className="w-3 h-3 text-indigo-500 shrink-0" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-500 italic">
                    Proposta verbal / digitalizada sem arquivo anexado
                  </span>
                )}

                {isAdmin && !isSelected && (
                  <button
                    onClick={() => selecionarOrcamento(reparoId, orc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer ml-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Aprovar Este Orçamento
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
