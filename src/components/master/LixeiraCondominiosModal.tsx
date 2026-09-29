import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { CondominioLixeiraItem } from '../../services/firebase';
import {
  Archive,
  X,
  RotateCcw,
  Download,
  Trash2,
  Building,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  ShieldCheck,
  FileJson
} from 'lucide-react';

interface LixeiraCondominiosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCondoRestored?: () => void;
}

export const LixeiraCondominiosModal: React.FC<LixeiraCondominiosModalProps> = ({
  isOpen,
  onClose,
  onCondoRestored
}) => {
  const {
    listarCondominiosLixeira,
    restaurarBackupCondominio,
    excluirPermanenteLixeira,
    adicionarCondominio
  } = useCondo();

  const [itens, setItens] = useState<CondominioLixeiraItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const carregarLixeira = async () => {
    setLoading(true);
    try {
      const lista = await listarCondominiosLixeira();
      setItens(lista);
    } catch (err: any) {
      console.error('Erro ao carregar lixeira:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      carregarLixeira();
      setFeedbackMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Restaura o condomínio a partir do snapshot
  const handleRestaurar = async (item: CondominioLixeiraItem) => {
    const confirmou = window.confirm(
      `Deseja realmente restaurar o condomínio "${item.nomeCondominio}" para a lista de condomínios ativos?`
    );
    if (!confirmou) return;

    setActionLoadingId(item.id);
    setFeedbackMsg(null);

    try {
      const snapshot = item.snapshotBackup;
      if (!snapshot) throw new Error('Snapshot de recuperação não encontrado.');

      // 1. Restaura no Firestore (dados do condomínio, subcoleções e usuários)
      await restaurarBackupCondominio(item.condoIdOriginal, snapshot);

      // 2. Remove do cofre de lixeira
      await excluirPermanenteLixeira(item.id);

      setFeedbackMsg({
        tipo: 'sucesso',
        texto: `Condomínio "${item.nomeCondominio}" restaurado com sucesso!`
      });

      await carregarLixeira();
      if (onCondoRestored) onCondoRestored();
    } catch (err: any) {
      console.error('🔥 Erro ao restaurar condomínio:', err);
      setFeedbackMsg({
        tipo: 'erro',
        texto: err.message || 'Erro ao restaurar condomínio.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Baixa o snapshot JSON armazenado no cofre
  const handleBaixarJson = (item: CondominioLixeiraItem) => {
    if (!item.snapshotBackup) {
      alert('Snapshot de backup não disponível.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item.snapshotBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    const slugLimpo = (item.condoIdOriginal || 'condo').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SNAPSHOT-COFRE-${slugLimpo}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Exclusão definitiva do cofre
  const handleExcluirPermanente = async (item: CondominioLixeiraItem) => {
    const confirmou = window.confirm(
      `ATENÇÃO: Deseja excluir permanentemente o registro de "${item.nomeCondominio}" do Cofre de Segurança?\n\nApós esta ação, não será mais possível restaurá-lo pela nuvem.`
    );
    if (!confirmou) return;

    setActionLoadingId(item.id);
    try {
      await excluirPermanenteLixeira(item.id);
      await carregarLixeira();
      setFeedbackMsg({
        tipo: 'sucesso',
        texto: `Registro excluído permanentemente do cofre.`
      });
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'erro',
        texto: err.message || 'Erro ao excluir do cofre.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                Disaster Recovery & Cofre
              </span>
              <h3 className="text-base font-black text-white">
                Cofre / Lixeira de Condomínios ({itens.length})
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className={`p-3 text-xs flex items-center gap-2 border-b ${
            feedbackMsg.tipo === 'sucesso'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}>
            {feedbackMsg.tipo === 'sucesso' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMsg.texto}</span>
          </div>
        )}

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 custom-scrollbar flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs font-bold">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span>Carregando cópias de segurança do cofre...</span>
            </div>
          ) : itens.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-center text-slate-400">
              <ShieldCheck className="w-10 h-10 text-slate-600" />
              <p className="text-sm font-bold text-slate-300">Nenhum condomínio na lixeira</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Quando um condomínio for excluído, uma cópia completa de segurança e snapshot JSON aparecerá automaticamente aqui.
              </p>
            </div>
          ) : (
            itens.map((item) => {
              const isLoading = actionLoadingId === item.id;
              const dataFormatada = new Date(item.excluidoEm).toLocaleString('pt-BR');

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">
                          {item.nomeCondominio}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {dataFormatada}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3 text-slate-500" />
                            {item.excluidoPor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                      {item.totalUnidadesOriginal || 0} Unidades
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleBaixarJson(item)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Baixar cópia do snapshot JSON salvo neste cofre"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar JSON</span>
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleExcluirPermanente(item)}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Remover definitivamente do cofre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Excluir Permanente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRestaurar(item)}
                        disabled={isLoading}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                        title="Restaurar este condomínio e todas as suas subcoleções"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Restaurando...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurar Condomínio</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
          <span>Snapshots salvos no Firebase Firestore</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
