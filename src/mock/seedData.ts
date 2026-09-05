import { User, Unidade, Reclamacao, Reparo, PrestacaoContas, Funcionario, EspinhaDorsalItem, Benfeitoria, VagaGaragem, ServicoContratado, Dependencia, ReservaDependencia, Assembleia, EventoCondominio, UnidadeDisponivel, RegraTopico, ItemEnjoei, RegistroAtividade, MudancaAgendamento, RegrasMudancaConfig, AutorizacaoAcesso, EncomendaEntrega, CondominioProfile } from '../types';

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
  // 1. ELEVADORES
  {
    id: 'sc-elev-1',
    empresaNome: 'Atlas Schindler do Brasil Ltda',
    cnpj: '61.123.456/0001-89',
    categoria: 'Elevadores',
    status: 'Contratada',
    servicoDescricao: 'Contrato integral de manutenção preventiva e corretiva mensal de 4 elevadores (sociais e de serviço), com atendimento técnico emergencial 24h e seguro de responsabilidade.',
    valor: 4100.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto faturado todo dia 15',
    telefone: '(11) 3878-9000',
    whatsapp: '5511988776655',
    email: 'atendimento.sp@schindler.com',
    siteUrl: 'https://www.schindler.com.br',
    responsavelContato: 'Eng. Maurício Peixoto (Gestor de Contas)',
    dataContratoOuOrcamento: '15/07/2026',
    observacoes: 'Empresa contratada e em plena atividade. Pontualidade exemplar nos atendimentos preventivos.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-elev-2',
    empresaNome: 'Otis Elevadores S.A.',
    cnpj: '50.987.654/0001-32',
    categoria: 'Elevadores',
    status: 'Orçada',
    servicoDescricao: 'Cotação para manutenção preventiva mensal e suporte técnico 24h com monitoramento remoto via telemetria IoT.',
    valor: 4450.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto bancário mensal',
    telefone: '(11) 3500-1122',
    whatsapp: '5511977665544',
    email: 'comercial.sp@otis.com',
    siteUrl: 'https://www.otis.com/pt/br',
    responsavelContato: 'Tatiane Duarte (Consultora Comercial)',
    dataContratoOuOrcamento: '10/07/2026',
    observacoes: 'Orçamento cadastrado para comparação periódica de preços de mercado.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-elev-3',
    empresaNome: 'TK Elevator Brasil (Thyssenkrupp)',
    cnpj: '33.222.111/0001-05',
    categoria: 'Elevadores',
    status: 'Orçada',
    servicoDescricao: 'Proposta comercial de modernização e manutenção preventiva com pacote de peças inclusas.',
    valor: 4300.00,
    tipoValor: 'mensal',
    formaPagamento: 'Faturamento 30 dias',
    telefone: '(11) 3090-4400',
    whatsapp: '5511966554433',
    email: 'contato@tkelevator.com.br',
    siteUrl: 'https://www.tkelevator.com/br-pt',
    responsavelContato: 'Felipe Ramos',
    dataContratoOuOrcamento: '12/07/2026',
    observacoes: 'Proposta concorrente apresentada na última cotação anual.',
    condominioId: CURRENT_CONDO_ID
  },

  // 2. PAISAGISMO & JARDINAGEM
  {
    id: 'sc-paisag-1',
    empresaNome: 'Verde & Arte Paisagismo e Jardinagem',
    cnpj: '28.444.555/0001-67',
    categoria: 'Paisagismo',
    status: 'Contratada',
    servicoDescricao: 'Manutenção semanal do bosque, jardim frontal e floreiras: podas ornamentais, adubação orgânica, corte de grama e tratamento de pragas vegetais.',
    valor: 2800.00,
    tipoValor: 'mensal',
    formaPagamento: 'Depósito / Pix até o 5º dia útil',
    telefone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    email: 'contato@verdertepaisagismo.com.br',
    siteUrl: 'https://verdertepaisagismo.exemplo.com.br',
    responsavelContato: 'Cláudio Nogueira (Paisagista Responsável)',
    dataContratoOuOrcamento: '01/03/2026',
    observacoes: 'Equipe dedicada às terças e quintas-feiras. Jardim revitalizado com excelência.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-paisag-2',
    empresaNome: 'Jardins da Villa Botânica',
    cnpj: '19.888.777/0001-45',
    categoria: 'Paisagismo',
    status: 'Orçada',
    servicoDescricao: 'Proposta de revitalização do bosque interno com plantio de mudas floríferas e projeto de irrigação automatizada.',
    valor: 3100.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto bancário quinzenal',
    telefone: '(11) 97788-9900',
    whatsapp: '5511977889900',
    email: 'orcamentos@jardinsdavilla.com.br',
    siteUrl: 'https://jardinsdavilla.exemplo.com.br',
    responsavelContato: 'Mariana Esteves',
    dataContratoOuOrcamento: '20/02/2026',
    observacoes: 'Orçamento mantido no banco de fornecedores.',
    condominioId: CURRENT_CONDO_ID
  },

  // 3. ELÉTRICA & GERADORES
  {
    id: 'sc-elet-1',
    empresaNome: 'Geradores SP Engenharia & Manutenção',
    cnpj: '15.678.901/0001-34',
    categoria: 'Elétrica',
    status: 'Contratada',
    servicoDescricao: 'Manutenção preventiva mensal do grupo gerador Cummins 150kVA, testes de transferência automática (QTA), troca de filtros e análise de óleo mineral.',
    valor: 1200.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto faturado 30 dias',
    telefone: '(11) 3211-8899',
    whatsapp: '5511988990011',
    email: 'suporte@geradoressp.com.br',
    siteUrl: 'https://geradoressp.exemplo.com.br',
    responsavelContato: 'Eng. Carlos Eduardo Martins',
    dataContratoOuOrcamento: '10/06/2026',
    observacoes: 'Gerador em operação perfeita, acionando em menos de 5 segundos nas quedas de energia.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-elet-2',
    empresaNome: 'MegaVolt Soluções Elétricas',
    cnpj: '52.123.456/0001-99',
    categoria: 'Elétrica',
    status: 'Orçada',
    servicoDescricao: 'Cotação para revisão semestral do quadro de barramento e manutenção preventiva de geradores a diesel.',
    valor: 1450.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto bancário',
    telefone: '(11) 3344-5566',
    whatsapp: '5511983334455',
    email: 'comercial@megavolt.com.br',
    siteUrl: 'https://megavolt.exemplo.com.br',
    responsavelContato: 'Lucas Brandão',
    dataContratoOuOrcamento: '05/06/2026',
    observacoes: 'Fornecedor orçado para backup de emergência.',
    condominioId: CURRENT_CONDO_ID
  },

  // 4. SEGURANÇA & PORTARIA 24H
  {
    id: 'sc-seg-1',
    empresaNome: 'Grupo Delta Segurança & Serviços 24h',
    cnpj: '09.333.222/0001-11',
    categoria: 'Segurança & Portaria',
    status: 'Contratada',
    servicoDescricao: 'Prestação de serviços contínuos de portaria presencial 24h (escala 12x36), controle de acesso informatizado, vigilância patrimonial e ronda perimetral.',
    valor: 28400.00,
    tipoValor: 'mensal',
    formaPagamento: 'Faturamento dia 05 via boleto',
    telefone: '(11) 3100-2000',
    whatsapp: '5511991002000',
    email: 'gestao@grupodeltaseg.com.br',
    siteUrl: 'https://grupodeltaseg.exemplo.com.br',
    responsavelContato: 'Inspetor Valdir Fontana',
    dataContratoOuOrcamento: '01/01/2026',
    observacoes: 'Equipe treinada com supervisão diária e plantão 24h.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-seg-2',
    empresaNome: 'Gocil Segurança e Multisserviços',
    cnpj: '55.444.333/0001-88',
    categoria: 'Segurança & Portaria',
    status: 'Orçada',
    servicoDescricao: 'Proposta comercial para terceirização completa de portaria, zeladoria e ronda tática armada.',
    valor: 30200.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto faturado',
    telefone: '(11) 3300-8000',
    whatsapp: '5511988887700',
    email: 'vendas@gocil.com.br',
    siteUrl: 'https://www.gocil.com.br',
    responsavelContato: 'Helena Ribeiro (Gerente Corporativa)',
    dataContratoOuOrcamento: '15/12/2025',
    observacoes: 'Cotação arquivada para consulta em futuras concorrências.',
    condominioId: CURRENT_CONDO_ID
  },

  // 5. CFTV, INTERFONIA & CONTROLE DE ACESSO
  {
    id: 'sc-cftv-1',
    empresaNome: 'Intelbras Guard Soluções Integradas',
    cnpj: '18.456.789/0001-77',
    categoria: 'CFTV & Interfonia',
    status: 'Contratada',
    servicoDescricao: 'Instalação e garantia de 28 câmeras IP Intelbras 4K ColorVu, 2 gravadores NVR com inteligência artificial perimetral e automação da clausura de pedestres.',
    valor: 16800.00,
    tipoValor: 'pontual',
    formaPagamento: 'Entrada 30% + 4x no boleto sem juros',
    telefone: '(11) 4004-9988',
    whatsapp: '5511999884004',
    email: 'suporte@intelbrasguard.com.br',
    siteUrl: 'https://intelbrasguard.exemplo.com.br',
    responsavelContato: 'Eng. Rodrigo Alencar',
    dataContratoOuOrcamento: '08/08/2026',
    observacoes: 'Contrato assinado em agosto. Instalação concluída com imagens em alta definição.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-cftv-2',
    empresaNome: 'SegurTech Condominial SP',
    cnpj: '72.333.444/0001-90',
    categoria: 'CFTV & Interfonia',
    status: 'Orçada',
    servicoDescricao: 'Orçamento de 24 câmeras IP Hikvision e sistema de interfonia digital IP nos apartamentos.',
    valor: 15400.00,
    tipoValor: 'pontual',
    formaPagamento: 'Entrada 40% + 3 parcelas',
    telefone: '(11) 3660-1234',
    whatsapp: '5511976601234',
    email: 'contato@segurtech.com.br',
    siteUrl: 'https://segurtech.exemplo.com.br',
    responsavelContato: 'Vinicius Prado',
    dataContratoOuOrcamento: '02/08/2026',
    observacoes: 'Proposta concorrente avaliada pela comissão de segurança.',
    condominioId: CURRENT_CONDO_ID
  },

  // 6. PISCINA & TRATAMENTO TÉRMICO
  {
    id: 'sc-pisc-1',
    empresaNome: 'AcquaClean Piscinas e Aquecimento Solar',
    cnpj: '31.777.888/0001-09',
    categoria: 'Piscina',
    status: 'Contratada',
    servicoDescricao: 'Tratamento químico especializado 3x por semana, aspiração de fundo, dosagem de cloração, controle de alcalinidade/pH e manutenção preventiva das bombas de aquecimento solar.',
    valor: 1650.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto dia 20 com produtos químicos inclusos',
    telefone: '(11) 98456-7890',
    whatsapp: '5511984567890',
    email: 'acquaclean@piscinassp.com.br',
    siteUrl: 'https://acquaclean.exemplo.com.br',
    responsavelContato: 'Marcelo Pires (Químico Técnico)',
    dataContratoOuOrcamento: '15/01/2026',
    observacoes: 'Água com laudo de potabilidade e cloração 100% dentro dos padrões da vigilância sanitária.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-pisc-2',
    empresaNome: 'Pool Tech Manutenções Aquáticas',
    cnpj: '48.111.222/0001-33',
    categoria: 'Piscina',
    status: 'Orçada',
    servicoDescricao: 'Cotação mensal para tratamento e revisão do sistema de recirculação e bombas de calor.',
    valor: 1900.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto faturado',
    telefone: '(11) 3788-9900',
    whatsapp: '5511997889900',
    email: 'comercial@pooltech.com.br',
    siteUrl: 'https://pooltech.exemplo.com.br',
    responsavelContato: 'Sérgio Antunes',
    dataContratoOuOrcamento: '10/01/2026',
    observacoes: 'Orçamento registrado no catálogo.',
    condominioId: CURRENT_CONDO_ID
  },

  // 7. PINTURA & FACHADA
  {
    id: 'sc-pint-1',
    empresaNome: 'Engenharia & Fachadas Paulista',
    cnpj: '44.555.666/0001-23',
    categoria: 'Pintura & Fachada',
    status: 'Contratada',
    servicoDescricao: 'Lavagem pressurizada (hidrojateamento), teste de percussão, recuperação de pastilhas soltas, impermeabilização de fissuras e pintura emborrachada de alta proteção com garantia de 5 anos.',
    valor: 58000.00,
    tipoValor: 'pontual',
    formaPagamento: 'Sinal 20% + 8 parcelas por medição técnica',
    telefone: '(11) 3255-6677',
    whatsapp: '5511992556677',
    email: 'engenharia@fachadaspaulista.com.br',
    siteUrl: 'https://fachadaspaulista.exemplo.com.br',
    responsavelContato: 'Eng. Roberto Mascarenhas',
    dataContratoOuOrcamento: '22/08/2026',
    observacoes: 'Contrato aprovado em assembleia geral com acompanhamento de laudo técnico de engenharia (ART).',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-pint-2',
    empresaNome: 'Alpha Fachadas e Restauração Predial',
    cnpj: '37.888.999/0001-50',
    categoria: 'Pintura & Fachada',
    status: 'Orçada',
    servicoDescricao: 'Cotação para lavagem com pastilhamento e pintura acrílica fosca externa nos dois blocos.',
    valor: 64000.00,
    tipoValor: 'pontual',
    formaPagamento: '10 parcelas mensais',
    telefone: '(11) 3499-0011',
    whatsapp: '5511984990011',
    email: 'contato@alphafachadas.com.br',
    siteUrl: 'https://alphafachadas.exemplo.com.br',
    responsavelContato: 'Bruno Toledo',
    dataContratoOuOrcamento: '18/08/2026',
    observacoes: 'Orçamento concorrente arquivado para registro de tomadas de preço.',
    condominioId: CURRENT_CONDO_ID
  },

  // 8. CONTROLE DE PRAGAS & DEDETIZAÇÃO
  {
    id: 'sc-prag-1',
    empresaNome: 'BioPragas Dedetização & Desratização',
    cnpj: '21.000.999/0001-87',
    categoria: 'Dedetização & Pragas',
    status: 'Contratada',
    servicoDescricao: 'Desinsetização e desratização semestral de todas as áreas comuns, lixeiras, garagens, subsolos e hidrojateamento/higienização de 4 caixas d’água com laudo bacteriológico.',
    valor: 850.00,
    tipoValor: 'semestral',
    formaPagamento: 'Pix / Boleto 30 dias após aplicação',
    telefone: '(11) 3999-8800',
    whatsapp: '5511999998800',
    email: 'atendimento@biopragas.com.br',
    siteUrl: 'https://biopragas.exemplo.com.br',
    responsavelContato: 'Biólogo Fernando Castro',
    dataContratoOuOrcamento: '05/04/2026',
    observacoes: 'Certificado afixado nos murais dos elevadores com validade até Outubro/2026.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-prag-2',
    empresaNome: 'Desentupidora e Dedetizadora Sanear',
    cnpj: '14.555.444/0001-21',
    categoria: 'Dedetização & Pragas',
    status: 'Orçada',
    servicoDescricao: 'Cotação para limpeza semestral de reservatórios de água e aplicação de gel contra baratas e formigas.',
    valor: 1100.00,
    tipoValor: 'semestral',
    formaPagamento: 'Boleto bancário',
    telefone: '(11) 3288-7700',
    whatsapp: '5511982887700',
    email: 'orcamento@sanear.com.br',
    siteUrl: 'https://sanear.exemplo.com.br',
    responsavelContato: 'Danilo Silveira',
    dataContratoOuOrcamento: '28/03/2026',
    observacoes: 'Orçamento mantido no banco de fornecedores cotados.',
    condominioId: CURRENT_CONDO_ID
  },

  // 9. SERRALHERIA & AUTOMAÇÃO DE PORTÕES
  {
    id: 'sc-port-1',
    empresaNome: 'Portões & Automações Paulista',
    cnpj: '67.888.111/0001-92',
    categoria: 'Serralheria & Portões',
    status: 'Contratada',
    servicoDescricao: 'Manutenção mensal preventiva e corretiva dos motores industriais dos portões da garagem (entrada/saída) e cancelas eletrônicas com acionamento tag RFID.',
    valor: 950.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto bancário todo dia 10',
    telefone: '(11) 3811-2233',
    whatsapp: '5511998112233',
    email: 'suporte@portoespaulista.com.br',
    siteUrl: 'https://portoespaulista.exemplo.com.br',
    responsavelContato: 'Técnico André Guimarães',
    dataContratoOuOrcamento: '01/05/2026',
    observacoes: 'Tempo de resposta rápido em chamados de travamento de portão.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'sc-port-2',
    empresaNome: 'Automatiza Portões e Serralheria SP',
    cnpj: '89.123.456/0001-01',
    categoria: 'Serralheria & Portões',
    status: 'Orçada',
    servicoDescricao: 'Proposta para troca do conjunto de roldanas e trilhos de aço galvanizado dos portões basculantes.',
    valor: 1150.00,
    tipoValor: 'mensal',
    formaPagamento: 'Boleto faturado',
    telefone: '(11) 3456-7890',
    whatsapp: '5511974567890',
    email: 'comercial@automatizaportoes.com.br',
    siteUrl: 'https://automatizaportoes.exemplo.com.br',
    responsavelContato: 'Jair Mendes',
    dataContratoOuOrcamento: '25/04/2026',
    observacoes: 'Orçamento orçado para histórico de preços.',
    condominioId: CURRENT_CONDO_ID
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
    email: 'ademar@condominio.com',
    usuario: 'ademar@condominio.com',
    senha: 'ademar@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['portaria'],
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
    email: 'anastacia@condominio.com',
    usuario: 'anastacia@condominio.com',
    senha: 'anastacia@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['reparos', 'dependencias'],
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
    email: 'jose.porteiro@condominio.com',
    usuario: 'jose.porteiro@condominio.com',
    senha: 'jose.porteiro@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['portaria', 'mudancas'],
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
    email: 'jose.vigia@condominio.com',
    usuario: 'jose.vigia@condominio.com',
    senha: 'jose.vigia@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['portaria', 'reparos'],
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
    email: 'adriana@condominio.com',
    usuario: 'adriana@condominio.com',
    senha: 'adriana@condominio.com',
    senhaPadraoAlterada: true,
    tipoAcesso: 'total',
    permissoesModulos: ['portaria', 'mudancas', 'dependencias', 'reparos', 'reclamacoes', 'eventos', 'servicos', 'unidades', 'equipe', 'financeiro', 'regras', 'imoveis', 'fornecedores', 'enjoei', 'assembleias', 'diario-sindico'],
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
    email: 'cassia@condominio.com',
    usuario: 'cassia@condominio.com',
    senha: 'cassia@condominio.com',
    senhaPadraoAlterada: true,
    tipoAcesso: 'total',
    permissoesModulos: ['portaria', 'mudancas', 'dependencias', 'reparos', 'reclamacoes', 'eventos', 'servicos', 'unidades', 'equipe', 'financeiro', 'regras', 'imoveis', 'fornecedores', 'enjoei', 'assembleias', 'diario-sindico'],
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
    email: 'fabio@condominio.com',
    usuario: 'fabio@condominio.com',
    senha: 'fabio@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['financeiro', 'assembleias', 'regras'],
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
    email: 'marco@condominio.com',
    usuario: 'marco@condominio.com',
    senha: 'marco@condominio.com',
    senhaPadraoAlterada: false,
    tipoAcesso: 'personalizado',
    permissoesModulos: ['financeiro', 'assembleias', 'reparos'],
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
  },
  {
    id: 'enjoei',
    titulo: 'Enjoei do condomínio',
    icone: 'ShoppingBag',
    descricaoCurta: 'Mural de desapego dos moradores: vendas, doações gratuitas, itens para retirada e trocas (permutas).',
    desdobramentos: ['Vendas e Doações', 'Trocas e Permutas', 'Móveis para Retirada', 'Contato WhatsApp'],
    rota: '/enjoei',
    destaquePoC: true
  },
  {
    id: 'mudancas',
    titulo: 'Mudanças & Carretos',
    icone: 'Truck',
    descricaoCurta: 'Agendamento de mudanças de entrada/saída, horários permitidos e reserva de elevador com acolchoado.',
    desdobramentos: ['Entrada e Desocupação', 'Carretos e Entregas Pesadas', 'Reserva de Elevador', 'Autorização Portaria'],
    rota: '/mudancas',
    destaquePoC: true
  },
  {
    id: 'portaria',
    titulo: 'Entregas & Portaria (Acessos)',
    icone: 'PackageCheck',
    descricaoCurta: 'Autorize visitas, prestadores e entregas com foto e horário, e receba avisos de encomendas na portaria.',
    desdobramentos: ['Autorização de Entrada', 'Foto e Horário do Visitante', 'Encomendas & Pacotes', 'Avisos da Portaria'],
    rota: '/portaria',
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

export const MOCK_ITENS_ENJOEI: ItemEnjoei[] = [
  {
    id: 'enj-piano-yamaha',
    titulo: 'Piano Digital Yamaha P-45 (88 Teclas Pesadas)',
    descricao: 'Piano digital em perfeito estado com teclas com sensibilidade graduada (GHS), fonte original bivolt, pedal de sustain e suporte em X reforçado. Pouco usado, guardado sempre com capa protetora.',
    categoria: 'Instrumentos Musicais',
    tipoTransacao: 'venda',
    preco: 2400.00,
    condicao: 'Seminovo (Excelente)',
    fotos: [
      'https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514117445516-2cefc9c4ec90?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Eduardo Prado',
    moradorUnidade: 'Apto 502 - Bloco B',
    moradorFoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511988887766',
    dataPublicacao: '28/08/2026',
    status: 'disponivel',
    destaque: true,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-panela-eletrica',
    titulo: 'Panela de Pressão Elétrica Electrolux 6L (Nova na Caixa)',
    descricao: 'Ganhei em um sorteio e nunca usei, caixa lacrada com todos os manuais, copo dosador e colher antiaderente. Gostaria de trocar por uma câmera fotográfica digital ou por um casaco de frio pesado tamanho M (masculino ou unissex).',
    categoria: 'Eletrodomésticos & Cozinha',
    tipoTransacao: 'troca',
    trocaPor: 'Câmera fotográfica semi-profissional ou Casaco de frio pesado Tam M',
    condicao: 'Novo / Lacrado',
    fotos: [
      'https://images.unsplash.com/photo-1584990347449-39908cf83a21?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Juliana Vasconcelos',
    moradorUnidade: 'Apto 204 - Bloco A',
    moradorFoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511977112233',
    dataPublicacao: '27/08/2026',
    status: 'disponivel',
    destaque: true,
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-sofa-retratil',
    titulo: 'Sofá Retrátil 3 Lugares Suede Cinza Chumbo',
    descricao: 'Estamos redecorando a sala e desapegando do sofá. Tecido suede macio, estrutura firme, apenas marcas leves de uso. É GRÁTIS para quem retirar diretamente no apartamento (precisa de 2 pessoas e frete/carreto por conta do vizinho).',
    categoria: 'Móveis & Decoração',
    tipoTransacao: 'retirada',
    preco: 0,
    condicao: 'Usado (Bom estado)',
    fotos: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Carlos Menezes',
    moradorUnidade: 'Apto 701 - Bloco A',
    moradorFoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511999887711',
    dataPublicacao: '26/08/2026',
    status: 'disponivel',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-bike-infantil',
    titulo: 'Bicicleta Infantil Aro 16 Caloi Cecizinha com Rodinhas',
    descricao: 'Bicicleta infantil com cestinha frontal e rodinhas laterais de apoio removíveis. Minha filha cresceu e não usa mais. Doação sem qualquer custo para famílias com crianças no prédio.',
    categoria: 'Infantil & Brinquedos',
    tipoTransacao: 'doacao',
    preco: 0,
    condicao: 'Usado (Bom estado)',
    fotos: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Mariana Duarte',
    moradorUnidade: 'Apto 104 - Bloco B',
    moradorFoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511966554411',
    dataPublicacao: '25/08/2026',
    status: 'disponivel',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-furadeira-bosch',
    titulo: 'Furadeira de Impacto Bosch GSB 550W + Jogo de Brocas',
    descricao: 'Disponibilizo para empréstimo/locação temporária para vizinhos que precisarem furar parede, instalar cortina ou montar móveis. Acompanha chave de mandril e kit de brocas de vídea e aço rápido.',
    categoria: 'Ferramentas & Casa',
    tipoTransacao: 'emprestimo',
    preco: 20.00,
    condicao: 'Seminovo (Excelente)',
    fotos: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Ricardo Fontes',
    moradorUnidade: 'Apto 303 - Bloco B',
    moradorFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511981234567',
    dataPublicacao: '24/08/2026',
    status: 'disponivel',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-jaqueta-couro',
    titulo: 'Jaqueta de Couro Legítimo Masculina (Tam G - Marrom Café)',
    descricao: 'Jaqueta de couro 100% natural, forrada por dentro, acabamento de primeira linha. Usada 2 vezes apenas. Aceito troca por jogo de videogame PS5 (tipo Spider-Man 2 ou FIFA) ou fone de ouvido bluetooth.',
    categoria: 'Roupas & Acessórios',
    tipoTransacao: 'troca',
    trocaPor: 'Jogos de PS5 ou Fone Bluetooth JBL/Sony',
    condicao: 'Seminovo (Excelente)',
    fotos: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Gabriel Silveira',
    moradorUnidade: 'Apto 601 - Bloco B',
    moradorFoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511972345678',
    dataPublicacao: '23/08/2026',
    status: 'disponivel',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enj-monitor-gamer',
    titulo: 'Monitor Gamer AOC 24" 144Hz IPS 1ms FreeSync',
    descricao: 'Monitor gamer sem dead pixels, suporte com ajuste de altura e rotação para modo vertical. Acompanha cabo DisplayPort original e fonte.',
    categoria: 'Eletrônicos & Informática',
    tipoTransacao: 'venda',
    preco: 520.00,
    condicao: 'Seminovo (Excelente)',
    fotos: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    moradorNome: 'Lucas Andrade',
    moradorUnidade: 'Apto 301 - Bloco A',
    moradorFoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    contatoWhatsapp: '5511983456789',
    dataPublicacao: '22/08/2026',
    status: 'disponivel',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_REGRAS_MUDANCA: RegrasMudancaConfig = {
  horarioSegundaSexta: '08:00 às 17:00 (Segunda a Sexta-feira)',
  horarioSabado: '08:00 às 13:00 (Sábado)',
  domingosFeriadosPermitido: false,
  antecedenciaMinimaDias: 2,
  taxaMudanca: 120.00,
  regrasGerais: [
    'Obrigatório o agendamento prévio com antecedência mínima de 48 horas.',
    'A portaria somente liberará caminhões e carretos com autorização confirmada no sistema.',
    'O zelador providenciará a colocação do acolchoado de proteção no elevador de serviço antes do início.',
    'Caminhões de mudança devem estacionar estritamente na baia indicada pela portaria.',
    'É expressamente proibido o uso do elevador social para transporte de móveis, caixas pesadas e eletrodomésticos.',
    'O descarte de caixas de papelão e embalagens deve ser desmontado e colocado no depósito de recicláveis.',
    'Eventuais danos a paredes, espelhos ou portas serão vistoriados e de responsabilidade da unidade.'
  ]
};

export const MOCK_MUDANCAS: MudancaAgendamento[] = [
  {
    id: 'mud-001',
    moradorId: 'usr-morador-301',
    moradorNome: 'Juliana Costa',
    moradorTelefone: '(11) 98765-4321',
    unidade: '301',
    bloco: 'Bloco A',
    tipo: 'Entrada (Novo Morador)',
    dataMudanca: '05/09/2026',
    dataMudancaIso: '2026-09-05',
    periodo: 'Manhã (08h às 13h)',
    status: 'Confirmada',
    transportadora: 'Granero Mudanças & Logística',
    placaVeiculo: 'BRA2E19',
    nomeMotorista: 'Carlos Eduardo Santos',
    rgMotorista: '34.567.890-X',
    precisaElevadorServico: true,
    precisaAcolchoamentoElevador: true,
    termoCienciaAssinado: true,
    observacoes: 'Mudança residencial completa vinda de Curitiba. Caminhão baú médio.',
    criadoEm: '29/08/2026 10:15',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'mud-002',
    moradorId: 'usr-morador-502',
    moradorNome: 'Ricardo Mendonça',
    moradorTelefone: '(11) 99123-8877',
    unidade: '502',
    bloco: 'Bloco B',
    tipo: 'Carreto / Mobília Pesada',
    dataMudanca: '02/09/2026',
    dataMudancaIso: '2026-09-02',
    periodo: 'Tarde (13h às 18h)',
    status: 'Confirmada',
    transportadora: 'Fretes & Carretos SP Express',
    placaVeiculo: 'DKM4A55',
    nomeMotorista: 'Márcio Nogueira',
    precisaElevadorServico: true,
    precisaAcolchoamentoElevador: true,
    termoCienciaAssinado: true,
    observacoes: 'Entrega de sofá retrátil novo de 3 lugares e mesa de jantar com 6 cadeiras.',
    criadoEm: '30/08/2026 16:40',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'mud-003',
    moradorId: 'usr-morador-101',
    moradorNome: 'Fernanda Lima',
    moradorTelefone: '(11) 98222-1133',
    unidade: '101',
    bloco: 'Bloco A',
    tipo: 'Saída (Desocupação)',
    dataMudanca: '12/09/2026',
    dataMudancaIso: '2026-09-12',
    periodo: 'Integral (08h às 17h)',
    status: 'Pendente de Aprovação',
    transportadora: 'TransMudança Express',
    placaVeiculo: 'FGH8J99',
    precisaElevadorServico: true,
    precisaAcolchoamentoElevador: true,
    termoCienciaAssinado: true,
    observacoes: 'Término do contrato de locação. Vistoria final marcada para a segunda-feira.',
    criadoEm: '31/08/2026 09:30',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_REGISTROS_ATIVIDADES: RegistroAtividade[] = [
  {
    id: 'act-001',
    dataHora: '31/08/2026 14:10',
    dataIso: '2026-08-31',
    hora: '14:10',
    tipo: 'reclamacao_aberta',
    titulo: 'Nova Reclamação Registrada',
    descricao: 'Apto 204 registrou reclamação de barulho excessivo no 3º andar após às 22h.',
    autorNome: 'Larissa Manoela',
    autorUnidade: '204',
    autorTipo: 'morador',
    categoriaBadge: 'Ocorrência',
    linkTela: 'reclamacoes',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-002',
    dataHora: '31/08/2026 11:35',
    dataIso: '2026-08-31',
    hora: '11:35',
    tipo: 'reserva_solicitada',
    titulo: 'Reserva de Espaço Confirmada',
    descricao: 'Apto 102 agendou o Salão de Festas & Espaço Gourmet para 18/09 (Turno Noite).',
    autorNome: 'Marcos Almeida',
    autorUnidade: '102',
    autorTipo: 'morador',
    categoriaBadge: 'Reservas',
    linkTela: 'dependencias',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-003',
    dataHora: '31/08/2026 09:30',
    dataIso: '2026-08-31',
    hora: '09:30',
    tipo: 'mudanca_agendada',
    titulo: 'Solicitação de Mudança de Saída',
    descricao: 'Apto 101 solicitou agendamento de mudança para 12/09 com proteção de elevador.',
    autorNome: 'Fernanda Lima',
    autorUnidade: '101',
    autorTipo: 'morador',
    categoriaBadge: 'Mudanças',
    linkTela: 'mudancas',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-004',
    dataHora: '30/08/2026 17:45',
    dataIso: '2026-08-30',
    hora: '17:45',
    tipo: 'reparo_orcamento',
    titulo: 'Novo Orçamento de Reparo Anexado',
    descricao: 'Administração publicou orçamento de R$ 1.850,00 da Automatiza Tech para o portão da garagem.',
    autorNome: 'Adriana Silva (Síndica)',
    autorTipo: 'admin',
    categoriaBadge: 'Reparos',
    linkTela: 'reparos',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-005',
    dataHora: '30/08/2026 15:20',
    dataIso: '2026-08-30',
    hora: '15:20',
    tipo: 'morador_novo',
    titulo: 'Novo Condômino Cadastrado',
    descricao: 'Unidade 403 teve cadastro ativado para Dr. Marcelo Antunes.',
    autorNome: 'Administração',
    autorTipo: 'admin',
    categoriaBadge: 'Moradores',
    linkTela: 'moradores',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-006',
    dataHora: '30/08/2026 10:00',
    dataIso: '2026-08-30',
    hora: '10:00',
    tipo: 'enjoei_publicado',
    titulo: 'Novo Desapego no Bazar Enjoei',
    descricao: 'Apto 201 publicou "Bicicleta Caloi Aro 29" no mural de desapegos.',
    autorNome: 'Paula Souza',
    autorUnidade: '201',
    autorTipo: 'morador',
    categoriaBadge: 'Enjoei',
    linkTela: 'enjoei',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-007',
    dataHora: '29/08/2026 14:00',
    dataIso: '2026-08-29',
    hora: '14:00',
    tipo: 'financeiro_lancamento',
    titulo: 'Prestação de Contas Atualizada',
    descricao: 'Inserido comprovante fiscal de manutenção da piscina (R$ 680,00).',
    autorNome: 'Conselho Fiscal',
    autorTipo: 'admin',
    categoriaBadge: 'Financeiro',
    linkTela: 'prestacao-contas',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'act-008',
    dataHora: '28/08/2026 18:30',
    dataIso: '2026-08-28',
    hora: '18:30',
    tipo: 'assembleia_publicada',
    titulo: 'Ata de Assembleia Publicada',
    descricao: 'Ata da Assembleia Geral Ordinária de Agosto homologada e disponível para download.',
    autorNome: 'Adriana Silva (Síndica)',
    autorTipo: 'admin',
    categoriaBadge: 'Assembleia',
    linkTela: 'assembleias',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_AUTORIZACOES_ACESSO: AutorizacaoAcesso[] = [
  {
    id: 'acesso-001',
    moradorId: 'usr-morador-102',
    moradorNome: 'Marcos Almeida',
    unidade: '102',
    bloco: 'Bloco A',
    tipoVisitante: 'Prestador de Serviço',
    nomeVisitante: 'Roberto Eletricista (Luz & Força)',
    documentoRg: '45.123.890-7',
    telefoneVisitante: '(11) 98111-2233',
    fotoVisitante: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    dataPrevista: '31/08/2026',
    dataPrevistaIso: '2026-08-31',
    horarioEstimado: 'Por volta das 15:30',
    deixarEntrarDireto: true,
    observacoes: 'Vem fazer a troca de disjuntores do quadro de força interno. Pode liberar entrada direto.',
    status: 'Aguardando Chegada',
    criadoEm: '31/08/2026 11:20',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'acesso-002',
    moradorId: 'usr-morador-204',
    moradorNome: 'Larissa Manoela',
    unidade: '204',
    bloco: 'Bloco B',
    tipoVisitante: 'Visita / Familiar',
    nomeVisitante: 'Dra. Beatriz Peixoto',
    documentoRg: '38.990.112-4',
    telefoneVisitante: '(11) 97654-3210',
    fotoVisitante: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    dataPrevista: '31/08/2026',
    dataPrevistaIso: '2026-08-31',
    horarioEstimado: 'Entre 17:00 e 18:00',
    deixarEntrarDireto: false,
    observacoes: 'Minha prima do Rio. Favor interfonar assim que ela se identificar.',
    status: 'Aguardando Chegada',
    criadoEm: '31/08/2026 13:45',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'acesso-003',
    moradorId: 'usr-morador-301',
    moradorNome: 'Juliana Costa',
    unidade: '301',
    bloco: 'Bloco A',
    tipoVisitante: 'Delivery / Entregador',
    nomeVisitante: 'Carlos Silva (Farmácia Pague Menos)',
    dataPrevista: '31/08/2026',
    dataPrevistaIso: '2026-08-31',
    horarioEstimado: '14:00',
    deixarEntrarDireto: true,
    observacoes: 'Entrega de medicamentos de uso contínuo. Pode subir até o 3º andar.',
    status: 'Entrada Liberada / Presente',
    horarioEntradaReal: '14:05',
    porteiroResponsavel: 'Ademar Lopes (Portaria)',
    criadoEm: '31/08/2026 13:10',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_ENCOMENDAS_ENTREGAS: EncomendaEntrega[] = [
  {
    id: 'enc-001',
    unidade: '102',
    bloco: 'Bloco A',
    destinatarioNome: 'Marcos Almeida',
    tipo: 'Pacote / Caixa',
    empresaTransporte: 'Mercado Livre (Envio Full)',
    codigoRastreio: 'MLB-987213401',
    localArmazenamento: 'Armário A - Prateleira 2',
    fotoPacote: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    dataRecebimento: '31/08/2026',
    horaRecebimento: '11:40',
    status: 'Aguardando Retirada',
    porteiroRecebedor: 'Ademar Lopes',
    observacoes: 'Caixa média lacrada com etiqueta Mercado Livre Full.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enc-002',
    unidade: '102',
    bloco: 'Bloco A',
    destinatarioNome: 'Sandra Almeida',
    tipo: 'Envelope / Documento',
    empresaTransporte: 'Correios (Sedex)',
    codigoRastreio: 'QC123456789BR',
    localArmazenamento: 'Gaveta de Documentos - Portaria',
    dataRecebimento: '31/08/2026',
    horaRecebimento: '10:15',
    status: 'Aguardando Retirada',
    porteiroRecebedor: 'Ademar Lopes',
    observacoes: 'Carta registrada com aviso de recebimento.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enc-003',
    unidade: '204',
    bloco: 'Bloco B',
    destinatarioNome: 'Larissa Manoela',
    tipo: 'Delivery / Alimentação',
    empresaTransporte: 'iFood Supermercados',
    localArmazenamento: 'Geladeira Térmica da Portaria',
    dataRecebimento: '31/08/2026',
    horaRecebimento: '13:00',
    status: 'Aguardando Retirada',
    porteiroRecebedor: 'Ademar Lopes',
    observacoes: '2 sacolas de itens refrigerados guardadas na geladeira.',
    condominioId: CURRENT_CONDO_ID
  },
  {
    id: 'enc-004',
    unidade: '301',
    bloco: 'Bloco A',
    destinatarioNome: 'Juliana Costa',
    tipo: 'Pacote / Caixa',
    empresaTransporte: 'Amazon Prime Express',
    codigoRastreio: 'BR-AMZ-889900',
    localArmazenamento: 'Armário B',
    dataRecebimento: '30/08/2026',
    horaRecebimento: '16:20',
    status: 'Entregue ao Morador',
    porteiroRecebedor: 'Valmyr Tavares',
    dataRetirada: '30/08/2026',
    horaRetirada: '18:45',
    retiradoPorNome: 'Juliana Costa',
    condominioId: CURRENT_CONDO_ID
  }
];

export const MOCK_CONDOMINIOS: CondominioProfile[] = [
  {
    id: 'condo-jardim-paulista',
    slug: 'jardim-paulista',
    nome: 'Residencial Jardim Paulista',
    endereco: 'Alameda Campinas, 1200 - Jardim Paulista, São Paulo - SP',
    cidade: 'São Paulo',
    estado: 'SP',
    totalUnidades: 48,
    totalBlocos: 2,
    fotoFachada: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    senhaAdminGeral: 'admin',
    emailAdmin: 'gestao@jardimpaulista.com.br',
    nomeSindico: 'Adriana Silva',
    telefoneSindico: '(11) 98765-4321',
    status: 'ativo',
    criadoEm: '01/01/2026',
    modeloInicial: 'exemplo',
    dataImplementacao: '01/01/2026',
    diaVencimento: 10,
    statusEmDia: true,
    valorMensalidade: 480.00,
    statusMensalidade: 'pago'
  },
  {
    id: 'condo-edificio-aurora',
    slug: 'edificio-aurora',
    nome: 'Edifício Aurora Imperial',
    endereco: 'Rua Oscar Freire, 850 - Cerqueira César, São Paulo - SP',
    cidade: 'São Paulo',
    estado: 'SP',
    totalUnidades: 32,
    totalBlocos: 1,
    fotoFachada: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=85',
    senhaAdminGeral: 'aurora2026',
    emailAdmin: 'sindico@edificioaurora.com.br',
    nomeSindico: 'Dr. Roberto Peixoto',
    telefoneSindico: '(11) 99123-4567',
    status: 'ativo',
    criadoEm: '15/02/2026',
    modeloInicial: 'limpo',
    dataImplementacao: '15/02/2026',
    diaVencimento: 15,
    statusEmDia: true,
    valorMensalidade: 350.00,
    statusMensalidade: 'pago'
  },
  {
    id: 'condo-reserva-passaros',
    slug: 'reserva-dos-passaros',
    nome: 'Condomínio Reserva dos Pássaros',
    endereco: 'Av. das Gaivotas, 400 - Moema, São Paulo - SP',
    cidade: 'São Paulo',
    estado: 'SP',
    totalUnidades: 64,
    totalBlocos: 4,
    fotoFachada: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    senhaAdminGeral: 'passaros123',
    emailAdmin: 'contato@reservapassaros.com.br',
    nomeSindico: 'Claudio Nogueira',
    telefoneSindico: '(11) 97788-9900',
    status: 'ativo',
    criadoEm: '20/03/2026',
    modeloInicial: 'exemplo',
    dataImplementacao: '20/03/2026',
    diaVencimento: 5,
    statusEmDia: false,
    valorMensalidade: 620.00,
    statusMensalidade: 'pendente'
  }
];






