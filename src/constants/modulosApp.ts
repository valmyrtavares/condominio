import { EspinhaDorsalItem } from '../types';

export const ESPINHA_DORSAL_ITEMS: EspinhaDorsalItem[] = [
  {
    id: 'moradores',
    titulo: 'Moradores',
    icone: 'Users',
    descricaoCurta: 'Dados dos moradores do apartamento, imagens, vagas de garagem, profissões e hobbies.',
    desdobramentos: ['Número do apartamento', 'Senha / Status morador', 'Profissão & Hobby', 'Aniversário & Vaga'],
    rota: '/moradores',
    destaquePoC: true
  },
  {
    id: 'servicos-moradores',
    titulo: 'Serviços de moradores',
    icone: 'Briefcase',
    descricaoCurta: 'Painel onde cada morador pode ofertar serviços como reparos, limpeza e advocacia.',
    desdobramentos: ['Mural de anúncios', 'Contratos internos', 'Categorias de serviços'],
    rota: '/servicos-moradores'
  },
  {
    id: 'funcionarios',
    titulo: 'Funcionários',
    icone: 'UserCheck',
    descricaoCurta: 'Quadro de funcionários com funções, imagens, horários e avaliações de desempenho.',
    desdobramentos: ['Escalas de trabalho', 'Quadro de notas 1 a 5', 'Comentários da zeladoria'],
    rota: '/funcionarios'
  },
  {
    id: 'reclamacoes',
    titulo: 'Reclamações',
    icone: 'AlertTriangle',
    descricaoCurta: 'Lista com categorias (barulho, sujeira, pets, garagem). Função de Apoiar e Comentar.',
    desdobramentos: ['Botão Apoiar (Endossar)', 'Comentários oficiais', 'Vínculo com Reparo'],
    rota: '/reclamacoes',
    destaquePoC: true
  },
  {
    id: 'eventos',
    titulo: 'Eventos & Celebrações',
    icone: 'Calendar',
    descricaoCurta: 'Mural de eventos públicos do condomínio e celebrações privadas com data e detalhes.',
    desdobramentos: ['Públicos e Privados', 'Cards expansíveis com fotos', 'Confirmação de presença'],
    rota: '/eventos',
    destaquePoC: true
  },
  {
    id: 'assembleias',
    titulo: 'Assembleias',
    icone: 'Gavel',
    descricaoCurta: 'Pautas para discussão, votações com checks e publicação oficial da ata em PDF.',
    desdobramentos: ['Agendadas e Realizadas', 'Pautas e deliberações com check', 'Ata oficial com PDF'],
    rota: '/assembleias',
    destaquePoC: true
  },
  {
    id: 'regras-condominio',
    titulo: 'Regras do Condomínio',
    icone: 'BookOpen',
    descricaoCurta: 'Manual de convivência, regras de convivência, barulho, mudanças e áreas comuns.',
    desdobramentos: ['Regulamento interno', 'Tópicos categorizados', 'Horários e penalidades'],
    rota: '/regras-condominio'
  },
  {
    id: 'reparos',
    titulo: 'Reparos & Obras',
    icone: 'Wrench',
    descricaoCurta: 'Painel de cotações de prestadores, orçamentos tripartites e cronograma físico da obra.',
    desdobramentos: ['Propostas de empresas', 'Pequeno, Médio e Grande porte', 'Timeline de execução'],
    rota: '/reparos',
    destaquePoC: true
  },
  {
    id: 'benfeitorias',
    titulo: 'Benfeitorias Realizadas',
    icone: 'Sparkles',
    descricaoCurta: 'Espaço de valorização da gestão com melhorias entregues, economia gerada e fotos.',
    desdobramentos: ['Investimento vs Economia', 'Grandes reformas', 'Áreas modernizadas'],
    rota: '/benfeitorias',
    destaquePoC: true
  },
  {
    id: 'vagas-garagem',
    titulo: 'Vagas de Garagem',
    icone: 'Car',
    descricaoCurta: 'Gestão visual das garagens, veículos dos condôminos e mural para aluguel ou troca de vagas.',
    desdobramentos: ['Mapa de vagas livres/ocupadas', 'Carros e motos cadastrados', 'Locação entre vizinhos'],
    rota: '/vagas-garagem',
    destaquePoC: true
  },
  {
    id: 'servicos-contratados',
    titulo: 'Serviços Contratados',
    icone: 'ShieldCheck',
    descricaoCurta: 'Relação de empresas terceirizadas, contratos de manutenção preventiva e contatos úteis.',
    desdobramentos: ['Elevadores, Gerador, Portaria', 'Valores e periodicidade', 'Telefones de emergência'],
    rota: '/servicos-contratados',
    destaquePoC: true
  },
  {
    id: 'dependencias',
    titulo: 'Dependências & Reservas',
    icone: 'Coffee',
    descricaoCurta: 'Reserva online de salão de festas, churrasqueiras e espaços comuns com regulamento.',
    desdobramentos: ['Calendário por data e turno', 'Taxas de limpeza e regras', 'Lista de convidados'],
    rota: '/dependencias',
    destaquePoC: true
  },
  {
    id: 'unidades-disponiveis',
    titulo: 'Imóveis no Prédio',
    icone: 'Building',
    descricaoCurta: 'Classificados internos de apartamentos disponíveis para venda ou locação no condomínio.',
    desdobramentos: ['Imóveis dos proprietários', 'Contato direto sem intermediação', 'Fotos e metragens'],
    rota: '/unidades-disponiveis',
    destaquePoC: true
  },
  {
    id: 'enjoei',
    titulo: 'Enjoei / Desapego',
    icone: 'ShoppingBag',
    descricaoCurta: 'Classificados de compra, venda, doação ou empréstimo de itens entre vizinhos.',
    desdobramentos: ['Móveis, eletros e utilidades', 'Preço ou Grátis/Doação', 'Contato via WhatsApp'],
    rota: '/enjoei',
    destaquePoC: true
  },
  {
    id: 'diario-sindico',
    titulo: 'Diário do Síndico',
    icone: 'CalendarDays',
    descricaoCurta: 'Feed diário das vistorias, manutenções rotineiras e intercorrências registradas pela gestão.',
    desdobramentos: ['Checklist matinal e vespertino', 'Fotos de constatações', 'Visibilidade para moradores'],
    rota: '/diario-sindico',
    destaquePoC: true
  },
  {
    id: 'mudancas',
    titulo: 'Mudanças & Carretos',
    icone: 'Truck',
    descricaoCurta: 'Agendamento prévio com reserva de elevador de serviço e regras de dias e horários.',
    desdobramentos: ['Horários permitidos', 'Checklist de vistoria', 'Controle da portaria'],
    rota: '/mudancas',
    destaquePoC: true
  },
  {
    id: 'portaria',
    titulo: 'Entregas & Portaria',
    icone: 'Package',
    descricaoCurta: 'Aviso imediato de encomendas recebidas e liberação expressa de visitantes e prestadores.',
    desdobramentos: ['Aviso de pacotes por unidade', 'Autorização de entrada antecipada', 'Baixa de retirada'],
    rota: '/portaria',
    destaquePoC: true
  },
  {
    id: 'prestacao-contas',
    titulo: 'Prestação de Contas',
    icone: 'FileText',
    descricaoCurta: 'Demonstrativo financeiro mensal das receitas ordinárias e despesas com notas fiscais.',
    desdobramentos: ['Receitas vs Despesas', 'Visualização de comprovantes', 'Histórico mês a mês'],
    rota: '/prestacao-contas',
    destaquePoC: true
  }
];
