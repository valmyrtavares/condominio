import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import {
  Benfeitoria,
  StatusFaseBenfeitoria,
  OrcamentoBenfeitoria,
  PassoTimelineBenfeitoria,
  ApoiadorDetalhe
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
  Award,
  ThumbsUp,
  MessageSquare,
  User,
  Trash2
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
    benfeitorias,
    adicionarPassoTimelineBenfeitoria,
    editarBenfeitoria,
    salvarOrcamentosBenfeitoria,
    toggleVotacaoBenfeitoria,
    definirContratacaoBenfeitoria,
    adicionarDiarioObraBenfeitoria,
    apoiarDiarioObraBenfeitoria,
    adicionarComentarioDiarioObraBenfeitoria,
    excluirDiarioObraBenfeitoria,
    excluirComentarioDiarioObraBenfeitoria,
    toggleAvaliacaoBenfeitoria,
    cancelarBenfeitoria,
    concluirBenfeitoriaFinal,
    currentUser
  } = useCondo();

  const activeBenfeitoria = (benfeitoria?.id ? benfeitorias.find(b => b.id === benfeitoria.id) : null) || benfeitoria;

  const [activeTab, setActiveTab] = useState<'timeline' | 'novo_passo' | 'votos_avaliacoes'>(initialTab);
  const [selectedStatus, setSelectedStatus] = useState<StatusFaseBenfeitoria>(() => getProximaFaseSugerida(activeBenfeitoria?.statusAtual));

  const [stepTitulo, setStepTitulo] = useState('');
  const [stepDescricao, setStepDescricao] = useState('');
  const [stepData, setStepData] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [stepFoto, setStepFoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Status 1: Proposta
  const [propostaTitulo, setPropostaTitulo] = useState(benfeitoria?.titulo || '');
  const [propostaSubtitulo, setPropostaSubtitulo] = useState(benfeitoria?.subtitulo || '');
  const [propostaDescricao, setPropostaDescricao] = useState(benfeitoria?.descricao || '');
  const [propostaImpacto, setPropostaImpacto] = useState(benfeitoria?.impactoGestao || '');
  const [propostaInvestimento, setPropostaInvestimento] = useState(benfeitoria?.investimento ? String(benfeitoria.investimento) : '');
  const [propostaEconomia, setPropostaEconomia] = useState(benfeitoria?.economiaMensal ? String(benfeitoria.economiaMensal) : '');
  const [propostaRegras, setPropostaRegras] = useState(benfeitoria?.regrasUso || '');
  const [propostaFoto, setPropostaFoto] = useState(benfeitoria?.fotos?.[0] || '');

  // Status 2: Três Orçamentos
  const [orcamentosList, setOrcamentosList] = useState<OrcamentoBenfeitoria[]>(() => {
    if (benfeitoria?.orcamentos && benfeitoria.orcamentos.length === 3) {
      return benfeitoria.orcamentos;
    }
    return [
      { id: '1', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 },
      { id: '2', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 },
      { id: '3', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 }
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

  // Estados para Diário de Obra (Comentários e Apoiadores)
  const [expandedDiarioComments, setExpandedDiarioComments] = useState<Record<string, boolean>>({});
  const [expandedDiarioApoiadores, setExpandedDiarioApoiadores] = useState<Record<string, boolean>>({});
  const [diarioCommentsInput, setDiarioCommentsInput] = useState<Record<string, string>>({});

  // Sincronização completa de todos os campos sempre que a benfeitoria abrir ou atualizar
  React.useEffect(() => {
    if (isOpen && benfeitoria) {
      setActiveTab(initialTab);
      setSelectedStatus(getProximaFaseSugerida(benfeitoria.statusAtual));

      // Fase 1: Proposta
      setPropostaTitulo(benfeitoria.titulo || '');
      setPropostaSubtitulo(benfeitoria.subtitulo || '');
      setPropostaDescricao(benfeitoria.descricao || '');
      setPropostaImpacto(benfeitoria.impactoGestao || '');
      setPropostaInvestimento(benfeitoria.investimento ? String(benfeitoria.investimento) : '');
      setPropostaEconomia(benfeitoria.economiaMensal ? String(benfeitoria.economiaMensal) : '');
      setPropostaRegras(benfeitoria.regrasUso || '');
      setPropostaFoto(benfeitoria.fotos?.[0] || '');

      // Fase 2: Orçamentos
      if (benfeitoria.orcamentos && benfeitoria.orcamentos.length === 3) {
        setOrcamentosList(benfeitoria.orcamentos);
      } else {
        setOrcamentosList([
          { id: '1', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 },
          { id: '2', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 },
          { id: '3', empresaNome: '', site: '', prazoEntrega: '', valorTotal: 0, formaPagamento: '', jaPrestouServico: false, avaliacaoMediaAnterior: 5 }
        ]);
      }

      // Fase 3: Votação
      setVotacaoAbertaLocal(benfeitoria.votacaoAberta !== undefined ? Boolean(benfeitoria.votacaoAberta) : true);
      setPrazoFimVotacaoLocal(benfeitoria.prazoFimVotacao || '');

      // Fase 4: Contratação
      setContratadaNome(benfeitoria.empresaEleita?.empresaNome || '');
      setContratadaInicio(benfeitoria.empresaEleita?.dataInicio || '');
      setContratadaTermino(benfeitoria.empresaEleita?.dataTerminoPrevista || '');
      setContratadaValor(benfeitoria.empresaEleita?.valorContratado ? String(benfeitoria.empresaEleita.valorContratado) : '');
      setContratadaValorPago(benfeitoria.empresaEleita?.valorPago ? String(benfeitoria.empresaEleita.valorPago) : '0');

      // Fase 6: Avaliação
      setAvaliacaoAbertaLocal(benfeitoria.avaliacaoAberta !== undefined ? Boolean(benfeitoria.avaliacaoAberta) : true);
      setPrazoFimAvaliacaoLocal(benfeitoria.prazoFimAvaliacao || '');

      // Fase 7: Entregue
      setEntregaRelato(benfeitoria.descricao || '');
      setEntregaFotoDepois(benfeitoria.fotos?.[0] || '');

      // Fase 8: Cancelamento
      setMotivoCancelamento(benfeitoria.cancelamentoInfo?.motivo || '');
      setFotoCancelamento(benfeitoria.cancelamentoInfo?.fotos?.[0] || '');
    }
  }, [isOpen, initialTab, benfeitoria]);

  if (!isOpen || !activeBenfeitoria) return null;

  const statusAtual = activeBenfeitoria.statusAtual || 'proposta';
  const timeline = activeBenfeitoria.timeline || [];
  const diarioObrasList = activeBenfeitoria.diarioObras || [];

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

  const irParaFase = (fase: StatusFaseBenfeitoria) => {
    setSelectedStatus(fase);
    if (fase === 'avaliacao') {
      setAvaliacaoAbertaLocal(prev => (activeBenfeitoria?.avaliacaoAberta !== undefined ? Boolean(activeBenfeitoria.avaliacaoAberta) : true));
    } else if (fase === 'votacao') {
      setVotacaoAbertaLocal(prev => (activeBenfeitoria?.votacaoAberta !== undefined ? Boolean(activeBenfeitoria.votacaoAberta) : true));
    }
    setActiveTab('novo_passo');
    setFeedbackMsg(null);
  };

  // Salvar novo passo / transição de status
  const handleCriarPasso = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      if (selectedStatus === 'proposta') {
        if (!propostaTitulo.trim() || !propostaDescricao.trim() || !propostaImpacto.trim()) {
          setFeedbackMsg({
            tipo: 'error',
            texto: 'Por favor, preencha o Título, Descrição e Impacto na Gestão da proposta.'
          });
          setIsSubmitting(false);
          return;
        }
        await editarBenfeitoria(activeBenfeitoria.id, {
          titulo: propostaTitulo.trim(),
          subtitulo: propostaSubtitulo.trim() || activeBenfeitoria.subtitulo,
          descricao: propostaDescricao.trim(),
          impactoGestao: propostaImpacto.trim(),
          investimento: propostaInvestimento ? parseFloat(propostaInvestimento) : undefined,
          economiaMensal: propostaEconomia ? parseFloat(propostaEconomia) : undefined,
          regrasUso: propostaRegras.trim() || undefined,
          fotos: propostaFoto ? [propostaFoto] : activeBenfeitoria.fotos
        });
      } else if (selectedStatus === 'orcamento') {
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
        await salvarOrcamentosBenfeitoria(activeBenfeitoria.id, orcamentosList);
      } else if (selectedStatus === 'votacao') {
        await toggleVotacaoBenfeitoria(
          activeBenfeitoria.id,
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
        await definirContratacaoBenfeitoria(activeBenfeitoria.id, {
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
        await adicionarDiarioObraBenfeitoria(activeBenfeitoria.id, {
          data: stepData || new Date().toLocaleDateString('pt-BR'),
          descricao: diarioDescricao.trim(),
          fotos: diarioFoto ? [diarioFoto] : []
        });
        setDiarioDescricao('');
        setDiarioFoto('');
      } else if (selectedStatus === 'avaliacao') {
        await toggleAvaliacaoBenfeitoria(
          activeBenfeitoria.id,
          avaliacaoAbertaLocal,
          prazoFimAvaliacaoLocal,
          dispararMsgAvaliacao
        );
      } else if (selectedStatus === 'entregue') {
        await concluirBenfeitoriaFinal(activeBenfeitoria.id, {
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
        await cancelarBenfeitoria(activeBenfeitoria.id, {
          motivo: motivoCancelamento.trim(),
          fotos: fotoCancelamento ? [fotoCancelamento] : [],
          dataCancelamento: stepData || new Date().toLocaleDateString('pt-BR')
        });
      } else {
        // Passo genérico
        const cfg = STATUS_CONFIG[selectedStatus as StatusFaseBenfeitoria] || STATUS_CONFIG.proposta;
        await adicionarPassoTimelineBenfeitoria(activeBenfeitoria.id, {
          data: stepData || new Date().toLocaleDateString('pt-BR'),
          status: selectedStatus as StatusFaseBenfeitoria,
          titulo: stepTitulo.trim() || cfg.label,
          descricao: stepDescricao.trim() || cfg.desc,
          fotos: stepFoto ? [stepFoto] : []
        });
      }

      setFeedbackMsg({ tipo: 'success', texto: 'Fase / Dados salvos e sincronizados com sucesso!' });
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
                • {activeBenfeitoria.tipo}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              {activeBenfeitoria.titulo}
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

        {/* Stepper Visual Interativo de Fases (1 a 7 + 8) */}
        <div className="bg-amber-50/70 border-b border-amber-200 p-3 sm:p-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {(['proposta', 'orcamento', 'votacao', 'contratada', 'execucao', 'avaliacao', 'entregue'] as StatusFaseBenfeitoria[]).map((st, idx) => {
              const isPastOrCurrent = statusAtual === st || (STATUS_CONFIG[statusAtual]?.stepNumber >= idx + 1 && statusAtual !== 'cancelada');
              const isCurrent = statusAtual === st;
              const isSelectedInEditor = activeTab === 'novo_passo' && selectedStatus === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => irParaFase(st)}
                  className="flex-1 flex flex-col items-center text-center relative group cursor-pointer hover:opacity-85 transition-all outline-none"
                  title={`Clique para abrir/editar a Fase ${idx + 1}: ${STATUS_CONFIG[st].label}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-xs ${
                      isSelectedInEditor
                        ? 'bg-amber-600 text-white ring-4 ring-amber-400 scale-115'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white hover:ring-2 hover:ring-emerald-300'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {isPastOrCurrent && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-bold line-clamp-1 max-w-[85px] ${
                    isSelectedInEditor
                      ? 'text-amber-950 font-black underline decoration-2'
                      : isCurrent
                      ? 'text-amber-950 font-black'
                      : isPastOrCurrent
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}>
                    {STATUS_CONFIG[st].label.split('. ')[1]}
                  </span>
                </button>
              );
            })}

            {statusAtual === 'cancelada' && (
              <button
                type="button"
                onClick={() => irParaFase('cancelada')}
                className="flex flex-col items-center text-center cursor-pointer hover:opacity-85"
                title="Clique para ver os detalhes do cancelamento"
              >
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xs ring-4 ring-rose-300 animate-pulse">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] mt-1 font-black text-rose-700">Cancelado</span>
              </button>
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
            <span>Consultar / Editar Fase ({STATUS_CONFIG[selectedStatus]?.stepNumber || '•'})</span>
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
                    Adicione o primeiro passo ou altere a fase da benfeitoria na aba "Consultar / Editar Fase".
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

                        {/* Card do Passo com Botão de Ação Direta */}
                        <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-2.5">
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
                            <div className="flex flex-wrap gap-2 pt-1">
                              {step.fotos.map((img, i) => (
                                <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center p-1">
                                  <img src={img} alt="Foto do passo" className="w-full h-full object-contain" />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Botão de Consulta / Edição da Fase */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">
                              {step.status === 'orcamento' && activeBenfeitoria.orcamentos?.length ? `${activeBenfeitoria.orcamentos.length} orçamentos vinculados` : 'Etapa registrada'}
                            </span>
                            <button
                              type="button"
                              onClick={() => irParaFase(step.status)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
                            >
                              <span>Consultar / Editar Fase {STATUS_CONFIG[step.status]?.stepNumber || ''}</span>
                              <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                            </button>
                          </div>
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

              {/* STATUS 1: PROPOSTA DE MELHORIA */}
              {selectedStatus === 'proposta' && (
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                    <h4 className="text-sm font-black text-rose-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      Fase 1: Dados da Proposta de Melhoria
                    </h4>
                    <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Edição & Consulta da Ideia Inicial
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Título da Benfeitoria *</label>
                      <input
                        type="text"
                        value={propostaTitulo}
                        onChange={(e) => setPropostaTitulo(e.target.value)}
                        placeholder="Ex: Reforma da Fachada"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Subtítulo / Chamada Rápida</label>
                      <input
                        type="text"
                        value={propostaSubtitulo}
                        onChange={(e) => setPropostaSubtitulo(e.target.value)}
                        placeholder="Ex: Pintura completa e impermeabilização"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Descrição Detalhada & Escopo *</label>
                      <textarea
                        rows={3}
                        value={propostaDescricao}
                        onChange={(e) => setPropostaDescricao(e.target.value)}
                        placeholder="Descreva a finalidade, problemas atuais e benefícios..."
                        className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Impacto na Gestão & Contas *</label>
                      <input
                        type="text"
                        value={propostaImpacto}
                        onChange={(e) => setPropostaImpacto(e.target.value)}
                        placeholder="Ex: Realizado com fundo de reserva, sem chamada extra"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Estimativa de Investimento (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={propostaInvestimento}
                        onChange={(e) => setPropostaInvestimento(e.target.value)}
                        placeholder="0,00"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Economia Mensal Estimada (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={propostaEconomia}
                        onChange={(e) => setPropostaEconomia(e.target.value)}
                        placeholder="0,00"
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-hidden bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Foto Ilustrativa / Estado Inicial</label>
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-rose-500 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2 shadow-2xs">
                          <Upload className="w-4 h-4 text-rose-600" />
                          <span>Selecionar Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setPropostaFoto)}
                            className="sr-only"
                          />
                        </label>
                        {propostaFoto && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-rose-300 bg-slate-900 flex items-center justify-center">
                            <img src={propostaFoto} alt="Preview Proposta" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('votos_avaliacoes')}
                      className="text-xs font-extrabold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Users className="w-4 h-4" />
                      <span>Ir para Apuração dos Votos ({activeBenfeitoria.votos?.length || 0})</span>
                    </button>
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
                <div className="space-y-4">
                  {/* Formulário de Novo Registro no Diário */}
                  <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-orange-950 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-600" />
                        Novo Registro no Diário de Bordo & Execução da Obra
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200 text-orange-950 border border-orange-300">
                        Fase 5 • Em Andamento
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Comentário / Relato do Andamento da Obra *
                      </label>
                      <textarea
                        rows={3}
                        value={diarioDescricao}
                        onChange={(e) => setDiarioDescricao(e.target.value)}
                        placeholder="Descreva o avanço da obra nesta etapa (ex: lixamento finalizado, início da primeira demão de tinta...)"
                        className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-hidden bg-white shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Foto do Andamento da Obra</label>
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-orange-500 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2 shadow-2xs transition-colors">
                          <Upload className="w-4 h-4 text-orange-600" />
                          <span>{diarioFoto ? 'Trocar Foto' : 'Selecionar Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setDiarioFoto)}
                            className="sr-only"
                          />
                        </label>
                        {diarioFoto && (
                          <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-orange-300 bg-slate-900 flex items-center justify-center shadow-2xs">
                            <img src={diarioFoto} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setDiarioFoto('')}
                              className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition-opacity"
                            >
                              Remover
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Histórico Completo do Diário de Obras (com Apoios e Manifestações dos Moradores) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                      <span className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-600" />
                        Histórico de Registros Publicados da Obra ({diarioObrasList.length})
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Visível para todos os moradores no app
                      </span>
                    </div>

                    {diarioObrasList.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4">
                        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                        <h5 className="text-xs font-black text-slate-800">Nenhum registro no diário publicado ainda</h5>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                          Preencha o relato acima e clique em "Salvar Fase & Adicionar à Timeline" para publicar a primeira atualização da obra.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {diarioObrasList.map((diario) => {
                          const userIdentifier = currentUser.id || currentUser.unidade || currentUser.email || 'usr-anon';
                          const isApoiadoPorMim = (diario.apoiadores || []).includes(userIdentifier) || 
                            (diario.apoiadoresDetalhes || []).some(a => a.id === userIdentifier);

                          const apoiadoresLista: ApoiadorDetalhe[] = Array.isArray(diario.apoiadoresDetalhes) && diario.apoiadoresDetalhes.length > 0
                            ? diario.apoiadoresDetalhes
                            : (diario.apoiadores || []).map(id => ({ id, nome: 'Morador', unidade: id, foto: '' }));

                          const comentariosLista = Array.isArray(diario.comentarios) ? diario.comentarios : [];
                          const isCommentsOpen = expandedDiarioComments[diario.id] !== false; // default aberto
                          const isApoiadoresOpen = Boolean(expandedDiarioApoiadores[diario.id]);

                          return (
                            <div
                              key={diario.id}
                              className="bg-white p-4 rounded-2xl border border-orange-200 shadow-xs space-y-3 hover:border-orange-300 transition-colors"
                            >
                              {/* Header do Registro */}
                              <div className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-1.5 text-orange-950">
                                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                  <span>{diario.data}</span>
                                  {diario.autorNome && (
                                    <span className="text-slate-500 font-semibold">• por {diario.autorNome}</span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm('Tem certeza que deseja excluir esta atualização do diário de obra?')) {
                                      await excluirDiarioObraBenfeitoria(activeBenfeitoria.id, diario.id);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Excluir este registro do diário"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Descrição do Andamento */}
                              <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                                {diario.descricao}
                              </p>

                              {/* Fotos Anexadas */}
                              {diario.fotos && diario.fotos.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                  {diario.fotos.map((f, i) => (
                                    <div
                                      key={i}
                                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-orange-200 bg-slate-950 flex items-center justify-center p-1 shadow-2xs cursor-pointer"
                                      onClick={() => window.open(f, '_blank')}
                                      title="Clique para ampliar a foto"
                                    >
                                      <img src={f} alt="Diário" className="w-full h-full object-contain" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Barra de Apoio e Toggle de Comentários */}
                              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                                
                                {/* Botão de Apoio + Thumbnails */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => apoiarDiarioObraBenfeitoria(activeBenfeitoria.id, diario.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-2xs active:scale-95 cursor-pointer ${
                                      isApoiadoPorMim
                                        ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/20'
                                        : 'bg-white hover:bg-amber-50 text-amber-950 border border-amber-300'
                                    }`}
                                    title={isApoiadoPorMim ? "Você apoiou esta atualização" : "Apoiar esta atualização da obra"}
                                  >
                                    <ThumbsUp className={`w-3.5 h-3.5 ${isApoiadoPorMim ? 'fill-slate-950 stroke-[2.5]' : ''}`} />
                                    <span>{isApoiadoPorMim ? 'Apoiado' : 'Apoiar'}</span>
                                    <span className="ml-0.5 px-1.5 py-0.2 bg-black/10 rounded-full text-[10px]">
                                      {diario.apoiosCount || apoiadoresLista.length || 0}
                                    </span>
                                  </button>

                                  {/* Thumbnails dos Apoiadores Empilhados */}
                                  {apoiadoresLista.length > 0 && (
                                    <div className="flex items-center">
                                      <div className="flex -space-x-2 overflow-hidden py-0.5 pl-1">
                                        {apoiadoresLista.slice(0, 4).map((apoiador, idx) => (
                                          apoiador.foto ? (
                                            <img
                                              key={apoiador.id || idx}
                                              src={apoiador.foto}
                                              alt={apoiador.nome}
                                              title={`${apoiador.nome} (${apoiador.unidade || 'Morador'})`}
                                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                                            />
                                          ) : (
                                            <div
                                              key={apoiador.id || idx}
                                              title={`${apoiador.nome} (${apoiador.unidade || 'Morador'})`}
                                              className="inline-flex h-6 w-6 rounded-full ring-2 ring-white bg-amber-500 text-slate-950 font-black text-[9px] items-center justify-center shadow-2xs"
                                            >
                                              {apoiador.nome ? apoiador.nome.substring(0, 2).toUpperCase() : 'MO'}
                                            </div>
                                          )
                                        ))}
                                      </div>

                                      {apoiadoresLista.length > 4 && (
                                        <span className="text-[10px] font-extrabold text-slate-500 ml-1.5">
                                          +{apoiadoresLista.length - 4}
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => setExpandedDiarioApoiadores(prev => ({ ...prev, [diario.id]: !prev[diario.id] }))}
                                        className="text-[11px] font-bold text-amber-900 hover:underline ml-2 cursor-pointer"
                                      >
                                        {isApoiadoresOpen ? 'Recolher' : 'Ver quem apoiou'}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Botão de Toggle Comentários */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedDiarioComments(prev => ({ ...prev, [diario.id]: !isCommentsOpen }))}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Manifestações ({comentariosLista.length})</span>
                                  {isCommentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>

                              {/* Lista Expandida de Apoiadores */}
                              {isApoiadoresOpen && apoiadoresLista.length > 0 && (
                                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5 animate-in fade-in duration-150">
                                  <span className="text-[10px] font-black uppercase text-amber-950 block">
                                    Moradores que apoiaram este registro da obra:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {apoiadoresLista.map((ap, idx) => (
                                      <span
                                        key={ap.id || idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-[11px] font-semibold text-slate-900 shadow-2xs"
                                      >
                                        <ThumbsUp className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                                        <strong>{ap.nome}</strong>
                                        <span className="text-slate-500 text-[10px]">({ap.unidade || 'Morador'})</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Seção de Manifestações / Comentários */}
                              {isCommentsOpen && (
                                <div className="pt-2 space-y-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                                  {comentariosLista.length > 0 && (
                                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                      {comentariosLista.map((com) => (
                                        <div
                                          key={com.id}
                                          className={`p-2.5 rounded-xl text-xs space-y-1 ${
                                            com.oficial ? 'bg-amber-500/15 border border-amber-300' : 'bg-slate-50 border border-slate-200'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              {com.autorFoto ? (
                                                <img src={com.autorFoto} alt={com.autorNome} className="w-4 h-4 rounded-full object-cover" />
                                              ) : (
                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                              )}
                                              <strong className={com.oficial ? 'text-amber-950 font-black' : 'text-slate-900 font-bold'}>
                                                {com.autorNome}
                                              </strong>
                                              {com.autorUnidade && (
                                                <span className="text-slate-500">({com.autorUnidade})</span>
                                              )}
                                              {com.oficial && (
                                                <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-black text-[9px] uppercase border border-amber-300">
                                                  Oficial
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <span className="text-slate-400 font-mono text-[9px]">{com.data}</span>
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  if (window.confirm('Excluir este comentário?')) {
                                                    await excluirComentarioDiarioObraBenfeitoria(activeBenfeitoria.id, diario.id, com.id);
                                                  }
                                                }}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                                                title="Moderar / Excluir comentário"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                          <p className="text-slate-800 text-[11px] leading-relaxed pl-5 font-medium">{com.texto}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Formulário para Inserir Comentário / Resposta Oficial */}
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const txt = diarioCommentsInput[diario.id]?.trim();
                                      if (txt) {
                                        adicionarComentarioDiarioObraBenfeitoria(activeBenfeitoria.id, diario.id, txt);
                                        setDiarioCommentsInput(prev => ({ ...prev, [diario.id]: '' }));
                                      }
                                    }}
                                    className="flex gap-1.5 pt-0.5"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Escrever posicionamento ou resposta oficial da administração..."
                                      value={diarioCommentsInput[diario.id] || ''}
                                      onChange={(e) => setDiarioCommentsInput(prev => ({ ...prev, [diario.id]: e.target.value }))}
                                      className="flex-1 bg-white border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium shadow-2xs"
                                    />
                                    <button
                                      type="submit"
                                      disabled={!diarioCommentsInput[diario.id]?.trim()}
                                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Responder</span>
                                    </button>
                                  </form>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('votos_avaliacoes')}
                      className="text-xs font-extrabold text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl border border-purple-300 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                      <span>Ir para Apuração de Avaliações ({activeBenfeitoria.avaliacoes?.length || 0})</span>
                    </button>
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
                      Total de Votos Registrados: <strong>{activeBenfeitoria.votos?.length || 0}</strong>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                    activeBenfeitoria.votacaoAberta ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {activeBenfeitoria.votacaoAberta ? 'Votação Aberta' : 'Votação Encerrada'}
                  </span>
                </div>

                {(!activeBenfeitoria.orcamentos || activeBenfeitoria.orcamentos.length === 0) ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Nenhum orçamento comparativo cadastrado nesta benfeitoria ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeBenfeitoria.orcamentos.map((orc) => {
                      const votosDesteOrc = (activeBenfeitoria.votos || []).filter(v => v.orcamentoIdEscolhido === orc.id);
                      const isExpanded = expandedOrcamentoVotos === orc.id;
                      const percentual = activeBenfeitoria.votos && activeBenfeitoria.votos.length > 0
                        ? Math.round((votosDesteOrc.length / activeBenfeitoria.votos.length) * 100)
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
                        {activeBenfeitoria.notaMediaFinal ? `${activeBenfeitoria.notaMediaFinal} ★` : 'Ainda sem avaliações'}
                      </strong>{' '}
                      ({activeBenfeitoria.avaliacoes?.length || 0} avaliações)
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                    activeBenfeitoria.avaliacaoAberta ? 'bg-purple-100 text-purple-950 border-purple-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {activeBenfeitoria.avaliacaoAberta ? 'Avaliação Aberta' : 'Avaliação Encerrada'}
                  </span>
                </div>

                {(!activeBenfeitoria.avaliacoes || activeBenfeitoria.avaliacoes.length === 0) ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Nenhum morador enviou avaliação de estrelas para esta obra até o momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {activeBenfeitoria.avaliacoes.map((av, idx) => (
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
