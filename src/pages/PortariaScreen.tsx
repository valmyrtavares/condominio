import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { AutorizacaoAcesso, EncomendaEntrega, StatusAutorizacaoAcesso, StatusEncomenda } from '../types';
import { 
  PackageCheck, 
  ArrowLeft, 
  Plus, 
  UserCheck, 
  Package, 
  Clock, 
  Calendar, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Truck, 
  MapPin, 
  Trash2, 
  Pencil,
  ShieldCheck,
  Building,
  Phone,
  Check,
  KeyRound,
  History,
  ChevronDown
} from 'lucide-react';
import { CreateAutorizacaoModal } from '../components/portaria/CreateAutorizacaoModal';
import { CreateEncomendaModal } from '../components/portaria/CreateEncomendaModal';
import { PortariaTimelineModal } from '../components/portaria/PortariaTimelineModal';

export const PortariaScreen: React.FC = () => {
  const { 
    currentUser, 
    autorizacoesAcesso, 
    encomendasEntregas, 
    atualizarStatusAcesso,
    atualizarStatusEncomenda,
    darBaixaEncomenda,
    excluirAutorizacaoAcesso, 
    excluirEncomenda,
    setCurrentScreen 
  } = useCondo();

  const [activeTab, setActiveTab] = useState<'acessos' | 'encomendas'>('acessos');
  const [filtroProcesso, setFiltroProcesso] = useState<'abertos' | 'fechados' | 'todos'>('abertos');
  const [expandedCards, setExpandedCards] = useState<{ [id: string]: boolean }>({});
  const [isAutorizacaoModalOpen, setIsAutorizacaoModalOpen] = useState(false);
  const [autorizacaoToEdit, setAutorizacaoToEdit] = useState<AutorizacaoAcesso | null>(null);
  const [isEncomendaModalOpen, setIsEncomendaModalOpen] = useState(false);
  const [encomendaToEdit, setEncomendaToEdit] = useState<EncomendaEntrega | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineModalData, setTimelineModalData] = useState<{
    titulo: string;
    subtitulo?: string;
    unidade: string;
    tipo: 'encomenda' | 'acesso';
    itemEncomenda?: EncomendaEntrega | null;
    itemAcesso?: AutorizacaoAcesso | null;
  } | null>(null);

  const isStaff = currentUser.role === 'colaborador' || currentUser.role === 'sindico' || currentUser.role === 'subsindico' || currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria';

  // Minhas autorizações de acesso
  const minhasAutorizacoes = (isStaff && (currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria'))
    ? autorizacoesAcesso
    : autorizacoesAcesso.filter(a => {
        const uAcesso = (a.unidade || '').replace(/\D/g, '');
        const uUser = (currentUser.unidade || '').replace(/\D/g, '');
        const matchUnit = (uAcesso && uUser && uAcesso === uUser) || (a.unidade && currentUser.unidade && a.unidade.trim().toLowerCase() === currentUser.unidade.trim().toLowerCase());
        const matchUser = Boolean(currentUser.id && a.moradorId === currentUser.id);
        return matchUnit || matchUser;
      });

  // Minhas encomendas e despachos
  const minhasEncomendas = (isStaff && (currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria'))
    ? encomendasEntregas
    : encomendasEntregas.filter(e => {
        const uEnc = (e.unidade || '').replace(/\D/g, '');
        const uUser = (currentUser.unidade || '').replace(/\D/g, '');
        const matchUnit = (uEnc && uUser && uEnc === uUser) || (e.unidade && currentUser.unidade && e.unidade.trim().toLowerCase() === currentUser.unidade.trim().toLowerCase());
        const matchUser = Boolean(currentUser.id && e.moradorId === currentUser.id);
        return matchUnit || matchUser;
      });

  // Classificação Abertos vs Fechados
  const isAcessoAberto = (status: string) => [
    'Aguardando Chegada',
    'Entrada Liberada / Presente',
    'Chave na Portaria à Disposição',
    'Chave Retirada / No Condomínio'
  ].includes(status);

  const isAcessoFechado = (status: string) => [
    'Finalizado / Saiu',
    'Chave Devolvida / Concluído',
    'Cancelado / Expirado'
  ].includes(status);

  const isEncomendaAberta = (status: string) => [
    'Aguardando Chegada na Portaria',
    'Aguardando Retirada',
    'Embrulho Deixado pelo Morador',
    'Aguardando Coleta na Portaria'
  ].includes(status);

  const isEncomendaFechada = (status: string) => [
    'Entregue ao Morador',
    'Despachado / Retirado por Terceiro',
    'Devolvido'
  ].includes(status);

  const encomendasPendentes = minhasEncomendas.filter(e => e.status === 'Aguardando Retirada');
  const encomendasEsperadas = minhasEncomendas.filter(e => e.status === 'Aguardando Chegada na Portaria');
  const embrulhosDespacho = minhasEncomendas.filter(e => e.status === 'Embrulho Deixado pelo Morador' || e.status === 'Aguardando Coleta na Portaria');

  const totalAcessosAbertos = minhasAutorizacoes.filter(a => isAcessoAberto(a.status)).length;
  const totalAcessosFechados = minhasAutorizacoes.filter(a => isAcessoFechado(a.status)).length;
  const totalEncomendasAbertas = minhasEncomendas.filter(e => isEncomendaAberta(e.status)).length;
  const totalEncomendasFechadas = minhasEncomendas.filter(e => isEncomendaFechada(e.status)).length;

  const filteredAcessos = minhasAutorizacoes.filter(a => {
    const matchProcesso = filtroProcesso === 'todos' ||
      (filtroProcesso === 'abertos' && isAcessoAberto(a.status)) ||
      (filtroProcesso === 'fechados' && isAcessoFechado(a.status));

    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      a.nomeVisitante.toLowerCase().includes(termo) ||
      a.tipoVisitante.toLowerCase().includes(termo) ||
      a.unidade.toLowerCase().includes(termo) ||
      (a.identificacaoChave && a.identificacaoChave.toLowerCase().includes(termo)) ||
      (a.observacoes && a.observacoes.toLowerCase().includes(termo));

    return matchProcesso && matchBusca;
  });

  const filteredEncomendas = minhasEncomendas.filter(e => {
    const matchProcesso = filtroProcesso === 'todos' ||
      (filtroProcesso === 'abertos' && isEncomendaAberta(e.status)) ||
      (filtroProcesso === 'fechados' && isEncomendaFechada(e.status));

    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      e.destinatarioNome.toLowerCase().includes(termo) ||
      (e.destinatarioExterno && e.destinatarioExterno.toLowerCase().includes(termo)) ||
      e.empresaTransporte.toLowerCase().includes(termo) ||
      e.tipo.toLowerCase().includes(termo) ||
      e.unidade.toLowerCase().includes(termo) ||
      (e.codigoRastreio && e.codigoRastreio.toLowerCase().includes(termo));

    return matchProcesso && matchBusca;
  });

  const getStatusAcessoBadge = (status: StatusAutorizacaoAcesso) => {
    switch (status) {
      case 'Entrada Liberada / Presente':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'No Condomínio'
        };
      case 'Aguardando Chegada':
        return {
          bg: 'bg-indigo-100 text-indigo-950 border-indigo-300',
          icon: <Clock className="w-3.5 h-3.5 text-indigo-700" />,
          label: 'Aguardando na Portaria'
        };
      case 'Chave na Portaria à Disposição':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse',
          icon: <KeyRound className="w-3.5 h-3.5 text-amber-700" />,
          label: 'Chave na Portaria'
        };
      case 'Chave Retirada / No Condomínio':
        return {
          bg: 'bg-teal-100 text-teal-950 border-teal-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />,
          label: 'Chave em Uso'
        };
      case 'Chave Devolvida / Concluído':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Chave Devolvida'
        };
      case 'Finalizado / Saiu':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Visita Concluída'
        };
      case 'Cancelado / Expirado':
      default:
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-700" />,
          label: 'Cancelado'
        };
    }
  };

  const getStatusEncomendaBadge = (status: StatusEncomenda) => {
    switch (status) {
      case 'Aguardando Chegada na Portaria':
        return {
          bg: 'bg-sky-100 text-sky-950 border-sky-300',
          icon: <Clock className="w-3.5 h-3.5 text-sky-700" />,
          label: 'Aguardando Chegada'
        };
      case 'Aguardando Retirada':
        return {
          bg: 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse',
          icon: <Package className="w-3.5 h-3.5 text-slate-950" />,
          label: 'Na Portaria p/ Retirada'
        };
      case 'Entregue ao Morador':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Entregue ao Morador'
        };
      case 'Embrulho Deixado pelo Morador':
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
          icon: <Clock className="w-3.5 h-3.5 text-purple-700" />,
          label: 'Embrulho Deixado'
        };
      case 'Aguardando Coleta na Portaria':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse',
          icon: <Package className="w-3.5 h-3.5 text-amber-800" />,
          label: 'Aguardando Coleta'
        };
      case 'Despachado / Retirado por Terceiro':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Despachado / Retirado'
        };
      case 'Devolvido':
      default:
        return {
          bg: 'bg-slate-200 text-slate-800 border-slate-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-slate-700" />,
          label: 'Devolvido'
        };
    }
  };

  const abrirTimelineEncomenda = (enc: EncomendaEntrega) => {
    setTimelineModalData({
      titulo: enc.fluxoTipo === 'saida_embrulho' ? `Despacho de Embrulho • Apto ${enc.unidade}` : `${enc.tipo} • Apto ${enc.unidade}`,
      subtitulo: enc.fluxoTipo === 'saida_embrulho' ? `Destinatário: ${enc.destinatarioExterno || 'Terceiro'}` : `Destinatário: ${enc.destinatarioNome} (${enc.empresaTransporte})`,
      unidade: enc.unidade,
      tipo: 'encomenda',
      itemEncomenda: enc
    });
    setTimelineModalOpen(true);
  };

  const abrirTimelineAcesso = (acesso: AutorizacaoAcesso) => {
    setTimelineModalData({
      titulo: acesso.deixouChave ? `Controle de Chave: ${acesso.nomeVisitante}` : `Autorização: ${acesso.nomeVisitante}`,
      subtitulo: acesso.deixouChave ? `Chave: ${acesso.identificacaoChave || 'Imóvel'} • ${acesso.tipoVisitante}` : `Tipo: ${acesso.tipoVisitante} • Autorizado por ${acesso.moradorNome}`,
      unidade: acesso.unidade,
      tipo: 'acesso',
      itemAcesso: acesso
    });
    setTimelineModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <PackageCheck className="w-5 h-5 text-indigo-400" />
            Portaria Encomendas/Visitas (Unidade {currentUser.unidade})
          </h2>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            Controle de encomendas (entradas e despachos), visitas, prestadores e custódia de chaves com registro de horários e timeline.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'acessos' ? (
            <button
              type="button"
              onClick={() => {
                setAutorizacaoToEdit(null);
                setIsAutorizacaoModalOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Autorizar Visita / Deixar Chave</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEncomendaToEdit(null);
                setIsEncomendaModalOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Registrar Encomenda / Despacho</span>
            </button>
          )}
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setActiveTab('acessos')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'acessos'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-900 hover:bg-white/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Visitas & Chaves ({minhasAutorizacoes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('encomendas')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'encomendas'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-900 hover:bg-white/50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Encomendas & Despachos ({minhasEncomendas.length})</span>
          {encomendasPendentes.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black animate-pulse">
              {encomendasPendentes.length} a retirar
            </span>
          )}
        </button>
      </div>

      {/* Barra de Busca e Filtro de Processos */}
      <div className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'acessos' ? "Buscar por visitante, chave ou recado..." : "Buscar encomenda por destinatário, transportadora ou rastreio..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/75 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* FILTRO DE PROCESSOS EM ABERTO vs FECHADOS / CONCLUÍDOS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/85 p-2 sm:p-2.5 rounded-2xl border border-white/90 backdrop-blur-xs shadow-xs">
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl flex-wrap">
            <button
              type="button"
              onClick={() => setFiltroProcesso('abertos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                filtroProcesso === 'abertos'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <span>⚡ Em Aberto / Pendentes</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/10 font-black">
                {activeTab === 'acessos' ? totalAcessosAbertos : totalEncomendasAbertas}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFiltroProcesso('fechados')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                filtroProcesso === 'fechados'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <span>🏁 Fechados / Concluídos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-black">
                {activeTab === 'acessos' ? totalAcessosFechados : totalEncomendasFechadas}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFiltroProcesso('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filtroProcesso === 'todos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <span>📋 Todos ({activeTab === 'acessos' ? minhasAutorizacoes.length : minhasEncomendas.length})</span>
            </button>
          </div>

          {/* Atalhos para expandir ou recolher todos os cards */}
          <div className="flex items-center gap-2 text-xs font-bold shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                const items = activeTab === 'acessos' ? filteredAcessos : filteredEncomendas;
                const newMap: { [id: string]: boolean } = {};
                items.forEach(it => { newMap[it.id] = true; });
                setExpandedCards(newMap);
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              Expandir Todos
            </button>
            <button
              type="button"
              onClick={() => {
                const items = activeTab === 'acessos' ? filteredAcessos : filteredEncomendas;
                const newMap: { [id: string]: boolean } = {};
                items.forEach(it => { newMap[it.id] = false; });
                setExpandedCards(newMap);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              Recolher Todos
            </button>
          </div>
        </div>
      </div>

      {/* ABA 1: AUTORIZAÇÕES DE ENTRADA / VISITAS & CHAVES */}
      {activeTab === 'acessos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
              Visitas, Prestadores e Chaves Autorizadas ({filteredAcessos.length})
            </span>
          </div>

          {filteredAcessos.length === 0 ? (
            <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-3 backdrop-blur-xs">
              <UserCheck className="w-10 h-10 text-indigo-600 mx-auto" />
              <h4 className="text-base font-black text-slate-950">
                {filtroProcesso === 'fechados' 
                  ? 'Nenhum acesso concluído no histórico' 
                  : filtroProcesso === 'abertos' 
                  ? 'Nenhuma visita ou chave em andamento' 
                  : 'Nenhuma autorização encontrada'}
              </h4>
              <p className="text-xs text-slate-700 font-medium max-w-md mx-auto">
                {filtroProcesso === 'fechados'
                  ? 'As visitas finalizadas ou chaves devolvidas da sua unidade serão listadas aqui.'
                  : 'Autorize a entrada de visitas/prestadores ou deixe uma chave sob custódia da portaria com controle de timeline e horários em tempo real.'}
              </p>
              {filtroProcesso !== 'fechados' && (
                <button
                  type="button"
                  onClick={() => {
                    setAutorizacaoToEdit(null);
                    setIsAutorizacaoModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Autorizar Agora
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAcessos.map((acesso) => {
                const badge = getStatusAcessoBadge(acesso.status);
                const isAutor = acesso.moradorId === currentUser.id || (!acesso.moradorId && acesso.unidade === currentUser.unidade) || currentUser.role === 'sindico' || currentUser.role === 'subsindico';
                const isCardOpen = expandedCards[acesso.id] !== undefined
                  ? expandedCards[acesso.id]
                  : isAcessoAberto(acesso.status);

                return (
                  <div
                    key={acesso.id}
                    className="bg-white/60 border border-white/80 rounded-3xl p-4 sm:p-5 shadow-lg hover:bg-white/75 transition-all backdrop-blur-xs flex flex-col justify-between space-y-3"
                  >
                    {/* CABEÇALHO DO CARD (Sempre visível e clicável para abrir/fechar) */}
                    <div 
                      onClick={() => setExpandedCards(prev => ({
                        ...prev,
                        [acesso.id]: !isCardOpen
                      }))}
                      className="flex items-center justify-between gap-2 cursor-pointer select-none group"
                      title={isCardOpen ? "Clique para recolher detalhes" : "Clique para expandir detalhes"}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {acesso.fotoVisitante ? (
                          <img
                            src={acesso.fotoVisitante}
                            alt={acesso.nomeVisitante}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0 bg-slate-100 transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 font-black transition-transform group-hover:scale-105 ${
                            acesso.deixouChave ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-indigo-100 border-indigo-200 text-indigo-800'
                          }`}>
                            {acesso.deixouChave ? <KeyRound className="w-5 h-5 text-amber-700" /> : <User className="w-5 h-5" />}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-indigo-300">
                              {acesso.deixouChave ? '🔑 Chave na Portaria' : acesso.tipoVisitante}
                            </span>
                          </div>

                          <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight mt-0.5 truncate">
                            {acesso.nomeVisitante}
                          </h4>

                          {acesso.deixouChave && acesso.identificacaoChave && (
                            <span className="text-[10px] text-amber-900 font-black block">
                              🔑 {acesso.identificacaoChave}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                        <div className="p-1 rounded-lg text-slate-500 group-hover:text-slate-950 group-hover:bg-white/40 transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCardOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </div>
                      </div>
                    </div>

                    {/* CORPO EXPANSÍVEL DO CARD */}
                    {isCardOpen && (
                      <div className="space-y-3 pt-2 border-t border-slate-950/10 animate-in fade-in duration-200">
                        {acesso.documentoRg && (
                          <span className="text-[10px] text-slate-600 font-mono font-semibold block">
                            Doc/RG: {acesso.documentoRg}
                          </span>
                        )}

                        {/* Informações de Horário e Entrada Direta */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-white/80 border border-white/90 text-xs shadow-2xs">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">Previsão:</span>
                            <strong className="text-slate-950 font-black text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3 text-indigo-600" />
                              {acesso.horarioEstimado}
                            </strong>
                            <span className="text-[10px] text-slate-600">{acesso.dataPrevista}</span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">
                              {acesso.deixouChave ? 'Local da Chave:' : 'Liberação:'}
                            </span>
                            <span className="text-indigo-950 font-black text-[11px] flex items-center gap-1">
                              {acesso.deixouChave ? (acesso.localChavePortaria || 'Portaria') : (acesso.deixarEntrarDireto ? '✓ Entrada Direta' : 'Interfonar Antes')}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {acesso.deixouChave ? 'Sob custódia' : (acesso.deixarEntrarDireto ? 'Sem interfonar' : 'Portaria avisa')}
                            </span>
                          </div>
                        </div>

                        {acesso.observacoes && (
                          <p className="text-xs text-slate-700 font-medium bg-white/50 p-2 rounded-xl border border-white/70">
                            <b>Recado:</b> {acesso.observacoes}
                          </p>
                        )}

                        {/* Histórico de Horários Resumido */}
                        <div className="flex items-center justify-between text-[10px] text-slate-600 bg-white/40 p-1.5 rounded-lg">
                          {acesso.horarioEntradaReal && (
                            <span>Entrada: <b>{acesso.horarioEntradaReal}</b></span>
                          )}
                          {acesso.horarioSaidaReal && (
                            <span>Saída: <b>{acesso.horarioSaidaReal}</b></span>
                          )}
                          {acesso.porteiroResponsavel && (
                            <span>Porteiro: <b>{acesso.porteiroResponsavel}</b></span>
                          )}
                        </div>

                        {/* Rodapé com Botão de Timeline e Ações */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-950/10 text-xs flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => abrirTimelineAcesso(acesso)}
                            className="text-[11px] font-bold text-indigo-900 bg-indigo-100/80 hover:bg-indigo-200 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-indigo-200 shadow-2xs"
                            title="Ver linha do tempo completa com todos os horários e passos"
                          >
                            <Clock className="w-3 h-3 text-indigo-700" />
                            <span>Timeline ({acesso.timeline?.length || 1} etapas)</span>
                          </button>

                          {isAutor && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setAutorizacaoToEdit(acesso);
                                  setIsAutorizacaoModalOpen(true);
                                }}
                                className="text-[11px] text-indigo-700 hover:text-indigo-900 font-extrabold px-2 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                                title="Editar"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Deseja realmente excluir esta autorização de entrada?')) {
                                    excluirAutorizacaoAcesso(acesso.id);
                                  }
                                }}
                                className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: ENCOMENDAS & PACOTES NA PORTARIA */}
      {activeTab === 'encomendas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
              Encomendas & Despachos ({filteredEncomendas.length})
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {encomendasEsperadas.length > 0 && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 shadow-xs">
                  ⏳ {encomendasEsperadas.length} a caminho
                </span>
              )}
              {encomendasPendentes.length > 0 && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 animate-pulse shadow-xs">
                  📦 {encomendasPendentes.length} na portaria
                </span>
              )}
              {embrulhosDespacho.length > 0 && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-400 text-slate-950 shadow-xs">
                  📤 {embrulhosDespacho.length} despachos
                </span>
              )}
            </div>
          </div>

          {filteredEncomendas.length === 0 ? (
            <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-3 backdrop-blur-xs">
              <Package className="w-10 h-10 text-indigo-600 mx-auto" />
              <h4 className="text-base font-black text-slate-950">
                {filtroProcesso === 'fechados'
                  ? 'Nenhuma encomenda concluída no histórico'
                  : filtroProcesso === 'abertos'
                  ? 'Nenhuma encomenda ou despacho em andamento'
                  : 'Nenhum registro de encomenda encontrado'}
              </h4>
              <p className="text-xs text-slate-700 font-medium max-w-md mx-auto">
                {filtroProcesso === 'fechados'
                  ? 'Todas as encomendas já entregues ou despachos realizados para a sua unidade ficam arquivados aqui.'
                  : 'Cadastre um aviso de pacote a caminho ou deixe um embrulho na portaria para coleta com rastreamento completo de timeline.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredEncomendas.map((enc) => {
                const badgeInfo = getStatusEncomendaBadge(enc.status);
                const isSaida = enc.fluxoTipo === 'saida_embrulho';
                const isEsperando = enc.status === 'Aguardando Chegada na Portaria';
                const isPendente = enc.status === 'Aguardando Retirada';
                const isEntregue = enc.status === 'Entregue ao Morador';
                const isEmbrulhoDeixado = enc.status === 'Embrulho Deixado pelo Morador';
                const isAguardandoColeta = enc.status === 'Aguardando Coleta na Portaria';
                const isDespachado = enc.status === 'Despachado / Retirado por Terceiro';
                const isAutor = (enc.moradorId && enc.moradorId === currentUser.id) || (!enc.moradorId && enc.unidade === currentUser.unidade) || isStaff;
                const isCardOpen = expandedCards[enc.id] !== undefined
                  ? expandedCards[enc.id]
                  : isEncomendaAberta(enc.status);

                return (
                  <div
                    key={enc.id}
                    className={`border-2 rounded-3xl p-4 sm:p-5 shadow-lg transition-all backdrop-blur-xs flex flex-col justify-between space-y-3 ${
                      isSaida 
                        ? (isDespachado ? 'bg-emerald-50/70 border-emerald-300' : 'bg-purple-50/85 border-purple-300')
                        : (isEsperando
                          ? 'bg-sky-50/85 border-sky-300'
                          : isPendente
                          ? 'bg-amber-50/85 border-amber-300'
                          : isEntregue
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-white/60 border-white/80')
                    }`}
                  >
                    {/* CABEÇALHO DO CARD (Dentro do retângulo vermelho - sempre visível e clicável para abrir/fechar) */}
                    <div
                      onClick={() => setExpandedCards(prev => ({
                        ...prev,
                        [enc.id]: !isCardOpen
                      }))}
                      className="flex items-center justify-between gap-2 cursor-pointer select-none group"
                      title={isCardOpen ? "Clique para recolher detalhes" : "Clique para expandir detalhes"}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 transition-transform group-hover:scale-105 ${
                          isSaida 
                            ? (isDespachado ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white')
                            : (isEsperando ? 'bg-sky-600 text-white' :
                               isPendente ? 'bg-amber-500 text-slate-950' : 
                               isEntregue ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700')
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-indigo-300">
                              PORTARIA
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              isSaida ? 'bg-purple-200 text-purple-950 border border-purple-300' : 'bg-sky-200 text-sky-950 border border-sky-300'
                            }`}>
                              {isSaida ? '🔺 SAÍDA / DESPACHO' : '📥 ENTRADA'}
                            </span>
                          </div>
                          <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight truncate mt-0.5">
                            Apto {enc.unidade} • {isSaida ? (enc.destinatarioExterno || 'Destinatário Externo') : (enc.destinatarioNome || 'Morador')}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs shrink-0 flex items-center gap-1 ${badgeInfo.bg}`}>
                          {badgeInfo.icon}
                          <span>{enc.status}</span>
                        </span>
                        <div className="p-1 rounded-lg text-slate-500 group-hover:text-slate-950 group-hover:bg-white/40 transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCardOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </div>
                      </div>
                    </div>

                    {/* CORPO EXPANSÍVEL DO CARD */}
                    {isCardOpen && (
                      <div className="space-y-3 pt-2 border-t border-slate-950/10 animate-in fade-in duration-200">
                        {/* Tipo e Identificação */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Tipo:</span>
                          <span className="text-slate-950 font-black">{enc.tipo} {enc.empresaTransporte && `(${enc.empresaTransporte})`}</span>
                        </div>

                        {/* Local e Detalhes */}
                        <div className="p-3 bg-white/85 rounded-2xl border border-white/90 text-xs space-y-1.5 shadow-2xs">
                          {isEsperando && (
                            <div className="text-[11px] text-sky-950 bg-sky-100/70 p-2 rounded-xl border border-sky-200 font-medium">
                              <span className="font-black block">⏳ Aviso de entrega futura registrado</span>
                              <span>Aguardando a chegada do entregador na portaria do condomínio.</span>
                            </div>
                          )}

                          {isSaida && (
                            <div className="text-[11px] text-purple-950 bg-purple-100/70 p-2 rounded-xl border border-purple-200 font-medium">
                              <span className="font-black block">📤 Retirada Externa:</span>
                              <span>Destinatário autorizado: <b>{enc.destinatarioExterno || 'Terceiro'}</b> {enc.telefoneDestinatario && `• Tel: ${enc.telefoneDestinatario}`}</span>
                            </div>
                          )}

                          {enc.localArmazenamento && (isPendente || isAguardandoColeta || isEmbrulhoDeixado) && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-slate-500">Guardado em:</span>
                              <strong className="text-slate-950 font-black flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                {enc.localArmazenamento}
                              </strong>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-1">
                            {isEsperando ? (
                              <span>Aviso criado em: <b>{enc.dataRecebimento || 'Hoje'}</b></span>
                            ) : (
                              <span>Registrado em: <b>{enc.dataRecebimento} às {enc.horaRecebimento}</b></span>
                            )}
                            {enc.porteiroRecebedor && <span>Porteiro: <b>{enc.porteiroRecebedor}</b></span>}
                          </div>

                          {enc.codigoRastreio && (
                            <div className="text-[10px] font-mono text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                              Rastreio: {enc.codigoRastreio}
                            </div>
                          )}

                          {enc.observacoes && (
                            <div className="text-[11px] text-slate-700 bg-white/60 p-2 rounded-xl border border-slate-200">
                              <b>Observações:</b> {enc.observacoes}
                            </div>
                          )}
                        </div>

                        {enc.fotoPacote && (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-white/90">
                            <img
                              src={enc.fotoPacote}
                              alt="Foto do pacote"
                              className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                            />
                            <span className="text-[10px] text-slate-600 font-semibold">
                              Foto registrada na recepção da portaria
                            </span>
                          </div>
                        )}

                        {isEntregue && (
                          <div className="p-2.5 rounded-xl bg-emerald-100/90 border border-emerald-300 text-[11px] text-emerald-950 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Retirado por <b>{enc.retiradoPorNome || enc.destinatarioNome}</b> em {enc.dataRetirada} às {enc.horaRetirada}</span>
                          </div>
                        )}

                        {isDespachado && (
                          <div className="p-2.5 rounded-xl bg-emerald-100/90 border border-emerald-300 text-[11px] text-emerald-950 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Despachado para <b>{enc.destinatarioExterno || 'Destinatário'}</b> em {enc.dataDespacho || enc.dataRetirada} às {enc.horaDespacho || enc.horaRetirada}</span>
                          </div>
                        )}

                        {/* Rodapé com Botão de Timeline e Ações de Status */}
                        <div className="pt-2 border-t border-slate-950/10 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Botão de Timeline com Horários */}
                            <button
                              type="button"
                              onClick={() => abrirTimelineEncomenda(enc)}
                              className="text-[11px] font-bold text-indigo-900 bg-indigo-100/80 hover:bg-indigo-200 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-indigo-200 shadow-2xs"
                              title="Ver linha do tempo com todos os horários registrados"
                            >
                              <Clock className="w-3 h-3 text-indigo-700" />
                              <span>Timeline ({enc.timeline?.length || 1} etapas)</span>
                            </button>

                            {/* Porteiro confirma chegada */}
                            {isEsperando && isStaff && (
                              <button
                                type="button"
                                onClick={() => atualizarStatusEncomenda(enc.id, 'Aguardando Retirada')}
                                className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-black px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                                title="Confirmar recebimento do pacote na portaria"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Confirmar Chegada</span>
                              </button>
                            )}

                            {/* Morador ou Porteiro confirmam a retirada da encomenda */}
                            {isPendente && (
                              <button
                                type="button"
                                onClick={() => darBaixaEncomenda(enc.id)}
                                className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-black px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                                title="Confirmar que o pacote foi retirado pelo morador"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirmar Retirada</span>
                              </button>
                            )}

                            {/* Porteiro confirma custódia de embrulho para despacho */}
                            {isEmbrulhoDeixado && isStaff && (
                              <button
                                type="button"
                                onClick={() => atualizarStatusEncomenda(enc.id, 'Aguardando Coleta na Portaria')}
                                className="text-[11px] bg-purple-600 hover:bg-purple-500 text-white font-black px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Confirmar Custódia</span>
                              </button>
                            )}

                            {/* Confirmação de Despacho para terceiro */}
                            {isAguardandoColeta && isStaff && (
                              <button
                                type="button"
                                onClick={() => atualizarStatusEncomenda(enc.id, 'Despachado / Retirado por Terceiro')}
                                className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-black px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirmar Despacho</span>
                              </button>
                            )}
                          </div>

                          {isAutor && (
                            <div className="flex items-center gap-1.5 ml-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setEncomendaToEdit(enc);
                                  setIsEncomendaModalOpen(true);
                                }}
                                className="text-[11px] text-indigo-700 hover:text-indigo-900 font-extrabold px-2 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                                title="Editar"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Deseja realmente excluir este registro?')) {
                                    excluirEncomenda(enc.id);
                                  }
                                }}
                                className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      <CreateAutorizacaoModal
        isOpen={isAutorizacaoModalOpen}
        onClose={() => {
          setIsAutorizacaoModalOpen(false);
          setAutorizacaoToEdit(null);
        }}
        autorizacaoToEdit={autorizacaoToEdit}
      />

      <CreateEncomendaModal
        isOpen={isEncomendaModalOpen}
        onClose={() => {
          setIsEncomendaModalOpen(false);
          setEncomendaToEdit(null);
        }}
        encomendaToEdit={encomendaToEdit}
      />

      {/* Modal de Timeline com Horários */}
      {timelineModalData && (
        <PortariaTimelineModal
          isOpen={timelineModalOpen}
          onClose={() => {
            setTimelineModalOpen(false);
            setTimelineModalData(null);
          }}
          tituloItem={timelineModalData.titulo}
          subtituloItem={timelineModalData.subtitulo}
          unidade={timelineModalData.unidade}
          itemTipo={timelineModalData.tipo}
          itemEncomenda={timelineModalData.itemEncomenda}
          itemAcesso={timelineModalData.itemAcesso}
          timeline={timelineModalData.itemEncomenda?.timeline || timelineModalData.itemAcesso?.timeline || []}
        />
      )}

    </div>
  );
};
