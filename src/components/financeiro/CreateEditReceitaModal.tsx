import React, { useState, useEffect } from 'react';
import { ReceitaItem } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { X, TrendingUp, DollarSign, Calendar, Landmark, FileText, Layers, MessageSquare, Plus, Paperclip } from 'lucide-react';

interface CreateEditReceitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mesAno: string;
  receitaToEdit?: ReceitaItem | null;
}

export const CreateEditReceitaModal: React.FC<CreateEditReceitaModalProps> = ({
  isOpen,
  onClose,
  mesAno,
  receitaToEdit
}) => {
  const { 
    categoriasReceita, 
    adicionarCategoriaReceita, 
    adicionarReceita, 
    editarReceita 
  } = useCondo();

  const [titulo, setTitulo] = useState(receitaToEdit?.titulo || receitaToEdit?.descricao || '');
  const [categoria, setCategoria] = useState(receitaToEdit?.categoria || categoriasReceita[0] || 'Taxa Condominial');
  const [novaCategoriaInput, setNovaCategoriaInput] = useState('');
  const [isCriandoNovaCategoria, setIsCriandoNovaCategoria] = useState(false);
  const [origem, setOrigem] = useState(receitaToEdit?.origem || '');
  const [valor, setValor] = useState('');
  const [dataRecebimento, setDataRecebimento] = useState(receitaToEdit?.dataVencimento || receitaToEdit?.data || new Date().toLocaleDateString('pt-BR'));
  const [parcelas, setParcelas] = useState(receitaToEdit?.parcelas || '1/1');
  const [comentario, setComentario] = useState(receitaToEdit?.comentario || '');
  const [comprovanteUrl, setComprovanteUrl] = useState(receitaToEdit?.comprovanteUrl || receitaToEdit?.notaFiscalUrl || '');

  // Atualiza todos os campos sempre que receitaToEdit ou modal abrir
  useEffect(() => {
    if (receitaToEdit) {
      setTitulo(receitaToEdit.titulo || receitaToEdit.descricao || '');
      setCategoria(receitaToEdit.categoria || categoriasReceita[0] || 'Taxa Condominial');
      setIsCriandoNovaCategoria(false);
      setNovaCategoriaInput('');
      setOrigem(receitaToEdit.origem || '');
      
      const numVal = Number(receitaToEdit.valor) || 0;
      setValor(
        numVal > 0 
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numVal) 
          : ''
      );

      setDataRecebimento(receitaToEdit.dataVencimento || receitaToEdit.data || new Date().toLocaleDateString('pt-BR'));
      setParcelas(receitaToEdit.parcelas || '1/1');
      setComentario(receitaToEdit.comentario || '');
      setComprovanteUrl(receitaToEdit.comprovanteUrl || receitaToEdit.notaFiscalUrl || '');
    } else {
      setTitulo('');
      setCategoria(categoriasReceita[0] || 'Taxa Condominial');
      setIsCriandoNovaCategoria(false);
      setNovaCategoriaInput('');
      setOrigem('');
      setValor('');
      setDataRecebimento(new Date().toLocaleDateString('pt-BR'));
      setParcelas('1/1');
      setComentario('');
      setComprovanteUrl('');
    }
  }, [receitaToEdit, isOpen, categoriasReceita]);

  if (!isOpen) return null;

  const formatCurrencyInput = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const numberValue = parseInt(digits, 10) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberValue);
  };

  const parseCurrencyInput = (formatted: string): number => {
    const digits = formatted.replace(/\D/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert('Por favor, informe o título da entrada/receita.');
      return;
    }

    const valorNum = parseCurrencyInput(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Por favor, informe um valor válido para a entrada.');
      return;
    }

    let catFinal = categoria;
    if (isCriandoNovaCategoria && novaCategoriaInput.trim()) {
      adicionarCategoriaReceita(novaCategoriaInput.trim());
      catFinal = novaCategoriaInput.trim();
    }

    const dadosReceita: Omit<ReceitaItem, 'id'> = {
      titulo: titulo.trim(),
      descricao: titulo.trim(),
      categoria: catFinal,
      origem: origem.trim() || 'Arrecadação Condominial',
      valor: valorNum,
      data: dataRecebimento,
      dataVencimento: dataRecebimento,
      parcelas: parcelas.trim() || '1/1',
      comentario: comentario.trim() || undefined,
      comprovanteUrl: comprovanteUrl.trim() || undefined,
      notaFiscalUrl: comprovanteUrl.trim() || undefined,
      notaFiscalNome: comprovanteUrl.trim() ? `Recibo_${titulo.trim().slice(0, 15)}.pdf` : undefined
    };

    if (receitaToEdit) {
      editarReceita(mesAno, receitaToEdit.id, dadosReceita);
      alert('Entrada financeira atualizada com sucesso!');
    } else {
      adicionarReceita(mesAno, dadosReceita);
      alert('Nova entrada financeira cadastrada com sucesso!');
    }

    onClose();
  };

  const parcelasSugeridas = [
    '1/1', '1/2', '2/2', '1/3', '2/3', '3/3', '1/4', '2/4', '3/4', '4/4',
    '1/6', '2/6', '3/6', '4/6', '5/6', '6/6',
    '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12', '12/12'
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-emerald-200 text-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto max-h-[calc(100vh-100px)] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-black shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                {receitaToEdit ? 'Editar Entrada de Dinheiro' : 'Nova Entrada (Receita)'}
              </h3>
              <p className="text-xs text-emerald-950 font-semibold">
                Mês de Referência: <b>{mesAno}</b>
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Título da Entrada */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Título da Entrada / Descrição do Recebimento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Arrecadação de Taxa Condominial Ordinária"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Categoria */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Categoria da Receita *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCriandoNovaCategoria(!isCriandoNovaCategoria)}
                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-black flex items-center gap-0.5 cursor-pointer underline"
                >
                  <Plus className="w-3 h-3" /> {isCriandoNovaCategoria ? 'Usar Existente' : 'Nova Categoria'}
                </button>
              </div>

              {!isCriandoNovaCategoria ? (
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  {categoriasReceita.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nome da nova categoria..."
                  value={novaCategoriaInput}
                  onChange={(e) => setNovaCategoriaInput(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
                />
              )}
            </div>

            {/* Origem / Pagador */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Origem do Recurso / Pagador *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Boleto Bradesco, Moradores, Itaú DI, etc."
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
                />
                <Landmark className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Valor com máscara monetária */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Valor da Entrada (R$) *
              </label>
              <input
                type="text"
                required
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e) => setValor(formatCurrencyInput(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-emerald-950 font-black focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
              />
            </div>

            {/* Data de Recebimento */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Data de Recebimento *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="DD/MM/AAAA"
                  value={dataRecebimento}
                  onChange={(e) => setDataRecebimento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Quantidade de Parcelas (ex: 1/1, 2/6) */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Parcela / Total de Parcelas (ex: 1/1) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 1/1, 2/6, 3/12..."
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  list="parcelas-rec-sugestoes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs"
                />
                <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <datalist id="parcelas-rec-sugestoes">
                  {parcelasSugeridas.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Comentário / Observações */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Comentário / Detalhes Adicionais
            </label>
            <textarea
              rows={2}
              placeholder="Descreva detalhes como números de unidades que pagaram adiantado, taxas de reserva de salão, etc..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-emerald-500 resize-none shadow-xs"
            />
          </div>

          {/* Anexo de Recibo / Extrato Bancário */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-950 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                Comprovante Bancário / Recibo Autenticado
              </span>
              <span className="text-[10px] text-emerald-800 font-bold">Link de imagem ou PDF</span>
            </div>
            <input
              type="text"
              placeholder="https://exemplo.com/extrato-recebimento.pdf..."
              value={comprovanteUrl}
              onChange={(e) => setComprovanteUrl(e.target.value)}
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
            />
            <p className="text-[10px] text-slate-500">
              Todos os moradores poderão visualizar o recibo/extrato digital comprovando o recebimento em conta.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{receitaToEdit ? 'Salvar Alterações' : 'Cadastrar Entrada'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
