import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Reclamacao } from '../../types';
import { X, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';

interface TransformToRepairModalProps {
  reclamacao: Reclamacao;
  onClose: () => void;
}

export const TransformToRepairModal: React.FC<TransformToRepairModalProps> = ({ reclamacao, onClose }) => {
  const { transformarEmReparo, setCurrentScreen, setSelectedReparoId } = useCondo();
  const [titulo, setTitulo] = useState(`Reparo: ${reclamacao.titulo}`);
  const [descricao, setDescricao] = useState(reclamacao.descricao);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoReparoId = transformarEmReparo(reclamacao.id, titulo, descricao);
    setSelectedReparoId(novoReparoId);
    onClose();
    setCurrentScreen('reparos');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Transformar em Reparo</h3>
              <p className="text-xs text-slate-500 font-medium">Ação Administrativa de Solução</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-700" /> Vínculo Direto
            </div>
            Esta reclamação mudará o status para <span className="text-amber-950 font-extrabold">Em andamento</span> e os moradores poderão acompanhar as cotações e o status do conserto.
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Título da Ordem de Reparo
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Instruções / Descrição Inicial do Reparo
            </label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              Gerar Reparo & Abrir Cotação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
