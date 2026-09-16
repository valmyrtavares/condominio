import { AdminModuloKey } from '../types';

export interface AdminModuloConfig {
  key: AdminModuloKey;
  numero: number;
  titulo: string;
  subtitulo: string;
  icone: string;
  corBadge: string;
  categoria: 'operacional' | 'gestao' | 'social';
}

export const ADMIN_MODULOS_LIST: AdminModuloConfig[] = [
  {
    key: 'unidades',
    numero: 1,
    titulo: 'Unidades e moradores',
    subtitulo: 'Cadastro de apartamentos, vagas e reset de senhas de moradores',
    icone: 'Building',
    corBadge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    categoria: 'gestao'
  },
  {
    key: 'equipe',
    numero: 2,
    titulo: 'Equipe e gestão de acessos',
    subtitulo: 'Cadastro de colaboradores, permissões de abas e equipe de gestão',
    icone: 'Users',
    corBadge: 'bg-amber-100 text-amber-950 border-amber-300',
    categoria: 'gestao'
  },
  {
    key: 'servicos',
    numero: 3,
    titulo: 'Anuncios de moradores',
    subtitulo: 'Aprovação e moderação do catálogo de serviços profissionais',
    icone: 'Briefcase',
    corBadge: 'bg-yellow-100 text-yellow-950 border-yellow-300',
    categoria: 'social'
  },
  {
    key: 'eventos',
    numero: 4,
    titulo: 'Eventos e Mural de comunitário',
    subtitulo: 'Aprovação de eventos e festas no mural coletivo',
    icone: 'PartyPopper',
    corBadge: 'bg-sky-100 text-sky-950 border-sky-300',
    categoria: 'social'
  },
  {
    key: 'assembleias',
    numero: 5,
    titulo: 'Assembleias e reuniões informais',
    subtitulo: 'Convocação de editais, votações e atas oficiais registradas',
    icone: 'Gavel',
    corBadge: 'bg-rose-100 text-rose-950 border-rose-300',
    categoria: 'gestao'
  },
  {
    key: 'reclamacoes',
    numero: 6,
    titulo: 'Reclamações e ocorrencias',
    subtitulo: 'Análise, respostas e moderação de ocorrências dos moradores',
    icone: 'AlertTriangle',
    corBadge: 'bg-orange-100 text-orange-950 border-orange-300',
    categoria: 'gestao'
  },
  {
    key: 'reparos',
    numero: 7,
    titulo: 'Reparos e manutenções',
    subtitulo: 'Acompanhamento de chamados de manutenção predial e cotações',
    icone: 'Wrench',
    corBadge: 'bg-teal-100 text-teal-950 border-teal-300',
    categoria: 'operacional'
  },
  {
    key: 'financeiro',
    numero: 8,
    titulo: 'Prestação de contas',
    subtitulo: 'Entradas, saídas, boletos e relatórios contábeis do condomínio',
    icone: 'DollarSign',
    corBadge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    categoria: 'gestao'
  },
  {
    key: 'regras',
    numero: 9,
    titulo: 'Regulamentos',
    subtitulo: 'Edição das normas de convivência e regimento interno',
    icone: 'Scale',
    corBadge: 'bg-purple-100 text-purple-950 border-purple-300',
    categoria: 'gestao'
  },
  {
    key: 'imoveis',
    numero: 10,
    titulo: 'Aluguel e venda',
    subtitulo: 'Classificados oficiais de imóveis disponíveis no prédio',
    icone: 'Home',
    corBadge: 'bg-blue-100 text-blue-950 border-blue-300',
    categoria: 'social'
  },
  {
    key: 'fornecedores',
    numero: 11,
    titulo: 'Fornecedores',
    subtitulo: 'Contratos com empresas de elevador, portaria remota, limpeza, etc.',
    icone: 'Building2',
    corBadge: 'bg-cyan-100 text-cyan-950 border-cyan-300',
    categoria: 'gestao'
  },
  {
    key: 'enjoei',
    numero: 12,
    titulo: 'Enjoei/ trocas e doações',
    subtitulo: 'Moderação de itens desapegados e vendas entre vizinhos',
    icone: 'ShoppingBag',
    corBadge: 'bg-pink-100 text-pink-950 border-pink-300',
    categoria: 'social'
  },
  {
    key: 'dependencias',
    numero: 13,
    titulo: 'Áreas comuns',
    subtitulo: 'Salão de festas, churrasqueiras, piscinas e bloqueios de reservas',
    icone: 'CalendarDays',
    corBadge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    categoria: 'operacional'
  },
  {
    key: 'mudancas',
    numero: 14,
    titulo: 'Mudanças e saídas',
    subtitulo: 'Aprovação de datas, horários e termos de mudança',
    icone: 'Truck',
    corBadge: 'bg-amber-100 text-amber-950 border-amber-300',
    categoria: 'operacional'
  },
  {
    key: 'portaria',
    numero: 15,
    titulo: 'Portaria encomendas/visitas',
    subtitulo: 'Controle de encomendas, visitantes, prestadores e autorizações',
    icone: 'Package',
    corBadge: 'bg-indigo-100 text-indigo-950 border-indigo-300',
    categoria: 'operacional'
  },
  {
    key: 'diario-sindico',
    numero: 0,
    titulo: 'Diário do Síndico & Linha do Tempo',
    subtitulo: 'Histórico cronológico de todos os eventos e registros do condomínio',
    icone: 'BookOpen',
    corBadge: 'bg-indigo-100 text-indigo-950 border-indigo-300',
    categoria: 'gestao'
  }
];

export const PRESET_PERMISSOES: Record<string, { label: string; descricao: string; modulos: AdminModuloKey[] }> = {
  portaria: {
    label: 'Portaria & Entregas',
    descricao: 'Portaria (encomendas/visitas) e Mudanças',
    modulos: ['portaria', 'mudancas']
  },
  zeladoria: {
    label: 'Zeladoria & Manutenções',
    descricao: 'Portaria, Mudanças, Dependências e Reparos',
    modulos: ['portaria', 'mudancas', 'dependencias', 'reparos', 'reclamacoes']
  },
  gestao_total: {
    label: 'Gestão Total (Síndico / Subsíndico)',
    descricao: 'Acesso irrestrito a todos os 16 módulos do sistema',
    modulos: ADMIN_MODULOS_LIST.map(m => m.key)
  },
  social_eventos: {
    label: 'Comissão de Eventos / Social',
    descricao: 'Eventos, Dependências e Enjoei',
    modulos: ['eventos', 'dependencias', 'enjoei', 'servicos']
  },
  limpeza: {
    label: 'Limpeza & Operacional',
    descricao: 'Visualização de Reparos e Dependências',
    modulos: ['reparos', 'dependencias']
  }
};
