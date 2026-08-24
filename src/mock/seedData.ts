import { User, Unidade, Reclamacao, Reparo, PrestacaoContas, Funcionario, EspinhaDorsalItem } from '../types';

export const CURRENT_CONDO_ID = 'condo-jardim-paulista';

export const MOCK_USERS: User[] = [
  // Unit 102
  {
    id: 'usr-morador-102',
    nome: 'Marcos Almeida',
    email: 'marcos.almeida@email.com',
    role: 'morador',
    unidade: '102',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    profissao: 'Administrador de Empresas',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-sandra-102',
    nome: 'Sandra Almeida',
    email: 'sandra.almeida@email.com',
    role: 'morador',
    unidade: '102',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    profissao: 'Designer Gráfica',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-lucas-102',
    nome: 'Lucas Almeida',
    email: 'lucas.almeida@email.com',
    role: 'morador',
    unidade: '102',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    profissao: 'Estudante',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-giulia-102',
    nome: 'Giulia Almeida',
    email: 'giulia.almeida@email.com',
    role: 'morador',
    unidade: '102',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    profissao: 'Estudante',
    condominioId: CURRENT_CONDO_ID
  },
  // Unit 401
  {
    id: 'usr-admin-401',
    nome: 'Dra. Mariana Costa',
    email: 'mariana.costa@jardimpaulista.com.br',
    role: 'subsindico',
    unidade: '401',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    profissao: 'Advogada & Subsíndica',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-sofia-401',
    nome: 'Sofia Costa',
    email: 'sofia.costa@email.com',
    role: 'morador',
    unidade: '401',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    profissao: 'Estudante',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-tobias-401',
    nome: 'Tobias (Cachorro)',
    email: 'tobias.dog@email.com',
    role: 'morador',
    unidade: '401',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80',
    profissao: 'Pet da Família',
    condominioId: CURRENT_CONDO_ID
  },
  // Unit 101
  {
    id: 'usr-morador-101',
    nome: 'Renato Alencar',
    email: 'renato.alencar@email.com',
    role: 'morador',
    unidade: '101',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    profissao: 'Arquiteto',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-camila-101',
    nome: 'Camila Alencar',
    email: 'camila.alencar@email.com',
    role: 'morador',
    unidade: '101',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    profissao: 'Fisioterapeuta',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-leo-101',
    nome: 'Leo Alencar',
    email: 'leo.alencar@email.com',
    role: 'morador',
    unidade: '101',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80',
    profissao: 'Estudante',
    condominioId: CURRENT_CONDO_ID
  },
  // Unit 201
  {
    id: 'usr-morador-201',
    nome: 'João Carlos',
    email: 'joao.carlos@email.com',
    role: 'morador',
    unidade: '201',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    profissao: 'Médico',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-luiz-201',
    nome: 'Luiz Souza',
    email: 'luiz.souza@email.com',
    role: 'morador',
    unidade: '201',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    profissao: 'Arquiteto',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-miumiu-201',
    nome: 'Miu Miu (Gato)',
    email: 'miumiu.cat@email.com',
    role: 'morador',
    unidade: '201',
    bloco: 'Bloco A',
    foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80',
    profissao: 'Pet da Família',
    condominioId: CURRENT_CONDO_ID
  },
  // Unit 302
  {
    id: 'usr-morador-302',
    nome: 'Eduardo Prado',
    email: 'eduardo.prado@email.com',
    role: 'morador',
    unidade: '302',
    bloco: 'Bloco B',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    profissao: 'Professor Universitário',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-clara-302',
    nome: 'Clara Prado',
    email: 'clara.prado@email.com',
    role: 'morador',
    unidade: '302',
    bloco: 'Bloco B',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    profissao: 'Jornalista',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'usr-felipe-302',
    nome: 'Felipe Prado',
    email: 'felipe.prado@email.com',
    role: 'morador',
    unidade: '302',
    bloco: 'Bloco B',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    profissao: 'Designer',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_UNIDADES: Unidade[] = [
  {
    id: 'unid-101',
    numero: '101',
    bloco: 'Bloco A',
    tipo: 'Apartamento',
    vagaGaragem: 'G-11',
    moradores: [MOCK_USERS[7], MOCK_USERS[8], MOCK_USERS[9]],
    fotoCelula: '/family_101.jpg',
    nomeCelula: 'Renato Alencar, Camila Alencar & Leo'
  },
  {
    id: 'unid-102',
    numero: '102',
    bloco: 'Bloco A',
    tipo: 'Apartamento',
    vagaGaragem: 'G-12',
    moradores: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3]],
    fotoCelula: '/family_102.jpg',
    nomeCelula: 'Família Almeida'
  },
  {
    id: 'unid-201',
    numero: '201',
    bloco: 'Bloco A',
    tipo: 'Apartamento',
    vagaGaragem: 'G-21',
    moradores: [MOCK_USERS[10], MOCK_USERS[11], MOCK_USERS[12]],
    fotoCelula: '/couple_201.jpg',
    nomeCelula: 'João Carlos, Luiz Souza & Miu Miu'
  },
  {
    id: 'unid-302',
    numero: '302',
    bloco: 'Bloco B',
    tipo: 'Apartamento',
    vagaGaragem: 'G-32',
    moradores: [MOCK_USERS[13], MOCK_USERS[14], MOCK_USERS[15]],
    fotoCelula: '/siblings_302.jpg',
    nomeCelula: 'Eduardo Prado, Clara Prado & Felipe'
  },
  {
    id: 'unid-401',
    numero: '401',
    bloco: 'Bloco A',
    tipo: 'Cobertura',
    vagaGaragem: 'G-41',
    moradores: [MOCK_USERS[4], MOCK_USERS[5], MOCK_USERS[6]],
    fotoCelula: '/family_401.jpg',
    nomeCelula: 'Dra. Mariana Costa, Sofia Costa & Tobias'
  }
];

