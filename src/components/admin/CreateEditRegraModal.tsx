import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RegraTopico } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { RichTextEditor } from './RichTextEditor';
import { 
  BookOpen, 
  X, 
  Check, 
  Sparkles, 
  Tag, 
  Layers, 
  Plus, 
  AlertCircle,
  HelpCircle,
  Hash
} from 'lucide-react';

interface CreateEditRegraModalProps {
  isOpen: boolean;
  onClose: () => void;
  regraToEdit?: RegraTopico | null;
}

const CATEGORIAS_SUGERIDAS = [
  'Convivência & Pets',
  'Silêncio & Horários',
  'Lazer & Áreas Comuns',
  'Garagem & Trânsito',
  'Limpeza & Sustentabilidade',
  'Segurança & Portaria',
  'Reformas & Obras',
  'Mudanças & Encomendas',
  'Uso do Elevador',
  'Outros'
];

export const CreateEditRegraModal: React.FC<CreateEditRegraModalProps> = ({
  isOpen,
  onClose,
  regraToEdit
}) => {
  const { adicionarRegraCondominio, editarRegraCondominio } = useCondo();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_SUGERIDAS[0]);
  const [categoriaCustom, setCategoriaCustom] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const [palavrasChaveTexto, setPalavrasChaveTexto] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (regraToEdit) {
      setTitulo(regraToEdit.titulo || '');
      const catExiste = CATEGORIAS_SUGERIDAS.includes(regraToEdit.categoria);
      if (catExiste) {
        setCategoria(regraToEdit.categoria);
        setIsCustomCategory(false);
        setCategoriaCustom('');
      } else {
        setIsCustomCategory(true);
        setCategoriaCustom(regraToEdit.categoria || '');
      }
      setConteudo(regraToEdit.conteudo || '');
      setPalavrasChaveTexto((regraToEdit.palavrasChave || []).join(', '));
    } else {
      setTitulo('');
      setCategoria(CATEGORIAS_SUGERIDAS[0]);
      setCategoriaCustom('');
      setIsCustomCategory(false);
      setConteudo('');
      setPalavrasChaveTexto('');
    }
    setErro(null);
    setSucesso(false);
  }, [regraToEdit, isOpen]);

  // Handle escape key to close
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
  if (typeof document === 'undefined') return null;

  // Auto-generate keywords helper from title and content
  const handleGerarPalavrasChave = () => {
    const raw = `${titulo} ${categoria} ${conteudo.replace(/<[^>]*>/g, ' ')}`;
    const words = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    // Stopwords filter
    const stopwords = new Set(['para', 'com', 'pelo', 'pela', 'pelos', 'pelas', 'como', 'mais', 'ser', 'estar', 'estao', 'deve', 'devem', 'qualquer', 'cada', 'todas', 'todos', 'sempre', 'quando', 'este', 'esta', 'isso', 'esse']);
    const uniqueKeywords = Array.from(new Set(words.filter(w => !stopwords.has(w)))).slice(0, 10);
    
    setPalavrasChaveTexto(uniqueKeywords.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const tituloLimpo = titulo.trim();
    const catFinal = isCustomCategory ? categoriaCustom.trim() : categoria.trim();
    const conteudoLimpo = conteudo.trim();

    if (!tituloLimpo) {
      setErro('Informe o título do assunto / tópico da regra.');
      return;
    }

    if (!catFinal) {
      setErro('Selecione ou digite uma categoria para esta regra.');
      return;
    }

    if (!conteudoLimpo || conteudoLimpo === '<br>' || conteudoLimpo === '<p></p>') {
      setErro('Digite o texto das regras e orientações.');
      return;
    }

    // Process keywords
    const keywordsArray = palavrasChaveTexto
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    // If keywords empty, generate from title
    if (keywordsArray.length === 0) {
      keywordsArray.push(
        ...tituloLimpo.toLowerCase().split(' ').filter(w => w.length > 2)
      );
    }

    if (regraToEdit) {
      editarRegraCondominio(regraToEdit.id, {
        titulo: tituloLimpo,
        categoria: catFinal,
        conteudo: conteudoLimpo,
        palavrasChave: Array.from(new Set(keywordsArray))
      });
    } else {
      adicionarRegraCondominio({
        titulo: tituloLimpo,
        categoria: catFinal,
        conteudo: conteudoLimpo,
        palavrasChave: Array.from(new Set(keywordsArray)),
        ativo: true
      });
    }

    setSucesso(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-white border-2 border-amber-400 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header (Fixed on Top) */}
        <div className="shrink-0 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent p-4 sm:p-5 border-b border-amber-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-950 flex items-center justify-center border border-amber-400/40 shrink-0">
              <BookOpen className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950">
                {regraToEdit ? 'Editar Tópico de Regra' : 'Criar Nova Regra de Condomínio'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Gera um card oficial no módulo "Regras do Condomínio" para todos os moradores.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form with Scrollable Content and Sticky Bottom Action Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-0 overscroll-contain">
            
            {/* Error Message */}
            {erro && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{erro}</span>
              </div>
            )}

            {/* Success Message */}
            {sucesso && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Regra salva com sucesso! O card já está disponível para os moradores.</span>
              </div>
            )}

            {/* 1. Categoria */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Categoria do Tópico *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  {isCustomCategory ? 'Escolher categoria sugerida' : '+ Outra Categoria'}
                </button>
              </div>

              {!isCustomCategory ? (
                <div className="space-y-2">
                  {/* Category Preset Chips */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                    {CATEGORIAS_SUGERIDAS.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoria(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          categoria === cat
                            ? 'bg-amber-500 text-slate-950 shadow-xs scale-102 font-extrabold'
                            : 'bg-white text-slate-700 hover:bg-amber-100 hover:text-slate-950 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Espaço Gourmet, Bicicletário, Uso da Sauna..."
                    value={categoriaCustom}
                    onChange={(e) => setCategoriaCustom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* 2. Título do Assunto */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                Título do Assunto / Card *
              </label>
              <input
                type="text"
                placeholder="Ex: Animais de Estimação (Pets), Uso da Piscina, Lei do Silêncio..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
              <p className="text-[10px] text-slate-500">
                Este é o título principal que dará nome ao card sanfonado no aplicativo do morador.
              </p>
            </div>

            {/* 3. Editor de Texto Rico */}
            <RichTextEditor
              value={conteudo}
              onChange={(html) => setConteudo(html)}
              placeholder="Digite o texto detalhado da regra. Use a barra acima para aplicar Negrito, Listas Numeradas, Parágrafos ou Caixas de Alerta..."
              minHeight="150px"
            />

            {/* 4. Palavras-chave / Tags para IA */}
            <div className="space-y-1 bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-700" />
                  Palavras-Chave para o Assistente Virtual (IA)
                </label>
                <button
                  type="button"
                  onClick={handleGerarPalavrasChave}
                  className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Gerar Automaticamente
                </button>
              </div>
              <input
                type="text"
                placeholder="Ex: pet, cachorro, gato, coleira, elevador, multa (separadas por vírgula)"
                value={palavrasChaveTexto}
                onChange={(e) => setPalavrasChaveTexto(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-600">
                Termos que ajudam os moradores a encontrarem a regra ao perguntarem no assistente virtual.
              </p>
            </div>

          </div>

          {/* Modal Sticky Footer Actions (ALWAYS visible on desktop & mobile) */}
          <div className="shrink-0 p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 z-20 shadow-md">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{regraToEdit ? 'Atualizar Regra' : 'Salvar e Publicar Regra'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

