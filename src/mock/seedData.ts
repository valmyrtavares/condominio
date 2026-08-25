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
    id: 'rec-barulho-gourmet',
    titulo: 'Música elevada na área Gourmet após as 22h no sábado',
    descricao: 'Uso de caixa de som em volume incompatível com o regulamento interno após o horário de silêncio (estendeu-se até 01h30 da manhã), gerando incômodo aos apartamentos vizinhos. Solicito notificação e reforço das normas.',
    categoria: 'Barulho',
    autorId: 'usr-morador-101',
    autorNome: 'Renato Alencar',
    autorUnidade: 'Apt 101 - Bloco A',
    data: '16/08/2026 às 23:45',
    status: 'Resolvida',
    apoiosCount: 8,
    apoiadoPeloUsuario: true,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-1',
        autorId: 'usr-morador-102',
        autorNome: 'Marcos Almeida',
        autorRole: 'morador',
        autorUnidade: 'Apt 102',
        autorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        texto: 'Também ouvimos claramente daqui. O regulamento estipula silêncio rigoroso após as 22h.',
        data: '17/08/2026 às 08:20'
      },
      {
        id: 'com-2',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'Comunicado Oficial: A unidade locatária do espaço foi advertida formalmente conforme artigo 24 do regulamento interno.',
        data: '17/08/2026 às 11:00',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-seguranca-portao',
    titulo: 'Portão de pedestres deixado destravado e entrada de entregador sem identificação',
    descricao: 'Presenciei moradores deixando o portão social de pedestres aberto com calço para receber entregas. Isso anula a clausura de segurança e coloca em risco todos os condôminos.',
    categoria: 'Segurança',
    autorId: 'usr-morador-102',
    autorNome: 'Marcos Almeida',
    autorUnidade: 'Apt 102 - Bloco A',
    data: '18/08/2026 às 19:30',
    status: 'Em andamento',
    apoiosCount: 14,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-s1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'A portaria foi reorientada sobre o protocolo rígido de clausura. Lembramos que é proibido calçar as portas de acesso.',
        data: '19/08/2026 às 08:00',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-ameaca-garagem',
    titulo: 'Intimidação e ameaça verbal por desacordo de vaga na garagem',
    descricao: 'Ao solicitar a um morador que liberasse a circulação bloqueada por sua caminhonete no subsolo 1, fui vítima de ofensas verbais e intimidações agressivas. Solicito mediação imediata da sindicância e registro no livro de ocorrências.',
    categoria: 'Ameaça',
    autorId: 'usr-morador-302',
    autorNome: 'Eduardo Prado',
    autorUnidade: 'Apt 302 - Bloco B',
    data: '20/08/2026 às 18:45',
    status: 'Em análise',
    apoiosCount: 11,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-am1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'As imagens do CFTV do subsolo foram resguardadas e os envolvidos foram convocados para reunião formal de mediação e aplicação de penalidade.',
        data: '21/08/2026 às 09:15',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-assedio-elevador',
    titulo: 'Abordagem inconveniente e constrangimento no hall do elevador social',
    descricao: 'Relato de comportamento desrespeitoso de intimidação verbal e comentários impróprios dirigidos a moradores ao aguardar o elevador no período noturno. Solicito averiguação rigorosa.',
    categoria: 'Assédio',
    autorId: 'usr-morador-201',
    autorNome: 'Beatriz Souza',
    autorUnidade: 'Apt 201 - Bloco A',
    data: '22/08/2026 às 21:05',
    status: 'Em análise',
    apoiosCount: 16,
    apoiadoPeloUsuario: true,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-a1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'Caso tratado com máxima prioridade e sigilo. O jurídico e a administração já tomaram as medidas cabíveis para garantir a tranquilidade dos moradores.',
        data: '23/08/2026 às 08:30',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-limpeza-corredor',
    titulo: 'Sacos de lixo doméstico deixados no corredor do 3º andar vazando chorume',
    descricao: 'Sacos de lixo orgânico foram deixados no chão do hall dos apartamentos por mais de 24 horas, causando mau odor e sujeira no piso comum. Todo descarte deve ser direcionado à lixeira central.',
    categoria: 'Limpeza',
    autorId: 'usr-morador-302',
    autorNome: 'Eduardo Prado',
    autorUnidade: 'Apt 302 - Bloco B',
    data: '23/08/2026 às 14:15',
    status: 'Resolvida',
    apoiosCount: 7,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-l1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'A equipe de limpeza higienizou o corredor e a unidade responsável foi notificada sobre a proibição de depósito de resíduos nas áreas comuns.',
        data: '23/08/2026 às 16:00',
        oficial: true
      }
    ]
  },
  {
    id: 'rec-pets-parquinho',
    titulo: 'Cachorro de grande porte solto sem coleira/guia na área do parquinho infantil',
    descricao: 'Animal de grande porte estava correndo solto sem guia próximo às crianças no parquinho. É obrigatório o uso de coleira e guia em todas as áreas sociais do condomínio por segurança.',
    categoria: 'Animais Domésticos',
    autorId: 'usr-morador-102',
    autorNome: 'Sandra Almeida',
    autorUnidade: 'Apt 102 - Bloco A',
    data: '24/08/2026 às 17:40',
    status: 'Em andamento',
    apoiosCount: 12,
    apoiadoPeloUsuario: false,
    condominioId: CURRENT_CONDO_ID,
    comentarios: [
      {
        id: 'com-p1',
        autorId: 'usr-morador-101',
        autorNome: 'Camila Alencar',
        autorRole: 'morador',
        autorUnidade: 'Apt 101',
        autorFoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        texto: 'Apoiado! Todos amamos os pets, mas a segurança das crianças e dos próprios animais exige a guia.',
        data: '24/08/2026 às 18:10'
      }
    ]
  }
];

