import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ServicoMorador } from '../../types';
import { 
  Briefcase, 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Globe, 
  MessageCircle, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CreateEditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicoParaEditar?: ServicoMorador | null;
}

const CATEGORIAS_PADRAO = [
  'Gastronomia',
  'Advocacia & Consultoria',
  'Pets & Cuidados',
  'Saúde & Esportes',
  'Design & Organização',
  'Limpeza & Higienização',
  'Aulas & Educação',
  'Reparos & Manutenção',
  'Beleza & Estética',
  'Outros'
];

const FOTOS_SUGERIDAS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
];

export const CreateEditServiceModal: React.FC<CreateEditServiceModalProps> = ({
  isOpen,
  onClose,
  servicoParaEditar
}) => {
  const { currentUser, adicionarServicoMorador, editarServicoMorador } = useCondo();

  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_PADRAO[0]);
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(FOTOS_SUGERIDAS[0]);
  const [tipoBotao, setTipoBotao] = useState<'whatsapp' | 'site'>('whatsapp');
  const [whatsapp, setWhatsapp] = useState('');
  const [linkSite, setLinkSite] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  useEffect(() => {
    if (servicoParaEditar) {
      setTitulo(servicoParaEditar.titulo);
      setSubtitulo(servicoParaEditar.subtitulo || '');
      setCategoria(servicoParaEditar.categoria || CATEGORIAS_PADRAO[0]);
      setDescricao(servicoParaEditar.descricao);
      setImagem(servicoParaEditar.imagem || FOTOS_SUGERIDAS[0]);
      setTipoBotao(servicoParaEditar.tipoBotao || 'whatsapp');
      setWhatsapp(servicoParaEditar.whatsapp || servicoParaEditar.contato || '');
      setLinkSite(servicoParaEditar.linkSite || '');
    } else {
      setTitulo('');
      setSubtitulo('');
      setCategoria(CATEGORIAS_PADRAO[0]);
      setDescricao('');
      setImagem(FOTOS_SUGERIDAS[Math.floor(Math.random() * FOTOS_SUGERIDAS.length)]);
      setTipoBotao('whatsapp');
      setWhatsapp('');
      setLinkSite('');
    }
  }, [servicoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagem(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    const contatoPrincipal = tipoBotao === 'whatsapp' ? whatsapp : (linkSite || 'Ver site');

    if (servicoParaEditar) {
      editarServicoMorador(servicoParaEditar.id, {
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim() || undefined,
        categoria,
        descricao: descricao.trim(),
        imagem,
        tipoBotao,
        whatsapp: tipoBotao === 'whatsapp' ? whatsapp.trim() : undefined,
        linkSite: tipoBotao === 'site' ? linkSite.trim() : undefined,
        contato: contatoPrincipal,
        // Ao editar um anúncio suspenso, reseta para reavaliação da sindicância
        ativo: true,
        motivoSuspensao: undefined
      });
      setSucessoMsg('Anúncio atualizado com sucesso!');
    } else {
      adicionarServicoMorador({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim() || undefined,
        categoria,
        descricao: descricao.trim(),
        imagem,
        moradorNome: currentUser.nome && !currentUser.nome.toLowerCase().includes('morador sem dados') ? currentUser.nome : 'Morador',
        moradorUnidade: currentUser.unidade || '001',
        tipoBotao,
        whatsapp: tipoBotao === 'whatsapp' ? whatsapp.trim() : undefined,
        linkSite: tipoBotao === 'site' ? linkSite.trim() : undefined,
        contato: contatoPrincipal,
        ativo: true,
        condominioId: currentUser.condominioId || 'condo-jardim-paulista'
      });
      setSucessoMsg('Anúncio publicado no mural de serviços!');
    }

    setTimeout(() => {
      setSucessoMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                {servicoParaEditar ? 'Editar Anúncio de Serviço' : 'Divulgar Novo Serviço'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Seu anúncio será visível para todos os vizinhos do condomínio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {sucessoMsg && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{sucessoMsg}</span>
            </div>
          )}

          <form id="form-servico-morador" onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Foto do Serviço */}
            <div className="space-y-2 bg-amber-50/60 border border-amber-200 rounded-2xl p-3">
              <label className="text-[10px] font-extrabold uppercase text-slate-700 block">
                Imagem / Foto Ilustrativa do Serviço:
              </label>

              <div className="relative h-36 w-full rounded-xl overflow-hidden border border-amber-300 shadow-inner bg-slate-100">
                <img
                  src={imagem || FOTOS_SUGERIDAS[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                <label 
                  htmlFor="upload-servico-foto"
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md border border-white flex items-center gap-1.5 text-xs font-black uppercase"
                >
                  <Camera className="w-3.5 h-3.5" /> Trocar Foto
                  <input
                    id="upload-servico-foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sugestões rápidas de imagem */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0">Fotos prontas:</span>
                {FOTOS_SUGERIDAS.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImagem(f)}
                    className={`w-9 h-7 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      imagem === f ? 'border-amber-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={f} alt="Sugestão" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Título e Subtítulo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-700">
                  Título do Serviço:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tortas deliciosas pronta entrega"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-700">
                  Subtítulo / Slogan Curto:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Faço a pronta entrega, Aulas VIP..."
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Categoria do Serviço:
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIAS_PADRAO.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Descrição Detalhada */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Descrição do que você oferece:
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva detalhes, diferenciais, formas de pagamento, horários de atendimento..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                required
              />
            </div>

            {/* Escolha do Botão de Ação: WhatsApp ou Site */}
            <div className="space-y-2 bg-amber-50/80 border border-amber-300/80 rounded-2xl p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase text-slate-800">
                  Botão de Ação ("Clique para ver mais"):
                </label>
                <span className="text-[10px] font-bold text-amber-900">
                  Escolha WhatsApp ou Link de Site
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoBotao('whatsapp')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                    tipoBotao === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoBotao('site')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                    tipoBotao === 'site'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Site / Portfólio</span>
                </button>
              </div>

              {/* Input correspondente */}
              {tipoBotao === 'whatsapp' ? (
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-700">
                    Número do WhatsApp (com DDD):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 11999998888 ou (11) 99999-8888"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required={tipoBotao === 'whatsapp'}
                    />
                    <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    * Ao clicar no botão, o vizinho abrirá uma conversa direta no seu WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-700">
                    Link do Site, Instagram ou Portfólio:
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Ex: https://meusite.com.br ou https://instagram.com/meuperfil"
                      value={linkSite}
                      onChange={(e) => setLinkSite(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required={tipoBotao === 'site'}
                    />
                    <Globe className="w-4 h-4 text-indigo-600 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    * Ao clicar no botão, o vizinho será redirecionado para o link externo.
                  </p>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-servico-morador"
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95"
          >
            {servicoParaEditar ? 'Salvar Alterações' : 'Publicar Anúncio'}
          </button>
        </div>

      </div>
    </div>
  );
};
