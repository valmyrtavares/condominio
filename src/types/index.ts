export type UserRole = 'morador' | 'sindico' | 'subsindico';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  unidade: string;
  bloco: string;
  foto?: string;
  profissao?: string;
  hobby?: string;
  aniversario?: string;
  vagaGaragem?: string;
  condominioId: string;
}

export interface Unidade {
  id: string;
  numero: string;
  bloco: string;
  tipo?: 'Apartamento' | 'Cobertura' | 'Casa';
  vagaGaragem?: string;
  senhaAcesso?: string;
  senhaPadraoAlterada?: boolean;
  emailResponsavel?: string;
  statusCadastro?: 'Pendente' | 'Cadastrado' | 'Vazio';
  semMoradores?: boolean;
  moradores: User[];
  fotoCelula?: string;
  nomeCelula?: string;
}

export interface NotificacaoPrivada {
  id: string;
  unidadeNumero: string;
  titulo?: string;
  mensagem: string;
  autorNome: string;
  dataHora: string;
  lida: boolean;
  lidaEm?: string;
}

export interface AdminRole {
  id: string;
  nome: string;
  tipoAcesso: 'total' | 'morador_destaque';
  descricao?: string;
}

export interface AdminUser {
  id: string;
  nome: string;
  usuario: string;
  email: string;
  cargo: string;
  tipoAcesso: 'total' | 'morador_destaque';
  foto?: string;
  senha: string;
  ativo: boolean;
  criadoEm: string;
  telefone?: string;
}

export type CategoriaFuncionario = 'Portaria' | 'Limpeza' | 'Segurança' | 'Gestão' | 'Manutenção' | 'Zeladoria' | 'Conselho';

export type StatusFuncionario = 'Ativo' | 'Férias' | 'Doente' | 'Ausente' | 'Desligado';

export interface AvaliacaoFuncionario {
  id: string;
  funcionarioId: string;
  usuarioId: string;
  unidade?: string;
  nota: number;
  data: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  foto: string;
  funcao: string;
  categoria?: CategoriaFuncionario;
  horario: string;
  disponibilidade: string;
  status?: StatusFuncionario;
  avaliacoesCount?: number;
  mediaNota?: number;
  email?: string;
  telefone?: string;
  usuario?: string;
  senha?: string;
  tipoAcesso?: 'total' | 'morador_destaque';
  criadoEm?: string;
  condominioId: string;
}

export interface ServicoMorador {
  id: string;
  titulo: string;
  subtitulo?: string;
  categoria: string;
  descricao: string;
  imagem?: string;
  moradorNome: string;
  moradorUnidade: string;
  tipoBotao: 'whatsapp' | 'site';
  whatsapp?: string;
  linkSite?: string;
  contato: string;
  ativo: boolean;
  motivoSuspensao?: string;
  dataCriacao?: string;
  condominioId: string;
}

export type CategoriaReclamacao = 
  | 'Barulho' 
  | 'Limpeza' 
  | 'Segurança' 
  | 'Ameaça' 
  | 'Assédio' 
  | 'Animais Domésticos'
  | 'Convivência / Regras'
  | 'Outros';

export type StatusReclamacao = 
  | 'Recebida' 
  | 'Em análise' 
  | 'Em andamento' 
  | 'Resolvida' 
  | 'Encerrada';

export interface Comentario {
  id: string;
  autorId: string;
  autorNome: string;
  autorRole: UserRole;
  autorUnidade: string;
  autorFoto?: string;
  texto: string;
  data: string;
  oficial?: boolean;
  oculto?: boolean;
  motivoOcultacao?: string;
  ocultadoEm?: string;
}

export interface Reclamacao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaReclamacao;
  autorId: string;
  autorNome: string;
  autorUnidade: string;
  data: string;
  status: StatusReclamacao;
  apoiosCount: number;
  apoiadoPeloUsuario?: boolean;
  apoiadores?: string[];
  comentarios: Comentario[];
  reparoId?: string;
  condominioId: string;
  anexoUrl?: string;
  anexoTipo?: 'imagem' | 'video';
}

export type PorteReparo = 'Pequeno' | 'Médio' | 'Grande';

export type CategoriaReparo = 
  | 'Pintura' 
  | 'Elevador' 
  | 'Garagem' 
  | 'Escadas' 
  | 'Academia' 
  | 'Churrasqueira' 
  | 'Quadra' 
  | 'Salão de Festas' 
  | 'Hall / Corredor' 
  | 'Inter-Apartamentos' 
  | 'Outros';