export const MOCK_REPAROS: Reparo[] = [
  {
    id: 'rep-motor-portao',
    titulo: 'Manutenção preventiva e substituição do motor do portão principal',
    descricao: 'Troca da engrenagem do fuso, placa de controle inversora e lubrificação técnica dos trilhos de corrediça do portão da garagem do Bloco A.',
    categoria: 'Portão & Acesso',
    solicitanteNome: 'Zeladoria Condominial',
    solicitanteUnidade: 'Administração',
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
        titulo: 'Vistoria e Registro do Problema',
        descricao: 'Zeladoria constatou travamento intermitente e desgaste no motor do portão.',
        autorRole: 'morador'
      },
      {
        id: 'tl-2',
        data: '13/08/2026',
        titulo: 'Análise Técnica Inicial',
        descricao: 'Técnico inspecionou e constatou desgaste crítico na engrenagem principal.',
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
  },
  {
    id: 'rep-infiltracao-subsolo',
    titulo: 'Impermeabilização e reparo de infiltração no teto do Subsolo 2',
    descricao: 'Tratamento de goteira e infiltração proveniente da junta de dilatação da laje sobre as vagas G-30 e G-31 com injeção de poliuretano impermeabilizante.',
    categoria: 'Estrutura & Hidráulica',
    solicitanteNome: 'Zeladoria',
    solicitanteUnidade: 'Administração',
    dataSolicitacao: '18/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Vedatech Engenharia e Impermeabilizações',
    valorFinal: 3200.00,
    status: 'Orçamento',
    condominioId: CURRENT_CONDO_ID,
    orcamentos: [
      {
        id: 'orc-inf-1',
        empresa: 'Vedatech Engenharia',
        siteUrl: 'https://vedatech.exemplo.com.br',
        cnpj: '33.444.555/0001-22',
        valor: 3200.00,
        descricao: 'Injeção de resina flexível de poliuretano + teste de estanqueidade 5 anos de garantia.',
        prazoDias: 4,
        selecionado: true
      },
      {
        id: 'orc-inf-2',
        empresa: 'ImperSoluções Condomínios',
        siteUrl: 'https://impersolucoes.exemplo.com.br',
        cnpj: '77.888.999/0001-44',
        valor: 3750.00,
        descricao: 'Tratamento de fissuras superficiais e manta asfáltica líquida.',
        prazoDias: 6,
        selecionado: false
      }
    ],
    timeline: [
      {
        id: 'tl-inf-1',
        data: '18/08/2026',
        titulo: 'Vistoria Predial',
        descricao: 'Goteira no subsolo 2 mapeada pela zeladoria após chuva forte.',
        autorRole: 'subsindico'
      },
      {
        id: 'tl-inf-2',
        data: '19/08/2026',
        titulo: 'Coleta de Laudos e Orçamentos',
        descricao: 'Empresas de impermeabilização visitaram o subsolo para diagnóstico.',
        autorRole: 'subsindico'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    fotosDepois: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
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
  receitas: [
    {
      id: 'rec-1',
      categoria: 'Taxa Condominial',
      descricao: 'Arrecadação de Taxa Condominial Ordinária (54 unidades)',
      valor: 72900.00,
      data: '10/04/2026',
      origem: 'Boleto Bancário Bradesco'
    },
    {
      id: 'rec-2',
      categoria: 'Fundo de Reserva',
      descricao: 'Aporte de 5% da cota condominial para o Fundo de Reserva',
      valor: 3645.00,
      data: '10/04/2026',
      origem: 'Rateio Automático Bancário'
    },
    {
      id: 'rec-3',
      categoria: 'Aplicações Financeiras',
      descricao: 'Rendimento de Aplicação Fundo DI / CDB Liquidez Diária',
      valor: 2455.00,
      data: '05/04/2026',
      origem: 'Banco Itaú Personnalité'
    },
    {
      id: 'rec-4',
      categoria: 'Locações & Serviços',
      descricao: 'Taxas de locação do Salão de Festas (3 eventos no mês)',
      valor: 1800.00,
      data: '18/04/2026',
      origem: 'Moradores Apt 102, 302 e 401'
    },
    {
      id: 'rec-5',
      categoria: 'Locações & Serviços',
      descricao: 'Taxas de reserva da Churrasqueira Gourmet (4 reservas)',
      valor: 600.00,
      data: '21/04/2026',
      origem: 'Moradores Diversos'
    },
    {
      id: 'rec-6',
      categoria: 'Multas & Juros',
      descricao: 'Juros e multas de boletos quitados após o vencimento',
      valor: 1000.00,
      data: '25/04/2026',
      origem: 'Cobrança Administrativa'
    }
  ],
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

export const MOCK_MESES_PRESTACAO: Record<string, PrestacaoContas> = {
  'Abril / 2026': MOCK_PRESTACAO_CONTAS,
  'Março / 2026': {
    id: 'pc-marco-2026',
    mesAno: 'Março / 2026',
    receitasTotal: 81200.00,
    despesasTotal: 58900.00,
    saldo: 22300.00,
    condominioId: CURRENT_CONDO_ID,
    receitas: [
      {
        id: 'rec-m-1',
        categoria: 'Taxa Condominial',
        descricao: 'Arrecadação de Taxa Condominial Ordinária',
        valor: 72900.00,
        data: '10/03/2026',
        origem: 'Boleto Bancário'
      },
      {
        id: 'rec-m-2',
        categoria: 'Fundo de Reserva',
        descricao: 'Aporte de 5% para o Fundo de Reserva',
        valor: 3645.00,
        data: '10/03/2026',
        origem: 'Rateio Automático'
      },
      {
        id: 'rec-m-3',
        categoria: 'Aplicações Financeiras',
        descricao: 'Rendimento de Aplicação CDB',
        valor: 2455.00,
        data: '05/03/2026',
        origem: 'Banco Itaú'
      },
      {
        id: 'rec-m-4',
        categoria: 'Locações & Serviços',
        descricao: 'Locações Salão de Festas e Churrasqueira',
        valor: 2200.00,
        data: '15/03/2026',
        origem: 'Moradores'
      }
    ],
    despesas: [
      {
        id: 'desp-m-1',
        categoria: 'Segurança & Portaria',
        descricao: 'Folha de pagamento portaria 24h',
        valor: 28400.00,
        data: '05/03/2026',
        fornecedor: 'Grupo Delta Segurança'
      },
      {
        id: 'desp-m-2',
        categoria: 'Energia Elétrica',
        descricao: 'Conta de luz áreas comuns',
        valor: 8900.00,
        data: '10/03/2026',
        fornecedor: 'ENEL'
      },
      {
        id: 'desp-m-3',
        categoria: 'Água e Esgoto',
        descricao: 'Consumo de água',
        valor: 6600.00,
        data: '12/03/2026',
        fornecedor: 'SABESP'
      },
      {
        id: 'desp-m-4',
        categoria: 'Limpeza & Conservação',
        descricao: 'Produtos de limpeza e piscina',
        valor: 3200.00,
        data: '15/03/2026',
        fornecedor: 'Alvorada Distribuidora'
      },
      {
        id: 'desp-m-5',
        categoria: 'Elevadores',
        descricao: 'Manutenção preventiva elevadores',
        valor: 4100.00,
        data: '20/03/2026',
        fornecedor: 'Atlas Schindler'
      },
      {
        id: 'desp-m-6',
        categoria: 'Manutenção & Reparos',
        descricao: 'Reparo hidráulico caixa d\'água superior',
        valor: 7700.00,
        data: '25/03/2026',
        fornecedor: 'HidroFix Engenharia'
      }
    ]
  },
  'Fevereiro / 2026': {
    id: 'pc-fev-2026',
    mesAno: 'Fevereiro / 2026',
    receitasTotal: 80500.00,
    despesasTotal: 57400.00,
    saldo: 23100.00,
    condominioId: CURRENT_CONDO_ID,
    receitas: [
      {
        id: 'rec-f-1',
        categoria: 'Taxa Condominial',
        descricao: 'Arrecadação de Taxa Condominial Ordinária',
        valor: 72900.00,
        data: '10/02/2026',
        origem: 'Boleto Bancário'
      },
      {
        id: 'rec-f-2',
        categoria: 'Fundo de Reserva',
        descricao: 'Aporte de 5% para Fundo de Reserva',
        valor: 3645.00,
        data: '10/02/2026',
        origem: 'Rateio Automático'
      },
      {
        id: 'rec-f-3',
        categoria: 'Aplicações Financeiras',
        descricao: 'Rendimento de Aplicação',
        valor: 2355.00,
        data: '05/02/2026',
        origem: 'Banco Itaú'
      },
      {
        id: 'rec-f-4',
        categoria: 'Locações & Serviços',
        descricao: 'Locação Salão de Festas (Carnaval)',
        valor: 1600.00,
        data: '17/02/2026',
        origem: 'Moradores'
      }
    ],
    despesas: [
      {
        id: 'desp-f-1',
        categoria: 'Segurança & Portaria',
        descricao: 'Folha de pagamento portaria 24h',
        valor: 28400.00,
        data: '05/02/2026',
        fornecedor: 'Grupo Delta Segurança'
      },
      {
        id: 'desp-f-2',
        categoria: 'Energia Elétrica',
        descricao: 'Conta de luz áreas comuns',
        valor: 8700.00,
        data: '10/02/2026',
        fornecedor: 'ENEL'
      },
      {
        id: 'desp-f-3',
        categoria: 'Água e Esgoto',
        descricao: 'Consumo de água',
        valor: 6400.00,
        data: '12/02/2026',
        fornecedor: 'SABESP'
      },
      {
        id: 'desp-f-4',
        categoria: 'Limpeza & Conservação',
        descricao: 'Produtos de limpeza',
        valor: 3100.00,
        data: '15/02/2026',
        fornecedor: 'Alvorada Distribuidora'
      },
      {
        id: 'desp-f-5',
        categoria: 'Elevadores',
        descricao: 'Manutenção preventiva elevadores',
        valor: 4100.00,
        data: '20/02/2026',
        fornecedor: 'Atlas Schindler'
      },
      {
        id: 'desp-f-6',
        categoria: 'Manutenção & Reparos',
        descricao: 'Troca de lâmpadas LED garagem e hall',
        valor: 6700.00,
        data: '23/02/2026',
        fornecedor: 'Luz & Cia Materiais Elétricos'
      }
    ]
  },
  'Janeiro / 2026': {
    id: 'pc-jan-2026',
    mesAno: 'Janeiro / 2026',
    receitasTotal: 83500.00,
    despesasTotal: 62100.00,
    saldo: 21400.00,
    condominioId: CURRENT_CONDO_ID,
    receitas: [
      {
        id: 'rec-j-1',
        categoria: 'Taxa Condominial',
        descricao: 'Arrecadação de Taxa Condominial Ordinária',
        valor: 72900.00,
        data: '10/01/2026',
        origem: 'Boleto Bancário'
      },
      {
        id: 'rec-j-2',
        categoria: 'Fundo de Reserva',
        descricao: 'Aporte de 5% para Fundo de Reserva',
        valor: 3645.00,
        data: '10/01/2026',
        origem: 'Rateio Automático'
      },
      {
        id: 'rec-j-3',
        categoria: 'Aplicações Financeiras',
        descricao: 'Rendimento de Aplicação',
        valor: 2555.00,
        data: '05/01/2026',
        origem: 'Banco Itaú'
      },
      {
        id: 'rec-j-4',
        categoria: 'Locações & Serviços',
        descricao: 'Locações Salão de Festas (Férias)',
        valor: 4400.00,
        data: '20/01/2026',
        origem: 'Moradores'
      }
    ],
    despesas: [
      {
        id: 'desp-j-1',
        categoria: 'Segurança & Portaria',
        descricao: 'Folha de pagamento portaria 24h',
        valor: 28400.00,
        data: '05/01/2026',
        fornecedor: 'Grupo Delta Segurança'
      },
      {
        id: 'desp-j-2',
        categoria: 'Energia Elétrica',
        descricao: 'Conta de luz áreas comuns',
        valor: 9400.00,
        data: '10/01/2026',
        fornecedor: 'ENEL'
      },
      {
        id: 'desp-j-3',
        categoria: 'Água e Esgoto',
        descricao: 'Consumo de água',
        valor: 6900.00,
        data: '12/01/2026',
        fornecedor: 'SABESP'
      },
      {
        id: 'desp-j-4',
        categoria: 'Limpeza & Conservação',
        descricao: 'Produtos de limpeza e tratamento químico piscina',
        valor: 3900.00,
        data: '15/01/2026',
        fornecedor: 'Alvorada Distribuidora'
      },
      {
        id: 'desp-j-5',
        categoria: 'Elevadores',
        descricao: 'Manutenção preventiva elevadores',
        valor: 4100.00,
        data: '20/01/2026',
        fornecedor: 'Atlas Schindler'
      },
      {
        id: 'desp-j-6',
        categoria: 'Manutenção & Reparos',
        descricao: 'Recarga anual de extintores e laudo AVCB',
        valor: 9400.00,
        data: '28/01/2026',
        fornecedor: 'FireProtect Segurança Contra Incêndio'
      }
    ]
  }
};

export const MOCK_FUNCIONARIOS: Funcionario[] = [
  {
    id: 'func-1',
    nome: 'Ademar Lopes',
    foto: '/ademar_porteiro.png',
    funcao: 'Porteiro Noturno (Escala 12x36)',
    horario: '19:00 - 07:00',
    disponibilidade: 'Segunda, Quarta, Sexta e Domingos alternados',
    avaliacoesCount: 28,
    mediaNota: 4.9,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-2',
    nome: 'Anastácia Moreira',
    foto: '/anastacia_faxineira.png',
    funcao: 'Faxineira Chefe',
    horario: '08:00 - 17:00',
    disponibilidade: 'Segunda a Sexta e Sábado até 12:00',
    avaliacoesCount: 42,
    mediaNota: 5.0,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-3',
    nome: 'José Casimiro',
    foto: '/jose_casimiro_porteiro.png',
    funcao: 'Porteiro Diurno (Escala 12x36)',
    horario: '07:00 - 19:00',
    disponibilidade: 'Terça, Quinta, Sábado e Domingos alternados',
    avaliacoesCount: 31,
    mediaNota: 4.8,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-4',
    nome: 'Jose Cassio',
    foto: '/jose_vigia.png',
    funcao: 'Vigia Noturno',
    horario: '22:00 - 06:00',
    disponibilidade: 'Diariamente (Zeladoria e Segurança)',
    avaliacoesCount: 19,
    mediaNota: 4.7,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-5',
    nome: 'Adriana Gomes',
    foto: '/adriana_sindica.png',
    funcao: 'Síndica Profissional',
    horario: '09:00 - 18:00',
    disponibilidade: 'Reuniões mensais e emergências',
    avaliacoesCount: 55,
    mediaNota: 4.9,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-6',
    nome: 'Cassia Marques',
    foto: '/cassia_sub_sindica.png',
    funcao: 'Subsíndica',
    horario: '09:00 - 18:00',
    disponibilidade: 'Segunda a Sexta',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-7',
    nome: 'Fabio Sanches',
    foto: '/fabio_conselheiro.png',
    funcao: 'Conselheiro Fiscal',
    horario: 'Reuniões e Pareceres',
    disponibilidade: 'Sob demanda',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-8',
    nome: 'Marco Aurélio',
    foto: '/marco_conselheiro.png',
    funcao: 'Conselheiro de Contas',
    horario: 'Reuniões e Auditorias',
    disponibilidade: 'Sob demanda',
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
