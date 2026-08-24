import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ServicoItem {
  id: string;
  titulo: string;
  subtitulo: string;
  prestador: string;
  descricao: string;
  imagem: string;
  link: string;
}

export const ServicosMoradoresScreen: React.FC = () => {
  const { setCurrentScreen } = useCondo();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const SERVICOS: ServicoItem[] = [
    {
      id: 'tortas',
      titulo: 'Tortas deliciosas pronta entrega',
      subtitulo: 'Faço a pronta entrega',
      prestador: 'Maria do 404',
      descricao: 'Tortas doces e salgadas feitas artesanalmente com ingredientes selecionados. Sabores: Frango com Catupiry, Palmito, Brigadeiro e Limão. Encomendas rápidas e entrega direta no seu apartamento!',
      imagem: '/torta_servico.jpg',
      link: 'https://maria-tortas.fake'
    },
    {
      id: 'juridico',
      titulo: 'Serviços Jurídicos',
      subtitulo: 'Trabalhista e de Família',
      prestador: 'Antônio do 501',
      descricao: 'Consultoria e assessoria jurídica especializada em Direito do Trabalho e Direito de Família (divórcio, inventário, pensão alimentícia e guarda). Atendimento com hora marcada e total discrição para moradores.',
      imagem: '/juridico_servico.jpg',
      link: 'https://antonio-advocacia.fake'
    },
    {
      id: 'pets',
      titulo: 'Passeio com o seu Pet',
      subtitulo: 'Dog walker de confiança no prédio',
      prestador: 'Cíntia do 103',
      descricao: 'Passeios de 30 a 60 minutos para cães de todos os portes. Garanto gasto de energia, socialização e segurança para o seu melhor amigo, com a conveniência de um prestador que mora no mesmo condomínio.',
      imagem: '/dogwalker_servico.jpg',
      link: 'https://cintia-petwalker.fake'
    },
    {
      id: 'personal',
      titulo: 'Personal Trainer Thiago Dantas',
      subtitulo: 'Treinamento funcional e musculação',
      prestador: 'Thiago do 200',
      descricao: 'Aulas personalizadas focadas no seu objetivo (emagrecimento, hipertrofia ou condicionamento físico). Treine com segurança e eficiência utilizando a própria academia do condomínio.',
      imagem: '/personal_servico.jpg',
      link: 'https://thiago-personal.fake'
    },
    {
      id: 'organizer',
      titulo: 'Organização e Design',
      subtitulo: 'Personal Organizer & Design de Interiores',
      prestador: 'Clara do 302',
      descricao: 'Otimização de ambientes, organização de closets, armários, cozinhas e home office. Projetos de design de interiores sob medida para deixar o seu apartamento prático, funcional e elegante.',
      imagem: '/organizer_servico.jpg',
      link: 'https://clara-decor.fake'
    },
    {
      id: 'faxina',
      titulo: 'Faxina Seletiva / Higienização',
      subtitulo: 'Limpeza ecológica de estofados e tapetes',
      prestador: 'Sandra do 102',
      descricao: 'Higienização profunda e remoção de manchas e odores de sofás, poltronas, colchões e tapetes. Processo antialérgico seguro para crianças e pets, realizado com equipamento profissional de alta sucção.',
      imagem: '/limpeza_servico.jpg',
      link: 'https://sandra-higienizacao.fake'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
          Serviços de Moradores
        </h2>
        <p className="text-[11px] text-white/80 font-medium">
          Mural de classificados internos. Dê preferência a contratar quem mora no seu condomínio!
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {SERVICOS.map((servico) => {
          const isExpanded = expandedId === servico.id;
          return (
            <div 
              key={servico.id}
              className="bg-white/45 border border-white/60 rounded-3xl overflow-hidden shadow-xl hover:bg-white/50 transition-all duration-300"
            >
              {/* Header section (Always visible) */}
              <button
                onClick={() => toggleExpand(servico.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
                    {servico.titulo}
                  </h3>
                  <p className="text-[10px] text-amber-900 font-bold mt-0.5">
                    Oferecido por: {servico.prestador}
                  </p>
                </div>
                <div className="shrink-0 p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable Section */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-950/10 pt-3 animate-in slide-in-from-top-2 duration-200">
                  {/* Service Image */}
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/50 shadow-sm">
                    <img 
                      src={servico.imagem} 
                      alt={servico.titulo} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2">
                    <div className="bg-white/50 border border-white/40 p-3 rounded-2xl text-xs space-y-1.5">
                      <p className="font-extrabold text-slate-950">
                        {servico.subtitulo}
                      </p>
                      <p className="text-[11px] text-slate-800 leading-relaxed font-medium">
                        {servico.descricao}
                      </p>
                    </div>

                    {/* Link */}
                    <a
                      href={servico.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 w-full justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Clique aqui para ver mais (LINK)
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
