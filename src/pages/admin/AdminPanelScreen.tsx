import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade, AdminUser, AdminRole, ServicoMorador, Funcionario, StatusFuncionario, CategoriaFuncionario, EventoCondominio, Assembleia } from '../../types';
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
  Scale
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
    enviarNotificacaoPrivada
  } = useCondo();

  // Accordion section collapse states
  const [isUnidadesOpen, setIsUnidadesOpen] = useState(true);
  const [isSenhasAdminOpen, setIsSenhasAdminOpen] = useState(true);
  const [isServicosAdminOpen, setIsServicosAdminOpen] = useState(true);
  const [isEventosAdminOpen, setIsEventosAdminOpen] = useState(true);
  const [isAssembleiasAdminOpen, setIsAssembleiasAdminOpen] = useState(true);

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
      <div className="bg-white/90 border-2 border-amber-200/80 rounded-3xl shadow-md overflow-hidden transition-all">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsUnidadesOpen(!isUnidadesOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-left border-b border-amber-200/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-900 shrink-0">
              <Building className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">
                  Gestão de Unidades e Senhas
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                  {unidades.length} Apts
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {unidadesCadastradas} com moradores configurados • {unidadesPendentes} pendentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isUnidadesOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-amber-200 text-slate-700 shadow-2xs">
              {isUnidadesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        {isUnidadesOpen && (
          <div className="p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
            
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
        )}

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: CRIANDO SENHA DE ACESSOS & QUADRO DE FUNCIONÁRIOS E GESTÃO */}
      {/* ========================================================================= */}
      <div className="bg-white/90 border-2 border-amber-200/80 rounded-3xl shadow-md overflow-hidden transition-all">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsSenhasAdminOpen(!isSenhasAdminOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-left border-b border-amber-200/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-900 shrink-0">
              <KeyRound className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950">
                  Criando senha de acessos & Equipe de Gestão
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  {funcionarios.length} Membros & Colaboradores
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Síndicos, Subsíndicos, Portaria, Faxineiros, Vigias, Zeladoria e Colaboradores em Geral.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isSenhasAdminOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-amber-200 text-slate-700 shadow-2xs">
              {isSenhasAdminOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        {isSenhasAdminOpen && (
          <div className="p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
            
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
        )}

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 3: SERVIÇOS DE MORADORES & MODERAÇÃO (CARD RETRÁTIL QUE ABRE E FECHA) */}
      {/* ========================================================================= */}
      <div className="bg-white/90 border-2 border-amber-200/80 rounded-3xl shadow-md overflow-hidden transition-all">
        
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsServicosAdminOpen(!isServicosAdminOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-left border-b border-amber-200/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-900 shrink-0">
              <Briefcase className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-slate-950">
                  Serviços de Moradores & Moderação
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  {servicosMoradores.length} Anúncios
                </span>
                {servicosMoradores.filter(s => !s.ativo).length > 0 && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    {servicosMoradores.filter(s => !s.ativo).length} Suspensos
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Modere anúncios, suspenda divulgações com irregularidades, notifique a moradia ou reative serviços corrigidos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {isServicosAdminOpen ? 'Recolher seção' : 'Expandir seção'}
            </span>
            <div className="p-2 rounded-xl bg-white border border-amber-200 text-slate-700 shadow-2xs">
              {isServicosAdminOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        {isServicosAdminOpen && (
          <div className="p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
            
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
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      {/* Topo: Imagem Thumbnail + Título + Morador */}
                      <div className="flex items-start gap-3">
                        <img
                          src={servico.imagem || '/torta_servico.jpg'}
                          alt={servico.titulo}
                          className="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-2xs shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-amber-100 text-amber-950 border border-amber-300 inline-block mb-0.5">
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
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase flex items-center gap-1 shadow-xs transition-all active:scale-95"
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
                              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
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
                            className="p-1 rounded-lg text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors text-[11px] flex items-center gap-0.5 font-bold"
                            title="Enviar Notificação Privada para o Apto"
                          >
                            <Bell className="w-3 h-3 text-amber-700" /> Notificar
                          </button>
                        </div>

                        <button
                          onClick={() => excluirServicoMorador(servico.id)}
                          className="p-1 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-100 transition-colors text-[11px] font-bold"
                          title="Excluir Definitivamente"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 4: MODERAÇÃO DE EVENTOS & MURAL DE CELEBRAÇÕES */}
      {/* ========================================================================= */}
      <div className="bg-white/45 border-2 border-white/60 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xs transition-all duration-300">
        
        {/* Accordion Header */}
        <button
          onClick={() => setIsEventosAdminOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left focus:outline-none bg-amber-500/10 hover:bg-amber-500/15 transition-colors cursor-pointer border-b border-amber-400/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/40 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm sm:text-base text-slate-950">
                  Moderação de Eventos & Mural Comunitário
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-400 shadow-2xs">
                  {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
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
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Novo Evento
            </button>
            <div className="p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
              {isEventosAdminOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        {isEventosAdminOpen && (
          <div className="p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            
            {/* Barra de Busca de Eventos */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por título, organizador, data ou local do evento..."
                value={searchEvento}
                onChange={(e) => setSearchEvento(e.target.value)}
                className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
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
                      className={`p-4 rounded-3xl border-2 transition-all shadow-md space-y-3 bg-white/70 ${
                        isAtivo ? 'border-white/90' : 'border-rose-300 bg-rose-50/40'
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
                          <p className="text-[11px] text-indigo-900 font-extrabold truncate">
                            {evento.organizador}
                          </p>
                        </div>
                      </div>

                      {/* Informações de Data e Local */}
                      <div className="p-2.5 rounded-2xl bg-white/80 border border-white/90 space-y-1 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                          <span>{evento.data} • {evento.horario}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                          <span className="truncate">{evento.local}</span>
                        </div>
                      </div>

                      {/* Motivo de Suspensão se estiver fora do ar */}
                      {!isAtivo && evento.motivoSuspensao && (
                        <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-200 text-rose-950 text-[11px] space-y-0.5">
                          <strong className="block font-black flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-700" /> Motivo da Suspensão:
                          </strong>
                          <p className="font-medium leading-relaxed">{evento.motivoSuspensao}</p>
                        </div>
                      )}

                      {/* Botões de Ação do Admin */}
                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isAtivo ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEventoParaSuspender(evento);
                                setIsSuspendEventoModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> Tirar do Ar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => reativarEvento(evento.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Reativar no Mural
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const unidadeTarget = evento.organizadorUnidade || evento.organizador;
                              const numApto = unidadeTarget.replace(/[^0-9]/g, '');
                              const u = unidades.find(item => item.numero === numApto);
                              if (u) {
                                setSelectedUnidadeParaNotificar(u);
                                setIsNotifyModalOpen(true);
                              }
                            }}
                            className="px-2 py-1 rounded-xl text-amber-800 hover:bg-amber-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Enviar Notificação Privada para o Organizador"
                          >
                            <Bell className="w-3 h-3 text-amber-700" /> Notificar
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEventoToEditInAdmin(evento);
                              setIsCreateEditEventoAdminOpen(true);
                            }}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                            title="Editar Evento"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
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

                    </div>
                  );
                })}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 5: GESTÃO DE ASSEMBLEIAS & REUNIÕES INFORMAIS */}
      {/* ========================================================================= */}
      <div className="bg-white/45 border-2 border-white/60 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xs transition-all duration-300">
        
        {/* Accordion Header */}
        <button
          onClick={() => setIsAssembleiasAdminOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left focus:outline-none bg-amber-500/10 hover:bg-amber-500/15 transition-colors cursor-pointer border-b border-amber-400/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-sm sm:text-base text-slate-950">
                  Gestão de Assembleias & Reuniões Informais
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 border border-amber-400 shadow-2xs">
                  {assembleias.length} {assembleias.length === 1 ? 'reunião' : 'reuniões'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
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
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Nova Reunião
            </button>
            <div className="p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
              {isAssembleiasAdminOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Accordion Content */}
        {isAssembleiasAdminOpen && (
          <div className="p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            
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
        )}

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

    </div>
  );
};
