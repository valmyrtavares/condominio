import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ArrowLeft, Search, Sparkles, AlertCircle, ChevronDown, ChevronUp, Layers, Tag, X } from 'lucide-react';
import { RegraTopico } from '../types';

export const RegrasCondominioScreen: React.FC = () => {
  const { setCurrentScreen, regrasCondominio } = useCondo();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pergunta, setPergunta] = useState('');
  const [respostaIA, setRespostaIA] = useState<string | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');
  const [termoBuscaManual, setTermoBuscaManual] = useState<string>('');

  // Extract unique categories
  const categorias = ['Todos', ...Array.from(new Set(regrasCondominio.map(r => r.categoria).filter(Boolean)))];

  // Filter topics
  const topicosFiltrados = regrasCondominio.filter(topico => {
    const matchCat = filtroCategoria === 'Todos' || topico.categoria === filtroCategoria;
    const termo = termoBuscaManual.toLowerCase().trim();
    const matchTermo = !termo ||
      topico.titulo.toLowerCase().includes(termo) ||
      topico.categoria.toLowerCase().includes(termo) ||
      topico.conteudo.toLowerCase().includes(termo) ||
      (topico.palavrasChave && topico.palavrasChave.some(k => k.toLowerCase().includes(termo)));
    return matchCat && matchTermo;
  });

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
      let melhorTopico: RegraTopico | null = null;

      for (const topico of regrasCondominio) {
        const keywords = topico.palavrasChave || [];
        const matchesKeyword = keywords.some(keyword => {
          const kwNormalizada = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return pNormalizada.includes(kwNormalizada);
        });

        const tituloNormalizado = topico.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const matchesTitulo = pNormalizada.split(' ').some(w => w.length > 3 && tituloNormalizado.includes(w));

        if (matchesKeyword || matchesTitulo) {
          melhorTopico = topico;
          break;
        }
      }

      if (melhorTopico) {
        // Strip tags for clean text preview or render clean text
        const cleanContent = melhorTopico.conteudo
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<\/li>/gi, '\n')
          .replace(/<li[^>]*>/gi, '• ')
          .replace(/<strong>/gi, '**')
          .replace(/<\/strong>/gi, '**')
          .replace(/<em>/gi, '*')
          .replace(/<\/em>/gi, '*')
          .replace(/<[^>]*>/g, '')
          .trim();

        melhorResposta = `Com base no **Regulamento Interno (Tópico: ${melhorTopico.titulo})**:\n\n${cleanContent}`;
      }

      if (melhorResposta) {
        setRespostaIA(melhorResposta);
      } else {
        const temasSugeridos = regrasCondominio.slice(0, 5).map(r => r.titulo.toLowerCase()).join(', ');
        setRespostaIA(
          `Não encontrei uma regra específica para essa pergunta no regulamento cadastrado. Tente perguntar de forma simples sobre temas como: **${temasSugeridos}**.`
        );
      }
      setCarregandoIA(false);
    }, 750);
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
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
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
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white rounded-xl text-xs font-extrabold shadow-sm shrink-0 transition-colors cursor-pointer"
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

      {/* Category Pills Filter */}
      {categorias.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs no-scrollbar">
          {categorias.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltroCategoria(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                filtroCategoria === cat
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-102'
                  : 'bg-white/30 hover:bg-white/40 text-white backdrop-blur-xs border border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Accordion Rules list */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white drop-shadow">
            Regulamento por Tópicos
          </h3>
          <span className="text-[10px] font-bold text-white/80">
            {topicosFiltrados.length} {topicosFiltrados.length === 1 ? 'tópico' : 'tópicos'}
          </span>
        </div>

        {topicosFiltrados.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 text-center text-white space-y-2">
            <p className="text-xs font-bold">Nenhum tópico encontrado para esta categoria.</p>
            <button
              onClick={() => setFiltroCategoria('Todos')}
              className="text-[11px] text-amber-300 font-extrabold hover:underline"
            >
              Ver todos os tópicos
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {topicosFiltrados.map((topico) => {
              const isExpanded = expandedId === topico.id;
              return (
                <div
                  key={topico.id}
                  className="bg-white/45 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-md hover:bg-white/50 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(topico.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-slate-950 block">
                        {topico.titulo}
                      </span>
                      {topico.categoria && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-slate-950/10 text-slate-800 border border-slate-950/10 inline-block">
                          {topico.categoria}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-950/5 pt-3 animate-in slide-in-from-top-1 duration-150">
                      <div 
                        className="text-xs text-slate-900 leading-relaxed font-semibold
                          [&_p]:my-1.5 
                          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:my-1
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:my-1
                          [&_h3]:font-black [&_h3]:text-xs sm:[&_h3]:text-sm [&_h3]:text-slate-950 [&_h3]:my-2
                          [&_strong]:font-black [&_strong]:text-slate-950
                          [&_em]:italic"
                        dangerouslySetInnerHTML={{ __html: topico.conteudo }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

