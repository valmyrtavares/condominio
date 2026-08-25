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
  tipo: 'Apartamento' | 'Cobertura' | 'Casa';
  vagaGaragem: string;
  moradores: User[];
  fotoCelula?: string;
  nomeCelula?: string;
}

export type CategoriaFuncionario = 'Portaria' | 'Limpeza' | 'Segurança' | 'Gestão';

export interface Funcionario {
  id: string;
  nome: string;
  foto: string;
  funcao: string;
  categoria?: CategoriaFuncionario;
  horario: string;
  disponibilidade: string;
  avaliacoesCount?: number;
  mediaNota?: number;
  condominioId: string;
}

export interface ServicoMorador {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  imagem?: string;
  moradorNome: string;
  moradorUnidade: string;
  contato: string;
  ativo: boolean;
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
  valorFinal?: number;
  orcamentos: Orcamento[];
  status: StatusReparo;
  timeline: TimelineStep[];
  fotosAntes: string[];
  fotosDepois?: string[];
  condominioId: string;
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
  | 'Aguardando propostas' 
  | 'Aguardando avaliação de proposta' 
  | 'Contratada';

export interface PropostaEmpresa {
  id: string;
  empresaNome: string;
  cnpj?: string;
  siteUrl: string;
  valor: number;
  descricao: string;
  formaPagamento: string;
  prazoEntrega: string;
  jaPrestouServico: boolean;
  selecionada: boolean;
}

export interface ServicoContratado {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
  categoria: string;
  status: StatusServicoContratado;
  propostas: PropostaEmpresa[];
  condominioId: string;
  observacoesFinais?: string;
}

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

export interface PautaAssembleia {
  id: string;
  titulo: string;
  descricao: string;
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
}

export interface Assembleia {
  id: string;
  titulo: string;
  tipo: 'Ordinária' | 'Extraordinária';
  dataHora: string;
  local: string;
  primeiraChamada: string;
  segundaChamada: string;
  status: StatusAssembleia;
  descricaoGeral: string;
  pautas: PautaAssembleia[];
  ata?: AtaAssembleia;
  condominioId: string;
}

export type TipoVisibilidadeEvento = 'Público' | 'Privado';

export interface EventoCondominio {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  organizador: string;
  visibilidade: TipoVisibilidadeEvento;
  descricao: string;
  imagem: string;
  linkMaisInfo?: string;
  condominioId: string;
}

export interface DespesaItem {
  id: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  fornecedor: string;
  reparoId?: string;
  comprovanteUrl?: string;
}

export interface ReceitaItem {
  id: string;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  origem: string;
  comprovanteUrl?: string;
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
