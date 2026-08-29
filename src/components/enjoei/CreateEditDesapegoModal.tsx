import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { ItemEnjoei, TipoTransacaoEnjoei, CondicaoItemEnjoei } from '../../types';
import { 
  ShoppingBag, 
  X, 
  DollarSign, 
  Tag, 
  Gift, 
  Repeat, 
  Truck, 
  Handshake, 
  Image as ImageIcon, 
  Phone, 
  MessageCircle, 
  Check, 
  Sparkles,
  Building,
  User
} from 'lucide-react';

const CATEGORIAS_ENJOEI = [
  'Móveis & Decoração',
  'Eletrodomésticos & Cozinha',
  'Eletrônicos & Informática',
  'Roupas & Acessórios',
  'Instrumentos Musicais',
  'Infantil & Brinquedos',
  'Ferramentas & Casa',
  'Esportes & Lazer',
  'Livros & Hobbies',
  'Outros'
];

const FOTOS_SUGERIDAS = [
  { label: 'Eletrodoméstico', url: 'https://images.unsplash.com/photo-1584990347449-39908cf83a21?auto=format&fit=crop&w=800&q=80' },
  { label: 'Móveis / Sofá', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Piano / Música', url: 'https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bicicleta / Infantil', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Eletrônicos', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Roupas / Moda', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' }
];

interface CreateEditDesapegoModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ItemEnjoei | null;
}

