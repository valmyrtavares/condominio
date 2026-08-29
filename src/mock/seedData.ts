import { User, Unidade, Reclamacao, Reparo, PrestacaoContas, Funcionario, EspinhaDorsalItem, Benfeitoria, VagaGaragem, ServicoContratado, Dependencia, ReservaDependencia, Assembleia, EventoCondominio, UnidadeDisponivel, RegraTopico } from '../types';

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
    id: 'unid-001',
    numero: '001',
    bloco: 'Bloco A',
    tipo: 'Apartamento',
    vagaGaragem: 'Vaga 001',
    statusCadastro: 'Pendente',
    moradores: [],
    senhaAcesso: '001'
  },
  {
    id: 'unid-002',
    numero: '002',
    bloco: 'Bloco A',
    tipo: 'Apartamento',
    vagaGaragem: 'Vaga 002',
    statusCadastro: 'Pendente',
    moradores: [],
    senhaAcesso: '002'
  },
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
    porte: 'Médio',
    categoria: 'Garagem',
    solicitanteNome: 'Carlos Almeida',
    solicitanteUnidade: 'Apt 102 - Bloco A',
    dataSolicitacao: '12/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Automatiza Tech Condominial',
    valorFinal: 1850.00,
    status: 'Orçamento Contratado',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 9,
    apoiadoPeloUsuario: true,
    apoiadores: ['usr-morador-102', 'usr-morador-201', 'usr-morador-302'],
    comentarios: [
      {
        id: 'com-rep-m1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'Proposta da empresa Automatiza Tech aprovada e contratada. O serviço está agendado para execução técnica nesta quinta-feira.',
        data: '17/08/2026 às 10:30',
        oficial: true
      },
      {
        id: 'com-rep-m2',
        autorId: 'usr-morador-101',
        autorNome: 'Renato Alencar',
        autorRole: 'morador',
        autorUnidade: 'Apt 101',
        autorFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        texto: 'Excelente agilidade na aprovação do orçamento. O portão estava travando constantemente.',
        data: '17/08/2026 às 11:15'
      }
    ],
    orcamentos: [
      {
        id: 'orc-1',
        empresa: 'Portões & Cia Ltda',
        siteUrl: 'https://portoesecia.exemplo.com.br',
        cnpj: '12.345.678/0001-90',
        valor: 2100.00,
        descricao: 'Substituição completa por motor Rossi Ninja 1/3hp + mão de obra.',
        prazoDias: 3,
        selecionado: false,
        documentoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        documentoNome: 'Orcamento_PortoesCia_2026.pdf'
      },
      {
        id: 'orc-2',
        empresa: 'Automatiza Tech Condominial',
        siteUrl: 'https://automatizatech.exemplo.com.br',
        cnpj: '98.765.432/0001-11',
        valor: 1850.00,
        descricao: 'Motor industrial PPA JetFlex de alta velocidade + substituição de roletes blindados e garantia de 12 meses.',
        prazoDias: 2,
        selecionado: true,
        documentoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        documentoNome: 'Proposta_AutomatizaTech_Aprovada.pdf'
      },
      {
        id: 'orc-3',
        empresa: 'Serviços Seguras SP',
        siteUrl: 'https://segurassp.exemplo.com.br',
        cnpj: '45.888.999/0001-33',
        valor: 2300.00,
        descricao: 'Kit automatizador deslizante reforçado + sensores antiesmagamento.',
        prazoDias: 5,
        selecionado: false,
        documentoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        documentoNome: 'Cotacao_SegurasSP.pdf'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        data: '12/08/2026',
        titulo: 'Vistoria e Registro do Problema',
        descricao: 'Morador e zeladoria constataram travamento intermitente e desgaste no motor do portão.',
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
        statusAlvo: 'Orçamento Contratado'
      },
      {
        id: 'tl-5',
        data: '17/08/2026',
        titulo: 'Agendamento Técnico',
        descricao: 'Equipe técnica agendada para realização do serviço na quinta-feira das 09h às 12h.',
        autorRole: 'subsindico',
        statusAlvo: 'Em Execução'
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
    titulo: 'Impermeabilização e contenção de infiltração no teto do Subsolo 2',
    descricao: 'Tratamento de goteira e infiltração proveniente da junta de dilatação da laje sobre as vagas G-30 e G-31 com injeção de poliuretano impermeabilizante.',
    porte: 'Grande',
    categoria: 'Garagem',
    solicitanteNome: 'Eduardo Prado',
    solicitanteUnidade: 'Apt 302 - Bloco B',
    dataSolicitacao: '18/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Vedatech Engenharia e Impermeabilizações',
    valorFinal: 3200.00,
    status: 'Análise de Orçamento',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 14,
    apoiadoPeloUsuario: false,
    apoiadores: ['usr-morador-302', 'usr-morador-102'],
    comentarios: [
      {
        id: 'com-rep-inf1',
        autorId: 'usr-morador-302',
        autorNome: 'Eduardo Prado',
        autorRole: 'morador',
        autorUnidade: 'Apt 302 - Bloco B',
        autorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        texto: 'A água da goteira está caindo bem em cima da lataria dos carros das vagas 30 e 31 em dias de chuva forte.',
        data: '18/08/2026 às 19:00'
      }
    ],
    orcamentos: [
      {
        id: 'orc-inf-1',
        empresa: 'Vedatech Engenharia',
        siteUrl: 'https://vedatech.exemplo.com.br',
        cnpj: '33.444.555/0001-22',
        valor: 3200.00,
        descricao: 'Injeção de resina flexível de poliuretano + teste de estanqueidade com 5 anos de garantia.',
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
        autorRole: 'subsindico',
        statusAlvo: 'Análise de Orçamento'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    fotosDepois: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-lampadas-hall',
    titulo: 'Substituição de painéis LED queimados no Hall do 4º andar',
    descricao: 'Dois spots embutidos de LED do hall social em frente aos apartamentos 401 e 402 pararam de funcionar, deixando o corredor escuro.',
    porte: 'Pequeno',
    categoria: 'Hall / Corredor',
    solicitanteNome: 'Renato Alencar',
    solicitanteUnidade: 'Apt 101 - Bloco A',
    dataSolicitacao: '20/08/2026',
    responsavel: 'Zeladoria',
    empresaEscolhida: 'EletroPaulista Reparos',
    valorFinal: 180.00,
    status: 'Resolvido',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 5,
    apoiadoPeloUsuario: false,
    apoiadores: ['usr-morador-101'],
    comentarios: [
      {
        id: 'com-rep-led1',
        autorId: 'usr-admin-401',
        autorNome: 'Dra. Mariana Costa (Subsíndica)',
        autorRole: 'subsindico',
        autorUnidade: 'Administração',
        autorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        texto: 'Reparo simples concluído diretamente pela zeladoria com troca dos dois painéis LED de 18W.',
        data: '21/08/2026 às 15:30',
        oficial: true
      }
    ],
    orcamentos: [
      {
        id: 'orc-led-1',
        empresa: 'EletroPaulista Reparos',
        siteUrl: 'https://eletropaulista.exemplo.com.br',
        cnpj: '21.000.111/0001-55',
        valor: 180.00,
        descricao: 'Troca de 2 painéis LED 18W + teste de disjuntores.',
        prazoDias: 1,
        selecionado: true
      }
    ],
    timeline: [
      {
        id: 'tl-led-1',
        data: '20/08/2026',
        titulo: 'Solicitação Registrada',
        descricao: 'Morador reportou luzes apagadas no corredor do 4º andar.',
        autorRole: 'morador'
      },
      {
        id: 'tl-led-2',
        data: '21/08/2026',
        titulo: 'Serviço Executado e Resolvido',
        descricao: 'Substituição das lâmpadas e reatores efetuada com sucesso.',
        autorRole: 'subsindico',
        statusAlvo: 'Resolvido'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    fotosDepois: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-porta-academia',
    titulo: 'Regulagem da mola hidráulica e trava da porta da Academia',
    descricao: 'A porta de vidro da academia está batendo com força excessiva no batente após o uso, com risco de quebra do vidro temperado.',
    porte: 'Pequeno',
    categoria: 'Academia',
    solicitanteNome: 'Sandra Almeida',
    solicitanteUnidade: 'Apt 102 - Bloco A',
    dataSolicitacao: '22/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Vidros & Molas Express',
    valorFinal: 250.00,
    status: 'Em Execução',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 8,
    apoiadoPeloUsuario: true,
    apoiadores: ['usr-morador-102', 'usr-morador-201'],
    comentarios: [
      {
        id: 'com-rep-mola1',
        autorId: 'usr-morador-102',
        autorNome: 'Sandra Almeida',
        autorRole: 'morador',
        autorUnidade: 'Apt 102',
        autorFoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        texto: 'Obrigada pela rápida resposta! O barulho do vidro batendo estava assustando os usuários da academia.',
        data: '23/08/2026 às 16:20'
      }
    ],
    orcamentos: [
      {
        id: 'orc-mola-1',
        empresa: 'Vidros & Molas Express',
        siteUrl: 'https://vidrosexpress.exemplo.com.br',
        cnpj: '55.666.777/0001-88',
        valor: 250.00,
        descricao: 'Substituição da mola de piso Dorma + regulagem de pressão.',
        prazoDias: 2,
        selecionado: true
      }
    ],
    timeline: [
      {
        id: 'tl-mola-1',
        data: '22/08/2026',
        titulo: 'Solicitação Aberta',
        descricao: 'Problema reportado com mola da porta da academia.',
        autorRole: 'morador'
      },
      {
        id: 'tl-mola-2',
        data: '23/08/2026',
        titulo: 'Visita Técnica Agendada e Início de Execução',
        descricao: 'Técnico fará o conserto amanhã às 14h.',
        autorRole: 'subsindico',
        statusAlvo: 'Em Execução'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-elevador-botoeira',
    titulo: 'Revisão dos cabos de tração e troca da botoeira do Elevador Social',
    descricao: 'Ruído anormal no deslocamento entre o 3º e 6º andar e botões de chamada do 2º e 5º pavimentos apresentando mau contato intermitente.',
    porte: 'Grande',
    categoria: 'Elevador',
    solicitanteNome: 'Zeladoria Condominial',
    solicitanteUnidade: 'Administração',
    dataSolicitacao: '23/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Atlas Schindler Serviços',
    valorFinal: 4800.00,
    status: 'Buscando Orçamento',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 19,
    apoiadoPeloUsuario: false,
    apoiadores: ['usr-morador-101', 'usr-morador-201', 'usr-morador-302'],
    comentarios: [],
    orcamentos: [
      {
        id: 'orc-elev-1',
        empresa: 'Atlas Schindler Serviços',
        siteUrl: 'https://schindler.exemplo.com.br',
        cnpj: '11.222.333/0001-44',
        valor: 4800.00,
        descricao: 'Revisão integral dos cabos de aço, encoder e troca de botoeiras antivandalismo.',
        prazoDias: 5,
        selecionado: true
      },
      {
        id: 'orc-elev-2',
        empresa: 'Otis Elevadores do Brasil',
        siteUrl: 'https://otis.exemplo.com.br',
        cnpj: '44.555.666/0001-77',
        valor: 5200.00,
        descricao: 'Substituição de componentes de tração e placa controladora de cabine.',
        prazoDias: 7,
        selecionado: false
      }
    ],
    timeline: [
      {
        id: 'tl-elev-1',
        data: '23/08/2026',
        titulo: 'Vistoria Preventiva',
        descricao: 'Chamado técnico aberto com a empresa mantenedora do elevador.',
        autorRole: 'subsindico',
        statusAlvo: 'Buscando Orçamento'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rep-pintura-garagem',
    titulo: 'Pintura e demarcação de faixas e vagas no Subsolo 1',
    descricao: 'Desgaste da tinta epóxi nas faixas amarelas de demarcação de vagas e numeração apagada após limpeza pesada.',
    porte: 'Médio',
    categoria: 'Pintura',
    solicitanteNome: 'Beatriz Souza',
    solicitanteUnidade: 'Apt 201 - Bloco A',
    dataSolicitacao: '24/08/2026',
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    empresaEscolhida: 'Pinturas Pro SP',
    valorFinal: 2100.00,
    status: 'Solicitado',
    condominioId: CURRENT_CONDO_ID,
    apoiosCount: 6,
    apoiadoPeloUsuario: false,
    apoiadores: ['usr-morador-201'],
    comentarios: [],
    orcamentos: [
      {
        id: 'orc-pint-1',
        empresa: 'Pinturas Pro SP',
        siteUrl: 'https://pinturaspro.exemplo.com.br',
        cnpj: '66.777.888/0001-99',
        valor: 2100.00,
        descricao: 'Pintura em tinta epóxi de alta resistência para 35 vagas e faixas de pedestres.',
        prazoDias: 3,
        selecionado: true
      }
    ],
    timeline: [
      {
        id: 'tl-pint-1',
        data: '24/08/2026',
        titulo: 'Solicitação Aberta',
        descricao: 'Necessidade de renovação da demarcação de piso na garagem.',
        autorRole: 'morador',
        statusAlvo: 'Solicitado'
      }
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

export const MOCK_BENFEITORIAS: Benfeitoria[] = [
  {
    id: 'benf-esteira-academia',
    titulo: 'Substituição e Modernização da Esteira Ergométrica da Academia',
    subtitulo: 'Grande reparo e reativação do espaço fitness com motor industrial novo',
    tipo: 'Grande Reparo & Manutenção',
    dataEntrega: '15/07/2026',
    descricao: 'A esteira principal da academia encontrava-se inoperante há mais de 4 meses devido a queima do inversor de frequência e desgaste do motor. A nova gestão realizou cotação tripartite e adquiriu um novo conjunto motorizado Movement Profissional de alta durabilidade com garantia estendida de 2 anos.',
    impactoGestao: 'Economia de R$ 4.500 em relação à troca total por equipamento novo. Espaço 100% funcional para todos os condôminos.',
    investimento: 3400.00,
    fotos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
    ],
    fotosAntes: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80'
    ],
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    condominioId: CURRENT_CONDO_ID,
    regrasUso: 'Uso exclusivo para moradores das 06h às 22h. Higienizar os apoios após o uso.'
  },
  {
    id: 'benf-brinquedoteca',
    titulo: 'Revitalização Completa e Novos Brinquedos na Brinquedoteca',
    subtitulo: 'Substituição de itens quebrados, instalação de piso amortecedor e novos jogos',
    tipo: 'Nova Aquisição & Modernização',
    dataEntrega: '28/06/2026',
    descricao: 'Reforma integral do espaço infantil: descarte de brinquedos plásticos trincados e perigosos, colocação de piso vinílico térmico e emborrachado para amortecimento de impactos, pintura lúdica antialérgica e aquisição de novos módulos de casinha, piscina de bolinhas higienizada e mesinhas de pintura.',
    impactoGestao: 'Segurança absoluta para as crianças do condomínio e valorização patrimonial das áreas comuns.',
    investimento: 4850.00,
    fotos: [
      'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    condominioId: CURRENT_CONDO_ID,
    regrasUso: 'Crianças até 10 anos acompanhadas dos responsáveis. Proibido consumo de alimentos dentro do espaço.'
  },
  {
    id: 'benf-energia-solar',
    titulo: 'Instalação do Sistema de Energia Solar Fotovoltaica',
    subtitulo: 'Redução histórica de 38% na conta de luz das áreas comuns e equilíbrio das contas',
    tipo: 'Equilíbrio Financeiro & Economia',
    dataEntrega: '10/05/2026',
    descricao: 'Instalação de 42 placas solares de alta performance na cobertura do Bloco A e B. A energia gerada supre a iluminação dos corredores, subsolos, bombas de pressurização e portaria, injetando excedente na rede Enel.',
    impactoGestao: 'Economia média de R$ 3.850,00 por mês. O equilíbrio financeiro permitiu congelar o reajuste da taxa condominial ordinária.',
    investimento: 42000.00,
    economiaMensal: 3850.00,
    fotos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=800&q=80'
    ],
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'benf-led-sensores',
    titulo: 'Retrofit Geral de Iluminação LED com Sensores de Presença',
    subtitulo: 'Modernização de 100% dos halls e subsolos com desligamento inteligente',
    tipo: 'Equilíbrio Financeiro & Economia',
    dataEntrega: '20/04/2026',
    descricao: 'Substituição de todas as antigas lâmpadas fluorescentes tubulares dos 8 andares e dos 2 subsolos por luminárias LED tubulares e painéis inteligentes com sensor de presença gradual.',
    impactoGestao: 'Queda de 22% no consumo elétrico de iluminação contínua e redução de 80% nos chamados de lâmpadas queimadas.',
    investimento: 3100.00,
    economiaMensal: 820.00,
    fotos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    responsavel: 'Zeladoria & Subsíndica',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'benf-coworking-mezanino',
    titulo: 'Novo Espaço Coworking & Sala de Estudos Climatizada',
    subtitulo: 'Aproveitamento do mezanino ocioso com mesas ergonômicas e Wi-Fi de alta velocidade',
    tipo: 'Área Comum & Convivência',
    dataEntrega: '12/03/2026',
    descricao: 'Transformação de antiga sala de depósito em um moderno espaço de trabalho compartilhado com 8 postos de trabalho, tomadas USB, cadeiras ergonômicas, ar-condicionado inverter e link de fibra ótica dedicado.',
    impactoGestao: 'Atende mais de 35 moradores que atuam em Home Office sem custo adicional na taxa condominial.',
    investimento: 5600.00,
    fotos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    responsavel: 'Dra. Mariana Costa (Subsíndica)',
    condominioId: CURRENT_CONDO_ID,
    regrasUso: 'Uso livre para moradores das 07h às 23h. Silêncio e fones de ouvido obrigatórios para chamadas.'
  }
];

export const MOCK_VAGAS_GARAGEM: VagaGaragem[] = [
  {
    id: 'vaga-g11',
    numeroVaga: 'G-11',
    subsolo: 'Subsolo 1',
    unidadeNumero: '101',
    bloco: 'Bloco A',
    status: 'Em uso',
    tipoVaga: 'Simples',
    moradorNome: 'Renato Alencar',
    moradorFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '101',
    contatoWhatsapp: '(11) 98888-1101',
    veiculo: {
      modelo: 'Jeep Compass Limited',
      cor: 'Preto',
      placa: 'BRA-3A10',
      tipo: 'SUV'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g12',
    numeroVaga: 'G-12',
    subsolo: 'Subsolo 1',
    unidadeNumero: '102',
    bloco: 'Bloco A',
    status: 'Em uso',
    tipoVaga: 'Simples',
    moradorNome: 'Marcos Almeida',
    moradorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '102',
    contatoWhatsapp: '(11) 99999-1002',
    veiculo: {
      modelo: 'Toyota Corolla Cross',
      cor: 'Prata Metálico',
      placa: 'XYZ-7890',
      tipo: 'SUV'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g13',
    numeroVaga: 'G-13',
    subsolo: 'Subsolo 1',
    unidadeNumero: '103',
    bloco: 'Bloco A',
    status: 'Para Alugar',
    tipoVaga: 'Simples',
    moradorNome: 'Cíntia Mendes',
    moradorFoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '103',
    contatoWhatsapp: '(11) 97777-1003',
    valorAluguelMensal: 250.00,
    observacoes: 'Vaga livre e coberta, próxima ao elevador social. Não possuo veículo no momento.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g14',
    numeroVaga: 'G-14',
    subsolo: 'Subsolo 1',
    unidadeNumero: '104',
    bloco: 'Bloco A',
    status: 'Vazia',
    tipoVaga: 'Simples',
    moradorNome: 'Unidade Desocupada / Em Reforma',
    interfoneRamal: '104',
    observacoes: 'Apartamento em processo de locação pela imobiliária. Vaga temporariamente desocupada.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g21',
    numeroVaga: 'G-21',
    subsolo: 'Subsolo 1',
    unidadeNumero: '201',
    bloco: 'Bloco A',
    status: 'Em uso',
    tipoVaga: 'Simples',
    moradorNome: 'Dr. João Carlos & Beatriz',
    moradorFoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '201',
    contatoWhatsapp: '(11) 98111-2001',
    veiculo: {
      modelo: 'Honda Civic Touring',
      cor: 'Branco Pérola',
      placa: 'RIO-9G21',
      tipo: 'Carro'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g22',
    numeroVaga: 'G-22',
    subsolo: 'Subsolo 1',
    unidadeNumero: '202',
    bloco: 'Bloco A',
    status: 'Para Alugar',
    tipoVaga: 'Simples',
    moradorNome: 'Juliana Paes (Proprietária)',
    moradorFoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '202',
    contatoWhatsapp: '(11) 99222-2002',
    valorAluguelMensal: 280.00,
    observacoes: 'Vaga espaçosa com fácil manobra no Subsolo 1. Alugo por contrato mínimo de 6 meses.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g31',
    numeroVaga: 'G-31',
    subsolo: 'Subsolo 2',
    unidadeNumero: '301',
    bloco: 'Bloco B',
    status: 'Vazia',
    tipoVaga: 'Simples',
    moradorNome: 'Família Silveira',
    interfoneRamal: '301',
    observacoes: 'Moradores utilizam apenas transporte por aplicativo no momento.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g32',
    numeroVaga: 'G-32',
    subsolo: 'Subsolo 2',
    unidadeNumero: '302',
    bloco: 'Bloco B',
    status: 'Em uso',
    tipoVaga: 'Dupla',
    moradorNome: 'Eduardo Prado',
    moradorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '302',
    contatoWhatsapp: '(11) 97333-3002',
    veiculo: {
      modelo: 'Volkswagen T-Cross',
      cor: 'Azul Noturno',
      placa: 'TCX-4B32',
      tipo: 'SUV'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g41',
    numeroVaga: 'G-41',
    subsolo: 'Subsolo 2',
    unidadeNumero: '401',
    bloco: 'Bloco A',
    status: 'Em uso',
    tipoVaga: 'Dupla',
    moradorNome: 'Dra. Mariana Costa (Subsíndica)',
    moradorFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '401',
    contatoWhatsapp: '(11) 99444-4001',
    veiculo: {
      modelo: 'Volvo XC60 Híbrido',
      cor: 'Cinza Platinum',
      placa: 'EVO-8H41',
      tipo: 'SUV'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g42',
    numeroVaga: 'G-42',
    subsolo: 'Subsolo 2',
    unidadeNumero: '402',
    bloco: 'Bloco A',
    status: 'Para Alugar',
    tipoVaga: 'Simples',
    moradorNome: 'Roberto Campos',
    interfoneRamal: '402',
    contatoWhatsapp: '(11) 98555-4002',
    valorAluguelMensal: 230.00,
    observacoes: 'Excelente vaga no Subsolo 2 com iluminação direta. Tratar direto via interfone ou WhatsApp.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g51',
    numeroVaga: 'G-51',
    subsolo: 'Subsolo 2',
    unidadeNumero: '501',
    bloco: 'Bloco B',
    status: 'Em uso',
    tipoVaga: 'Simples',
    moradorNome: 'Antônio Ferreira (Advogado)',
    moradorFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    interfoneRamal: '501',
    contatoWhatsapp: '(11) 97666-5001',
    veiculo: {
      modelo: 'BMW 320i',
      cor: 'Preto Safira',
      placa: 'BMW-5A01',
      tipo: 'Carro'
    },
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'vaga-g52',
    numeroVaga: 'G-52',
    subsolo: 'Subsolo 2',
    unidadeNumero: '502',
    bloco: 'Bloco B',
    status: 'Vazia',
    tipoVaga: 'Simples',
    moradorNome: 'Apartamento para Locação',
    interfoneRamal: '502',
    observacoes: 'Vaga livre no momento.',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_SERVICOS_CONTRATADOS: ServicoContratado[] = [
  {
    id: 'sc-elevadores',
    titulo: 'Contratação de Manutenção Preventiva & Corretiva dos Elevadores',
    data: '15/07/2026',
    descricao: 'Tomada de preços para renovação do contrato anual de manutenção de 2 elevadores (Social e Serviço), incluindo cobertura 24 horas para emergências e vistorias mensais obrigatórias.',
    categoria: 'Elevadores',
    status: 'Contratada',
    condominioId: CURRENT_CONDO_ID,
    observacoesFinais: 'Proposta da Atlas Schindler aprovada por apresentar melhor relação custo-benefício, tempo de atendimento em chamados de até 45 min e histórico excelente em serviços anteriores.',
    propostas: [
      {
        id: 'prop-elev-1',
        empresaNome: 'Atlas Schindler do Brasil Ltda',
        cnpj: '61.123.456/0001-89',
        siteUrl: 'https://schindler.exemplo.com.br',
        valor: 2450.00,
        descricao: 'Contrato mensal integral: 2 visitas preventivas/mês, atendimento emergencial 24h em até 45 minutos e peças de reposição com 25% de desconto tabelado.',
        formaPagamento: 'Mensalidade faturada todo dia 15 via boleto',
        prazoEntrega: 'Início imediato (vigência 12 meses)',
        jaPrestouServico: true,
        selecionada: true
      },
      {
        id: 'prop-elev-2',
        empresaNome: 'Otis Elevadores S.A.',
        cnpj: '50.987.654/0001-32',
        siteUrl: 'https://otis.exemplo.com.br',
        valor: 2780.00,
        descricao: 'Manutenção preventiva mensal, suporte 24h e monitoramento remoto via IoT com alerta antecipado de falhas.',
        formaPagamento: 'Mensalidade no dia 10 via débito em conta/boleto',
        prazoEntrega: 'Início em 5 dias úteis',
        jaPrestouServico: false,
        selecionada: false
      },
      {
        id: 'prop-elev-3',
        empresaNome: 'TK Elevator (Thyssenkrupp)',
        cnpj: '33.222.111/0001-05',
        siteUrl: 'https://tkelevator.exemplo.com.br',
        valor: 2950.00,
        descricao: 'Plano premium de manutenção com reposição inclusa de cabos e botões de cabine.',
        formaPagamento: 'Mensal faturado para 30 dias',
        prazoEntrega: 'Início em 10 dias',
        jaPrestouServico: false,
        selecionada: false
      }
    ]
  },
  {
    id: 'sc-cftv-seguranca',
    titulo: 'Modernização do Sistema de CFTV e Câmeras IP com Inteligência Artificial',
    data: '08/08/2026',
    descricao: 'Substituição das 24 câmeras analógicas antigas por câmeras IP Full HD com visão noturna ColorVu, reconhecimento de placas na garagem (LPR) e armazenamento em nuvem por 30 dias.',
    categoria: 'Segurança & Monitoramento',
    status: 'Aguardando avaliação de proposta',
    condominioId: CURRENT_CONDO_ID,
    observacoesFinais: 'Três propostas recebidas e validadas tecnicamente pela comissão de segurança. Votação aberta para deliberação na próxima assembleia.',
    propostas: [
      {
        id: 'prop-cftv-1',
        empresaNome: 'Intelbras Guard Soluções Integradas',
        cnpj: '18.456.789/0001-77',
        siteUrl: 'https://intelbrasguard.exemplo.com.br',
        valor: 16800.00,
        descricao: '28 câmeras IP Intelbras 4K, 2 servidores NVR com 16TB de armazenamento, IA de detecção perimetral e integração total com a clausura de pedestres.',
        formaPagamento: 'Entrada de 30% + 4 parcelas no boleto sem juros',
        prazoEntrega: 'Instalação completa em 12 dias úteis',
        jaPrestouServico: true,
        selecionada: false
      },
      {
        id: 'prop-cftv-2',
        empresaNome: 'SegurTech Condominial SP',
        cnpj: '72.333.444/0001-90',
        siteUrl: 'https://segurtech.exemplo.com.br',
        valor: 15400.00,
        descricao: 'Kit com 24 câmeras Hikvision ColorVu com áudio bidirecional e leitura de placas na entrada e saída da garagem.',
        formaPagamento: 'Entrada de 40% + 3 parcelas mensais',
        prazoEntrega: 'Instalação em 15 dias corridos',
        jaPrestouServico: false,
        selecionada: false
      },
      {
        id: 'prop-cftv-3',
        empresaNome: 'Vigilância Máxima Telecom',
        cnpj: '91.888.777/0001-12',
        siteUrl: 'https://vigilanciamaxima.exemplo.com.br',
        valor: 18200.00,
        descricao: 'Sistema com 30 câmeras Dahua e aplicativo para monitoramento remoto pelos próprios moradores em tempo real.',
        formaPagamento: 'Faturamento em até 6x no boleto bancário',
        prazoEntrega: 'Instalação em 20 dias',
        jaPrestouServico: false,
        selecionada: false
      }
    ]
  },
  {
    id: 'sc-pintura-fachada',
    titulo: 'Restauração, Hidrojateamento e Pintura da Fachada Externa',
    data: '22/08/2026',
    descricao: 'Tomada de orçamentos para lavagem pressurizada, recuperação de pastilhas soltas, tratamento de fissuras e pintura acrílica emborrachada de proteção contra intempéries em ambos os blocos.',
    categoria: 'Pintura & Estrutura',
    status: 'Aguardando propostas',
    condominioId: CURRENT_CONDO_ID,
    observacoesFinais: 'Edital técnico publicado no mural. 1ª proposta recebida da Engenharia & Fachadas Paulista. Aguardando entrega dos outros 2 orçamentos pelas empresas concorrentes para início da avaliação.',
    propostas: [
      {
        id: 'prop-fach-1',
        empresaNome: 'Engenharia & Fachadas Paulista',
        cnpj: '44.555.666/0001-23',
        siteUrl: 'https://fachadaspaulista.exemplo.com.br',
        valor: 58000.00,
        descricao: 'Lavagem com hidrojateamento, teste de percussão, reposição de pastilhas e aplicação de 3 demãos de tinta Suvinil Proteção Total com garantia de 5 anos.',
        formaPagamento: 'Sinal de 20% + 8 parcelas vinculadas ao cronograma de medição da obra',
        prazoEntrega: '45 dias úteis de execução',
        jaPrestouServico: true,
        selecionada: false
      }
    ]
  },
  {
    id: 'sc-gerador-energia',
    titulo: 'Manutenção Preventiva e Automação do Gerador de Energia',
    data: '10/06/2026',
    descricao: 'Revisão geral do motor a diesel, substituição de filtros, troca de óleo e automação do quadro de transferência (QTA) para acionamento em menos de 5 segundos.',
    categoria: 'Elétrica & Infraestrutura',
    status: 'Contratada',
    condominioId: CURRENT_CONDO_ID,
    observacoesFinais: 'Serviço concluído com sucesso e gerador 100% operacional durante as quedas de energia recentes.',
    propostas: [
      {
        id: 'prop-ger-1',
        empresaNome: 'Geradores SP Engenharia & Manutenção',
        cnpj: '15.678.901/0001-34',
        siteUrl: 'https://geradoressp.exemplo.com.br',
        valor: 4200.00,
        descricao: 'Revisão do motor Cummins 150kVA, substituição de filtros racor, troca de óleo mineral e calibração do QTA automático.',
        formaPagamento: 'Entrada 50% + 50% após entrega técnica com emissão de ART',
        prazoEntrega: '3 dias úteis',
        jaPrestouServico: true,
        selecionada: true
      },
      {
        id: 'prop-ger-2',
        empresaNome: 'PowerGen Motores e Equipamentos',
        cnpj: '38.999.888/0001-67',
        siteUrl: 'https://powergen.exemplo.com.br',
        valor: 4850.00,
        descricao: 'Manutenção preventiva padrão + teste de carga com banco de resistências.',
        formaPagamento: 'À vista com 3% de desconto ou 2x no boleto',
        prazoEntrega: '5 dias',
        jaPrestouServico: false,
        selecionada: false
      },
      {
        id: 'prop-ger-3',
        empresaNome: 'MegaVolt Geradores',
        cnpj: '52.123.456/0001-99',
        siteUrl: 'https://megavolt.exemplo.com.br',
        valor: 5100.00,
        descricao: 'Substituição de correias, mangueiras e bateria selada de 100Ah.',
        formaPagamento: 'Faturado 30 dias',
        prazoEntrega: '7 dias úteis',
        jaPrestouServico: false,
        selecionada: false
      }
    ]
  }
];

export const MOCK_DEPENDENCIAS: Dependencia[] = [
  {
    id: 'dep-salao-festas',
    nome: 'Salão de Festas & Espaço Gourmet',
    tipo: 'Lazer & Convivência',
    foto: '/Salão de festas.jpg',
    descricao: 'Espaço climatizado completo para celebrações e confraternizações familiares com churrasqueira, forno de pizza e mobiliário elegante.',
    horarioFuncionamento: '09:00 às 23:00',
    capacidadePessoas: 60,
    requerReserva: true,
    taxaReserva: 180.00,
    comodidades: [
      'Churrasqueira a carvão e forno de pizza',
      'Geladeira duplex e cervejeira expositora',
      '12 Mesas com 48 cadeiras estofadas',
      'Sistema de som integrado via Bluetooth',
      'Ar-condicionado split 36.000 BTUs',
      'Wi-Fi de alta velocidade exclusivo'
    ],
    regrasUso: [
      'Horário de silêncio rigoroso a partir das 22:00 conforme convenção.',
      'Lista de convidados deve ser enviada para a portaria com antecedência de 24h.',
      'A taxa de R$ 180,00 cobre a limpeza pesada e higienização pós-evento.',
      'Proibido colar fitas ou pregos na pintura das paredes decorativas.'
    ],
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'dep-piscina',
    nome: 'Piscina Climatizada & Deck Solarium',
    tipo: 'Lazer & Convivência',
    foto: '/Piscina.jpg',
    descricao: 'Conjunto aquático climatizado por energia solar com piscina semiolímpica, piscina infantil rasa, espreguiçadeiras e vestiários completos.',
    horarioFuncionamento: '07:00 às 22:00 (Terça a Domingo)',
    capacidadePessoas: 35,
    requerReserva: false,
    comodidades: [
      'Piscina adulto com iluminação noturna LED',
      'Piscina infantil com prainha segura',
      'Sistema de aquecimento térmico solar',
      'Espreguiçadeiras, mesas e ombrelones',
      'Ducha externa e vestiários masculino/feminino'
    ],
    regrasUso: [
      'Obrigatório exame médico dermatológico atualizado no cadastro da zeladoria.',
      'Proibido o uso de garrafas, copos ou recipientes de vidro no deck.',
      'Crianças menores de 12 anos devem permanecer com responsáveis.',
      'Fechada às segundas-feiras para manutenção química e cloração.'
    ],
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'dep-academia',
    nome: 'Academia & Espaço Fitness Completo',
    tipo: 'Esporte & Saúde',
    foto: '/academia.jpg',
    descricao: 'Academia moderna e equipada com aparelhos de musculação, novos equipamentos cárdio Movement, espaço para treino funcional e pilates.',
    horarioFuncionamento: '06:00 às 23:00 (Todos os dias)',
    capacidadePessoas: 15,
    requerReserva: false,
    comodidades: [
      'Esteiras ergométricas Movement novas (Motor industrial)',
      'Bicicletas horizontais e elípticos de última geração',
      'Estação de musculação multifuncional com polias',
      'Halteres emborrachados de 1kg a 24kg com banco regulável',
      'Colchonetes, faixas elásticas e caneleiras de peso',
      'Ar-condicionado e Smart TV integrada'
    ],
    regrasUso: [
      'Uso de toalha individual obrigatório durante os exercícios.',
      'Higienizar os apoios e assentos com álcool 70% disponível após o treino.',
      'Guardar pesos e anilhas nos respectivos suportes após a utilização.',
      'Permitido apenas maiores de 14 anos (menores acompanhados de personal).'
    ],
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'dep-brinquedoteca',
    nome: 'Brinquedoteca & Espaço Kids',
    tipo: 'Infantil',
    foto: '/Brinquedoteca.jpg',
    descricao: 'Ambiente infantil lúdico e seguro com piso vinílico amortecedor de impacto, piscina de bolinhas, novos brinquedos pedagógicos e mesinhas de artes.',
    horarioFuncionamento: '08:00 às 21:00 (Todos os dias)',
    capacidadePessoas: 20,
    requerReserva: false,
    comodidades: [
      'Piso vinílico térmico e emborrachado anti-impacto',
      'Piscina de bolinhas totalmente higienizada',
      'Módulos de casinha e escorregador infantil',
      'Mesas de atividades com jogos pedagógicos e pintura',
      'Estante de livros infantis e TV com desenhos'
    ],
    regrasUso: [
      'Crianças com menos de 10 anos devem estar acompanhadas dos pais.',
      'Obrigatório retirar calçados na entrada do espaço.',
      'Proibido entrar com alimentos, refrigerantes ou chicletes no tapete lúdico.',
      'Ao sair, recolher os brinquedos e guardar nos organizadores.'
    ],
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'dep-jardim',
    nome: 'Jardim & Bosque de Convivência',
    tipo: 'Lazer & Convivência',
    foto: '/jardin.jpg',
    descricao: 'Ampla área verde arborizada com paisagismo exuberante, bancos de descanso, pergolado sombreado e trilha para caminhadas tranquilas.',
    horarioFuncionamento: '06:00 às 22:00',
    capacidadePessoas: 40,
    requerReserva: false,
    comodidades: [
      'Paisagismo tropical com árvores nativas e flores',
      'Pergolado de madeira com bancos para leitura e descanso',
      'Iluminação decorativa noturna com lâmpadas solares LED',
      'Trilha pavimentada e acessível para passeio',
      'Espaço Pet Friendly com saquinhos coletores'
    ],
    regrasUso: [
      'Manter animais de estimação sempre na coleira e guia curta.',
      'Recolher imediatamente quaisquer dejetos dos pets.',
      'Proibido pisar ou arrancar mudas e flores dos canteiros.',
      'Preservar o silêncio e a tranquilidade para momentos de leitura e descanso.'
    ],
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'dep-fachada',
    nome: 'Fachada & Portaria Social 24h',
    tipo: 'Infraestrutura & Acesso',
    foto: '/Faixada.jpg',
    descricao: 'Fachada revitalizada com portaria blindada, controle de acesso por reconhecimento facial, clausura dupla para pedestres e monitoramento integral.',
    horarioFuncionamento: '24 Horas (Ininterrupto)',
    capacidadePessoas: 20,
    requerReserva: false,
    comodidades: [
      'Portaria blindada com vigilância armada e CFTV 24h',
      'Clausura dupla para pedestres e veículos',
      'Totem de reconhecimento facial rápido para moradores',
      'Armários inteligentes para recebimento de encomendas',
      'Rampa de acessibilidade e elevador PNE'
    ],
    regrasUso: [
      'Visitantes e prestadores devem ser anunciados e liberados pelo morador.',
      'Entregadores de delivery não sobem aos apartamentos (retirar na clausura).',
      'Nunca permitir a entrada de pessoas não identificadas na carona.',
      'Cadastrar novos prestadores recorrentes junto à administração.'
    ],
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_RESERVAS: ReservaDependencia[] = [
  {
    id: 'res-1',
    dependenciaId: 'dep-salao-festas',
    moradorId: 'usr-morador-102',
    moradorNome: 'Marcos Almeida',
    unidade: '102 - Bloco A',
    dataReserva: '29/08/2026',
    periodo: 'Tarde/Noite (16h-23h)',
    status: 'Confirmada',
    valorTaxa: 180.00
  },
  {
    id: 'res-2',
    dependenciaId: 'dep-salao-festas',
    moradorId: 'usr-morador-101',
    moradorNome: 'Renato Alencar',
    unidade: '101 - Bloco A',
    dataReserva: '05/09/2026',
    periodo: 'Manhã (09h-14h)',
    status: 'Confirmada',
    valorTaxa: 180.00
  }
];

export const MOCK_ASSEMBLEIAS: Assembleia[] = [
  // 1. Status 1: Agendada (Card Amarelo / Dourado)
  {
    id: 'ass-age-setembro-2026',
    titulo: 'Assembleia Geral Extraordinária - Orçamento de Obras & Usina Solar',
    tipo: 'Extraordinária',
    dataHora: '18 de Setembro de 2026 às 19:30',
    local: 'Salão de Festas & Híbrida via Zoom',
    primeiraChamada: '19:00 com 2/3 dos condôminos',
    segundaChamada: '19:30 com qualquer número de presentes',
    status: 'Agendada',
    descricaoGeral: 'Convocação formal para deliberação de investimento em eficiência energética com painéis solares, substituição de empresa terceirizada de portaria e atualização das regras para pets.',
    pautas: [
      {
        id: 'pauta-1',
        titulo: 'Instalação de Usina Solar Fotovoltaica na Cobertura',
        descricao: 'Votação da proposta técnica para instalação de 42 placas solares com investimento previsto de R$ 42.000,00 e economia média de R$ 2.450,00/mês nas contas de energia das áreas comuns.'
      },
      {
        id: 'pauta-2',
        titulo: 'Contratação de Nova Empresa de Portaria & Vigilância 24h',
        descricao: 'Avaliação dos 3 orçamentos homologados pela comissão para contratação de empresa de controle de acesso com ronda noturna e fiscalização armada.'
      },
      {
        id: 'pauta-3',
        titulo: 'Revisão do Regimento Interno para Circulação de Animais de Estimação',
        descricao: 'Adequação das normas para uso de elevadores de serviço por tutores de animais e novos pontos com dispensers de saquinhos higiênicos no bosque.'
      }
    ],
    condominioId: CURRENT_CONDO_ID
  },

  // 2. Status 3: Realizada - Aguardando Ata (Card Amarelo - Já aconteceu mas ata ainda em redação)
  {
    id: 'ass-age-agosto-2026',
    titulo: 'Assembleia Geral Extraordinária - Reforma e Impermeabilização da Fachada',
    tipo: 'Extraordinária',
    dataHora: '12 de Agosto de 2026 às 19:30',
    local: 'Salão de Festas & Transmissão no App',
    primeiraChamada: '19:00',
    segundaChamada: '19:30',
    status: 'Realizada - Aguardando Ata',
    descricaoGeral: 'Reunião realizada com quórum qualificado para definir a empresa executora do retrofit e impermeabilização da fachada externa do condomínio.',
    pautas: [
      {
        id: 'pauta-fac-1',
        titulo: 'Escolha da Empresa Vencedora para Reforma da Fachada',
        descricao: 'Deliberação entre as 3 empresas concorrentes cotadas pela sindicância.',
        aprovada: true,
        resultadoVotacao: 'Aprovada proposta da Engenharia & Fachadas Alpha (38 votos a favor, 4 contra)'
      },
      {
        id: 'pauta-fac-2',
        titulo: 'Condições de Pagamento e Utilização do Fundo de Obras',
        descricao: 'Definição de pagamento parcelado em 10 vezes sem necessidade de emissão de cota extra extraordinária aos moradores.',
        aprovada: true,
        resultadoVotacao: 'Aprovado por unanimidade (42 votos a 0)'
      }
    ],
    condominioId: CURRENT_CONDO_ID
  },

  // 3. Status 2: Realizada com Ata Publicada (Card Verde - Concluída e com documento oficial anexado)
  {
    id: 'ass-ago-marco-2026',
    titulo: 'Assembleia Geral Ordinária - Prestação de Contas & Eleição de Síndica 2026-2028',
    tipo: 'Ordinária',
    dataHora: '24 de Março de 2026 às 20:00',
    local: 'Salão de Festas do Edifício',
    primeiraChamada: '19:30',
    segundaChamada: '20:00',
    status: 'Realizada com Ata Publicada',
    descricaoGeral: 'Assembleia Geral Ordinária para homologação das contas do exercício de 2025, eleição do corpo diretivo e fixação do valor da taxa condominial.',
    pautas: [
      {
        id: 'pauta-ago-1',
        titulo: 'Aprovação das Contas do Exercício de 2025 & Parecer do Conselho',
        descricao: 'Apresentação detalhada do balancete anual, conciliação bancária e comprovação de superávit transferido ao Fundo de Reserva.',
        aprovada: true,
        resultadoVotacao: 'Aprovado por unanimidade (48 votos a favor, 0 abstenções)'
      },
      {
        id: 'pauta-ago-2',
        titulo: 'Eleição de Síndica Geral e Subsíndica (Biênio 2026/2028)',
        descricao: 'Votação das chapas concorrentes para a gestão e representação legal do Condomínio Residencial Jardim Paulista.',
        aprovada: true,
        resultadoVotacao: 'Eleita Chapa 1 (Dra. Mariana Ferreira - Síndica / Cássia Rezende - Subsíndica) com 41 votos'
      },
      {
        id: 'pauta-ago-3',
        titulo: 'Instituição de Taxa Extra para Reforma Completa da Quadra Poliesportiva',
        descricao: 'Proposta de taxa extra mensal de R$ 85,00 durante 6 meses para troca do piso e iluminação da quadra.',
        aprovada: false,
        resultadoVotacao: 'Rejeitada pelo plenário (11 votos a favor, 37 votos contrários)'
      }
    ],
    ata: {
      numeroAta: 'ATA-AGO-001/2026',
      dataLavratura: '26/03/2026',
      presidenteMesa: 'Dr. Roberto Silveira (Apto 302)',
      secretarioMesa: 'Cássia Rezende (Apto 201)',
      registroCartorio: '4º Oficial de Registro de Títulos e Documentos de SP - Registro nº 894.210/2026',
      resumoDecisoes: 'Contas do exercício 2025 homologadas sem ressalvas. Eleita a Sra. Mariana Ferreira como Síndica e Cássia Rezende como Subsíndica. Rejeitada a cobrança de taxa extra da quadra poliesportiva por maioria absoluta dos votos.',
      textoCompleto: 'Aos vinte e quatro dias do mês de março do ano de dois mil e vinte e seis, às vinte horas, reuniram-se em Assembleia Geral Ordinária os condôminos do Condomínio Residencial Jardim Paulista. Assumiu a presidência da mesa o Dr. Roberto Silveira, que convidou a Sra. Cássia Rezende para secretariar os trabalhos. Passou-se à deliberação das ordens do dia: 1) Apresentação e aprovação das contas de 2025, aprovadas por unanimidade após leitura do parecer favorável do Conselho Fiscal; 2) Eleição do corpo diretivo para o biênio 2026-2028, sendo eleita a Chapa 1 com 41 votos; 3) Votação da taxa extra para a quadra esportiva, rejeitada por 37 votos contra 11. Nada mais havendo a tratar, lavrou-se a presente ata que vai assinada pelo Presidente, Secretária e Síndica eleita.'
    },
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_EVENTOS: EventoCondominio[] = [
  {
    id: 'evt-aniversario-beatriz',
    titulo: 'Aniversário da Beatriz (10 Anos)',
    data: '29/08/2026',
    horario: '16:00 às 22:00',
    local: 'Salão de Festas & Espaço Gourmet',
    organizador: 'Marcos & Família (Apto 102)',
    visibilidade: 'Privado',
    descricao: 'Festa de aniversário temática comemorando os 10 anos da Beatriz. Evento fechado e particular para familiares e amigos convidados da unidade 102. Espaço reservado conforme agendamento.',
    imagem: '/Salão de festas.jpg',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'evt-dia-das-maes',
    titulo: 'Café da Manhã & Celebração do Dia das Mães',
    data: '10/05/2026',
    horario: '09:30 às 13:00',
    local: 'Jardim & Bosque de Convivência',
    organizador: 'Administração & Comissão Social',
    visibilidade: 'Público',
    descricao: 'Café da manhã comunitário com mesa de frutas, sucos, pães artesanais, música acústica ao vivo e entrega de flores para homenagear todas as mães do condomínio!',
    imagem: '/jardin.jpg',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'evt-festa-junina',
    titulo: 'Grande Arraiá do Jardim Paulista (Festa Junina)',
    data: '27/06/2026',
    horario: '17:00 às 23:00',
    local: 'Salão de Festas & Deck da Piscina',
    organizador: 'Comissão de Moradores & Zeladoria',
    visibilidade: 'Público',
    descricao: 'Tradicional Festa Junina do condomínio com barracas de comidas típicas (milho verde, pastel, quentão e canjica), pescaria infantil, correio elegante e quadrilha dos moradores!',
    imagem: '/Salão de festas.jpg',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'evt-churrasco-domingo',
    titulo: 'Churrasco de Domingo dos Amigos',
    data: '06/09/2026',
    horario: '12:00 às 19:00',
    local: 'Churrasqueira Gourmet & Deck Solarium',
    organizador: 'Renato Alencar (Apto 101)',
    visibilidade: 'Privado',
    descricao: 'Almoço de confraternização particular entre amigos e familiares. Uso reservado da churrasqueira externa e mesas do deck.',
    imagem: '/Piscina.jpg',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'evt-dia-das-criancas',
    titulo: 'Torneio Esportivo & Pipoca (Dia das Crianças)',
    data: '12/10/2026',
    horario: '09:00 às 13:00',
    local: 'Brinquedoteca & Quadra de Esportes',
    organizador: 'Comissão Esportiva do Condomínio',
    visibilidade: 'Público',
    descricao: 'Manhã de brincadeiras lúdicas, mini torneio de futsal infantil, piscina de bolinhas liberada, pipoca e distribuição de medalhas de participação.',
    imagem: '/Brinquedoteca.jpg',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_UNIDADES_DISPONIVEIS: UnidadeDisponivel[] = [
  {
    id: 'disp-apto-204-a',
    apartamento: '204',
    bloco: 'Bloco A',
    finalidade: 'Aluga-se',
    valor: 3800.00,
    valorCondominio: 850.00,
    valorIptu: 220.00,
    metragemM2: 82,
    quartos: 2,
    suites: 1,
    vagasGaragem: 1,
    proprietarioNome: 'Dr. Roberto Silveira',
    proprietarioTelefone: '(11) 98765-4321',
    proprietarioWhatsapp: '5511987654321',
    descricaoCurta: 'Apartamento reformado com varanda envidraçada, armários planejados na cozinha e suíte. Vista livre para a copa das árvores.',
    dataAnuncio: '20/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'disp-apto-502-b',
    apartamento: '502',
    bloco: 'Bloco B',
    finalidade: 'Vende-se',
    valor: 890000.00,
    valorCondominio: 1100.00,
    valorIptu: 340.00,
    metragemM2: 110,
    quartos: 3,
    suites: 2,
    vagasGaragem: 2,
    proprietarioNome: 'Dra. Camila Siqueira',
    proprietarioTelefone: '(11) 99123-8877',
    proprietarioWhatsapp: '5511991238877',
    descricaoCurta: 'Excelente planta de 3 dormitórios, sala ampliada para 2 ambientes, sacada gourmet e 2 vagas demarcadas no 1º subsolo.',
    dataAnuncio: '15/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'disp-apto-104-a',
    apartamento: '104',
    bloco: 'Bloco A',
    finalidade: 'Aluga-se',
    valor: 3200.00,
    valorCondominio: 780.00,
    valorIptu: 190.00,
    metragemM2: 68,
    quartos: 2,
    suites: 0,
    vagasGaragem: 1,
    proprietarioNome: 'Fernando Menezes',
    proprietarioTelefone: '(11) 97654-3210',
    proprietarioWhatsapp: '5511976543210',
    descricaoCurta: 'Apartamento aconchegante no 1º andar, recém-pintado, piso vinílico novo e cozinha com armários.',
    dataAnuncio: '18/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'disp-apto-303-a',
    apartamento: '303',
    bloco: 'Bloco A',
    finalidade: 'Aluga-se ou Vende-se',
    valor: 4200.00, // Aluguel R$ 4.200 ou Venda R$ 920.000
    valorCondominio: 950.00,
    valorIptu: 280.00,
    metragemM2: 95,
    quartos: 3,
    suites: 1,
    vagasGaragem: 2,
    proprietarioNome: 'Juliana Prado (Proprietária)',
    proprietarioTelefone: '(11) 99445-6677',
    proprietarioWhatsapp: '5511994456677',
    descricaoCurta: 'Totalmente mobiliado e decorado por arquiteto. Ar-condicionado inverter em todos os cômodos. Disponível para locação imediata ou venda.',
    dataAnuncio: '22/08/2026',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'disp-apto-701-b',
    apartamento: '701',
    bloco: 'Bloco B',
    finalidade: 'Vende-se',
    valor: 1650000.00,
    valorCondominio: 1850.00,
    valorIptu: 580.00,
    metragemM2: 185,
    quartos: 4,
    suites: 3,
    vagasGaragem: 3,
    proprietarioNome: 'Marcelo Alvarenga',
    proprietarioTelefone: '(11) 98888-2233',
    proprietarioWhatsapp: '5511988882233',
    descricaoCurta: 'Cobertura duplex exclusiva com terraço privativo, churrasqueira e vista panorâmica 360º de São Paulo. 3 vagas de garagem fixas.',
    dataAnuncio: '10/08/2026',
    condominioId: CURRENT_CONDO_ID
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
    categoria: 'Portaria',
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
    categoria: 'Limpeza',
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
    categoria: 'Portaria',
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
    funcao: 'Vigia Noturno & Ronda',
    categoria: 'Segurança',
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
    categoria: 'Gestão',
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
    categoria: 'Gestão',
    horario: '09:00 - 18:00',
    disponibilidade: 'Segunda a Sexta',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-7',
    nome: 'Fabio Sanches',
    foto: '/fabio_conselheiro.png',
    funcao: 'Conselheiro Fiscal',
    categoria: 'Gestão',
    horario: 'Reuniões e Pareceres',
    disponibilidade: 'Sob demanda',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'func-8',
    nome: 'Marco Aurélio',
    foto: '/marco_conselheiro.png',
    funcao: 'Conselheiro de Contas',
    categoria: 'Gestão',
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
    id: 'benfeitorias',
    titulo: 'Benfeitorias & Conquistas',
    icone: 'Sparkles',
    descricaoCurta: 'Tudo o que foi produzido pela nova gestão: fotos de entrega, grandes reparos e equilíbrio das contas.',
    desdobramentos: ['Fotos de entrega', 'Grandes reparos resolvidos', 'Equilíbrio das contas & Economia'],
    rota: '/benfeitorias',
    destaquePoC: true
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
    titulo: 'Dependências do Condomínio',
    icone: 'Building2',
    descricaoCurta: 'Brinquedoteca, Academia, Piscina, Salão de Festas, Jardim e Fachada com fotos reais, regras e reservas.',
    desdobramentos: ['Fotos e comodidades', 'Regras de convivência', 'Agendamento e reservas'],
    rota: '/dependencias',
    destaquePoC: true
  },
  {
    id: 'vagas-garagem',
    titulo: 'Vagas de Garagem & Veículos',
    icone: 'Car',
    descricaoCurta: 'Mapeamento das vagas por apartamento, contato direto via interfone e status (Em uso, Para alugar, Vazia).',
    desdobramentos: ['Vínculo com apartamento', 'Chamar interfone do morador', 'Status: Em uso / Para alugar / Vazia'],
    rota: '/vagas-garagem',
    destaquePoC: true
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
  },
  {
    id: 'unidades-disponiveis',
    titulo: 'Unidades Disponíveis',
    icone: 'KeyRound',
    descricaoCurta: 'Apartamentos para alugar ou vender no condomínio com contato direto do proprietário.',
    desdobramentos: ['Aluga-se e Vende-se', 'Contato direto do proprietário', 'Acesso exclusivo para condôminos'],
    rota: '/unidades-disponiveis',
    destaquePoC: true
  }
];

export const MOCK_REGRAS_CONDOMINIO: RegraTopico[] = [
  {
    id: 'pets',
    titulo: 'Animais de Estimação (Pets)',
    categoria: 'Convivência & Pets',
    conteudo: '<p>É permitida a permanência de <strong>animais domésticos</strong> nas unidades autônomas.</p><p>Nas áreas comuns, observe as seguintes diretrizes:</p><ol><li>Os animais devem estar <strong>sempre na coleira e guia</strong> curta.</li><li>É estritamente <strong>proibida sua circulação livre</strong> ou desacompanhada.</li><li>O tutor é civil e financeiramente responsável pela <strong>limpeza imediata</strong> de qualquer sujeira.</li><li>Em elevadores, dê preferência ao uso do <em>elevador de serviço</em> com seu pet.</li></ol>',
    palavrasChave: ['pet', 'pets', 'cachorro', 'gato', 'cão', 'animais', 'animal', 'coleira', 'sujeira', 'guia', 'elevador'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 1
  },
  {
    id: 'silencio',
    titulo: 'Lei do Silêncio e Barulhos',
    categoria: 'Silêncio & Horários',
    conteudo: '<p>O horário de <strong>silêncio rigoroso</strong> deve ser respeitado por todos os condôminos:</p><ul><li><strong>Dias de semana:</strong> das 22:00 às 08:00</li><li><strong>Finais de semana e feriados:</strong> das 23:00 às 09:00</li></ul><p>Ruídos excessivos, música alta, reformas, uso de furadeiras ou festas fora dos horários permitidos estão sujeitos a <strong>advertência formal e multa imediata</strong> conforme regimento.</p>',
    palavrasChave: ['silencio', 'silêncio', 'barulho', 'barulhos', 'som', 'musica', 'música', 'festa', 'festas', 'reforma', 'reformas', 'obra', 'obras', 'furadeira', 'ruido', 'ruídos'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 2
  },
  {
    id: 'piscina',
    titulo: 'Uso da Piscina',
    categoria: 'Lazer & Áreas Comuns',
    conteudo: '<p>A piscina é de uso exclusivo dos moradores e seus convidados autorizados:</p><ol><li><strong>Horário de funcionamento:</strong> de terça a domingo, das 08:00 às 20:00 (segunda fechada para manutenção).</li><li>É <strong>obrigatório o banho de ducha</strong> antes de adentrar na água.</li><li>Proibido levar <strong>copos, garrafas ou recipientes de vidro</strong> para a borda da piscina.</li><li>Crianças menores de 12 anos devem estar <strong>acompanhadas de um adulto responsável</strong>.</li></ol>',
    palavrasChave: ['piscina', 'piscina abre', 'ducha', 'chuveiro', 'banho', 'vidro', 'copo', 'garrafa', 'criança', 'crianças', 'menor', 'menores', 'acompanhado'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 3
  },
  {
    id: 'salao',
    titulo: 'Salão de Festas e Churrasqueira',
    categoria: 'Lazer & Áreas Comuns',
    conteudo: '<p>Normas para utilização do Salão de Festas e Quiosque com Churrasqueira:</p><ol><li>A reserva deve ser solicitada com no mínimo <strong>15 dias de antecedência</strong> pelo aplicativo.</li><li>A taxa de limpeza e conservação é de <strong>R$ 150,00</strong> debitada no condomínio seguinte.</li><li>O encerramento do evento deve ocorrer até as <strong>22:00 (semana)</strong> ou <strong>23:00 (fins de semana)</strong>.</li><li>O morador requerente responde integralmente por eventuais danos ao patrimônio.</li></ol>',
    palavrasChave: ['salão', 'salao', 'festa', 'churrasqueira', 'reserva', 'reservar', 'churrasco', 'taxa', 'limpeza', 'antecedência', 'aluguel'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 4
  },
  {
    id: 'garagem',
    titulo: 'Garagem e Vagas',
    categoria: 'Garagem & Trânsito',
    conteudo: '<p>Regras para o bom convívio nos subsolos e áreas de estacionamento:</p><ul><li>Cada unidade deve utilizar <strong>estritamente a vaga demarcada</strong> correspondente.</li><li>É expressamente <strong>proibido estacionar nas faixas de circulação</strong> ou bloquear outras vagas.</li><li>A velocidade máxima permitida no subsolo é de <strong>10 km/h</strong> com faróis baixos acesos.</li><li>Não é permitido guardar entulhos, móveis ou materiais inflamáveis na vaga.</li></ul>',
    palavrasChave: ['garagem', 'vaga', 'vagas', 'estacionar', 'estacionamento', 'carro', 'moto', 'velocidade', 'limite', 'subsolo', 'faixa'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 5
  },
  {
    id: 'lixo',
    titulo: 'Lixo e Descartes',
    categoria: 'Limpeza & Sustentabilidade',
    conteudo: '<p>Para manutenção da higiene e saúde coletiva:</p><ol><li>O <strong>lixo orgânico e reciclável</strong> deve ser depositado devidamente embalado em sacos plásticos reforçados nas lixeiras do hall de serviço.</li><li>O descarte de <strong>móveis, entulhos de reforma e eletrônicos</strong> é de responsabilidade do morador (contratar caçamba ou ecoponto).</li><li>É proibido deixar caixas e sacolas nos corredores ou áreas de passagem.</li></ol>',
    palavrasChave: ['lixo', 'descarte', 'descartar', 'reciclar', 'reciclavel', 'reciclável', 'entulho', 'moveis', 'móveis', 'hall', 'serviço', 'sacola'],
    criadoEm: '2026-01-10',
    ativo: true,
    ordem: 6
  }
];

