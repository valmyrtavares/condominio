import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { EventoCondominio, TipoVisibilidadeEvento } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Upload, 
  Globe, 
  Lock, 
  Sparkles, 
  Image as ImageIcon, 
  Check,
  PartyPopper
} from 'lucide-react';

interface CreateEditEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventoToEdit?: EventoCondominio | null;
}

const PRESET_IMAGES = [
  { label: 'Festa / Celebração', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { label: 'Churrasco', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aniversário', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Café da Manhã', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80' },
  { label: 'Música & Confraternização', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Esportes & Lazer', url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80' }
];

const PRESET_LOCAIS = [
  'Salão de Festas & Espaço Gourmet',
  'Churrasqueira Gourmet & Deck Solarium',
  'Deck da Piscina & Solarium',
  'Jardim & Bosque de Convivência',
  'Quadra Poliesportiva',
  'Academia & Sala Fitness',
  'Playground & Área Infantil',
  'Outro Local'
];

export const CreateEditEventoModal: React.FC<CreateEditEventoModalProps> = ({
  isOpen,
  onClose,
  eventoToEdit
}) => {
  const { currentUser, adicionarEvento, editarEvento } = useCondo();

  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('14:00 às 20:00');
  const [local, setLocal] = useState(PRESET_LOCAIS[0]);
  const [localCustom, setLocalCustom] = useState('');
  const [visibilidade, setVisibilidade] = useState<TipoVisibilidadeEvento>('Público');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(PRESET_IMAGES[0].url);
  const [imagemCustom, setImagemCustom] = useState('');

  useEffect(() => {
    if (eventoToEdit && isOpen) {
      setTitulo(eventoToEdit.titulo);
      // Converter data se necessário
      const dataIso = eventoToEdit.data.includes('/') 
        ? eventoToEdit.data.split('/').reverse().join('-') 
        : eventoToEdit.data;
      setData(dataIso);
      setHorario(eventoToEdit.horario);
      if (PRESET_LOCAIS.includes(eventoToEdit.local)) {
        setLocal(eventoToEdit.local);
        setLocalCustom('');
      } else {
        setLocal('Outro Local');
        setLocalCustom(eventoToEdit.local);
      }
      setVisibilidade(eventoToEdit.visibilidade);
      setDescricao(eventoToEdit.descricao);
      setImagem(eventoToEdit.imagem);
      setImagemCustom('');
    } else if (isOpen) {
      setTitulo('');
      const today = new Date().toISOString().split('T')[0];
      setData(today);
      setHorario('16:00 às 22:00');
      setLocal(PRESET_LOCAIS[0]);
      setLocalCustom('');
      setVisibilidade('Público');
      setDescricao('');
      setImagem(PRESET_IMAGES[0].url);
      setImagemCustom('');
    }
  }, [eventoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagem(result);
        setImagemCustom(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    // Formatar data dd/mm/aaaa
    let dataFormatada = data;
    if (data.includes('-')) {
      const [year, month, day] = data.split('-');
      dataFormatada = `${day}/${month}/${year}`;
    }

    const localFinal = local === 'Outro Local' && localCustom.trim() ? localCustom.trim() : local;
    const imagemFinal = imagemCustom || imagem || PRESET_IMAGES[0].url;

    const unidadeFormatada = currentUser.unidade 
      ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`)
      : 'Administração';

    const organizadorFinal = currentUser.nome 
      ? `${currentUser.nome} (${unidadeFormatada})` 
      : `Morador (${unidadeFormatada})`;

    if (eventoToEdit) {
      editarEvento(eventoToEdit.id, {
        titulo: titulo.trim(),
        data: dataFormatada,
        horario: horario.trim(),
        local: localFinal,
        visibilidade,
        descricao: descricao.trim(),
        imagem: imagemFinal
      });
    } else {
      adicionarEvento({
        titulo: titulo.trim(),
        data: dataFormatada,
        horario: horario.trim(),
        local: localFinal,
        organizador: organizadorFinal,
        organizadorId: currentUser.id,
        organizadorUnidade: unidadeFormatada,
        visibilidade,
        descricao: descricao.trim(),
        imagem: imagemFinal,
        ativo: true
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start pt-16 sm:pt-10 pb-28 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                {eventoToEdit ? 'Editar Anúncio de Evento' : 'Anunciar Novo Evento ou Celebração'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Compartilhe eventos públicos do condomínio ou anuncie celebrações privadas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Título */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Título do Evento *
            </label>
            <input
              type="text"
              placeholder="Ex: Aniversário da Sofia, Churrasco dos Vizinhos, Festa Junina..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold"
              required
            />
          </div>

          {/* Tipo de Visibilidade (Público vs Privado) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Tipo de Visibilidade *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibilidade('Público')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  visibilidade === 'Público'
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 text-emerald-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${visibilidade === 'Público' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-black">Evento Público</strong>
                  <span className="text-[10px] opacity-80">Aberto a todos os moradores com confirmação de presença</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibilidade('Privado')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  visibilidade === 'Privado'
                    ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/40 text-purple-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${visibilidade === 'Privado' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-black">Celebração Privada</strong>
                  <span className="text-[10px] opacity-80">Apenas informativo de uso de espaço para convidados do morador</span>
                </div>
              </button>
            </div>
          </div>

          {/* Data & Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-700" /> Data do Evento *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Horário / Duração *
              </label>
              <input
                type="text"
                placeholder="Ex: 14:00 às 20:00 ou A partir das 19h"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold"
                required
              />
            </div>
          </div>

          {/* Local do Evento */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-700" /> Local / Espaço Utilizado *
            </label>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold"
            >
              {PRESET_LOCAIS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {local === 'Outro Local' && (
              <input
                type="text"
                placeholder="Digite o local personalizado..."
                value={localCustom}
                onChange={(e) => setLocalCustom(e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold"
                required
              />
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Descrição do Evento *
            </label>
            <textarea
              placeholder="Conte aos vizinhos o que vai rolar, cardápio, se é necessário levar algo, regras de acesso..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-amber-500 font-semibold resize-none"
              required
            />
          </div>

          {/* Foto / Imagem do Evento */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-700" /> Foto do Evento
              </label>
              
              <label className="text-[10px] font-bold text-indigo-800 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" /> Fazer Upload de Imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview e Sugestões Rápidas */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, idx) => {
                const isSelected = imagem === img.url && !imagemCustom;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImagem(img.url);
                      setImagemCustom('');
                    }}
                    className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-400'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                    title={img.label}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute inset-0 bg-amber-500/30 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview Atual */}
            {imagem && (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={imagem} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                  Pré-visualização do Banner
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {eventoToEdit ? 'Salvar Alterações' : 'Publicar no Mural'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