export const CreateEditDesapegoModal: React.FC<CreateEditDesapegoModalProps> = ({
  isOpen,
  onClose,
  itemToEdit
}) => {
  const { currentUser, adicionarItemEnjoei, editarItemEnjoei } = useCondo();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Móveis & Decoração');
  const [tipoTransacao, setTipoTransacao] = useState<TipoTransacaoEnjoei>('venda');
  const [preco, setPreco] = useState<string>('');
  const [trocaPor, setTrocaPor] = useState('');
  const [condicao, setCondicao] = useState<CondicaoItemEnjoei>('Seminovo (Excelente)');
  const [fotoUrl, setFotoUrl] = useState('');
  const [moradorNome, setMoradorNome] = useState('');
  const [moradorUnidade, setMoradorUnidade] = useState('');
  const [contatoWhatsapp, setContatoWhatsapp] = useState('');

  // Sincroniza formulário ao abrir com item a ser editado ou reseta para novo cadastro
  useEffect(() => {
    if (itemToEdit) {
      setTitulo(itemToEdit.titulo || '');
      setDescricao(itemToEdit.descricao || '');
      setCategoria(itemToEdit.categoria || 'Móveis & Decoração');
      setTipoTransacao(itemToEdit.tipoTransacao || 'venda');
      setPreco(itemToEdit.preco !== undefined ? String(itemToEdit.preco) : '');
      setTrocaPor(itemToEdit.trocaPor || '');
      setCondicao(itemToEdit.condicao || 'Seminovo (Excelente)');
      setFotoUrl(itemToEdit.fotos && itemToEdit.fotos.length > 0 ? itemToEdit.fotos[0] : '');
      setMoradorNome(itemToEdit.moradorNome || currentUser?.nome || 'Morador');
      setMoradorUnidade(itemToEdit.moradorUnidade || (currentUser?.unidade ? `Apto ${currentUser.unidade}` : 'Apto 502'));
      setContatoWhatsapp(itemToEdit.contatoWhatsapp || '5511988887766');
    } else {
      setTitulo('');
      setDescricao('');
      setCategoria('Móveis & Decoração');
      setTipoTransacao('venda');
      setPreco('');
      setTrocaPor('');
      setCondicao('Seminovo (Excelente)');
      setFotoUrl(FOTOS_SUGERIDAS[0].url);
      setMoradorNome(currentUser?.nome || 'Morador');
      setMoradorUnidade(currentUser?.unidade ? `Apto ${currentUser.unidade} - Bloco A` : 'Apto 502 - Bloco B');
      setContatoWhatsapp('5511988887766');
    }
  }, [itemToEdit, isOpen, currentUser]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let numPreco: number | undefined = undefined;
    if (tipoTransacao === 'venda' || tipoTransacao === 'emprestimo') {
      numPreco = preco ? parseFloat(preco.replace(',', '.')) : 0;
    } else if (tipoTransacao === 'doacao' || tipoTransacao === 'retirada') {
      numPreco = 0;
    }

    const cleanWhatsapp = contatoWhatsapp.replace(/\D/g, '') || '5511988887766';
    const fotos = fotoUrl.trim() ? [fotoUrl.trim()] : [FOTOS_SUGERIDAS[0].url];

    const dadosDesapego = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria,
      tipoTransacao,
      preco: numPreco,
      trocaPor: tipoTransacao === 'troca' ? trocaPor.trim() : undefined,
      condicao,
      fotos,
      moradorNome: moradorNome.trim() || 'Morador',
      moradorUnidade: moradorUnidade.trim() || 'Apto 502',
      moradorFoto: currentUser?.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      contatoWhatsapp: cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`
    };

    if (itemToEdit) {
      editarItemEnjoei(itemToEdit.id, dadosDesapego);
    } else {
      adicionarItemEnjoei(dadosDesapego);
    }

    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white border-2 border-rose-400 rounded-3xl shadow-2xl flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Fixo */}
        <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-rose-100 via-pink-50 to-white flex items-center justify-between border-b border-rose-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md font-black shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                {itemToEdit ? 'Editar Anúncio no Enjoei' : 'Publicar Desapego / Troca no Enjoei'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Venda, doe, troque ou anuncie itens para retirada entre vizinhos do condomínio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-rose-200/60 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Formulário com Rolagem Interna */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-4 sm:p-6 space-y-5">
          
          {/* 1. TIPO DE TRANSAÇÃO (SELEÇÃO VISUAL EM CARDS) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              1. Qual é o tipo de desapego? *
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              
              {/* Venda */}
              <button
                type="button"
                onClick={() => setTipoTransacao('venda')}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoTransacao === 'venda'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/30 text-rose-950 font-black scale-102 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Tag className={`w-4 h-4 ${tipoTransacao === 'venda' ? 'text-rose-600' : 'text-slate-500'}`} />
                <span className="text-xs font-black">🏷️ Venda</span>
                <span className="text-[9px] text-slate-500 font-semibold">Com preço</span>
              </button>

              {/* Doação */}
              <button
                type="button"
                onClick={() => setTipoTransacao('doacao')}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoTransacao === 'doacao'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-black scale-102 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Gift className={`w-4 h-4 ${tipoTransacao === 'doacao' ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span className="text-xs font-black">🎁 Doação</span>
                <span className="text-[9px] text-slate-500 font-semibold">100% Grátis</span>
              </button>

              {/* Troca / Permuta */}
              <button
                type="button"
                onClick={() => setTipoTransacao('troca')}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoTransacao === 'troca'
                    ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30 text-purple-950 font-black scale-102 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Repeat className={`w-4 h-4 ${tipoTransacao === 'troca' ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="text-xs font-black">🔄 Troca</span>
                <span className="text-[9px] text-slate-500 font-semibold">Permuta</span>
              </button>

              {/* Custo de Retirada */}
              <button
                type="button"
                onClick={() => setTipoTransacao('retirada')}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  tipoTransacao === 'retirada'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-black scale-102 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Truck className={`w-4 h-4 ${tipoTransacao === 'retirada' ? 'text-amber-600' : 'text-slate-500'}`} />
                <span className="text-xs font-black">📦 Retirada</span>
                <span className="text-[9px] text-slate-500 font-semibold">Só levar</span>
              </button>

              {/* Empréstimo */}
              <button
                type="button"
                onClick={() => setTipoTransacao('emprestimo')}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 cursor-pointer col-span-2 sm:col-span-1 ${
                  tipoTransacao === 'emprestimo'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30 text-blue-950 font-black scale-102 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Handshake className={`w-4 h-4 ${tipoTransacao === 'emprestimo' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="text-xs font-black">🤝 Empréstimo</span>
                <span className="text-[9px] text-slate-500 font-semibold">Temporário</span>
              </button>

            </div>
          </div>

          {/* 2. CAMPOS CONDICIONAIS DE ACORDO COM O TIPO */}
          {tipoTransacao === 'venda' && (
            <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] font-black text-rose-950 uppercase tracking-wider block">
                Valor de Venda (R$) *
              </span>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 450.00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-white border border-rose-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-black font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
                  required
                />
              </div>
            </div>
          )}

          {tipoTransacao === 'troca' && (
            <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl space-y-1.5">
              <span className="text-[11px] font-black text-purple-950 uppercase tracking-wider block flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-purple-700" />
                O que você aceita em troca? (Descreva os itens de seu interesse) *
              </span>
              <input
                type="text"
                placeholder="Ex: Troco panela elétrica nova por câmera fotográfica ou casaco de frio Tam M"
                value={trocaPor}
                onChange={(e) => setTrocaPor(e.target.value)}
                className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                required
              />
              <p className="text-[10px] text-purple-800 font-semibold">
                Dica: Especifique modelos, tamanhos ou categorias que facilitam a combinação com outros moradores.
              </p>
            </div>
          )}

          {tipoTransacao === 'retirada' && (
            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl text-xs text-amber-950 font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Modalidade Retirada:</strong> O item é gratuito, ficando o custo de transporte, carreto ou desmontagem a cargo do vizinho interessado.
              </span>
            </div>
          )}

          {tipoTransacao === 'doacao' && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-950 font-semibold flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Doação Gratuita:</strong> Item 100% sem custos, disponível para retirar no seu apartamento.
              </span>
            </div>
          )}

          {tipoTransacao === 'emprestimo' && (
            <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl space-y-1">
              <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider block">
                Valor da Taxa Simbólica (R$) ou deixe 0 se for gratuito
              </span>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 15.00 (ou 0 para empréstimo gratuito)"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-white border border-blue-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>
            </div>
          )}

          {/* 3. TÍTULO, CATEGORIA E CONDIÇÃO DO ITEM */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                2. Título do Anúncio *
              </label>
              <input
                type="text"
                placeholder="Ex: Piano Digital Yamaha P-45 ou Panela Elétrica Nova na Caixa"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-rose-500 shadow-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Categoria *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-rose-500 cursor-pointer"
                >
                  {CATEGORIAS_ENJOEI.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Estado de Conservação *
                </label>
                <select
                  value={condicao}
                  onChange={(e) => setCondicao(e.target.value as CondicaoItemEnjoei)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-rose-500 cursor-pointer"
                >
                  <option value="Novo / Lacrado">Novo / Lacrado</option>
                  <option value="Seminovo (Excelente)">Seminovo (Excelente)</option>
                  <option value="Usado (Bom estado)">Usado (Bom estado)</option>
                  <option value="Com marcas de uso">Com marcas de uso</option>
                  <option value="Para restauro / Peças">Para restauro / Peças</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. DESCRIÇÃO DETALHADA */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900">
              3. Descrição do Item & Detalhes do Desapego *
            </label>
            <textarea
              rows={3}
              placeholder="Descreva as especificações, tempo de uso, motivo do desapego, se precisa de ajuda para carregar, etc."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-medium focus:outline-none focus:bg-white focus:border-rose-500 resize-none shadow-xs"
              required
            />
          </div>

          {/* 5. FOTO DO ITEM */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
              4. Foto do Item (URL ou escolha um exemplo)
            </label>

            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-mono focus:outline-none focus:bg-white focus:border-rose-500"
            />

            {/* Sugestões Rápidas de Fotos */}
            <div className="flex flex-wrap gap-1.5">
              {FOTOS_SUGERIDAS.map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setFotoUrl(item.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    fotoUrl === item.url
                      ? 'bg-rose-500 text-white border-rose-600 shadow-2xs font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-950'
                  }`}
                >
                  📷 {item.label}
                </button>
              ))}
            </div>

            {/* Prévia da Foto */}
            {fotoUrl && (
              <div className="mt-2 w-full h-32 rounded-2xl overflow-hidden border border-slate-300 relative bg-slate-100">
                <img
                  src={fotoUrl}
                  alt="Prévia do item"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FOTOS_SUGERIDAS[0].url;
                  }}
                />
              </div>
            )}
          </div>

          {/* 6. DADOS DO MORADOR ANUNCIANTE */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" />
              5. Dados de Contato & Localização no Condomínio
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Seu Nome:</span>
                <input
                  type="text"
                  value={moradorNome}
                  onChange={(e) => setMoradorNome(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Sua Unidade / Apto:</span>
                <input
                  type="text"
                  value={moradorUnidade}
                  onChange={(e) => setMoradorUnidade(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">WhatsApp de Contato:</span>
                <input
                  type="text"
                  placeholder="5511988887766"
                  value={contatoWhatsapp}
                  onChange={(e) => setContatoWhatsapp(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* RODAPÉ FIXO */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{itemToEdit ? 'Salvar Alterações' : 'Publicar no Enjoei'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
