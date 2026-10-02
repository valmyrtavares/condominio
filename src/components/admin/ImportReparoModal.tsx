import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { TipoBenfeitoria, Reparo } from '../../types';
import { 
  Download, 
  X, 
  Wrench, 
  Calendar, 
  User, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  FileText,
  Building2,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { StatusBadge } from '../layout/StatusBadge';

interface ImportReparoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReparoId?: string | null;
  onSuccessImport?: (benfeitoriaId: string) => void;
}

export const ImportReparoModal: React.FC<ImportReparoModalProps> = ({
  isOpen,
  onClose,
  initialReparoId,
  onSuccessImport
}) => {
  const { reparos, importarReparoParaBenfeitoria, navigateToBenfeitoria } = useCondo();

  // Filter repairs that are not migrated yet
  const elegiveis = reparos.filter(rep => !rep.migradoParaBenfeitoriaId);

  const [selectedReparoId, setSelectedReparoId] = useState<string>('');
  
  // Pre-filled form states
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [tipo, setTipo] = useState<TipoBenfeitoria>('Grande Reparo & Manutenção');
  const [descricao, setDescricao] = useState('');
  const [impactoGestao, setImpactoGestao] = useState('');
  const [investimento, setInvestimento] = useState<string>('');
  const [regrasUso, setRegrasUso] = useState('');

  const [isImporting, setIsImporting] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  // Selected repair object
  const currentReparo = elegiveis.find(r => r.id === selectedReparoId) || (initialReparoId ? elegiveis.find(r => r.id === initialReparoId) : elegiveis[0]);

  useEffect(() => {
    if (initialReparoId && elegiveis.some(r => r.id === initialReparoId)) {
      setSelectedReparoId(initialReparoId);
    } else if (elegiveis.length > 0) {
      setSelectedReparoId(elegiveis[0].id);
    } else {
      setSelectedReparoId('');
    }
  }, [initialReparoId, isOpen, reparos]);

  // Update pre-filled fields when selected repair changes
  useEffect(() => {
    if (currentReparo) {
      setTitulo(currentReparo.titulo || '');
      setSubtitulo(`Importado do Módulo de Reparos (${currentReparo.categoria})`);
      setTipo('Grande Reparo & Manutenção');
      setDescricao(currentReparo.descricao || '');
      setImpactoGestao(`Conserto estrutural de grande porte derivado do Módulo de Reparos (${currentReparo.porte} Porte). Solicitante original: ${currentReparo.solicitanteNome}.`);
      
      const valorBase = currentReparo.valorFinal || (currentReparo.orcamentos && currentReparo.orcamentos[0] ? currentReparo.orcamentos[0].valor : 0);
      setInvestimento(valorBase > 0 ? String(valorBase) : '');
      setRegrasUso('Acompanhe a transparência dos orçamentos, votações e diário de obra nesta seção.');
    } else {
      setTitulo('');
      setSubtitulo('');
      setDescricao('');
      setImpactoGestao('');
      setInvestimento('');
      setRegrasUso('');
    }
    setErroMsg('');
  }, [selectedReparoId, currentReparo]);

  if (!isOpen) return null;

  const handleConfirmImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReparo) {
      setErroMsg('Nenhum reparo selecionado para importação.');
      return;
    }

    if (!titulo.trim()) {
      setErroMsg('Por favor, informe o título da benfeitoria.');
      return;
    }

    setIsImporting(true);
    setErroMsg('');

    try {
      const res = await importarReparoParaBenfeitoria(currentReparo.id);
      if (res.success && res.benfeitoriaId) {
        onClose();
        if (onSuccessImport) {
          onSuccessImport(res.benfeitoriaId);
        }
      } else {
        setErroMsg(res.error || 'Erro ao importar reparo.');
      }
    } catch (err: any) {
      console.error(err);
      setErroMsg('Ocorreu um erro durante a importação.');
    } finally {
      setIsImporting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-amber-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-5 text-slate-950 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 text-amber-400 shadow-md">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 leading-tight">
                Importar Item do Módulo de Reparos
              </h3>
              <p className="text-xs font-bold text-slate-900/90 mt-0.5 max-w-lg">
                Selecione o reparo e revise as informações preenchidas para publicá-lo no fluxo de Benfeitorias & Obras da Gestão.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmImport} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Dropdown de Seleção de Reparo Disponível */}
          <div className="space-y-1.5 bg-amber-500/10 border border-amber-300 p-3.5 rounded-2xl">
            <label className="text-xs font-extrabold uppercase text-amber-950 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-600" /> Selecionar Reparo Disponível no Condomínio:
            </label>
            <select
              value={selectedReparoId}
              onChange={(e) => setSelectedReparoId(e.target.value)}
              className="w-full bg-white border border-amber-300 focus:border-amber-500 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-950 focus:outline-none cursor-pointer shadow-2xs"
            >
              {elegiveis.length === 0 ? (
                <option value="">Nenhum reparo elegível para importação no momento</option>
              ) : (
                elegiveis.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    [{rep.categoria}] {rep.titulo} • Solicitado por: {rep.solicitanteNome} ({rep.solicitanteUnidade})
                  </option>
                ))
              )}
            </select>
          </div>

          {currentReparo ? (
            <>
              {/* Highlight Card: Dono do Pedido de Reparo */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                      Dono da Solicitação Original
                    </span>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {currentReparo.solicitanteNome}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Unidade: <strong className="text-white">{currentReparo.solicitanteUnidade}</strong> • Solicitado em: {currentReparo.dataSolicitacao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    Porte {currentReparo.porte}
                  </span>
                  <StatusBadge status={currentReparo.status} />
                </div>
              </div>

              {/* Formulário Estilo Benfeitoria (Preenchido Automaticamente) */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Campos Preenchidos para a Benfeitoria & Obra
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700">Título da Benfeitoria:</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700">Subtítulo / Origem:</label>
                    <input
                      type="text"
                      value={subtitulo}
                      onChange={(e) => setSubtitulo(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-700">Descrição Completa:</label>
                  <textarea
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-950 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700">Impacto na Gestão:</label>
                    <input
                      type="text"
                      value={impactoGestao}
                      onChange={(e) => setImpactoGestao(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700">Investimento Estimado (R$):</label>
                    <input
                      type="text"
                      value={investimento}
                      onChange={(e) => setInvestimento(e.target.value)}
                      placeholder="Ex: 4200.00"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-950 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Exibição dos orçamentos vinculados ao reparo que serão importados */}
                {currentReparo.orcamentos && currentReparo.orcamentos.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-950 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                      Orçamentos Vinculados ({currentReparo.orcamentos.length} disponíveis):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentReparo.orcamentos.map(o => (
                        <div key={o.id} className="bg-white p-2 rounded-lg border border-emerald-200 text-xs">
                          <span className="font-extrabold text-slate-950 block">{o.empresa}</span>
                          <span className="text-emerald-700 font-black">R$ {o.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span className="text-slate-500 text-[10px] block">Prazo: {o.prazoDias} dias</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-700">Não há reparos pendentes para importação no momento.</p>
            </div>
          )}

          {erroMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-950 text-xs font-bold rounded-xl">
              {erroMsg}
            </div>
          )}

          {/* Footer Form Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isImporting || !currentReparo}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Importando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar & Importar Benfeitoria</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
