import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { X, Tag, Plus, Check } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoInicial?: 'despesa' | 'receita';
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  tipoInicial = 'despesa'
}) => {
  const { 
    categoriasDespesa, 
    categoriasReceita, 
    adicionarCategoriaDespesa, 
    adicionarCategoriaReceita 
  } = useCondo();

  const [tipo, setTipo] = useState<'despesa' | 'receita'>(tipoInicial);
  const [nomeCategoria, setNomeCategoria] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nomeTrim = nomeCategoria.trim();
    if (!nomeTrim) {
      alert('Por favor, informe o nome da categoria.');
      return;
    }

    if (tipo === 'despesa') {
      if (categoriasDespesa.includes(nomeTrim)) {
        alert('Esta categoria de saída já existe.');
        return;
      }
      adicionarCategoriaDespesa(nomeTrim);
      alert(`Categoria de Saída "${nomeTrim}" criada com sucesso!`);
    } else {
      if (categoriasReceita.includes(nomeTrim)) {
        alert('Esta categoria de entrada já existe.');
        return;
      }
      adicionarCategoriaReceita(nomeTrim);
      alert(`Categoria de Entrada "${nomeTrim}" criada com sucesso!`);
    }

    setNomeCategoria('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-black shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">Nova Categoria</h3>
              <p className="text-xs text-slate-500 font-medium">Classificação financeira personalizada</p>
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
          
          {/* Tipo de Categoria */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Tipo de Lançamento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipo('despesa')}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                  tipo === 'despesa'
                    ? 'bg-rose-100 text-rose-950 border-rose-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔻 Saída (Despesa)
              </button>
              <button
                type="button"
                onClick={() => setTipo('receita')}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                  tipo === 'receita'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔺 Entrada (Receita)
              </button>
            </div>
          </div>

          {/* Nome da Categoria */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Nome da Nova Categoria *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pintura & Fachada, Manutenção CFTV, etc."
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Lista de Categorias Atuais */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Categorias Existentes de {tipo === 'despesa' ? 'Saída' : 'Entrada'}:
            </span>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
              {(tipo === 'despesa' ? categoriasDespesa : categoriasReceita).map(cat => (
                <span key={cat} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                  {cat}
                </span>
              ))}
            </div>
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Categoria</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
