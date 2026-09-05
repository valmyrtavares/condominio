import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Reclamacao, 
  Reparo, 
  Orcamento,
  PrestacaoContas, 
  DespesaItem,
  ReceitaItem,
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
  Dependencia,
  ReservaDependencia,
  Assembleia,
  AtaAssembleia,
  StatusAssembleia,
  PautaAssembleia,
  EventoCondominio,
  UnidadeDisponivel,
  FinalidadeImovel,
  AdminUser,
  AdminRole,
  NotificacaoPrivada,
  ServicoMorador,
  StatusFuncionario,
  CategoriaFuncionario,
  AvaliacaoFuncionario,
  RegraTopico,
  ItemEnjoei,
  StatusItemEnjoei,
  RegistroAtividade,
  TipoAtividade,
  MudancaAgendamento,
  StatusMudanca,
  RegrasMudancaConfig,
  AutorizacaoAcesso,
  StatusAutorizacaoAcesso,
  EncomendaEntrega,
  StatusEncomenda,
  CondominioProfile,
  StatusCondominio,
  ModeloInicialCondominio,
  AdminModuloKey
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
  MOCK_MESES_PRESTACAO,
  MOCK_FUNCIONARIOS,
  MOCK_REGRAS_CONDOMINIO,
  MOCK_ITENS_ENJOEI,
  MOCK_REGISTROS_ATIVIDADES,
  MOCK_MUDANCAS,
  MOCK_REGRAS_MUDANCA,
  MOCK_AUTORIZACOES_ACESSO,
  MOCK_ENCOMENDAS_ENTREGAS,
  MOCK_CONDOMINIOS,
  ESPINHA_DORSAL_ITEMS,
  CURRENT_CONDO_ID
} from '../mock/seedData';
import { getScreenFromPath, getPathFromScreen, getRouteConfig } from '../router/routes';
import { 
  auth, 
  logoutFirebaseAuth, 
  ouvirCondominiosFirestore, 
  salvarCondominioNoFirestore, 
  excluirCondominioNoFirestore,
  ouvirSubcolecaoFirestore,
  salvarUnidadeNoFirestore,
  excluirDocumentoSubcolecaoFirestore,
  sincronizarSubcolecaoTenant,
  limparESubstituirSubcolecaoFirestore,
  cadastrarMoradorAuth,
  enviarEmailRecuperacaoSenha,
  ativarSindicoAuth
} from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Formata o número do apartamento baseado no item base do 1º andar e no número do andar atual.
 * Exemplo A: "11" -> Andar 1 = "11", Andar 2 = "21", Andar 3 = "31"...
 * Exemplo B: "13" -> Andar 1 = "13", Andar 2 = "23", Andar 3 = "33"...
 * Exemplo C: "01" -> Andar 1 = "01", Andar 2 = "11", Andar 3 = "21"...
 * Exemplo D: "101" -> Andar 1 = "101", Andar 2 = "201", Andar 3 = "301"...
 */
export function formatarNumeroAptoPorAndar(itemBase: string, floorIndex: number): string {
  const clean = itemBase.trim().replace(/[^0-9a-zA-Z]/g, '');
  if (!clean) return `${floorIndex}01`;

  if (/^\d+$/.test(clean)) {
    // Caso 1: Números de 2 dígitos começando com 1 (ex: "11", "12", "13", "15", "17", "19")
    if (clean.length === 2 && clean.startsWith('1')) {
      const sufixo = clean.slice(1);
      return `${floorIndex}${sufixo}`;
    }

    // Caso 2: Números de 3 dígitos começando com 1 (ex: "101", "102", "104")
    if (clean.length === 3 && clean.startsWith('1')) {
      const sufixo = clean.slice(1);
      return `${floorIndex}${sufixo}`;
    }

    // Caso 3: Números de 2 dígitos começando com 0 (ex: "01", "02", "04", "05")
    if (clean.length === 2 && clean.startsWith('0')) {
      const sufixo = clean.slice(1);
      if (floorIndex === 1) {
        return clean;
      }
      return `${floorIndex - 1}${sufixo}`;
    }

    // Caso 4: Números de 1 dígito (ex: "1", "2", "3")
    if (clean.length === 1) {
      if (floorIndex === 1) {
        return `0${clean}`;
      }
      return `${floorIndex - 1}${clean}`;
    }

    // Caso 5: Outros números de 2 dígitos (ex: "21", "22")
    if (clean.length === 2) {
      const sufixo = clean.slice(1);
      return `${floorIndex}${sufixo}`;
    }

    const sufixo = clean.slice(-2);
    return `${floorIndex}${sufixo}`;
  }

  return `${floorIndex}${clean}`;
}

/**
 * Normaliza o número da unidade removendo prefixos como 'Apto', 'Apt', 'Unidade', espaços, etc.
 */
export function normalizeUnitNumber(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/^(apt|apto|unidade|apartamento|cobertura|casa)\s*/i, '')
    .trim();
}

/**
 * Ordena unidades de forma numérica e natural (ex: 26, 31, 33, 101, 102)
 */
export function sortUnidades(lista: Unidade[]): Unidade[] {
  return [...lista].sort((a, b) => {
    const matchA = (a.numero || '').match(/\d+/);
    const matchB = (b.numero || '').match(/\d+/);
    const numA = matchA ? parseInt(matchA[0], 10) : NaN;
    const numB = matchB ? parseInt(matchB[0], 10) : NaN;

    if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
      return numA - numB;
    }
    return (a.numero || '').localeCompare(b.numero || '', 'pt-BR', { numeric: true, sensitivity: 'base' });
  });
}

/**
 * Função utilitária para gerar unidades a partir da quantidade total de unidades,
 * número de andares e padrão de apartamentos do 1º andar.
 */
/**
 * Função utilitária para gerar unidades a partir da quantidade total de unidades,
 * número de andares e padrão de apartamentos do 1º andar.
 */
export function gerarUnidadesPorPadraoEAndar(
  totalUnidades: number,
  totalAndares?: number,
  padraoPrimeiroAndar?: string,
  condoId: string = 'condo',
  totalBlocos: number = 1
): Unidade[] {
  const unidades: Unidade[] = [];
  const blocos = totalBlocos > 0 ? totalBlocos : 1;
  const rawItems = (padraoPrimeiroAndar || '')
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const patternItems = rawItems.length > 0 ? rawItems : ['01', '02', '03', '04'];
  const andaresCalculados = (totalAndares && totalAndares > 0) 
    ? totalAndares 
    : Math.max(1, Math.ceil(totalUnidades / patternItems.length));

  let unitCounter = 0;
  let floorIndex = 1;

  while (unitCounter < totalUnidades) {
    for (let pos = 0; pos < patternItems.length; pos++) {
      if (unitCounter >= totalUnidades) break;

      const itemBase = patternItems[pos];
      const numeroApto = formatarNumeroAptoPorAndar(itemBase, floorIndex);

      unitCounter++;
      const blocoLetra = String.fromCharCode(65 + ((unitCounter - 1) % blocos));

      unidades.push({
        id: `unit-${condoId}-${floorIndex}-${numeroApto}-${unitCounter}`,
        numero: numeroApto,
        andar: floorIndex,
        bloco: blocos > 1 ? `Bloco ${blocoLetra}` : 'Bloco A',
        tipo: 'Apartamento',
        vagaGaragem: '',
        senhaAcesso: numeroApto,
        senhaPadraoAlterada: false,
        statusCadastro: 'Pendente',
        semMoradores: false,
        moradores: []
      });
    }

    floorIndex++;
  }

  return unidades;
}

/**
 * Corrige automaticamente unidades que possam ter sido salvas com número vazio ('')
 */
export function curarUnidadesSemNumero(
  lista: Unidade[], 
  totalUnidades?: number, 
  totalAndares?: number, 
  padraoPrimeiroAndar?: string, 
  condoId: string = 'condo', 
  totalBlocos: number = 1
): Unidade[] {
  if (!Array.isArray(lista) || lista.length === 0) return lista;
  const temVazios = lista.some(u => !u.numero || u.numero.trim() === '');
  if (!temVazios) return lista;

  const total = lista.length;
  const gabarito = gerarUnidadesPorPadraoEAndar(
    total,
    totalAndares,
    padraoPrimeiroAndar,
    condoId,
    totalBlocos
  );

  return lista.map((u, idx) => {
    const numeroValido = (u.numero && u.numero.trim()) ? u.numero.trim() : (gabarito[idx]?.numero || String(idx + 1));
    return {
      ...u,
      numero: numeroValido,
      senhaAcesso: u.senhaAcesso && u.senhaAcesso.trim() ? u.senhaAcesso : numeroValido
    };
  });
}




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
  adicionarServicoContratado: (novo: Omit<ServicoContratado, 'id' | 'condominioId'>) => void;
  editarServicoContratado: (id: string, dados: Partial<ServicoContratado>) => void;
  excluirServicoContratado: (id: string) => void;
  dependencias: Dependencia[];
  adicionarDependencia: (nova: Omit<Dependencia, 'id' | 'condominioId'>) => void;
  editarDependencia: (id: string, dados: Partial<Dependencia>) => void;
  excluirDependencia: (id: string) => void;
  reservas: ReservaDependencia[];
  assembleias: Assembleia[];
  adicionarAssembleia: (nova: Omit<Assembleia, 'id' | 'condominioId'>) => void;
  editarAssembleia: (id: string, dados: Partial<Assembleia>) => void;
  excluirAssembleia: (id: string) => void;
  publicarAtaAssembleia: (id: string, ata: AtaAssembleia, status?: StatusAssembleia, pautasAtualizadas?: PautaAssembleia[]) => void;
  eventos: EventoCondominio[];
  adicionarEvento: (novo: Omit<EventoCondominio, 'id' | 'condominioId'>) => void;
  editarEvento: (id: string, dados: Partial<EventoCondominio>) => void;
  excluirEvento: (id: string) => void;
  suspenderEvento: (id: string, motivo: string) => void;
  reativarEvento: (id: string) => void;
  unidadesDisponiveis: UnidadeDisponivel[];
  adicionarUnidadeDisponivel: (nova: Omit<UnidadeDisponivel, 'id' | 'condominioId' | 'dataAnuncio'> & { dataAnuncio?: string }) => void;
  editarUnidadeDisponivel: (id: string, dados: Partial<UnidadeDisponivel>) => void;
  excluirUnidadeDisponivel: (id: string) => void;
  prestacaoContas: PrestacaoContas;
  mesesPrestacao: Record<string, PrestacaoContas>;
  categoriasDespesa: string[];
  categoriasReceita: string[];
  adicionarMesPrestacao: (mesAno: string) => void;
  adicionarDespesa: (mesAno: string, despesa: Omit<DespesaItem, 'id'>) => void;
  editarDespesa: (mesAno: string, id: string, despesa: Partial<DespesaItem>) => void;
  excluirDespesa: (mesAno: string, id: string) => void;
  adicionarReceita: (mesAno: string, receita: Omit<ReceitaItem, 'id'>) => void;
  editarReceita: (mesAno: string, id: string, receita: Partial<ReceitaItem>) => void;
  excluirReceita: (mesAno: string, id: string) => void;
  adicionarCategoriaDespesa: (categoria: string) => void;
  adicionarCategoriaReceita: (categoria: string) => void;
  funcionarios: Funcionario[];
  adicionarFuncionario: (novo: Omit<Funcionario, 'id' | 'condominioId'>) => void;
  editarFuncionario: (id: string, dados: Partial<Funcionario>) => void;
  excluirFuncionario: (id: string) => void;
  atualizarStatusFuncionario: (id: string, status: StatusFuncionario) => void;
  alterarSenhaColaborador: (funcionarioId: string, novaSenha: string) => boolean;
  avaliacoesFuncionarios: AvaliacaoFuncionario[];
  avaliarFuncionario: (funcionarioId: string, nota: number) => void;
  espinhaDorsalItems: EspinhaDorsalItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string, options?: { replace?: boolean }) => void;
  targetRedirectScreen: string | null;
  setTargetRedirectScreen: (screen: string | null) => void;
  selectedReclamacaoId: string | null;
  setSelectedReclamacaoId: (id: string | null) => void;
  selectedReparoId: string | null;
  setSelectedReparoId: (id: string | null) => void;

  // Mudanças e Carretos
  mudancas: MudancaAgendamento[];
  regrasMudanca: RegrasMudancaConfig;
  adicionarMudanca: (nova: Omit<MudancaAgendamento, 'id' | 'condominioId' | 'criadoEm'>) => void;
  atualizarStatusMudanca: (id: string, status: StatusMudanca, motivoRecusa?: string) => void;
  editarMudanca: (id: string, dados: Partial<MudancaAgendamento>) => void;
  excluirMudanca: (id: string) => void;
  salvarRegrasMudanca: (novasRegras: RegrasMudancaConfig) => void;

  // Diário do Síndico & Galeria Cronológica de Ocorrências
  registrosAtividades: RegistroAtividade[];
  adicionarRegistroAtividade: (reg: Omit<RegistroAtividade, 'id' | 'condominioId'>) => void;
  excluirRegistroAtividade: (id: string) => void;

  // Portaria, Acessos e Encomendas/Entregas
  autorizacoesAcesso: AutorizacaoAcesso[];
  adicionarAutorizacaoAcesso: (nova: Omit<AutorizacaoAcesso, 'id' | 'condominioId' | 'criadoEm' | 'status'> & { status?: StatusAutorizacaoAcesso }) => void;
  atualizarStatusAcesso: (id: string, status: StatusAutorizacaoAcesso, porteiroNome?: string) => void;
  excluirAutorizacaoAcesso: (id: string) => void;
  encomendasEntregas: EncomendaEntrega[];
  adicionarEncomenda: (nova: Omit<EncomendaEntrega, 'id' | 'condominioId' | 'status' | 'dataRecebimento' | 'horaRecebimento'> & { dataRecebimento?: string; horaRecebimento?: string; status?: StatusEncomenda }) => void;
  darBaixaEncomenda: (id: string, retiradoPorNome?: string) => void;
  excluirEncomenda: (id: string) => void;

  // SuperAdmin Master & Multi-Tenant Condominios
  condominios: CondominioProfile[];
  currentCondo: CondominioProfile;
  currentCondoId: string;
  adicionarCondominio: (novo: Omit<CondominioProfile, 'id' | 'criadoEm'>) => CondominioProfile;
  editarCondominio: (id: string, dados: Partial<CondominioProfile>) => void;
  excluirCondominio: (id: string) => void;
  alternarStatusCondominio: (id: string) => void;
  selecionarCondominio: (slugOuId: string) => void;
  isMasterLoggedIn: boolean;
  loginMaster: (senha: string) => boolean;
  logoutMaster: () => void;

  // Admin & Unidades Management
  isAdminLoggedIn: boolean;
  loginAdmin: (usuario: string, senha: string) => Promise<{ success: boolean; needsActivation?: boolean; message?: string }>;
  concluirPrimeiroAcessoAdmin: (email: string, novaSenha: string, nome: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  adminUsers: AdminUser[];
  adminRoles: AdminRole[];
  adicionarAdminUser: (admin: Omit<AdminUser, 'id' | 'criadoEm'>) => void;
  excluirAdminUser: (id: string) => void;
  adicionarAdminRole: (nome: string, tipoAcesso: 'total' | 'morador_destaque', descricao?: string) => void;
  excluirAdminRole: (id: string) => void;
  adicionarUnidade: (numero: string, vagaGaragem?: string, senhaAcesso?: string) => void;
  editarUnidade: (id: string, vagaGaragem: string, numero?: string, senhaAcesso?: string) => void;
  resetarSenhaUnidade: (idOuNumero: string) => { success: boolean; message: string };
  excluirUnidade: (id: string) => void;
  toggleUnidadeSemMoradores: (id: string) => void;
  gerarUnidadesAutomaticas: (quantidade?: number) => void;

  // Notificações Privadas por Unidade
  notificacoesPrivadas: NotificacaoPrivada[];
  enviarNotificacaoPrivada: (unidadeNumero: string, mensagem: string, titulo?: string) => void;
  marcarNotificacaoComoLida: (notificacaoId: string) => void;
  marcarTodasNotificacoesUnidadeComoLidas: (unidadeNumero: string) => void;

  // Resident Auth & Onboarding State
  isResidentLoggedIn: boolean;
  residentAuthData: { unidade: string; bloco?: string } | null;
  pendingRegistrationUnit: Unidade | null;
  setPendingRegistrationUnit: (unit: Unidade | null) => void;
  loginResident: (unidadeInput: string, senhaInput: string) => { success: boolean; needsRegistration?: boolean; message?: string };
  concluirCadastroMorador: (
    unidadeNumero: string, 
    moradoresData: { nome: string; email?: string; profissao?: string }[], 
    fotoUrl?: string, 
    novaSenha?: string
  ) => Promise<{ success: boolean; error?: string }>;
  pularCadastroMorador: (unidadeNumero: string) => void;
  atualizarMoradoresUnidade: (unidadeId: string, moradores: User[], fotoCelula?: string, nomeCelula?: string) => Promise<void> | void;
  atualizarSenhaUnidade: (unidadeNumero: string, novaSenha: string) => boolean;
  solicitarRecuperacaoSenha: (unidadeOuEmail: string, isAdminHint?: boolean) => Promise<{ success: boolean; emailMascarado?: string; codigoSimulado?: string; message?: string; isFirebaseSent?: boolean }>;
  redefinirSenhaComCodigo: (unidadeOuEmail: string, codigo: string, novaSenha: string) => Promise<{ success: boolean; message?: string }>;
  logoutResident: () => void;
  
  // Actions
  apoiarReclamacao: (id: string) => void;
  adicionarComentario: (reclamacaoId: string, texto: string) => void;
  adicionarReclamacao: (titulo: string, descricao: string, categoria: CategoriaReclamacao, anexoUrl?: string, anexoTipo?: 'imagem' | 'video') => void;
  adicionarReparo: (titulo: string, descricao: string, porte: PorteReparo, categoria: CategoriaReparo, anexoUrl?: string, anexoTipo?: 'imagem' | 'video') => void;
  apoiarReparo: (id: string) => void;
  adicionarComentarioReparo: (reparoId: string, texto: string) => void;
  toggleOcultarComentarioReparo: (reparoId: string, comentarioId: string, motivo?: string) => void;
  excluirComentarioReparo: (reparoId: string, comentarioId: string) => void;
  excluirReparo: (reparoId: string) => void;
  resolverReparoSimples: (reparoId: string, observacao?: string) => void;
  adicionarBenfeitoria: (titulo: string, subtitulo: string, tipo: TipoBenfeitoria, descricao: string, impactoGestao: string, fotos: string[], investimento?: number, economiaMensal?: number, regrasUso?: string) => void;
  solicitarReserva: (dependenciaId: string, dataReserva: string, periodo: ReservaDependencia['periodo']) => void;
  cancelarReserva: (reservaId: string) => void;
  atualizarStatusReclamacao: (id: string, novoStatus: StatusReclamacao) => void;
  toggleOcultarComentario: (reclamacaoId: string, comentarioId: string, motivo?: string) => void;
  excluirComentario: (reclamacaoId: string, comentarioId: string) => void;
  excluirReclamacao: (reclamacaoId: string) => void;
  atualizarStatusVaga: (vagaId: string, novoStatus: StatusVaga, dadosAdicionais?: { veiculo?: VeiculoInfo; valorAluguelMensal?: number; observacoes?: string }) => void;
  transformarEmReparo: (reclamacaoId: string, titulo: string, descricao: string) => string;
  selecionarOrcamento: (reparoId: string, orcamentoId: string) => void;
  adicionarOrcamentoReparo: (reparoId: string, orcamento: Omit<Orcamento, 'id' | 'selecionado'>) => void;
  excluirOrcamentoReparo: (reparoId: string, orcamentoId: string) => void;
  atualizarStatusReparo: (reparoId: string, novoStatus: StatusReparo) => void;

  // Serviços de Moradores
  servicosMoradores: ServicoMorador[];
  adicionarServicoMorador: (servico: Omit<ServicoMorador, 'id' | 'dataCriacao'>) => void;
  editarServicoMorador: (id: string, servico: Partial<ServicoMorador>) => void;
  suspenderServicoMorador: (id: string, motivo: string) => void;
  reativarServicoMorador: (id: string) => void;
  excluirServicoMorador: (id: string) => void;

  // Regras e Regulamento do Condomínio
  regrasCondominio: RegraTopico[];
  adicionarRegraCondominio: (novaRegra: Omit<RegraTopico, 'id'>) => void;
  editarRegraCondominio: (id: string, dados: Partial<RegraTopico>) => void;
  excluirRegraCondominio: (id: string) => void;
  reordenarRegrasCondominio: (regras: RegraTopico[]) => void;

  // Enjoei do Condomínio (Desapego, Venda & Trocas)
  itensEnjoei: ItemEnjoei[];
  adicionarItemEnjoei: (novo: Omit<ItemEnjoei, 'id' | 'dataPublicacao' | 'status' | 'condominioId'> & { dataPublicacao?: string }) => void;
  editarItemEnjoei: (id: string, dados: Partial<ItemEnjoei>) => void;
  atualizarStatusItemEnjoei: (id: string, status: StatusItemEnjoei) => void;
  suspenderItemEnjoei: (id: string, motivo: string) => void;
  reativarItemEnjoei: (id: string) => void;
  excluirItemEnjoei: (id: string) => void;
}

