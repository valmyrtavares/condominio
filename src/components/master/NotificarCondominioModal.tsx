import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CondominioProfile } from '../../types';
import { 
  Bell, 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Mail, 
  Smartphone,
  ShieldAlert,
  Info
} from 'lucide-react';

interface NotificarCondominioModalProps {
  isOpen: boolean;
  onClose: () => void;
  condominio: CondominioProfile | null;
}

export const NotificarCondominioModal: React.FC<NotificarCondominioModalProps> = ({
  isOpen,
  onClose,
  condominio
}) => {
  const [tipo, setTipo] = useState<'cobranca' | 'aviso' | 'urgente' | 'sistema'>('cobranca');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [enviarPush, setEnviarPush] = useState(true);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);

  if (!isOpen || !condominio) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !mensagem.trim()) return;

    // Simula envio de notificação privada master
    setEnviadoComSucesso(true);
    setTimeout(() => {
      setEnviadoComSucesso(false);
      setTitulo('');
      setMensagem('');
      onClose();
    }, 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Notificação Direta da Plataforma
              </span>
              <h2 className="text-lg font-black text-white">
                Notificar {condominio.nome}
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

        {enviadoComSucesso ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white">Notificação Enviada com Sucesso!</h3>
            <p className="text-xs text-slate-400">
              O aviso foi encaminhado para a administração do <strong>{condominio.nome}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Tipo de Notificação */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tipo de Notificação:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipo('cobranca')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    tipo === 'cobranca'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Cobrança / Mensalidade</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('aviso')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    tipo === 'aviso'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>Comunicado Geral</span>
                </button>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Título do Aviso:</label>
              <input
                type="text"
                required
                placeholder="Ex: Lembrete de vencimento da mensalidade da plataforma"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Mensagem */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Conteúdo da Mensagem:</label>
              <textarea
                required
                rows={4}
                placeholder="Digite os detalhes da notificação enviada para o síndico e administração..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Canais de Envio */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Enviar via:</span>
              <div className="flex items-center gap-4 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enviarEmail}
                    onChange={(e) => setEnviarEmail(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> E-mail do Síndico</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enviarPush}
                    onChange={(e) => setEnviarPush(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-sky-400" /> Notificação no Painel</span>
                </label>
              </div>
            </div>

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
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Enviar Notificação</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>,
    document.body
  );
};
