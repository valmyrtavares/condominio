import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  Unidade, 
  AdminUser, 
  AdminRole, 
  ServicoMorador, 
  Funcionario, 
  StatusFuncionario, 
  CategoriaFuncionario, 
  EventoCondominio, 
  Assembleia,
  Reclamacao,
  StatusReclamacao,
  CategoriaReclamacao,
  Reparo,
  StatusReparo,
  PorteReparo,
  CategoriaReparo,
  Orcamento,
  Comentario
} from '../../types';
import { 
  Building, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  KeyRound, 
  LogOut, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Copy, 
  ArrowLeft,
  Users,
  Car,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Mail,
  Camera,
  Upload,
  Layers,
  Settings2,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  Bell,
  Briefcase,
  MessageCircle,
  Globe,
  AlertTriangle,
  Clock,
  Calendar,
  Sun,
  Activity,
  UserCheck,
  UserX,
  Star,
  PartyPopper,
  Pencil,
  MapPin,
  Gavel,
  FileCheck,
  Building2,
  Scale,
  MessageSquare,
  ThumbsUp,
  Wrench,
  Send,
  Filter,
  Zap,
  DollarSign,
  FileText,
  ExternalLink,
  Paperclip
} from 'lucide-react';
import { PrivateNotifyModal } from '../../components/admin/PrivateNotifyModal';
import { SuspendServiceModal } from '../../components/admin/SuspendServiceModal';
import { EditFuncionarioModal } from '../../components/admin/EditFuncionarioModal';
import { SuspendEventoModal } from '../../components/admin/SuspendEventoModal';
import { CreateEditEventoModal } from '../../components/eventos/CreateEditEventoModal';
import { CreateEditAssembleiaModal } from '../../components/assembleia/CreateEditAssembleiaModal';
import { PublicarAtaModal } from '../../components/assembleia/PublicarAtaModal';

const AVATARES_SUGERIDOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  '/ademar_porteiro.png',
  '/anastacia_faxineira.png',
  '/jose_casimiro_porteiro.png',
  '/jose_vigia.png',
  '/adriana_sindica.png',
  '/cassia_sub_sindica.png'
];

