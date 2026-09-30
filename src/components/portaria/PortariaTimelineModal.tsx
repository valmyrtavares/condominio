import React from 'react';
import { createPortal } from 'react-dom';
import { TimelineEventoPortaria, EncomendaEntrega, AutorizacaoAcesso } from '../../types';
import { 
  History, 
  X, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  Package, 
  KeyRound, 
  UserCheck, 
  Truck, 
  MapPin, 
  FileText,
  Sparkles,
  Shield
} from 'lucide-react';

interface PortariaTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  tituloItem?: string;
  subtituloItem?: string;
  unidade?: string;
  itemTipo?: 'encomenda' | 'acesso';
  timeline?: TimelineEventoPortaria[];
  itemEncomenda?: EncomendaEntrega | null;
  itemAcesso?: AutorizacaoAcesso | null;
  item?: EncomendaEntrega | AutorizacaoAcesso | null;
  tipo?: 'encomenda' | 'acesso';
}

export const PortariaTimelineModal: React.FC<PortariaTimelineModalProps> = ({
  isOpen,
  onClose,
  tituloItem,
  subtituloItem,
  unidade,
  itemTipo,
  timeline = [],
  itemEncomenda,
  itemAcesso,
  item,
  tipo
}) => {
  if (!isOpen) return null;

  const isEncomenda = itemTipo === 'encomenda' || tipo === 'encomenda';
  const effectiveEncomenda = itemEncomenda || (isEncomenda && item ? (item as EncomendaEntrega) : null);
  const effectiveAcesso = itemAcesso || (!isEncomenda && item ? (item as AutorizacaoAcesso) : null);
  
  const effectiveTitulo = tituloItem || (
    effectiveEncomenda 
      ? (effectiveEncomenda.fluxoTipo === 'saida_embrulho' ? `Despacho de Embrulho - ${effectiveEncomenda.tipo}` : `Encomenda - ${effectiveEncomenda.empresaTransporte}`) 
      : effectiveAcesso 
        ? `${effectiveAcesso.tipoVisitante}: ${effectiveAcesso.nomeVisitante}` 
        : 'Histórico da Portaria'
  );
  
  const effectiveSubtitulo = subtituloItem || (
    effectiveEncomenda 
      ? `Apto ${effectiveEncomenda.unidade} • ${effectiveEncomenda.destinatarioNome}` 
      : effectiveAcesso 
        ? `Apto ${effectiveAcesso.unidade} • Morador: ${effectiveAcesso.moradorNome}` 
        : ''
  );
  
  const effectiveUnidade = unidade || effectiveEncomenda?.unidade || effectiveAcesso?.unidade || '';
  const effectiveItemTipo = itemTipo || tipo || (effectiveEncomenda ? 'encomenda' : 'acesso');

  // Se não houver timeline gravada explicitamente (registros legados), gera os passos a partir das datas/horas existentes
  let eventosExibicao: TimelineEventoPortaria[] = [
    ...(timeline && timeline.length > 0 ? timeline : (effectiveEncomenda?.timeline || effectiveAcesso?.timeline || []))
  ];

  if (eventosExibicao.length === 0) {
    if (effectiveEncomenda) {
      const itemEncomenda = effectiveEncomenda;
      if (itemEncomenda.fluxoTipo === 'saida_embrulho') {
        eventosExibicao.push({
          id: 'step-1',
          dataHora: `${itemEncomenda.dataRecebimento} ${itemEncomenda.horaRecebimento}`,
          data: itemEncomenda.dataRecebimento,
          hora: itemEncomenda.horaRecebimento,
          titulo: 'Embrulho Deixado pelo Morador',
          descricao: `Embrulho deixado na portaria para retirada de ${itemEncomenda.destinatarioExterno || itemEncomenda.destinatarioNome}.`,
          autorNome: itemEncomenda.destinatarioNome || `Morador Apto ${itemEncomenda.unidade}`,
          autorTipo: 'morador',
          statusBadge: itemEncomenda.status
        });

        if (itemEncomenda.status === 'Aguardando Coleta na Portaria' || itemEncomenda.status === 'Despachado / Retirado por Terceiro') {
          eventosExibicao.push({
            id: 'step-2',
            dataHora: `${itemEncomenda.dataRecebimento} ${itemEncomenda.horaRecebimento}`,
            data: itemEncomenda.dataRecebimento,
            hora: itemEncomenda.horaRecebimento,
            titulo: 'Portaria Confirmou Custódia do Embrulho',
            descricao: `Guardado em ${itemEncomenda.localArmazenamento || 'Portaria'}. Aguardando retirada de terceiro.`,
            autorNome: itemEncomenda.porteiroRecebedor || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Aguardando Coleta na Portaria'
          });
        }

        if (itemEncomenda.status === 'Despachado / Retirado por Terceiro') {
          eventosExibicao.push({
            id: 'step-3',
            dataHora: `${itemEncomenda.dataDespacho || itemEncomenda.dataRetirada || itemEncomenda.dataRecebimento} ${itemEncomenda.horaDespacho || itemEncomenda.horaRetirada || itemEncomenda.horaRecebimento}`,
            data: itemEncomenda.dataDespacho || itemEncomenda.dataRetirada || itemEncomenda.dataRecebimento,
            hora: itemEncomenda.horaDespacho || itemEncomenda.horaRetirada || itemEncomenda.horaRecebimento,
            titulo: 'Embrulho Despachado / Retirado por Terceiro',
            descricao: `Entregue com sucesso a ${itemEncomenda.retiradoPorNome || itemEncomenda.destinatarioExterno || 'Destinatário'}.`,
            autorNome: itemEncomenda.despachadoPor || itemEncomenda.porteiroRecebedor || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Despachado / Retirado por Terceiro'
          });
        }
      } else {
        // Encomenda regular (Entrada)
        if (itemEncomenda.status === 'Aguardando Chegada na Portaria') {
          eventosExibicao.push({
            id: 'step-1',
            dataHora: `${itemEncomenda.dataRecebimento} ${itemEncomenda.horaRecebimento}`,
            data: itemEncomenda.dataRecebimento,
            hora: itemEncomenda.horaRecebimento,
            titulo: 'Aviso Prévio de Encomenda Registrado',
            descricao: `Morador informou que aguarda a chegada de um pacote (${itemEncomenda.tipo} - ${itemEncomenda.empresaTransporte}).`,
            autorNome: itemEncomenda.destinatarioNome || `Morador Apto ${itemEncomenda.unidade}`,
            autorTipo: 'morador',
            statusBadge: 'Aguardando Chegada na Portaria'
          });
        } else {
          eventosExibicao.push({
            id: 'step-1',
            dataHora: `${itemEncomenda.dataRecebimento} ${itemEncomenda.horaRecebimento}`,
            data: itemEncomenda.dataRecebimento,
            hora: itemEncomenda.horaRecebimento,
            titulo: 'Pacote Recebido na Portaria',
            descricao: `Recebido pelo porteiro e guardado em: ${itemEncomenda.localArmazenamento || 'Portaria'}.`,
            autorNome: itemEncomenda.porteiroRecebedor || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Aguardando Retirada'
          });
        }

        if (itemEncomenda.status === 'Entregue ao Morador') {
          eventosExibicao.push({
            id: 'step-2',
            dataHora: `${itemEncomenda.dataRetirada || itemEncomenda.dataRecebimento} ${itemEncomenda.horaRetirada || itemEncomenda.horaRecebimento}`,
            data: itemEncomenda.dataRetirada || itemEncomenda.dataRecebimento,
            hora: itemEncomenda.horaRetirada || itemEncomenda.horaRecebimento,
            titulo: 'Encomenda Entregue ao Morador',
            descricao: `Retirado na portaria por ${itemEncomenda.retiradoPorNome || itemEncomenda.destinatarioNome || 'Morador'}.`,
            autorNome: 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Entregue ao Morador'
          });
        }
      }
    } else if (effectiveAcesso) {
      const itemAcesso = effectiveAcesso;
      if (itemAcesso.deixouChave) {
        eventosExibicao.push({
          id: 'step-1',
          dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioEstimado || 'Criado'}`,
          data: itemAcesso.dataPrevista,
          hora: itemAcesso.horarioEstimado || 'Registrado',
          titulo: 'Chave Deixada na Portaria à Disposição',
          descricao: `Chave (${itemAcesso.identificacaoChave || 'Imóvel'}) disponibilizada para ${itemAcesso.nomeVisitante} (${itemAcesso.tipoVisitante}). Local: ${itemAcesso.localChavePortaria || 'Portaria'}.`,
          autorNome: itemAcesso.moradorNome || `Morador Apto ${itemAcesso.unidade}`,
          autorTipo: 'morador',
          statusBadge: 'Chave na Portaria à Disposição'
        });

        if (itemAcesso.status === 'Chave Retirada / No Condomínio' || itemAcesso.status === 'Chave Devolvida / Concluído') {
          eventosExibicao.push({
            id: 'step-2',
            dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioRetiradaChave || itemAcesso.horarioEntradaReal || 'Horário de Entrada'}`,
            data: itemAcesso.dataPrevista,
            hora: itemAcesso.horarioRetiradaChave || itemAcesso.horarioEntradaReal || 'Entrada',
            titulo: 'Chave Retirada e Entrada Liberada',
            descricao: `${itemAcesso.nomeVisitante} retirou a chave na portaria e acessou o condomínio.`,
            autorNome: itemAcesso.porteiroResponsavel || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Chave Retirada / No Condomínio'
          });
        }

        if (itemAcesso.status === 'Chave Devolvida / Concluído') {
          eventosExibicao.push({
            id: 'step-3',
            dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioDevolucaoChave || itemAcesso.horarioSaidaReal || 'Horário de Saída'}`,
            data: itemAcesso.dataPrevista,
            hora: itemAcesso.horarioDevolucaoChave || itemAcesso.horarioSaidaReal || 'Saída',
            titulo: 'Chave Devolvida na Portaria e Saída Concluída',
            descricao: `Chave devolvida com sucesso à portaria. Atendimento finalizado.`,
            autorNome: itemAcesso.porteiroResponsavel || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Chave Devolvida / Concluído'
          });
        }
      } else {
        // Visita / Prestador regular
        eventosExibicao.push({
          id: 'step-1',
          dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioEstimado || 'Previsto'}`,
          data: itemAcesso.dataPrevista,
          hora: itemAcesso.horarioEstimado || 'Previsto',
          titulo: 'Autorização de Acesso Cadastrada',
          descricao: `Morador autorizou a entrada de ${itemAcesso.nomeVisitante} (${itemAcesso.tipoVisitante}).`,
          autorNome: itemAcesso.moradorNome || `Morador Apto ${itemAcesso.unidade}`,
          autorTipo: 'morador',
          statusBadge: 'Aguardando Chegada'
        });

        if (itemAcesso.status === 'Entrada Liberada / Presente' || itemAcesso.status === 'Finalizado / Saiu') {
          eventosExibicao.push({
            id: 'step-2',
            dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioEntradaReal || 'Entrada'}`,
            data: itemAcesso.dataPrevista,
            hora: itemAcesso.horarioEntradaReal || 'Entrada',
            titulo: 'Chegada Confirmada e Entrada Liberada',
            descricao: `Portaria registrou a entrada de ${itemAcesso.nomeVisitante} no condomínio.`,
            autorNome: itemAcesso.porteiroResponsavel || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Entrada Liberada / Presente'
          });
        }

        if (itemAcesso.status === 'Finalizado / Saiu') {
          eventosExibicao.push({
            id: 'step-3',
            dataHora: `${itemAcesso.dataPrevista} ${itemAcesso.horarioSaidaReal || 'Saída'}`,
            data: itemAcesso.dataPrevista,
            hora: itemAcesso.horarioSaidaReal || 'Saída',
            titulo: 'Visita / Atendimento Concluído',
            descricao: `${itemAcesso.nomeVisitante} encerrou o acesso e saiu do condomínio.`,
            autorNome: itemAcesso.porteiroResponsavel || 'Portaria',
            autorTipo: 'porteiro',
            statusBadge: 'Finalizado / Saiu'
          });
        }
      }
    }
  }

  return createPortal(
    <div className="modal-overlay-safe bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="modal-content-safe bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
                  Linha do Tempo & Histórico com Horários
                </span>
                {effectiveUnidade && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Unidade {effectiveUnidade}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {effectiveTitulo}
              </h2>
              {effectiveSubtitulo && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {effectiveSubtitulo}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Total de registros na timeline:</span>
            </div>
            <span className="font-black px-2.5 py-0.5 bg-indigo-600/30 text-indigo-300 rounded-full border border-indigo-500/30">
              {eventosExibicao.length} {eventosExibicao.length === 1 ? 'etapa registrada' : 'etapas registradas'}
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-400 before:to-emerald-500">
            {eventosExibicao.map((evento, idx) => {
              const isUltimo = idx === eventosExibicao.length - 1;
              const isMorador = evento.autorTipo === 'morador';

              return (
                <div key={evento.id || idx} className="relative group animate-in fade-in slide-in-from-left duration-200">
                  {/* Marcador do Ponto */}
                  <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isUltimo 
                      ? 'bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/20 shadow-md scale-110' 
                      : 'bg-indigo-600 border-indigo-300'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Card do Evento */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isUltimo 
                      ? 'bg-slate-800/90 border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          isMorador 
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' 
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          {isMorador ? '👤 Morador' : '🛡️ Portaria / Admin'}
                        </span>
                        <strong className="text-white text-xs font-black">
                          {evento.titulo}
                        </strong>
                      </div>

                      {/* Timestamp Exato com Data e Hora */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 shadow-2xs shrink-0">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{evento.data} às {evento.hora}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                      {evento.descricao}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>Responsável: <b className="text-slate-200">{evento.autorNome}</b></span>
                      </span>

                      {evento.statusBadge && (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                          Status: {evento.statusBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition-all cursor-pointer shadow-md"
          >
            Fechar Linha do Tempo
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
