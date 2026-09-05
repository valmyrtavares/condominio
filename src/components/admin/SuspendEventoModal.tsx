import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { EventoCondominio } from '../../types';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Send,
  BellRing
} from 'lucide-react';

interface SuspendEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: EventoCondominio | null;
}

export const SuspendEventoModal: React.FC<SuspendEventoModalProps> = ({
  isOpen,
  onClose,
  evento
}) => {
  const { suspenderEvento } = useCondo();
  const [motivo, setMotivo] = useState('');

  if (!isOpen || !evento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) return;

    suspenderEvento(evento.id, motivo.trim());
    setMotivo('');
    onClose();
  };

  const motivosPredefinidos = [
    'Uso de som excessivo incompatível com o regulamento interno',
    'Falta de reserva formal prévia do espaço comum',
    'Conflito de agendamento com manutenção predial do condomínio',
    'Horário estipulado ultrapassa o limite permitido de silêncio (22h)',
    'Conteúdo publicitário ou comercial indevido no mural de eventos'
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border-2 border-rose-500 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                Tirar Evento do Ar & Notificar Morador
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Moderação administrativa de eventos e celebrações
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo do Evento */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block">
            Evento Selecionado:
          </span>
          <h4 className="font-black text-sm text-slate-950">
            {evento.titulo}
          </h4>
          <p className="text-xs text-slate-700 font-semibold">
            Organizador: <strong>{evento.organizador}</strong> • Local: <strong>{evento.local}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Motivo */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Motivo da Suspensão / Retirada do Ar *
            </label>
            <textarea
              placeholder="Descreva detalhadamente o motivo para notificar formalmente o morador..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 font-semibold resize-none"
              required
            />
          </div>

          {/* Sugestões Rápidas de Motivos */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Sugestões Rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {motivosPredefinidos.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMotivo(m)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-900 text-slate-700 border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  + {m}
                </button>
              ))}
            </div>
          </div>

          {/* Aviso de Notificação Automática */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-950 font-medium">
            <BellRing className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              O evento será ocultado do feed e o morador organizador receberá automaticamente uma <strong>notificação privada de alta prioridade</strong> com o motivo indicado.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!motivo.trim()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              Confirmar e Suspender Evento
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
