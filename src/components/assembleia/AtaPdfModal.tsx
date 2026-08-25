import React from 'react';
import { Assembleia } from '../../types';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Building, 
  Scale, 
  Users, 
  Check, 
  XCircle 
} from 'lucide-react';

interface AtaPdfModalProps {
  assembleia: Assembleia;
  onClose: () => void;
}

export const AtaPdfModal: React.FC<AtaPdfModalProps> = ({ assembleia, onClose }) => {
  const ata = assembleia.ata;

  if (!ata) return null;

  const handlePrint = () => {
    window.print();
  };

  const hashDigital = `SHA256: 4f8a9b2c3d1e7f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20 pb-24 sm:py-6 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-300 text-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-170px)] sm:max-h-[85vh] my-auto">
        
        {/* Header Toolbar do Visualizador PDF */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white">
                Ata Oficial Registrada em Cartório (PDF)
              </h3>
              <p className="text-[10px] text-emerald-300 font-mono">
                {ata.numeroAta} • Registro Cartorial Homologado
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
              onClick={() => alert(`Download do arquivo ${ata.numeroAta}.pdf iniciado com sucesso!`)}
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

        {/* Folha do PDF Oficial (Estilo Livro de Registro e Cartório) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 bg-white flex-1 font-serif text-xs leading-relaxed text-slate-900">
          
          {/* Cabeçalho do Cartório / Brasão */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="inline-flex p-2 rounded-full bg-slate-100 border border-slate-300 mb-1">
              <Scale className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-[10px] uppercase font-sans font-bold text-slate-500 tracking-wider block">
              República Federativa do Brasil • Estado de São Paulo
            </span>
            <h4 className="text-sm sm:text-base font-black uppercase text-slate-950 font-sans tracking-tight">
              Ata da Assembleia Geral {assembleia.tipo.toUpperCase()}
            </h4>
            <strong className="text-xs font-sans text-slate-800 block">
              Condomínio Residencial Jardim Paulista • CNPJ: 02.441.888/0001-90
            </strong>
          </div>

          {/* Dados de Registro e Mesa Diretora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-sans text-[11px]">
            <div className="space-y-1">
              <p><strong className="text-slate-900">Número da Ata:</strong> <span className="font-mono">{ata.numeroAta}</span></p>
              <p><strong className="text-slate-900">Data de Realização:</strong> {assembleia.dataHora}</p>
              <p><strong className="text-slate-900">Local da Sessão:</strong> {assembleia.local}</p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-slate-900">Presidente da Mesa:</strong> {ata.presidenteMesa}</p>
              <p><strong className="text-slate-900">Secretária da Mesa:</strong> {ata.secretarioMesa}</p>
              {ata.registroCartorio && (
                <p className="text-emerald-800 font-bold">
                  ✓ {ata.registroCartorio}
                </p>
              )}
            </div>
          </div>

          {/* Deliberações da Ordem do Dia (Checks) */}
          <div className="space-y-2 font-sans">
            <h5 className="font-black text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
              Pautas Deliberadas & Resultado da Votação
            </h5>
            <div className="space-y-2">
              {assembleia.pautas.map((pauta, idx) => (
                <div 
                  key={pauta.id}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    pauta.aprovada === true 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : pauta.aprovada === false
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {pauta.aprovada === true && (
                      <div className="p-1 rounded-full bg-emerald-600 text-white">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    {pauta.aprovada === false && (
                      <div className="p-1 rounded-full bg-rose-600 text-white">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <strong className="text-xs text-slate-950 font-bold block">
                      {idx + 1}. {pauta.titulo}
                    </strong>
                    <p className="text-[11px] text-slate-600 font-normal">
                      {pauta.descricao}
                    </p>
                    {pauta.resultadoVotacao && (
                      <span className={`text-[10px] font-black uppercase inline-block mt-1 px-2 py-0.5 rounded ${
                        pauta.aprovada 
                          ? 'bg-emerald-200 text-emerald-950' 
                          : 'bg-rose-200 text-rose-950'
                      }`}>
                        {pauta.resultadoVotacao}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Texto Lavrado Completo */}
          <div className="space-y-2">
            <h5 className="font-sans font-black text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
              Transcrição da Ata Lavrada
            </h5>
            <p className="text-justify text-xs leading-relaxed text-slate-800 indent-6">
              {ata.textoCompleto}
            </p>
          </div>

          {/* Resumo das Decisões */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-sans space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-900 block">
              Síntese & Resumo do Acordo:
            </span>
            <p className="text-[11px] font-semibold text-slate-900">
              {ata.resumoDecisoes}
            </p>
          </div>

          {/* Assinaturas Digitais e Validação */}
          <div className="border-t-2 border-slate-900 pt-4 font-sans space-y-3">
            <div className="grid grid-cols-2 gap-4 text-center text-[10px]">
              <div className="border-t border-slate-400 pt-1">
                <strong className="block text-slate-900">{ata.presidenteMesa}</strong>
                <span className="text-slate-500">Presidente da Assembleia</span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <strong className="block text-slate-900">{ata.secretarioMesa}</strong>
                <span className="text-slate-500">Secretária da Sessão</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block text-[11px]">
                    Documento Assinado Digitalmente com Certificação ICP-Brasil
                  </span>
                  <span className="font-mono text-[9px] text-slate-600 block truncate max-w-xs">
                    {hashDigital}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                <QrCode className="w-4 h-4 text-slate-700" />
                <span className="text-[9px] font-mono font-bold text-slate-700">Autenticidade Verificada</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-medium font-sans">
            Cópia fiel arquivada no livro de atas e registro de títulos
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors font-sans"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
