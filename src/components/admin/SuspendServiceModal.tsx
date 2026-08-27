import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ServicoMorador } from '../../types';
import { 
  AlertTriangle, 
  X, 
  Send, 
  CheckCircle2, 
  Bell, 
  Building2, 
  User, 
  ShieldAlert 
} from 'lucide-react';

interface SuspendServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  servico: ServicoMorador | null;
}

const MOTIVOS_RAPIDOS = [
  'Anúncio em desacordo com as regras de convivência do condomínio.',
  'Fotos ou textos inadequados para o mural comunitário.',
  'Atividade comercial necessita de autorização prévia da administração.',
  'Horário de prestação de serviços incompatível com o regulamento.'
];

export const SuspendServiceModal: React.FC<SuspendServiceModalProps> = ({
  isOpen,
  onClose,
  servico
}) => {
  const { suspenderServicoMorador, enviarNotificacaoPrivada } = useCondo();
  const [motivo, setMotivo] = useState(MOTIVOS_RAPIDOS[0]);
  const [enviarNotif, setEnviarNotif] = useState(true);
  const [sucesso, setSucesso] = useState(false);

  if (!isOpen || !servico) return null;

  const handleSuspender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) return;

    suspenderServicoMorador(servico.id, motivo.trim());

    if (enviarNotif && servico.moradorUnidade) {
      enviarNotificacaoPrivada(
        servico.moradorUnidade,
        `Seu anúncio "${servico.titulo}" foi temporariamente suspenso pela sindicância. Motivo: ${motivo.trim()}. Você pode acessar a aba de Serviços de Moradores, editar o anúncio para corrigir a irregularidade e solicitar a reativação.`,
        `Suspensão de Anúncio: ${servico.titulo}`
      );
    }

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start pt-16 sm:pt-10 pb-24 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-rose-400 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                Suspender Visualização do Anúncio
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Oculte o anúncio para o condomínio e notifique a moradia.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sucesso ? (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>Anúncio suspenso e morador notificado com sucesso!</span>
          </div>
        ) : (
          <form onSubmit={handleSuspender} className="space-y-4">
            
            {/* Card resumo do anúncio */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                Anúncio Selecionado:
              </span>
              <h4 className="font-black text-slate-950 text-sm leading-tight">
                {servico.titulo}
              </h4>
              <p className="text-slate-600 font-bold text-[11px] flex items-center gap-2">
                <span>Morador: <strong>{servico.moradorNome}</strong></span>
                <span>•</span>
                <span>Apto: <strong>{servico.moradorUnidade}</strong></span>
              </p>
            </div>

            {/* Motivos rápidos */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                Motivo da Suspensão / Irregularidade:
              </span>
              <div className="space-y-1">
                {MOTIVOS_RAPIDOS.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMotivo(m)}
                    className={`w-full text-left p-2 rounded-xl border text-[11px] font-bold transition-all ${
                      motivo === m
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de texto livre para detalhar */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Observações / Mensagem para o Morador:
              </label>
              <textarea
                rows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva a irregularidade para que o morador saiba o que deve ser corrigido..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                required
              />
            </div>

            {/* Notificar por notificação privada */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={enviarNotif}
                onChange={(e) => setEnviarNotif(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-700" />
                <span>Enviar aviso privado automático para o Apto {servico.moradorUnidade}</span>
              </div>
            </label>

            {/* Explicação de regra */}
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              * O anúncio ficará invisível para os outros condôminos. Somente o morador criador continuará visualizando com a instrução de editar para solicitar reativação.
            </p>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Suspender Anúncio
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
