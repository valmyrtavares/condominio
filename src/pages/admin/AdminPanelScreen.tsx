import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade } from '../../types';
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
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowLeft,
  Users,
  Car,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserPlus,
  Mail,
  Lock,
  BadgeCheck
} from 'lucide-react';

interface AdminUser {
  id: string;
  nome: string;
  usuario: string;
  email: string;
  cargo: 'Síndico Geral' | 'Subsíndico' | 'Administradora' | 'Portaria';
  senha: string;
  ativo: boolean;
  criadoEm: string;
}

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    nome: 'Valmyr Tavares (Síndico)',
    usuario: 'admin',
    email: 'admin@condominio.com',
    cargo: 'Síndico Geral',
    senha: 'admin',
    ativo: true,
    criadoEm: '26/08/2026'
  },
  {
    id: 'adm-2',
    nome: 'Mariana Silva (Subsíndica)',
    usuario: 'subsindica',
    email: 'subsindica@condominio.com',
    cargo: 'Subsíndico',
    senha: 'sub123',
    ativo: true,
    criadoEm: '26/08/2026'
  }
];

export const AdminPanelScreen: React.FC = () => {
  const { 
    unidades, 
    adicionarUnidade, 
    editarUnidade, 
    excluirUnidade, 
    logoutAdmin, 
    setCurrentScreen 
  } = useCondo();

  // Accordion section collapse states
  const [isUnidadesOpen, setIsUnidadesOpen] = useState(true);
  const [isSenhasAdminOpen, setIsSenhasAdminOpen] = useState(true);

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

  // Admin Users & Passwords Management
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('condo_admin_users');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  });

  const [novoAdminNome, setNovoAdminNome] = useState('');
  const [novoAdminUsuario, setNovoAdminUsuario] = useState('');
  const [novoAdminEmail, setNovoAdminEmail] = useState('');
  const [novoAdminCargo, setNovoAdminCargo] = useState<AdminUser['cargo']>('Síndico Geral');
  const [novoAdminSenha, setNovoAdminSenha] = useState('');
  const [showNovoAdminSenha, setShowNovoAdminSenha] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [visibleAdminPasswords, setVisibleAdminPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    localStorage.setItem('condo_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

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

  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAdminNome.trim() || !novoAdminUsuario.trim() || !novoAdminSenha.trim()) return;

    const novoAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      nome: novoAdminNome.trim(),
      usuario: novoAdminUsuario.trim().toLowerCase(),
      email: novoAdminEmail.trim() || `${novoAdminUsuario.trim().toLowerCase()}@condominio.com`,
      cargo: novoAdminCargo,
      senha: novoAdminSenha.trim(),
      ativo: true,
      criadoEm: new Date().toLocaleDateString('pt-BR')
    };

    setAdminUsers(prev => [novoAdmin, ...prev]);
    setNovoAdminNome('');
    setNovoAdminUsuario('');
    setNovoAdminEmail('');
    setNovoAdminSenha('');
    setAdminSuccessMsg('Administrador e credenciais criadas com sucesso!');
    setTimeout(() => setAdminSuccessMsg(''), 3000);
  };

  const handleDeleteAdmin = (id: string) => {
    if (adminUsers.length <= 1) {
      alert('É necessário manter ao menos 1 administrador ativo no sistema.');
      return;
    }
    setAdminUsers(prev => prev.filter(a => a.id !== id));
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
              Controle central de unidades, senhas de moradores e acessos da gestão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-black text-xs shadow-xs">
            {unidades.length} Unidades
          </span>
          <span className="px-3.5 py-1.5 bg-slate-900 text-amber-300 rounded-xl font-black text-xs shadow-xs">
            {adminUsers.length} Administradores
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

                  return (
                    <div
                      key={u.id}
                      className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2.5"
                    >
                      {/* Topo do Card de Unidade */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h4 className="font-black text-base text-slate-950 leading-tight">
                            {formatUnitTitle(u.numero)}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                            <Car className="w-3 h-3 text-amber-800" />
                            Vaga: {u.vagaGaragem || 'Sem vaga'}
                          </span>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          u.moradores && u.moradores.length > 0
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          {u.moradores && u.moradores.length > 0 ? 'Cadastrado' : 'Pendente'}
                        </span>
                      </div>

                      {/* Senha e Credencial */}
                      <div className="p-2 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-700">
                          <KeyRound className="w-3.5 h-3.5 text-amber-800" />
                          <span className="text-[10px] font-extrabold uppercase">Senha:</span>
                          <strong className="text-slate-950 font-mono font-black ml-1">{senhaDisplay}</strong>
                        </div>

                        <button
                          onClick={() => handleCopySenha(u)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Copiar dados de acesso"
                        >
                          {copiadoId === u.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Ações: Editar e Excluir */}
                      <div className="flex items-center justify-end gap-1 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="p-1.5 rounded-lg text-slate-700 hover:text-indigo-700 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 font-bold"
                          title="Editar Unidade"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => excluirUnidade(u.id)}
                          className="p-1.5 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-100 transition-colors text-xs flex items-center gap-1 font-bold"
                          title="Excluir Unidade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
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
      {/* SEÇÃO 2: CRIANDO SENHA DE ACESSOS (GESTÃO DE ADMINISTRADORES / SÍNDICOS) */}
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
                  Criando senha de acessos
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                  {adminUsers.length} Administradores
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Cadastre e gerencie os usuários e senhas de administradores, síndicos e subsíndicos.
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

            {/* Form de Criação de Novo Administrador / Senha de Acesso */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-1">
                <UserPlus className="w-4 h-4 text-amber-800" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                  Novo Administrador / Senha de Gestão
                </h4>
              </div>

              <form onSubmit={handleAddAdminUser} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  
                  {/* Nome Completo */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Nome do Administrador:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Valmyr Tavares"
                      value={novoAdminNome}
                      onChange={(e) => setNovoAdminNome(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      required
                    />
                  </div>

                  {/* Usuário de Login */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Usuário de Acesso:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: admin, subsindico"
                      value={novoAdminUsuario}
                      onChange={(e) => setNovoAdminUsuario(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      required
                    />
                  </div>

                  {/* Cargo / Perfil */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Perfil / Função:
                    </label>
                    <select
                      value={novoAdminCargo}
                      onChange={(e) => setNovoAdminCargo(e.target.value as AdminUser['cargo'])}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    >
                      <option value="Síndico Geral">Síndico Geral</option>
                      <option value="Subsíndico">Subsíndico</option>
                      <option value="Administradora">Administradora</option>
                      <option value="Portaria">Portaria / Zeladoria</option>
                    </select>
                  </div>

                  {/* Senha de Acesso com Olho */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      Senha Administrativa:
                    </label>
                    <div className="relative">
                      <input
                        type={showNovoAdminSenha ? 'text' : 'password'}
                        placeholder="Ex: admin123"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* E-mail de Recuperação */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-700">
                      E-mail para Notificações & Recuperação:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Ex: admin@condominio.com"
                        value={novoAdminEmail}
                        onChange={(e) => setNovoAdminEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <ShieldCheck className="w-4 h-4 stroke-[3]" />
                      Salvar Administrador
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Lista de Administradores e Senhas */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950 block">
                Administradores Cadastrados ({adminUsers.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {adminUsers.map((admin) => {
                  const isPassVisible = visibleAdminPasswords[admin.id];

                  return (
                    <div
                      key={admin.id}
                      className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-black text-xs shrink-0">
                            {admin.nome.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-slate-950 leading-tight">
                              {admin.nome}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              {admin.email}
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800 shrink-0">
                          {admin.cargo}
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
                              navigator.clipboard.writeText(`Painel Admin\nUsuário: ${admin.usuario}\nSenha: ${admin.senha}`);
                              alert(`Credenciais de ${admin.usuario} copiadas!`);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="Copiar dados"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copiar
                          </button>

                          {adminUsers.length > 1 && (
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
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

    </div>
  );
};