export const MOCK_RECLAMACOES: Reclamacao[] = [
  {
    id: 'rec-portao-garagem',
    titulo: 'Portão da garagem apresentando falhas e travamento parcial',
    descricao: 'O portão automático principal da garagem (entrada Bloco A) está travando no meio do curso e emitindo um ruído metálico forte ao abrir. Há risco de ficar preso ou fechar acidentalmente sobre algum veículo.',
    categoria: 'Garagem',
    autorId: 'usr-morador-102',
    autorNome: 'Carlos Eduardo Silva',
    autorUnidade: 'Apt 102 - Bloco A',
    data: '12/08/2026 às 08:30',
    status: 'Em andamento',
    apoiosCount: 14,
    apoiadoPeloUsuario: false,
    reparoId: 'rep-motor-portao',
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-1',
        autorId: 'usr-morador-201',
        autorNome: 'Beatriz Souza',
        autorRole: 'morador',
        autorUnidade: 'Apt 201',
        autorFoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        texto: 'Aconteceu comigo hoje de manhã! O portão subiu até a metade e parou. Tivemos que esperar 10 minutos.',
        data: '12/08/2026 às 09:15'
      },
      {
        id: 'com-2',
        autorId: 'usr-morador-101',
        autorNome: 'Renato Alencar',
        autorRole: 'morador',
        autorUnidade: 'Apt 101',
        autorFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        texto: 'Apoio totalmente a manutenção rápida antes que quebre de vez e a substituição seja mais cara.',
        data: '12/08/2026 às 10:04'
      },
      {
        id: 'com-3',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'Comunicado Oficial: A administração já acionou 3 empresas especializadas para envio imediato de orçamentos técnicos de reparo do motor. Acompanhem pela aba de Reparos!',
        data: '13/08/2026 às 11:30',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-infiltracao-garagem',
    titulo: 'Ponto de goteira/infiltração no teto do Subsolo 2',
    descricao: 'Notado acúmulo de água próximo às vagas G-30 e G-31 após as chuvas de ontem. Parece vir da tubulação da área de lazer.',
    categoria: 'Manutenção',
    autorId: 'usr-morador-302',
    autorNome: 'Eduardo Prado',
    autorUnidade: 'Apt 302 - Bloco B',
    data: '18/08/2026 às 19:10',
    status: 'Em análise',
    apoiosCount: 6,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: []
  },
  {
    id: 'rec-barulho-gourmet',
    titulo: 'Música elevada na área Gourmet após as 22h no sábado',
    descricao: 'Uso do som em volume incompatível com o regulamento interno após o horário de silêncio.',
    categoria: 'Barulho',
    autorId: 'usr-morador-101',
    autorNome: 'Renato Alencar',
    autorUnidade: 'Apt 101 - Bloco A',
    data: '16/08/2026 às 23:45',
    status: 'Resolvida',
    apoiosCount: 4,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: []
  }
];