export const AdminPanelScreen: React.FC = () => {
  const { 
    unidades, 
    adicionarUnidade, 
    editarUnidade, 
    excluirUnidade, 
    toggleUnidadeSemMoradores,
    logoutAdmin, 
    setCurrentScreen,
    adminUsers,
    adminRoles,
    adicionarAdminUser,
    excluirAdminUser,
    adicionarAdminRole,
    excluirAdminRole,
    servicosMoradores,
    reativarServicoMorador,
    excluirServicoMorador,
    funcionarios,
    adicionarFuncionario,
    editarFuncionario,
    excluirFuncionario,
    atualizarStatusFuncionario,
    eventos,
    adicionarEvento,
    editarEvento,
    excluirEvento,
    suspenderEvento,
    reativarEvento,
    assembleias,
    adicionarAssembleia,
    editarAssembleia,
    excluirAssembleia,
    publicarAtaAssembleia,
    reclamacoes,
    atualizarStatusReclamacao,
    toggleOcultarComentario,
    excluirComentario,
    excluirReclamacao,
    transformarEmReparo,
    reparos,
    atualizarStatusReparo,
    selecionarOrcamento,
    adicionarOrcamentoReparo,
    excluirOrcamentoReparo,
    toggleOcultarComentarioReparo,
    excluirComentarioReparo,
    excluirReparo,
    resolverReparoSimples,
    enviarNotificacaoPrivada
  } = useCondo();

  // Accordion section collapse states (all closed by default on entry)
  const [isUnidadesOpen, setIsUnidadesOpen] = useState(false);
  const [isSenhasAdminOpen, setIsSenhasAdminOpen] = useState(false);
  const [isServicosAdminOpen, setIsServicosAdminOpen] = useState(false);
  const [isEventosAdminOpen, setIsEventosAdminOpen] = useState(false);
  const [isAssembleiasAdminOpen, setIsAssembleiasAdminOpen] = useState(false);
  const [isReclamacoesAdminOpen, setIsReclamacoesAdminOpen] = useState(false);
  const [isReparosAdminOpen, setIsReparosAdminOpen] = useState(false);

  // Reclamações & Ocorrências Moderation State
  const [searchReclamacao, setSearchReclamacao] = useState('');
  const [filtroStatusReclamacao, setFiltroStatusReclamacao] = useState('Todas');
  const [filtroCategoriaReclamacao, setFiltroCategoriaReclamacao] = useState('Todas');
  const [expandedCommentsInAdmin, setExpandedCommentsInAdmin] = useState<Record<string, boolean>>({});
  const [motivoOcultacaoModal, setMotivoOcultacaoModal] = useState<{ 
    isOpen: boolean; 
    reclamacaoId: string; 
    comentarioId: string; 
    autorNome: string; 
    autorUnidade: string;
    texto: string;
  } | null>(null);
  const [motivoOcultacaoTexto, setMotivoOcultacaoTexto] = useState('Comentário em desacordo com as regras de convivência e moderação do condomínio.');
  const [enviarNotificacaoAoOcultar, setEnviarNotificacaoAoOcultar] = useState(true);

  // Reparos & Manutenções Moderation State
  const [searchReparo, setSearchReparo] = useState('');
  const [filtroStatusReparo, setFiltroStatusReparo] = useState('Todas');
  const [filtroPorteReparo, setFiltroPorteReparo] = useState('Todos');
  const [filtroCategoriaReparo, setFiltroCategoriaReparo] = useState('Todas');
  const [expandedCommentsInReparosAdmin, setExpandedCommentsInReparosAdmin] = useState<Record<string, boolean>>({});
  const [expandedOrcamentosInReparosAdmin, setExpandedOrcamentosInReparosAdmin] = useState<Record<string, boolean>>({});
  const [expandedReparosInAdmin, setExpandedReparosInAdmin] = useState<Record<string, boolean>>({});
  const [motivoOcultacaoReparoModal, setMotivoOcultacaoReparoModal] = useState<{ 
    isOpen: boolean; 
    reparoId: string; 
    comentarioId: string; 
    autorNome: string; 
    autorUnidade: string;
    texto: string;
  } | null>(null);
  const [motivoOcultacaoReparoTexto, setMotivoOcultacaoReparoTexto] = useState('Comentário em desacordo com as regras de convivência e moderação do condomínio.');
  const [enviarNotificacaoAoOcultarReparo, setEnviarNotificacaoAoOcultarReparo] = useState(true);

  // Publicação de Orçamentos no Reparo
  const [isModalNovoOrcamentoOpen, setIsModalNovoOrcamentoOpen] = useState(false);
  const [reparoParaOrcamento, setReparoParaOrcamento] = useState<Reparo | null>(null);
  const [formOrcamento, setFormOrcamento] = useState<{
    empresa: string;
    siteUrl: string;
    cnpj: string;
    valor: string;
    prazoDias: string;
    descricao: string;
    documentoUrl: string;
    documentoNome: string;
  }>({
    empresa: '',
    siteUrl: '',
    cnpj: '',
    valor: '',
    prazoDias: '',
    descricao: '',
    documentoUrl: '',
    documentoNome: ''
  });

  // Formatador de CNPJ em tempo real: 00.000.000/0000-00
  const formatCNPJ = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (!digits) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  // Formatador de Moeda em tempo real: R$ 0,00
  const formatCurrencyInput = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Conversor de moeda formatada para número puro
  const parseCurrencyInput = (value: string): number => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
  };

  // Assembleias & Reuniões Moderation State
  const [searchAssembleia, setSearchAssembleia] = useState('');
  const [filtroTipoAssembleia, setFiltroTipoAssembleia] = useState('Todas');
  const [assembleiaToEditInAdmin, setAssembleiaToEditInAdmin] = useState<Assembleia | null>(null);
  const [isCreateEditAssembleiaAdminOpen, setIsCreateEditAssembleiaAdminOpen] = useState(false);
  const [assembleiaParaAtaAdmin, setAssembleiaParaAtaAdmin] = useState<Assembleia | null>(null);
  const [isPublicarAtaAdminOpen, setIsPublicarAtaAdminOpen] = useState(false);

  // Private Notify Modal state
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedUnidadeParaNotificar, setSelectedUnidadeParaNotificar] = useState<Unidade | null>(null);

  // Suspend Service Modal state
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [servicoParaSuspender, setServicoParaSuspender] = useState<ServicoMorador | null>(null);
  const [searchServico, setSearchServico] = useState('');

  // Eventos Moderation State
  const [isSuspendEventoModalOpen, setIsSuspendEventoModalOpen] = useState(false);
  const [eventoParaSuspender, setEventoParaSuspender] = useState<EventoCondominio | null>(null);
  const [searchEvento, setSearchEvento] = useState('');
  const [eventoToEditInAdmin, setEventoToEditInAdmin] = useState<EventoCondominio | null>(null);
  const [isCreateEditEventoAdminOpen, setIsCreateEditEventoAdminOpen] = useState(false);

  // Form Unidades
  const [novoNumero, setNovoNumero] = useState('');
  const [novaVaga, setNovaVaga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Edit inline unidade
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumero, setEditNumero] = useState('');
  const [editVaga, setEditVaga] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [showEditSenha, setShowEditSenha] = useState(false);

  // Form Admin & Colaboradores / Funcionários
  const [tipoCadastroColab, setTipoCadastroColab] = useState<'gestao' | 'operacional'>('gestao');
  const [novoAdminNome, setNovoAdminNome] = useState('');
  const [novoAdminUsuario, setNovoAdminUsuario] = useState('');
  const [novoAdminEmail, setNovoAdminEmail] = useState('');
  const [novoAdminRoleSelected, setNovoAdminRoleSelected] = useState(adminRoles[0]?.nome || 'Síndico Geral');
  const [novoAdminSenha, setNovoAdminSenha] = useState('');
  const [showNovoAdminSenha, setShowNovoAdminSenha] = useState(false);
  const [novoAdminFoto, setNovoAdminFoto] = useState(AVATARES_SUGERIDOS[0]);
  const [novoColabCargo, setNovoColabCargo] = useState('');
  const [novoColabCategoria, setNovoColabCategoria] = useState<CategoriaFuncionario>('Portaria');
  const [novoColabHorario, setNovoColabHorario] = useState('08:00 - 17:00');
  const [novoColabDisponibilidade, setNovoColabDisponibilidade] = useState('Segunda a Sexta');
  const [novoColabStatus, setNovoColabStatus] = useState<StatusFuncionario>('Ativo');
  const [filtroCategoriaColab, setFiltroCategoriaColab] = useState<string>('Todos');
  const [selectedFuncionarioToEdit, setSelectedFuncionarioToEdit] = useState<Funcionario | null>(null);
  const [isEditFuncionarioModalOpen, setIsEditFuncionarioModalOpen] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [visibleAdminPasswords, setVisibleAdminPasswords] = useState<{ [key: string]: boolean }>({});

  // Modal / Seção de Criação de Novas Categorias de Gestão
  const [isModalNovaCategoriaOpen, setIsModalNovaCategoriaOpen] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [novaCategoriaTipoAcesso, setNovaCategoriaTipoAcesso] = useState<'total' | 'morador_destaque'>('morador_destaque');
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = useState('');

  const handleAddUnidade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNumero.trim()) return;

    adicionarUnidade(
      novoNumero.trim(),
      novaVaga.trim() || `Vaga ${novoNumero.trim()}`,
      novaSenha.trim() || novoNumero.trim()
    );

    setNovoNumero('');
    setNovaVaga('');
    setNovaSenha('');
  };

  const handleStartEdit = (u: Unidade) => {
    setEditingId(u.id);
    setEditNumero(u.numero);
    setEditVaga(u.vagaGaragem || '');
    setEditSenha(u.senhaAcesso || u.numero);
  };

  const handleSaveEdit = (id: string) => {
    if (!editNumero.trim()) return;
    editarUnidade(id, editNumero, editVaga, editSenha || editNumero);
    setEditingId(null);
  };

  const handleCopySenha = (u: Unidade) => {
    const texto = `Condomínio - Unidade: ${u.numero}\nVaga de Garagem: ${u.vagaGaragem || 'Sem vaga'}\nLogin / Senha: ${u.senhaAcesso || u.numero}`;
    navigator.clipboard.writeText(texto);
    setCopiadoId(u.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNovoAdminFoto(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAdminNome.trim()) return;

    if (tipoCadastroColab === 'gestao') {
      if (!novoAdminUsuario.trim() || !novoAdminSenha.trim()) return;

      const roleObj = adminRoles.find(r => r.nome === novoAdminRoleSelected);
      const tipoAcesso = roleObj ? roleObj.tipoAcesso : 'morador_destaque';

      adicionarFuncionario({
        nome: novoAdminNome.trim(),
        foto: novoAdminFoto || AVATARES_SUGERIDOS[0],
        funcao: novoAdminRoleSelected,
        categoria: 'Gestão',
        horario: tipoAcesso === 'total' ? 'Administração & Plantão' : 'Reuniões e Pareceres',
        disponibilidade: tipoAcesso === 'total' ? 'Horário Comercial / Emergências' : 'Sob demanda',
        status: novoColabStatus,
        email: novoAdminEmail.trim() || `${novoAdminUsuario.trim().toLowerCase()}@condominio.com`,
        usuario: novoAdminUsuario.trim().toLowerCase(),
        senha: novoAdminSenha.trim(),
        tipoAcesso: tipoAcesso
      });

      setAdminSuccessMsg(`Perfil de ${novoAdminRoleSelected} (${novoAdminNome}) cadastrado com sucesso!`);
    } else {
      if (!novoColabCargo.trim()) return;

      adicionarFuncionario({
        nome: novoAdminNome.trim(),
        foto: novoAdminFoto || AVATARES_SUGERIDOS[0],
        funcao: novoColabCargo.trim(),
        categoria: novoColabCategoria,
        horario: novoColabHorario.trim() || '08:00 - 17:00',
        disponibilidade: novoColabDisponibilidade.trim() || 'Segunda a Sexta',
        status: novoColabStatus,
        email: novoAdminEmail.trim() || undefined
      });

      setAdminSuccessMsg(`Funcionário "${novoAdminNome}" (${novoColabCargo}) cadastrado com sucesso!`);
    }

    setNovoAdminNome('');
    setNovoAdminUsuario('');
    setNovoAdminEmail('');
    setNovoAdminSenha('');
    setNovoColabCargo('');
    setNovoAdminFoto(AVATARES_SUGERIDOS[Math.floor(Math.random() * AVATARES_SUGERIDOS.length)]);
    setTimeout(() => setAdminSuccessMsg(''), 4000);
  };

  const handleAddNovaCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCategoriaNome.trim()) return;

    adicionarAdminRole(
      novaCategoriaNome.trim(),
      novaCategoriaTipoAcesso,
      novaCategoriaDescricao.trim() || undefined
    );

    setNovoAdminRoleSelected(novaCategoriaNome.trim());
    setNovaCategoriaNome('');
    setNovaCategoriaDescricao('');
    setIsModalNovaCategoriaOpen(false);
  };

  const toggleAdminPasswordVisibility = (id: string) => {
    setVisibleAdminPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredUnidades = unidades.filter(u => 
    u.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.vagaGaragem && u.vagaGaragem.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unidadesCadastradas = unidades.filter(u => u.moradores && u.moradores.length > 0).length;
  const unidadesPendentes = unidades.length - unidadesCadastradas;

  // Selected Role Info Helper
  const currentSelectedRole = adminRoles.find(r => r.nome === novoAdminRoleSelected);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header with Navigation & Logout */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Ir para a Visão do Morador
        </button>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair do Painel
        </button>
      </div>

      {/* Screen Title Banner (Beige Theme) */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-amber-100/70 border border-amber-300/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Painel de Administração
            </h2>
            <p className="text-xs text-slate-700 font-medium">
              Controle central de unidades, senhas de moradores e equipe de gestão do condomínio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-black text-xs shadow-xs">
            {unidades.length} Unidades
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-amber-300 rounded-xl font-black text-xs shadow-xs">
            {adminUsers.length} Administradores & Gestores
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 1: GESTÃO DE UNIDADES E SENHAS (CARD RETRÁTIL QUE ABRE E FECHA) */}
      {/* ========================================================================= */}
      <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsUnidadesOpen(!isUnidadesOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-emerald-100/90 hover:bg-emerald-200/70 transition-colors text-left border-b border-emerald-200 cursor-pointer select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-950 shrink-0">
              <Building className="w-5 h-5 text-emerald-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">
                  1. Gestão de Unidades e Senhas
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                  {unidades.length} Apts
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {unidadesCadastradas} com moradores configurados • {unidadesPendentes} pendentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isUnidadesOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-emerald-300 text-slate-700 shadow-2xs">
              <ChevronDown className={`w-4 h-4 text-emerald-900 transition-transform duration-500 ease-out ${isUnidadesOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </button>

        {/* Accordion Content com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isUnidadesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-emerald-50/50 p-5 sm:p-6 space-y-6">
            
            {/* Form de Criação de Unidade */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-1">
                <Building className="w-4 h-4 text-amber-800" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                  Cadastrar Nova Unidade / Apartamento
                </h4>
              </div>

              <form onSubmit={handleAddUnidade} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Número / Identificação Completa da Unidade */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Número do Apto / Identificação:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 101 Bloco A, 001, 102..."
                      value={novoNumero}
                      onChange={(e) => setNovoNumero(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      required
                    />
                  </div>

                  {/* Vaga de Garagem */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Vaga de Garagem:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 12 subsolo, 13, G-01..."
                      value={novaVaga}
                      onChange={(e) => setNovaVaga(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* Senha Padrão (Opcional - default é o próprio número da unidade) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Senha de Acesso (Opcional):
                    </label>
                    <div className="relative">
                      <input
                        type={showNovaSenha ? 'text' : 'password'}
                        placeholder={novoNumero ? `Padrão: ${novoNumero}` : 'Padrão: número do apto'}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pr-9 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                        className="p-1 text-slate-500 hover:text-slate-800 absolute right-2.5 top-1.5 rounded-lg"
                        tabIndex={-1}
                        title={showNovaSenha ? "Ocultar senha" : "Ver senha"}
                      >
                        {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">
                    * A senha inicial para o morador é por padrão a própria identificação da unidade.
                  </span>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md transition-all active:scale-95 ml-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Adicionar Unidade à Fila
                  </button>
                </div>
              </form>
            </div>

            {/* Busca e Lista / Fila de Unidades */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">
                  Fila de Unidades ({filteredUnidades.length})
                </span>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filtrar por apto ou vaga..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-500 focus:outline-none font-semibold shadow-2xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Grid de Cards de Unidades na Fila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredUnidades.map((u) => {
                  const isEditing = editingId === u.id;
                  const senhaDisplay = u.senhaAcesso || u.numero;

                  if (isEditing) {
                    return (
                      <div
                        key={u.id}
                        className="bg-amber-100/90 border-2 border-amber-400 rounded-2xl p-3.5 shadow-md space-y-2.5 animate-in zoom-in-95 duration-150"
                      >
                        <span className="text-[10px] uppercase font-black text-amber-950 block">
                          Editando Unidade
                        </span>
                        
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={editNumero}
                            onChange={(e) => setEditNumero(e.target.value)}
                            placeholder="Número / Identificação"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-950"
                          />
                          <input
                            type="text"
                            value={editVaga}
                            onChange={(e) => setEditVaga(e.target.value)}
                            placeholder="Vaga de Garagem"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-950"
                          />
                          <div className="relative">
                            <input
                              type={showEditSenha ? 'text' : 'password'}
                              value={editSenha}
                              onChange={(e) => setEditSenha(e.target.value)}
                              placeholder="Senha de Acesso"
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 pr-8 text-xs font-bold text-slate-950"
                            />
                            <button
                              type="button"
                              onClick={() => setShowEditSenha(!showEditSenha)}
                              className="p-1 text-slate-500 hover:text-slate-800 absolute right-1.5 top-0.5 rounded-lg"
                              tabIndex={-1}
                              title={showEditSenha ? "Ocultar senha" : "Ver senha"}
                            >
                              {showEditSenha ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => handleSaveEdit(u.id)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Salvar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const formatUnitTitle = (num: string) => {
                    if (num.toLowerCase().startsWith('apt') || num.toLowerCase().startsWith('cobertura')) {
                      return num;
                    }
                    return `Apto ${num}`;
                  };

                  const isVazio = Boolean(u.semMoradores || u.statusCadastro === 'Vazio');
                  const badgeText = isVazio 
                    ? 'Sem Moradores' 
                    : (u.moradores && u.moradores.length > 0 ? 'Cadastrado' : 'Pendente');
                  const badgeStyle = isVazio
                    ? 'bg-slate-200 text-slate-800 border-slate-300'
                    : (u.moradores && u.moradores.length > 0 ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300');

                  return (
                    <div
                      key={u.id}
                      className={`bg-white border ${
                        isVazio ? 'border-slate-300 bg-slate-50/60' : 'border-slate-200 hover:border-amber-400'
                      } rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2.5 overflow-hidden`}
                    >
                      {/* Topo do Card de Unidade */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight truncate">
                            {formatUnitTitle(u.numero)}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 flex items-center gap-1 mt-0.5 truncate">
                            <Car className="w-3 h-3 text-amber-800 shrink-0" />
                            Vaga: {u.vagaGaragem || 'Sem vaga'}
                          </span>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                          {badgeText}
                        </span>
                      </div>

                      {/* Senha e Credencial */}
                      <div className="p-2 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-700 min-w-0 truncate">
                          <KeyRound className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase shrink-0">Senha:</span>
                          <strong className="text-slate-950 font-mono font-black ml-1 truncate">{senhaDisplay}</strong>
                        </div>

                        <button
                          onClick={() => handleCopySenha(u)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                          title="Copiar dados de acesso"
                        >
                          {copiadoId === u.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Ações: Check Vazio (canto esquerdo) + Editar + Notificar + Excluir (canto direito) */}
                      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
                        
                        {/* Checkbox de Apartamento Vazio */}
                        <label 
                          className="flex items-center gap-1 cursor-pointer select-none group bg-slate-100/90 hover:bg-amber-100/70 px-1.5 py-1 rounded-lg border border-slate-200 transition-colors shrink-0"
                          title="Marcar como apartamento vazio / sem moradores"
                        >
                          <input
                            type="checkbox"
                            checked={isVazio}
                            onChange={() => toggleUnidadeSemMoradores(u.id)}
                            className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer accent-amber-600"
                          />
                          <span className={`text-[9px] uppercase tracking-tight transition-colors ${
                            isVazio 
                              ? 'text-slate-950 font-black' 
                              : 'text-slate-500 font-bold group-hover:text-slate-800'
                          }`}>
                            Vazio
                          </span>
                        </label>

                        {/* Ações da Direita: Editar + Notificar + Excluir */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => handleStartEdit(u)}
                            className="px-1.5 py-1 rounded-lg text-slate-700 hover:text-indigo-700 hover:bg-slate-100 transition-colors text-[10px] sm:text-[11px] flex items-center gap-0.5 font-bold"
                            title="Editar Unidade"
                          >
                            <Edit3 className="w-3 h-3 text-slate-600" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUnidadeParaNotificar(u);
                              setIsNotifyModalOpen(true);
                            }}
                            className="px-1.5 py-1 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors text-[10px] sm:text-[11px] flex items-center gap-0.5 font-bold"
                            title="Notificar Moradia Privadamente"
                          >
                            <Bell className="w-3 h-3 text-amber-700" />
                            <span>Notificar</span>
                          </button>

                          <button
                            onClick={() => excluirUnidade(u.id)}
                            className="px-1.5 py-1 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-100 transition-colors text-[10px] sm:text-[11px] flex items-center gap-0.5 font-bold"
                            title="Excluir Unidade"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Excluir</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: CRIANDO SENHA DE ACESSOS & QUADRO DE FUNCIONÁRIOS E GESTÃO */}
      {/* ========================================================================= */}
      <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsSenhasAdminOpen(!isSenhasAdminOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-amber-100/90 hover:bg-amber-200/70 transition-colors text-left border-b border-amber-200 cursor-pointer select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-950 shrink-0">
              <KeyRound className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950">
                  2. Senhas de Acessos & Equipe de Gestão
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                  {funcionarios.length} Membros & Colaboradores
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Síndicos, Subsíndicos, Portaria, Faxineiros, Vigias, Zeladoria e Colaboradores em Geral.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isSenhasAdminOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-amber-300 text-slate-700 shadow-2xs">
              <ChevronDown className={`w-4 h-4 text-amber-900 transition-transform duration-500 ease-out ${isSenhasAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </button>

        {/* Accordion Content com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isSenhasAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-amber-50/50 p-5 sm:p-6 space-y-6">
            
            {/* Success Message */}
            {adminSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{adminSuccessMsg}</span>
              </div>
            )}

            {/* Form de Criação de Novo Membro / Funcionário com Foto */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-800" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                    Cadastrar Membro / Funcionário
                  </h4>
                </div>

                {/* Alternador de Tipo de Cadastro: Gestão com Senha vs Funcionário Operacional */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-white/80 p-0.5 rounded-xl border border-amber-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setTipoCadastroColab('gestao')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        tipoCadastroColab === 'gestao'
                          ? 'bg-amber-500 text-slate-950 shadow-xs scale-102'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Membro da Gestão (Com Senha)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoCadastroColab('operacional')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        tipoCadastroColab === 'operacional'
                          ? 'bg-amber-500 text-slate-950 shadow-xs scale-102'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Funcionário Operacional (Portaria, Faxina, Vigia...)
                    </button>
                  </div>

                  {/* Botão para Gerenciar / Criar Categorias */}
                  <button
                    type="button"
                    onClick={() => setIsModalNovaCategoriaOpen(true)}
                    className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl text-[11px] font-black uppercase flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-amber-800" />
                    + Criar Nova Categoria
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddAdminUser} className="space-y-4">
                
                {/* Linha 1: Foto de Perfil Individual + Dados Principais */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Foto de Perfil com Upload e Preview */}
                  <div className="md:col-span-3 space-y-2 bg-white/80 border border-amber-200 rounded-2xl p-3 text-center">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700 block">
                      Foto de Perfil (Aparece em Funcionários):
                    </label>

                    <div className="relative w-20 h-20 mx-auto">
                      <img
                        src={novoAdminFoto || AVATARES_SUGERIDOS[0]}
                        alt="Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-100"
                      />
                      <label 
                        htmlFor="upload-admin-foto"
                        className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md border border-white"
                        title="Trocar Foto"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          id="upload-admin-foto"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase text-slate-500 block">
                        Ou escolha um avatar:
                      </span>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {AVATARES_SUGERIDOS.slice(0, 6).map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNovoAdminFoto(av)}
                            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              novoAdminFoto === av ? 'border-amber-600 scale-110 shadow-sm ring-1 ring-amber-400' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Campos do Formulário */}
                  <div className="md:col-span-9 space-y-3">
                    
                    {/* Linha de Nome e Cargo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Nome Completo */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">
                          Nome Completo:
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Ademar Lopes, Valmyr Tavares..."
                          value={novoAdminNome}
                          onChange={(e) => setNovoAdminNome(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                          required
                        />
                      </div>

                      {/* Cargo / Categoria */}
                      {tipoCadastroColab === 'gestao' ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-extrabold uppercase text-slate-700">
                              Categoria / Função:
                            </label>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded border bg-amber-100 text-amber-950 border-amber-300">
                              🔓 ACESSO TOTAL
                            </span>
                          </div>

                          <select
                            value={novoAdminRoleSelected}
                            onChange={(e) => setNovoAdminRoleSelected(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                          >
                            {adminRoles.map((role) => (
                              <option key={role.id} value={role.nome}>
                                {role.nome} {role.tipoAcesso === 'total' ? '(Acesso Irrestrito)' : '(Poder de Morador)'}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Cargo / Função do Funcionário:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Porteiro Noturno (12x36), Faxineira Chefe, Vigia..."
                            value={novoColabCargo}
                            onChange={(e) => setNovoColabCargo(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                            required
                          />
                        </div>
                      )}

                    </div>

                    {/* Linha de Dados Específicos: Se for Gestão (Usuário/Senha) | Se for Operacional (Categoria, Horário, Escala) */}
                    {tipoCadastroColab === 'gestao' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        
                        {/* Usuário de Login */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Usuário de Acesso / Login:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: admin, subsindico, conselheiro1"
                            value={novoAdminUsuario}
                            onChange={(e) => setNovoAdminUsuario(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                            required
                          />
                        </div>

                        {/* Senha com Olho */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Senha de Acesso:
                          </label>
                          <div className="relative">
                            <input
                              type={showNovoAdminSenha ? 'text' : 'password'}
                              placeholder="Ex: admin123, 101..."
                              value={novoAdminSenha}
                              onChange={(e) => setNovoAdminSenha(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pr-9 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNovoAdminSenha(!showNovoAdminSenha)}
                              className="p-1 text-slate-500 hover:text-slate-800 absolute right-2.5 top-1.5 rounded-lg cursor-pointer"
                              tabIndex={-1}
                              title={showNovoAdminSenha ? "Ocultar senha" : "Ver senha"}
                            >
                              {showNovoAdminSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        
                        {/* Categoria Operacional */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Categoria:
                          </label>
                          <select
                            value={novoColabCategoria}
                            onChange={(e) => setNovoColabCategoria(e.target.value as CategoriaFuncionario)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                          >
                            <option value="Portaria">Portaria</option>
                            <option value="Limpeza">Limpeza</option>
                            <option value="Segurança">Segurança</option>
                            <option value="Zeladoria">Zeladoria</option>
                            <option value="Manutenção">Manutenção</option>
                            <option value="Gestão">Gestão</option>
                          </select>
                        </div>

                        {/* Horário de Turno */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Horário de Turno:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 07:00 - 19:00, 19:00 - 07:00..."
                            value={novoColabHorario}
                            onChange={(e) => setNovoColabHorario(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                          />
                        </div>

                        {/* Escala / Dias */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Escala / Dias:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Escala 12x36, Seg a Sex..."
                            value={novoColabDisponibilidade}
                            onChange={(e) => setNovoColabDisponibilidade(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                          />
                        </div>

                      </div>
                    )}

                    {/* Status Inicial do Funcionário */}
                    <div className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-amber-200/80">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">
                          Status Inicial do Funcionário:
                        </label>
                        <span className="text-[10px] font-black uppercase text-slate-800">
                          {novoColabStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {[
                          { label: 'Ativo', val: 'Ativo', bg: 'bg-emerald-500 text-white' },
                          { label: 'Férias', val: 'Férias', bg: 'bg-amber-500 text-slate-950' },
                          { label: 'Doente', val: 'Doente', bg: 'bg-orange-500 text-white' },
                          { label: 'Ausente', val: 'Ausente', bg: 'bg-rose-500 text-white' },
                          { label: 'Desligado', val: 'Desligado', bg: 'bg-slate-700 text-white' }
                        ].map((st) => (
                          <button
                            key={st.val}
                            type="button"
                            onClick={() => setNovoColabStatus(st.val as StatusFuncionario)}
                            className={`py-1 px-2 rounded-lg text-[11px] font-black uppercase transition-all border cursor-pointer ${
                              novoColabStatus === st.val
                                ? `${st.bg} border-transparent shadow-xs scale-102 ring-2 ring-amber-400`
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* E-mail e Botão de Salvar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 items-end">
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">
                          E-mail / Contato (Opcional):
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Ex: colaborador@condominio.com"
                            value={novoAdminEmail}
                            onChange={(e) => setNovoAdminEmail(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 stroke-[3]" />
                          Salvar Colaborador
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </form>
            </div>

            {/* Lista de Colaboradores & Equipe de Gestão com Foto, Status e Ações */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">
                  Quadro de Colaboradores & Gestão ({funcionarios.length})
                </span>
                
                {/* Filtro por Categoria */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {['Todos', 'Gestão', 'Portaria', 'Limpeza', 'Segurança'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFiltroCategoriaColab(cat)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition-all border cursor-pointer ${
                        filtroCategoriaColab === cat
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {funcionarios
                  .filter(f => filtroCategoriaColab === 'Todos' || (f.categoria || 'Gestão') === filtroCategoriaColab)
                  .map((func) => {
                    const isPassVisible = visibleAdminPasswords[func.id];
                    const currentStatus = func.status || 'Ativo';

                    // Status Badge Style Helper
                    const getStatusColor = (st: string) => {
                      switch (st) {
                        case 'Férias':
                          return { badge: 'bg-amber-100 text-amber-950 border-amber-300', dot: 'bg-amber-500' };
                        case 'Doente':
                          return { badge: 'bg-orange-100 text-orange-950 border-orange-300', dot: 'bg-orange-500' };
                        case 'Ausente':
                          return { badge: 'bg-rose-100 text-rose-950 border-rose-300', dot: 'bg-rose-500' };
                        case 'Desligado':
                          return { badge: 'bg-slate-200 text-slate-700 border-slate-300', dot: 'bg-slate-600' };
                        case 'Ativo':
                        default:
                          return { badge: 'bg-emerald-100 text-emerald-950 border-emerald-300', dot: 'bg-emerald-500' };
                      }
                    };

                    const statusStyle = getStatusColor(currentStatus);

                    return (
                      <div
                        key={func.id}
                        className={`bg-white border hover:border-amber-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 ${
                          currentStatus === 'Desligado' ? 'opacity-70 border-slate-200 bg-slate-50/80' : 'border-slate-200'
                        }`}
                      >
                        {/* Topo do Card com Foto e Indicador de Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={func.foto || AVATARES_SUGERIDOS[0]}
                                alt={func.nome}
                                className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-300 shadow-sm bg-slate-100"
                              />
                              <span 
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${statusStyle.dot}`} 
                                title={`Status: ${currentStatus}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-sm text-slate-950 leading-tight truncate">
                                {func.nome}
                              </h4>
                              <p className="text-xs text-indigo-900 font-extrabold truncate mt-0.5">
                                {func.funcao}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Categoria e Status Interativo */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                            {func.categoria || 'Colaborador'}
                          </span>

                          {/* Seletor Rápido de Status no próprio Card */}
                          <select
                            value={currentStatus}
                            onChange={(e) => atualizarStatusFuncionario(func.id, e.target.value as StatusFuncionario)}
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-2xs cursor-pointer focus:outline-none ${statusStyle.badge}`}
                            title="Alterar status deste colaborador"
                          >
                            <option value="Ativo">🟢 Ativo</option>
                            <option value="Férias">🟡 Férias</option>
                            <option value="Doente">🟠 Doente</option>
                            <option value="Ausente">🔴 Ausente</option>
                            <option value="Desligado">⚫ Desligado</option>
                          </select>
                        </div>

                        {/* Informações de Turno & Escala */}
                        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-indigo-600" /> Turno:
                            </span>
                            <strong className="text-slate-950 font-bold text-[11px] block truncate" title={func.horario}>
                              {func.horario || 'Integral'}
                            </strong>
                          </div>

                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-600" /> Escala:
                            </span>
                            <span className="text-slate-800 font-bold text-[11px] block truncate" title={func.disponibilidade}>
                              {func.disponibilidade || 'Seg a Sex'}
                            </span>
                          </div>
                        </div>

                        {/* Dados de Login e Senha se for membro com credencial de acesso */}
                        {func.usuario && (
                          <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                            <div>
                              <span className="text-[9px] font-extrabold uppercase text-slate-600 block">
                                Usuário:
                              </span>
                              <strong className="text-slate-950 font-mono font-black text-xs">
                                {func.usuario}
                              </strong>
                            </div>

                            <div>
                              <span className="text-[9px] font-extrabold uppercase text-slate-600 block">
                                Senha:
                              </span>
                              <div className="flex items-center justify-between">
                                <strong className="text-slate-950 font-mono font-black text-xs">
                                  {isPassVisible ? (func.senha || 'admin') : '••••••••'}
                                </strong>
                                <button
                                  type="button"
                                  onClick={() => toggleAdminPasswordVisibility(func.id)}
                                  className="text-slate-500 hover:text-slate-800 p-0.5 rounded cursor-pointer"
                                  title={isPassVisible ? "Ocultar senha" : "Ver senha"}
                                >
                                  {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rodapé do Card com Ações (Editar, Copiar, Excluir) */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          
                          {/* Botão de Editar */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFuncionarioToEdit(func);
                              setIsEditFuncionarioModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px] font-black uppercase cursor-pointer"
                            title="Editar dados do colaborador"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-800" /> Editar
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const info = `Condomínio - Colaborador: ${func.nome}\nFunção: ${func.funcao}\nCategoria: ${func.categoria}\nTurno: ${func.horario}\nEscala: ${func.disponibilidade}\nStatus: ${func.status || 'Ativo'}${func.usuario ? `\nUsuário: ${func.usuario}\nSenha: ${func.senha}` : ''}`;
                                navigator.clipboard.writeText(info);
                                alert(`Dados de ${func.nome} copiados!`);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                              title="Copiar informações"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copiar
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${func.nome}?`)) {
                                  excluirFuncionario(func.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                              title="Remover Colaborador"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 3: SERVIÇOS DE MORADORES & MODERAÇÃO */}
      {/* ========================================================================= */}
      <div className="bg-purple-50/70 border-2 border-purple-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsServicosAdminOpen(!isServicosAdminOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-purple-100/90 hover:bg-purple-200/70 transition-colors text-left border-b border-purple-200 cursor-pointer select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-950 shrink-0">
              <Briefcase className="w-5 h-5 text-purple-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950">
                  3. Moderação de Serviços de Moradores
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-950 border border-purple-300">
                  {servicosMoradores.length} Anúncios
                </span>
                {servicosMoradores.filter(s => !s.ativo).length > 0 && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                    {servicosMoradores.filter(s => !s.ativo).length} Suspensos
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Modere anúncios, suspenda divulgações com irregularidades, notifique a moradia ou reative serviços corrigidos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isServicosAdminOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-purple-300 text-slate-700 shadow-2xs">
              <ChevronDown className={`w-4 h-4 text-purple-900 transition-transform duration-500 ease-out ${isServicosAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </button>

        {/* Accordion Content com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isServicosAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-purple-50/50 p-5 sm:p-6 space-y-5">
            
            {/* Header com Busca */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">
                Mural de Anúncios Cadastrados ({servicosMoradores.length})
              </span>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filtrar por serviço, morador ou apto..."
                  value={searchServico}
                  onChange={(e) => setSearchServico(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-500 focus:outline-none font-semibold shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Grid de Cards de Moderação de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {servicosMoradores
                .filter(s => 
                  !searchServico ||
                  s.titulo.toLowerCase().includes(searchServico.toLowerCase()) ||
                  s.moradorNome.toLowerCase().includes(searchServico.toLowerCase()) ||
                  s.moradorUnidade.toLowerCase().includes(searchServico.toLowerCase()) ||
                  s.categoria.toLowerCase().includes(searchServico.toLowerCase())
                )
                .map((servico) => {
                  const isSuspenso = !servico.ativo;

                  return (
                    <div
                      key={servico.id}
                      className={`border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 ${
                        isSuspenso 
                          ? 'bg-rose-50/80 border-rose-300' 
                          : 'bg-white border-slate-200 hover:border-purple-400'
                      }`}
                    >
                      {/* Topo: Imagem Thumbnail + Título + Morador */}
                      <div className="flex items-start gap-3">
                        <img
                          src={servico.imagem || '/torta_servico.jpg'}
                          alt={servico.titulo}
                          className="w-14 h-14 rounded-xl object-cover border border-purple-300 shadow-2xs shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-purple-100 text-purple-950 border border-purple-300 inline-block mb-0.5">
                            {servico.categoria}
                          </span>
                          <h4 className="font-black text-sm text-slate-950 leading-tight truncate">
                            {servico.titulo}
                          </h4>
                          <p className="text-[11px] text-slate-600 font-semibold mt-0.5 truncate">
                            Morador: <strong>{servico.moradorNome}</strong> (Apto {servico.moradorUnidade || 'N/A'})
                          </p>
                        </div>
                      </div>

                      {/* Descrição resumida */}
                      <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {servico.descricao}
                      </p>

                      {/* Banner de Suspensão se estiver suspenso */}
                      {isSuspenso && (
                        <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-[11px] space-y-0.5">
                          <strong className="font-black flex items-center gap-1 text-rose-900">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                            Anúncio Oculto do Mural
                          </strong>
                          <p className="text-rose-900/90 font-medium text-[10px]">
                            <strong>Motivo:</strong> {servico.motivoSuspensao || 'Irregularidade nas diretrizes.'}
                          </p>
                        </div>
                      )}

                      {/* Status & Botões de Ação */}
                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1 flex-wrap text-xs">
                        
                        <div className="flex items-center gap-1">
                          {isSuspenso ? (
                            <button
                              onClick={() => reativarServicoMorador(servico.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                              title="Reativar e publicar no mural"
                            >
                              <CheckCircle2 className="w-3 h-3 stroke-[3]" /> Reativar
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setServicoParaSuspender(servico);
                                setIsSuspendModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Suspender anúncio e entrar em contato com o apartamento"
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-700" /> Suspender
                            </button>
                          )}

                          <button
                            onClick={() => {
                              const unit = unidades.find(u => u.numero === servico.moradorUnidade);
                              setSelectedUnidadeParaNotificar(unit || {
                                id: `temp-${servico.moradorUnidade}`,
                                numero: servico.moradorUnidade,
                                bloco: '',
                                moradores: []
                              });
                              setIsNotifyModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors text-[11px] flex items-center gap-0.5 font-bold cursor-pointer"
                            title="Enviar Notificação Privada para o Apto"
                          >
                            <Bell className="w-3.5 h-3.5 text-amber-700" /> Notificar
                          </button>
                        </div>

                        <button
                          onClick={() => excluirServicoMorador(servico.id)}
                          className="p-1 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-100 transition-colors text-[11px] font-bold cursor-pointer"
                          title="Excluir Definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 4: MODERAÇÃO DE EVENTOS & MURAL DE CELEBRAÇÕES (AZUL PASTEL CLARINHO) */}
      {/* ========================================================================= */}
      <div className="bg-sky-50/80 border-2 border-sky-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsEventosAdminOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left focus:outline-none bg-sky-100/90 hover:bg-sky-200/70 transition-colors cursor-pointer border-b border-sky-200 select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-950 border border-sky-400/40 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5 text-sky-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-sm sm:text-base text-slate-950">
                  4. Moderação de Eventos & Mural Comunitário
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-950 border border-sky-300 shadow-2xs">
                  {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Receba, aprove, tire do ar e notifique moradores sobre celebrações públicas ou particulares.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEventoToEditInAdmin(null);
                setIsCreateEditEventoAdminOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Novo Evento
            </button>
            <div className="p-2 rounded-xl bg-white border border-sky-300 text-slate-700 shadow-2xs">
              <ChevronDown className={`w-4 h-4 text-sky-900 transition-transform duration-500 ease-out ${isEventosAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </button>

        {/* Accordion Content com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isEventosAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-sky-50/70 p-4 sm:p-6 space-y-4">
            
            {/* Barra de Busca de Eventos */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por título, organizador, data ou local do evento..."
                value={searchEvento}
                onChange={(e) => setSearchEvento(e.target.value)}
                className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white font-semibold shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.8" />
            </div>

            {/* Grid de Cards de Eventos no Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventos
                .filter(evt => !searchEvento || 
                  evt.titulo.toLowerCase().includes(searchEvento.toLowerCase()) ||
                  evt.organizador.toLowerCase().includes(searchEvento.toLowerCase()) ||
                  evt.local.toLowerCase().includes(searchEvento.toLowerCase()) ||
                  evt.data.toLowerCase().includes(searchEvento.toLowerCase())
                )
                .map((evento) => {
                  const isAtivo = evento.ativo !== false;
                  const isPublico = evento.visibilidade === 'Público';

                  return (
                    <div
                      key={evento.id}
                      className={`p-4 rounded-3xl border-2 transition-all shadow-md space-y-3 bg-white ${
                        isAtivo ? 'border-sky-200' : 'border-rose-300 bg-rose-50/40'
                      }`}
                    >
                      {/* Topo: Imagem Thumbnail, Título, Visibilidade e Status */}
                      <div className="flex items-start gap-3">
                        <img
                          src={evento.imagem}
                          alt={evento.titulo}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-300 bg-slate-100 shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-2xs ${
                              isPublico ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-purple-100 text-purple-950 border-purple-300'
                            }`}>
                              {evento.visibilidade}
                            </span>
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-2xs ${
                              isAtivo ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-rose-100 text-rose-950 border-rose-300'
                            }`}>
                              {isAtivo ? '🟢 No Mural' : '🔴 Fora do Ar'}
                            </span>
                          </div>

                          <h4 className="font-black text-sm text-slate-950 leading-tight truncate">
                            {evento.titulo}
                          </h4>
                          <p className="text-[11px] text-sky-900 font-extrabold truncate">
                            {evento.organizador}
                          </p>
                        </div>
                      </div>

                      {/* Informações de Data e Local */}
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                          <span>{evento.data} • {evento.horario}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                          <span>{evento.local}</span>
                        </div>
                      </div>

                      {/* Descrição do Evento */}
                      <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {evento.descricao}
                      </p>

                      {/* Se estiver suspenso com motivo */}
                      {!isAtivo && evento.motivoSuspensao && (
                        <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-[11px] font-semibold space-y-0.5">
                          <strong className="block text-[10px] font-black uppercase text-rose-900">
                            Motivo da Moderação:
                          </strong>
                          <p>{evento.motivoSuspensao}</p>
                        </div>
                      )}

                      {/* Ações de Moderação */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          
                          {/* Alternar Ativo / Suspenso */}
                          {isAtivo ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEventoParaSuspender(evento);
                                setIsSuspendEventoModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Tirar este evento do ar no mural"
                            >
                              <EyeOff className="w-3 h-3 text-rose-600" />
                              <span>Suspender</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => reativarEvento(evento.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Reexibir este evento no mural"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Reativar</span>
                            </button>
                          )}

                          {/* Notificar Organizador */}
                          <button
                            type="button"
                            onClick={() => {
                              const rawUnit = (evento.organizador || '').replace(/[^0-9]/g, '');
                              const unitObj: Unidade = unidades.find(u => u.numero.replace(/[^0-9]/g, '') === rawUnit) || {
                                id: `unit-${rawUnit || 'temp'}`,
                                numero: evento.organizador,
                                bloco: 'A',
                                vagaGaragem: '',
                                moradores: []
                              };
                              setSelectedUnidadeParaNotificar(unitObj);
                              setIsNotifyModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            title="Enviar notificação privada para o organizador"
                          >
                            <Bell className="w-3 h-3 text-amber-700" />
                            <span>Notificar</span>
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => {
                              setEventoToEditInAdmin(evento);
                              setIsCreateEditEventoAdminOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Editar Dados do Evento"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                        </div>

                        {/* Excluir Definitivamente */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`)) {
                              excluirEvento(evento.id);
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Excluir Definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 5: GESTÃO DE ASSEMBLEIAS & REUNIÕES INFORMAIS (ROSA PASTEL) */}
      {/* ========================================================================= */}
      <div className="bg-rose-50/70 border-2 border-rose-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsAssembleiasAdminOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left focus:outline-none bg-rose-100/90 hover:bg-rose-200/70 transition-colors cursor-pointer border-b border-rose-200 select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-950 border border-rose-400/40 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5 text-rose-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-sm sm:text-base text-slate-950">
                  5. Gestão de Assembleias & Reuniões Informais
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-300 shadow-2xs">
                  {assembleias.length} {assembleias.length === 1 ? 'reunião' : 'reuniões'}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Agende assembleias gerais ou reuniões específicas, vincule reclamações/reparos e publique atas com soluções.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAssembleiaToEditInAdmin(null);
                setIsCreateEditAssembleiaAdminOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Nova Reunião
            </button>
            <div className="p-2 rounded-xl bg-white border border-rose-300 text-slate-700 shadow-2xs">
              <ChevronDown className={`w-4 h-4 text-rose-900 transition-transform duration-500 ease-out ${isAssembleiasAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </button>

        {/* Accordion Content com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isAssembleiasAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-rose-50/50 p-4 sm:p-6 space-y-4">
            
            {/* Filtros e Busca */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
                <span className="text-[10px] font-extrabold uppercase text-amber-950 whitespace-nowrap pl-1">
                  Filtrar:
                </span>
                {['Todas', 'Assembleias Gerais', 'Reuniões Informais', 'Agendadas', 'Realizadas com Ata'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFiltroTipoAssembleia(opt)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-2xs cursor-pointer ${
                      filtroTipoAssembleia === opt
                        ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                        : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por pauta, título, reclamação, reparo ou local..."
                  value={searchAssembleia}
                  onChange={(e) => setSearchAssembleia(e.target.value)}
                  className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
              </div>
            </div>

            {/* Grid de Cards de Assembleias no Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assembleias
                .filter(a => {
                  let matchesFilter = true;
                  if (filtroTipoAssembleia === 'Assembleias Gerais') matchesFilter = a.tipoEncontro !== 'Reunião Informal';
                  if (filtroTipoAssembleia === 'Reuniões Informais') matchesFilter = a.tipoEncontro === 'Reunião Informal';
                  if (filtroTipoAssembleia === 'Agendadas') matchesFilter = a.status === 'Agendada';
                  if (filtroTipoAssembleia === 'Realizadas com Ata') matchesFilter = a.status === 'Realizada com Ata Publicada';

                  const matchesSearch = !searchAssembleia ||
                    a.titulo.toLowerCase().includes(searchAssembleia.toLowerCase()) ||
                    a.local.toLowerCase().includes(searchAssembleia.toLowerCase()) ||
                    a.descricaoGeral.toLowerCase().includes(searchAssembleia.toLowerCase()) ||
                    a.pautas.some(p => p.titulo.toLowerCase().includes(searchAssembleia.toLowerCase()));

                  return matchesFilter && matchesSearch;
                })
                .map((assembleia) => {
                  const isInformal = assembleia.tipoEncontro === 'Reunião Informal';
                  const isRealizada = assembleia.status === 'Realizada com Ata Publicada';
                  const isAguardando = assembleia.status === 'Realizada - Aguardando Ata';

                  return (
                    <div
                      key={assembleia.id}
                      className="p-4 sm:p-5 rounded-3xl border-2 border-white/90 bg-white/75 shadow-md space-y-3.5"
                    >
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                            isInformal
                              ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {isInformal ? '🤝 Reunião Informal' : '🏛️ Assembleia Geral'}
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                            {assembleia.tipo}
                          </span>

                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-2xs ${
                            isRealizada
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              : isAguardando
                              ? 'bg-amber-100 text-amber-950 border-amber-300'
                              : 'bg-rose-100 text-rose-950 border-rose-300'
                          }`}>
                            {isRealizada ? '✓ Ata Publicada' : isAguardando ? '⏳ Aguardando Ata' : '📅 Agendada'}
                          </span>
                        </div>

                        <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-700" />
                          {assembleia.dataHora}
                        </span>
                      </div>

                      {/* Título e Descrição */}
                      <div className="space-y-1">
                        <h4 className="font-black text-sm text-slate-950 leading-tight">
                          {assembleia.titulo}
                        </h4>
                        <p className="text-xs text-slate-700 font-medium line-clamp-2">
                          {assembleia.descricaoGeral}
                        </p>
                      </div>

                      {/* Local e Horários */}
                      <div className="p-2.5 rounded-2xl bg-white/90 border border-slate-200 text-xs font-semibold space-y-1 text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                            {assembleia.local}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            1ª {assembleia.primeiraChamada} • 2ª {assembleia.segundaChamada}
                          </span>
                        </div>

                        {isInformal && (
                          <div className="pt-1 border-t border-slate-100 text-[11px] text-indigo-950 font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                            <span>
                              Convocados: {assembleia.participantesDescricao || (assembleia.participantesIds ? `Unidades ${assembleia.participantesIds.join(', ')}` : 'Participantes selecionados')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pautas Integradas (Itens com Origem) */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                          Pautas & Deliberações ({assembleia.pautas.length}):
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {assembleia.pautas.map((p, idx) => (
                            <div key={p.id || idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <strong className="text-[11px] text-slate-950 font-extrabold truncate">
                                  {idx + 1}. {p.titulo}
                                </strong>
                                {p.origemTipo && (
                                  <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-md shrink-0 border ${
                                    p.origemTipo === 'reclamacao'
                                      ? 'bg-rose-100 text-rose-900 border-rose-200'
                                      : p.origemTipo === 'reparo'
                                      ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}>
                                    {p.origemTipo === 'reclamacao' ? '📌 Reclamação' : p.origemTipo === 'reparo' ? '🔧 Reparo' : '➕ Geral'}
                                  </span>
                                )}
                              </div>
                              {p.solucaoAta && (
                                <p className="text-[10px] font-semibold text-emerald-900 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 leading-tight">
                                  ✓ Solução: {p.solucaoAta}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumo da Ata Registrada se houver */}
                      {assembleia.ata && (
                        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1 text-emerald-950">
                          <strong className="block font-black text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Ata Registrada: {assembleia.ata.numeroAta} ({assembleia.ata.dataLavratura})
                          </strong>
                          <p className="text-[11px] font-medium text-slate-800 line-clamp-2 leading-relaxed">
                            {assembleia.ata.resumoDecisoes}
                          </p>
                        </div>
                      )}

                      {/* Botões de Ação do Admin */}
                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setAssembleiaParaAtaAdmin(assembleia);
                              setIsPublicarAtaAdminOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{assembleia.ata ? 'Editar Ata' : 'Publicar Ata & Soluções'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const msg = `Convocação: ${assembleia.tipoEncontro || 'Assembleia'} marcada para ${assembleia.dataHora} no ${assembleia.local}. Pauta: ${assembleia.titulo}.`;
                              if (isInformal && assembleia.participantesIds && assembleia.participantesIds.length > 0) {
                                assembleia.participantesIds.forEach(num => {
                                  enviarNotificacaoPrivada(num, msg, `Convocação: ${assembleia.titulo}`);
                                });
                                alert(`Notificação enviada com sucesso para os convocados (${assembleia.participantesIds.join(', ')})!`);
                              } else {
                                unidades.forEach(u => {
                                  enviarNotificacaoPrivada(u.numero, msg, `Convocação Geral: ${assembleia.titulo}`);
                                });
                                alert(`Notificação de convocação enviada para todas as unidades do condomínio!`);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl text-amber-800 hover:bg-amber-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Notificar unidades convocadas"
                          >
                            <Bell className="w-3.5 h-3.5 text-amber-700" /> Notificar
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setAssembleiaToEditInAdmin(assembleia);
                              setIsCreateEditAssembleiaAdminOpen(true);
                            }}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                            title="Editar Reunião"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja excluir a reunião "${assembleia.titulo}"?`)) {
                                excluirAssembleia(assembleia.id);
                              }
                            }}
                            className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Excluir Reunião"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 6: MODERAÇÃO DE RECLAMAÇÕES & OCORRÊNCIAS DOS MORADORES (LARANJA PASTEL) */}
      {/* ========================================================================= */}
      <div className="bg-orange-50/70 border-2 border-orange-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsReclamacoesAdminOpen(!isReclamacoesAdminOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-orange-100/90 hover:bg-orange-200/70 transition-colors text-left cursor-pointer border-b border-orange-200 select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-950 border border-orange-400/40 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-orange-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950 tracking-tight">
                  6. Moderação de Reclamações & Ocorrências
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-950 border border-orange-300 shadow-2xs">
                  {reclamacoes.length} Ocorrência(s)
                </span>
                {reclamacoes.filter(r => r.status === 'Recebida' || r.status === 'Em análise').length > 0 && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300 animate-pulse">
                    {reclamacoes.filter(r => r.status === 'Recebida' || r.status === 'Em análise').length} Pendente(s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Altere status (recebida, em análise, resolvida), modere e oculte comentários e notifique moradores autores.
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-orange-300 text-slate-700 shadow-2xs">
            <ChevronDown className={`w-4 h-4 text-orange-900 transition-transform duration-500 ease-out ${isReclamacoesAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </button>

        {/* Accordion Body com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isReclamacoesAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-orange-50/50 p-4 sm:p-6 space-y-5">

            {/* Filtros e Busca */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* Busca */}
                <div className="sm:col-span-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar por assunto, morador ou apt..."
                    value={searchReclamacao}
                    onChange={(e) => setSearchReclamacao(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Filtro Status */}
                <div>
                  <select
                    value={filtroStatusReclamacao}
                    onChange={(e) => setFiltroStatusReclamacao(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs cursor-pointer"
                  >
                    <option value="Todas">Status: Todos</option>
                    <option value="Recebida">Recebida</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Resolvida">Resolvida</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div>

                {/* Filtro Categoria */}
                <div>
                  <select
                    value={filtroCategoriaReclamacao}
                    onChange={(e) => setFiltroCategoriaReclamacao(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs cursor-pointer"
                  >
                    <option value="Todas">Categoria: Todas</option>
                    <option value="Barulho">Barulho</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Garagem">Garagem</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Animais">Animais</option>
                    <option value="Convivência">Convivência</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Lista de Reclamações em Cards */}
            <div className="space-y-4">
              {reclamacoes
                .filter(rec => {
                  const matchesSearch = !searchReclamacao || 
                    rec.titulo.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                    rec.descricao.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                    rec.autorNome.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                    rec.autorUnidade.toLowerCase().includes(searchReclamacao.toLowerCase());

                  const matchesStatus = filtroStatusReclamacao === 'Todas' || rec.status === filtroStatusReclamacao;
                  const matchesCategoria = filtroCategoriaReclamacao === 'Todas' || rec.categoria === filtroCategoriaReclamacao;

                  return matchesSearch && matchesStatus && matchesCategoria;
                })
                .length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">Nenhuma ocorrência encontrada com estes filtros.</p>
                  </div>
                ) : (
                  reclamacoes
                    .filter(rec => {
                      const matchesSearch = !searchReclamacao || 
                        rec.titulo.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                        rec.descricao.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                        rec.autorNome.toLowerCase().includes(searchReclamacao.toLowerCase()) ||
                        rec.autorUnidade.toLowerCase().includes(searchReclamacao.toLowerCase());

                      const matchesStatus = filtroStatusReclamacao === 'Todas' || rec.status === filtroStatusReclamacao;
                      const matchesCategoria = filtroCategoriaReclamacao === 'Todas' || rec.categoria === filtroCategoriaReclamacao;

                      return matchesSearch && matchesStatus && matchesCategoria;
                    })
                    .map((rec) => {
                      const isCommentsOpen = expandedCommentsInAdmin[rec.id] !== false; // default open
                      const hiddenCommentsCount = rec.comentarios.filter(c => c.oculto).length;

                      return (
                        <div 
                          key={rec.id}
                          className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-md space-y-4 transition-all hover:border-slate-300"
                        >
                          
                          {/* Header do Card */}
                          <div className="flex items-start justify-between gap-3 flex-wrap border-b border-slate-100 pb-3">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300">
                                  {rec.categoria}
                                </span>
                                
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {rec.data}
                                </span>

                                <span className="text-xs font-black text-slate-950 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                                  Autor: {rec.autorNome} ({rec.autorUnidade})
                                </span>
                              </div>

                              <h4 className="text-base font-black text-slate-950 leading-tight">
                                {rec.titulo}
                              </h4>
                            </div>

                            {/* Seletor de Status Interativo */}
                            <div className="flex items-center gap-2">
                              <div className="space-y-0.5 text-right">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                  Status da Ocorrência:
                                </span>
                                <select
                                  value={rec.status}
                                  onChange={(e) => atualizarStatusReclamacao(rec.id, e.target.value as StatusReclamacao)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border-2 shadow-xs cursor-pointer transition-all ${
                                    rec.status === 'Resolvida' 
                                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400' 
                                      : rec.status === 'Em andamento'
                                        ? 'bg-indigo-100 text-indigo-950 border-indigo-400'
                                        : rec.status === 'Em análise'
                                          ? 'bg-amber-100 text-amber-950 border-amber-400'
                                          : rec.status === 'Encerrada'
                                            ? 'bg-slate-200 text-slate-900 border-slate-400'
                                            : 'bg-rose-100 text-rose-950 border-rose-400'
                                  }`}
                                >
                                  <option value="Recebida">📥 Recebida</option>
                                  <option value="Em análise">🔍 Em análise</option>
                                  <option value="Em andamento">⚙️ Em andamento</option>
                                  <option value="Resolvida">✅ Resolvida</option>
                                  <option value="Encerrada">🔒 Encerrada</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Descrição e Anexos */}
                          <div className="space-y-2 text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                            <p>{rec.descricao}</p>

                            {rec.anexoUrl && (
                              <div className="pt-2 border-t border-slate-200">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                                  Anexo da Ocorrência:
                                </span>
                                {rec.anexoTipo === 'video' ? (
                                  <video 
                                    src={rec.anexoUrl} 
                                    controls 
                                    className="max-h-48 rounded-xl border border-slate-300 bg-black/10"
                                  />
                                ) : (
                                  <img 
                                    src={rec.anexoUrl} 
                                    alt="Anexo" 
                                    className="max-h-48 rounded-xl border border-slate-300 object-cover"
                                  />
                                )}
                              </div>
                            )}

                            {/* Informação de Apoios e Reparo Vinculado */}
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] flex-wrap">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                <ThumbsUp className="w-3.5 h-3.5 text-indigo-700" />
                                {rec.apoiosCount} moradores apoiam esta causa
                              </span>

                              {rec.reparoId && (
                                <span className="font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Wrench className="w-3 h-3 text-indigo-600" />
                                  Ordem de Reparo Vinculada: #{rec.reparoId}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Ações da Ocorrência */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              {!rec.reparoId && rec.status !== 'Resolvida' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Deseja transformar esta reclamação em Ordem de Reparo com cotação de orçamentos?`)) {
                                      transformarEmReparo(rec.id, rec.titulo, rec.descricao);
                                      alert('Ordem de Reparo criada com sucesso no módulo de Reparos!');
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
                                  title="Converter em Ordem de Reparo"
                                >
                                  <Wrench className="w-3.5 h-3.5 text-indigo-700" />
                                  <span>Transformar em Reparo</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  const rawUnit = rec.autorUnidade.replace(/[^0-9]/g, '');
                                  const unitObj: Unidade = unidades.find(u => u.numero.replace(/[^0-9]/g, '') === rawUnit) || {
                                    id: `unit-${rawUnit || 'temp'}`,
                                    numero: rec.autorUnidade,
                                    bloco: 'A',
                                    vagaGaragem: '',
                                    moradores: []
                                  };
                                  setSelectedUnidadeParaNotificar(unitObj);
                                  setIsNotifyModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
                                title="Notificar autor desta reclamação"
                              >
                                <Bell className="w-3.5 h-3.5 text-amber-700" />
                                <span>Notificar Autor</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Tem certeza que deseja excluir permanentemente a ocorrência "${rec.titulo}"?`)) {
                                  excluirReclamacao(rec.id);
                                }
                              }}
                              className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Excluir Ocorrência"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* ========================================================= */}
                          {/* SUBSEÇÃO: MODERAÇÃO DE COMENTÁRIOS DA RECLAMAÇÃO */}
                          {/* ========================================================= */}
                          <div className="pt-2 border-t-2 border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                  <MessageSquare className="w-4 h-4 text-indigo-700" />
                                  Comentários & Apoios Vinculados ({rec.comentarios.length})
                                </span>
                                {hiddenCommentsCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[9px] font-black uppercase">
                                    {hiddenCommentsCount} Ocultado(s)
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => setExpandedCommentsInAdmin(prev => ({ ...prev, [rec.id]: !isCommentsOpen }))}
                                className="text-xs font-extrabold text-indigo-800 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                {isCommentsOpen ? 'Recolher Comentários' : 'Ver Comentários'}
                                {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {isCommentsOpen && (
                              <div className="space-y-2.5 animate-in fade-in duration-200">
                                {rec.comentarios.length === 0 ? (
                                  <p className="text-xs text-slate-500 italic py-2">
                                    Nenhum comentário ou manifestação registrada nesta ocorrência.
                                  </p>
                                ) : (
                                  rec.comentarios.map((com) => (
                                    <div
                                      key={com.id}
                                      className={`p-3 rounded-2xl border-2 transition-all space-y-2 ${
                                        com.oculto
                                          ? 'bg-rose-50/90 border-rose-300 shadow-2xs'
                                          : com.oficial
                                            ? 'bg-amber-50 border-amber-300 shadow-2xs'
                                            : 'bg-white border-slate-200 shadow-xs'
                                      }`}
                                    >
                                      {/* Header do Comentário com Autoria Transparente */}
                                      <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                            com.oficial ? 'bg-amber-500 text-slate-950' : 'bg-indigo-100 text-indigo-900'
                                          }`}>
                                            {com.oficial ? <ShieldCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                          </div>
                                          <strong className="text-xs font-black text-slate-950">
                                            {com.autorNome}
                                          </strong>
                                          <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                            {com.autorUnidade || 'Unidade não informada'}
                                          </span>
                                          {com.autorRole && (
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                                              • {com.autorRole}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                                            {com.data}
                                          </span>

                                          {/* Badge de Ocultação */}
                                          {com.oculto && (
                                            <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-950 border border-rose-400 text-[9px] font-black uppercase flex items-center gap-1">
                                              <EyeOff className="w-3 h-3" />
                                              Oculto ao Público
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Texto do Comentário */}
                                      <p className="text-xs text-slate-900 font-medium pl-7 leading-relaxed">
                                        {com.texto}
                                      </p>

                                      {/* Motivo da Ocultação se houver */}
                                      {com.oculto && com.motivoOcultacao && (
                                        <div className="ml-7 p-2 rounded-xl bg-rose-100/90 border border-rose-300 text-[11px] text-rose-950 space-y-0.5 font-semibold">
                                          <span className="font-black block uppercase text-[9px] text-rose-900">
                                            Motivo da Moderação Registrado:
                                          </span>
                                          <p>{com.motivoOcultacao}</p>
                                        </div>
                                      )}

                                      {/* Ações de Moderação do Comentário */}
                                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 ml-7 flex-wrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          
                                          {/* Botão Ocultar / Reexibir */}
                                          {com.oculto ? (
                                            <button
                                              type="button"
                                              onClick={() => toggleOcultarComentario(rec.id, com.id)}
                                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                              title="Tornar este comentário visível novamente aos moradores"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                              <span>Reexibir ao Público</span>
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setMotivoOcultacaoModal({
                                                  isOpen: true,
                                                  reclamacaoId: rec.id,
                                                  comentarioId: com.id,
                                                  autorNome: com.autorNome,
                                                  autorUnidade: com.autorUnidade,
                                                  texto: com.texto
                                                });
                                                setMotivoOcultacaoTexto('Comentário em desacordo com as diretrizes de respeito e convivência do condomínio.');
                                                setEnviarNotificacaoAoOcultar(true);
                                              }}
                                              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                              title="Ocultar comentário mantendo o registro no banco"
                                            >
                                              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                                              <span>Ocultar Comentário</span>
                                            </button>
                                          )}

                                          {/* Botão Notificar Morador Autor do Comentário */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const rawUnit = (com.autorUnidade || '').replace(/[^0-9]/g, '');
                                              const unitObj: Unidade = unidades.find(u => u.numero.replace(/[^0-9]/g, '') === rawUnit) || {
                                                id: `unit-${rawUnit || 'temp'}`,
                                                numero: com.autorUnidade || 'Geral',
                                                bloco: 'A',
                                                vagaGaragem: '',
                                                moradores: []
                                              };
                                              setSelectedUnidadeParaNotificar(unitObj);
                                              setIsNotifyModalOpen(true);
                                            }}
                                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 border border-slate-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                            title="Enviar notificação privada para a unidade deste morador"
                                          >
                                            <Bell className="w-3.5 h-3.5 text-amber-700" />
                                            <span>Notificar Autor</span>
                                          </button>
                                        </div>

                                        {/* Excluir Definitivo */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (window.confirm(`Tem certeza que deseja excluir permanentemente este comentário de "${com.autorNome}"?`)) {
                                              excluirComentario(rec.id, com.id);
                                            }
                                          }}
                                          className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                          title="Excluir Comentário Definitivamente"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })
                )}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 7: MODERAÇÃO & GESTÃO DE REPAROS & OBRAS (TEAL/VERDE-ÁGUA PASTEL) */}
      {/* ========================================================================= */}
      <div className="bg-teal-50/70 border-2 border-teal-300 rounded-3xl shadow-md overflow-hidden">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsReparosAdminOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-teal-100/90 hover:bg-teal-200/70 transition-colors text-left cursor-pointer border-b border-teal-200 select-none active:scale-[0.999]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-950 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-teal-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base text-slate-950 tracking-tight">
                  7. Moderação & Gestão de Reparos & Manutenções
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-200 text-teal-950 border border-teal-300 text-[10px] font-black uppercase shadow-2xs">
                  {reparos.length} Cadastrado(s)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300 text-[10px] font-black uppercase shadow-2xs">
                  {reparos.filter(r => r.status !== 'Resolvido' && r.status !== 'Cancelado').length} Em Aberto
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Altere status de obras, aprove cotações, modere comentários e resolva reparos simples em 1 clique.
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-teal-300 text-slate-700 shadow-2xs">
            <ChevronDown className={`w-4 h-4 text-teal-900 transition-transform duration-500 ease-out ${isReparosAdminOpen ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </button>

        {/* Accordion Body com Animação Suave de Altura */}
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
            isReparosAdminOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden bg-teal-50/50 p-4 sm:p-6 space-y-5">

            {/* Filtros e Busca */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                
                {/* Busca */}
                <div className="sm:col-span-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar por título, morador ou apt..."
                    value={searchReparo}
                    onChange={(e) => setSearchReparo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Filtro Status */}
                <div>
                  <select
                    value={filtroStatusReparo}
                    onChange={(e) => setFiltroStatusReparo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs cursor-pointer"
                  >
                    <option value="Todas">Status: Todos</option>
                    <option value="Solicitado">Solicitado</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Buscando Orçamento">Buscando Orçamento</option>
                    <option value="Análise de Orçamento">Análise de Orçamento</option>
                    <option value="Orçamento Contratado">Orçamento Contratado</option>
                    <option value="Em Execução">Em Execução</option>
                    <option value="Resolvido">Resolvido</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Filtro Porte */}
                <div>
                  <select
                    value={filtroPorteReparo}
                    onChange={(e) => setFiltroPorteReparo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs cursor-pointer"
                  >
                    <option value="Todos">Porte: Todos</option>
                    <option value="Pequeno">Pequeno (Simples)</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande (Obras)</option>
                  </select>
                </div>

                {/* Filtro Categoria */}
                <div>
                  <select
                    value={filtroCategoriaReparo}
                    onChange={(e) => setFiltroCategoriaReparo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs cursor-pointer"
                  >
                    <option value="Todas">Local: Todos</option>
                    <option value="Garagem">Garagem</option>
                    <option value="Elevador">Elevador</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Hall / Corredor">Hall / Corredor</option>
                    <option value="Academia">Academia</option>
                    <option value="Salão de Festas">Salão de Festas</option>
                    <option value="Churrasqueira">Churrasqueira</option>
                    <option value="Quadra">Quadra</option>
                    <option value="Escadas">Escadas</option>
                    <option value="Inter-Apartamentos">Inter-Apartamentos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Header da Lista de Reparos com Botões de Ação Global */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Ordens de Reparo & Manutenção ({reparos
                  .filter(rep => {
                    const matchesSearch = !searchReparo || 
                      rep.titulo.toLowerCase().includes(searchReparo.toLowerCase()) ||
                      rep.descricao.toLowerCase().includes(searchReparo.toLowerCase()) ||
                      rep.solicitanteNome.toLowerCase().includes(searchReparo.toLowerCase()) ||
                      rep.solicitanteUnidade.toLowerCase().includes(searchReparo.toLowerCase());
                    const matchesStatus = filtroStatusReparo === 'Todas' || rep.status === filtroStatusReparo;
                    const matchesPorte = filtroPorteReparo === 'Todos' || rep.porte === filtroPorteReparo;
                    const matchesCategoria = filtroCategoriaReparo === 'Todas' || rep.categoria === filtroCategoriaReparo;
                    return matchesSearch && matchesStatus && matchesPorte && matchesCategoria;
                  }).length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allOpen: Record<string, boolean> = {};
                    reparos.forEach(r => { allOpen[r.id] = true; });
                    setExpandedReparosInAdmin(allOpen);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs"
                >
                  Expandir Todos
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedReparosInAdmin({})}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs"
                >
                  Recolher Todos
                </button>
              </div>
            </div>

            {/* Lista de Reparos em Cards */}
            <div className="space-y-4">
              {reparos
                .filter(rep => {
                  const matchesSearch = !searchReparo || 
                    rep.titulo.toLowerCase().includes(searchReparo.toLowerCase()) ||
                    rep.descricao.toLowerCase().includes(searchReparo.toLowerCase()) ||
                    rep.solicitanteNome.toLowerCase().includes(searchReparo.toLowerCase()) ||
                    rep.solicitanteUnidade.toLowerCase().includes(searchReparo.toLowerCase());

                  const matchesStatus = filtroStatusReparo === 'Todas' || rep.status === filtroStatusReparo;
                  const matchesPorte = filtroPorteReparo === 'Todos' || rep.porte === filtroPorteReparo;
                  const matchesCategoria = filtroCategoriaReparo === 'Todas' || rep.categoria === filtroCategoriaReparo;

                  return matchesSearch && matchesStatus && matchesPorte && matchesCategoria;
                })
                .length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                    <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">Nenhum reparo encontrado com estes filtros.</p>
                  </div>
                ) : (
                  reparos
                    .filter(rep => {
                      const matchesSearch = !searchReparo || 
                        rep.titulo.toLowerCase().includes(searchReparo.toLowerCase()) ||
                        rep.descricao.toLowerCase().includes(searchReparo.toLowerCase()) ||
                        rep.solicitanteNome.toLowerCase().includes(searchReparo.toLowerCase()) ||
                        rep.solicitanteUnidade.toLowerCase().includes(searchReparo.toLowerCase());

                      const matchesStatus = filtroStatusReparo === 'Todas' || rep.status === filtroStatusReparo;
                      const matchesPorte = filtroPorteReparo === 'Todos' || rep.porte === filtroPorteReparo;
                      const matchesCategoria = filtroCategoriaReparo === 'Todas' || rep.categoria === filtroCategoriaReparo;

                      return matchesSearch && matchesStatus && matchesPorte && matchesCategoria;
                    })
                    .map((rep) => {
                      const isCardOpen = Boolean(expandedReparosInAdmin[rep.id]);
                      const isCommentsOpen = expandedCommentsInReparosAdmin[rep.id] !== false; // default open
                      const isOrcsOpen = expandedOrcamentosInReparosAdmin[rep.id] !== false; // default open
                      const hiddenCommentsCount = (rep.comentarios || []).filter(c => c.oculto).length;

                      return (
                        <div 
                          key={rep.id}
                          className="bg-white border-2 border-emerald-500 rounded-3xl shadow-md overflow-hidden transition-all hover:border-emerald-600 space-y-0"
                        >
                          
                          {/* Header Retrátil do Card de Reparo */}
                          <div 
                            onClick={() => setExpandedReparosInAdmin(prev => ({ ...prev, [rep.id]: !Boolean(prev[rep.id]) }))}
                            className="p-4 sm:p-5 flex items-start justify-between gap-3 flex-wrap cursor-pointer select-none bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors"
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                  rep.porte === 'Pequeno' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                                  rep.porte === 'Médio' ? 'bg-amber-100 text-amber-950 border-amber-300' :
                                  'bg-rose-100 text-rose-950 border-rose-300'
                                }`}>
                                  Porte {rep.porte}
                                </span>

                                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 border border-slate-300">
                                  {rep.categoria}
                                </span>
                                
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {rep.dataSolicitacao}
                                </span>

                                <span className="text-xs font-black text-slate-950 bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                                  Solicitante: {rep.solicitanteNome} ({rep.solicitanteUnidade})
                                </span>
                              </div>

                              <h4 className="text-base font-black text-slate-950 leading-tight">
                                {rep.titulo}
                              </h4>

                              {/* Prévia quando fechado */}
                              {!isCardOpen && (
                                <div className="flex items-center gap-3 pt-0.5 text-xs text-slate-600 font-medium flex-wrap">
                                  <p className="line-clamp-1 flex-1">
                                    {rep.descricao}
                                  </p>
                                  <div className="flex items-center gap-2 shrink-0 text-[11px] font-bold text-slate-500">
                                    {rep.orcamentos && rep.orcamentos.length > 0 && (
                                      <span className="text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                                        {rep.orcamentos.length} Orçamento(s)
                                      </span>
                                    )}
                                    {rep.comentarios && rep.comentarios.length > 0 && (
                                      <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                        {rep.comentarios.length} Comentário(s)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Seletor de Status Interativo e Botão Expandir */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="space-y-0.5 text-right" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                  Status do Reparo:
                                </span>
                                <select
                                  value={rep.status}
                                  onChange={(e) => atualizarStatusReparo(rep.id, e.target.value as StatusReparo)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border-2 shadow-xs cursor-pointer transition-all ${
                                    rep.status === 'Resolvido' 
                                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400' 
                                      : rep.status === 'Em Execução'
                                        ? 'bg-sky-100 text-sky-950 border-sky-400'
                                        : rep.status === 'Orçamento Contratado'
                                          ? 'bg-teal-100 text-teal-950 border-teal-400'
                                          : rep.status === 'Análise de Orçamento'
                                            ? 'bg-orange-100 text-orange-950 border-orange-400'
                                            : rep.status === 'Buscando Orçamento'
                                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                                              : rep.status === 'Em análise'
                                                ? 'bg-purple-100 text-purple-950 border-purple-400'
                                                : rep.status === 'Cancelado'
                                                  ? 'bg-slate-200 text-slate-900 border-slate-400'
                                                  : 'bg-blue-100 text-blue-950 border-blue-400'
                                  }`}
                                >
                                  <option value="Solicitado">📥 Solicitado</option>
                                  <option value="Em análise">🔍 Em análise</option>
                                  <option value="Buscando Orçamento">📋 Buscando Orçamento</option>
                                  <option value="Análise de Orçamento">⚖️ Análise de Orçamento</option>
                                  <option value="Orçamento Contratado">🤝 Orçamento Contratado</option>
                                  <option value="Em Execução">🛠️ Em Execução</option>
                                  <option value="Resolvido">✅ Resolvido</option>
                                  <option value="Cancelado">🔒 Cancelado</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedReparosInAdmin(prev => ({ ...prev, [rep.id]: !Boolean(prev[rep.id]) }));
                                }}
                                className="p-2 rounded-xl bg-white border border-emerald-300 text-slate-700 hover:bg-emerald-50 shadow-2xs cursor-pointer ml-1"
                                title={isCardOpen ? "Recolher detalhes deste reparo" : "Expandir detalhes deste reparo"}
                              >
                                <ChevronDown className={`w-4 h-4 text-emerald-900 transition-transform duration-500 ease-out ${isCardOpen ? 'rotate-180' : 'rotate-0'}`} />
                              </button>
                            </div>
                          </div>

                          {/* Corpo Interno Retrátil com Animação Suave */}
                          <div 
                            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
                              isCardOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                            }`}
                          >
                            <div className="min-h-0 overflow-hidden p-4 sm:p-5 pt-3 space-y-4 border-t border-emerald-100 bg-white">
                              
                              {/* Descrição e Anexos */}
                              <div className="space-y-2 text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                                <p>{rep.descricao}</p>

                                {/* Anexo de Abertura se houver */}
                                {rep.anexoUrl && (
                                  <div className="pt-2 border-t border-slate-200">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                                      Evidência Anexada:
                                    </span>
                                    {rep.anexoTipo === 'video' ? (
                                      <video 
                                        src={rep.anexoUrl} 
                                        controls 
                                        className="max-h-48 rounded-xl border border-slate-300 bg-black/10"
                                      />
                                    ) : (
                                      <img 
                                        src={rep.anexoUrl} 
                                        alt="Anexo do Reparo" 
                                        className="max-h-48 rounded-xl border border-slate-300 object-cover"
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Fotos Antes / Depois Cadastradas */}
                                {rep.fotosAntes && rep.fotosAntes.length > 0 && !rep.anexoUrl && (
                                  <div className="pt-2 border-t border-slate-200 flex gap-2 overflow-x-auto pb-1">
                                    {rep.fotosAntes.map((foto, fIdx) => (
                                      <img 
                                        key={fIdx} 
                                        src={foto} 
                                        alt="Foto Antes" 
                                        className="h-20 w-28 rounded-xl border border-slate-300 object-cover shrink-0" 
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* Informação de Apoios e Cotação */}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] flex-wrap">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-700" />
                                    <span>{rep.apoiosCount || 0} moradores apoiam a prioridade desta manutenção</span>
                                  </span>

                                  {rep.valorContratado && (
                                    <span className="font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
                                      Valor Contratado: {rep.valorContratado} {rep.empresaContratada ? `(${rep.empresaContratada})` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Ações Rápidas de Moderação */}
                              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  
                                  {/* Botão Resolver Reparo Simples */}
                                  {rep.status !== 'Resolvido' && rep.status !== 'Cancelado' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`Deseja marcar o reparo "${rep.titulo}" como RESOLVIDO diretamente?`)) {
                                          resolverReparoSimples(rep.id);
                                        }
                                      }}
                                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                                      title="Finalizar e marcar como resolvido em 1 clique (para manutenções simples como troca de lâmpada, ajustes rápidos)"
                                    >
                                      <Zap className="w-3.5 h-3.5 fill-white" />
                                      <span>Resolver Reparo Direto (Simples)</span>
                                    </button>
                                  )}

                                  {/* Notificar Solicitante */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const rawUnit = (rep.solicitanteUnidade || '').replace(/[^0-9]/g, '');
                                      const unitObj: Unidade = unidades.find(u => u.numero.replace(/[^0-9]/g, '') === rawUnit) || {
                                        id: `unit-${rawUnit || 'temp'}`,
                                        numero: rep.solicitanteUnidade || 'Geral',
                                        bloco: 'A',
                                        vagaGaragem: '',
                                        moradores: []
                                      };
                                      setSelectedUnidadeParaNotificar(unitObj);
                                      setIsNotifyModalOpen(true);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    <Bell className="w-3.5 h-3.5 text-amber-700" />
                                    <span>Notificar Solicitante</span>
                                  </button>
                                </div>

                                {/* Excluir Reparo */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Tem certeza que deseja excluir permanentemente o pedido de reparo "${rep.titulo}"?`)) {
                                      excluirReparo(rep.id);
                                    }
                                  }}
                                  className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                  title="Excluir Pedido de Reparo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* ========================================================= */}
                              {/* SUBSEÇÃO: ORÇAMENTOS E COTAÇÕES DE EMPRESAS */}
                              {/* ========================================================= */}
                              <div className="pt-3 border-t-2 border-slate-200 space-y-3">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                      <DollarSign className="w-4 h-4 text-emerald-700" />
                                      Orçamentos & Cotações Publicadas ({rep.orcamentos?.length || 0})
                                    </span>
                                    {rep.orcamentoAprovadoId && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[9px] font-black uppercase">
                                        Contratado: {rep.empresaContratada || 'Empresa Selecionada'}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReparoParaOrcamento(rep);
                                        setFormOrcamento({
                                          empresa: '',
                                          siteUrl: '',
                                          cnpj: '',
                                          valor: '',
                                          prazoDias: '',
                                          descricao: '',
                                          documentoUrl: '',
                                          documentoNome: ''
                                        });
                                        setIsModalNovoOrcamentoOpen(true);
                                      }}
                                      className="px-2.5 py-1 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-[11px] font-black uppercase flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Publicar Orçamento
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setExpandedOrcamentosInReparosAdmin(prev => ({ ...prev, [rep.id]: !isOrcsOpen }))}
                                      className="text-xs font-extrabold text-slate-700 hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                      {isOrcsOpen ? 'Recolher Cotações' : 'Ver Cotações'}
                                      {isOrcsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>

                                {isOrcsOpen && (
                                  <div className="space-y-3 animate-in fade-in duration-200">
                                    {(!rep.orcamentos || rep.orcamentos.length === 0) ? (
                                      <div className="p-3.5 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-xs font-semibold text-slate-600">
                                        Nenhum orçamento cadastrado ainda para esta manutenção. Clique em "+ Publicar Orçamento" para adicionar cotações de empresas.
                                      </div>
                                    ) : (
                                      <div className="space-y-2.5">
                                        {rep.orcamentos.map((orc) => {
                                          const isContratado = rep.orcamentoAprovadoId === orc.id;

                                          return (
                                            <div 
                                              key={orc.id}
                                              className={`p-3.5 rounded-2xl border-2 transition-all space-y-2 ${
                                                isContratado 
                                                  ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-2 ring-emerald-400/20' 
                                                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                                              }`}
                                            >
                                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                                <div>
                                                  <div className="flex items-center gap-2 flex-wrap">
                                                    <strong className="text-xs font-black text-slate-950">
                                                      {orc.empresa}
                                                    </strong>

                                                    {orc.siteUrl && (
                                                      <a 
                                                        href={orc.siteUrl.startsWith('http') ? orc.siteUrl : `https://${orc.siteUrl}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] font-extrabold text-indigo-700 hover:underline inline-flex items-center gap-0.5"
                                                      >
                                                        <span>Visitar Site</span>
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                      </a>
                                                    )}

                                                    {isContratado && (
                                                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400 text-[9px] font-black uppercase flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Orçamento Aprovado
                                                      </span>
                                                    )}
                                                  </div>

                                                  {orc.cnpj && (
                                                    <span className="text-[10px] text-slate-500 font-mono font-medium block">
                                                      CNPJ: {orc.cnpj}
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="text-right">
                                                  <span className="text-sm font-black text-slate-950 block">
                                                    {orc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                  </span>
                                                  <span className="text-[10px] font-bold text-slate-600 block">
                                                    Prazo: {orc.prazoDias} dias úteis
                                                  </span>
                                                </div>
                                              </div>

                                              {orc.descricao && (
                                                <p className="text-xs text-slate-800 font-medium bg-slate-50/80 p-2 rounded-xl border border-slate-200/80">
                                                  {orc.descricao}
                                                </p>
                                              )}

                                              {/* Documento / PDF Anexado & Ações */}
                                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 flex-wrap">
                                                <div>
                                                  {orc.documentoUrl ? (
                                                    <a 
                                                      href={orc.documentoUrl} 
                                                      target="_blank" 
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-extrabold transition-all shadow-2xs cursor-pointer"
                                                      title="Abrir proposta original em PDF"
                                                    >
                                                      <FileText className="w-3.5 h-3.5 text-indigo-700" />
                                                      <span>{orc.documentoNome || 'Ver Documento da Proposta / PDF'}</span>
                                                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                                    </a>
                                                  ) : (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                      Documento físico / Proposta sem anexo digital
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                  {!isContratado ? (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        if (window.confirm(`Deseja aprovar e contratar o orçamento de "${orc.empresa}" por ${orc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}?`)) {
                                                          selecionarOrcamento(rep.id, orc.id);
                                                        }
                                                      }}
                                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
                                                    >
                                                      <CheckCircle2 className="w-3 h-3" /> Contratar Empresa
                                                    </button>
                                                  ) : (
                                                    <button
                                                      type="button"
                                                      onClick={() => selecionarOrcamento(rep.id, '')}
                                                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                                                    >
                                                      Desmarcar Contratação
                                                    </button>
                                                  )}

                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      if (window.confirm(`Tem certeza que deseja excluir o orçamento de "${orc.empresa}"?`)) {
                                                        excluirOrcamentoReparo(rep.id, orc.id);
                                                      }
                                                    }}
                                                    className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                                    title="Excluir Orçamento"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
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
                              </div>

                              {/* ========================================================= */}
                              {/* SUBSEÇÃO: MODERAÇÃO DE COMENTÁRIOS DO REPARO */}
                              {/* ========================================================= */}
                              <div className="pt-3 border-t-2 border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                      <MessageSquare className="w-4 h-4 text-indigo-700" />
                                      Comentários & Apoios Vinculados ({rep.comentarios?.length || 0})
                                    </span>
                                    {hiddenCommentsCount > 0 && (
                                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[9px] font-black uppercase">
                                        {hiddenCommentsCount} Ocultado(s)
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setExpandedCommentsInReparosAdmin(prev => ({ ...prev, [rep.id]: !isCommentsOpen }))}
                                    className="text-xs font-extrabold text-indigo-800 hover:underline cursor-pointer flex items-center gap-1"
                                  >
                                    {isCommentsOpen ? 'Recolher Comentários' : 'Ver Comentários'}
                                    {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                {isCommentsOpen && (
                                  <div className="space-y-2.5 animate-in fade-in duration-200">
                                    {(!rep.comentarios || rep.comentarios.length === 0) ? (
                                      <p className="text-xs text-slate-500 italic py-2">
                                        Nenhum comentário ou manifestação registrada nesta ordem de reparo.
                                      </p>
                                    ) : (
                                      rep.comentarios.map((com) => (
                                        <div
                                          key={com.id}
                                          className={`p-3 rounded-2xl border-2 transition-all space-y-2 ${
                                            com.oculto
                                              ? 'bg-rose-50/90 border-rose-300 shadow-2xs'
                                              : com.oficial
                                                ? 'bg-amber-50 border-amber-300 shadow-2xs'
                                                : 'bg-white border-slate-200 shadow-xs'
                                          }`}
                                        >
                                          {/* Header do Comentário com Autoria Transparente */}
                                          <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                                com.oficial ? 'bg-amber-500 text-slate-950' : 'bg-indigo-100 text-indigo-900'
                                              }`}>
                                                {com.oficial ? <ShieldCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                              </div>
                                              <strong className="text-xs font-black text-slate-950">
                                                {com.autorNome}
                                              </strong>
                                              <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                                {com.autorUnidade || 'Unidade não informada'}
                                              </span>
                                              {com.autorRole && (
                                                <span className="text-[10px] font-bold text-slate-600 uppercase">
                                                  • {com.autorRole}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                                                {com.data}
                                              </span>

                                              {/* Badge de Ocultação */}
                                              {com.oculto && (
                                                <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-950 border border-rose-400 text-[9px] font-black uppercase flex items-center gap-1">
                                                  <EyeOff className="w-3 h-3" />
                                                  Oculto ao Público
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Texto do Comentário */}
                                          <p className="text-xs text-slate-900 font-medium pl-7 leading-relaxed">
                                            {com.texto}
                                          </p>

                                          {/* Motivo da Ocultação se houver */}
                                          {com.oculto && com.motivoOcultacao && (
                                            <div className="ml-7 p-2 rounded-xl bg-rose-100/90 border border-rose-300 text-[11px] text-rose-950 space-y-0.5 font-semibold">
                                              <span className="font-black block uppercase text-[9px] text-rose-900">
                                                Motivo da Moderação Registrado:
                                              </span>
                                              <p>{com.motivoOcultacao}</p>
                                            </div>
                                          )}

                                          {/* Ações de Moderação do Comentário */}
                                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 ml-7 flex-wrap">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              
                                              {/* Botão Ocultar / Reexibir */}
                                              {com.oculto ? (
                                                <button
                                                  type="button"
                                                  onClick={() => toggleOcultarComentarioReparo(rep.id, com.id)}
                                                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                                  title="Tornar este comentário visível novamente aos moradores"
                                                >
                                                  <Eye className="w-3.5 h-3.5" />
                                                  <span>Reexibir ao Público</span>
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setMotivoOcultacaoReparoModal({
                                                      isOpen: true,
                                                      reparoId: rep.id,
                                                      comentarioId: com.id,
                                                      autorNome: com.autorNome,
                                                      autorUnidade: com.autorUnidade,
                                                      texto: com.texto
                                                    });
                                                    setMotivoOcultacaoReparoTexto('Comentário em desacordo com as diretrizes de respeito e convivência do condomínio.');
                                                    setEnviarNotificacaoAoOcultarReparo(true);
                                                  }}
                                                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                                  title="Ocultar comentário mantendo o registro no banco"
                                                >
                                                  <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                                                  <span>Ocultar Comentário</span>
                                                </button>
                                              )}

                                              {/* Botão Notificar Morador Autor do Comentário */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const rawUnit = (com.autorUnidade || '').replace(/[^0-9]/g, '');
                                                  const unitObj: Unidade = unidades.find(u => u.numero.replace(/[^0-9]/g, '') === rawUnit) || {
                                                    id: `unit-${rawUnit || 'temp'}`,
                                                    numero: com.autorUnidade || 'Geral',
                                                    bloco: 'A',
                                                    vagaGaragem: '',
                                                    moradores: []
                                                  };
                                                  setSelectedUnidadeParaNotificar(unitObj);
                                                  setIsNotifyModalOpen(true);
                                                }}
                                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 border border-slate-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                                title="Enviar notificação privada para a unidade deste morador"
                                              >
                                                <Bell className="w-3.5 h-3.5 text-amber-700" />
                                                <span>Notificar Autor</span>
                                              </button>
                                            </div>

                                            {/* Excluir Definitivo */}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (window.confirm(`Tem certeza que deseja excluir permanentemente este comentário de "${com.autorNome}"?`)) {
                                                  excluirComentarioReparo(rep.id, com.id);
                                                }
                                              }}
                                              className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                              title="Excluir Comentário Definitivamente"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>

                        </div>
                      );
                    })
                )}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVA CATEGORIA / CARGO DINÂMICO */}
      {/* ========================================================================= */}
      {isModalNovaCategoriaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-950">
                    Criar Nova Categoria / Cargo
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Adicione qualquer novo cargo para aparecer no select sem precisar alterar código.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalNovaCategoriaOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNovaCategoria} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Nome do Cargo / Categoria *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Piscineiro, Jardineiro, Eletricista, Manobrista..."
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Nível de Permissão & Poderes *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNovaCategoriaTipoAcesso('total')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      novaCategoriaTipoAcesso === 'total'
                        ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-950">
                      <Lock className="w-3.5 h-3.5 text-amber-800" />
                      <span>Acesso Irrestrito (Admin)</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">
                      Acesso total a todas as telas, painel de admin e gestão.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNovaCategoriaTipoAcesso('morador_destaque')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      novaCategoriaTipoAcesso === 'morador_destaque'
                        ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-950">
                      <Unlock className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Poder de Morador (Conselho)</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">
                      Poder de um morador comum, mas ganha destaque no quadro de equipe.
                    </p>
                  </button>
                </div>
              </div>

              {/* Descrição Opcional */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Descrição / Atribuições (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Responsável pelas vistorias técnicas e orçamentos de obras"
                  value={novaCategoriaDescricao}
                  onChange={(e) => setNovaCategoriaDescricao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              {/* Sugestões Rápidas */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Sugestões Rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Piscineiro', 'Jardineiro', 'Eletricista', 'Auxiliar de Manutenção', 'Manobrista', 'Zelador Chefe'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNovaCategoriaNome(sug)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalNovaCategoriaOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 cursor-pointer"
                >
                  Salvar e Adicionar ao Select
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal de Notificação Privada da Unidade */}
      <PrivateNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setSelectedUnidadeParaNotificar(null);
        }}
        unidade={selectedUnidadeParaNotificar}
      />

      {/* Modal de Suspensão e Moderação de Serviços */}
      <SuspendServiceModal
        isOpen={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setServicoParaSuspender(null);
        }}
        servico={servicoParaSuspender}
      />

      {/* Modal de Edição de Funcionário / Colaborador */}
      <EditFuncionarioModal
        isOpen={isEditFuncionarioModalOpen}
        onClose={() => {
          setIsEditFuncionarioModalOpen(false);
          setSelectedFuncionarioToEdit(null);
        }}
        funcionario={selectedFuncionarioToEdit}
      />

      {/* Modal de Suspensão e Moderação de Eventos */}
      <SuspendEventoModal
        isOpen={isSuspendEventoModalOpen}
        onClose={() => {
          setIsSuspendEventoModalOpen(false);
          setEventoParaSuspender(null);
        }}
        evento={eventoParaSuspender}
      />

      {/* Modal de Criação / Edição de Evento pelo Admin */}
      <CreateEditEventoModal
        isOpen={isCreateEditEventoAdminOpen}
        onClose={() => {
          setIsCreateEditEventoAdminOpen(false);
          setEventoToEditInAdmin(null);
        }}
        eventoToEdit={eventoToEditInAdmin}
      />

      {/* Modal de Criação / Edição de Assembleia / Reunião pelo Admin */}
      <CreateEditAssembleiaModal
        isOpen={isCreateEditAssembleiaAdminOpen}
        onClose={() => {
          setIsCreateEditAssembleiaAdminOpen(false);
          setAssembleiaToEditInAdmin(null);
        }}
        assembleiaToEdit={assembleiaToEditInAdmin}
      />

      {/* Modal de Publicação de Ata & Soluções pelo Admin */}
      <PublicarAtaModal
        isOpen={isPublicarAtaAdminOpen}
        onClose={() => {
          setIsPublicarAtaAdminOpen(false);
          setAssembleiaParaAtaAdmin(null);
        }}
        assembleia={assembleiaParaAtaAdmin}
      />

      {/* Modal de Confirmação e Registro de Ocultação de Comentário */}
      {motivoOcultacaoModal && motivoOcultacaoModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border-2 border-rose-400 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-950">
                    Ocultar Comentário da Visão Pública
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    O comentário continuará registrado no banco, mas não será mais visível aos moradores.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMotivoOcultacaoModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações do Autor e Conteúdo */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-950">
                  Autor: {motivoOcultacaoModal.autorNome}
                </span>
                <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {motivoOcultacaoModal.autorUnidade}
                </span>
              </div>
              <p className="text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200 leading-relaxed">
                "{motivoOcultacaoModal.texto}"
              </p>
            </div>

            {/* Formulário de Motivo */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Motivo da Moderação / Ocultação *
                </label>
                <textarea
                  rows={3}
                  value={motivoOcultacaoTexto}
                  onChange={(e) => setMotivoOcultacaoTexto(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 resize-none shadow-xs"
                  placeholder="Ex: Linguagem ofensiva, desrespeito ao regimento ou acusação indevida..."
                  required
                />
              </div>

              {/* Checkbox Notificar */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enviarNotificacaoAoOcultar}
                  onChange={(e) => setEnviarNotificacaoAoOcultar(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className="text-xs">
                  <strong className="block font-black text-amber-950">
                    Enviar Notificação Privada ao Morador
                  </strong>
                  <span className="text-[11px] text-amber-900">
                    Avisa automaticamente a unidade {motivoOcultacaoModal.autorUnidade} sobre a moderação e o motivo registrado.
                  </span>
                </div>
              </label>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMotivoOcultacaoModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!motivoOcultacaoTexto.trim()) {
                    alert('Por favor, informe o motivo da moderação.');
                    return;
                  }
                  toggleOcultarComentario(
                    motivoOcultacaoModal.reclamacaoId, 
                    motivoOcultacaoModal.comentarioId, 
                    motivoOcultacaoTexto.trim()
                  );

                  if (enviarNotificacaoAoOcultar && motivoOcultacaoModal.autorUnidade) {
                    const rawUnit = motivoOcultacaoModal.autorUnidade.replace(/[^0-9]/g, '') || motivoOcultacaoModal.autorUnidade;
                    enviarNotificacaoPrivada(
                      rawUnit,
                      `Moderação de Conteúdo: Seu comentário na ocorrência foi ocultado da visualização pública pela administração. Motivo: ${motivoOcultacaoTexto.trim()}`,
                      'Aviso de Moderação de Comentário'
                    );
                  }

                  setMotivoOcultacaoModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                <span>Confirmar Ocultação</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR MOTIVO DA OCULTAÇÃO DE COMENTÁRIO DE REPARO */}
      {/* ========================================================================= */}
      {motivoOcultacaoReparoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border-2 border-rose-400 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-950">
                    Ocultar Manifestação de Reparo
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    O comentário continuará registrado no banco, mas não será mais visível aos moradores.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMotivoOcultacaoReparoModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações do Autor e Conteúdo */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-950">
                  Autor: {motivoOcultacaoReparoModal.autorNome}
                </span>
                <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {motivoOcultacaoReparoModal.autorUnidade}
                </span>
              </div>
              <p className="text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200 leading-relaxed">
                "{motivoOcultacaoReparoModal.texto}"
              </p>
            </div>

            {/* Formulário de Motivo */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Motivo da Moderação / Ocultação *
                </label>
                <textarea
                  rows={3}
                  value={motivoOcultacaoReparoTexto}
                  onChange={(e) => setMotivoOcultacaoReparoTexto(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-rose-500 resize-none shadow-xs"
                  placeholder="Ex: Linguagem ofensiva, desrespeito ou informação incorreta..."
                  required
                />
              </div>

              {/* Checkbox Notificar */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enviarNotificacaoAoOcultarReparo}
                  onChange={(e) => setEnviarNotificacaoAoOcultarReparo(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className="text-xs">
                  <strong className="block font-black text-amber-950">
                    Enviar Notificação Privada ao Morador
                  </strong>
                  <span className="text-[11px] text-amber-900">
                    Avisa automaticamente a unidade {motivoOcultacaoReparoModal.autorUnidade} sobre a moderação e o motivo registrado.
                  </span>
                </div>
              </label>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMotivoOcultacaoReparoModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!motivoOcultacaoReparoTexto.trim()) {
                    alert('Por favor, informe o motivo da moderação.');
                    return;
                  }
                  toggleOcultarComentarioReparo(
                    motivoOcultacaoReparoModal.reparoId, 
                    motivoOcultacaoReparoModal.comentarioId, 
                    motivoOcultacaoReparoTexto.trim()
                  );

                  if (enviarNotificacaoAoOcultarReparo && motivoOcultacaoReparoModal.autorUnidade) {
                    const rawUnit = motivoOcultacaoReparoModal.autorUnidade.replace(/[^0-9]/g, '') || motivoOcultacaoReparoModal.autorUnidade;
                    enviarNotificacaoPrivada(
                      rawUnit,
                      `Moderação de Conteúdo: Seu comentário no reparo/manutenção foi ocultado da visualização pública pela administração. Motivo: ${motivoOcultacaoReparoTexto.trim()}`,
                      'Aviso de Moderação de Comentário'
                    );
                  }

                  setMotivoOcultacaoReparoModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                <span>Confirmar Ocultação</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PUBLICAR NOVO ORÇAMENTO / COTAÇÃO DE FORNECEDOR */}
      {/* ========================================================================= */}
      {isModalNovoOrcamentoOpen && reparoParaOrcamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border-2 border-indigo-400 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-950">
                    Publicar Orçamento / Cotação Técnica
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Ordem de Reparo: <b className="text-slate-800">{reparoParaOrcamento.titulo}</b>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalNovoOrcamentoOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formOrcamento.empresa.trim()) {
                  alert('Por favor, informe o nome da empresa.');
                  return;
                }
                const valorNum = parseCurrencyInput(formOrcamento.valor);
                if (isNaN(valorNum) || valorNum <= 0) {
                  alert('Por favor, informe um valor válido para o orçamento.');
                  return;
                }
                const prazoNum = parseInt(formOrcamento.prazoDias, 10);
                if (isNaN(prazoNum) || prazoNum <= 0) {
                  alert('Por favor, informe o prazo em dias úteis.');
                  return;
                }

                adicionarOrcamentoReparo(reparoParaOrcamento.id, {
                  empresa: formOrcamento.empresa.trim(),
                  siteUrl: formOrcamento.siteUrl.trim(),
                  cnpj: formOrcamento.cnpj.trim() || undefined,
                  valor: valorNum,
                  prazoDias: prazoNum,
                  descricao: formOrcamento.descricao.trim(),
                  documentoUrl: formOrcamento.documentoUrl.trim() || undefined,
                  documentoNome: formOrcamento.documentoNome.trim() || undefined
                });

                alert(`Orçamento da empresa "${formOrcamento.empresa.trim()}" publicado com sucesso! Todos os moradores agora podem visualizá-lo.`);
                setIsModalNovoOrcamentoOpen(false);
              }}
              className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nome da Empresa */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    Nome da Empresa / Prestador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Automatiza Tech Portões e Serralheria Ltda"
                    value={formOrcamento.empresa}
                    onChange={(e) => setFormOrcamento(prev => ({ ...prev, empresa: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
                  />
                </div>

                {/* Site da Empresa */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    Link do Site Oficial da Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="https://empresa.com.br"
                    value={formOrcamento.siteUrl}
                    onChange={(e) => setFormOrcamento(prev => ({ ...prev, siteUrl: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
                  />
                </div>

                {/* CNPJ Formatado Automaticamente */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                      CNPJ (Opcional)
                    </label>
                    {formOrcamento.cnpj && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formOrcamento.cnpj.replace(/\D/g, '').length}/14 dígitos
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={18}
                    placeholder="00.000.000/0000-00"
                    value={formOrcamento.cnpj}
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value);
                      setFormOrcamento(prev => ({ ...prev, cnpj: formatted }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
                  />
                </div>

                {/* Preço / Valor Total com Máscara de Moeda (R$ e centavos automáticos) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    Preço / Valor Total *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="R$ 0,00"
                    value={formOrcamento.valor}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setFormOrcamento(prev => ({ ...prev, valor: formatted }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-emerald-900 font-black focus:outline-none focus:bg-white focus:border-emerald-500 shadow-xs tracking-wide"
                  />
                </div>

                {/* Prazo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    Prazo de Execução (Dias Úteis) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Ex: 3"
                    value={formOrcamento.prazoDias}
                    onChange={(e) => setFormOrcamento(prev => ({ ...prev, prazoDias: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Comentário / Escopo da Proposta */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Comentário Técnico / Escopo & Garantia *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva as peças incluídas, marcas, especificações técnicas e prazo de garantia oferecido..."
                  value={formOrcamento.descricao}
                  onChange={(e) => setFormOrcamento(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500 resize-none shadow-xs"
                />
              </div>

              {/* Documento do Orçamento (Link ou Upload) */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-indigo-950 font-black text-xs uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-indigo-700" />
                  <span>Documento do Orçamento / PDF Transparente</span>
                </div>
                <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
                  Disponibilize o arquivo PDF ou link da proposta comercial para que os moradores possam conferir a transparência da contratação.
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Insira a URL do documento (ex: https://.../orcamento.pdf)"
                    value={formOrcamento.documentoUrl}
                    onChange={(e) => setFormOrcamento(prev => ({ ...prev, documentoUrl: e.target.value }))}
                    className="w-full bg-white border border-indigo-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 shadow-xs"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-indigo-800">Ou anexe arquivo:</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-2xs">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Selecionar Arquivo PDF / Imagem</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFormOrcamento(prev => ({
                                ...prev,
                                documentoUrl: reader.result as string,
                                documentoNome: file.name
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {formOrcamento.documentoNome && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 truncate max-w-xs">
                        ✓ {formOrcamento.documentoNome}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações do Modal */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalNovoOrcamentoOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Publicar Orçamento na Ordem de Reparo</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
