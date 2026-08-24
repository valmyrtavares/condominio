import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ArrowLeft, Search, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RegraTopico {
  id: string;
  titulo: string;
  conteudo: string;
  palavrasChave: string[];
}

export const RegrasCondominioScreen: React.FC = () => {
  const { setCurrentScreen } = useCondo();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pergunta, setPergunta] = useState('');
  const [respostaIA, setRespostaIA] = useState<string | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  const TOPICOS: RegraTopico[] = [
    {
      id: 'pets',
      titulo: 'Animais de Estimação (Pets)',
      conteudo: 'É permitida a permanência de animais domésticos nas unidades autônomas. Nas áreas comuns, os animais devem estar sempre na coleira e guia, sendo proibida sua circulação livre. O tutor é responsável pela limpeza de qualquer sujeira.',
      palavrasChave: ['pet', 'pets', 'cachorro', 'gato', 'cão', 'animais', 'animal', 'coleira', 'sujeira', 'guia']
    },
    {
      id: 'silencio',
      titulo: 'Lei do Silêncio e Barulhos',
      conteudo: 'O horário de silêncio rigoroso é das 22:00 às 08:00 nos dias de semana, e das 23:00 às 09:00 nos finais de semana. Ruídos excessivos, música alta, reformas, obras ou festas fora desse horário estão sujeitos a notificação e multa.',
      palavrasChave: ['silencio', 'silêncio', 'barulho', 'barulhos', 'som', 'musica', 'música', 'festa', 'festas', 'reforma', 'reformas', 'obra', 'obras', 'furadeira', 'ruido', 'ruídos']
    },
    {
      id: 'piscina',
      titulo: 'Uso da Piscina',
      conteudo: 'A piscina funciona de terça a domingo, das 08:00 às 20:00. É obrigatório o banho de ducha antes de entrar na água. Não é permitido levar copos ou garrafas de vidro para a área ao redor da piscina. Crianças menores de 12 anos devem estar acompanhadas de um adulto.',
      palavrasChave: ['piscina', 'piscina abre', 'ducha', 'chuveiro', 'banho', 'vidro', 'copo', 'garrafa', 'criança', 'crianças', 'menor', 'menores', 'acompanhado']
    },
    {
      id: 'salao',
      titulo: 'Salão de Festas e Churrasqueira',
      conteudo: 'A reserva do salão de festas ou churrasqueira deve ser feita com no mínimo 15 dias de antecedência. A taxa de limpeza é de R$ 150,00. O uso é permitido até as 22:00 (durante a semana) ou 23:00 (finais de semana), respeitando os limites da lei do silêncio.',
      palavrasChave: ['salão', 'salao', 'festa', 'churrasqueira', 'reserva', 'reservar', 'churrasco', 'taxa', 'limpeza', 'antecedência', 'aluguel']
    },
    {
      id: 'garagem',
      titulo: 'Garagem e Vagas',
      conteudo: 'Cada apartamento tem direito a usar apenas a sua vaga de garagem demarcada. É proibido estacionar nas faixas de circulação ou usar vagas de terceiros sem autorização por escrito. A velocidade máxima permitida no subsolo é de 10 km/h.',
      palavrasChave: ['garagem', 'vaga', 'vagas', 'estacionar', 'estacionamento', 'carro', 'moto', 'velocidade', 'limite', 'subsolo', 'faixa']
    },
    {
      id: 'lixo',
      titulo: 'Lixo e Descartes',
      conteudo: 'O lixo orgânico e reciclável deve ser depositado nas lixeiras localizadas no hall de serviço de cada andar, devidamente embalado em sacos plásticos fechados. O descarte de móveis, entulhos e eletrônicos é de responsabilidade do morador e não deve ser deixado nas áreas comuns.',
      palavrasChave: ['lixo', 'descarte', 'descartar', 'reciclar', 'reciclavel', 'reciclável', 'entulho', 'moveis', 'móveis', 'hall', 'serviço', 'sacola']
    }
  ];

  const handlePerguntar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pergunta.trim()) return;

    setCarregandoIA(true);
    setRespostaIA(null);

    // Simulate AI thinking and reading the document
    setTimeout(() => {
      const pNormalizada = pergunta.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove accents

      let melhorResposta: string | null = null;

      for (const topico of TOPICOS) {
        const matches = topico.palavrasChave.some(keyword => {
          const kwNormalizada = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return pNormalizada.includes(kwNormalizada);
        });

        if (matches) {
          melhorResposta = `Com base no **Regulamento Interno (Tópico de ${topico.titulo})**:\n\n${topico.conteudo}`;
          break;
        }
      }

      if (melhorResposta) {
        setRespostaIA(melhorResposta);
      } else {
        setRespostaIA(
          "Não encontrei uma regra específica para essa pergunta no regulamento interno cadastrado. Tente perguntar de forma simples sobre temas como: **silêncio**, **pets/cachorro**, **piscina**, **garagem/vaga**, **lixo** ou **salão de festas**."
        );
      }
      setCarregandoIA(false);
    }, 850);
  };

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
          Regras do Condomínio
        </h2>
        <p className="text-[11px] text-white/80 font-medium">
          Regulamento interno oficial do condomínio e assistente virtual de buscas.
        </p>
      </div>

      {/* AI Search Section */}
      <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900/80 border border-indigo-400/40 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-5 h-5 shrink-0 animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider">
            Assistente Virtual do Regulamento
          </h3>
        </div>

        <form onSubmit={handlePerguntar} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ex: Pode ter cachorro? Qual horário de barulho?"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-semibold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={carregandoIA}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white rounded-xl text-xs font-extrabold shadow-sm shrink-0 transition-colors"
          >
            {carregandoIA ? 'Analisando...' : 'Perguntar'}
          </button>
        </form>

        {/* AI Answer Bubble */}
        {(carregandoIA || respostaIA) && (
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-white space-y-2 animate-in fade-in duration-200">
            {carregandoIA ? (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="font-semibold text-[11px]">Consultando regras em tempo real...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider block">
                  Resposta do Assistente:
                </span>
                <p className="leading-relaxed font-semibold whitespace-pre-line text-slate-100">
                  {respostaIA}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion Rules list */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white drop-shadow ml-1">
          Regulamento por Tópicos
        </h3>

        <div className="space-y-2">
          {TOPICOS.map((topico) => {
            const isExpanded = expandedId === topico.id;
            return (
              <div
                key={topico.id}
                className="bg-white/45 border border-white/60 rounded-2xl overflow-hidden shadow-md hover:bg-white/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleExpand(topico.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none"
                >
                  <span className="text-xs font-extrabold text-slate-950">
                    {topico.titulo}
                  </span>
                  <div className="shrink-0 p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-950/5 pt-3 animate-in slide-in-from-top-1 duration-150">
                    <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                      {topico.conteudo}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
