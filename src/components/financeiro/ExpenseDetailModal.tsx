import React from 'react';
import { DespesaItem } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { X, FileText, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

interface ExpenseDetailModalProps {
  despesa: DespesaItem;
  onClose: () => void;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ despesa, onClose }) => {
  const { setCurrentScreen, setSelectedReparoId, reparos } = useCondo();

  const linkedRepair = despesa.reparoId ? reparos.find(r => r.id === despesa.reparoId) : null;

  const handleOpenRepair = () => {
    if (despesa.reparoId) {
      setSelectedReparoId(despesa.reparoId);
      setCurrentScreen('reparos');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20 pb-24 sm:py-6 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto max-h-[calc(100vh-170px)] sm:max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Detalhamento da Despesa</h3>
              <p className="text-xs text-slate-500 font-medium">{despesa.categoria}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-extrabold mb-1">Valor Total Lançado</span>
            <span className="text-2xl font-extrabold text-emerald-700">
              R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Data de pagamento: {despesa.data}</div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-extrabold mb-1">Descrição da Despesa:</span>
              <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {despesa.descricao}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block font-extrabold mb-1">Fornecedor / Favorecido:</span>
              <p className="text-slate-900 font-medium flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <Building2 className="w-4 h-4 text-indigo-600" />
                {despesa.fornecedor}
              </p>
            </div>

            {despesa.comprovanteUrl && (
              <div>
                <span className="text-slate-500 block font-extrabold mb-1">Comprovante de Nota Fiscal:</span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-40 shadow-2xs">
                  <img
                    src={despesa.comprovanteUrl}
                    alt="Comprovante fiscal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] text-white font-extrabold flex items-center gap-1.5 drop-shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Nota Fiscal Verificada pela Zeladoria
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Traceability Link to Repair */}
          {linkedRepair ? (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs">
              <div className="font-extrabold text-indigo-950 mb-1 flex items-center justify-between">
                <span>🔗 Despesa Vinculada a Reparo</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200 font-mono font-bold">
                  {linkedRepair.id}
                </span>
              </div>
              <p className="text-slate-700 mb-3 text-[11px] font-medium">
                Esta despesa foi originada do reparo: <span className="font-bold text-slate-900">"{linkedRepair.titulo}"</span>.
              </p>
              <button
                onClick={handleOpenRepair}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all active:scale-95 shadow-sm"
              >
                Abrir Reparo & Ver Linha do Tempo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
              Despesa administrativa recorrente (contrato mensal / utilidades).
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