export const MOCK_REPAROS: Reparo[] = [
  {
    id: 'rep-motor-portao',
    reclamacaoId: 'rec-portao-garagem',
    titulo: 'Manutenção preventiva e substituição do motor do portão principal',
    descricao: 'Troca da engrenagem do fuso, placa de controle inversora e lubrificação técnica dos trilhos de corrediça do portão da garagem do Bloco A.',
    categoria: 'Garagem / Segurança',
    solicitanteNome: 'Carlos Eduardo Silva (Originado de Reclamação)',
    solicitanteUnidade: 'Apt 102 - Bloco A',
    dataSolicitacao: '12/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Automatiza Tech Condominial',
    valorFinal: 1850.00,
    status: 'Aprovado',
    condominioId: CURRENT_CONDO_ID,
    orcamentos: [
      {
        id: 'orc-1',
        empresa: 'Portões & Cia Ltda',
        siteUrl: 'https://portoesecia.exemplo.com.br',
        cnpj: '12.345.678/0001-90',
        valor: 2100.00,
        descricao: 'Substituição completa por motor Rossi Ninja 1/3hp + mão de obra.',
        prazoDias: 3,
        selecionado: false
      },
      {
        id: 'orc-2',
        empresa: 'Automatiza Tech Condominial',
        siteUrl: 'https://automatizatech.exemplo.com.br',
        cnpj: '98.765.432/0001-11',
        valor: 1850.00,
        descricao: 'Motor industrial PPA JetFlex de alta velocidade + substituição de roletes blindados e garantia de 12 meses.',
        prazoDias: 2,
        selecionado: true
      },
      {
        id: 'orc-3',
        empresa: 'Serviços Seguras SP',
        siteUrl: 'https://segurassp.exemplo.com.br',
        cnpj: '45.888.999/0001-33',
        valor: 2300.00,
        descricao: 'Kit automatizador deslizante reforçado + sensores antiesmagamento.',
        prazoDias: 5,
        selecionado: false
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        data: '12/08/2026',
        titulo: 'Reclamação Registrada',
        descricao: 'Morador Carlos Silva registrou o problema com travamento no portão.',
        autorRole: 'morador'
      },
      {
        id: 'tl-2',
        data: '13/08/2026',
        titulo: 'Análise Técnica Inicial',
        descricao: 'Zeladoria inspecionou e constatou desgaste crítico na engrenagem principal.',
        autorRole: 'subsindico'
      },
      {
        id: 'tl-3',
        data: '14/08/2026',
        titulo: 'Tomada de Orçamentos',
        descricao: 'Obtidos 3 orçamentos comparativos de empresas credenciadas.',
        autorRole: 'subsindico'
      },
      {
        id: 'tl-4',
        data: '15/08/2026',
        titulo: 'Aprovação do Orçamento',
        descricao: 'Proposta da Automatiza Tech (R$ 1.850,00) aprovada por apresentar melhor prazo (2 dias) e garantia de 12 meses.',
        autorRole: 'subsindico',
        statusAlvo: 'Aprovado'
      },
      {
        id: 'tl-5',
        data: '17/08/2026',
        titulo: 'Agendamento Técnico',
        descricao: 'Equipe técnica agendada para realização do serviço na quinta-feira das 09h às 12h.',
        autorRole: 'subsindico',
        statusAlvo: 'Agendado'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80'
    ],
    fotosDepois: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

export const MOCK_PRESTACAO_CONTAS: PrestacaoContas = {
  id: 'pc-abril-2026',
  mesAno: 'Abril / 2026',
  receitasTotal: 82400.00,
  despesasTotal: 60700.00,
  saldo: 21700.00,
  condominioId: CURRENT_CONDO_ID,
  despesas: [
    {
      id: 'desp-1',
      categoria: 'Manutenção & Reparos',
      descricao: 'Manutenção do Motor do Portão da Garagem (Bloco A)',
      valor: 1850.00,
      data: '19/04/2026',
      fornecedor: 'Automatiza Tech Condominial (Nota Fiscal #4892)',
      reparoId: 'rep-motor-portao',
      comprovanteUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'desp-2',
      categoria: 'Segurança & Portaria',
      descricao: 'Folha de pagamento empresa de portaria 24h',
      valor: 28400.00,
      data: '05/04/2026',
      fornecedor: 'Grupo Delta Segurança Patrimonial'
    },
    {
      id: 'desp-3',
      categoria: 'Energia Elétrica',
      descricao: 'Conta de luz áreas comuns e subsolos',
      valor: 9250.00,
      data: '10/04/2026',
      fornecedor: 'ENEL Distribuição São Paulo'
    },
    {
      id: 'desp-4',
      categoria: 'Água e Esgoto',
      descricao: 'Consumo de água condomínio',
      valor: 6800.00,
      data: '12/04/2026',
      fornecedor: 'SABESP'
    },
    {
      id: 'desp-5',
      categoria: 'Limpeza & Conservação',
      descricao: 'Insumos de limpeza mensal e produtos de piscina',
      valor: 3400.00,
      data: '15/04/2026',
      fornecedor: 'Alvorada Distribuidora de Limpeza'
    },
    {
      id: 'desp-6',
      categoria: 'Elevadores',
      descricao: 'Contrato mensal de manutenção preventiva dos elevadores',
      valor: 4100.00,
      data: '20/04/2026',
      fornecedor: 'Atlas Schindler S.A.'
    },
    {
      id: 'desp-7',
      categoria: 'Jardinagem & Paisagismo',
      descricao: 'Poda de árvores internas e adubação floreiras',
      valor: 2900.00,
      data: '22/04/2026',
      fornecedor: 'Verde Vida Paisagismo'
    }
  ]
};

export const MOCK_FUNCIONARIOS: Funcionario[] = [
  {
    id: 'func-1',
    nome: 'Seu Osvaldo Ribeiro',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    funcao: 'Porteiro Noturno (Escala 12x36)',
    horario: '19:00 - 07:00',
    disponibilidade: 'Segunda, Quarta, Sexta e Domingos alternados',
    avaliacoesCount: 28,
    mediaNota: 4.9,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-2',
    nome: 'Maria das Graças Oliveira',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    funcao: 'Zeladora Chefe',
    horario: '08:00 - 17:00',
    disponibilidade: 'Segunda a Sexta e Sábado até 12:00',
    avaliacoesCount: 42,
    mediaNota: 5.0,
    condominioId: CURRENT_CONDO_ID
  }
];

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
    titulo: 'Eventos',
    icone: 'Calendar',
    descricaoCurta: 'Eventos como caixinha de natal, dia dos pais e assembleias abertas aos moradores.',
    desdobramentos: ['Postado por admins', 'Datas e horários', 'Local e confirmações'],
    rota: '/eventos'
  },
  {
    id: 'assembleias',
    titulo: 'Assembleias',
    icone: 'Gavel',
    descricaoCurta: 'Pautas para discussão, votações abertas e publicação da ata final acordada.',
    desdobramentos: ['Data e horário', 'Serviços/reparos em pauta', 'Ata com resumo do acordado'],
    rota: '/assembleias'
  },
  {
    id: 'benfeitorias',
    titulo: 'Benfeitorias',
    icone: 'Sparkles',
    descricaoCurta: 'Novidades de novos serviços, aquisições e reformas com fotos, comentários e regras.',
    desdobramentos: ['Fotos antes/depois', 'Regras de uso', 'Vínculo com serviços concluídos'],
    rota: '/benfeitorias'
  },
  {
    id: 'reparos',
    titulo: 'Reparos',
    icone: 'Wrench',
    descricaoCurta: 'Registro de lâmpadas, elevador, portão. Evolução de status e linha do tempo.',
    desdobramentos: ['Aguardando conserto', 'Registro do reparo feito', 'Timeline de atualização'],
    rota: '/reparos',
    destaquePoC: true
  },
  {
    id: 'regras-condominio',
    titulo: 'Regras do condomínio',
    icone: 'BookOpen',
    descricaoCurta: 'Regulamento interno com assistente de IA para responder perguntas objetivas.',
    desdobramentos: ['Convenção do condomínio', 'Consulta via IA em tempo real', 'Artigos e incisos'],
    rota: '/regras-condominio'
  },
  {
    id: 'dependencias',
    titulo: 'Dependência do condomínio',
    icone: 'Building2',
    descricaoCurta: 'Salão de festas, churrasqueira e piscina com regras, disponibilidade e agendamentos.',
    desdobramentos: ['Preços de aluguel', 'Regras de uso', 'Agenda de disponibilidade'],
    rota: '/dependencias'
  },
  {
    id: 'vagas-garagem',
    titulo: 'Vagas de garagem',
    icone: 'Car',
    descricaoCurta: 'Mapeamento completo das vagas de garagem vinculadas a cada apartamento.',
    desdobramentos: ['Número da vaga', 'Subsolo 1 e 2', 'Status de uso'],
    rota: '/vagas-garagem'
  },
  {
    id: 'servicos-contratados',
    titulo: 'Serviços contratados pelo condomínio',
    icone: 'FileText',
    descricaoCurta: 'Serviços pendentes em amarelo com 3 orçamentos concorrentes (com link de site).',
    desdobramentos: ['3 Orçamentos com link do site', 'Datas de pagamento', 'Link para benfeitorias'],
    rota: '/servicos-contratados',
    destaquePoC: true
  },
  {
    id: 'prestacao-contas',
    titulo: 'Prestação de conta mês a mês',
    icone: 'PieChart',
    descricaoCurta: 'Lista mês a mês de tudo que foi gasto e arrecadado com máxima transparência.',
    desdobramentos: ['Entradas (Receitas)', 'Saídas (Despesas)', 'Detalhamento por nota fiscal'],
    rota: '/prestacao-contas',
    destaquePoC: true
  }
];
