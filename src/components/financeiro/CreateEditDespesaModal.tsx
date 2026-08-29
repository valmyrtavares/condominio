import React, { useState, useEffect } from 'react';
import { DespesaItem } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { X, TrendingDown, DollarSign, Calendar, Building2, FileText, Layers, MessageSquare, Plus, Paperclip, Upload } from 'lucide-react';

interface CreateEditDespesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mesAno: string;
  despesaToEdit?: DespesaItem | null;
}

export const CreateEditDespesaModal: React.FC<CreateEditDespesaModalProps> = ({
  isOpen,
  onClose,
  mesAno,
  despesaToEdit
}) => {
  const { 
    categoriasDespesa, 
    adicionarCategoriaDespesa, 
    adicionarDespesa, 
    editarDespesa,
    reparos 
  } = useCondo();

  const [titulo, setTitulo] = useState(despesaToEdit?.titulo || despesaToEdit?.descricao || '');
  const [categoria, setCategoria] = useState(despesaToEdit?.categoria || categoriasDespesa[0] || 'Manutenção');
  const [novaCategoriaInput, setNovaCategoriaInput] = useState('');
  const [isCriandoNovaCategoria, setIsCriandoNovaCategoria] = useState(false);
  const [fornecedor, setFornecedor] = useState(despesaToEdit?.fornecedor || '');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState(despesaToEdit?.dataVencimento || despesaToEdit?.data || new Date().toLocaleDateString('pt-BR'));
  const [parcelas, setParcelas] = useState(despesaToEdit?.parcelas || '1/1');
  const [comentario, setComentario] = useState(despesaToEdit?.comentario || '');
  const [comprovanteUrl, setComprovanteUrl] = useState(despesaToEdit?.comprovanteUrl || despesaToEdit?.notaFiscalUrl || '');
  const [reparoId, setReparoId] = useState(despesaToEdit?.reparoId || '');

  // Atualiza todos os campos sempre que despesaToEdit ou modal abrir
  useEffect(() => {
    if (despesaToEdit) {
      setTitulo(despesaToEdit.titulo || despesaToEdit.descricao || '');
      setCategoria(despesaToEdit.categoria || categoriasDespesa[0] || 'Manutenção');
      setIsCriandoNovaCategoria(false);
      setNovaCategoriaInput('');
      setFornecedor(despesaToEdit.fornecedor || '');
      
      const numVal = Number(despesaToEdit.valor) || 0;
      setValor(
        numVal > 0 
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numVal) 
          : ''
      );

      setDataVencimento(despesaToEdit.dataVencimento || despesaToEdit.data || new Date().toLocaleDateString('pt-BR'));
      setParcelas(despesaToEdit.parcelas || '1/1');
      setComentario(despesaToEdit.comentario || '');
      setComprovanteUrl(despesaToEdit.comprovanteUrl || despesaToEdit.notaFiscalUrl || '');
      setReparoId(despesaToEdit.reparoId || '');
    } else {
      setTitulo('');
      setCategoria(categoriasDespesa[0] || 'Manutenção');
      setIsCriandoNovaCategoria(false);
      setNovaCategoriaInput('');
      setFornecedor('');
      setValor('');
      setDataVencimento(new Date().toLocaleDateString('pt-BR'));
      setParcelas('1/1');
      setComentario('');
      setComprovanteUrl('');
      setReparoId('');
    }
  }, [despesaToEdit, isOpen, categoriasDespesa]);

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
      alert('Por favor, informe o título da despesa/saída.');
      return;
    }

    const valorNum = parseCurrencyInput(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Por favor, informe um valor válido para a saída.');
      return;
    }

    let catFinal = categoria;
    if (isCriandoNovaCategoria && novaCategoriaInput.trim()) {
      adicionarCategoriaDespesa(novaCategoriaInput.trim());
      catFinal = novaCategoriaInput.trim();
    }

    const dadosDespesa: Omit<DespesaItem, 'id'> = {
      titulo: titulo.trim(),
      descricao: titulo.trim(),
      categoria: catFinal,
      fornecedor: fornecedor.trim() || 'Prestador de Serviço Geral',
      valor: valorNum,
      data: dataVencimento,
      dataVencimento: dataVencimento,
      parcelas: parcelas.trim() || '1/1',
      comentario: comentario.trim() || undefined,
      comprovanteUrl: comprovanteUrl.trim() || undefined,
      notaFiscalUrl: comprovanteUrl.trim() || undefined,
      notaFiscalNome: comprovanteUrl.trim() ? `Nota_Fiscal_${titulo.trim().slice(0, 15)}.pdf` : undefined,
      reparoId: reparoId.trim() || undefined
    };

    if (despesaToEdit) {
      editarDespesa(mesAno, despesaToEdit.id, dadosDespesa);
      alert('Saída financeira atualizada com sucesso!');
    } else {
      adicionarDespesa(mesAno, dadosDespesa);
      alert('Nova saída financeira cadastrada com sucesso!');
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
      <div className="bg-white border border-rose-200 text-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto max-h-[calc(100vh-100px)] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 bg-rose-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500 text-white font-black shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                {despesaToEdit ? 'Editar Saída de Dinheiro' : 'Nova Saída (Despesa)'}
              </h3>
              <p className="text-xs text-rose-900 font-semibold">
                Mês de Referência: <b>{mesAno}</b>
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Título da Saída */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Título da Saída / Descrição do Pagamento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Manutenção Preventiva do Motor do Portão"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Categoria */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Categoria da Despesa *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCriandoNovaCategoria(!isCriandoNovaCategoria)}
                  className="text-[10px] text-rose-700 hover:text-rose-900 font-black flex items-center gap-0.5 cursor-pointer underline"
                >
                  <Plus className="w-3 h-3" /> {isCriandoNovaCategoria ? 'Usar Existente' : 'Nova Categoria'}
                </button>
              </div>

              {!isCriandoNovaCategoria ? (
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs cursor-pointer"
                >
                  {categoriasDespesa.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Nome da nova categoria..."
                  value={novaCategoriaInput}
                  onChange={(e) => setNovaCategoriaInput(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                />
              )}
            </div>

            {/* Fornecedor / Favorecido */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Fornecedor / Favorecido *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: ENEL, SABESP, Elevadores Atlas, etc."
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                />
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Valor com máscara monetária */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Valor da Saída (R$) *
              </label>
              <input
                type="text"
                required
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e) => setValor(formatCurrencyInput(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-rose-950 font-black focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
              />
            </div>

            {/* Data de Vencimento / Pagamento */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Data de Vencimento / Pagamento *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="DD/MM/AAAA"
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Quantidade de Parcelas (ex: 2/6, 3/6) */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Parcela / Total de Parcelas (ex: 2/6) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 1/1, 2/6, 3/12..."
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  list="parcelas-sugestoes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                />
                <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <datalist id="parcelas-sugestoes">
                  {parcelasSugeridas.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Ordem de Reparo Vinculada (Opcional) */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Vincular a Reparo (Opcional)
              </label>
              <select
                value={reparoId}
                onChange={(e) => setReparoId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs cursor-pointer"
              >
                <option value="">Nenhum reparo vinculado</option>
                {reparos.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    #{rep.id} - {rep.titulo.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comentário / Observações */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              Comentário / Detalhes Adicionais
            </label>
            <textarea
              rows={2}
              placeholder="Descreva observações sobre a prestação de serviços, termos de garantia ou detalhes da cobrança..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-rose-500 resize-none shadow-xs"
            />
          </div>

          {/* Anexo de Nota Fiscal / Comprovante */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-rose-950 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-rose-700" />
                Nota Fiscal / Comprovante de Pagamento
              </span>
              <span className="text-[10px] text-rose-800 font-bold">Link de imagem ou PDF</span>
            </div>
            <input
              type="text"
              placeholder="https://exemplo.com/nota-fiscal.pdf ou URL de imagem..."
              value={comprovanteUrl}
              onChange={(e) => setComprovanteUrl(e.target.value)}
              className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500 shadow-xs"
            />
            <p className="text-[10px] text-slate-500">
              Moradores e conselheiros poderão abrir e visualizar a Nota Fiscal / DANFE autenticada com 1 clique.
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{despesaToEdit ? 'Salvar Alterações' : 'Cadastrar Saída'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
