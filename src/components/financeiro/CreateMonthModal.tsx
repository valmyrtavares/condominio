import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { X, Calendar, Plus, Check } from 'lucide-react';

interface CreateMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCreatedMonth?: (mesAno: string) => void;
}

export const CreateMonthModal: React.FC<CreateMonthModalProps> = ({
  isOpen,
  onClose,
  onSelectCreatedMonth
}) => {
  const { mesesPrestacao, adicionarMesPrestacao } = useCondo();

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const anos = ['2025', '2026', '2027', '2028'];

  const [mesSelecionado, setMesSelecionado] = useState(mesesNomes[new Date().getMonth()]);
  const [anoSelecionado, setAnoSelecionado] = useState('2026');

  if (!isOpen) return null;

  const mesAnoFormatado = `${mesSelecionado} / ${anoSelecionado}`;
  const jaExiste = Boolean(mesesPrestacao[mesAnoFormatado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jaExiste) {
      alert(`O mês de "${mesAnoFormatado}" já está cadastrado.`);
      return;
    }

    adicionarMesPrestacao(mesAnoFormatado);
    if (onSelectCreatedMonth) {
      onSelectCreatedMonth(mesAnoFormatado);
    }
    alert(`Mês de prestação de contas "${mesAnoFormatado}" criado com sucesso!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">Novo Mês Financeiro</h3>
              <p className="text-xs text-slate-500 font-medium">Abrir novo ciclo de prestação de contas</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Mês
              </label>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-amber-500 shadow-xs cursor-pointer"
              >
                {mesesNomes.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Ano
              </label>
              <select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-amber-500 shadow-xs cursor-pointer"
              >
                {anos.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Identificador do Novo Mês</span>
            <strong className="text-base font-black text-amber-950 block">{mesAnoFormatado}</strong>
            {jaExiste && (
              <span className="text-[11px] font-bold text-rose-600 block">
                ⚠️ Este mês já consta nos registros.
              </span>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={jaExiste}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black uppercase shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Mês</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
