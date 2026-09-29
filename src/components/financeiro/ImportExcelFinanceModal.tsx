import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  TrendingDown, 
  TrendingUp,
  Info,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useCondo } from '../../context/CondoContext';
import { DespesaItem, ReceitaItem } from '../../types';
import { 
  downloadModeloSaidasExcel, 
  downloadModeloSaidasCSV,
  downloadModeloEntradasExcel, 
  downloadModeloEntradasCSV,
  parsearExcelFinanceiro,
  formatCurrency 
} from '../../utils/excelFinanceUtils';

const MESES_NOMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const ANOS_LISTA = ['2025', '2026', '2027', '2028', '2029', '2030'];

interface ImportExcelFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMonth?: string;
}

export const ImportExcelFinanceModal: React.FC<ImportExcelFinanceModalProps> = ({
  isOpen,
  onClose,
  defaultMonth
}) => {
  const { 
    mesesPrestacao, 
    adicionarMesPrestacao, 
    adicionarDespesa, 
    adicionarReceita,
    importarLancamentosEmLote 
  } = useCondo();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableMonths = Object.keys(mesesPrestacao).length > 0 
    ? Object.keys(mesesPrestacao) 
    : ['Setembro / 2026', 'Outubro / 2026'];

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [monthError, setMonthError] = useState<string | null>(null);
  const [newMonthName, setNewMonthName] = useState<string>(MESES_NOMES[new Date().getMonth()] || 'Janeiro');
  const [newYearName, setNewYearName] = useState<string>('2026');
  const [isCreatingNewMonth, setIsCreatingNewMonth] = useState<boolean>(false);

  const [tipoImportacao, setTipoImportacao] = useState<'despesas' | 'receitas'>('despesas');
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedItems, setParsedItems] = useState<(Omit<DespesaItem, 'id'> | Omit<ReceitaItem, 'id'>)[]>([]);
  const [parseErrors, setParseErrors] = useState<{ linha: number; mensagem: string }[]>([]);
  const [totalValorCalculado, setTotalValorCalculado] = useState<number>(0);

  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedMonth('');
      setMonthError(null);
      setImportSuccessMessage(null);
      setIsCreatingNewMonth(false);
      setAutoDetectNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateMonth = () => {
    const formattedMonth = `${newMonthName} / ${newYearName}`;
    adicionarMesPrestacao(formattedMonth);
    setSelectedMonth(formattedMonth);
    setMonthError(null);
    setIsCreatingNewMonth(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // Limpar o valor do input para permitir reenviar o mesmo arquivo se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    // Detecção automática de tipo pelo nome do arquivo (ex: Modelo_Prestacao_Contas_ENTRADAS.xlsx)
    const nameLower = file.name.toLowerCase();
    let typeToUse: 'despesas' | 'receitas' = tipoImportacao;

    if (nameLower.includes('entrada') || nameLower.includes('receita')) {
      typeToUse = 'receitas';
      setTipoImportacao('receitas');
      setAutoDetectNotice('Tipo ajustado automaticamente para Entradas (Receitas) com base no nome do arquivo.');
    } else if (nameLower.includes('saida') || nameLower.includes('saída') || nameLower.includes('despesa')) {
      typeToUse = 'despesas';
      setTipoImportacao('despesas');
      setAutoDetectNotice('Tipo ajustado automaticamente para Saídas (Despesas) com base no nome do arquivo.');
    } else {
      setAutoDetectNotice(null);
    }

    setUploadedFile(file);
    setIsParsing(true);
    setImportSuccessMessage(null);
    try {
      const res = await parsearExcelFinanceiro(file, typeToUse);
      setParsedItems(res.validos);
      setParseErrors(res.erros);
      setTotalValorCalculado(res.totalValor);
    } catch (err: any) {
      alert(`Erro ao carregar planilha: ${err.message || err}`);
      setUploadedFile(null);
      setParsedItems([]);
      setParseErrors([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleTypeChange = async (novoTipo: 'despesas' | 'receitas') => {
    setTipoImportacao(novoTipo);
    setAutoDetectNotice(null);
    if (uploadedFile) {
      setIsParsing(true);
      try {
        const res = await parsearExcelFinanceiro(uploadedFile, novoTipo);
        setParsedItems(res.validos);
        setParseErrors(res.erros);
        setTotalValorCalculado(res.totalValor);
      } catch (err: any) {
        alert(`Erro ao recarregar planilha: ${err.message || err}`);
      } finally {
        setIsParsing(false);
      }
    }
  };

  const removeItemFromPreview = (index: number) => {
    const newItems = [...parsedItems];
    const removed = newItems.splice(index, 1)[0];
    setParsedItems(newItems);
    if (removed && removed.valor) {
      setTotalValorCalculado(prev => Math.max(0, prev - removed.valor));
    }
  };

  const handleConfirmImport = () => {
    if (!selectedMonth || selectedMonth.trim() === '') {
      setMonthError('Por favor, selecione o Mês e Ano de referência da planilha antes de confirmar.');
      alert('⚠️ ATENÇÃO AO ADMINISTRADOR:\n\nVocê precisa indicar o Mês de Referência (Mês / Ano) que essa planilha representa antes de realizar a importação.\n\nPor favor, escolha o mês no campo indicado em vermelho.');
      return;
    }

    if (parsedItems.length === 0) return;

    const targetMonth = selectedMonth;

    if (importarLancamentosEmLote) {
      importarLancamentosEmLote(targetMonth, tipoImportacao, parsedItems);
    } else if (tipoImportacao === 'despesas') {
      parsedItems.forEach(item => {
        adicionarDespesa(targetMonth, item as Omit<DespesaItem, 'id'>);
      });
    } else {
      parsedItems.forEach(item => {
        adicionarReceita(targetMonth, item as Omit<ReceitaItem, 'id'>);
      });
    }

    setImportSuccessMessage(`✨ Sucesso! ${parsedItems.length} ${tipoImportacao === 'despesas' ? 'saídas' : 'entradas'} importadas para ${targetMonth}. A planilha anterior dessa mesma categoria foi sobrescrita com sucesso. Total: ${formatCurrency(totalValorCalculado)}`);

    setTimeout(() => {
      setUploadedFile(null);
      setParsedItems([]);
      setParseErrors([]);
      setTotalValorCalculado(0);
    }, 500);
  };

  const resetModal = () => {
    setUploadedFile(null);
    setParsedItems([]);
    setParseErrors([]);
    setTotalValorCalculado(0);
    setImportSuccessMessage(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Input de arquivo Oculto Controlado via Ref (Evita sobreposição de cliques) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] my-auto relative z-10">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Importar Planilha Excel / CSV
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium">
                Alimente o módulo de Prestação de Contas em segundos sem digitação manual.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800">

          {/* Banner Orientação Inteligente para o Admin */}
          <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-amber-950 shadow-2xs">
            <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs leading-relaxed space-y-1">
              <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                💡 Orientação Importante ao Administrador & Síndico
              </h4>
              <p className="font-medium text-amber-950/90">
                Esta interface foi desenvolvida para visualização limpa, amigável e direta pelos <strong>moradores e conselheiros</strong>.
              </p>
              <p className="font-medium text-amber-900">
                <strong>Substituição Automática:</strong> Ao enviar uma nova planilha de <strong>{tipoImportacao === 'despesas' ? 'Saídas' : 'Entradas'}</strong> para o mês selecionado, os lançamentos anteriores dessa mesma fonte/categoria serão <strong>sobrescritos e substituídos</strong> pela nova planilha enviada.
              </p>
            </div>
          </div>

          {/* 1. Mês de Referência & Tipo de Lançamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Seletor de Mês */}
            <div className={`space-y-1.5 p-3.5 rounded-2xl border transition-all ${
              monthError 
                ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-500/30' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar className={`w-4 h-4 ${monthError ? 'text-rose-600' : 'text-emerald-600'}`} />
                  Mês de Referência do Envio *
                </label>
                {monthError && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> Campo Obrigatório
                  </span>
                )}
              </div>

              {!isCreatingNewMonth ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      if (e.target.value) setMonthError(null);
                    }}
                    className={`flex-1 bg-white border rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer shadow-2xs ${
                      monthError 
                        ? 'border-rose-500 text-rose-950 ring-2 ring-rose-500/20' 
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  >
                    <option value="">-- Selecione o Mês / Ano (Obrigatório) --</option>
                    {availableMonths.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewMonth(true)}
                    className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    + Novo Mês
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={newMonthName}
                    onChange={(e) => setNewMonthName(e.target.value)}
                    className="flex-1 min-w-[110px] bg-white border border-emerald-500 rounded-xl px-2.5 py-2 text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    {MESES_NOMES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={newYearName}
                    onChange={(e) => setNewYearName(e.target.value)}
                    className="w-24 bg-white border border-emerald-500 rounded-xl px-2 py-2 text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    {ANOS_LISTA.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleCreateMonth}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewMonth(false)}
                    className="px-2.5 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-all shrink-0 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {monthError && (
                <p className="text-[11px] font-extrabold text-rose-700 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {monthError}
                </p>
              )}
            </div>

            {/* Alternar Saídas vs Entradas */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Tipo de Planilha Enviada *
                </label>
                {autoDetectNotice && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Auto-Detectado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('despesas')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    tipoImportacao === 'despesas'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-sm scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50 hover:text-rose-800'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Saídas (Despesas)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('receitas')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    tipoImportacao === 'receitas'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Entradas (Receitas)</span>
                </button>
              </div>

              {autoDetectNotice && (
                <p className="text-[10px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {autoDetectNotice}
                </p>
              )}
            </div>

          </div>

          {/* 2. Download do Modelo Excel / CSV */}
          <div className="bg-slate-900 text-white p-4.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md relative z-20">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10 shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  Ainda não tem a planilha preenchida?
                </h4>
                <p className="text-[11px] text-slate-300">
                  Baixe o modelo oficial com os cabeçalhos das colunas e linhas de exemplo prontas:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tipoImportacao === 'despesas') downloadModeloSaidasExcel();
                  else downloadModeloEntradasExcel();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Modelo Excel (.XLSX)</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tipoImportacao === 'despesas') downloadModeloSaidasCSV();
                  else downloadModeloEntradasCSV();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Modelo CSV (.CSV)</span>
              </button>
            </div>
          </div>

          {/* 3. Upload Zone (Drag & Drop / Clique) */}
          {!uploadedFile && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center bg-slate-50/70 hover:bg-emerald-50/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-3 pointer-events-none">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Clique aqui para selecionar o arquivo preenchido de {tipoImportacao === 'despesas' ? 'Saídas' : 'Entradas'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Ou arraste a planilha aqui (.XLSX, .XLS ou .CSV)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alert Sucesso */}
          {importSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs font-bold leading-relaxed">
                {importSuccessMessage}
              </div>
            </div>
          )}

          {/* 4. Pré-visualização dos Dados Parsed */}
          {uploadedFile && (
            <div className="space-y-4">
              
              {/* Header do resumo da planilha */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-black">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-950 truncate max-w-xs sm:max-w-md">
                      {uploadedFile.name}
                    </h4>
                    <span className="text-[10px] text-slate-600 font-bold block">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedItems.length} linhas reconhecidas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">
                      Soma Total Calculada
                    </span>
                    <strong className={`text-base font-black ${tipoImportacao === 'despesas' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {formatCurrency(totalValorCalculado)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={resetModal}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                    title="Remover arquivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Erros se houver */}
              {parseErrors.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5 text-xs">
                  <div className="font-extrabold flex items-center gap-1.5 text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Avisos de Validação ({parseErrors.length} linhas ignoradas):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] font-medium text-rose-900/90 pl-1">
                    {parseErrors.map((err, idx) => (
                      <li key={idx}>Linha {err.linha}: {err.mensagem}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabela de Previa de Linhas */}
              {parsedItems.length > 0 ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Título / Descrição</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3">{tipoImportacao === 'despesas' ? 'Fornecedor' : 'Origem'}</th>
                        <th className="p-3">Data</th>
                        <th className="p-3 text-right">Valor</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="p-3 font-extrabold text-slate-900">
                            {item.titulo || item.descricao}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold">
                              {item.categoria}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">
                            {tipoImportacao === 'despesas' 
                              ? (item as Omit<DespesaItem, 'id'>).fornecedor 
                              : (item as Omit<ReceitaItem, 'id'>).origem}
                          </td>
                          <td className="p-3 text-slate-600 whitespace-nowrap">{item.data}</td>
                          <td className="p-3 text-right font-black text-slate-950 whitespace-nowrap">
                            {formatCurrency(item.valor)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItemFromPreview(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Remover linha"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Nenhum lançamento válido encontrado na planilha. Verifique se os cabeçalhos das colunas estão de acordo com o modelo.
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-black transition-all cursor-pointer"
          >
            Fechar
          </button>

          {uploadedFile && parsedItems.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className={`px-6 py-2.5 rounded-xl text-white font-black text-xs uppercase shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                !selectedMonth
                  ? 'bg-amber-600 hover:bg-amber-500 ring-2 ring-amber-400/50'
                  : tipoImportacao === 'despesas'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                Importar {parsedItems.length} {tipoImportacao === 'despesas' ? 'Saídas' : 'Entradas'}
                {selectedMonth ? ` para ${selectedMonth}` : ' (Indique o Mês)'}
              </span>
            </button>
          )}
        </div>

      </div>

    </div>,
    document.body
  );
};
