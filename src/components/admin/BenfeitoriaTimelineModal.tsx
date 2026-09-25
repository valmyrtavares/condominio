import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import {
  Benfeitoria,
  StatusFaseBenfeitoria,
  OrcamentoBenfeitoria,
  PassoTimelineBenfeitoria
} from '../../types';
import {
  X,
  Plus,
  Calendar,
  DollarSign,
  Star,
  Users,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Sparkles,
  ShieldCheck,
  Check,
  ExternalLink,
  Award
} from 'lucide-react';
import { otimizarImagemArquivo } from '../../utils/imageOptimizer';

interface BenfeitoriaTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  benfeitoria: Benfeitoria | null;
  initialTab?: 'timeline' | 'novo_passo' | 'votos_avaliacoes';
}

const getProximaFaseSugerida = (statusAtual?: StatusFaseBenfeitoria): StatusFaseBenfeitoria => {
  switch (statusAtual) {
    case 'proposta': return 'orcamento';
    case 'orcamento': return 'votacao';
    case 'votacao': return 'contratada';
    case 'contratada': return 'execucao';
    case 'execucao': return 'avaliacao';
    case 'avaliacao': return 'entregue';
    case 'entregue': return 'entregue';
    case 'cancelada': return 'cancelada';
    default: return 'orcamento';
  }
};

const STATUS_CONFIG: Record<
  StatusFaseBenfeitoria,
  { label: string; stepNumber: number; badgeColor: string; desc: string }
> = {
  proposta: {
    label: '1. Proposta de Melhoria',
    stepNumber: 1,
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    desc: 'Apresentação da ideia e benefícios pretendidos (sem aprovação necessária).'
  },
  orcamento: {
    label: '2. Buscando Orçamento',
    stepNumber: 2,
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    desc: 'Cadastro e publicação de 3 orçamentos comparativos.'
  },
  votacao: {
    label: '3. Votação Eletrônica',
    stepNumber: 3,
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    desc: 'Votação aberta para escolha do orçamento pelos condôminos.'
  },
  contratada: {
    label: '4. Empresa Contratada',
    stepNumber: 4,
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    desc: 'Definição da empresa, datas de início/término e valores pagos.'
  },
  execucao: {
    label: '5. Em Execução',
    stepNumber: 5,
    badgeColor: 'bg-orange-100 text-orange-950 border-orange-300',
    desc: 'Diário de obras, atualizações e fotos do andamento.'
  },
  avaliacao: {
    label: '6. Avaliação dos Condôminos',
    stepNumber: 6,
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: 'Obra entregue para avaliação com notas de 1 a 5 estrelas.'
  },
  entregue: {
    label: '7. Entregue & Publicada',
    stepNumber: 7,
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    desc: 'Publicação oficial com avaliação final e fechamento de contas.'
  },
  cancelada: {
    label: '8. CANCELADO / QUEBRA DE CONTRATO',
    stepNumber: 8,
    badgeColor: 'bg-red-600 text-white border-red-700',
    desc: 'Rescisão contratual ou cancelamento justificado com fotos.'
  }
};

