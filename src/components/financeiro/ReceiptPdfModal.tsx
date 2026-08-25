import React from 'react';
import { DespesaItem, ReceitaItem } from '../../types';
import { X, FileText, Download, Printer, CheckCircle2, ShieldCheck, QrCode, Building, ExternalLink } from 'lucide-react';

interface ReceiptPdfModalProps {
  item: DespesaItem | ReceitaItem;
  tipo: 'despesa' | 'receita';
  onClose: () => void;
}

export const ReceiptPdfModal: React.FC<ReceiptPdfModalProps> = ({ item, tipo, onClose }) => {
  const isDespesa = tipo === 'despesa';
  const despesa = isDespesa ? (item as DespesaItem) : null;
  const receita = !isDespesa ? (item as ReceitaItem) : null;

  const handlePrint = () => {
    window.print();
  };

  const numeroDocumento = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
  const chaveAcesso = `3526 0804 5678 9012 3456 5500 1000 ${Math.floor(100000 + Math.random() * 900000)} 1234 5678`;
  const autenticacaoBancaria = `AUT.BANC.BRADESCO.${item.id.toUpperCase()}.${Date.now().toString().slice(-8)}`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20 pb-24 sm:py-6 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-300 text-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-170px)] sm:max-h-[85vh] my-auto">
        
        {/* Header Toolbar do Visualizador PDF */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white">
                {isDespesa ? 'Documento Fiscal / Nota Fiscal Eletrônica (NF-e)' : 'Comprovante de Entrada / Recibo Bancário'}
              </h3>
              <p className="text-[10px] text-amber-300/90 font-mono">
                {numeroDocumento} • PDF Autenticado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Download do arquivo ${numeroDocumento}.pdf iniciado com sucesso!`)}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Baixar PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Folha do PDF (Estilo Documento Oficial Impresso / DANFE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-white flex-1 font-sans text-xs">
          
          {/* Topo do DANFE */}
          <div className="border-2 border-slate-900 p-3.5 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Documento Auxiliar da Nota Fiscal</span>
                <h4 className="text-sm sm:text-base font-black text-slate-950 tracking-tight">
                  {isDespesa ? despesa?.fornecedor : 'Condomínio Residencial Jardim Paulista'}
                </h4>
                <p className="text-[10px] text-slate-600">
                  {isDespesa ? 'CNPJ: 14.823.941/0001-52 • Inscrição Estadual: 112.456.789.110' : 'CNPJ: 02.441.888/0001-90 • Condomínio Edilício'}
                </p>
              </div>

              <div className="text-right shrink-0 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Nº Documento</span>
                <strong className="text-xs font-mono font-black text-slate-950">{numeroDocumento}</strong>
                <span className="text-[9px] text-slate-500 block mt-0.5">Série 001</span>
              </div>
            </div>

            {/* Chave de Acesso */}
            <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] font-mono flex items-center justify-between">
              <span className="text-slate-500 font-bold">Chave de Acesso:</span>
              <span className="font-bold text-slate-800 text-[10px] tracking-wider">{chaveAcesso}</span>
            </div>
          </div>

          {/* Dados do Pagador e Favorecido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-300 p-3 rounded-xl bg-slate-50/50">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                {isDespesa ? 'Tomador / Pagador:' : 'Beneficiário / Recebedor:'}
              </span>
              <strong className="text-slate-950 font-bold block text-xs">
                Condomínio Residencial Jardim Paulista
              </strong>
              <p className="text-[10px] text-slate-600">
                Av. Paulista, 1842 - Bela Vista, São Paulo - SP
              </p>
              <p className="text-[10px] text-slate-600 font-mono">
                CNPJ: 02.441.888/0001-90
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                {isDespesa ? 'Prestador / Fornecedor:' : 'Origem do Recurso:'}
              </span>
              <strong className="text-slate-950 font-bold block text-xs">
                {isDespesa ? despesa?.fornecedor : receita?.origem}
              </strong>
              <p className="text-[10px] text-slate-600">
                Categoria: <span className="font-semibold text-slate-800">{item.categoria}</span>
              </p>
              <p className="text-[10px] text-slate-600">
                Data de Emissão / Liquidação: <strong className="text-slate-900">{item.data}</strong>
              </p>
            </div>
          </div>

          {/* Discriminação do Serviço / Produto */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 font-extrabold text-[10px] uppercase text-slate-700">
              Discriminação dos Serviços e Valores Faturados
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                {item.descricao}
              </p>
              <div className="text-[10px] text-slate-500 italic">
                {isDespesa 
                  ? 'Prestação de serviços aprovada pela sindicância com retenção de impostos (ISS, PIS/COFINS/CSLL) conforme legislação vigente.' 
                  : 'Arrecadação condominial via conciliação bancária automática com repasse direto para a conta corrente do condomínio.'}
              </div>
            </div>
            
            {/* Totalizador */}
            <div className="bg-slate-50 p-3 border-t border-slate-300 flex items-center justify-between">
              <span className="font-black text-xs text-slate-700 uppercase">
                {isDespesa ? 'Valor Total Pago Líquido:' : 'Valor Total Arrecadado:'}
              </span>
              <span className={`text-base font-black font-mono ${isDespesa ? 'text-rose-800' : 'text-emerald-800'}`}>
                R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Autenticação Bancária & QR Code */}
          <div className="p-3 rounded-xl border border-dashed border-emerald-400/80 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-950 block text-xs">
                  Pagamento / Recebimento Liquidado e Conciliado
                </span>
                <span className="font-mono text-[9px] text-slate-600 block">
                  {autenticacaoBancaria}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shrink-0">
              <QrCode className="w-4 h-4 text-slate-700" />
              <span className="text-[9px] font-mono font-bold text-slate-700">Comprovante Fiscal Digital</span>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-medium">
            Arquivo verificado pela auditoria do condomínio
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
