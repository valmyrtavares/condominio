export type RouteAuthRequirement = 'public' | 'resident' | 'admin';

export interface RouteConfig {
  id: string;
  path: string;
  aliases?: string[];
  title: string;
  auth: RouteAuthRequirement;
}

export const ROUTES: RouteConfig[] = [
  { id: 'home', path: '/', aliases: ['/home'], title: 'Início', auth: 'public' },
  { id: 'resident-login', path: '/login', aliases: ['/resident-login', '/entrar'], title: 'Login do Morador', auth: 'public' },
  { id: 'resident-register', path: '/cadastro', aliases: ['/resident-register'], title: 'Cadastro de Morador', auth: 'public' },
  
  // Admin Routes
  { id: 'admin', path: '/admin', aliases: ['/admin/painel'], title: 'Painel do Administrador', auth: 'admin' },
  { id: 'admin-login', path: '/admin/login', aliases: ['/admin-login'], title: 'Login da Administração', auth: 'public' },
  
  // Resident Protected Modules
  { id: 'regras-condominio', path: '/regras-condominio', aliases: ['/regras', '/regulamento'], title: 'Regras do Condomínio', auth: 'resident' },
  { id: 'moradores', path: '/moradores', aliases: ['/vizinhos'], title: 'Moradores', auth: 'resident' },
  { id: 'reclamacoes', path: '/reclamacoes', aliases: ['/ocorrencias'], title: 'Reclamações & Ocorrências', auth: 'resident' },
  { id: 'reparos', path: '/reparos', aliases: ['/manutencoes'], title: 'Reparos & Manutenções', auth: 'resident' },
  { id: 'prestacao-contas', path: '/prestacao-contas', aliases: ['/financeiro', '/contas'], title: 'Prestação de Contas', auth: 'resident' },
  { id: 'benfeitorias', path: '/benfeitorias', aliases: ['/melhorias'], title: 'Benfeitorias', auth: 'resident' },
  { id: 'vagas-garagem', path: '/vagas-garagem', aliases: ['/garagem', '/vagas'], title: 'Vagas de Garagem', auth: 'resident' },
  { id: 'servicos-contratados', path: '/servicos-contratados', aliases: ['/contratos'], title: 'Serviços Contratados', auth: 'resident' },
  { id: 'dependencias', path: '/dependencias', aliases: ['/reservas', '/espacos'], title: 'Dependências & Reservas', auth: 'resident' },
  { id: 'assembleias', path: '/assembleias', aliases: ['/reunioes', '/atas'], title: 'Assembleias', auth: 'resident' },
  { id: 'eventos', path: '/eventos', aliases: ['/calendario'], title: 'Eventos do Condomínio', auth: 'resident' },
  { id: 'funcionarios', path: '/funcionarios', aliases: ['/equipe', '/colaboradores'], title: 'Quadro de Funcionários', auth: 'resident' },
  { id: 'unidades-disponiveis', path: '/unidades-disponiveis', aliases: ['/imoveis', '/aluguel', '/venda'], title: 'Unidades Disponíveis', auth: 'resident' },
  { id: 'servicos-moradores', path: '/servicos-moradores', aliases: ['/anuncios', '/classificados'], title: 'Serviços dos Moradores', auth: 'resident' },
  { id: 'enjoei', path: '/enjoei', aliases: ['/desapego', '/trocas', '/bazar'], title: 'Enjoei do Condomínio', auth: 'resident' },
  { id: 'mudancas', path: '/mudancas', aliases: ['/mudanca', '/carretos', '/fretes'], title: 'Mudanças & Carretos', auth: 'resident' },
  { id: 'diario-sindico', path: '/diario-sindico', aliases: ['/diario', '/ocorrencias-diarias', '/feed-atividades'], title: 'Diário do Síndico', auth: 'admin' },
  { id: 'portaria', path: '/portaria', aliases: ['/entregas', '/encomendas', '/acessos', '/visitas'], title: 'Entregas & Portaria', auth: 'resident' }
];

/**
 * Converte um caminho de URL para o ID da tela correspondente
 */
export const getScreenFromPath = (pathname: string): { screen: string; route?: RouteConfig } => {
  const cleanPath = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  
  for (const route of ROUTES) {
    if (route.path === cleanPath || (route.aliases && route.aliases.includes(cleanPath))) {
      return { screen: route.id, route };
    }
  }

  // Se não encontrar rota exata, tenta correspondência por screen ID
  const directId = cleanPath.replace(/^\//, '');
  const matchingRoute = ROUTES.find(r => r.id === directId);
  if (matchingRoute) {
    return { screen: matchingRoute.id, route: matchingRoute };
  }

  return { screen: 'home', route: ROUTES[0] };
};

/**
 * Converte o ID de uma tela no caminho canônico de URL
 */
export const getPathFromScreen = (screenId: string): string => {
  const route = ROUTES.find(r => r.id === screenId);
  if (route) return route.path;
  return `/${screenId}`;
};

/**
 * Obtém a configuração de autorização de uma tela
 */
export const getRouteConfig = (screenId: string): RouteConfig | undefined => {
  return ROUTES.find(r => r.id === screenId);
};
