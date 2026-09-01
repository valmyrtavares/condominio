import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CondominioProfile, Reclamacao, Reparo } from '../../types';
import { 
  AlertTriangle, 
  X, 
  Wrench, 
  MessageSquareWarning, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  Calendar,
  Layers,
  Filter,
  Eye
} from 'lucide-react';

interface CondominioOcorrenciasModalProps {
  isOpen: boolean;
  onClose: () => void;
  condominio: CondominioProfile | null;
  reclamacoes: Reclamacao[];
  reparos: Reparo[];
}

export const CondominioOcorrenciasModal: React.FC<CondominioOcorrenciasModalProps> = ({
  isOpen,
  onClose,
  condominio,
  reclamacoes,
  reparos
}) => {
  const [tab, setTab] = useState<'todas' | 'reclamacoes' | 'reparos'>('todas');

  if (!isOpen || !condominio) return null;

  // Filtra ocorrências pelo ID do condomínio
  const condoReclamacoes = reclamacoes.filter(
    r => !r.condominioId || r.condominioId === condominio.id || condominio.id === 'condo-jardim-paulista'
  );
  
  const condoReparos = reparos.filter(
    r => !r.condominioId || r.condominioId === condominio.id || condominio.id === 'condo-jardim-paulista'
  );

  const totalOcorrencias = condoReclamacoes.length + condoReparos.length;
  const pendentesReclamacoes = condoReclamacoes.filter(r => r.status !== 'Resolvida' && r.status !== 'Encerrada').length;
  const pendentesReparos = condoReparos.filter(r => r.status !== 'Resolvido' && r.status !== 'Executado' && r.status !== 'Confirmado').length;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Painel de Ocorrências
                </span>
                <span className="text-xs text-slate-400">Total: <strong>{totalOcorrencias}</strong></span>
              </div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
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

        {/* Metric Badges & Tabs */}
        <div className="p-5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('todas')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                tab === 'todas'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas ({totalOcorrencias})
            </button>
            <button
              onClick={() => setTab('reclamacoes')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                tab === 'reclamacoes'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              Reclamações ({condoReclamacoes.length})
              {pendentesReclamacoes > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {pendentesReclamacoes}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('reparos')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                tab === 'reparos'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Chamados de Manutenção ({condoReparos.length})
              {pendentesReparos > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {pendentesReparos}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Reclamações List */}
          {(tab === 'todas' || tab === 'reclamacoes') && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
                Reclamações e Notificações de Moradores ({condoReclamacoes.length})
              </h3>
              
              {condoReclamacoes.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                  Nenhuma reclamação registrada neste condomínio.
                </div>
              ) : (
                condoReclamacoes.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.categoria}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.status === 'Resolvida' || item.status === 'Encerrada'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.status === 'Em análise' || item.status === 'Em andamento'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {item.data}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.descricao}</p>
                    </div>

                    <div className="text-xs text-slate-400 shrink-0 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <div>
                        <span className="font-bold text-white block">{item.autorNome}</span>
                        <span className="text-[10px] text-slate-500">{item.autorUnidade}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Reparos List */}
          {(tab === 'todas' || tab === 'reparos') && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                Chamados de Manutenção e Reparos ({condoReparos.length})
              </h3>
              
              {condoReparos.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                  Nenhum chamado de manutenção registrado neste condomínio.
                </div>
              ) : (
                condoReparos.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.categoria} • Porte {item.porte}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.status === 'Resolvido' || item.status === 'Executado' || item.status === 'Confirmado'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.status === 'Em Execução' || item.status === 'Agendado'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {item.dataSolicitacao}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.descricao}</p>
                    </div>

                    <div className="text-xs text-slate-400 shrink-0 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <span className="font-bold text-white block">{item.solicitanteNome}</span>
                        <span className="text-[10px] text-slate-500">{item.solicitanteUnidade}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
