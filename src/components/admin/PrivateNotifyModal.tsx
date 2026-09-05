import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade, NotificacaoPrivada } from '../../types';
import { 
  Bell, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface PrivateNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidade: Unidade | null;
}

const TEMPLATES_RAPIDOS = [
  'Aviso: Encomenda disponível para retirada na portaria/zeladoria.',
  'Notificação: Solicitamos atenção às normas de silêncio após as 22h.',
  'Comunicado: Favor regularizar a posição do veículo na vaga de garagem.',
  'Aviso: Manutenção preventiva agendada na prumada de água da sua coluna.'
];

export const PrivateNotifyModal: React.FC<PrivateNotifyModalProps> = ({
  isOpen,
  onClose,
  unidade
}) => {
  const { notificacoesPrivadas, enviarNotificacaoPrivada } = useCondo();
  const [titulo, setTitulo] = useState('Notificação da Sindicância');
  const [mensagem, setMensagem] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  if (!isOpen || !unidade) return null;

  const unitTitle = unidade.numero.toLowerCase().startsWith('apt') || unidade.numero.toLowerCase().startsWith('cobertura')
    ? unidade.numero
    : `Apto ${unidade.numero}`;

  const normalizeUnit = (str?: string) => str ? str.toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim() : '';

  const notificacoesDestaUnidade = notificacoesPrivadas.filter(
    n => normalizeUnit(n.unidadeNumero) === normalizeUnit(unidade.numero)
  );

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    enviarNotificacaoPrivada(unidade.numero, mensagem.trim(), titulo.trim());
    setMensagem('');
    setSucessoMsg('Notificação enviada com sucesso para os moradores!');
    setTimeout(() => setSucessoMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-950">
                  Notificar {unitTitle}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  Privado
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Envie um aviso ou comunicado direto e confidencial para esta moradia.
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* Sucesso Alert */}
          {sucessoMsg && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{sucessoMsg}</span>
            </div>
          )}

          {/* Form de Envio */}
          <form onSubmit={handleEnviar} className="space-y-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Assunto / Título do Aviso:
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Aviso de Encomenda, Notificação de Ruído..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Modelos Rápidos */}
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase text-slate-500 block">
                Modelos rápidos de texto:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATES_RAPIDOS.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMensagem(tpl)}
                    className="text-[10px] font-semibold text-slate-800 bg-white hover:bg-amber-100 border border-slate-200 hover:border-amber-300 px-2 py-1 rounded-lg text-left transition-colors"
                  >
                    {tpl.substring(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Mensagem Privada:
              </label>
              <textarea
                rows={3}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite a notificação que será exibida reservadamente para os moradores desta unidade..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              Enviar Notificação à Unidade
            </button>
          </form>

          {/* Histórico de Notificações Desta Unidade */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 block">
              Histórico de Notificações Enviadas ({notificacoesDestaUnidade.length})
            </span>

            {notificacoesDestaUnidade.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                Nenhuma notificação enviada para esta unidade até o momento.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notificacoesDestaUnidade.map((n) => (
                  <div 
                    key={n.id} 
                    className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-950 font-black">
                        {n.titulo}
                      </strong>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        n.lida 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {n.lida ? '✓ RECEBIDA / LIDA' : 'ENVIADA'}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium whitespace-pre-wrap">
                      {n.mensagem}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Por: {n.autorNome}</span>
                      <span>{n.dataHora}</span>
                    </div>

                    {n.lida && (
                      <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50/90 px-2 py-1 rounded-lg flex items-center justify-between border border-emerald-200/60">
                        <span>Status de entrega:</span>
                        <span>✓ Recebida e lida pelo morador {n.lidaEm ? `em ${n.lidaEm}` : ''}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
