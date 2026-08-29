import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ItemEnjoei, TipoTransacaoEnjoei, StatusItemEnjoei } from '../types';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  Plus, 
  Tag, 
  Gift, 
  Repeat, 
  Truck, 
  Handshake, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  Sparkles, 
  User, 
  Calendar,
  Check,
  Edit2
} from 'lucide-react';
import { CreateEditDesapegoModal } from '../components/enjoei/CreateEditDesapegoModal';

export const EnjoeiScreen: React.FC = () => {
  const { 
    itensEnjoei, 
    setCurrentScreen, 
    currentUser,
    atualizarStatusItemEnjoei
  } = useCondo();

  const [filterTipo, setFilterTipo] = useState<string>('Todas');
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Estado para controlar abertura/fechamento individual de cada card com animação
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemEnjoei | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredItens.forEach(i => {
      allExpanded[i.id] = true;
    });
    setExpandedCards(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  // Categorias presentes nos itens
  const categoriasDisponiveis = [
    'Todas',
    ...Array.from(new Set(itensEnjoei.map(i => i.categoria).filter(Boolean)))
  ];

  // Itens visíveis (itens suspensos são exibidos apenas para o admin ou autor)
  const isAdmin = currentUser?.role === 'sindico' || currentUser?.role === 'subsindico';

  const filteredItens = itensEnjoei.filter(item => {
    // Se suspenso, apenas admin ou o próprio autor visualiza com aviso
    if (item.status === 'suspenso' && !isAdmin && item.moradorNome !== currentUser?.nome) {
      return false;
    }

    const matchTipo = filterTipo === 'Todas' || item.tipoTransacao === filterTipo;
    const matchCat = filterCategoria === 'Todas' || item.categoria.toLowerCase() === filterCategoria.toLowerCase();
    
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      (item.trocaPor && item.trocaPor.toLowerCase().includes(termo)) ||
      item.moradorNome.toLowerCase().includes(termo) ||
      item.moradorUnidade.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo);

    return matchTipo && matchCat && matchBusca;
  });

  const totalVendas = itensEnjoei.filter(i => i.tipoTransacao === 'venda' && i.status !== 'suspenso').length;
  const totalTrocas = itensEnjoei.filter(i => i.tipoTransacao === 'troca' && i.status !== 'suspenso').length;
  const totalDoacoes = itensEnjoei.filter(i => (i.tipoTransacao === 'doacao' || i.tipoTransacao === 'retirada') && i.status !== 'suspenso').length;

  const getTipoBadge = (tipo: TipoTransacaoEnjoei, preco?: number) => {
    switch (tipo) {
      case 'venda':
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <Tag className="w-3.5 h-3.5 text-rose-700" />,
          label: preco !== undefined ? `Venda R$ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Venda'
        };
      case 'doacao':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <Gift className="w-3.5 h-3.5 text-emerald-700" />,
          label: '🎁 Doação (Grátis)'
        };
      case 'troca':
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
          icon: <Repeat className="w-3.5 h-3.5 text-purple-700" />,
          label: '🔄 Troca / Permuta'
        };
      case 'retirada':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Truck className="w-3.5 h-3.5 text-amber-700" />,
          label: '📦 Custo de Retirada'
        };
      case 'emprestimo':
      default:
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
          icon: <Handshake className="w-3.5 h-3.5 text-blue-700" />,
          label: preco ? `Empréstimo R$ ${preco}/dia` : 'Empréstimo'
        };
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <button
          onClick={() => {
            setItemToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-rose-400"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Publicar Desapego</span>
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <ShoppingBag className="w-5 h-5 text-rose-400" />
          Enjoei do Condomínio
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Mural de desapego, classificados, doações e trocas entre vizinhos do residencial.
        </p>
      </div>

      {/* Resumo em Números */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-rose-500/20 border border-rose-400/50 p-3 rounded-3xl text-center shadow-md backdrop-blur-xs">
          <span className="text-[10px] font-extrabold uppercase text-rose-100 block">Vendas</span>
          <span className="text-base sm:text-lg font-black text-white">
            {totalVendas} itens
          </span>
        </div>
        <div className="bg-purple-500/20 border border-purple-400/50 p-3 rounded-3xl text-center shadow-md backdrop-blur-xs">
          <span className="text-[10px] font-extrabold uppercase text-purple-100 block">Trocas / Permutas</span>
          <span className="text-base sm:text-lg font-black text-white">
            {totalTrocas} ofertas
          </span>
        </div>
        <div className="bg-emerald-500/20 border border-emerald-400/50 p-3 rounded-3xl text-center shadow-md backdrop-blur-xs">
          <span className="text-[10px] font-extrabold uppercase text-emerald-100 block">Doações & Retirada</span>
          <span className="text-base sm:text-lg font-black text-white">
            {totalDoacoes} grátis
          </span>
        </div>
      </div>

      {/* Filtros por Modalidade (Pills) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          {[
            { id: 'Todas', label: 'Todos' },
            { id: 'venda', label: '🏷️ Venda' },
            { id: 'troca', label: '🔄 Trocas' },
            { id: 'doacao', label: '🎁 Doações' },
            { id: 'retirada', label: '📦 Custo de Retirada' },
            { id: 'emprestimo', label: '🤝 Empréstimos' }
          ].map((tipo) => {
            const isSelected = filterTipo === tipo.id;
            return (
              <button
                key={tipo.id}
                onClick={() => setFilterTipo(tipo.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border shadow-xs shrink-0 cursor-pointer font-extrabold ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-400 scale-105 shadow-md font-black'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {tipo.label}
              </button>
            );
          })}
        </div>

        {/* Filtro por Categoria & Busca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
              Categoria:
            </span>
            {categoriasDisponiveis.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategoria(cat)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  filterCategoria === cat
                    ? 'bg-slate-900 text-amber-300 border-slate-900 font-black shadow-2xs'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar item, troca desejada ou apartamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

        </div>
      </div>

      {/* Cabeçalho da Lista com Contador e Botões Expandir/Recolher Todos */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow">
          Desapegos Disponíveis ({filteredItens.length})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] font-extrabold text-amber-300 hover:underline cursor-pointer drop-shadow"
          >
            Abrir todos
          </button>
          <span className="text-white/40 text-xs">•</span>
          <button
            onClick={collapseAll}
            className="text-[11px] font-extrabold text-amber-300 hover:underline cursor-pointer drop-shadow"
          >
            Fechar todos
          </button>
        </div>
      </div>

      {/* Lista de Cards Sanfonados Animados */}
      <div className="space-y-2.5">
        {filteredItens.length === 0 ? (
          <div className="p-8 text-center bg-white/45 border border-white/65 rounded-3xl space-y-3 backdrop-blur-xs">
            <ShoppingBag className="w-8 h-8 text-rose-600 mx-auto opacity-70" />
            <p className="text-sm font-black text-slate-950">Nenhum item encontrado com os filtros selecionados.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setFilterTipo('Todas'); setFilterCategoria('Todas'); setSearchTerm(''); }}
                className="text-xs text-indigo-900 font-extrabold hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => { setItemToEdit(null); setIsModalOpen(true); }}
                className="text-xs text-rose-700 font-black hover:underline cursor-pointer"
              >
                + Seja o primeiro a anunciar
              </button>
            </div>
          </div>
        ) : (
          filteredItens.map((item) => {
            const isExpanded = !!expandedCards[item.id];
            const badge = getTipoBadge(item.tipoTransacao, item.preco);
            const isSuspenso = item.status === 'suspenso';
            const isConcluido = item.status === 'concluido';
            const isNegociando = item.status === 'negociando';

            return (
              <div
                key={item.id}
                className={`border rounded-3xl overflow-hidden shadow-lg transition-all duration-300 backdrop-blur-xs ${
                  isSuspenso
                    ? 'bg-rose-500/15 border-rose-400 opacity-80'
                    : isConcluido
                      ? 'bg-slate-200/50 border-slate-300 opacity-70'
                      : 'bg-white/50 border-white/70 hover:bg-white/60'
                }`}
              >
                
                {/* CABEÇALHO COMPACTO (Sempre Visível - Clicável) */}
                <button
                  type="button"
                  onClick={() => toggleCard(item.id)}
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    
                    {/* Miniatura da Foto */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-200 border border-white/80 shrink-0 shadow-2xs">
                      {item.fotos && item.fotos.length > 0 ? (
                        <img
                          src={item.fotos[0]}
                          alt={item.titulo}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-100 text-rose-600">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Título e Tags */}
                    <div className="space-y-1 min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-300 shadow-2xs">
                          {item.categoria}
                        </span>

                        {isNegociando && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-full">
                            ⏳ Negociando
                          </span>
                        )}

                        {isConcluido && (
                          <span className="text-[10px] font-black bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                            ✓ Desapegado
                          </span>
                        )}

                        {isSuspenso && (
                          <span className="text-[10px] font-black bg-rose-200 text-rose-950 border border-rose-400 px-2 py-0.5 rounded-full">
                            ⚠️ Anúncio Suspenso
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-950 leading-snug truncate">
                        {item.titulo}
                      </h3>

                      <div className="text-[11px] text-slate-700 font-semibold flex items-center gap-1.5 truncate">
                        <span>{item.moradorUnidade}</span>
                        <span>•</span>
                        <span className="text-slate-500 font-medium">{item.condicao}</span>
                      </div>
                    </div>

                  </div>

                  {/* Botão Chevron Circular com Transição de Rotação */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/70 border border-white/90 text-slate-900 shadow-xs flex items-center justify-center">
                    <ChevronDown className={`w-4 h-4 text-slate-900 transition-transform duration-300 ease-in-out ${
                      isExpanded ? 'transform rotate-180' : 'transform rotate-0'
                    }`} />
                  </div>
                </button>

                {/* CORPO EXPANSÍVEL COM TRANSIÇÃO SUAVE DE GRID */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-5 space-y-3.5 border-t border-slate-950/10 pt-3.5">
                      
                      {/* Galeria de Fotos */}
                      {item.fotos && item.fotos.length > 0 && (
                        <div className="rounded-2xl overflow-hidden border border-white/80 max-h-56 sm:max-h-72 w-full bg-slate-900 shadow-sm relative">
                          <img
                            src={item.fotos[0]}
                            alt={item.titulo}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      )}

                      {/* Destaque de Troca (se modalidade for Troca) */}
                      {item.tipoTransacao === 'troca' && item.trocaPor && (
                        <div className="p-3.5 bg-purple-500/15 border-2 border-purple-400 rounded-2xl text-xs space-y-1 shadow-2xs">
                          <span className="text-[10px] font-black uppercase text-purple-950 flex items-center gap-1.5">
                            <Repeat className="w-4 h-4 text-purple-700" />
                            O morador aceita trocar por:
                          </span>
                          <p className="text-sm font-black text-purple-950 leading-snug">
                            {item.trocaPor}
                          </p>
                        </div>
                      )}

                      {/* Destaque de Retirada */}
                      {item.tipoTransacao === 'retirada' && (
                        <div className="p-3 bg-amber-500/15 border border-amber-300 rounded-2xl text-xs text-amber-950 font-semibold flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                          <span>
                            <strong>Sem custos:</strong> O item é gratuito para retirada no {item.moradorUnidade}. Frete/transporte por conta do interessado.
                          </span>
                        </div>
                      )}

                      {/* Descrição Completa */}
                      <div className="bg-white/50 border border-white/80 p-3.5 rounded-2xl space-y-1 shadow-2xs">
                        <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                          Detalhes do Item & Motivo do Desapego:
                        </span>
                        <p className="text-xs text-slate-950 font-medium leading-relaxed">
                          {item.descricao}
                        </p>
                      </div>

                      {/* Aviso de Suspensão pela Administração */}
                      {isSuspenso && item.motivoSuspensao && (
                        <div className="p-3 bg-rose-500/20 border border-rose-300 rounded-2xl text-xs text-rose-950 font-semibold space-y-0.5">
                          <strong>Motivo da Suspensão:</strong> {item.motivoSuspensao}
                        </div>
                      )}

                      {/* Anunciante e Data */}
                      <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
                        <div className="flex items-center gap-2">
                          {item.moradorFoto ? (
                            <img src={item.moradorFoto} alt={item.moradorNome} className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div>
                            Anunciado por: <strong className="text-slate-950 font-bold">{item.moradorNome}</strong> ({item.moradorUnidade})
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.dataPublicacao}
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="pt-2 border-t border-slate-950/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        
                        {/* WhatsApp Direto */}
                        <a
                          href={`https://wa.me/${item.contatoWhatsapp}?text=Olá%20${encodeURIComponent(item.moradorNome)},%20sou%20seu%20vizinho%20no%20condomínio%20e%20vi%20seu%20anúncio%20no%20Enjoei:%20"${encodeURIComponent(item.titulo)}".%20Ainda%20está%20disponível?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Falar no WhatsApp com {item.moradorNome.split(' ')[0]}</span>
                        </a>

                        {/* Ações do Anunciante ou Admin */}
                        <div className="flex items-center gap-1.5 justify-end">
                          {item.status === 'disponivel' && (
                            <button
                              type="button"
                              onClick={() => atualizarStatusItemEnjoei(item.id, 'negociando')}
                              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors cursor-pointer border border-amber-300"
                            >
                              Marcar Negociando
                            </button>
                          )}

                          {item.status === 'negociando' && (
                            <button
                              type="button"
                              onClick={() => atualizarStatusItemEnjoei(item.id, 'concluido')}
                              className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-black transition-colors cursor-pointer border border-emerald-300 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Concluir Desapego</span>
                            </button>
                          )}

                          {(isAdmin || item.moradorNome === currentUser?.nome) && (
                            <button
                              type="button"
                              onClick={() => {
                                setItemToEdit(item);
                                setIsModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-300"
                              title="Editar anúncio"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-indigo-700" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal de Publicação e Edição */}
      <CreateEditDesapegoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setItemToEdit(null);
        }}
        itemToEdit={itemToEdit}
      />

    </div>
  );
};
