import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { CondominioProfile } from '../../types';
import { 
  Crown, 
  Building2, 
  Plus, 
  Search, 
  ExternalLink, 
  KeyRound, 
  MapPin, 
  Layers, 
  Trash2, 
  Edit3, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  Globe, 
  User, 
  Eye, 
  EyeOff, 
  PauseCircle, 
  PlayCircle,
  Database,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { CreateEditCondominioModal } from '../../components/master/CreateEditCondominioModal';

export const SuperAdminDashboardScreen: React.FC = () => {
  const { 
    condominios, 
    selecionarCondominio, 
    excluirCondominio, 
    alternarStatusCondominio, 
    logoutMaster, 
    setCurrentScreen,
    loginAdmin
  } = useCondo();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [condoToEdit, setCondoToEdit] = useState<CondominioProfile | null>(null);

  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const totalUnidadesGlobal = condominios.reduce((acc, c) => acc + (c.totalUnidades || 0), 0);
  const totalAtivos = condominios.filter(c => c.status === 'ativo').length;

  const filteredCondos = condominios.filter(c => {
    const matchStatus = filtroStatus === 'Todas' || c.status === filtroStatus;
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      c.nome.toLowerCase().includes(termo) ||
      c.slug.toLowerCase().includes(termo) ||
      c.endereco.toLowerCase().includes(termo) ||
      (c.cidade && c.cidade.toLowerCase().includes(termo)) ||
      (c.nomeSindico && c.nomeSindico.toLowerCase().includes(termo));

    return matchStatus && matchBusca;
  });

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleOpenMorador = (condo: CondominioProfile) => {
    selecionarCondominio(condo.id);
    setCurrentScreen('home');
  };

  const handleOpenAdmin = (condo: CondominioProfile) => {
    selecionarCondominio(condo.id);
    loginAdmin('admin', condo.senhaAdminGeral || 'admin');
    setCurrentScreen('admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-extrabold cursor-pointer transition-colors bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao App
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">
            SuperAdmin Conectado
          </span>
          <button
            onClick={logoutMaster}
            className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3 py-2 rounded-xl font-black transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Sair do Master
          </button>
        </div>
      </div>

      {/* Hero Banner with Master Title */}
      <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/30 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/10 shrink-0">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Painel Central do Dono da Plataforma
              </span>
              <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Multi-Tenant Ativo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Gerenciador Master de Condomínios
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mt-0.5">
              Crie novos condomínios limpos ou clonados, personalize links exclusivos (<code className="text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded">/c/slug</code>), gerencie senhas do síndico e administre todas as instâncias em um só lugar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCondoToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ Criar Novo Condomínio</span>
        </button>
      </div>

      {/* Global Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /> Condomínios
          </span>
          <strong className="text-2xl font-black text-white block">
            {condominios.length}
          </strong>
          <span className="text-[10px] text-emerald-400 font-bold">{totalAtivos} ativos</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Total Unidades
          </span>
          <strong className="text-2xl font-black text-white block">
            {totalUnidadesGlobal}
          </strong>
          <span className="text-[10px] text-slate-400">Apartamentos geridos</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Cloud className="w-3.5 h-3.5 text-sky-400" /> Nuvem Firebase
          </span>
          <strong className="text-sm font-black text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Conectado
          </strong>
          <span className="text-[10px] text-slate-400">Subcoleções por Tenant</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-amber-400" /> Capacidade Free
          </span>
          <strong className="text-sm font-black text-amber-300">
            {condominios.length}/30 Condomínios
          </strong>
          <span className="text-[10px] text-slate-400">Plano Spark Gratuito</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar condomínio por nome, slug /c/..., cidade ou síndico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="Todas">Status: Todos</option>
            <option value="ativo">🟢 Ativo</option>
            <option value="bloqueado">🔴 Bloqueado / Pausado</option>
            <option value="em_implantacao">🟡 Em Implantação</option>
          </select>
        </div>
      </div>

      {/* Condominiums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCondos.map((condo) => {
          const isPassVisible = Boolean(showPasswordMap[condo.id]);
          const isAtivo = condo.status === 'ativo';

          return (
            <div
              key={condo.id}
              className={`bg-slate-900/90 border-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group ${
                isAtivo ? 'border-slate-800 hover:border-amber-400/50' : 'border-rose-500/40 opacity-75'
              }`}
            >
              <div>
                {/* Top Facade Photo Banner */}
                <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={condo.fotoFachada || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85'}
                    alt={condo.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Status pill on image */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-md backdrop-blur-xs ${
                      isAtivo 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
                        : 'bg-rose-500/20 text-rose-300 border-rose-400/50'
                    }`}>
                      {isAtivo ? '🟢 Ativo' : '🔴 Bloqueado'}
                    </span>
                  </div>

                  {/* Slug Pill on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-mono">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-bold">/c/{condo.slug}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(condo.slug)}
                      className="text-slate-400 hover:text-white ml-1 cursor-pointer"
                      title="Copiar Link Direto"
                    >
                      {copiedSlug === condo.slug ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Condo Info Body */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {condo.nome}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1 truncate" title={condo.endereco}>
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{condo.endereco}</span>
                    </p>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Unidades:</span>
                      <strong className="text-white font-black text-xs">
                        {condo.totalUnidades} apartamentos
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {condo.totalBlocos || 1} {condo.totalBlocos === 1 ? 'bloco' : 'blocos'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Síndico:</span>
                      <strong className="text-white font-bold text-xs truncate block" title={condo.nomeSindico || 'Não informado'}>
                        {condo.nomeSindico || 'Administração'}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {condo.telefoneSindico || condo.emailAdmin || 'Sem contato'}
                      </span>
                    </div>
                  </div>

                  {/* Senha do Síndico */}
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] font-black uppercase text-amber-400 block flex items-center gap-1">
                        <KeyRound className="w-3 h-3" /> Senha Mestre do Síndico:
                      </span>
                      <strong className="text-amber-200 font-mono font-black text-sm">
                        {isPassVisible ? condo.senhaAdminGeral : '••••••••'}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(condo.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title={isPassVisible ? "Ocultar Senha" : "Ver Senha"}
                    >
                      {isPassVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Actions & Navigation */}
              <div className="p-5 pt-0 space-y-2.5">
                
                {/* 2 Main Portal Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenMorador(condo)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-slate-700 hover:border-slate-600 active:scale-95"
                    title="Acessar aplicativo como morador deste condomínio"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>App Morador</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAdmin(condo)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                    title="Acessar painel administrativo do síndico deste condomínio"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Painel Síndico</span>
                  </button>
                </div>

                {/* Footer Tools: Editar, Pausar/Despausar, Excluir */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCondoToEdit(condo);
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alternarStatusCondominio(condo.id)}
                      className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isAtivo ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ativar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o condomínio "${condo.nome}"? Esta ação removerá os dados vinculados.`)) {
                        excluirCondominio(condo.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="Excluir Condomínio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Modal de Criação e Edição */}
      <CreateEditCondominioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        condominioToEdit={condoToEdit}
      />

    </div>
  );
};
