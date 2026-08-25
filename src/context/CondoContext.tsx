import React, { createContext, useContext, useState } from 'react';
import { 
  User, 
  Reclamacao, 
  Reparo, 
  PrestacaoContas, 
  Unidade, 
  Funcionario, 
  StatusReparo, 
  StatusReclamacao,
  EspinhaDorsalItem,
  CategoriaReclamacao,
  PorteReparo,
  CategoriaReparo,
  Benfeitoria,
  TipoBenfeitoria,
  VagaGaragem,
  StatusVaga,
  VeiculoInfo,
  ServicoContratado,
  StatusServicoContratado,
  PropostaEmpresa,
  Dependencia,
  ReservaDependencia,
  Assembleia,
  EventoCondominio,
  UnidadeDisponivel,
  FinalidadeImovel
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_UNIDADES, 
  MOCK_RECLAMACOES, 
  MOCK_REPAROS, 
  MOCK_BENFEITORIAS,
  MOCK_VAGAS_GARAGEM,
  MOCK_SERVICOS_CONTRATADOS,
  MOCK_DEPENDENCIAS,
  MOCK_RESERVAS,
  MOCK_ASSEMBLEIAS,
  MOCK_EVENTOS,
  MOCK_UNIDADES_DISPONIVEIS,
  MOCK_PRESTACAO_CONTAS, 
  MOCK_FUNCIONARIOS,
  ESPINHA_DORSAL_ITEMS,
  CURRENT_CONDO_ID
} from '../mock/seedData';

interface CondoContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  toggleRole: () => void;
  unidades: Unidade[];
  reclamacoes: Reclamacao[];
  reparos: Reparo[];
  benfeitorias: Benfeitoria[];
  vagasGaragem: VagaGaragem[];
  servicosContratados: ServicoContratado[];
  dependencias: Dependencia[];
  reservas: ReservaDependencia[];
  assembleias: Assembleia[];
  eventos: EventoCondominio[];
  unidadesDisponiveis: UnidadeDisponivel[];
  prestacaoContas: PrestacaoContas;
  funcionarios: Funcionario[];
  espinhaDorsalItems: EspinhaDorsalItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  selectedReclamacaoId: string | null;
  setSelectedReclamacaoId: (id: string | null) => void;
  selectedReparoId: string | null;
  setSelectedReparoId: (id: string | null) => void;
  
  // Actions
  apoiarReclamacao: (id: string) => void;
  adicionarComentario: (reclamacaoId: string, texto: string) => void;
  adicionarReclamacao: (titulo: string, descricao: string, categoria: CategoriaReclamacao, anexoUrl?: string, anexoTipo?: 'imagem' | 'video') => void;
  adicionarReparo: (titulo: string, descricao: string, porte: PorteReparo, categoria: CategoriaReparo, fotoUrl?: string) => void;
  adicionarBenfeitoria: (titulo: string, subtitulo: string, tipo: TipoBenfeitoria, descricao: string, impactoGestao: string, fotos: string[], investimento?: number, economiaMensal?: number, regrasUso?: string) => void;
  adicionarServicoContratado: (titulo: string, descricao: string, categoria: string, status: StatusServicoContratado, propostas: PropostaEmpresa[], observacoesFinais?: string) => void;
  selecionarPropostaVencedora: (servicoId: string, propostaId: string) => void;
  solicitarReserva: (dependenciaId: string, dataReserva: string, periodo: ReservaDependencia['periodo']) => void;
  cancelarReserva: (reservaId: string) => void;
  atualizarStatusReclamacao: (id: string, novoStatus: StatusReclamacao) => void;
  atualizarStatusVaga: (vagaId: string, novoStatus: StatusVaga, dadosAdicionais?: { veiculo?: VeiculoInfo; valorAluguelMensal?: number; observacoes?: string }) => void;
  transformarEmReparo: (reclamacaoId: string, titulo: string, descricao: string) => string;
  selecionarOrcamento: (reparoId: string, orcamentoId: string) => void;
  atualizarStatusReparo: (reparoId: string, novoStatus: StatusReparo) => void;
}

