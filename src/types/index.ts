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

export interface Funcionario {
  id: string;
  nome: string;
  foto: string;
  funcao: string;
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
  | 'Garagem' 
  | 'Segurança' 
  | 'Limpeza' 
  | 'Barulho' 
  | 'Ameaça' 
  | 'Assédio'
  | 'Animais Domésticos'
  | 'Brigas' 
  | 'Pets' 
  | 'Manutenção' 
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
  categoria: string;
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
  fotosDepois: string[];
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