export type StatusReparo = 
  | 'Solicitado' 
  | 'Em análise' 
  | 'Buscando Orçamento' 
  | 'Análise de Orçamento' 
  | 'Orçamento Contratado' 
  | 'Em Execução' 
  | 'Resolvido' 
  | 'Cancelado'
  | 'Aguardando Conserto' 
  | 'Orçamento' 
  | 'Aprovado' 
  | 'Agendado' 
  | 'Executado' 
  | 'Confirmado';

export interface Orcamento {
  id: string;
  empresa: string;
  siteUrl: string;
  cnpj?: string;
  valor: number;
  descricao: string;
  prazoDias: number;
  selecionado: boolean;
  documentoUrl?: string;
  documentoNome?: string;
}

export interface TimelineStep {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  autorRole: UserRole;
  statusAlvo?: StatusReparo;
}

export interface Reparo {
  id: string;
  reclamacaoId?: string;
  titulo: string;
  descricao: string;
  porte: PorteReparo;
  categoria: CategoriaReparo;
  solicitanteNome: string;
  solicitanteUnidade: string;
  dataSolicitacao: string;
  responsavel: string;
  empresaEscolhida?: string;
  empresaContratada?: string;
  valorFinal?: number;
  valorContratado?: number;
  orcamentoAprovadoId?: string;
  orcamentos: Orcamento[];
  status: StatusReparo;
  timeline: TimelineStep[];
  fotosAntes: string[];
  fotosDepois?: string[];
  condominioId: string;
  apoiosCount: number;
  apoiadoPeloUsuario?: boolean;
  apoiadores?: string[];
  comentarios: Comentario[];
  anexoUrl?: string;
  anexoTipo?: 'imagem' | 'video';
}

export type TipoBenfeitoria = 
  | 'Grande Reparo & Manutenção' 
  | 'Nova Aquisição & Modernização' 
  | 'Equilíbrio Financeiro & Economia' 
  | 'Área Comum & Convivência';

export interface Benfeitoria {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: TipoBenfeitoria;
  dataEntrega: string;
  descricao: string;
  impactoGestao: string;
  investimento?: number;
  economiaMensal?: number;
  fotos: string[];
  fotosAntes?: string[];
  responsavel: string;
  condominioId: string;
  regrasUso?: string;
}

export type StatusVaga = 'Em uso' | 'Para Alugar' | 'Vazia';

export interface VeiculoInfo {
  modelo: string;
  cor: string;
  placa: string;
  tipo: 'Carro' | 'SUV' | 'Moto' | 'Outro';
}

export interface VagaGaragem {
  id: string;
  numeroVaga: string;
  subsolo: 'Subsolo 1' | 'Subsolo 2';
  unidadeNumero: string;
  bloco: string;
  status: StatusVaga;
  tipoVaga?: 'Simples' | 'Dupla' | 'PCD' | 'Moto';
  moradorNome: string;
  moradorFoto?: string;
  interfoneRamal: string;
  contatoWhatsapp?: string;
  veiculo?: VeiculoInfo;
  valorAluguelMensal?: number;
  observacoes?: string;
  condominioId: string;
}

export type StatusServicoContratado = 
  | 'Contratada' 
  | 'Orçada' 
  | 'Histórico';

export interface ServicoContratado {
  id: string;
  empresaNome: string;
  cnpj?: string;
  categoria: string;
  status: StatusServicoContratado;
  servicoDescricao: string;
  valor?: number;
  tipoValor?: 'mensal' | 'pontual' | 'semestral' | 'anual';
  formaPagamento?: string;
  telefone: string;
  whatsapp?: string;
  email?: string;
  siteUrl?: string;
  responsavelContato?: string;
  dataContratoOuOrcamento: string;
  observacoes?: string;
  condominioId: string;
}

export type EmpresaFornecedor = ServicoContratado;


export type TipoDependencia = 'Lazer & Convivência' | 'Esporte & Saúde' | 'Infantil' | 'Infraestrutura & Acesso';

export interface ReservaDependencia {
  id: string;
  dependenciaId: string;
  moradorId: string;
  moradorNome: string;
  unidade: string;
  dataReserva: string;
  periodo: 'Manhã (09h-14h)' | 'Tarde/Noite (16h-23h)' | 'Dia Inteiro';
  status: 'Confirmada' | 'Pendente de Pagamento' | 'Cancelada';
  valorTaxa?: number;
}