export const BenfeitoriaTimelineModal: React.FC<BenfeitoriaTimelineModalProps> = ({
  isOpen,
  onClose,
  benfeitoria,
  initialTab = 'timeline'
}) => {
  const {
    adicionarPassoTimelineBenfeitoria,
    salvarOrcamentosBenfeitoria,
    toggleVotacaoBenfeitoria,
    definirContratacaoBenfeitoria,
    adicionarDiarioObraBenfeitoria,
    toggleAvaliacaoBenfeitoria,
    cancelarBenfeitoria,
    concluirBenfeitoriaFinal,
    currentUser
  } = useCondo();

  const [activeTab, setActiveTab] = useState<'timeline' | 'novo_passo' | 'votos_avaliacoes'>(initialTab);
  const [selectedStatus, setSelectedStatus] = useState<StatusFaseBenfeitoria>(() => getProximaFaseSugerida(benfeitoria?.statusAtual));

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSelectedStatus(getProximaFaseSugerida(benfeitoria?.statusAtual));
    }
  }, [isOpen, initialTab, benfeitoria?.id, benfeitoria?.statusAtual]);
  const [stepTitulo, setStepTitulo] = useState('');
  const [stepDescricao, setStepDescricao] = useState('');
  const [stepData, setStepData] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [stepFoto, setStepFoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Status 2: Três Orçamentos
  const [orcamentosList, setOrcamentosList] = useState<OrcamentoBenfeitoria[]>(() => {
    if (benfeitoria?.orcamentos && benfeitoria.orcamentos.length === 3) {
      return benfeitoria.orcamentos;
    }
    return [
      {
        id: '1',
        empresaNome: '',
        site: '',
        prazoEntrega: '',
        valorTotal: 0,
        formaPagamento: '',
        jaPrestouServico: false,
        avaliacaoMediaAnterior: 5
      },
      {
        id: '2',
        empresaNome: '',
        site: '',
        prazoEntrega: '',
        valorTotal: 0,
        formaPagamento: '',
        jaPrestouServico: false,
        avaliacaoMediaAnterior: 5
      },
      {
        id: '3',
        empresaNome: '',
        site: '',
        prazoEntrega: '',
        valorTotal: 0,
        formaPagamento: '',
        jaPrestouServico: false,
        avaliacaoMediaAnterior: 5
      }
    ];
  });

  // Status 3: Votação
  const [votacaoAbertaLocal, setVotacaoAbertaLocal] = useState<boolean>(Boolean(benfeitoria?.votacaoAberta));
  const [prazoFimVotacaoLocal, setPrazoFimVotacaoLocal] = useState<string>(benfeitoria?.prazoFimVotacao || '');
  const [dispararMsgVotacao, setDispararMsgVotacao] = useState<boolean>(true);

  // Status 4: Contratação
  const [contratadaNome, setContratadaNome] = useState(benfeitoria?.empresaEleita?.empresaNome || '');
  const [contratadaInicio, setContratadaInicio] = useState(benfeitoria?.empresaEleita?.dataInicio || '');
  const [contratadaTermino, setContratadaTermino] = useState(benfeitoria?.empresaEleita?.dataTerminoPrevista || '');
  const [contratadaValor, setContratadaValor] = useState<string>(
    benfeitoria?.empresaEleita?.valorContratado ? String(benfeitoria.empresaEleita.valorContratado) : ''
  );
  const [contratadaValorPago, setContratadaValorPago] = useState<string>(
    benfeitoria?.empresaEleita?.valorPago ? String(benfeitoria.empresaEleita.valorPago) : '0'
  );

  // Status 5: Diário de Obra
  const [diarioDescricao, setDiarioDescricao] = useState('');
  const [diarioFoto, setDiarioFoto] = useState('');

  // Status 6: Avaliação
  const [avaliacaoAbertaLocal, setAvaliacaoAbertaLocal] = useState<boolean>(Boolean(benfeitoria?.avaliacaoAberta));
  const [prazoFimAvaliacaoLocal, setPrazoFimAvaliacaoLocal] = useState<string>(benfeitoria?.prazoFimAvaliacao || '');
  const [dispararMsgAvaliacao, setDispararMsgAvaliacao] = useState<boolean>(true);

  // Status 7: Entregue
  const [entregaRelato, setEntregaRelato] = useState('');
  const [entregaFotoDepois, setEntregaFotoDepois] = useState('');

  // Status 8: Cancelamento
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [fotoCancelamento, setFotoCancelamento] = useState('');

  // Estado para expandir detalhes de votação por orçamento no painel admin (para não poluir a tela)
  const [expandedOrcamentoVotos, setExpandedOrcamentoVotos] = useState<string | null>(null);

  if (!isOpen || !benfeitoria) return null;

  const statusAtual = benfeitoria.statusAtual || 'proposta';
  const timeline = benfeitoria.timeline || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await otimizarImagemArquivo(file, { maxBytes: 120 * 1024 });
        setter(result);
      } catch (err) {
        console.error('Erro ao otimizar foto:', err);
      }
    }
  };

  // Salvar novo passo / transição de status
  const handleCriarPasso = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      if (selectedStatus === 'orcamento') {
        // Valida e salva os 3 orçamentos
        const invalid = orcamentosList.some(o => !o.empresaNome.trim() || !o.prazoEntrega || o.valorTotal <= 0);
        if (invalid) {
          setFeedbackMsg({
            tipo: 'error',
            texto: 'Por favor, preencha os dados dos 3 orçamentos (Nome da Empresa, Prazo de Entrega em data e Valor).'
          });
          setIsSubmitting(false);
          return;
        }
        await salvarOrcamentosBenfeitoria(benfeitoria.id, orcamentosList);
      } else if (selectedStatus === 'votacao') {
        await toggleVotacaoBenfeitoria(
          benfeitoria.id,
          votacaoAbertaLocal,
          prazoFimVotacaoLocal,
          dispararMsgVotacao
        );
      } else if (selectedStatus === 'contratada') {
        if (!contratadaNome.trim() || !contratadaInicio || !contratadaTermino || !contratadaValor) {
          setFeedbackMsg({
            tipo: 'error',
            texto: 'Preencha o nome da empresa, data de início, data de término e valor contratado.'
          });
          setIsSubmitting(false);
          return;
        }
        await definirContratacaoBenfeitoria(benfeitoria.id, {
          empresaNome: contratadaNome.trim(),
          dataInicio: contratadaInicio,
          dataTerminoPrevista: contratadaTermino,
          valorContratado: parseFloat(contratadaValor),
          valorPago: parseFloat(contratadaValorPago || '0')
        });
      } else if (selectedStatus === 'execucao') {
        if (!diarioDescricao.trim()) {
          setFeedbackMsg({
            tipo: 'error',
            texto: 'Informe o relato/comentário sobre o andamento da execução da obra.'
          });
          setIsSubmitting(false);
          return;
        }
        await adicionarDiarioObraBenfeitoria(benfeitoria.id, {
          data: stepData || new Date().toLocaleDateString('pt-BR'),
          descricao: diarioDescricao.trim(),
          fotos: diarioFoto ? [diarioFoto] : []
        });
        setDiarioDescricao('');
        setDiarioFoto('');
      } else if (selectedStatus === 'avaliacao') {
        await toggleAvaliacaoBenfeitoria(
          benfeitoria.id,
          avaliacaoAbertaLocal,
          prazoFimAvaliacaoLocal,
          dispararMsgAvaliacao
        );
      } else if (selectedStatus === 'entregue') {
        await concluirBenfeitoriaFinal(benfeitoria.id, {
          fotosDepois: entregaFotoDepois ? [entregaFotoDepois] : undefined,
          relatoFinal: entregaRelato.trim() || undefined,
          dataEntrega: stepData || new Date().toLocaleDateString('pt-BR')
        });
      } else if (selectedStatus === 'cancelada') {
        if (!motivoCancelamento.trim()) {
          setFeedbackMsg({
            tipo: 'error',
            texto: 'Descreva a justificativa clara para o cancelamento / quebra de contrato.'
          });
          setIsSubmitting(false);
          return;
        }
        await cancelarBenfeitoria(benfeitoria.id, {
          motivo: motivoCancelamento.trim(),
          fotos: fotoCancelamento ? [fotoCancelamento] : [],
          dataCancelamento: stepData || new Date().toLocaleDateString('pt-BR')
        });
      } else {
        // Passo genérico / proposta
        await adicionarPassoTimelineBenfeitoria(benfeitoria.id, {
          data: stepData || new Date().toLocaleDateString('pt-BR'),
          status: selectedStatus,
          titulo: stepTitulo.trim() || STATUS_CONFIG[selectedStatus].label,
          descricao: stepDescricao.trim() || STATUS_CONFIG[selectedStatus].desc,
          fotos: stepFoto ? [stepFoto] : []
        });
      }

      setFeedbackMsg({ tipo: 'success', texto: 'Fase / Passo registrado com sucesso!' });
      setTimeout(() => {
        setActiveTab('timeline');
        setFeedbackMsg(null);
      }, 1200);
    } catch (err: any) {
      setFeedbackMsg({ tipo: 'error', texto: err.message || 'Erro ao registrar passo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                Gestão de Ciclo de Vida
              </span>
              <span className="text-xs font-semibold text-amber-100">
                • {benfeitoria.tipo}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              {benfeitoria.titulo}
            </h3>
            <p className="text-xs text-amber-100 line-clamp-1">
              Fase Atual: <strong className="text-white underline">{STATUS_CONFIG[statusAtual]?.label}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Visual de Fases (1 a 7 + 8) */}
        <div className="bg-amber-50/70 border-b border-amber-200 p-3 sm:p-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {(['proposta', 'orcamento', 'votacao', 'contratada', 'execucao', 'avaliacao', 'entregue'] as StatusFaseBenfeitoria[]).map((st, idx) => {
              const isPastOrCurrent = statusAtual === st || (STATUS_CONFIG[statusAtual]?.stepNumber >= idx + 1 && statusAtual !== 'cancelada');
              const isCurrent = statusAtual === st;
              return (
                <div key={st} className="flex-1 flex flex-col items-center text-center relative group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-300 scale-110'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPastOrCurrent && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-bold line-clamp-1 max-w-[85px] ${isCurrent ? 'text-amber-950 font-black' : isPastOrCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                    {STATUS_CONFIG[st].label.split('. ')[1]}
                  </span>
                </div>
              );
            })}

            {statusAtual === 'cancelada' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xs ring-4 ring-rose-300 animate-pulse">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] mt-1 font-black text-rose-700">Cancelado</span>
              </div>
            )}
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Linha do Tempo ({timeline.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('novo_passo')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'novo_passo'
                ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Passo / Alterar Fase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('votos_avaliacoes')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'votos_avaliacoes'
                ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Apuração de Votos & Avaliações</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {feedbackMsg && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold border flex items-center gap-2 animate-in fade-in duration-200 ${
                feedbackMsg.tipo === 'success'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              {feedbackMsg.tipo === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMsg.texto}</span>
            </div>
          )}

          {/* TAB 1: LINHA DO TEMPO */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-6">
                  <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-slate-900">Nenhum evento registrado na timeline</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Adicione o primeiro passo ou altere a fase da benfeitoria na aba "Adicionar Passo / Alterar Fase".
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-300">
                  {timeline.map((step, idx) => {
                    const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.proposta;
                    return (
                      <div key={step.id || idx} className="relative group">
                        {/* Marcador na Linha */}
                        <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center shadow-xs">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                        </div>

                        {/* Card do Passo */}
                        <div className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                              {cfg.label}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{step.data}</span>
                              {step.criadoPor && (
                                <span className="text-[11px] text-slate-400 font-semibold">• por {step.criadoPor}</span>
                              )}
                            </div>
                          </div>

                          <h5 className="text-sm sm:text-base font-black text-slate-950">
                            {step.titulo}
                          </h5>

                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {step.descricao}
                          </p>

                          {step.fotos && step.fotos.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {step.fotos.map((img, i) => (
                                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center p-1">
                                  <img src={img} alt="Foto do passo" className="w-full h-full object-contain" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADICIONAR PASSO / ALTERAR FASE */}
          {activeTab === 'novo_passo' && (
            <form onSubmit={handleCriarPasso} className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
                  Selecione a Fase / Status do Novo Evento
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(STATUS_CONFIG) as StatusFaseBenfeitoria[]).map((key) => {
                    const item = STATUS_CONFIG[key];
                    const isSelected = selectedStatus === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedStatus(key)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-black transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                        }`}
                      >
                        <span className="text-[10px] opacity-80">Fase {item.stepNumber}</span>
                        <span className="line-clamp-1">{item.label.split('. ')[1] || item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-amber-900 font-semibold italic">
                  💡 {STATUS_CONFIG[selectedStatus]?.desc}
                </p>
              </div>

              {/* Data do Evento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data do Registro / Evento</label>
                  <input
                    type="text"
                    value={stepData}
                    onChange={(e) => setStepData(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* CAMPOS ESPECÍFICOS POR STATUS */}

              {/* STATUS 2: TRÊS ORÇAMENTOS */}
              {selectedStatus === 'orcamento' && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-sky-600" />
                      Cadastro dos 3 Orçamentos Comparativos
                    </h4>
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      Obrigatório 3 orçamentos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {orcamentosList.map((orc, index) => (
                      <div
                        key={orc.id}
                        className="bg-white border-2 border-sky-100 hover:border-sky-300 rounded-2xl p-3.5 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between border-b border-sky-100 pb-1.5">
                          <span className="text-xs font-black text-sky-950 uppercase">
                            Orçamento #{index + 1}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">Opção {orc.id}</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Empresa Fornecedora *</label>
                          <input
                            type="text"
                            value={orc.empresaNome}
                            onChange={(e) => {
                              const novaLista = [...orcamentosList];
                              novaLista[index].empresaNome = e.target.value;
                              setOrcamentosList(novaLista);
                            }}
                            placeholder="Nome da empresa"
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            Prazo de Entrega (Data de Término) *
                          </label>
                          <input
                            type="date"
                            value={orc.prazoEntrega}
                            onChange={(e) => {
                              const novaLista = [...orcamentosList];
                              novaLista[index].prazoEntrega = e.target.value;
                              setOrcamentosList(novaLista);
                            }}
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden bg-slate-50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Valor Total (R$) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={orc.valorTotal || ''}
                            onChange={(e) => {
                              const novaLista = [...orcamentosList];
                              novaLista[index].valorTotal = parseFloat(e.target.value) || 0;
                              setOrcamentosList(novaLista);
                            }}
                            placeholder="0,00"
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Forma de Pagamento *</label>
                          <input
                            type="text"
                            value={orc.formaPagamento}
                            onChange={(e) => {
                              const novaLista = [...orcamentosList];
                              novaLista[index].formaPagamento = e.target.value;
                              setOrcamentosList(novaLista);
                            }}
                            placeholder="Ex: Entrada 30% + 3x boleto"
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Site / Link da Empresa</label>
                          <input
                            type="url"
                            value={orc.site || ''}
                            onChange={(e) => {
                              const novaLista = [...orcamentosList];
                              novaLista[index].site = e.target.value;
                              setOrcamentosList(novaLista);
                            }}
                            placeholder="https://..."
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden"
                          />
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={orc.jaPrestouServico}
                              onChange={(e) => {
                                const novaLista = [...orcamentosList];
                                novaLista[index].jaPrestouServico = e.target.checked;
                                setOrcamentosList(novaLista);
                              }}
                              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                            <span className="text-[11px] font-bold text-slate-800">
                              Já prestou serviço antes?
                            </span>
                          </label>

                          {orc.jaPrestouServico ? (
                            <div className="space-y-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                              <label className="text-[10px] font-bold text-amber-950 flex items-center justify-between">
                                <span>Avaliação Anterior dos Condôminos:</span>
                                <span className="font-black text-amber-700 flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {orc.avaliacaoMediaAnterior || 5}
                                </span>
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={orc.avaliacaoMediaAnterior || 5}
                                onChange={(e) => {
                                  const novaLista = [...orcamentosList];
                                  novaLista[index].avaliacaoMediaAnterior = parseFloat(e.target.value);
                                  setOrcamentosList(novaLista);
                                }}
                                className="w-full accent-amber-600"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500 block italic">
                              Primeira contratação (sem histórico prévio).
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATUS 3: VOTAÇÃO ELETRÔNICA */}
              {selectedStatus === 'votacao' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Configurar Período de Votação Eletrônica
                      </h4>
                      <p className="text-xs text-amber-900 mt-0.5">
                        O administrador tem total controle para abrir a votação aos moradores ou optar pela contratação monocrática direta.
                      </p>
                    </div>

                    {/* Switch ON/OFF */}
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                      <span className="text-xs font-black text-slate-800">
                        {votacaoAbertaLocal ? 'VOTAÇÃO ATIVA (ON)' : 'VOTAÇÃO FECHADA (OFF)'}
                      </span>
                      <input
                        type="checkbox"
                        checked={votacaoAbertaLocal}
                        onChange={(e) => setVotacaoAbertaLocal(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-9 h-5 rounded-full transition-colors relative ${votacaoAbertaLocal ? 'bg-amber-600' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${votacaoAbertaLocal ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Data Limite da Votação</label>
                      <input
                        type="date"
                        value={prazoFimVotacaoLocal}
                        onChange={(e) => setPrazoFimVotacaoLocal(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-amber-200">
                        <input
                          type="checkbox"
                          checked={dispararMsgVotacao}
                          onChange={(e) => setDispararMsgVotacao(e.target.checked)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Send className="w-3.5 h-3.5 text-amber-600" />
                          Disparar mensagem coletiva aos moradores
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950">
                    <strong>Opção de Contratação Monocrática:</strong> Se o síndico preferir não abrir para votação, basta manter a chave desligada e avançar diretamente para a fase <strong>4. Empresa Contratada</strong>.
                  </div>
                </div>
              )}

              {/* STATUS 4: EMPRESA CONTRATADA */}
              {selectedStatus === 'contratada' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-4">
                  <h4 className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    Dados da Empresa Contratada
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nome da Empresa Contratada *</label>
                      <input
                        type="text"
                        value={contratadaNome}
                        onChange={(e) => setContratadaNome(e.target.value)}
                        placeholder="Razão Social ou Nome Fantasia"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Valor Total Contratado (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={contratadaValor}
                        onChange={(e) => setContratadaValor(e.target.value)}
                        placeholder="0,00"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Data de Início das Obras *</label>
                      <input
                        type="date"
                        value={contratadaInicio}
                        onChange={(e) => setContratadaInicio(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Data Prevista de Término *</label>
                      <input
                        type="date"
                        value={contratadaTermino}
                        onChange={(e) => setContratadaTermino(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Valor Já Pago até o Momento (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={contratadaValorPago}
                        onChange={(e) => setContratadaValorPago(e.target.value)}
                        placeholder="Ex: 5000,00 referente a entrada"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS 5: EM EXECUÇÃO */}
              {selectedStatus === 'execucao' && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-4">
                  <h4 className="text-sm font-black text-orange-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Diário de Bordo & Atualização da Execução
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Comentário / Relato do Andamento da Obra *
                    </label>
                    <textarea
                      rows={3}
                      value={diarioDescricao}
                      onChange={(e) => setDiarioDescricao(e.target.value)}
                      placeholder="Descreva o avanço da obra nesta etapa (ex: lixamento finalizado, início da primeira demão de tinta...)"
                      className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Foto do Andamento da Obra</label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-orange-500 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2 shadow-2xs">
                        <Upload className="w-4 h-4 text-orange-600" />
                        <span>Selecionar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setDiarioFoto)}
                          className="sr-only"
                        />
                      </label>
                      {diarioFoto && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-orange-300 bg-slate-900 flex items-center justify-center">
                          <img src={diarioFoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS 6: AVALIAÇÃO DOS CONDÔMINOS */}
              {selectedStatus === 'avaliacao' && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-purple-600" />
                        Abrir Avaliação dos Condôminos (1 a 5 Estrelas)
                      </h4>
                      <p className="text-xs text-purple-900 mt-0.5">
                        Permita que cada morador dê sua nota de satisfação sobre a qualidade do trabalho executado pela empresa.
                      </p>
                    </div>

                    {/* Switch ON/OFF */}
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-purple-300 shadow-2xs">
                      <span className="text-xs font-black text-slate-800">
                        {avaliacaoAbertaLocal ? 'AVALIAÇÃO ATIVA (ON)' : 'AVALIAÇÃO FECHADA (OFF)'}
                      </span>
                      <input
                        type="checkbox"
                        checked={avaliacaoAbertaLocal}
                        onChange={(e) => setAvaliacaoAbertaLocal(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-9 h-5 rounded-full transition-colors relative ${avaliacaoAbertaLocal ? 'bg-purple-600' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${avaliacaoAbertaLocal ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Data Limite para Avaliação</label>
                      <input
                        type="date"
                        value={prazoFimAvaliacaoLocal}
                        onChange={(e) => setPrazoFimAvaliacaoLocal(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-purple-200">
                        <input
                          type="checkbox"
                          checked={dispararMsgAvaliacao}
                          onChange={(e) => setDispararMsgAvaliacao(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Send className="w-3.5 h-3.5 text-purple-600" />
                          Enviar mensagem coletiva alertando sobre a entrega
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS 7: ENTREGUE & PUBLICADA */}
              {selectedStatus === 'entregue' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-4">
                  <h4 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Publicação Oficial da Benfeitoria Concluída
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Relato Final da Gestão</label>
                    <textarea
                      rows={3}
                      value={entregaRelato}
                      onChange={(e) => setEntregaRelato(e.target.value)}
                      placeholder="Resumo do benefício entregue, cumprimento de prazos e prestação de contas..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Foto da Obra Concluída (Depois)</label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2 shadow-2xs">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Selecionar Foto da Entrega</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setEntregaFotoDepois)}
                          className="sr-only"
                        />
                      </label>
                      {entregaFotoDepois && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 bg-slate-900 flex items-center justify-center">
                          <img src={entregaFotoDepois} alt="Preview Concluído" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS 8: CANCELADO / QUEBRA DE CONTRATO */}
              {selectedStatus === 'cancelada' && (
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h4 className="text-sm font-black text-red-950 uppercase tracking-wide">
                      Rescisão Contratual / Cancelamento de Obra
                    </h4>
                  </div>

                  <p className="text-xs text-red-800 font-semibold">
                    Esta fase deve registrar com total transparência e rigor as fotos e justificativas da quebra de contrato.
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-950">
                      Justificativa Detalhada da Quebra de Contrato *
                    </label>
                    <textarea
                      rows={4}
                      value={motivoCancelamento}
                      onChange={(e) => setMotivoCancelamento(e.target.value)}
                      placeholder="Descreva detalhadamente o ocorrido (abandono de obra, descumprimento de prazos, notificações enviadas, medidas jurídicas tomadas)..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-red-300 focus:border-red-600 outline-hidden bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-950">
                      Fotos / Documentos Comprobatórios da Quebra de Contrato
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-xl bg-white border border-red-300 hover:border-red-600 text-xs font-bold text-red-800 cursor-pointer flex items-center gap-2 shadow-2xs">
                        <Upload className="w-4 h-4 text-red-600" />
                        <span>Carregar Foto Probatória</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setFotoCancelamento)}
                          className="sr-only"
                        />
                      </label>
                      {fotoCancelamento && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-red-400 bg-slate-900 flex items-center justify-center">
                          <img src={fotoCancelamento} alt="Evidência" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Envio */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-black hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Fechar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Salvar Fase & Adicionar à Timeline</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: APURAÇÃO DE VOTOS & AVALIAÇÕES */}
          {activeTab === 'votos_avaliacoes' && (
            <div className="space-y-6">
              
              {/* Seção 1: Votação dos Orçamentos */}
              <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" />
                      Apuração dos Votos por Orçamento
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      Total de Votos Registrados: <strong>{benfeitoria.votos?.length || 0}</strong>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                    benfeitoria.votacaoAberta ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {benfeitoria.votacaoAberta ? 'Votação Aberta' : 'Votação Encerrada'}
                  </span>
                </div>

                {(!benfeitoria.orcamentos || benfeitoria.orcamentos.length === 0) ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Nenhum orçamento comparativo cadastrado nesta benfeitoria ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {benfeitoria.orcamentos.map((orc) => {
                      const votosDesteOrc = (benfeitoria.votos || []).filter(v => v.orcamentoIdEscolhido === orc.id);
                      const isExpanded = expandedOrcamentoVotos === orc.id;
                      const percentual = benfeitoria.votos && benfeitoria.votos.length > 0
                        ? Math.round((votosDesteOrc.length / benfeitoria.votos.length) * 100)
                        : 0;

                      return (
                        <div
                          key={orc.id}
                          className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md mr-2">
                                Opção {orc.id}
                              </span>
                              <strong className="text-xs sm:text-sm font-black text-slate-900">
                                {orc.empresaNome || `Empresa ${orc.id}`}
                              </strong>
                              <span className="text-xs text-slate-500 font-bold ml-2">
                                • R$ {orc.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg">
                                {votosDesteOrc.length} {votosDesteOrc.length === 1 ? 'voto' : 'votos'} ({percentual}%)
                              </span>

                              {/* Accordion / Toggle para não poluir a tela */}
                              <button
                                type="button"
                                onClick={() => setExpandedOrcamentoVotos(isExpanded ? null : orc.id)}
                                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                                title="Ver quais moradores votaram"
                              >
                                <span>{isExpanded ? 'Recolher' : 'Ver Votantes'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Barra de Progresso do Voto */}
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentual}%` }}
                            />
                          </div>

                          {/* Lista detalhada expandida (Admin view) */}
                          {isExpanded && (
                            <div className="pt-2 border-t border-slate-200 space-y-1.5 animate-in fade-in duration-150">
                              <p className="text-[10px] font-black uppercase text-slate-500">
                                Moradores que votaram neste orçamento:
                              </p>
                              {votosDesteOrc.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Nenhum morador votou nesta opção ainda.</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {votosDesteOrc.map((v, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200 shadow-2xs font-semibold">
                                      <span className="text-slate-900 font-bold">{v.moradorNome}</span>
                                      <span className="text-amber-800 font-extrabold">{v.unidade}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Seção 2: Avaliações dos Condôminos (1 a 5 Estrelas) */}
              <div className="bg-white border border-purple-200 rounded-2xl p-4 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                      Avaliações da Obra / Serviço Entregue
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      Média Geral:{' '}
                      <strong className="text-purple-950 font-black text-sm">
                        {benfeitoria.notaMediaFinal ? `${benfeitoria.notaMediaFinal} ★` : 'Ainda sem avaliações'}
                      </strong>{' '}
                      ({benfeitoria.avaliacoes?.length || 0} avaliações)
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                    benfeitoria.avaliacaoAberta ? 'bg-purple-100 text-purple-950 border-purple-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {benfeitoria.avaliacaoAberta ? 'Avaliação Aberta' : 'Avaliação Encerrada'}
                  </span>
                </div>

                {(!benfeitoria.avaliacoes || benfeitoria.avaliacoes.length === 0) ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Nenhum morador enviou avaliação de estrelas para esta obra até o momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {benfeitoria.avaliacoes.map((av, idx) => (
                      <div key={idx} className="bg-purple-50/50 border border-purple-200 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">
                            {av.moradorNome} ({av.unidade})
                          </span>
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= av.nota ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {av.comentario && (
                          <p className="text-xs text-slate-700 italic">"{av.comentario}"</p>
                        )}

                        <span className="text-[10px] text-slate-400 font-semibold block">
                          {av.dataAvaliacao}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
