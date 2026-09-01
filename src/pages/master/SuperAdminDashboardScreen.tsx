import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { CondominioProfile } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  MapPin, 
  ArrowLeft, 
  LogOut, 
  ShieldCheck, 
  Crown, 
  Layers, 
  Globe, 
  User, 
  PauseCircle, 
  PlayCircle,
  Database,
  Cloud,
  CheckCircle2,
  Bell,
  AlertTriangle,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { CreateEditCondominioModal } from '../../components/master/CreateEditCondominioModal';
import { CondominioOcorrenciasModal } from '../../components/master/CondominioOcorrenciasModal';
import { NotificarCondominioModal } from '../../components/master/NotificarCondominioModal';
import { SuspenderCondominioModal } from '../../components/master/SuspenderCondominioModal';
import { executarSeedCompletoFirestore } from '../../services/firebase';

export const SuperAdminDashboardScreen: React.FC = () => {
  const { 
    condominios, 
    selecionarCondominio, 
    editarCondominio,
    excluirCondominio, 
    logoutMaster, 
    setCurrentScreen,
    loginAdmin,
    reclamacoes,
    reparos,
    funcionarios,
    regrasCondominio,
    dependencias,
    vagasGaragem,
    servicosContratados,
    assembleias,
    eventos,
    itensEnjoei,
    mudancas,
    registrosAtividades,
    autorizacoesAcesso,
    encomendasEntregas
  } = useCondo();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [condoToEdit, setCondoToEdit] = useState<CondominioProfile | null>(null);

  const [ocorrenciasCondo, setOcorrenciasCondo] = useState<CondominioProfile | null>(null);
  const [notificarCondo, setNotificarCondo] = useState<CondominioProfile | null>(null);
  const [suspenderCondo, setSuspenderCondo] = useState<CondominioProfile | null>(null);

  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleSyncFirestore = async () => {
    setIsSyncingFirestore(true);
    setSyncStatusMsg(null);
    try {
      const res = await executarSeedCompletoFirestore({
        condominios,
        unidades: [],
        moradores: [],
        funcionarios,
        regras: regrasCondominio,
        dependencias,
        vagas: vagasGaragem,
        servicosContratados,
        assembleias,
        eventos,
        reclamacoes,
        reparos,
        itensEnjoei,
        mudancas,
        diario: registrosAtividades,
        acessos: autorizacoesAcesso,
        encomendas: encomendasEntregas
      });

      if (res.success) {
        setSyncStatusMsg({ type: 'success', msg: `Nuvem sincronizada com sucesso!` });
      } else {
        setSyncStatusMsg({ type: 'error', msg: `Erro na sincronização: ${res.error}` });
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', msg: `Erro de conexão: ${err.message}` });
    } finally {
      setIsSyncingFirestore(false);
      setTimeout(() => setSyncStatusMsg(null), 8000);
    }
  };

  const totalUnidadesGlobal = condominios.reduce((acc, c) => acc + (c.totalUnidades || 0), 0);
  const faturamentoMensal = condominios.reduce((acc, c) => acc + (c.valorMensalidade || 450), 0);

  const filteredCondos = condominios.filter(c => {
    const matchStatus = filtroStatus === 'Todas' || c.status === filtroStatus;
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      c.nome.toLowerCase().includes(termo) ||
      c.slug.toLowerCase().includes(termo) ||
      c.endereco.toLowerCase().includes(termo);

    return matchStatus && matchBusca;
  });

  const handleCopyLink = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleOpenPainelAdministrativo = (condo: CondominioProfile) => {
    selecionarCondominio(condo.id);
    loginAdmin('admin', condo.senhaAdminGeral || 'admin');
    setCurrentScreen('admin');
  };

  const handleOpenAreaCliente = (condo: CondominioProfile) => {
    selecionarCondominio(condo.id);
    setCurrentScreen('home');
  };

  const handleConfirmSuspender = (condoId: string, novoStatus: 'ativo' | 'bloqueado', motivo?: string) => {
    editarCondominio(condoId, { status: novoStatus, motivoBloqueio: motivo });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-extrabold cursor-pointer transition-colors bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shadow-2xs">
          <ArrowLeft className="w-4 h-4" /> Voltar ao App
        </button>
        <div className="flex items-center gap-2">
          <button onClick={logoutMaster} className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/20 px-3 py-2 rounded-xl font-black transition-all cursor-pointer">
            <LogOut className="w-4 h-4" /> Sair do Master
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/30 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/10 shrink-0">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">Gerenciador Master de Condomínios</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mt-0.5">
              Gerencie cada condomínio, acesse o painel administrativo com 1 clique, monitore ocorrências, mensalidades e controle acessos.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button type="button" onClick={handleSyncFirestore} disabled={isSyncingFirestore} className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/40">
            <Cloud className={`w-4 h-4 ${isSyncingFirestore ? 'animate-spin' : ''}`} />
            <span>{isSyncingFirestore ? 'Sincronizando...' : '🔄 Sincronizar Nuvem'}</span>
          </button>
          <button type="button" onClick={() => { setCondoToEdit(null); setIsModalOpen(true); }} className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer">
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ Criar Novo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-amber-400" /> Condomínios</span>
          <strong className="text-2xl font-black text-white block">{condominios.length}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-indigo-400" /> Total Unidades</span>
          <strong className="text-2xl font-black text-white block">{totalUnidadesGlobal}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Mensalidade Total</span>
          <strong className="text-xl sm:text-2xl font-black text-emerald-300 block">R$ {faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1"><Cloud className="w-3.5 h-3.5 text-sky-400" /> Nuvem Firebase</span>
          <strong className="text-sm font-black text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Conectado</strong>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <input type="text" placeholder="Buscar condomínio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white" />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer">
          <option value="Todas">Status: Todos</option>
          <option value="ativo">🟢 Ativo</option>
          <option value="bloqueado">🔴 Bloqueado</option>
          <option value="em_implantacao">🟡 Em Implantação</option>
        </select>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Tabela de Gestão de Condomínios</h3>
            <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-700">{filteredCondos.length} instâncias</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">Nome do condomínio</th>
                <th className="py-4 px-4 text-center">Quantidade de unidades</th>
                <th className="py-4 px-4">Painel administrativo</th>
                <th className="py-4 px-4 text-center">Área do cliente</th>
                <th className="py-4 px-4 text-center">Data da implementação</th>
                <th className="py-4 px-4 text-center">Mês corrente</th>
                <th className="py-4 px-4 text-center">Ocorrências</th>
                <th className="py-4 px-4 text-right">Valor da mensalidade</th>
                <th className="py-4 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCondos.map((condo) => {
                const isAtivo = condo.status === 'ativo';
                const totalOcorrencias = (reclamacoes.filter(r => r.condominioId === condo.id).length || 0) + (reparos.filter(r => r.condominioId === condo.id).length || 0);
                const valorMensal = condo.valorMensalidade || 450;
                const diaVenc = condo.diaVencimento || 10;
                const dataImp = condo.dataImplementacao || condo.criadoEm || '01/01/2026';
                const isEmDia = condo.statusEmDia !== false;

                return (
                  <tr 
                    key={condo.id} 
                    className={`hover:bg-slate-800/40 transition-colors group ${
                      !isAtivo ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* 1. Nome do condomínio, slug e imagem principal */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 shadow-sm">
                          <img 
                            src={condo.fotoFachada || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'} 
                            alt={condo.nome} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <strong className="block text-white text-xs font-black group-hover:text-amber-300 transition-colors">
                              {condo.nome}
                            </strong>
                            {!isAtivo && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-black">
                                Bloqueado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
                            <span>/c/{condo.slug}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyLink(condo.slug, e)}
                              className="text-slate-400 hover:text-white cursor-pointer"
                              title="Copiar Link"
                            >
                              {copiedSlug === condo.slug ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]" title={condo.endereco}>
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            {condo.cidade ? `${condo.cidade} - ${condo.estado || 'SP'}` : condo.endereco}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Quantidade de unidades */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="space-y-0.5">
                        <strong className="text-white font-black text-sm block">
                          {condo.totalUnidades}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {condo.totalBlocos || 1} {condo.totalBlocos === 1 ? 'bloco' : 'blocos'}
                        </span>
                      </div>
                    </td>

                    {/* 3. Painel administrativo (Link para acessar + Notificar e Suspender) */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-1.5 min-w-[190px]">
                        <button 
                          onClick={() => handleOpenPainelAdministrativo(condo)} 
                          className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                          title={`Entrar de fato no Painel Síndico de ${condo.nome}`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Acessar Painel Síndico</span>
                        </button>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setNotificarCondo(condo)}
                            className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                            title="Enviar notificação oficial para a administração do condomínio"
                          >
                            <Bell className="w-3 h-3 text-amber-400" />
                            <span>Notificar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSuspenderCondo(condo)}
                            className={`flex-1 py-1 px-2 rounded-lg font-bold text-[10px] transition-colors flex items-center justify-center gap-1 border cursor-pointer ${
                              isAtivo
                                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
                            }`}
                            title={isAtivo ? "Suspender condomínio" : "Reativar condomínio"}
                          >
                            {isAtivo ? (
                              <>
                                <PauseCircle className="w-3 h-3 text-rose-400" />
                                <span>Suspender</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3 h-3 text-emerald-400" />
                                <span>Reativar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* 4. Área do cliente */}
                    <td className="py-4 px-4 align-middle text-center">
                      <button 
                        onClick={() => handleOpenAreaCliente(condo)} 
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-slate-700 hover:border-slate-600 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                        title="Acessar como morador"
                      >
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Área do Cliente</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>

                    {/* 5. Data da implementação */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-white text-xs block">
                          {dataImp}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Desde a criação
                        </span>
                      </div>
                    </td>

                    {/* 6. Mês corrente (Dia de vencimento e se está em dia) */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-300 font-bold block">
                          Vence dia <strong>{diaVenc}</strong>
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          isEmDia
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isEmDia ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {isEmDia ? 'Em dia' : 'Atrasado'}
                        </span>
                      </div>
                    </td>

                    {/* 7. Ocorrências (Popup com todas as ocorrências) */}
                    <td className="py-4 px-4 align-middle text-center">
                      <button 
                        onClick={() => setOcorrenciasCondo(condo)} 
                        className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                        title="Abrir popup com todas as ocorrências deste condomínio"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{totalOcorrencias}</span>
                        <span className="text-[10px] text-slate-400 underline ml-0.5">Ver popup</span>
                      </button>
                    </td>

                    {/* 8. Valor da mensalidade (Status paga ou pendente) */}
                    <td className="py-4 px-4 align-middle text-right">
                      <div className="space-y-1">
                        <strong className="text-sm font-black text-white block">
                          R$ {valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          condo.statusMensalidade === 'pago' || isEmDia
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {condo.statusMensalidade === 'pago' || isEmDia ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </td>

                    {/* Ações adicionais */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => { setCondoToEdit(condo); setIsModalOpen(true); }} 
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Cadastro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm(`Tem certeza que deseja excluir o condomínio "${condo.nome}"?`)) excluirCondominio(condo.id); }} 
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Condomínio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreateEditCondominioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} condominioToEdit={condoToEdit} />
      <CondominioOcorrenciasModal isOpen={Boolean(ocorrenciasCondo)} onClose={() => setOcorrenciasCondo(null)} condominio={ocorrenciasCondo} reclamacoes={reclamacoes} reparos={reparos} />
      <NotificarCondominioModal isOpen={Boolean(notificarCondo)} onClose={() => setNotificarCondo(null)} condominio={notificarCondo} />
      <SuspenderCondominioModal isOpen={Boolean(suspenderCondo)} onClose={() => setSuspenderCondo(null)} condominio={suspenderCondo} onConfirm={handleConfirmSuspender} />
    </div>
  );
};