export interface Dependencia {
  id: string;
  nome: string;
  tipo: TipoDependencia;
  foto: string;
  fotosAdicionais?: string[];
  descricao: string;
  horarioFuncionamento: string;
  capacidadePessoas: number;
  requerReserva: boolean;
  taxaReserva?: number;
  comodidades: string[];
  regrasUso: string[];
  condominioId: string;
}

export type StatusAssembleia = 
  | 'Agendada' 
  | 'Realizada com Ata Publicada' 
  | 'Realizada - Aguardando Ata';

export type TipoEncontroAssembleia = 'Assembleia Geral' | 'Reunião Informal';

export type OrigemPautaAssembleia = 'reclamacao' | 'reparo' | 'extra';

export interface PautaAssembleia {
  id: string;
  titulo: string;
  descricao: string;
  origemTipo?: OrigemPautaAssembleia;
  origemId?: string;
  solucaoAta?: string;
  aprovada?: boolean; // true = check verde; false = sem check/rejeitada; undefined = agendada
  resultadoVotacao?: string;
}

export interface AtaAssembleia {
  numeroAta: string;
  dataLavratura: string;
  presidenteMesa: string;
  secretarioMesa: string;
  registroCartorio?: string;
  resumoDecisoes: string;
  textoCompleto: string;
  solucoesPautas?: { pautaId: string; solucao: string; aprovada?: boolean }[];
}

export interface Assembleia {
  id: string;
  titulo: string;
  tipo: 'Ordinária' | 'Extraordinária' | 'Reunião de Comissão' | 'Reunião com Moradores' | 'Outro';
  tipoEncontro?: TipoEncontroAssembleia; // 'Assembleia Geral' | 'Reunião Informal'
  participantesTipo?: 'todos' | 'especificos';
  participantesIds?: string[]; // IDs/números das unidades ou cargos convidados
  participantesDescricao?: string; // Descrição textual dos participantes
  dataHora: string;
  local: string;
  primeiraChamada: string;
  segundaChamada: string;
  status: StatusAssembleia;
  descricaoGeral: string;
  pautas: PautaAssembleia[];
  ata?: AtaAssembleia;
  condominioId: string;
  criadoEm?: string;
}

export type TipoVisibilidadeEvento = 'Público' | 'Privado';

export interface EventoCondominio {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  organizador: string;
  organizadorId?: string;
  organizadorUnidade?: string;
  visibilidade: TipoVisibilidadeEvento;
  descricao: string;
  imagem: string;
  ativo?: boolean;
  motivoSuspensao?: string;
  linkMaisInfo?: string;
  criadoEm?: string;
  condominioId: string;
}

export type FinalidadeImovel = 'Aluga-se' | 'Vende-se' | 'Aluga-se ou Vende-se';

export interface UnidadeDisponivel {
  id: string;
  apartamento: string;
  bloco: string;
  finalidade: FinalidadeImovel;
  valor: number;
  valorCondominio?: number;
  valorIptu?: number;
  metragemM2: number;
  quartos: number;
  suites: number;
  vagasGaragem: number;
  proprietarioNome: string;
  proprietarioTelefone: string;
  proprietarioWhatsapp: string;
  descricaoCurta: string;
  fotos?: string[];
  dataAnuncio: string;
  condominioId: string;
}

export interface DespesaItem {
  id: string;
  titulo?: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  dataVencimento?: string;
  fornecedor: string;
  parcelas?: string; // ex: "1/1", "2/6", "3/6"
  comentario?: string;
  reparoId?: string;
  comprovanteUrl?: string;
  notaFiscalUrl?: string;
  notaFiscalNome?: string;
}

export interface ReceitaItem {
  id: string;
  titulo?: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  dataVencimento?: string;
  origem: string;
  parcelas?: string; // ex: "1/1", "2/6"
  comentario?: string;
  comprovanteUrl?: string;
  notaFiscalUrl?: string;
  notaFiscalNome?: string;
}

export interface PrestacaoContas {
  id: string;
  mesAno: string;
  receitasTotal: number;
  despesasTotal: number;
  saldo: number;
  despesas: DespesaItem[];
  receitas: ReceitaItem[];
  condominioId: string;
}

export interface EspinhaDorsalItem {
  id: string;
  titulo: string;
  icone: string;
  descricaoCurta: string;
  desdobramentos: string[];
  rota: string;
  destaquePoC?: boolean;
}

