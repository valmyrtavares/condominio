import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CondominioProfile } from '../../types';
import { 
  PauseCircle, 
  PlayCircle, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface SuspenderCondominioModalProps {
  isOpen: boolean;
  onClose: () => void;
  condominio: CondominioProfile | null;
  onConfirm: (condoId: string, novoStatus: 'ativo' | 'bloqueado', motivo?: string) => void;
}

export const SuspenderCondominioModal: React.FC<SuspenderCondominioModalProps> = ({
  isOpen,
  onClose,
  condominio,
  onConfirm
}) => {
  const [motivo, setMotivo] = useState('Inadimplência de mensalidade da plataforma');

  if (!isOpen || !condominio) return null;

  const isAtivo = condominio.status === 'ativo';

  const handleAction = () => {
    const novoStatus = isAtivo ? 'bloqueado' : 'ativo';
    onConfirm(condominio.id, novoStatus, isAtivo ? motivo : undefined);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-800 flex items-center justify-between gap-4 ${
          isAtivo ? 'bg-gradient-to-r from-rose-500/15 via-slate-900 to-slate-900' : 'bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
              isAtivo 
                ? 'bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-rose-500/10' 
                : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-emerald-500/10'
            }`}>
              {isAtivo ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isAtivo ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isAtivo ? 'Suspender Acesso ao Condomínio' : 'Reativar Acesso do Condomínio'}
              </span>
              <h2 className="text-lg font-black text-white">
                {condominio.nome}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            isAtivo 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}>
            {isAtivo ? (
              <p>
                Ao <strong>suspender este condomínio</strong>, o síndico e todos os moradores perderão temporariamente o acesso às funções administrativas, reservas e comunicados até a reativação.
              </p>
            ) : (
              <p>
                Ao <strong>reativar este condomínio</strong>, o acesso será restabelecido imediatamente para todos os moradores e a administração.
              </p>
            )}
          </div>

          {isAtivo && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Motivo da Suspensão:</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-rose-400 cursor-pointer"
              >
                <option value="Inadimplência de mensalidade da plataforma">Inadimplência de mensalidade da plataforma</option>
                <option value="Solicitação da administração do condomínio">Solicitação da administração do condomínio</option>
                <option value="Período de testes encerrado">Período de testes encerrado</option>
                <option value="Manutenção emergencial">Manutenção emergencial</option>
                <option value="Outro motivo operacional">Outro motivo operacional</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAction}
              className={`px-5 py-2.5 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isAtivo
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isAtivo ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Confirmar Suspensão</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Reativar Condomínio</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