const CondoContext = createContext<CondoContextType | undefined>(undefined);

export const CondoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default: Morador Carlos Silva
  const [unidades] = useState<Unidade[]>(MOCK_UNIDADES);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>(MOCK_RECLAMACOES);
  const [reparos, setReparos] = useState<Reparo[]>(MOCK_REPAROS);
  const [benfeitorias, setBenfeitorias] = useState<Benfeitoria[]>(MOCK_BENFEITORIAS);
  const [vagasGaragem, setVagasGaragem] = useState<VagaGaragem[]>(MOCK_VAGAS_GARAGEM);
  const [servicosContratados, setServicosContratados] = useState<ServicoContratado[]>(MOCK_SERVICOS_CONTRATADOS);
  const [dependencias, setDependencias] = useState<Dependencia[]>(MOCK_DEPENDENCIAS);
  const [reservas, setReservas] = useState<ReservaDependencia[]>(MOCK_RESERVAS);
  const [assembleias, setAssembleias] = useState<Assembleia[]>(MOCK_ASSEMBLEIAS);
  const [eventos, setEventos] = useState<EventoCondominio[]>(MOCK_EVENTOS);
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<UnidadeDisponivel[]>(MOCK_UNIDADES_DISPONIVEIS);
  const [prestacaoContas] = useState<PrestacaoContas>(MOCK_PRESTACAO_CONTAS);
  const [funcionarios] = useState<Funcionario[]>(MOCK_FUNCIONARIOS);
  const [espinhaDorsalItems] = useState<EspinhaDorsalItem[]>(ESPINHA_DORSAL_ITEMS);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [selectedReclamacaoId, setSelectedReclamacaoId] = useState<string | null>('rec-barulho-gourmet');
  const [selectedReparoId, setSelectedReparoId] = useState<string | null>('rep-motor-portao');

  const toggleRole = () => {
    if (currentUser.role === 'morador') {
      const adminUser = MOCK_USERS.find(u => u.id === 'usr-admin-401') || MOCK_USERS[4];
      setCurrentUser(adminUser);
    } else {
      const normalUser = MOCK_USERS.find(u => u.id === 'usr-morador-102') || MOCK_USERS[0];
      setCurrentUser(normalUser);
    }
  };

  const apoiarReclamacao = (id: string) => {
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === id) {
        const jaApoiou = rec.apoiadoPeloUsuario;
        return {
          ...rec,
          apoiosCount: jaApoiou ? rec.apoiosCount - 1 : rec.apoiosCount + 1,
          apoiadoPeloUsuario: !jaApoiou
        };
      }
      return rec;
    }));
  };

  const adicionarComentario = (reclamacaoId: string, texto: string) => {
    if (!texto.trim()) return;
    const novoComentario = {
      id: `com-${Date.now()}`,
      autorId: currentUser.id,
      autorNome: `${currentUser.nome}${currentUser.role !== 'morador' ? ' (Subsíndica)' : ''}`,
      autorRole: currentUser.role,
      autorUnidade: currentUser.role === 'morador' ? `Apt ${currentUser.unidade}` : 'Administração',
      autorFoto: currentUser.foto,
      texto,
      data: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      oficial: currentUser.role !== 'morador'
    };

    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === reclamacaoId) {
        return {
          ...rec,
          comentarios: [...rec.comentarios, novoComentario]
        };
      }
      return rec;
    }));
  };

  const transformarEmReparo = (reclamacaoId: string, titulo: string, descricao: string): string => {
    const reclamacao = reclamacoes.find(r => r.id === reclamacaoId);
    const novoReparoId = `rep-${Date.now()}`;
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    const novoReparo: Reparo = {
      id: novoReparoId,
      reclamacaoId,
      titulo: titulo || `Reparo: ${reclamacao?.titulo || 'Solicitação'}`,
      descricao: descricao || reclamacao?.descricao || '',
      porte: 'Médio',
      categoria: 'Outros',
      solicitanteNome: `${reclamacao?.autorNome || currentUser.nome} (Originado de Reclamação)`,
      solicitanteUnidade: reclamacao?.autorUnidade || `Apt ${currentUser.unidade}`,
      dataSolicitacao: dataHoje,
      responsavel: `${currentUser.nome} (${currentUser.role === 'subsindico' ? 'Subsíndica' : 'Síndico'})`,
      status: 'Aguardando Conserto',
      condominioId: currentUser.condominioId,
      orcamentos: [
        {
          id: `orc-a-${Date.now()}`,
          empresa: 'Portões & Automatizadores SP',
          siteUrl: 'https://portoesecia.exemplo.com.br',
          cnpj: '12.345.678/0001-90',
          valor: 2100.00,
          descricao: 'Substituição por motor Rossi Ninja 1/3hp + garantia 6 meses.',
          prazoDias: 3,
          selecionado: false
        },
        {
          id: `orc-b-${Date.now()}`,
          empresa: 'Automatiza Tech Condominial',
          siteUrl: 'https://automatizatech.exemplo.com.br',
          cnpj: '98.765.432/0001-11',
          valor: 1850.00,
          descricao: 'Motor PPA JetFlex industrial + roletes reforçados e garantia 12 meses.',
          prazoDias: 2,
          selecionado: true
        },
        {
          id: `orc-c-${Date.now()}`,
          empresa: 'Serviços Seguras SP',
          siteUrl: 'https://segurassp.exemplo.com.br',
          cnpj: '45.888.999/0001-33',
          valor: 2300.00,
          descricao: 'Kit automatizador com travas eletromagnéticas antiesmagamento.',
          prazoDias: 5,
          selecionado: false
        }
      ],
      empresaEscolhida: 'Automatiza Tech Condominial',
      valorFinal: 1850.00,
      timeline: [
        {
          id: `tl-1-${Date.now()}`,
          data: reclamacao?.data || dataHoje,
          titulo: 'Problema Registrado',
          descricao: 'Reclamação iniciada pelo morador.',
          autorRole: 'morador'
        },
        {
          id: `tl-2-${Date.now()}`,
          data: dataHoje,
          titulo: 'Transformado em Ação de Reparo',
          descricao: `Ação de reparo criada pela administração (${currentUser.nome}).`,
          autorRole: currentUser.role,
          statusAlvo: 'Aguardando Conserto'
        }
      ],
      fotosAntes: ['https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80'],
      fotosDepois: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80']
    };

    setReparos(prev => [novoReparo, ...prev]);

    // Update complaint status and link repair
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === reclamacaoId) {
        return {
          ...rec,
          status: 'Em andamento' as StatusReclamacao,
          reparoId: novoReparoId,
          comentarios: [
            ...rec.comentarios,
            {
              id: `com-admin-${Date.now()}`,
              autorId: currentUser.id,
              autorNome: `${currentUser.nome} (Subsíndica)`,
              autorRole: currentUser.role,
              autorUnidade: 'Administração',
              autorFoto: currentUser.foto,
              texto: 'Aviso da Administração: Esta reclamação foi acolhida e transformada em Ordem de Reparo! Você pode acompanhar os orçamentos e a execução diretamente na aba Reparos.',
              data: dataHoje,
              oficial: true
            }
          ]
        };
      }
      return rec;
    }));

    return novoReparoId;
  };

  const selecionarOrcamento = (reparoId: string, orcamentoId: string) => {
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        const novosOrcamentos = rep.orcamentos.map(o => ({
          ...o,
          selecionado: o.id === orcamentoId
        }));
        const selecionado = novosOrcamentos.find(o => o.selecionado);

        const novaTimelineStep = {
          id: `tl-orc-${Date.now()}`,
          data: new Date().toLocaleDateString('pt-BR'),
          titulo: 'Orçamento Selecionado',
          descricao: `Orçamento da empresa ${selecionado?.empresa} (R$ ${selecionado?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) selecionado pela administração.`,
          autorRole: currentUser.role,
          statusAlvo: 'Aprovado' as StatusReparo
        };

        return {
          ...rep,
          orcamentos: novosOrcamentos,
          empresaEscolhida: selecionado?.empresa,
          valorFinal: selecionado?.valor,
          status: 'Aprovado' as StatusReparo,
          timeline: [...rep.timeline, novaTimelineStep]
        };
      }
      return rep;
    }));
  };

  const atualizarStatusReparo = (reparoId: string, novoStatus: StatusReparo) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        const novaStep = {
          id: `tl-stat-${Date.now()}`,
          data: dataHoje,
          titulo: `Status Atualizado: ${novoStatus}`,
          descricao: `O status do reparo evoluiu para "${novoStatus}" por ação da administração.`,
          autorRole: currentUser.role,
          statusAlvo: novoStatus
        };

        const reparoAtualizado = {
          ...rep,
          status: novoStatus,
          timeline: [...rep.timeline, novaStep]
        };

        // If completed/executed, update linked complaint if any
        if ((novoStatus === 'Executado' || novoStatus === 'Confirmado') && rep.reclamacaoId) {
          setReclamacoes(recs => recs.map(rec => {
            if (rec.id === rep.reclamacaoId) {
              return {
                ...rec,
                status: 'Resolvida' as StatusReclamacao
              };
            }
            return rec;
          }));
        }

        return reparoAtualizado;
      }
      return rep;
    }));
  };

  const adicionarReclamacao = (
    titulo: string,
    descricao: string,
    categoria: CategoriaReclamacao,
    anexoUrl?: string,
    anexoTipo?: 'imagem' | 'video'
  ) => {
    const novaRec: Reclamacao = {
      id: `rec-${Date.now()}`,
      titulo,
      descricao,
      categoria,
      autorId: currentUser.id,
      autorNome: currentUser.nome,
      autorUnidade: currentUser.role === 'morador' ? `Apt ${currentUser.unidade}` : 'Administração',
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Recebida',
      apoiosCount: 0,
      apoiadoPeloUsuario: false,
      comentarios: [],
      condominioId: CURRENT_CONDO_ID,
      anexoUrl,
      anexoTipo
    };
    setReclamacoes(prev => [novaRec, ...prev]);
    setSelectedReclamacaoId(novaRec.id);
  };

  const adicionarReparo = (
    titulo: string, 
    descricao: string, 
    porte: PorteReparo, 
    categoria: CategoriaReparo, 
    fotoUrl?: string
  ) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const novoReparo: Reparo = {
      id: `rep-${Date.now()}`,
      titulo,
      descricao,
      porte,
      categoria,
      solicitanteNome: currentUser.nome,
      solicitanteUnidade: `Apt ${currentUser.unidade} - ${currentUser.bloco}`,
      dataSolicitacao: dataHoje,
      responsavel: 'A definir (Administração)',
      status: 'Solicitado',
      condominioId: CURRENT_CONDO_ID,
      orcamentos: [],
      timeline: [
        {
          id: `tl-sol-${Date.now()}`,
          data: dataHoje,
          titulo: 'Solicitação de Reparo Registrada',
          descricao: `Abertura realizada por ${currentUser.nome} (${currentUser.unidade}). Aguardando análise técnica da administração.`,
          autorRole: currentUser.role
        }
      ],
      fotosAntes: fotoUrl ? [fotoUrl] : ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80']
    };

    setReparos(prev => [novoReparo, ...prev]);
    setSelectedReparoId(novoReparo.id);
  };

  const adicionarBenfeitoria = (
    titulo: string,
    subtitulo: string,
    tipo: TipoBenfeitoria,
    descricao: string,
    impactoGestao: string,
    fotos: string[],
    investimento?: number,
    economiaMensal?: number,
    regrasUso?: string
  ) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const novaBenfeitoria: Benfeitoria = {
      id: `benf-${Date.now()}`,
      titulo,
      subtitulo,
      tipo,
      dataEntrega: dataHoje,
      descricao,
      impactoGestao,
      investimento,
      economiaMensal,
      fotos: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
      responsavel: `${currentUser.nome} (${currentUser.role === 'subsindico' ? 'Subsíndica' : 'Síndico'})`,
      condominioId: CURRENT_CONDO_ID,
      regrasUso
    };

    setBenfeitorias(prev => [novaBenfeitoria, ...prev]);
  };

  const atualizarStatusVaga = (
    vagaId: string, 
    novoStatus: StatusVaga, 
    dadosAdicionais?: { veiculo?: VeiculoInfo; valorAluguelMensal?: number; observacoes?: string }
  ) => {
    setVagasGaragem(prev => prev.map(v => {
      if (v.id === vagaId) {
        return {
          ...v,
          status: novoStatus,
          veiculo: dadosAdicionais?.veiculo !== undefined ? dadosAdicionais.veiculo : v.veiculo,
          valorAluguelMensal: dadosAdicionais?.valorAluguelMensal !== undefined ? dadosAdicionais.valorAluguelMensal : v.valorAluguelMensal,
          observacoes: dadosAdicionais?.observacoes !== undefined ? dadosAdicionais.observacoes : v.observacoes
        };
      }
      return v;
    }));
  };

  const adicionarServicoContratado = (
    titulo: string,
    descricao: string,
    categoria: string,
    status: StatusServicoContratado,
    propostas: PropostaEmpresa[],
    observacoesFinais?: string
  ) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const novoServico: ServicoContratado = {
      id: `sc-${Date.now()}`,
      titulo,
      data: dataHoje,
      descricao,
      categoria,
      status,
      propostas,
      observacoesFinais,
      condominioId: CURRENT_CONDO_ID
    };

    setServicosContratados(prev => [novoServico, ...prev]);
  };

  const selecionarPropostaVencedora = (servicoId: string, propostaId: string) => {
    setServicosContratados(prev => prev.map(serv => {
      if (serv.id === servicoId) {
        return {
          ...serv,
          status: 'Contratada' as StatusServicoContratado,
          propostas: serv.propostas.map(p => ({
            ...p,
            selecionada: p.id === propostaId
          }))
        };
      }
      return serv;
    }));
  };

  const solicitarReserva = (
    dependenciaId: string, 
    dataReserva: string, 
    periodo: ReservaDependencia['periodo']
  ) => {
    const dep = dependencias.find(d => d.id === dependenciaId);
    const novaReserva: ReservaDependencia = {
      id: `res-${Date.now()}`,
      dependenciaId,
      moradorId: currentUser.id,
      moradorNome: currentUser.nome,
      unidade: `${currentUser.unidade} - ${currentUser.bloco}`,
      dataReserva,
      periodo,
      status: 'Confirmada',
      valorTaxa: dep?.taxaReserva
    };

    setReservas(prev => [novaReserva, ...prev]);
  };

  const cancelarReserva = (reservaId: string) => {
    setReservas(prev => prev.filter(r => r.id !== reservaId));
  };

  const atualizarStatusReclamacao = (id: string, novoStatus: StatusReclamacao) => {
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, status: novoStatus };
      }
      return rec;
    }));
  };

  return (
    <CondoContext.Provider value={{
      currentUser,
      setCurrentUser,
      toggleRole,
      unidades,
      reclamacoes,
      reparos,
      benfeitorias,
      vagasGaragem,
      servicosContratados,
      dependencias,
      reservas,
      assembleias,
      eventos,
      unidadesDisponiveis,
      prestacaoContas,
      funcionarios,
      espinhaDorsalItems,
      isDrawerOpen,
      setIsDrawerOpen,
      currentScreen,
      setCurrentScreen,
      selectedReclamacaoId,
      setSelectedReclamacaoId,
      selectedReparoId,
      setSelectedReparoId,
      apoiarReclamacao,
      adicionarComentario,
      adicionarReclamacao,
      adicionarReparo,
      adicionarBenfeitoria,
      adicionarServicoContratado,
      selecionarPropostaVencedora,
      solicitarReserva,
      cancelarReserva,
      atualizarStatusReclamacao,
      atualizarStatusVaga,
      transformarEmReparo,
      selecionarOrcamento,
      atualizarStatusReparo
    }}>
      {children}
    </CondoContext.Provider>
  );
};

export const useCondo = () => {
  const context = useContext(CondoContext);
  if (!context) {
    throw new Error('useCondo deve ser usado dentro de um CondoProvider');
  }
  return context;
};