export interface RegraTopico {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string; // Conteúdo formatado em rich text (HTML/tags)
  palavrasChave: string[];
  criadoEm?: string;
  atualizadoEm?: string;
  ativo?: boolean;
  ordem?: number;
}

export type TipoTransacaoEnjoei = 
  | 'venda'        // Venda com preço em R$
  | 'doacao'       // Sem custo / Grátis
  | 'retirada'     // Apenas custo do frete / quem retirar leva
  | 'troca'        // Troca / Permuta por outro item
  | 'emprestimo';  // Empréstimo ou aluguel temporário

export type CondicaoItemEnjoei = 
  | 'Novo / Lacrado'
  | 'Seminovo (Excelente)'
  | 'Usado (Bom estado)'
  | 'Com marcas de uso'
  | 'Para restauro / Peças';

export type StatusItemEnjoei = 
  | 'disponivel' 
  | 'negociando' 
  | 'concluido' 
  | 'suspenso';

export interface ItemEnjoei {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string; // Móveis & Decoração, Eletrodomésticos, Eletrônicos, Roupas, Instrumentos Musicais, Infantil, Esportes, Ferramentas, Livros, Outros
  tipoTransacao: TipoTransacaoEnjoei;
  preco?: number;
  trocaPor?: string; // Especifica o que o morador aceita em troca (ex: panela por casaco ou câmera)
  condicao: CondicaoItemEnjoei;
  fotos: string[];
  moradorNome: string;
  moradorUnidade: string;
  moradorFoto?: string;
  contatoWhatsapp: string;
  contatoTelefone?: string;
  dataPublicacao: string;
  status: StatusItemEnjoei;
  motivoSuspensao?: string;
  destaque?: boolean;
  condominioId: string;
}

// ==========================================
// DIÁRIO DO SÍNDICO / FEED CRONOLÓGICO DE ATIVIDADES
// ==========================================
export type TipoAtividade = 
  | 'morador_novo'
  | 'morador_atualizado'
  | 'reclamacao_aberta'
  | 'reclamacao_resolvida'
  | 'reparo_aberto'
  | 'reparo_orcamento'
  | 'reparo_concluido'
  | 'reserva_solicitada'
  | 'reserva_cancelada'
  | 'mudanca_agendada'
  | 'mudanca_aprovada'
  | 'mudanca_recusada'
  | 'assembleia_publicada'
  | 'evento_criado'
  | 'enjoei_publicado'
  | 'financeiro_lancamento'
  | 'aviso_geral'
  | 'seguranca_acesso';

export interface RegistroAtividade {
  id: string;
  dataHora: string;       // "31/08/2026 14:30"
  dataIso: string;        // "2026-08-31"
  hora: string;           // "14:30"
  tipo: TipoAtividade;
  titulo: string;
  descricao: string;
  autorNome: string;
  autorUnidade?: string;
  autorFoto?: string;
  autorTipo: 'morador' | 'admin' | 'sistema' | 'portaria';
  linkTela?: string;      // ID da tela para navegação rápida
  categoriaBadge?: string;
  condominioId: string;
}

// ==========================================
// MÓDULO DE GESTÃO & AGENDAMENTO DE MUDANÇAS
// ==========================================
export type TipoMudanca = 'Entrada (Novo Morador)' | 'Saída (Desocupação)' | 'Carreto / Mobília Pesada';
export type StatusMudanca = 'Pendente de Aprovação' | 'Confirmada' | 'Recusada' | 'Concluída';

export interface MudancaAgendamento {
  id: string;
  moradorId: string;
  moradorNome: string;
  moradorTelefone?: string;
  unidade: string;
  bloco?: string;
  tipo: TipoMudanca;
  dataMudanca: string;    // "15/09/2026"
  dataMudancaIso: string; // "2026-09-15"
  periodo: 'Manhã (08h às 13h)' | 'Tarde (13h às 18h)' | 'Integral (08h às 17h)';
  status: StatusMudanca;
  motivoRecusa?: string;
  transportadora?: string;
  placaVeiculo?: string;
  nomeMotorista?: string;
  rgMotorista?: string;
  precisaElevadorServico: boolean;
  precisaAcolchoamentoElevador: boolean;
  termoCienciaAssinado: boolean;
  observacoes?: string;
  criadoEm: string;
  condominioId: string;
}

export interface RegrasMudancaConfig {
  horarioSegundaSexta: string;
  horarioSabado: string;
  domingosFeriadosPermitido: boolean;
  antecedenciaMinimaDias: number;
  taxaMudanca?: number;
  regrasGerais: string[];
}