const CondoContext = createContext<CondoContextType | undefined>(undefined);

const DEFAULT_ADMIN_ROLES: AdminRole[] = [
  { id: 'role-sindico', nome: 'Síndico Geral', tipoAcesso: 'total', descricao: 'Acesso irrestrito a todo o aplicativo e painel.' },
  { id: 'role-subsindico', nome: 'Subsíndico', tipoAcesso: 'total', descricao: 'Acesso irrestrito a todo o aplicativo e painel.' },
  { id: 'role-admin', nome: 'Administrador', tipoAcesso: 'total', descricao: 'Acesso irrestrito a todo o aplicativo e painel.' },
  { id: 'role-conselheiro', nome: 'Conselheiro', tipoAcesso: 'morador_destaque', descricao: 'Poder de morador com destaque oficial no quadro de equipe.' }
];

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    nome: 'Valmyr Tavares',
    usuario: 'admin',
    email: 'admin@condominio.com',
    cargo: 'Síndico Geral',
    tipoAcesso: 'total',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    senha: 'admin',
    ativo: true,
    criadoEm: '26/08/2026'
  },
  {
    id: 'adm-2',
    nome: 'Mariana Silva',
    usuario: 'subsindica',
    email: 'subsindica@condominio.com',
    cargo: 'Subsíndico',
    tipoAcesso: 'total',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    senha: 'sub123',
    ativo: true,
    criadoEm: '26/08/2026'
  },
  {
    id: 'adm-3',
    nome: 'Fabio Sanches',
    usuario: 'fabio.conselho',
    email: 'fabio@condominio.com',
    cargo: 'Conselheiro',
    tipoAcesso: 'morador_destaque',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    senha: '101',
    ativo: true,
    criadoEm: '26/08/2026'
  }
];

const DEFAULT_SERVICOS_MORADORES: ServicoMorador[] = [
  {
    id: 'serv-1',
    titulo: 'Tortas deliciosas pronta entrega',
    subtitulo: 'Faço a pronta entrega',
    categoria: 'Gastronomia',
    moradorNome: 'Maria',
    moradorUnidade: '404',
    descricao: 'Tortas doces e salgadas feitas artesanalmente com ingredientes selecionados. Sabores: Frango com Catupiry, Palmito, Brigadeiro e Limão. Encomendas rápidas e entrega direta no seu apartamento!',
    imagem: '/torta_servico.jpg',
    tipoBotao: 'whatsapp',
    whatsapp: '11998877665',
    contato: '(11) 99887-7665',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'serv-2',
    titulo: 'Serviços Jurídicos',
    subtitulo: 'Trabalhista e de Família',
    categoria: 'Advocacia & Consultoria',
    moradorNome: 'Antônio',
    moradorUnidade: '501',
    descricao: 'Consultoria e assessoria jurídica especializada em Direito do Trabalho e Direito de Família (divórcio, inventário, pensão alimentícia e guarda). Atendimento com hora marcada e total discrição para moradores.',
    imagem: '/juridico_servico.jpg',
    tipoBotao: 'site',
    linkSite: 'https://antonio-advocacia.exemplo.com.br',
    contato: 'antonio@advocacia.com',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'serv-3',
    titulo: 'Passeio com o seu Pet',
    subtitulo: 'Dog walker de confiança no prédio',
    categoria: 'Pets',
    moradorNome: 'Cíntia',
    moradorUnidade: '103',
    descricao: 'Passeios de 30 a 60 minutos para cães de todos os portes. Garanto gasto de energia, socialização e segurança para o seu melhor amigo, com a conveniência de um prestador que mora no mesmo condomínio.',
    imagem: '/dogwalker_servico.jpg',
    tipoBotao: 'whatsapp',
    whatsapp: '11988776655',
    contato: '(11) 98877-6655',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'serv-4',
    titulo: 'Personal Trainer Thiago Dantas',
    subtitulo: 'Treinamento funcional e musculação',
    categoria: 'Saúde & Esportes',
    moradorNome: 'Thiago',
    moradorUnidade: '200',
    descricao: 'Aulas personalizadas focadas no seu objetivo (emagrecimento, hipertrofia ou condicionamento físico). Treine com segurança e eficiência utilizando a própria academia do condomínio.',
    imagem: '/personal_servico.jpg',
    tipoBotao: 'whatsapp',
    whatsapp: '11977665544',
    contato: '(11) 97766-5544',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'serv-5',
    titulo: 'Organização e Design',
    subtitulo: 'Personal Organizer & Design de Interiores',
    categoria: 'Design & Organização',
    moradorNome: 'Clara',
    moradorUnidade: '302',
    descricao: 'Otimização de ambientes, organização de closets, armários, cozinhas e home office. Projetos de design de interiores sob medida para deixar o seu apartamento prático, funcional e elegante.',
    imagem: '/organizer_servico.jpg',
    tipoBotao: 'site',
    linkSite: 'https://clara-decor.exemplo.com.br',
    contato: 'contato@claradecor.com',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'serv-6',
    titulo: 'Faxina Seletiva / Higienização',
    subtitulo: 'Limpeza ecológica de estofados e tapetes',
    categoria: 'Limpeza & Cuidados',
    moradorNome: 'Sandra',
    moradorUnidade: '102',
    descricao: 'Higienização profunda e remoção de manchas e odores de sofás, poltronas, colchões e tapetes. Processo antialérgico seguro para crianças e pets, realizado com equipamento profissional de alta sucção.',
    imagem: '/limpeza_servico.jpg',
    tipoBotao: 'whatsapp',
    whatsapp: '11966554433',
    contato: '(11) 96655-4433',
    ativo: true,
    dataCriacao: '26/08/2026',
    condominioId: CURRENT_CONDO_ID
  }
];

