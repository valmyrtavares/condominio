import React, { useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade, NotificacaoPrivada } from '../../types';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  CheckCheck
} from 'lucide-react';

interface ResidentMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidade: Unidade | null;
}

export const ResidentMessagesModal: React.FC<ResidentMessagesModalProps> = ({
  isOpen,
  onClose,
  unidade
}) => {
  const { 
    notificacoesPrivadas, 
    marcarTodasNotificacoesUnidadeComoLidas,
    currentUser,
    isAdminLoggedIn
  } = useCondo();

  const normalizeUnit = (str?: string) => (str || '').toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim();

  const unitNumber = unidade?.numero || '';
  const isMyUnit = currentUser?.unidade && (
    normalizeUnit(currentUser.unidade) === normalizeUnit(unitNumber) ||
    currentUser.unidade.trim().toLowerCase() === unitNumber.trim().toLowerCase()
  );
  const isSindicoOrAdmin = currentUser?.role === 'sindico' || currentUser?.role === 'subsindico';
  const canAccess = Boolean(isMyUnit || isSindicoOrAdmin);

  const unitNotifs = notificacoesPrivadas.filter(
    n => normalizeUnit(n.unidadeNumero) === normalizeUnit(unitNumber)
  );

  // When modal is opened by authorized user, mark all unread notifications as read so admin is immediately notified of delivery/reading
  useEffect(() => {
    if (isOpen && unitNumber && canAccess) {
      marcarTodasNotificacoesUnidadeComoLidas(unitNumber);
    }
  }, [isOpen, unitNumber, canAccess]);

  if (!isOpen || !unidade || !canAccess) return null;

  const unitLabel = unidade.numero.toLowerCase().startsWith('apt') || unidade.numero.toLowerCase().startsWith('cobertura')
    ? unidade.numero
    : `Apt ${unidade.numero}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-950">
                  Mensagens da Sindicância
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  {unitLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Comunicados e notificações confidenciais enviados pela administração
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {unitNotifs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
              <p className="text-sm font-bold text-slate-700">
                Nenhuma mensagem no momento
              </p>
              <p className="text-xs text-slate-500">
                Não há avisos ou comunicados privados pendentes para o {unitLabel}.
              </p>
            </div>
          ) : (
            unitNotifs.map((n) => (
              <div 
                key={n.id}
                className="p-4 rounded-2xl border bg-amber-50/60 border-amber-200/90 shadow-xs space-y-2.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wide block">
                      Assunto:
                    </span>
                    <h4 className="font-black text-sm text-slate-950 leading-snug">
                      {n.titulo || 'Notificação da Sindicância'}
                    </h4>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Recebida
                  </span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                    {n.mensagem}
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-amber-200/50 text-[10px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-700" />
                      De: {n.autorNome}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {n.dataHora}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-800 bg-emerald-50/90 px-2.5 py-1 rounded-lg font-bold border border-emerald-200/70">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Administração notificada do recebimento
                    </span>
                    <span>{n.lidaEm || 'Confirmado agora'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">
            {unitNotifs.length} mensagem(ns) registrada(s)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-sm active:scale-95 transition-all"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
