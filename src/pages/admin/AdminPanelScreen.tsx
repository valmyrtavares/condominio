import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade, AdminUser, AdminRole } from '../../types';
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
  Bell
} from 'lucide-react';
import { PrivateNotifyModal } from '../../components/admin/PrivateNotifyModal';

const AVATARES_SUGERIDOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
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
    excluirAdminRole
  } = useCondo();

  // Accordion section collapse states
  const [isUnidadesOpen, setIsUnidadesOpen] = useState(true);
  const [isSenhasAdminOpen, setIsSenhasAdminOpen] = useState(true);

  // Private Notify Modal state
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedUnidadeParaNotificar, setSelectedUnidadeParaNotificar] = useState<Unidade | null>(null);

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

  // Form Admin & Gestores
  const [novoAdminNome, setNovoAdminNome] = useState('');
  const [novoAdminUsuario, setNovoAdminUsuario] = useState('');
  const [novoAdminEmail, setNovoAdminEmail] = useState('');
  const [novoAdminRoleSelected, setNovoAdminRoleSelected] = useState(adminRoles[0]?.nome || 'Síndico Geral');
  const [novoAdminSenha, setNovoAdminSenha] = useState('');
  const [showNovoAdminSenha, setShowNovoAdminSenha] = useState(false);
  const [novoAdminFoto, setNovoAdminFoto] = useState(AVATARES_SUGERIDOS[0]);
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
    if (!novoAdminNome.trim() || !novoAdminUsuario.trim() || !novoAdminSenha.trim()) return;

    // Descobre o tipo de acesso pelo cargo selecionado
    const roleObj = adminRoles.find(r => r.nome === novoAdminRoleSelected);
    const tipoAcesso = roleObj ? roleObj.tipoAcesso : 'morador_destaque';

    adicionarAdminUser({
      nome: novoAdminNome.trim(),
      usuario: novoAdminUsuario.trim().toLowerCase(),
      email: novoAdminEmail.trim() || `${novoAdminUsuario.trim().toLowerCase()}@condominio.com`,
      cargo: novoAdminRoleSelected,
      tipoAcesso: tipoAcesso,
      foto: novoAdminFoto || AVATARES_SUGERIDOS[0],
      senha: novoAdminSenha.trim(),
      ativo: true
    });

    setNovoAdminNome('');
    setNovoAdminUsuario('');
    setNovoAdminEmail('');
    setNovoAdminSenha('');
    setNovoAdminFoto(AVATARES_SUGERIDOS[Math.floor(Math.random() * AVATARES_SUGERIDOS.length)]);
    setAdminSuccessMsg(`Perfil de ${novoAdminRoleSelected} cadastrado e integrado ao quadro de colaboradores!`);
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
      {/* SEÇÃO 2: CRIANDO SENHA DE ACESSOS (GESTÃO DE ADMINISTRADORES & CONSELHEIROS) */}
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
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-950">
                  Criando senha de acessos & Equipe de Gestão
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  {adminUsers.length} Membros Cadastrados
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Síndicos, Subsíndicos, Administradores (Acesso Total) e Conselheiros (Acesso Morador com Destaque na Equipe).
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

            {/* Form de Criação de Novo Administrador / Conselheiro com Foto */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-800" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                    Cadastrar Membro da Gestão / Nova Senha
                  </h4>
                </div>

                {/* Botão para Gerenciar / Criar Categorias */}
                <button
                  type="button"
                  onClick={() => setIsModalNovaCategoriaOpen(true)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-lg text-[11px] font-black uppercase flex items-center gap-1 shadow-2xs transition-all"
                >
                  <Settings2 className="w-3.5 h-3.5 text-amber-800" />
                  + Criar Nova Categoria / Cargo
                </button>
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
                        {AVATARES_SUGERIDOS.slice(0, 4).map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNovoAdminFoto(av)}
                            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${
                              novoAdminFoto === av ? 'border-amber-600 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Campos de Nome, Usuário, Cargo e Senha */}
                  <div className="md:col-span-9 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Nome Completo */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">
                          Nome Completo:
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Valmyr Tavares, Dr. Carlos..."
                          value={novoAdminNome}
                          onChange={(e) => setNovoAdminNome(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                          required
                        />
                      </div>

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

                      {/* Cargo Dinâmico do Select */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-extrabold uppercase text-slate-700">
                            Categoria / Função:
                          </label>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                            currentSelectedRole?.tipoAcesso === 'total' 
                              ? 'bg-amber-100 text-amber-950 border-amber-300' 
                              : 'bg-indigo-100 text-indigo-950 border-indigo-300'
                          }`}>
                            {currentSelectedRole?.tipoAcesso === 'total' ? '🔓 Acesso Total' : '👤 Acesso Morador (Conselho)'}
                          </span>
                        </div>

                        <select
                          value={novoAdminRoleSelected}
                          onChange={(e) => setNovoAdminRoleSelected(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        >
                          {adminRoles.map((role) => (
                            <option key={role.id} value={role.nome}>
                              {role.nome} {role.tipoAcesso === 'total' ? '(Acesso Irrestrito)' : '(Poder de Morador)'}
                            </option>
                          ))}
                        </select>
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
                            className="p-1 text-slate-500 hover:text-slate-800 absolute right-2.5 top-1.5 rounded-lg"
                            tabIndex={-1}
                            title={showNovoAdminSenha ? "Ocultar senha" : "Ver senha"}
                          >
                            {showNovoAdminSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* E-mail e Botão de Salvar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 items-end">
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">
                          E-mail para Notificações & Recuperação:
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Ex: gestao@condominio.com"
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
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          <ShieldCheck className="w-4 h-4 stroke-[3]" />
                          Salvar Membro
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </form>
            </div>

            {/* Lista de Administradores & Gestores com Foto e Permissões */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">
                  Equipe de Gestão Cadastrada ({adminUsers.length})
                </span>
                
                <span className="text-[11px] text-slate-600 font-medium">
                  * Todos os membros com foto aparecem no quadro de colaboradores (aba Funcionários).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {adminUsers.map((admin) => {
                  const isPassVisible = visibleAdminPasswords[admin.id];
                  const isTotal = admin.tipoAcesso === 'total';

                  return (
                    <div
                      key={admin.id}
                      className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      {/* Topo do Card com Foto */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={admin.foto || AVATARES_SUGERIDOS[0]}
                            alt={admin.nome}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shadow-sm bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-slate-950 leading-tight truncate">
                              {admin.nome}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cargo e Nível de Acesso */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                          {admin.cargo}
                        </span>

                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          isTotal 
                            ? 'bg-amber-100 text-amber-950 border-amber-300' 
                            : 'bg-blue-100 text-blue-950 border-blue-300'
                        }`}>
                          {isTotal ? '🔓 Acesso Irrestrito' : '👤 Poder de Morador'}
                        </span>
                      </div>

                      {/* Dados de Login e Senha */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase text-slate-500 block">
                            Usuário:
                          </span>
                          <strong className="text-slate-950 font-mono font-black text-xs">
                            {admin.usuario}
                          </strong>
                        </div>

                        <div>
                          <span className="text-[9px] font-extrabold uppercase text-slate-500 block">
                            Senha:
                          </span>
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-950 font-mono font-black text-xs">
                              {isPassVisible ? admin.senha : '••••••••'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => toggleAdminPasswordVisibility(admin.id)}
                              className="text-slate-500 hover:text-slate-800 p-0.5 rounded"
                              title={isPassVisible ? "Ocultar senha" : "Ver senha"}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Rodapé do Card com Ações */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Cadastrado em {admin.criadoEm}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Painel Condomínio\nNome: ${admin.nome}\nCargo: ${admin.cargo}\nUsuário: ${admin.usuario}\nSenha: ${admin.senha}`);
                              alert(`Credenciais de ${admin.nome} copiadas!`);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="Copiar dados"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copiar
                          </button>

                          {adminUsers.length > 1 && (
                            <button
                              onClick={() => excluirAdminUser(admin.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
                              title="Remover Administrador"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>
                          )}
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
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNovaCategoria} className="space-y-4">
              
              {/* Nome do Cargo */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-800">
                  Nome do Cargo / Categoria:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gerente Predial, Comitê de Obras, Diretor Financeiro..."
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  autoFocus
                />
              </div>

              {/* Nível de Acesso */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase text-slate-800">
                  Nível de Permissão & Poderes:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNovaCategoriaTipoAcesso('total')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
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
                    className={`p-3 rounded-2xl border text-left transition-all ${
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
                <label className="text-[11px] font-extrabold uppercase text-slate-800">
                  Descrição / Atribuições (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Responsável pelas vistorias técnicas e orçamentos de obras"
                  value={novaCategoriaDescricao}
                  onChange={(e) => setNovaCategoriaDescricao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Categorias Atuais */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                  Categorias Ativas ({adminRoles.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {adminRoles.map((r) => (
                    <span 
                      key={r.id}
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-1"
                    >
                      {r.nome}
                      {adminRoles.length > 4 && (
                        <button
                          type="button"
                          onClick={() => excluirAdminRole(r.id)}
                          className="text-rose-600 hover:text-rose-800 ml-1"
                          title="Excluir Categoria"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalNovaCategoriaOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95"
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

    </div>
  );
};
