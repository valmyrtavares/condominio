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
  Check
} from 'lucide-react';
import { CreateAutorizacaoModal } from '../components/portaria/CreateAutorizacaoModal';
import { CreateEncomendaModal } from '../components/portaria/CreateEncomendaModal';

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
  const [isAutorizacaoModalOpen, setIsAutorizacaoModalOpen] = useState(false);
  const [autorizacaoToEdit, setAutorizacaoToEdit] = useState<AutorizacaoAcesso | null>(null);
  const [isEncomendaModalOpen, setIsEncomendaModalOpen] = useState(false);
  const [encomendaToEdit, setEncomendaToEdit] = useState<EncomendaEntrega | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isStaff = currentUser.role === 'colaborador' || currentUser.role === 'sindico' || currentUser.role === 'subsindico' || currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria';

  // Minhas autorizações de acesso
  const minhasAutorizacoes = (isStaff && (currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria'))
    ? autorizacoesAcesso
    : autorizacoesAcesso.filter(a => a.unidade === currentUser.unidade);

  // Minhas encomendas
  const minhasEncomendas = (isStaff && (currentUser.unidade === 'Staff' || currentUser.unidade === 'Portaria'))
    ? encomendasEntregas
    : encomendasEntregas.filter(e => e.unidade === currentUser.unidade);

  const encomendasPendentes = minhasEncomendas.filter(e => e.status === 'Aguardando Retirada');
  const encomendasEsperadas = minhasEncomendas.filter(e => e.status === 'Aguardando Chegada na Portaria');

  const filteredAcessos = minhasAutorizacoes.filter(a => {
    const termo = searchTerm.toLowerCase().trim();
    return !termo ||
      a.nomeVisitante.toLowerCase().includes(termo) ||
      a.tipoVisitante.toLowerCase().includes(termo) ||
      a.unidade.toLowerCase().includes(termo) ||
      (a.observacoes && a.observacoes.toLowerCase().includes(termo));
  });

  const filteredEncomendas = minhasEncomendas.filter(e => {
    const termo = searchTerm.toLowerCase().trim();
    return !termo ||
      e.destinatarioNome.toLowerCase().includes(termo) ||
      e.empresaTransporte.toLowerCase().includes(termo) ||
      e.tipo.toLowerCase().includes(termo) ||
      e.unidade.toLowerCase().includes(termo) ||
      (e.codigoRastreio && e.codigoRastreio.toLowerCase().includes(termo));
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
          label: 'Aguardando Chegada na Portaria'
        };
      case 'Aguardando Retirada':
        return {
          bg: 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse',
          icon: <Package className="w-3.5 h-3.5 text-slate-950" />,
          label: 'Aguardando Retirada do Morador'
        };
      case 'Entregue ao Morador':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Entregue ao Morador'
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
            Autorize a entrada de visitas e prestadores com foto e horário, e acompanhe encomendas recebidas na portaria.
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
              <span>+ Autorizar Entrada de Visita</span>
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
              <span>+ Registrar Encomenda</span>
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
          <span>Autorizações de Entrada ({minhasAutorizacoes.length})</span>
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
          <span>Encomendas & Pacotes ({minhasEncomendas.length})</span>
          {encomendasPendentes.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black animate-pulse">
              {encomendasPendentes.length} a retirar
            </span>
          )}
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="relative">
        <input
          type="text"
          placeholder={activeTab === 'acessos' ? "Buscar visitante por nome, tipo ou recado..." : "Buscar encomenda por destinatário, transportadora..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/75 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
        />
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
      </div>

      {/* ABA 1: AUTORIZAÇÕES DE ENTRADA / VISITAS */}
      {activeTab === 'acessos' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
              Pessoas Autorizadas a Entrar ({filteredAcessos.length})
            </span>
          </div>

          {filteredAcessos.length === 0 ? (
            <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-3 backdrop-blur-xs">
              <UserCheck className="w-10 h-10 text-indigo-600 mx-auto" />
              <h4 className="text-base font-black text-slate-950">Nenhuma autorização ativa</h4>
              <p className="text-xs text-slate-700 font-medium max-w-md mx-auto">
                Notifique a portaria informando quem vai chegar, envie uma foto e libere a entrada direta sem necessidade de interfonar.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAutorizacaoToEdit(null);
                  setIsAutorizacaoModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Autorizar Alguém Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAcessos.map((acesso) => {
                const badge = getStatusAcessoBadge(acesso.status);
                const isAutor = acesso.moradorId === currentUser.id || (!acesso.moradorId && acesso.unidade === currentUser.unidade) || currentUser.role === 'sindico' || currentUser.role === 'subsindico';

                return (
                  <div
                    key={acesso.id}
                    className="bg-white/60 border border-white/80 rounded-3xl p-4 sm:p-5 shadow-lg hover:bg-white/75 transition-all backdrop-blur-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      
                      {/* Topo do Card com Foto do Visitante */}
                      <div className="flex items-start gap-3">
                        {acesso.fotoVisitante ? (
                          <img
                            src={acesso.fotoVisitante}
                            alt={acesso.nomeVisitante}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0 bg-slate-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-800 shrink-0 font-black">
                            <User className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-indigo-300">
                              {acesso.tipoVisitante}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${badge.bg}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </div>

                          <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight mt-1 truncate">
                            {acesso.nomeVisitante}
                          </h4>

                          {acesso.documentoRg && (
                            <span className="text-[10px] text-slate-600 font-mono font-semibold block">
                              Doc: {acesso.documentoRg}
                            </span>
                          )}
                        </div>
                      </div>

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
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Liberação:</span>
                          <span className="text-emerald-950 font-black text-[11px] flex items-center gap-1">
                            {acesso.deixarEntrarDireto ? '✓ Entrada Direta' : 'Interfonar Antes'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {acesso.deixarEntrarDireto ? 'Sem interfonar' : 'Portaria avisa'}
                          </span>
                        </div>
                      </div>

                      {acesso.observacoes && (
                        <p className="text-xs text-slate-700 font-medium bg-white/50 p-2 rounded-xl border border-white/70">
                          <b>Recado:</b> {acesso.observacoes}
                        </p>
                      )}

                      {acesso.horarioEntradaReal && (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 font-bold flex items-center justify-between">
                          <span>Entrou às: <b>{acesso.horarioEntradaReal}</b></span>
                          <span className="text-[10px] text-slate-500">Resp: {acesso.porteiroResponsavel || 'Portaria'}</span>
                        </div>
                      )}
                    </div>

                    {/* Rodapé com Ações (Visíveis apenas para o autor) */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-950/10 text-xs flex-wrap gap-2">
                      <span className="text-[10px] text-slate-500">
                        Autorizado por: {acesso.moradorNome}
                      </span>

                      {isAutor && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setAutorizacaoToEdit(acesso);
                              setIsAutorizacaoModalOpen(true);
                            }}
                            className="text-[11px] text-indigo-700 hover:text-indigo-900 font-extrabold px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Editar dados da autorização"
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
                            className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Excluir autorização"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Excluir</span>
                          </button>
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

      {/* ABA 2: ENCOMENDAS & PACOTES NA PORTARIA */}
      {activeTab === 'encomendas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
              Encomendas e Pacotes ({filteredEncomendas.length})
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
            </div>
          </div>

          {filteredEncomendas.length === 0 ? (
            <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-3 backdrop-blur-xs">
              <Package className="w-10 h-10 text-indigo-600 mx-auto" />
              <h4 className="text-base font-black text-slate-950">Nenhuma encomenda registrada no momento</h4>
              <p className="text-xs text-slate-700 font-medium max-w-md mx-auto">
                Assim que uma entrega for avisada ou recebida na portaria para o seu apartamento, ela aparecerá aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredEncomendas.map((enc) => {
                const badgeInfo = getStatusEncomendaBadge(enc.status);
                const isEsperando = enc.status === 'Aguardando Chegada na Portaria';
                const isPendente = enc.status === 'Aguardando Retirada';
                const isEntregue = enc.status === 'Entregue ao Morador';
                const isAutor = (enc.moradorId && enc.moradorId === currentUser.id) || (!enc.moradorId && enc.unidade === currentUser.unidade) || isStaff;

                return (
                  <div
                    key={enc.id}
                    className={`border-2 rounded-3xl p-4 sm:p-5 shadow-lg transition-all backdrop-blur-xs flex flex-col justify-between space-y-3 ${
                      isEsperando
                        ? 'bg-sky-50/85 border-sky-300'
                        : isPendente
                        ? 'bg-amber-50/85 border-amber-300'
                        : isEntregue
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white/60 border-white/80'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 ${
                            isEsperando ? 'bg-sky-600 text-white' :
                            isPendente ? 'bg-amber-500 text-slate-950' : 
                            isEntregue ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            {enc.empresaTransporte && (
                              <span className="text-[10px] font-black uppercase text-indigo-900 block">
                                {enc.empresaTransporte}
                              </span>
                            )}
                            <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight">
                              {enc.tipo} • Para {enc.destinatarioNome}
                            </h4>
                            <span className="text-[11px] font-bold text-slate-600">
                              Unidade <b>{enc.unidade}</b> {enc.bloco && `(${enc.bloco})`}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs shrink-0 flex items-center gap-1 ${badgeInfo.bg}`}>
                          {badgeInfo.icon}
                          <span>{enc.status}</span>
                        </span>
                      </div>

                      {/* Local e Detalhes */}
                      <div className="p-3 bg-white/85 rounded-2xl border border-white/90 text-xs space-y-1.5 shadow-2xs">
                        {isEsperando && (
                          <div className="text-[11px] text-sky-950 bg-sky-100/70 p-2 rounded-xl border border-sky-200 font-medium">
                            <span className="font-black block">⏳ Aviso de entrega futura registrado</span>
                            <span>Aguardando a chegada do entregador na portaria do condomínio.</span>
                          </div>
                        )}

                        {enc.localArmazenamento && isPendente && (
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
                            <span>Recebido em: <b>{enc.dataRecebimento} às {enc.horaRecebimento}</b></span>
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
                    </div>

                    {/* Rodapé com Ações de Status e Edição */}
                    <div className="pt-2 border-t border-slate-950/10 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Porteiro pode confirmar chegada se estiver aguardando chegada */}
                        {isEsperando && isStaff && (
                          <button
                            type="button"
                            onClick={() => {
                              atualizarStatusEncomenda(enc.id, 'Aguardando Retirada');
                            }}
                            className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-black px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            title="Confirmar recebimento do pacote na portaria"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Confirmar Chegada na Portaria</span>
                          </button>
                        )}

                        {/* Morador ou Porteiro podem confirmar a retirada */}
                        {isPendente && (
                          <button
                            type="button"
                            onClick={() => darBaixaEncomenda(enc.id)}
                            className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            title="Confirmar que o pacote foi retirado pelo morador"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirmar Retirada</span>
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
                            className="text-[11px] text-indigo-700 hover:text-indigo-900 font-extrabold px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Editar registro da encomenda"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Deseja realmente excluir este registro de encomenda?')) {
                                excluirEncomenda(enc.id);
                              }
                            }}
                            className="text-[11px] text-rose-700 hover:text-rose-900 font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Excluir encomenda"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Excluir</span>
                          </button>
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

    </div>
  );
};