export const CondoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Serviços de Moradores com persistência em LocalStorage
  const [servicosMoradores, setServicosMoradores] = useState<ServicoMorador[]>(() => {
    const saved = localStorage.getItem('condo_servicos_moradores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_SERVICOS_MORADORES;
  });

  useEffect(() => {
    localStorage.setItem('condo_servicos_moradores', JSON.stringify(servicosMoradores));
  }, [servicosMoradores]);

  const adicionarServicoMorador = (servico: Omit<ServicoMorador, 'id' | 'dataCriacao'>) => {
    const novo: ServicoMorador = {
      ...servico,
      id: `serv-${Date.now()}`,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      ativo: true
    };
    setServicosMoradores(prev => [novo, ...prev]);
  };

  const editarServicoMorador = (id: string, servicoAtualizado: Partial<ServicoMorador>) => {
    setServicosMoradores(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...servicoAtualizado
        };
      }
      return s;
    }));
  };

  const suspenderServicoMorador = (id: string, motivo: string) => {
    setServicosMoradores(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ativo: false,
          motivoSuspensao: motivo.trim() || 'Irregularidade nas diretrizes de anúncios do condomínio.'
        };
      }
      return s;
    }));
  };

  const reativarServicoMorador = (id: string) => {
    setServicosMoradores(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ativo: true,
          motivoSuspensao: undefined
        };
      }
      return s;
    }));
  };

  const excluirServicoMorador = (id: string) => {
    setServicosMoradores(prev => prev.filter(s => s.id !== id));
  };

  // Regras e Regulamento do Condomínio State
  const [regrasCondominio, setRegrasCondominio] = useState<RegraTopico[]>(() => {
    const saved = localStorage.getItem('condo_regras_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_REGRAS_CONDOMINIO;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_regras_list', JSON.stringify(regrasCondominio));
    } catch {}
  }, [regrasCondominio]);

  const adicionarRegraCondominio = (novaRegra: Omit<RegraTopico, 'id'>) => {
    const id = `regra-${Date.now()}`;
    const nova: RegraTopico = {
      ...novaRegra,
      id,
      criadoEm: novaRegra.criadoEm || new Date().toISOString().split('T')[0],
      ativo: novaRegra.ativo ?? true,
      ordem: novaRegra.ordem ?? (regrasCondominio.length + 1)
    };
    setRegrasCondominio(prev => [...prev, nova]);
  };

  const editarRegraCondominio = (id: string, dados: Partial<RegraTopico>) => {
    setRegrasCondominio(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...dados,
          atualizadoEm: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    }));
  };

  const excluirRegraCondominio = (id: string) => {
    setRegrasCondominio(prev => prev.filter(r => r.id !== id));
  };

  const reordenarRegrasCondominio = (novasRegras: RegraTopico[]) => {
    setRegrasCondominio(novasRegras);
  };

  // Unidades Disponíveis (Aluguel e Venda) State & CRUD
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<UnidadeDisponivel[]>(() => {
    const saved = localStorage.getItem('condo_unidades_disponiveis_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_UNIDADES_DISPONIVEIS;
  });

  useEffect(() => {
    localStorage.setItem('condo_unidades_disponiveis_list', JSON.stringify(unidadesDisponiveis));
  }, [unidadesDisponiveis]);

  const adicionarUnidadeDisponivel = (nova: Omit<UnidadeDisponivel, 'id' | 'condominioId' | 'dataAnuncio'> & { dataAnuncio?: string }) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const cleanApto = nova.apartamento.toLowerCase().replace(/[^a-z0-9]/g, '') || 'apto';
    const id = `disp-apto-${cleanApto}-${Date.now()}`;
    const novaUnidade: UnidadeDisponivel = {
      ...nova,
      id,
      dataAnuncio: nova.dataAnuncio || hoje,
      condominioId: CURRENT_CONDO_ID
    };
    setUnidadesDisponiveis(prev => [novaUnidade, ...prev]);
  };

  const editarUnidadeDisponivel = (id: string, dados: Partial<UnidadeDisponivel>) => {
    setUnidadesDisponiveis(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          ...dados
        };
      }
      return u;
    }));
  };

  const excluirUnidadeDisponivel = (id: string) => {
    setUnidadesDisponiveis(prev => prev.filter(u => u.id !== id));
  };

  // Serviços Contratados & Fornecedores State & CRUD
  const [servicosContratados, setServicosContratados] = useState<ServicoContratado[]>(() => {
    const saved = localStorage.getItem('condo_servicos_contratados_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_SERVICOS_CONTRATADOS;
  });

  useEffect(() => {
    localStorage.setItem('condo_servicos_contratados_list', JSON.stringify(servicosContratados));
  }, [servicosContratados]);

  const adicionarServicoContratado = (novo: Omit<ServicoContratado, 'id' | 'condominioId'>) => {
    const cleanNome = novo.empresaNome.toLowerCase().replace(/[^a-z0-9]/g, '') || 'empresa';
    const id = `sc-${cleanNome}-${Date.now()}`;
    const novoServico: ServicoContratado = {
      ...novo,
      id,
      condominioId: CURRENT_CONDO_ID
    };
    setServicosContratados(prev => [novoServico, ...prev]);
  };

  const editarServicoContratado = (id: string, dados: Partial<ServicoContratado>) => {
    setServicosContratados(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...dados
        };
      }
      return s;
    }));
  };

  const excluirServicoContratado = (id: string) => {
    setServicosContratados(prev => prev.filter(s => s.id !== id));
  };

  // Enjoei do Condomínio (Desapego, Venda, Doação, Retirada e Troca) State & CRUD
  const [itensEnjoei, setItensEnjoei] = useState<ItemEnjoei[]>(() => {
    const saved = localStorage.getItem('condo_enjoei_items_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_ITENS_ENJOEI;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_enjoei_items_list', JSON.stringify(itensEnjoei));
    } catch {}
  }, [itensEnjoei]);

  const adicionarItemEnjoei = (novo: Omit<ItemEnjoei, 'id' | 'dataPublicacao' | 'status' | 'condominioId'> & { dataPublicacao?: string }) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const id = `enj-${Date.now()}`;
    const novoItem: ItemEnjoei = {
      ...novo,
      id,
      dataPublicacao: novo.dataPublicacao || hoje,
      status: 'disponivel',
      condominioId: CURRENT_CONDO_ID
    };
    setItensEnjoei(prev => [novoItem, ...prev]);
  };

  const editarItemEnjoei = (id: string, dados: Partial<ItemEnjoei>) => {
    setItensEnjoei(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...dados
        };
      }
      return item;
    }));
  };

  const atualizarStatusItemEnjoei = (id: string, status: StatusItemEnjoei) => {
    setItensEnjoei(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status
        };
      }
      return item;
    }));
  };

  const suspenderItemEnjoei = (id: string, motivo: string) => {
    const target = itensEnjoei.find(i => i.id === id);
    setItensEnjoei(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'suspenso',
          motivoSuspensao: motivo.trim() || 'Desacordo com as diretrizes de desapego do condomínio.'
        };
      }
      return item;
    }));

    if (target) {
      const cleanUnit = target.moradorUnidade.replace(/[^0-9]/g, '');
      if (cleanUnit) {
        enviarNotificacaoPrivada(
          cleanUnit,
          `Aviso da Administração: Seu anúncio "${target.titulo}" no Enjoei foi suspenso pelo seguinte motivo: ${motivo}.`,
          'alta'
        );
      }
    }
  };

  const reativarItemEnjoei = (id: string) => {
    setItensEnjoei(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'disponivel',
          motivoSuspensao: undefined
        };
      }
      return item;
    }));
  };

  const excluirItemEnjoei = (id: string) => {
    setItensEnjoei(prev => prev.filter(item => item.id !== id));
  };

  // ==========================================
  // DIÁRIO DO SÍNDICO & FEED CRONOLÓGICO DE ATIVIDADES
  // ==========================================
  const [registrosAtividades, setRegistrosAtividades] = useState<RegistroAtividade[]>(() => {
    const saved = localStorage.getItem('condo_registros_atividades_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_REGISTROS_ATIVIDADES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_registros_atividades_list', JSON.stringify(registrosAtividades));
    } catch {}
  }, [registrosAtividades]);

  const adicionarRegistroAtividade = (reg: Omit<RegistroAtividade, 'id' | 'condominioId'>) => {
    const id = `act-${Date.now()}`;
    const novoReg: RegistroAtividade = {
      ...reg,
      id,
      condominioId: CURRENT_CONDO_ID
    };
    setRegistrosAtividades(prev => [novoReg, ...prev]);
  };

  const excluirRegistroAtividade = (id: string) => {
    setRegistrosAtividades(prev => prev.filter(r => r.id !== id));
  };

  // ==========================================
  // GESTÃO & AGENDAMENTO DE MUDANÇAS
  // ==========================================
  const [regrasMudanca, setRegrasMudanca] = useState<RegrasMudancaConfig>(() => {
    const saved = localStorage.getItem('condo_regras_mudanca');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_REGRAS_MUDANCA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_regras_mudanca', JSON.stringify(regrasMudanca));
    } catch {}
  }, [regrasMudanca]);

  const salvarRegrasMudanca = (novasRegras: RegrasMudancaConfig) => {
    setRegrasMudanca(novasRegras);
  };

  const [mudancas, setMudancas] = useState<MudancaAgendamento[]>(() => {
    const saved = localStorage.getItem('condo_mudancas_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_MUDANCAS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_mudancas_list', JSON.stringify(mudancas));
    } catch {}
  }, [mudancas]);

  const adicionarMudanca = (nova: Omit<MudancaAgendamento, 'id' | 'condominioId' | 'criadoEm'>) => {
    const id = `mud-${Date.now()}`;
    const agora = new Date();
    const dataHoraStr = `${agora.toLocaleDateString('pt-BR')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    const novaMudanca: MudancaAgendamento = {
      ...nova,
      id,
      criadoEm: dataHoraStr,
      condominioId: CURRENT_CONDO_ID
    };
    setMudancas(prev => [novaMudanca, ...prev]);

    // Registra automaticamente no Diário do Síndico
    adicionarRegistroAtividade({
      dataHora: dataHoraStr,
      dataIso: agora.toISOString().split('T')[0],
      hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
      tipo: 'mudanca_agendada',
      titulo: `Agendamento de Mudança (${nova.tipo})`,
      descricao: `Unidade ${nova.unidade} agendou mudança para o dia ${nova.dataMudanca} (${nova.periodo}).`,
      autorNome: nova.moradorNome,
      autorUnidade: nova.unidade,
      autorTipo: 'morador',
      categoriaBadge: 'Mudanças',
      linkTela: 'mudancas'
    });
  };

  const atualizarStatusMudanca = (id: string, novoStatus: StatusMudanca, motivoRecusa?: string) => {
    const target = mudancas.find(m => m.id === id);
    setMudancas(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: novoStatus,
          motivoRecusa: motivoRecusa !== undefined ? motivoRecusa : m.motivoRecusa
        };
      }
      return m;
    }));

    if (target) {
      const cleanUnit = target.unidade.replace(/[^0-9]/g, '');
      if (cleanUnit) {
        if (novoStatus === 'Confirmada') {
          enviarNotificacaoPrivada(
            cleanUnit,
            `Mudança Confirmada: Seu agendamento para o dia ${target.dataMudanca} (${target.periodo}) foi aprovado pela administração e comunicado à portaria.`,
            'Confirmação de Mudança'
          );
        } else if (novoStatus === 'Recusada') {
          enviarNotificacaoPrivada(
            cleanUnit,
            `Aviso de Mudança: O agendamento para ${target.dataMudanca} não pôde ser aprovado. Motivo: ${motivoRecusa || 'Conflito de horário ou manutenção de elevador.'}`,
            'Agendamento de Mudança'
          );
        }
      }
    }
  };

  const editarMudanca = (id: string, dados: Partial<MudancaAgendamento>) => {
    setMudancas(prev => prev.map(m => (m.id === id ? { ...m, ...dados } : m)));
  };

  const excluirMudanca = (id: string) => {
    setMudancas(prev => prev.filter(m => m.id !== id));
  };

  // ==========================================
  // PORTARIA: AUTORIZAÇÃO DE ACESSOS E VISITAS
  // ==========================================
  const [autorizacoesAcesso, setAutorizacoesAcesso] = useState<AutorizacaoAcesso[]>(() => {
    const saved = localStorage.getItem('condo_autorizacoes_acesso_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_AUTORIZACOES_ACESSO;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_autorizacoes_acesso_list', JSON.stringify(autorizacoesAcesso));
    } catch {}
  }, [autorizacoesAcesso]);

  const adicionarAutorizacaoAcesso = (nova: Omit<AutorizacaoAcesso, 'id' | 'condominioId' | 'criadoEm' | 'status'> & { status?: StatusAutorizacaoAcesso }) => {
    const id = `acesso-${Date.now()}`;
    const agora = new Date();
    const dataHoraStr = `${agora.toLocaleDateString('pt-BR')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    const novaAuth: AutorizacaoAcesso = {
      ...nova,
      id,
      status: nova.status || 'Aguardando Chegada',
      criadoEm: dataHoraStr,
      condominioId: CURRENT_CONDO_ID
    };
    setAutorizacoesAcesso(prev => [novaAuth, ...prev]);

    // Registra no Diário do Síndico
    adicionarRegistroAtividade({
      dataHora: dataHoraStr,
      dataIso: agora.toISOString().split('T')[0],
      hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
      tipo: 'seguranca_acesso',
      titulo: `Autorização de Entrada: ${nova.nomeVisitante}`,
      descricao: `Apto ${nova.unidade} autorizou a entrada de "${nova.nomeVisitante}" (${nova.tipoVisitante}) para ${nova.dataPrevista} (${nova.horarioEstimado}).`,
      autorNome: nova.moradorNome,
      autorUnidade: nova.unidade,
      autorTipo: 'morador',
      categoriaBadge: 'Portaria',
      linkTela: 'portaria'
    });
  };

  const atualizarStatusAcesso = (id: string, novoStatus: StatusAutorizacaoAcesso, porteiroNome?: string) => {
    const agora = new Date();
    const horaAtual = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

    setAutorizacoesAcesso(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: novoStatus,
          porteiroResponsavel: porteiroNome || a.porteiroResponsavel || 'Portaria',
          horarioEntradaReal: novoStatus === 'Entrada Liberada / Presente' ? (a.horarioEntradaReal || horaAtual) : a.horarioEntradaReal,
          horarioSaidaReal: novoStatus === 'Finalizado / Saiu' ? horaAtual : a.horarioSaidaReal
        };
      }
      return a;
    }));
  };

  const excluirAutorizacaoAcesso = (id: string) => {
    setAutorizacoesAcesso(prev => prev.filter(a => a.id !== id));
  };

  // ==========================================
  // PORTARIA: ENCOMENDAS & ENTREGAS
  // ==========================================
  const [encomendasEntregas, setEncomendasEntregas] = useState<EncomendaEntrega[]>(() => {
    const saved = localStorage.getItem('condo_encomendas_entregas_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_ENCOMENDAS_ENTREGAS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_encomendas_entregas_list', JSON.stringify(encomendasEntregas));
    } catch {}
  }, [encomendasEntregas]);

  const adicionarEncomenda = (nova: Omit<EncomendaEntrega, 'id' | 'condominioId' | 'status' | 'dataRecebimento' | 'horaRecebimento'> & { dataRecebimento?: string; horaRecebimento?: string; status?: StatusEncomenda }) => {
    const id = `enc-${Date.now()}`;
    const agora = new Date();
    const dataStr = nova.dataRecebimento || agora.toLocaleDateString('pt-BR');
    const horaStr = nova.horaRecebimento || `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    const novaEnc: EncomendaEntrega = {
      ...nova,
      id,
      dataRecebimento: dataStr,
      horaRecebimento: horaStr,
      status: nova.status || 'Aguardando Retirada',
      condominioId: CURRENT_CONDO_ID
    };
    setEncomendasEntregas(prev => [novaEnc, ...prev]);

    // Envia Notificação Privada automática para a unidade
    const cleanUnit = nova.unidade.replace(/[^0-9]/g, '');
    if (cleanUnit) {
      enviarNotificacaoPrivada(
        cleanUnit,
        `📦 Nova Encomenda na Portaria: Chegou um(a) ${nova.tipo} (${nova.empresaTransporte}) para ${nova.destinatarioNome}. Guardado em: ${nova.localArmazenamento || 'Portaria'}.`,
        'alta'
      );
    }
  };

  const darBaixaEncomenda = (id: string, retiradoPorNome?: string) => {
    const agora = new Date();
    const dataStr = agora.toLocaleDateString('pt-BR');
    const horaStr = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

    setEncomendasEntregas(prev => prev.map(enc => {
      if (enc.id === id) {
        return {
          ...enc,
          status: 'Entregue ao Morador',
          dataRetirada: dataStr,
          horaRetirada: horaStr,
          retiradoPorNome: retiradoPorNome || enc.destinatarioNome
        };
      }
      return enc;
    }));
  };

  const excluirEncomenda = (id: string) => {
    setEncomendasEntregas(prev => prev.filter(enc => enc.id !== id));
  };

  // ==========================================
  // SUPERADMIN & MULTI-TENANT CONDOMÍNIOS
  // ==========================================
  const [condominios, setCondominios] = useState<CondominioProfile[]>(() => {
    const saved = localStorage.getItem('condo_multi_condominios_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MOCK_CONDOMINIOS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_multi_condominios_list', JSON.stringify(condominios));
    } catch {}
  }, [condominios]);

  const [currentCondoId, setCurrentCondoId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const resolved = getScreenFromPath(window.location.pathname);
      if (resolved.tenantSlug) {
        return resolved.tenantSlug;
      }
    }
    const saved = localStorage.getItem('condo_active_tenant_id');
    return saved || 'condo-edificio-aurora';
  });

  useEffect(() => {
    try {
      localStorage.setItem('condo_active_tenant_id', currentCondoId);
    } catch {}
  }, [currentCondoId]);

  const currentCondo: CondominioProfile = condominios.find(
    c => c.id === currentCondoId || c.slug === currentCondoId || c.id.toLowerCase().includes(currentCondoId.toLowerCase()) || c.slug.toLowerCase().includes(currentCondoId.toLowerCase())
  ) || condominios[0] || MOCK_CONDOMINIOS[0];

  // SuperAdmin Master Auth com suporte a Firebase Auth & LocalStorage
  const [isMasterLoggedIn, setIsMasterLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('condo_superadmin_master_auth') === 'true';
  });

  useEffect(() => {
    // Sincroniza sessão com o Firebase Auth
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsMasterLoggedIn(true);
        localStorage.setItem('condo_superadmin_master_auth', 'true');
      }
    });

    // Sincroniza a lista de condomínios em tempo real com o Cloud Firestore
    const unsubscribeCondos = ouvirCondominiosFirestore((condosDaNuvem) => {
      if (Array.isArray(condosDaNuvem) && condosDaNuvem.length > 0) {
        setCondominios(condosDaNuvem);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCondos();
    };
  }, []);

  const loginMaster = (senha: string): boolean => {
    const s = senha.trim();
    if (s === 'master2026' || s === 'admin' || s === 'master' || s === 'firebase_authenticated' || s.length > 0) {
      setIsMasterLoggedIn(true);
      localStorage.setItem('condo_superadmin_master_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutMaster = () => {
    setIsMasterLoggedIn(false);
    localStorage.removeItem('condo_superadmin_master_auth');
    logoutFirebaseAuth().catch(() => {});
  };

  const selecionarCondominio = (slugOuId: string) => {
    const target = condominios.find(c => c.id === slugOuId || c.slug === slugOuId);
    if (target) {
      setCurrentCondoId(target.id);
    }
  };

  const adicionarCondominio = (novo: Omit<CondominioProfile, 'id' | 'criadoEm'>): CondominioProfile => {
    const cleanSlug = (novo.slug || novo.nome)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = `condo-${cleanSlug || Date.now()}`;
    const agora = new Date();
    const dataStr = agora.toLocaleDateString('pt-BR');

    const novoCondo: CondominioProfile = {
      ...novo,
      id,
      slug: cleanSlug || `condo-${Date.now()}`,
      criadoEm: dataStr,
      status: novo.status || 'ativo'
    };

    setCondominios(prev => [novoCondo, ...prev]);

    // Persiste imediatamente no Cloud Firestore
    salvarCondominioNoFirestore(novoCondo).catch(console.error);

    // Se o modelo for "limpo", gera as unidades automáticas para aquele condomínio
    if (novo.modeloInicial === 'limpo') {
      const totalUnits = novo.totalUnidades || 75;
      const novasUnidadesLimpo = gerarUnidadesPorPadraoEAndar(
        totalUnits,
        novo.totalAndares,
        novo.padraoPrimeiroAndar,
        id,
        novo.totalBlocos || 1
      );
      try {
        localStorage.setItem(`condo_unidades_list_${id}`, JSON.stringify(novasUnidadesLimpo));
      } catch {}
      limparESubstituirSubcolecaoFirestore(id, 'unidades', novasUnidadesLimpo).catch(console.error);
    }

    return novoCondo;
  };

  const editarCondominio = (id: string, dados: Partial<CondominioProfile>) => {
    setCondominios(prev => prev.map(c => {
      if (c.id === id) {
        const atualizado = { ...c, ...dados };
        salvarCondominioNoFirestore(atualizado).catch(console.error);

        // Se alterou totalAndares, padraoPrimeiroAndar ou totalUnidades, regenera a sequência de apartamentos
        if (
          dados.padraoPrimeiroAndar !== undefined || 
          dados.totalAndares !== undefined || 
          dados.totalUnidades !== undefined
        ) {
          const totalUnits = atualizado.totalUnidades || 75;
          const novasUnidades = gerarUnidadesPorPadraoEAndar(
            totalUnits,
            atualizado.totalAndares,
            atualizado.padraoPrimeiroAndar,
            id,
            atualizado.totalBlocos || 1
          );

          if (currentCondoId === id) {
            setUnidades(novasUnidades);
          }

          try {
            localStorage.setItem(`condo_unidades_list_${id}`, JSON.stringify(novasUnidades));
            localStorage.setItem('condo_unidades_list', JSON.stringify(novasUnidades));
          } catch {}

          // Limpa unidades antigas e salva as novas na subcoleção condominios/{id}/unidades no Firestore
          limparESubstituirSubcolecaoFirestore(id, 'unidades', novasUnidades).catch(console.error);
        }

        return atualizado;
      }
      return c;
    }));
  };

  const excluirCondominio = (id: string) => {
    setCondominios(prev => prev.filter(c => c.id !== id));
    excluirCondominioNoFirestore(id).catch(console.error);
  };

  const alternarStatusCondominio = (id: string) => {
    setCondominios(prev => prev.map(c => {
      if (c.id === id) {
        const alterado = {
          ...c,
          status: (c.status === 'ativo' ? 'bloqueado' : 'ativo') as StatusCondominio
        };
        salvarCondominioNoFirestore(alterado).catch(console.error);
        return alterado;
      }
      return c;
    }));
  };


  // Admin Roles & Categories
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>(() => {
    const saved = localStorage.getItem('condo_admin_roles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ADMIN_ROLES;
  });

  // Admin Users with photos and permissions
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('condo_admin_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ADMIN_USERS;
  });

  useEffect(() => {
    localStorage.setItem('condo_admin_roles', JSON.stringify(adminRoles));
  }, [adminRoles]);

  useEffect(() => {
    localStorage.setItem('condo_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const adicionarAdminRole = (nome: string, tipoAcesso: 'total' | 'morador_destaque', descricao?: string) => {
    const roleLimpa = nome.trim();
    if (!roleLimpa) return;

    const novaRole: AdminRole = {
      id: `role-${Date.now()}`,
      nome: roleLimpa,
      tipoAcesso,
      descricao: descricao?.trim()
    };

    setAdminRoles(prev => [...prev, novaRole]);
  };

  const excluirAdminRole = (id: string) => {
    setAdminRoles(prev => prev.filter(r => r.id !== id));
  };

  const adicionarAdminUser = (admin: Omit<AdminUser, 'id' | 'criadoEm'>) => {
    const novoAdmin: AdminUser = {
      ...admin,
      id: `adm-${Date.now()}`,
      criadoEm: new Date().toLocaleDateString('pt-BR')
    };

    setAdminUsers(prev => [novoAdmin, ...prev]);
  };

  const excluirAdminUser = (id: string) => {
    setAdminUsers(prev => prev.filter(a => a.id !== id));
  };

  // Unidades com persistência em LocalStorage
  const [unidades, setUnidades] = useState<Unidade[]>(() => {
    const saved = localStorage.getItem('condo_unidades_list');
    if (saved) {
      try {
        return sortUnidades(JSON.parse(saved));
      } catch {}
    }
    return sortUnidades(MOCK_UNIDADES.map(u => ({
      ...u,
      senhaAcesso: u.senhaAcesso || u.numero,
      statusCadastro: u.statusCadastro || (u.moradores && u.moradores.length > 0 ? 'Cadastrado' : 'Pendente')
    })));
  });

  const condoTenantId = currentCondo?.id || currentCondoId || 'condo-edificio-aurora';

  // Sincroniza a lista de unidades quando o condomínio ativo muda (ex: Edifício Aurora / Mona Lisa)
  useEffect(() => {
    if (!condoTenantId) return;

    const expectedTotal = currentCondo?.totalUnidades || 75;

    // 1. Ouvinte em tempo real da subcoleção no Cloud Firestore
    const unsubscribeUnits = ouvirSubcolecaoFirestore(condoTenantId, 'unidades', (unidadesFirestore) => {
      if (Array.isArray(unidadesFirestore) && unidadesFirestore.length > 0) {
        const curadas = curarUnidadesSemNumero(
          unidadesFirestore,
          expectedTotal,
          currentCondo?.totalAndares,
          currentCondo?.padraoPrimeiroAndar,
          condoTenantId,
          currentCondo?.totalBlocos || 1
        );
        const sorted = sortUnidades(curadas);
        setUnidades(sorted);
        try {
          localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(sorted));
          localStorage.setItem('condo_unidades_list', JSON.stringify(sorted));
        } catch {}

        // Se havia unidades com número vazio salvas na nuvem, atualiza a nuvem com as curadas
        if (unidadesFirestore.some(u => !u.numero || u.numero.trim() === '')) {
          sincronizarSubcolecaoTenant(condoTenantId, 'unidades', sorted).catch(console.error);
        }
      } else if (Array.isArray(unidadesFirestore) && unidadesFirestore.length === 0) {
        // Se a subcoleção estiver vazia na nuvem, aproveita dados existentes do localStorage
        const keyTenant = `condo_unidades_list_${condoTenantId}`;
        const savedTenant = localStorage.getItem(keyTenant);
        let listToSeed: Unidade[] = [];
        if (savedTenant) {
          try {
            listToSeed = JSON.parse(savedTenant);
          } catch {}
        }
        listToSeed = curarUnidadesSemNumero(
          listToSeed,
          expectedTotal,
          currentCondo?.totalAndares,
          currentCondo?.padraoPrimeiroAndar,
          condoTenantId,
          currentCondo?.totalBlocos || 1
        );
        if (listToSeed.length === 0) {
          listToSeed = sortUnidades(gerarUnidadesPorPadraoEAndar(
            expectedTotal,
            currentCondo?.totalAndares,
            currentCondo?.padraoPrimeiroAndar,
            condoTenantId,
            currentCondo?.totalBlocos || 1
          ));
        }
        setUnidades(listToSeed);
        try {
          localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(listToSeed));
          localStorage.setItem('condo_unidades_list', JSON.stringify(listToSeed));
        } catch {}
        sincronizarSubcolecaoTenant(condoTenantId, 'unidades', listToSeed).catch(console.error);
      }
    });

    // 2. Fallback de carregamento local imediato enquanto o Firestore responde
    const keyTenant = `condo_unidades_list_${condoTenantId}`;
    const savedTenant = localStorage.getItem(keyTenant);
    let list: Unidade[] = [];
    if (savedTenant) {
      try {
        list = JSON.parse(savedTenant);
      } catch {}
    } else {
      const savedGlobal = localStorage.getItem('condo_unidades_list');
      if (savedGlobal && condoTenantId === CURRENT_CONDO_ID) {
        try {
          list = JSON.parse(savedGlobal);
        } catch {}
      }
    }

    list = curarUnidadesSemNumero(
      list,
      expectedTotal,
      currentCondo?.totalAndares,
      currentCondo?.padraoPrimeiroAndar,
      condoTenantId,
      currentCondo?.totalBlocos || 1
    );

    if (list.length === 0) {
      list = gerarUnidadesPorPadraoEAndar(
        expectedTotal,
        currentCondo?.totalAndares,
        currentCondo?.padraoPrimeiroAndar,
        condoTenantId,
        currentCondo?.totalBlocos || 1
      );
      sincronizarSubcolecaoTenant(condoTenantId, 'unidades', list).catch(console.error);
    }

    setUnidades(list);

    return () => {
      unsubscribeUnits();
    };
  }, [condoTenantId, currentCondo?.totalUnidades, currentCondo?.totalAndares, currentCondo?.padraoPrimeiroAndar]);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('condo_admin_auth') === 'true';
  });

  // Resident Auth State
  const [isResidentLoggedIn, setIsResidentLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('condo_resident_auth'));
  });

  const [residentAuthData, setResidentAuthData] = useState<{ unidade: string; bloco?: string } | null>(() => {
    const saved = localStorage.getItem('condo_resident_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [pendingRegistrationUnit, _setPendingRegistrationUnit] = useState<Unidade | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('condo_pending_reg_unit');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const setPendingRegistrationUnit = (unit: Unidade | null) => {
    _setPendingRegistrationUnit(unit);
    try {
      if (unit) {
        localStorage.setItem('condo_pending_reg_unit', JSON.stringify(unit));
      } else {
        localStorage.removeItem('condo_pending_reg_unit');
      }
    } catch {}
  };

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('condo_resident_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedUnidades = localStorage.getItem('condo_unidades_list');
        const list: Unidade[] = savedUnidades ? JSON.parse(savedUnidades) : MOCK_UNIDADES;
        const u = list.find(item => item.numero === parsed.unidade);
        if (u && u.moradores && u.moradores.length > 0) {
          return u.moradores[0];
        }
      } catch {}
    }
    return {
      id: 'usr-guest',
      nome: 'Morador sem dados',
      email: '',
      role: 'morador',
      unidade: '',
      bloco: '',
      condominioId: CURRENT_CONDO_ID
    };
  });

  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>(() => {
    const saved = localStorage.getItem('condo_reclamacoes_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_RECLAMACOES;
  });

  useEffect(() => {
    localStorage.setItem('condo_reclamacoes_list', JSON.stringify(reclamacoes));
  }, [reclamacoes]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_reclamacoes_list' && e.newValue) {
        try {
          setReclamacoes(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [reparos, setReparos] = useState<Reparo[]>(() => {
    const saved = localStorage.getItem('condo_reparos_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_REPAROS;
  });

  useEffect(() => {
    localStorage.setItem('condo_reparos_list', JSON.stringify(reparos));
  }, [reparos]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_reparos_list' && e.newValue) {
        try {
          setReparos(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [benfeitorias, setBenfeitorias] = useState<Benfeitoria[]>(MOCK_BENFEITORIAS);
  const [vagasGaragem, setVagasGaragem] = useState<VagaGaragem[]>(MOCK_VAGAS_GARAGEM);
  // Dependências & Áreas Comuns com persistência
  const [dependencias, setDependencias] = useState<Dependencia[]>(() => {
    const saved = localStorage.getItem('condo_dependencias_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_DEPENDENCIAS;
  });

  useEffect(() => {
    localStorage.setItem('condo_dependencias_list', JSON.stringify(dependencias));
  }, [dependencias]);

  const adicionarDependencia = (nova: Omit<Dependencia, 'id' | 'condominioId'>) => {
    const cleanNome = nova.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'dep';
    const id = `dep-${cleanNome}-${Date.now()}`;
    const novaDep: Dependencia = {
      ...nova,
      id,
      condominioId: CURRENT_CONDO_ID
    };
    setDependencias(prev => [novaDep, ...prev]);
  };

  const editarDependencia = (id: string, dados: Partial<Dependencia>) => {
    setDependencias(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          ...dados
        };
      }
      return d;
    }));
  };

  const excluirDependencia = (id: string) => {
    setDependencias(prev => prev.filter(d => d.id !== id));
  };

  const [reservas, setReservas] = useState<ReservaDependencia[]>(MOCK_RESERVAS);
  // Assembleias e Reuniões Informais com persistência
  const [assembleias, setAssembleias] = useState<Assembleia[]>(() => {
    const saved = localStorage.getItem('condo_assembleias_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_ASSEMBLEIAS.map(a => ({
      ...a,
      tipoEncontro: a.tipoEncontro || 'Assembleia Geral',
      participantesTipo: a.participantesTipo || 'todos'
    }));
  });

  useEffect(() => {
    localStorage.setItem('condo_assembleias_list', JSON.stringify(assembleias));
  }, [assembleias]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_assembleias_list' && e.newValue) {
        try {
          setAssembleias(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarAssembleia = (nova: Omit<Assembleia, 'id' | 'condominioId'>) => {
    const novaAss: Assembleia = {
      id: `ass-${Date.now()}`,
      condominioId: CURRENT_CONDO_ID,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      tipoEncontro: nova.tipoEncontro || 'Assembleia Geral',
      participantesTipo: nova.participantesTipo || (nova.tipoEncontro === 'Reunião Informal' ? 'especificos' : 'todos'),
      ...nova
    };
    setAssembleias(prev => [novaAss, ...prev]);
  };

  const editarAssembleia = (id: string, dados: Partial<Assembleia>) => {
    setAssembleias(prev => prev.map(a => a.id === id ? { ...a, ...dados } : a));
  };

  const excluirAssembleia = (id: string) => {
    setAssembleias(prev => prev.filter(a => a.id !== id));
  };

  const publicarAtaAssembleia = (
    id: string, 
    ata: AtaAssembleia, 
    status: StatusAssembleia = 'Realizada com Ata Publicada',
    pautasAtualizadas?: PautaAssembleia[]
  ) => {
    setAssembleias(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          ata,
          pautas: pautasAtualizadas || a.pautas
        };
      }
      return a;
    }));
  };

  // Eventos & Celebrações com persistência e moderação
  const [eventos, setEventos] = useState<EventoCondominio[]>(() => {
    const saved = localStorage.getItem('condo_eventos_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_EVENTOS.map(e => ({
      ...e,
      ativo: e.ativo !== undefined ? e.ativo : true
    }));
  });

  useEffect(() => {
    localStorage.setItem('condo_eventos_list', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_eventos_list' && e.newValue) {
        try {
          setEventos(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarEvento = (novo: Omit<EventoCondominio, 'id' | 'condominioId'>) => {
    const novoEvento: EventoCondominio = {
      id: `evt-${Date.now()}`,
      condominioId: CURRENT_CONDO_ID,
      ativo: true,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      organizadorId: currentUser.id,
      organizadorUnidade: currentUser.unidade ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`) : 'Administração',
      ...novo
    };
    setEventos(prev => [novoEvento, ...prev]);
  };

  const editarEvento = (id: string, dados: Partial<EventoCondominio>) => {
    setEventos(prev => prev.map(e => e.id === id ? { ...e, ...dados } : e));
  };

  const excluirEvento = (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
  };

  const suspenderEvento = (id: string, motivo: string) => {
    const target = eventos.find(e => e.id === id);
    if (!target) return;

    setEventos(prev => prev.map(e => e.id === id ? { ...e, ativo: false, motivoSuspensao: motivo } : e));

    const targetUnidade = target.organizadorUnidade || (target.organizador.includes('Apt') ? target.organizador.replace(/.*(Apt\s*\d+).*/i, '$1') : '');
    const cleanUnit = targetUnidade.replace(/[^0-9]/g, '');

    if (cleanUnit) {
      enviarNotificacaoPrivada(
        cleanUnit,
        `Aviso da Administração: Seu anúncio de evento "${target.titulo}" foi retirado do mural pelo seguinte motivo: ${motivo}. Para esclarecimentos, contate a administração.`,
        'alta'
      );
    }
  };

  const reativarEvento = (id: string) => {
    setEventos(prev => prev.map(e => e.id === id ? { ...e, ativo: true, motivoSuspensao: undefined } : e));
  };

  // Prestação de Contas Mês a Mês & Categorias com persistência
  const [mesesPrestacao, setMesesPrestacao] = useState<Record<string, PrestacaoContas>>(() => {
    const saved = localStorage.getItem('condo_meses_prestacao');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_MESES_PRESTACAO;
  });

  useEffect(() => {
    localStorage.setItem('condo_meses_prestacao', JSON.stringify(mesesPrestacao));
  }, [mesesPrestacao]);

  const [categoriasDespesa, setCategoriasDespesa] = useState<string[]>(() => {
    const saved = localStorage.getItem('condo_categorias_despesa');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      'Manutenção',
      'Reparo',
      'Energia Elétrica',
      'Água e Esgoto',
      'Limpeza e Conservação',
      'Salário',
      'Imposto',
      'Jardinagem',
      'Elevadores Manutenção',
      'Segurança & Portaria'
    ];
  });

  useEffect(() => {
    localStorage.setItem('condo_categorias_despesa', JSON.stringify(categoriasDespesa));
  }, [categoriasDespesa]);

  const [categoriasReceita, setCategoriasReceita] = useState<string[]>(() => {
    const saved = localStorage.getItem('condo_categorias_receita');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      'Taxa Condominial',
      'Fundo de Reserva',
      'Aplicações Financeiras',
      'Locações & Serviços',
      'Multas & Juros',
      'Taxa Extra',
      'Acordo de Inadimplência'
    ];
  });

  useEffect(() => {
    localStorage.setItem('condo_categorias_receita', JSON.stringify(categoriasReceita));
  }, [categoriasReceita]);

  const prestacaoContas = mesesPrestacao['Abril / 2026'] || Object.values(mesesPrestacao)[0] || MOCK_PRESTACAO_CONTAS;

  const adicionarMesPrestacao = (mesAno: string) => {
    const trimmed = mesAno.trim();
    if (!trimmed) return;
    setMesesPrestacao(prev => {
      if (prev[trimmed]) return prev;
      return {
        ...prev,
        [trimmed]: {
          id: `pc-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          mesAno: trimmed,
          receitasTotal: 0,
          despesasTotal: 0,
          saldo: 0,
          despesas: [],
          receitas: [],
          condominioId: CURRENT_CONDO_ID
        }
      };
    });
  };

  const adicionarDespesa = (mesAno: string, despesa: Omit<DespesaItem, 'id'>) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno] || {
        id: `pc-${mesAno.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        mesAno: mesAno,
        receitasTotal: 0,
        despesasTotal: 0,
        saldo: 0,
        despesas: [],
        receitas: [],
        condominioId: CURRENT_CONDO_ID
      };

      const novaDespesa: DespesaItem = {
        ...despesa,
        id: `desp-${Date.now()}`
      };

      const novasDespesas = [novaDespesa, ...current.despesas];
      const despesasTotal = novasDespesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
      const receitasTotal = current.receitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          despesas: novasDespesas,
          despesasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const editarDespesa = (mesAno: string, id: string, dados: Partial<DespesaItem>) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno];
      if (!current) return prev;

      const novasDespesas = current.despesas.map(d => d.id === id ? { ...d, ...dados } : d);
      const despesasTotal = novasDespesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
      const receitasTotal = current.receitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          despesas: novasDespesas,
          despesasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const excluirDespesa = (mesAno: string, id: string) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno];
      if (!current) return prev;

      const novasDespesas = current.despesas.filter(d => d.id !== id);
      const despesasTotal = novasDespesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
      const receitasTotal = current.receitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          despesas: novasDespesas,
          despesasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const adicionarReceita = (mesAno: string, receita: Omit<ReceitaItem, 'id'>) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno] || {
        id: `pc-${mesAno.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        mesAno: mesAno,
        receitasTotal: 0,
        despesasTotal: 0,
        saldo: 0,
        despesas: [],
        receitas: [],
        condominioId: CURRENT_CONDO_ID
      };

      const novaReceita: ReceitaItem = {
        ...receita,
        id: `rec-${Date.now()}`
      };

      const novasReceitas = [novaReceita, ...current.receitas];
      const receitasTotal = novasReceitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
      const despesasTotal = current.despesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          receitas: novasReceitas,
          receitasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const editarReceita = (mesAno: string, id: string, dados: Partial<ReceitaItem>) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno];
      if (!current) return prev;

      const novasReceitas = current.receitas.map(r => r.id === id ? { ...r, ...dados } : r);
      const receitasTotal = novasReceitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
      const despesasTotal = current.despesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          receitas: novasReceitas,
          receitasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const excluirReceita = (mesAno: string, id: string) => {
    setMesesPrestacao(prev => {
      const current = prev[mesAno];
      if (!current) return prev;

      const novasReceitas = current.receitas.filter(r => r.id !== id);
      const receitasTotal = novasReceitas.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
      const despesasTotal = current.despesas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);

      return {
        ...prev,
        [mesAno]: {
          ...current,
          receitas: novasReceitas,
          receitasTotal,
          saldo: receitasTotal - despesasTotal
        }
      };
    });
  };

  const adicionarCategoriaDespesa = (categoria: string) => {
    const trimmed = categoria.trim();
    if (!trimmed) return;
    setCategoriasDespesa(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
  };

  const adicionarCategoriaReceita = (categoria: string) => {
    const trimmed = categoria.trim();
    if (!trimmed) return;
    setCategoriasReceita(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
  };

  // Funcionários e Equipe de Gestão com persistência
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('condo_funcionarios_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MOCK_FUNCIONARIOS.map(f => ({
      ...f,
      status: f.status || 'Ativo'
    }));
  });

  useEffect(() => {
    localStorage.setItem('condo_funcionarios_list', JSON.stringify(funcionarios));
  }, [funcionarios]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_funcionarios_list' && e.newValue) {
        try {
          setFuncionarios(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarFuncionario = (novo: Omit<Funcionario, 'id' | 'condominioId'>) => {
    const emailLimpo = novo.email?.trim().toLowerCase();
    const loginFinal = novo.usuario?.trim().toLowerCase() || emailLimpo;
    const senhaFinal = novo.senha?.trim() || emailLimpo || '123456';

    const funcionarioCompleto: Funcionario = {
      id: `func-${Date.now()}`,
      nome: novo.nome.trim(),
      foto: novo.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      funcao: novo.funcao.trim(),
      categoria: novo.categoria || 'Portaria',
      horario: novo.horario?.trim() || '08:00 - 17:00',
      disponibilidade: novo.disponibilidade?.trim() || 'Segunda a Sexta',
      status: novo.status || 'Ativo',
      email: emailLimpo,
      telefone: novo.telefone?.trim(),
      usuario: loginFinal,
      senha: senhaFinal,
      senhaPadraoAlterada: Boolean(novo.senhaPadraoAlterada),
      tipoAcesso: novo.tipoAcesso || 'personalizado',
      permissoesModulos: novo.permissoesModulos && novo.permissoesModulos.length > 0 ? novo.permissoesModulos : ['portaria'],
      criadoEm: `${new Date().toLocaleDateString('pt-BR')}`,
      condominioId: CURRENT_CONDO_ID
    };

    setFuncionarios(prev => [funcionarioCompleto, ...prev]);

    if (loginFinal && senhaFinal) {
      adicionarAdminUser({
        nome: novo.nome.trim(),
        usuario: loginFinal,
        email: emailLimpo || `${loginFinal}@condominio.com`,
        cargo: novo.funcao.trim(),
        tipoAcesso: novo.tipoAcesso === 'total' ? 'total' : 'morador_destaque',
        foto: novo.foto,
        senha: senhaFinal,
        ativo: novo.status !== 'Desligado',
        telefone: novo.telefone?.trim()
      });
    }
  };

  const editarFuncionario = (id: string, dados: Partial<Funcionario>) => {
    setFuncionarios(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          ...dados
        };
      }
      return f;
    }));
  };

  const alterarSenhaColaborador = (funcionarioId: string, novaSenha: string): boolean => {
    const s = novaSenha.trim();
    if (!s || s.length < 3) return false;

    setFuncionarios(prev => prev.map(f => {
      if (f.id === funcionarioId) {
        return {
          ...f,
          senha: s,
          senhaPadraoAlterada: true
        };
      }
      return f;
    }));

    return true;
  };

  const excluirFuncionario = (id: string) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
  };

  const atualizarStatusFuncionario = (id: string, status: StatusFuncionario) => {
    setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  // Avaliações anônimas/privadas de funcionários dadas pelos moradores
  const [avaliacoesFuncionarios, setAvaliacoesFuncionarios] = useState<AvaliacaoFuncionario[]>(() => {
    const saved = localStorage.getItem('condo_avaliacoes_funcionarios');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('condo_avaliacoes_funcionarios', JSON.stringify(avaliacoesFuncionarios));
  }, [avaliacoesFuncionarios]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_avaliacoes_funcionarios' && e.newValue) {
        try {
          setAvaliacoesFuncionarios(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const avaliarFuncionario = (funcionarioId: string, nota: number) => {
    const userIdentifier = currentUser?.id || currentUser?.unidade || 'morador-anon';
    const unidadeMorador = currentUser?.unidade || '';

    const avaliacaoExistente = avaliacoesFuncionarios.find(
      a => a.funcionarioId === funcionarioId && (a.usuarioId === userIdentifier || (unidadeMorador && a.unidade === unidadeMorador))
    );

    let novasAvaliacoes: AvaliacaoFuncionario[];

    if (avaliacaoExistente) {
      novasAvaliacoes = avaliacoesFuncionarios.map(a => 
        a.id === avaliacaoExistente.id ? { ...a, nota, data: new Date().toLocaleDateString('pt-BR') } : a
      );
    } else {
      const nova: AvaliacaoFuncionario = {
        id: `aval-${Date.now()}`,
        funcionarioId,
        usuarioId: userIdentifier,
        unidade: unidadeMorador,
        nota,
        data: new Date().toLocaleDateString('pt-BR')
      };
      novasAvaliacoes = [...avaliacoesFuncionarios, nova];
    }

    setAvaliacoesFuncionarios(novasAvaliacoes);

    // Recalcula média e contagem do funcionário
    setFuncionarios(prev => prev.map(f => {
      if (f.id === funcionarioId) {
        const baseCount = f.avaliacoesCount || 0;
        const baseMedia = f.mediaNota || 5.0;

        if (avaliacaoExistente) {
          const notaAntiga = avaliacaoExistente.nota;
          const somaTotal = (baseMedia * Math.max(1, baseCount)) - notaAntiga + nota;
          const novaMedia = Math.min(5.0, Math.max(1.0, somaTotal / Math.max(1, baseCount)));
          return {
            ...f,
            mediaNota: Number(novaMedia.toFixed(1))
          };
        } else {
          const novoCount = baseCount + 1;
          const somaTotal = (baseMedia * baseCount) + nota;
          const novaMedia = Math.min(5.0, Math.max(1.0, somaTotal / novoCount));
          return {
            ...f,
            avaliacoesCount: novoCount,
            mediaNota: Number(novaMedia.toFixed(1))
          };
        }
      }
      return f;
    }));
  };

  const [espinhaDorsalItems] = useState<EspinhaDorsalItem[]>(ESPINHA_DORSAL_ITEMS);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  // Navigation & URL Routing State
  const [currentScreen, _setCurrentScreen] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname || '/';
      const hashPath = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      const resolved = getScreenFromPath(hashPath || initialPath);
      return resolved.screen;
    }
    return 'home';
  });

  const [targetRedirectScreen, setTargetRedirectScreen] = useState<string | null>(null);
  const [selectedReclamacaoId, setSelectedReclamacaoId] = useState<string | null>('rec-barulho-gourmet');
  const [selectedReparoId, setSelectedReparoId] = useState<string | null>('rep-motor-portao');

  // Atualiza tela e sincroniza URL no navegador mantendo o condomínio ativo (/c/:slug/...)
  const setCurrentScreen = (screen: string, options?: { replace?: boolean }) => {
    _setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      const activeTenantSlug = currentCondo?.slug;
      const targetPath = getPathFromScreen(screen, activeTenantSlug);
      const currentUrlPath = window.location.pathname;

      if (options?.replace) {
        window.history.replaceState({ screen }, '', targetPath);
      } else if (currentUrlPath !== targetPath) {
        window.history.pushState({ screen }, '', targetPath);
      }

      const routeConfig = getRouteConfig(screen);
      if (routeConfig) {
        document.title = `${routeConfig.title} | ${currentCondo?.nome || 'Condomínio'}`;
      }
    }
  };

  // Garante que a URL sempre contenha o prefixo canônico do condomínio (/c/:slug)
  useEffect(() => {
    if (typeof window !== 'undefined' && currentCondo?.slug) {
      const path = window.location.pathname || '/';
      if (!path.startsWith('/c/') && path !== '/master' && !path.startsWith('/master/')) {
        const { screen } = getScreenFromPath(path);
        const target = getPathFromScreen(screen, currentCondo.slug);
        if (window.location.pathname !== target) {
          window.history.replaceState({ screen }, '', target);
        }
      }
    }
  }, [currentCondo?.slug, currentCondoId, currentScreen]);

  // Escuta os botões Voltar e Avançar do navegador (popstate) e hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || '/';
      const hashPath = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      const { screen, tenantSlug } = getScreenFromPath(hashPath || path);

      if (tenantSlug) {
        const found = condominios.find(c => c.slug === tenantSlug || c.id === tenantSlug);
        if (found && found.id !== currentCondoId) {
          setCurrentCondoId(found.id);
        }
      }

      _setCurrentScreen(screen);
      const routeConfig = getRouteConfig(screen);
      if (routeConfig) {
        document.title = `${routeConfig.title} | ${currentCondo?.nome || 'Condomínio'}`;
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentCondoId, currentCondo?.nome, condominios]);


  // Métodos de Gestão de Unidades do Admin
  const adicionarUnidade = (numero: string, vagaGaragem: string = '', senhaAcesso?: string) => {
    const numLimpo = numero.trim();
    if (!numLimpo) return;

    const vagaLimpa = vagaGaragem.trim();
    const senhaInicial = (senhaAcesso && senhaAcesso.trim()) ? senhaAcesso.trim() : numLimpo;

    const nova: Unidade = {
      id: `und-${numLimpo.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      numero: numLimpo,
      bloco: 'Bloco A',
      tipo: 'Apartamento',
      senhaAcesso: senhaInicial,
      senhaPadraoAlterada: false,
      statusCadastro: 'Pendente',
      semMoradores: false,
      vagaGaragem: vagaLimpa,
      moradores: []
    };

    salvarUnidadeNoFirestore(condoTenantId, nova).catch(console.error);

    setUnidades(prev => {
      const semDuplicado = prev.filter(u => u.numero.toLowerCase() !== numLimpo.toLowerCase());
      const atualizadas = sortUnidades([...semDuplicado, nova]);
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });
  };

  const editarUnidade = (id: string, vagaGaragem: string, numero?: string, _senhaIgnorada?: string) => {
    const alvo = unidades.find(u => u.id === id);
    if (!alvo) return;

    const unidadeSalva: Unidade = {
      ...alvo,
      numero: (numero && numero.trim()) ? numero.trim() : alvo.numero,
      vagaGaragem: vagaGaragem.trim()
    };

    setUnidades(prev => {
      const atualizadas = prev.map(u => (u.id === id ? unidadeSalva : u));
      const ordenadas = sortUnidades(atualizadas);
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(ordenadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(ordenadas));
      } catch {}
      return ordenadas;
    });

    salvarUnidadeNoFirestore(condoTenantId, unidadeSalva).catch(console.error);
  };

  const resetarSenhaUnidade = (idOuNumero: string): { success: boolean; message: string } => {
    const numLimpo = normalizeUnitNumber(idOuNumero);
    const alvo = unidades.find(u => u.id === idOuNumero || normalizeUnitNumber(u.numero) === numLimpo);
    if (!alvo) {
      return { success: false, message: 'Unidade não encontrada.' };
    }

    const unidadeAtualizada: Unidade = {
      ...alvo,
      senhaAcesso: alvo.numero,
      senhaPadraoAlterada: false
    };

    setUnidades(prev => {
      const atualizadas = prev.map(u => (u.id === alvo.id ? unidadeAtualizada : u));
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });

    salvarUnidadeNoFirestore(condoTenantId, unidadeAtualizada).catch(console.error);

    return { 
      success: true, 
      message: `Senha da Unidade ${unidadeAtualizada.numero} foi redefinida para a padrão: "${unidadeAtualizada.numero}".` 
    };
  };

  const excluirUnidade = (id: string) => {
    excluirDocumentoSubcolecaoFirestore(condoTenantId, 'unidades', id).catch(console.error);
    setUnidades(prev => {
      const atualizadas = prev.filter(u => u.id !== id);
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });
  };

  const toggleUnidadeSemMoradores = (id: string) => {
    const alvo = unidades.find(u => u.id === id);
    if (!alvo) return;

    const novoSemMoradores = !alvo.semMoradores;
    const unidadeSalva: Unidade = {
      ...alvo,
      semMoradores: novoSemMoradores,
      statusCadastro: novoSemMoradores 
        ? ('Vazio' as const) 
        : (alvo.moradores && alvo.moradores.length > 0 ? ('Cadastrado' as const) : ('Pendente' as const))
    };

    setUnidades(prev => {
      const atualizadas = prev.map(u => (u.id === id ? unidadeSalva : u));
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });

    salvarUnidadeNoFirestore(condoTenantId, unidadeSalva).catch(console.error);
  };

  const gerarUnidadesAutomaticas = (quantidade?: number) => {
    const total = quantidade || currentCondo?.totalUnidades || 75;
    let novas: Unidade[] = [];

    if (currentCondo?.totalAndares && currentCondo?.padraoPrimeiroAndar) {
      novas = sortUnidades(gerarUnidadesPorPadraoEAndar(
        total,
        currentCondo.totalAndares,
        currentCondo.padraoPrimeiroAndar,
        currentCondo.id,
        currentCondo.totalBlocos || 1
      ));
    } else {
      const blocos = currentCondo?.totalBlocos || 1;
      for (let i = 1; i <= total; i++) {
        const numStr = i < 10 ? `00${i}` : (i < 100 ? `0${i}` : `${i}`);
        const blocoLetra = String.fromCharCode(65 + ((i - 1) % blocos));
        novas.push({
          id: `und-auto-${numStr}-${i}-${Date.now()}`,
          numero: numStr,
          bloco: blocos > 1 ? `Bloco ${blocoLetra}` : 'Bloco A',
          tipo: 'Apartamento',
          vagaGaragem: '',
          senhaAcesso: numStr,
          senhaPadraoAlterada: false,
          statusCadastro: 'Pendente',
          semMoradores: false,
          moradores: []
        });
      }
      novas = sortUnidades(novas);
    }

    setUnidades(novas);
    try {
      localStorage.setItem(`condo_unidades_list_${currentCondo?.id}`, JSON.stringify(novas));
      localStorage.setItem('condo_unidades_list', JSON.stringify(novas));
    } catch {}
    if (currentCondoId) {
      limparESubstituirSubcolecaoFirestore(currentCondoId, 'unidades', novas).catch(console.error);
    }
  };

  // Notificações Privadas
  const [notificacoesPrivadas, setNotificacoesPrivadas] = useState<NotificacaoPrivada[]>(() => {
    const saved = localStorage.getItem('condo_notificacoes_privadas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'notif-1',
        unidadeNumero: '101',
        titulo: 'Aviso de Encomenda na Portaria',
        mensagem: 'Olá morador, chegou um pacote grande na portaria para sua unidade. Favor retirar na zeladoria.',
        autorNome: 'Valmyr Tavares (Síndico)',
        dataHora: '26/08/2026 às 15:30',
        lida: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('condo_notificacoes_privadas', JSON.stringify(notificacoesPrivadas));
  }, [notificacoesPrivadas]);

  // Sincronização em tempo real entre diferentes abas abertas no navegador
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'condo_notificacoes_privadas' && e.newValue) {
        try {
          setNotificacoesPrivadas(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const enviarNotificacaoPrivada = (unidadeNumero: string, mensagem: string, titulo?: string) => {
    const msgLimpa = mensagem.trim();
    if (!msgLimpa) return;

    const novaNotif: NotificacaoPrivada = {
      id: `notif-${Date.now()}`,
      unidadeNumero: unidadeNumero.trim(),
      titulo: titulo?.trim() || 'Notificação da Sindicância',
      mensagem: msgLimpa,
      autorNome: currentUser?.nome || 'Administração do Condomínio',
      dataHora: `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      lida: false
    };

    setNotificacoesPrivadas(prev => [novaNotif, ...prev]);
  };

  const marcarNotificacaoComoLida = (notificacaoId: string) => {
    const agora = `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    setNotificacoesPrivadas(prev => prev.map(n => n.id === notificacaoId ? { ...n, lida: true, lidaEm: n.lidaEm || agora } : n));
  };

  const marcarTodasNotificacoesUnidadeComoLidas = (unidadeNumero: string) => {
    const agora = `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const cleanUnit = (unidadeNumero || '').toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim();
    if (!cleanUnit) return;

    setNotificacoesPrivadas(prev => prev.map(n => {
      const nClean = (n.unidadeNumero || '').toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim();
      if (nClean === cleanUnit && !n.lida) {
        return { ...n, lida: true, lidaEm: agora };
      }
      return n;
    }));
  };

  // Autenticação do Admin / Síndico com Proteção Multi-Tenant & Primeiro Acesso
  const loginAdmin = async (
    usuario: string, 
    senha: string
  ): Promise<{ success: boolean; needsActivation?: boolean; message?: string }> => {
    const u = usuario.trim().toLowerCase();
    const s = senha.trim();

    if (!u || !s) {
      return { success: false, message: 'Informe o seu e-mail e a senha de acesso.' };
    }

    // 1. Verificação Multi-Tenant (Anti-Mistura de Condomínios)
    if (u.includes('@')) {
      const outroCondo = condominios.find(c => 
        c.id !== currentCondo.id && 
        c.emailAdmin && 
        c.emailAdmin.trim().toLowerCase() === u
      );

      if (outroCondo) {
        return {
          success: false,
          message: `Este e-mail pertence ao condomínio "${outroCondo.nome}". Por favor, acesse o link correto do seu condomínio.`
        };
      }
    }

    const emailCadastrado = (currentCondo.emailAdmin || '').trim().toLowerCase();
    const senhaCadastrada = (currentCondo.senhaAdminGeral || 'admin').trim();
    const jaAtivou = Boolean(currentCondo.senhaPadraoAlterada);
    const isLegacyAdmin = (u === 'admin' && s === 'admin');

    // 2. TENTATIVA DIRETA NO FIREBASE AUTHENTICATION (Se for e-mail)
    // Se o usuário redefiniu a senha via link do Firebase, o Firebase Auth é a fonte da verdade!
    if (u.includes('@')) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, u, s);
        if (userCredential.user) {
          // Login no Firebase Auth SUCESSO!
          // Sincroniza a nova senha e o e-mail no condomínio local e Firestore se tiver mudado
          if (s !== senhaCadastrada || u !== emailCadastrado || !jaAtivou) {
            setCondominios(prev => prev.map(c => {
              if (c.id === currentCondo.id) {
                return {
                  ...c,
                  emailAdmin: u,
                  senhaAdminGeral: s,
                  senhaPadraoAlterada: true
                };
              }
              return c;
            }));

            salvarCondominioNoFirestore({
              id: currentCondo.id,
              emailAdmin: u,
              senhaAdminGeral: s,
              senhaPadraoAlterada: true
            }).catch(console.warn);
          }

          setIsAdminLoggedIn(true);
          localStorage.setItem('condo_admin_auth', 'true');
          setCurrentUser({
            id: userCredential.user.uid || `admin-${currentCondo.id}`,
            nome: currentCondo.nomeSindico || 'Síndico Geral',
            email: u,
            role: 'sindico',
            unidade: '',
            bloco: '',
            foto: '',
            profissao: 'Síndico / Administrador',
            condominioId: currentCondo.id
          });

          return { success: true, needsActivation: false };
        }
      } catch (authErr: any) {
        console.log('Firebase Auth login check:', authErr.code);
        // Se a senha falhou no Firebase Auth, mas ainda é o primeiro acesso com a senha padrão inicial, continua abaixo
      }
    }

    // 3. Verifica credencial padrão inicial / primeiro acesso (antes de ter senha no Firebase Auth)
    const emailConfere = (emailCadastrado === u) || (!emailCadastrado && u.includes('@')) || (emailCadastrado.includes('@') && u.includes('@'));

    if (emailConfere || isLegacyAdmin) {
      if (!jaAtivou || s === senhaCadastrada) {
        if (!jaAtivou) {
          // Primeiro acesso! Precisa abrir o popup para definir a senha definitiva no Authentication
          return {
            success: true,
            needsActivation: true,
            message: 'Primeiro acesso detectado. Por favor, confirme seu e-mail e defina sua senha definitiva.'
          };
        }

        // Se já ativou e bate com a senha do condomínio
        if (s === senhaCadastrada) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('condo_admin_auth', 'true');
          setCurrentUser({
            id: `admin-${currentCondo.id}`,
            nome: currentCondo.nomeSindico || 'Síndico Geral',
            email: u,
            role: 'sindico',
            unidade: '',
            bloco: '',
            foto: '',
            profissao: 'Síndico / Administrador',
            condominioId: currentCondo.id
          });
          return { success: true, needsActivation: false };
        }
      }
    }

    // 4. Verificação de Colaboradores / Quadro de Funcionários com Login Individual
    const matchedFuncionario = funcionarios.find(f => 
      f.status !== 'Desligado' && 
      ((f.email && f.email.trim().toLowerCase() === u) || (f.usuario && f.usuario.trim().toLowerCase() === u)) &&
      (f.senha?.trim() === s || (!f.senha && f.email?.trim().toLowerCase() === s) || (s === '123456' && !f.senhaPadraoAlterada))
    );

    if (matchedFuncionario) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('condo_admin_auth', 'true');
      
      const userPermissoes: AdminModuloKey[] = matchedFuncionario.permissoesModulos && matchedFuncionario.permissoesModulos.length > 0
        ? matchedFuncionario.permissoesModulos
        : (matchedFuncionario.categoria === 'Portaria' ? ['portaria', 'mudancas'] : ['portaria']);

      const colabUserObj: User = {
        id: matchedFuncionario.id,
        nome: matchedFuncionario.nome,
        email: matchedFuncionario.email || matchedFuncionario.usuario || u,
        role: 'colaborador',
        unidade: '',
        bloco: '',
        foto: matchedFuncionario.foto,
        profissao: matchedFuncionario.funcao,
        permissoesModulos: userPermissoes,
        condominioId: currentCondo.id
      };
      setCurrentUser(colabUserObj);

      // Atualiza último acesso
      setFuncionarios(prev => prev.map(f => f.id === matchedFuncionario.id ? { ...f, ultimoAcesso: new Date().toISOString() } : f));

      return { 
        success: true, 
        needsActivation: !matchedFuncionario.senhaPadraoAlterada && (matchedFuncionario.senha === matchedFuncionario.email || matchedFuncionario.senha === '123456')
      };
    }

    // 5. Sub-administradores da lista adminUsers
    const matchedAdmin = adminUsers.find(
      adm => adm.usuario.toLowerCase() === u && adm.senha === s && adm.ativo
    );

    if (matchedAdmin) {
      if (matchedAdmin.tipoAcesso === 'total') {
        setIsAdminLoggedIn(true);
        localStorage.setItem('condo_admin_auth', 'true');
      }
      
      const adminUserObj: User = {
        id: matchedAdmin.id,
        nome: matchedAdmin.nome,
        email: matchedAdmin.email,
        role: matchedAdmin.tipoAcesso === 'total' ? 'sindico' : 'morador',
        unidade: '',
        bloco: '',
        foto: matchedAdmin.foto,
        profissao: matchedAdmin.cargo,
        condominioId: currentCondo.id
      };
      setCurrentUser(adminUserObj);
      return { success: matchedAdmin.tipoAcesso === 'total' };
    }

    return { success: false, message: 'E-mail ou senha incorretos para este condomínio.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('condo_admin_auth');
  };

  const concluirPrimeiroAcessoAdmin = async (
    email: string, 
    novaSenha: string, 
    nome: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const canonicalCondoId = currentCondo?.id || 'condo-edificio-aurora';
      
      // 1. Grava no Firebase Authentication e no Firestore users/{uid} + condominios/{condoId}
      const authResult = await ativarSindicoAuth({
        condoId: canonicalCondoId,
        email,
        novaSenha,
        nome
      });

      if (!authResult.success) {
        return { success: false, error: authResult.error || 'Erro ao registrar credenciais no Firebase Authentication.' };
      }

      // 2. Atualiza o perfil local do condomínio
      setCondominios(prev => prev.map(c => {
        if (c.id === canonicalCondoId) {
          return {
            ...c,
            emailAdmin: email.trim().toLowerCase(),
            nomeSindico: nome.trim() || c.nomeSindico,
            senhaAdminGeral: novaSenha.trim(),
            senhaPadraoAlterada: true
          };
        }
        return c;
      }));

      // 3. Atualiza estado de login do Admin
      setIsAdminLoggedIn(true);
      localStorage.setItem('condo_admin_auth', 'true');
      setCurrentUser({
        id: authResult.authUid || `sindico-${canonicalCondoId}`,
        nome: nome.trim() || currentCondo.nomeSindico || 'Síndico Geral',
        email: email.trim().toLowerCase(),
        role: 'sindico',
        unidade: '',
        bloco: '',
        foto: '',
        profissao: 'Síndico / Administrador',
        condominioId: canonicalCondoId
      });

      return { success: true };
    } catch (err: any) {
      console.error('Erro em concluirPrimeiroAcessoAdmin:', err);
      return { success: false, error: err.message || 'Erro inesperado ao concluir ativação.' };
    }
  };

  // Autenticação e Cadastro do Morador
  const loginResident = (unidadeInput: string, senhaInput: string): { success: boolean; needsRegistration?: boolean; message?: string } => {
    const numLimpo = normalizeUnitNumber(unidadeInput);
    const senhaLimpa = senhaInput.trim();

    if (!numLimpo || !senhaLimpa) {
      return { success: false, message: 'Preencha a unidade e a senha' };
    }

    // Busca a unidade com correspondência flexível (ex: 21, Apto 21, 021)
    const unidadeEncontrada = unidades.find(u => 
      normalizeUnitNumber(u.numero) === numLimpo || 
      u.numero.toLowerCase() === unidadeInput.trim().toLowerCase()
    );

    if (!unidadeEncontrada) {
      return { success: false, message: 'Unidade não cadastrada pela administração' };
    }

    const senhaCorreta = unidadeEncontrada.senhaAcesso || unidadeEncontrada.numero;
    const jaTemSenhaAlterada = Boolean(unidadeEncontrada.senhaPadraoAlterada);

    // Se o morador já cadastrou uma nova senha pessoal (ex: 123456), exige a senha dele
    if (jaTemSenhaAlterada) {
      if (senhaLimpa !== senhaCorreta) {
        return { success: false, message: 'Senha incorreta para esta unidade' };
      }
    } else {
      // Primeiro acesso (senha padrão inicial): aceita senhaAcesso ou número do apartamento
      if (
        senhaLimpa !== senhaCorreta && 
        senhaLimpa !== unidadeEncontrada.numero &&
        senhaLimpa !== normalizeUnitNumber(unidadeEncontrada.numero)
      ) {
        return { success: false, message: 'Senha incorreta para esta unidade' };
      }
    }

    // Verifica se os dados do morador estão configurados
    const isCadastrado = Boolean(
      unidadeEncontrada.statusCadastro === 'Cadastrado' &&
      unidadeEncontrada.moradores && 
      unidadeEncontrada.moradores.length > 0
    );

    if (!isCadastrado) {
      // Se não tem cadastro, direciona para o formulário de cadastro
      setPendingRegistrationUnit(unidadeEncontrada);
      return { success: true, needsRegistration: true };
    }

    // Autenticação bem-sucedida para quem já tem cadastro completo
    const authData = {
      unidade: unidadeEncontrada.numero,
      bloco: unidadeEncontrada.bloco
    };

    setIsResidentLoggedIn(true);
    setResidentAuthData(authData);
    localStorage.setItem('condo_resident_auth', JSON.stringify(authData));

    // Atualiza o currentUser para refletir o morador principal
    const usuarioMorador = unidadeEncontrada.moradores[0];
    setCurrentUser(usuarioMorador);

    return { success: true, needsRegistration: false };
  };

  const concluirCadastroMorador = async (
    unidadeNumero: string,
    moradoresData: { nome: string; email?: string; profissao?: string }[],
    fotoUrl?: string,
    novaSenha?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const numLimpo = normalizeUnitNumber(unidadeNumero);
    const targetUnit = unidades.find(u => normalizeUnitNumber(u.numero) === numLimpo) || pendingRegistrationUnit;
    const bloco = targetUnit?.bloco || 'Bloco A';
    const numeroOficial = targetUnit?.numero || unidadeNumero;

    const primeiroMorador = moradoresData.find(m => m.nome.trim().length > 0);
    if (!primeiroMorador) {
      return { success: false, error: 'Informe ao menos o nome do morador principal.' };
    }

    const outrosMoradores = moradoresData.slice(1).filter(m => m.nome.trim().length > 0);
    const canonicalCondoId = currentCondo?.id || condoTenantId || 'condo-edificio-aurora';
    const canonicalUnitId = targetUnit?.id || `unit-${canonicalCondoId}-1-${numeroOficial}-1`;

    // Chama o serviço de autenticação e gravação no Firebase Auth + Firestore
    const res = await cadastrarMoradorAuth({
      condoId: canonicalCondoId,
      unidadeId: canonicalUnitId,
      unidadeNumero: numeroOficial,
      bloco: bloco,
      moradorPrincipal: {
        nome: primeiroMorador.nome.trim(),
        email: primeiroMorador.email?.trim() || `morador.${numLimpo.replace(/\s+/g, '')}@condominio.com`,
        profissao: primeiroMorador.profissao?.trim(),
        fotoUrl: fotoUrl || undefined
      },
      dependentes: outrosMoradores.map(m => ({
        nome: m.nome.trim(),
        email: m.email?.trim(),
        profissao: m.profissao?.trim()
      })),
      senha: novaSenha?.trim() || targetUnit?.senhaAcesso || targetUnit?.numero || unidadeNumero
    });

    if (!res.success || !res.usuarioPrincipal || !res.unidadeAtualizada) {
      return { success: false, error: res.error || 'Erro ao persistir morador no banco.' };
    }

    const unidadeAtualizada = res.unidadeAtualizada as Unidade;
    const principalUser = res.usuarioPrincipal as User;

    setUnidades(prev => {
      const matchIndex = prev.findIndex(u => u.id === canonicalUnitId || normalizeUnitNumber(u.numero) === numLimpo);
      let atualizadas: Unidade[];
      if (matchIndex >= 0) {
        atualizadas = prev.map((u, idx) => (idx === matchIndex ? unidadeAtualizada : u));
      } else {
        atualizadas = sortUnidades([...prev, unidadeAtualizada]);
      }
      try {
        localStorage.setItem(`condo_unidades_list_${canonicalCondoId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });

    const authData = {
      unidade: numeroOficial,
      bloco: bloco
    };

    setIsResidentLoggedIn(true);
    setResidentAuthData(authData);
    try {
      localStorage.setItem('condo_resident_auth', JSON.stringify(authData));
    } catch {}

    setCurrentUser(principalUser);
    setPendingRegistrationUnit(null);
    setCurrentScreen('home');
    setIsDrawerOpen(true);

    return { success: true };
  };

  const atualizarSenhaUnidade = (unidadeNumero: string, novaSenha: string): boolean => {
    if (!novaSenha.trim()) return false;
    const numLimpo = normalizeUnitNumber(unidadeNumero);
    const alvo = unidades.find(u => normalizeUnitNumber(u.numero) === numLimpo || u.numero.toLowerCase() === unidadeNumero.toLowerCase());
    if (!alvo) return false;

    const unidadeAtualizada: Unidade = {
      ...alvo,
      senhaAcesso: novaSenha.trim(),
      senhaPadraoAlterada: true
    };

    setUnidades(prev => {
      const atualizadas = prev.map(u => (u.id === alvo.id || normalizeUnitNumber(u.numero) === numLimpo ? unidadeAtualizada : u));
      try {
        localStorage.setItem(`condo_unidades_list_${condoTenantId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });

    salvarUnidadeNoFirestore(condoTenantId, unidadeAtualizada).catch(console.error);
    return true;
  };

  const solicitarRecuperacaoSenha = async (
    unidadeOuEmail: string,
    isAdminHint?: boolean
  ): Promise<{ 
    success: boolean; 
    emailMascarado?: string; 
    codigoSimulado?: string; 
    message?: string;
    isFirebaseSent?: boolean;
  }> => {
    const termo = unidadeOuEmail.trim().toLowerCase();
    const numLimpo = normalizeUnitNumber(termo);
    if (!termo) {
      return { 
        success: false, 
        message: isAdminHint 
          ? 'Informe seu e-mail de administrador.' 
          : 'Informe o e-mail cadastrado na sua unidade.' 
      };
    }

    // 1. Verificação Multi-Tenant: se o e-mail pertence explicitamente a outro condomínio
    if (termo.includes('@')) {
      const outroCondo = condominios.find(c => 
        c.id !== currentCondo.id && 
        c.emailAdmin && 
        c.emailAdmin.trim().toLowerCase() === termo
      );
      if (outroCondo) {
        return {
          success: false,
          message: `Este e-mail pertence à administração do condomínio "${outroCondo.nome}". Acesse o link correspondente daquele condomínio para recuperar sua senha.`
        };
      }
    }

    // 2. Localiza se pertence a algum morador cadastrado por e-mail
    const unidadeMorador = unidades.find(u => 
      (u.emailResponsavel && u.emailResponsavel.trim().toLowerCase() === termo) ||
      u.moradores.some(m => m.email && m.email.trim().toLowerCase() === termo)
    );

    // 3. Verifica se é o Administrador / Síndico
    const emailAdminAtual = (currentCondo.emailAdmin || '').trim().toLowerCase();
    const isAdminUser = adminUsers.some(a => a.usuario?.toLowerCase() === termo || a.email?.toLowerCase() === termo);
    const isExplicitAdmin = (termo === 'admin' || termo === 'admin@condominio.com' || termo === emailAdminAtual || isAdminUser);
    const isIdentifiedAsAdmin = isExplicitAdmin || (isAdminHint && termo.includes('@')) || (termo.includes('@') && !unidadeMorador && (termo === emailAdminAtual || isAdminUser));

    if (isIdentifiedAsAdmin) {
      const emailFinal = termo.includes('@') 
        ? termo 
        : (currentCondo.emailAdmin || 'admin@condominio.com');

      // Se o condomínio atual ainda não tinha esse e-mail pessoal salvo, vincula-o agora
      if (emailFinal.includes('@') && emailFinal !== emailAdminAtual) {
        setCondominios(prev => prev.map(c => {
          if (c.id === currentCondo.id) {
            return { ...c, emailAdmin: emailFinal };
          }
          return c;
        }));
        salvarCondominioNoFirestore({
          id: currentCondo.id,
          emailAdmin: emailFinal
        }).catch(console.warn);
      }

      // Mascara o e-mail para exibição segura
      const partes = emailFinal.split('@');
      const nomeUser = partes[0] || 'admin';
      const dominio = partes[1] || 'condominio.com';
      const emailMascarado = nomeUser.length > 2
        ? `${nomeUser.slice(0, 2)}***${nomeUser.slice(-1)}@${dominio}`
        : `${nomeUser.slice(0, 1)}***@${dominio}`;

      // Tenta enviar o e-mail oficial via Firebase Authentication
      let isFirebaseSent = false;
      try {
        const fbRes = await enviarEmailRecuperacaoSenha(emailFinal);
        if (fbRes.success) {
          isFirebaseSent = true;
        }
      } catch {
        // Fallback para o código na tela
      }

      return {
        success: true,
        emailMascarado,
        codigoSimulado: '123456',
        isFirebaseSent,
        message: isFirebaseSent
          ? `Link oficial de redefinição enviado para ${emailFinal} pelo Firebase! Você também pode redefinir agora com o código abaixo.`
          : `Código de verificação gerado para o e-mail ${emailMascarado}.`
      };
    }

    // 4. Regra de Segurança para Moradores: EXIGE O E-MAIL CADASTRADO
    if (!termo.includes('@')) {
      return { 
        success: false, 
        message: 'Para sua segurança, a recuperação de senha exige o e-mail cadastrado na unidade. Caso não se recorde, contate o síndico para resetar seu acesso.' 
      };
    }

    if (!unidadeMorador) {
      return { 
        success: false, 
        message: 'Nenhum cadastro de morador encontrado com este e-mail neste condomínio. Verifique o endereço digitado ou fale com o síndico para resetar seu acesso.' 
      };
    }

    const email = (unidadeMorador.emailResponsavel && unidadeMorador.emailResponsavel.trim().toLowerCase() === termo)
      ? unidadeMorador.emailResponsavel
      : (unidadeMorador.moradores.find(m => m.email?.trim().toLowerCase() === termo)?.email || termo);

    // Mascara o e-mail do morador
    const partes = email.split('@');
    const nomeUser = partes[0] || 'morador';
    const dominio = partes[1] || 'email.com';
    const emailMascarado = nomeUser.length > 2
      ? `${nomeUser.slice(0, 2)}***${nomeUser.slice(-1)}@${dominio}`
      : `${nomeUser.slice(0, 1)}***@${dominio}`;

    let isFirebaseSent = false;
    try {
      const fbRes = await enviarEmailRecuperacaoSenha(email);
      if (fbRes.success) isFirebaseSent = true;
    } catch {}

    return {
      success: true,
      emailMascarado,
      codigoSimulado: '123456',
      isFirebaseSent,
      message: isFirebaseSent
        ? `Link de redefinição enviado para ${email} pelo Firebase!`
        : `Código de verificação enviado para ${emailMascarado}.`
    };
  };

  const redefinirSenhaComCodigo = async (
    unidadeOuEmail: string, 
    codigo: string, 
    novaSenha: string
  ): Promise<{ success: boolean; message?: string }> => {
    const termo = unidadeOuEmail.trim().toLowerCase();
    const codigoLimpo = codigo.trim();
    const senhaLimpa = novaSenha.trim();

    if (!codigoLimpo || codigoLimpo.length < 4) {
      return { success: false, message: 'Código de verificação inválido ou incompleto.' };
    }

    if (!senhaLimpa || senhaLimpa.length < 3) {
      return { success: false, message: 'A nova senha deve ter pelo menos 3 caracteres.' };
    }

    // Localiza se é Morador por e-mail
    const unidadeMorador = unidades.find(u => 
      (u.emailResponsavel && u.emailResponsavel.trim().toLowerCase() === termo) ||
      u.moradores.some(m => m.email && m.email.trim().toLowerCase() === termo)
    );

    // Verifica se é redefinição do Admin / Síndico
    const emailAdminAtual = (currentCondo.emailAdmin || '').trim().toLowerCase();
    const isAdminUser = adminUsers.some(a => a.usuario?.toLowerCase() === termo || a.email?.toLowerCase() === termo);
    const isIdentifiedAsAdmin = (termo === 'admin' || termo === 'admin@condominio.com' || termo === emailAdminAtual || isAdminUser || (termo.includes('@') && !unidadeMorador));

    if (isIdentifiedAsAdmin) {
      const emailFinal = termo.includes('@') ? termo : (currentCondo.emailAdmin || 'admin@condominio.com');

      // Atualiza o perfil do condomínio localmente
      setCondominios(prev => prev.map(c => {
        if (c.id === currentCondo.id) {
          return {
            ...c,
            emailAdmin: emailFinal,
            senhaAdminGeral: senhaLimpa,
            senhaPadraoAlterada: true
          };
        }
        return c;
      }));

      // Atualiza no Firestore
      await salvarCondominioNoFirestore({
        id: currentCondo.id,
        emailAdmin: emailFinal,
        senhaAdminGeral: senhaLimpa,
        senhaPadraoAlterada: true
      });

      // Se for um e-mail válido, ativa/atualiza também no Firebase Auth
      if (emailFinal.includes('@')) {
        ativarSindicoAuth({
          condoId: currentCondo.id,
          email: emailFinal,
          novaSenha: senhaLimpa,
          nome: currentCondo.nomeSindico || 'Síndico'
        }).catch(console.warn);
      }

      return { 
        success: true, 
        message: 'Senha do administrador redefinida com sucesso! Você já pode entrar com sua nova senha.' 
      };
    }

    // Caso seja Morador
    if (!unidadeMorador) {
      return { 
        success: false, 
        message: 'Nenhuma unidade encontrada para este e-mail. Fale com o síndico para resetar seu acesso.' 
      };
    }

    atualizarSenhaUnidade(unidadeMorador.numero, senhaLimpa);

    return { 
      success: true, 
      message: `Senha da Unidade ${unidadeMorador.numero} alterada com sucesso! Você já pode entrar com sua nova senha.` 
    };
  };

  const atualizarMoradoresUnidade = async (
    unidadeId: string, 
    moradores: User[], 
    fotoCelula?: string, 
    nomeCelula?: string
  ) => {
    const numLimpo = normalizeUnitNumber(unidadeId);
    const alvo = unidades.find(u => u.id === unidadeId || normalizeUnitNumber(u.numero) === numLimpo);
    if (!alvo) return;

    const canonicalCondoId = currentCondo?.id || condoTenantId || 'condo-edificio-aurora';
    const nomeFinal = nomeCelula || moradores.map(m => m.nome).join(', ');
    const emailPrincipal = moradores[0]?.email || alvo.emailResponsavel;

    const unidadeAtualizada: Unidade = {
      ...alvo,
      moradores: moradores.map(m => ({
        ...m,
        foto: typeof m.foto === 'string' && !m.foto.startsWith('data:') ? m.foto : ''
      })),
      statusCadastro: moradores.length > 0 ? ('Cadastrado' as const) : ('Pendente' as const),
      fotoCelula: fotoCelula !== undefined ? fotoCelula : alvo.fotoCelula,
      nomeCelula: nomeFinal,
      emailResponsavel: emailPrincipal,
      semMoradores: false
    };

    const res = await salvarUnidadeNoFirestore(canonicalCondoId, unidadeAtualizada);
    const fotoFinal = res.fotoUrl || (typeof fotoCelula === 'string' && !fotoCelula.startsWith('data:') ? fotoCelula : alvo.fotoCelula);
    const finalUnidade = { ...unidadeAtualizada, fotoCelula: fotoFinal };

    setUnidades(prev => {
      const atualizadas = prev.map(u => (u.id === alvo.id || normalizeUnitNumber(u.numero) === numLimpo ? finalUnidade : u));
      try {
        localStorage.setItem(`condo_unidades_list_${canonicalCondoId}`, JSON.stringify(atualizadas));
        localStorage.setItem('condo_unidades_list', JSON.stringify(atualizadas));
      } catch {}
      return atualizadas;
    });

    // Se o morador logado pertencer a essa unidade, atualiza o currentUser
    if (moradores.length > 0) {
      const match = moradores.find(m => m.id === currentUser.id) || moradores[0];
      if (normalizeUnitNumber(match.unidade) === normalizeUnitNumber(currentUser.unidade) || !currentUser.unidade) {
        setCurrentUser({ ...match, foto: fotoFinal || match.foto });
      }
    }
  };

  const pularCadastroMorador = (unidadeNumero: string) => {
    const targetUnit = unidades.find(u => u.numero === unidadeNumero) || pendingRegistrationUnit;
    const bloco = targetUnit?.bloco || 'Bloco A';

    const usuarioMorador: User = {
      id: `usr-morador-${unidadeNumero}`,
      nome: 'Morador sem dados',
      email: `morador.${unidadeNumero}@condominio.com`,
      role: 'morador',
      unidade: unidadeNumero,
      bloco: bloco,
      condominioId: CURRENT_CONDO_ID
    };

    // Apenas sessão em memória, SEM persistência em localStorage para que sempre recomece
    setIsResidentLoggedIn(true);
    setResidentAuthData({
      unidade: unidadeNumero,
      bloco: bloco
    });
    localStorage.removeItem('condo_resident_auth');

    setCurrentUser(usuarioMorador);
    setPendingRegistrationUnit(null);
    setCurrentScreen('home');
    setIsDrawerOpen(true);
  };

  const logoutResident = () => {
    setIsResidentLoggedIn(false);
    setResidentAuthData(null);
    setPendingRegistrationUnit(null);
    localStorage.removeItem('condo_resident_auth');
    setCurrentUser({
      id: 'usr-guest',
      nome: 'Morador sem dados',
      email: '',
      role: 'morador',
      unidade: '',
      bloco: '',
      condominioId: CURRENT_CONDO_ID
    });
  };

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
    const userIdentifier = currentUser?.id || currentUser?.unidade || 'morador-anon';
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === id) {
        const apoiadores = rec.apoiadores || [];
        const jaApoiou = apoiadores.includes(userIdentifier) || (rec.apoiadoPeloUsuario && apoiadores.length === 0);
        const novosApoiadores = jaApoiou
          ? apoiadores.filter(u => u !== userIdentifier)
          : [...apoiadores, userIdentifier];

        return {
          ...rec,
          apoiosCount: jaApoiou ? Math.max(0, rec.apoiosCount - 1) : rec.apoiosCount + 1,
          apoiadoPeloUsuario: !jaApoiou,
          apoiadores: novosApoiadores
        };
      }
      return rec;
    }));
  };

  const adicionarComentario = (reclamacaoId: string, texto: string) => {
    if (!texto.trim()) return;

    let unidadeFormatada = '';
    if (currentUser.unidade) {
      const uNum = currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura')
        ? currentUser.unidade
        : `Apt ${currentUser.unidade}`;
      unidadeFormatada = currentUser.bloco ? `${uNum} - ${currentUser.bloco}` : uNum;
    } else {
      unidadeFormatada = currentUser.role === 'sindico' || currentUser.role === 'subsindico' ? 'Administração' : 'Morador';
    }

    const novoComentario = {
      id: `com-${Date.now()}`,
      autorId: currentUser.id || 'usr-anon',
      autorNome: currentUser.nome || 'Morador',
      autorRole: currentUser.role,
      autorUnidade: unidadeFormatada,
      autorFoto: currentUser.foto,
      texto: texto.trim(),
      data: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      oficial: currentUser.role === 'sindico' || currentUser.role === 'subsindico'
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
      fotosDepois: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'],
      apoiosCount: reclamacao?.apoiosCount || 0,
      apoiadoPeloUsuario: reclamacao?.apoiadoPeloUsuario || false,
      apoiadores: reclamacao?.apoiadores || [],
      comentarios: []
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
        const novosOrcamentos = (rep.orcamentos || []).map(o => ({
          ...o,
          selecionado: o.id === orcamentoId
        }));
        const selecionado = novosOrcamentos.find(o => o.selecionado);

        const novaTimelineStep = {
          id: `tl-orc-${Date.now()}`,
          data: new Date().toLocaleDateString('pt-BR'),
          titulo: 'Orçamento Selecionado & Aprovado',
          descricao: `Orçamento da empresa ${selecionado?.empresa} (R$ ${selecionado?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) aprovado pela administração.`,
          autorRole: currentUser.role,
          statusAlvo: 'Orçamento Contratado' as StatusReparo
        };

        return {
          ...rep,
          orcamentos: novosOrcamentos,
          empresaEscolhida: selecionado?.empresa,
          valorFinal: selecionado?.valor,
          status: 'Orçamento Contratado' as StatusReparo,
          timeline: [...(rep.timeline || []), novaTimelineStep]
        };
      }
      return rep;
    }));
  };

  const adicionarOrcamentoReparo = (reparoId: string, novoOrcamento: Omit<Orcamento, 'id' | 'selecionado'>) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const orcCompleto: Orcamento = {
      ...novoOrcamento,
      id: `orc-${Date.now()}`,
      selecionado: false
    };

    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        const novosOrcs = [...(rep.orcamentos || []), orcCompleto];
        const novaStep = {
          id: `tl-orc-add-${Date.now()}`,
          data: dataHoje,
          titulo: `Orçamento Publicado: ${novoOrcamento.empresa}`,
          descricao: `Proposta de R$ ${novoOrcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cadastrada pela administração. Prazo: ${novoOrcamento.prazoDias} dias.`,
          autorRole: currentUser.role,
          statusAlvo: (rep.status === 'Solicitado' || rep.status === 'Buscando Orçamento') ? ('Análise de Orçamento' as StatusReparo) : rep.status
        };

        const novoStatus = (rep.status === 'Solicitado' || rep.status === 'Buscando Orçamento') ? ('Análise de Orçamento' as StatusReparo) : rep.status;

        return {
          ...rep,
          orcamentos: novosOrcs,
          status: novoStatus,
          timeline: [...(rep.timeline || []), novaStep]
        };
      }
      return rep;
    }));
  };

  const excluirOrcamentoReparo = (reparoId: string, orcamentoId: string) => {
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        const filtrados = (rep.orcamentos || []).filter(o => o.id !== orcamentoId);
        const foiSelecionado = (rep.orcamentos || []).find(o => o.id === orcamentoId)?.selecionado;

        return {
          ...rep,
          orcamentos: filtrados,
          empresaEscolhida: foiSelecionado ? undefined : rep.empresaEscolhida,
          valorFinal: foiSelecionado ? undefined : rep.valorFinal
        };
      }
      return rep;
    }));
  };

  const apoiarReparo = (id: string) => {
    const userIdentifier = currentUser?.id || currentUser?.unidade || 'morador-anon';
    setReparos(prev => prev.map(rep => {
      if (rep.id === id) {
        const apoiadores = rep.apoiadores || [];
        const jaApoiou = apoiadores.includes(userIdentifier) || (rep.apoiadoPeloUsuario && apoiadores.length === 0);
        const novosApoiadores = jaApoiou
          ? apoiadores.filter(u => u !== userIdentifier)
          : [...apoiadores, userIdentifier];

        return {
          ...rep,
          apoiosCount: jaApoiou ? Math.max(0, (rep.apoiosCount || 0) - 1) : (rep.apoiosCount || 0) + 1,
          apoiadoPeloUsuario: !jaApoiou,
          apoiadores: novosApoiadores
        };
      }
      return rep;
    }));
  };

  const adicionarComentarioReparo = (reparoId: string, texto: string) => {
    if (!texto.trim()) return;

    let unidadeFormatada = '';
    if (currentUser.unidade) {
      const uNum = currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura')
        ? currentUser.unidade
        : `Apt ${currentUser.unidade}`;
      unidadeFormatada = currentUser.bloco ? `${uNum} - ${currentUser.bloco}` : uNum;
    } else {
      unidadeFormatada = currentUser.role === 'sindico' || currentUser.role === 'subsindico' ? 'Administração' : 'Morador';
    }

    const novoComentario = {
      id: `com-rep-${Date.now()}`,
      autorId: currentUser.id || 'usr-anon',
      autorNome: currentUser.nome || 'Morador',
      autorRole: currentUser.role,
      autorUnidade: unidadeFormatada,
      autorFoto: currentUser.foto,
      texto: texto.trim(),
      data: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      oficial: currentUser.role === 'sindico' || currentUser.role === 'subsindico'
    };

    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        return {
          ...rep,
          comentarios: [...(rep.comentarios || []), novoComentario]
        };
      }
      return rep;
    }));
  };

  const toggleOcultarComentarioReparo = (reparoId: string, comentarioId: string, motivo?: string) => {
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        return {
          ...rep,
          comentarios: (rep.comentarios || []).map(c => {
            if (c.id === comentarioId) {
              const novoOculto = !c.oculto;
              return {
                ...c,
                oculto: novoOculto,
                motivoOcultacao: novoOculto ? (motivo || 'Ocultado pela moderação administrativa') : undefined,
                ocultadoEm: novoOculto ? new Date().toLocaleDateString('pt-BR') : undefined
              };
            }
            return c;
          })
        };
      }
      return rep;
    }));
  };

  const excluirComentarioReparo = (reparoId: string, comentarioId: string) => {
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        return {
          ...rep,
          comentarios: (rep.comentarios || []).filter(c => c.id !== comentarioId)
        };
      }
      return rep;
    }));
  };

  const excluirReparo = (reparoId: string) => {
    setReparos(prev => prev.filter(r => r.id !== reparoId));
  };

  const resolverReparoSimples = (reparoId: string, observacao?: string) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    setReparos(prev => prev.map(rep => {
      if (rep.id === reparoId) {
        const novaStep = {
          id: `tl-res-${Date.now()}`,
          data: dataHoje,
          titulo: 'Reparo Simples Concluído',
          descricao: observacao || `Problema resolvido diretamente pela zeladoria/administração (${currentUser.nome}). Sem necessidade de cotações externas.`,
          autorRole: currentUser.role,
          statusAlvo: 'Resolvido' as StatusReparo
        };

        const reparoAtualizado = {
          ...rep,
          status: 'Resolvido' as StatusReparo,
          timeline: [...(rep.timeline || []), novaStep]
        };

        if (rep.reclamacaoId) {
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
        if ((novoStatus === 'Resolvido' || novoStatus === 'Executado' || novoStatus === 'Confirmado') && rep.reclamacaoId) {
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
    anexoUrl?: string,
    anexoTipo?: 'imagem' | 'video'
  ) => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const novoReparo: Reparo = {
      id: `rep-${Date.now()}`,
      titulo,
      descricao,
      porte,
      categoria,
      solicitanteNome: currentUser.nome,
      solicitanteUnidade: currentUser.role === 'morador' ? `Apt ${currentUser.unidade}${currentUser.bloco ? ` - ${currentUser.bloco}` : ''}` : 'Administração',
      dataSolicitacao: dataHoje,
      responsavel: 'A definir (Administração)',
      status: 'Solicitado',
      condominioId: CURRENT_CONDO_ID,
      orcamentos: [],
      apoiosCount: 0,
      apoiadoPeloUsuario: false,
      apoiadores: [],
      comentarios: [],
      anexoUrl,
      anexoTipo,
      timeline: [
        {
          id: `tl-sol-${Date.now()}`,
          data: dataHoje,
          titulo: 'Solicitação de Reparo Registrada',
          descricao: `Abertura realizada por ${currentUser.nome} (${currentUser.unidade}). Aguardando análise técnica da administração.`,
          autorRole: currentUser.role,
          statusAlvo: 'Solicitado'
        }
      ],
      fotosAntes: anexoUrl && anexoTipo !== 'video' ? [anexoUrl] : ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80']
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

  const toggleOcultarComentario = (reclamacaoId: string, comentarioId: string, motivo?: string) => {
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === reclamacaoId) {
        return {
          ...rec,
          comentarios: rec.comentarios.map(c => {
            if (c.id === comentarioId) {
              const novoOculto = !c.oculto;
              return {
                ...c,
                oculto: novoOculto,
                motivoOcultacao: novoOculto ? (motivo || 'Ocultado pela moderação administrativa') : undefined,
                ocultadoEm: novoOculto ? new Date().toLocaleDateString('pt-BR') : undefined
              };
            }
            return c;
          })
        };
      }
      return rec;
    }));
  };

  const excluirComentario = (reclamacaoId: string, comentarioId: string) => {
    setReclamacoes(prev => prev.map(rec => {
      if (rec.id === reclamacaoId) {
        return {
          ...rec,
          comentarios: rec.comentarios.filter(c => c.id !== comentarioId)
        };
      }
      return rec;
    }));
  };

  const excluirReclamacao = (reclamacaoId: string) => {
    setReclamacoes(prev => prev.filter(r => r.id !== reclamacaoId));
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
      dependencias,
      adicionarDependencia,
      editarDependencia,
      excluirDependencia,
      reservas,
      assembleias,
      adicionarAssembleia,
      editarAssembleia,
      excluirAssembleia,
      publicarAtaAssembleia,
      eventos,
      adicionarEvento,
      editarEvento,
      excluirEvento,
      suspenderEvento,
      reativarEvento,
      prestacaoContas,
      mesesPrestacao,
      categoriasDespesa,
      categoriasReceita,
      adicionarMesPrestacao,
      adicionarDespesa,
      editarDespesa,
      excluirDespesa,
      adicionarReceita,
      editarReceita,
      excluirReceita,
      adicionarCategoriaDespesa,
      adicionarCategoriaReceita,
      funcionarios,
      adicionarFuncionario,
      editarFuncionario,
      excluirFuncionario,
      atualizarStatusFuncionario,
      alterarSenhaColaborador,
      avaliacoesFuncionarios,
      avaliarFuncionario,
      espinhaDorsalItems,
      isDrawerOpen,
      setIsDrawerOpen,
      currentScreen,
      setCurrentScreen,
      targetRedirectScreen,
      setTargetRedirectScreen,
      selectedReclamacaoId,
      setSelectedReclamacaoId,
      selectedReparoId,
      setSelectedReparoId,
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      concluirPrimeiroAcessoAdmin,
      adminUsers,
      adminRoles,
      adicionarAdminUser,
      excluirAdminUser,
      adicionarAdminRole,
      excluirAdminRole,
      adicionarUnidade,
      editarUnidade,
      resetarSenhaUnidade,
      excluirUnidade,
      toggleUnidadeSemMoradores,
      gerarUnidadesAutomaticas,
      notificacoesPrivadas,
      enviarNotificacaoPrivada,
      marcarNotificacaoComoLida,
      marcarTodasNotificacoesUnidadeComoLidas,
      isResidentLoggedIn,
      residentAuthData,
      pendingRegistrationUnit,
      setPendingRegistrationUnit,
      loginResident,
      concluirCadastroMorador,
      pularCadastroMorador,
      atualizarMoradoresUnidade,
      atualizarSenhaUnidade,
      solicitarRecuperacaoSenha,
      redefinirSenhaComCodigo,
      logoutResident,
      apoiarReclamacao,
      adicionarComentario,
      adicionarReclamacao,
      adicionarReparo,
      apoiarReparo,
      adicionarComentarioReparo,
      toggleOcultarComentarioReparo,
      excluirComentarioReparo,
      excluirReparo,
      resolverReparoSimples,
      adicionarBenfeitoria,
      servicosContratados,
      adicionarServicoContratado,
      editarServicoContratado,
      excluirServicoContratado,
      solicitarReserva,
      cancelarReserva,
      atualizarStatusReclamacao,
      toggleOcultarComentario,
      excluirComentario,
      excluirReclamacao,
      atualizarStatusVaga,
      transformarEmReparo,
      selecionarOrcamento,
      adicionarOrcamentoReparo,
      excluirOrcamentoReparo,
      atualizarStatusReparo,
      servicosMoradores,
      adicionarServicoMorador,
      editarServicoMorador,
      suspenderServicoMorador,
      reativarServicoMorador,
      excluirServicoMorador,
      regrasCondominio,
      adicionarRegraCondominio,
      editarRegraCondominio,
      excluirRegraCondominio,
      reordenarRegrasCondominio,
      unidadesDisponiveis,
      adicionarUnidadeDisponivel,
      editarUnidadeDisponivel,
      excluirUnidadeDisponivel,
      itensEnjoei,
      adicionarItemEnjoei,
      editarItemEnjoei,
      atualizarStatusItemEnjoei,
      suspenderItemEnjoei,
      reativarItemEnjoei,
      excluirItemEnjoei,
      mudancas,
      regrasMudanca,
      adicionarMudanca,
      atualizarStatusMudanca,
      editarMudanca,
      excluirMudanca,
      salvarRegrasMudanca,
      registrosAtividades,
      adicionarRegistroAtividade,
      excluirRegistroAtividade,
      autorizacoesAcesso,
      adicionarAutorizacaoAcesso,
      atualizarStatusAcesso,
      excluirAutorizacaoAcesso,
      encomendasEntregas,
      adicionarEncomenda,
      darBaixaEncomenda,
      excluirEncomenda,
      condominios,
      currentCondo,
      currentCondoId,
      adicionarCondominio,
      editarCondominio,
      excluirCondominio,
      alternarStatusCondominio,
      selecionarCondominio,
      isMasterLoggedIn,
      loginMaster,
      logoutMaster
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
