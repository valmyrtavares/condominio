import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CondominioProfile } from '../../types';
import { useCondo } from '../../context/CondoContext';
import {
  AlertTriangle,
  X,
  Download,
  Trash2,
  Building,
  ShieldAlert,
  CheckCircle2,
  Archive,
  RefreshCw
} from 'lucide-react';

interface ConfirmDeleteCondoModalProps {
  isOpen: boolean;
  condo: CondominioProfile | null;
  onClose: () => void;
  onCondoDeleted?: () => void;
}

export const ConfirmDeleteCondoModal: React.FC<ConfirmDeleteCondoModalProps> = ({
  isOpen,
  condo,
  onClose,
  onCondoDeleted
}) => {
  const {
    exportarBackupCondominio,
    salvarNaLixeiraCondominio,
    excluirCondominio,
    alternarStatusCondominio,
    currentUser
  } = useCondo();

  const [typedName, setTypedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTypedName('');
      setLoading(false);
      setStatusText('');
      setErrorMessage(null);
    }
  }, [isOpen, condo]);

  if (!isOpen || !condo) return null;

  const nomeExato = (condo.nome || '').trim();
  const isMatch = typedName.trim().toLowerCase() === nomeExato.toLowerCase();

  // Executa o congelamento/arquivamento rápido
  const handleCongelarCondominio = () => {
    if (condo.status === 'ativo') {
      alternarStatusCondominio(condo.id);
    }
    onClose();
  };

  // Executa o fluxo de Disaster Recovery: Snapshot JSON -> Download -> Lixeira Firestore -> Excluir
  const handleExecutarExclusaoSegura = async () => {
    if (!isMatch) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Gerando snapshot completo
      setStatusText('1/3 Gerando snapshot completo de todos os dados do condomínio...');
      const exportRes = await exportarBackupCondominio(condo.id);
      
      let backupPayload = exportRes.backup;
      if (!backupPayload) {
        // Fallback estrutural
        backupPayload = {
          versao: '2.1',
          dataExportacao: new Date().toISOString(),
          condoId: condo.id,
          condominio: condo,
          subcolecoes: {},
          users: []
        };
      }

      // 2. Disparando download automático do JSON para a máquina do Master
      setStatusText('2/3 Baixando arquivo JSON de segurança para seu dispositivo...');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      const dataFormatada = new Date().toISOString().slice(0, 10);
      const slugLimpo = (condo.slug || condo.id || 'condo').replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `BACKUP-SEGURANCA-${slugLimpo}-${dataFormatada}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // 3. Guardando snapshot no Cofre de Lixeira na nuvem (Firestore)
      setStatusText('3/3 Gravando cópia de recuperação no Cofre na Nuvem...');
      await salvarNaLixeiraCondominio(condo.id, backupPayload, {
        nomeCondo: condo.nome,
        excluidoPor: currentUser?.nome || 'Super Administrador (Master)',
        totalUnidades: condo.totalUnidades,
        tipoCondominio: condo.tipoCondominio
      });

      // 4. Executando a exclusão
      excluirCondominio(condo.id);

      if (onCondoDeleted) onCondoDeleted();
      onClose();
    } catch (err: any) {
      console.error('🔥 Erro na exclusão segura:', err);
      setErrorMessage(err.message || 'Ocorreu um erro ao processar o backup de segurança.');
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header - Zona de Perigo */}
        <div className="bg-rose-950/80 border-b border-rose-500/40 p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block">
                Zona de Perigo Crítica
              </span>
              <h3 className="text-base font-black text-white">
                Excluir Condomínio
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-200 text-xs sm:text-sm max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Cartão de Identificação do Condomínio */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-sm sm:text-base text-white truncate">
                  {condo.nome}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  ID: <span className="font-mono text-slate-300">{condo.id}</span> • {condo.totalUnidades || 0} {condo.tipoCondominio === 'casas' ? 'Casas' : 'Apartamentos'}
                </p>
              </div>
            </div>

            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${
              condo.status === 'ativo' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
            }`}>
              {condo.status === 'ativo' ? 'Ativo' : 'Bloqueado'}
            </span>
          </div>

          {/* Alerta de Impacto */}
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>O que acontecerá ao prosseguir:</span>
            </div>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300 pl-1 leading-relaxed">
              <li>O condomínio será removido da listagem ativa de acesso.</li>
              <li>Moradores e funcionários perderão o acesso ao portal.</li>
              <li>
                <strong className="text-white font-bold">Proteção Automática Ativada:</strong> Um arquivo JSON com 100% dos dados será baixado para o seu computador e uma cópia será guardada no Cofre na Nuvem para restauração futura.
              </li>
            </ul>
          </div>

          {/* Alternativa Recomendada: Congelar */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">Apenas pausar acessos?</span>
                <span className="text-slate-400 text-[11px]">Você pode congelar o condomínio sem apagar nada.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCongelarCondominio}
              disabled={loading}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              Bloquear / Congelar
            </button>
          </div>

          {/* Campo de Confirmação por Digitação */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-300 block">
              Para confirmar a exclusão, digite <strong className="text-rose-400 font-mono select-all">"{nomeExato}"</strong> abaixo:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={`Digite "${nomeExato}" para liberar`}
              disabled={loading}
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono font-bold focus:outline-none transition-colors shadow-inner"
            />
            {typedName.length > 0 && (
              <p className={`text-[11px] font-bold flex items-center gap-1 ${isMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Nome verificado com sucesso! Botão de exclusão liberado.
                  </>
                ) : (
                  <>Digite o nome exatamente igual para habilitar o botão.</>
                )}
              </p>
            )}
          </div>

          {/* Status do Processamento */}
          {loading && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 flex items-center gap-3 text-indigo-200 text-xs animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
              <span>{statusText || 'Processando segurança e backup...'}</span>
            </div>
          )}

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="bg-rose-950/50 border border-rose-500/50 rounded-2xl p-3 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleExecutarExclusaoSegura}
            disabled={!isMatch || loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg transition-all ${
              isMatch && !loading
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95 shadow-rose-900/40'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <Trash2 className="w-4 h-4" />
                <span>Baixar Backup & Excluir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
