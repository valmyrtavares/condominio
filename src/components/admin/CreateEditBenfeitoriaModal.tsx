import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { Benfeitoria, TipoBenfeitoria } from '../../types';
import { 
  Sparkles, 
  X, 
  DollarSign, 
  TrendingDown, 
  ShieldCheck, 
  Check, 
  Upload, 
  Camera, 
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { otimizarImagemArquivo } from '../../utils/imageOptimizer';

const TIPOS_SUGERIDOS: TipoBenfeitoria[] = [
  'Grande Reparo & Manutenção',
  'Nova Aquisição & Modernização',
  'Equilíbrio Financeiro & Economia',
  'Área Comum & Convivência'
];

interface CreateEditBenfeitoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  benfeitoriaToEdit?: Benfeitoria | null;
}

export const CreateEditBenfeitoriaModal: React.FC<CreateEditBenfeitoriaModalProps> = ({
  isOpen,
  onClose,
  benfeitoriaToEdit
}) => {
  const { adicionarBenfeitoria, editarBenfeitoria, currentUser } = useCondo();

  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [tipo, setTipo] = useState<TipoBenfeitoria>('Nova Aquisição & Modernização');
  const [descricao, setDescricao] = useState('');
  const [impactoGestao, setImpactoGestao] = useState('');
  const [investimento, setInvestimento] = useState<string>('');
  const [economiaMensal, setEconomiaMensal] = useState<string>('');
  const [regrasUso, setRegrasUso] = useState('');
  const [foto, setFoto] = useState('');

  const [erroMsg, setErroMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (benfeitoriaToEdit) {
      setTitulo(benfeitoriaToEdit.titulo || '');
      setSubtitulo(benfeitoriaToEdit.subtitulo || '');
      setTipo(benfeitoriaToEdit.tipo || 'Nova Aquisição & Modernização');
      setDescricao(benfeitoriaToEdit.descricao || '');
      setImpactoGestao(benfeitoriaToEdit.impactoGestao || '');
      setInvestimento(benfeitoriaToEdit.investimento !== undefined ? String(benfeitoriaToEdit.investimento) : '');
      setEconomiaMensal(benfeitoriaToEdit.economiaMensal !== undefined ? String(benfeitoriaToEdit.economiaMensal) : '');
      setRegrasUso(benfeitoriaToEdit.regrasUso || '');
      setFoto(benfeitoriaToEdit.fotos && benfeitoriaToEdit.fotos.length > 0 ? benfeitoriaToEdit.fotos[0] : '');
    } else {
      setTitulo('');
      setSubtitulo('');
      setTipo('Nova Aquisição & Modernização');
      setDescricao('');
      setImpactoGestao('Melhoria realizada com sucesso e fundo de reserva preservado.');
      setInvestimento('');
      setEconomiaMensal('');
      setRegrasUso('');
      setFoto('');
    }
    setErroMsg('');
    setIsSaving(false);
  }, [benfeitoriaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fotoComprimida = await otimizarImagemArquivo(file, { maxBytes: 120 * 1024 });
        setFoto(fotoComprimida);
      } catch (err) {
        console.error('Erro ao otimizar foto:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!titulo.trim()) {
      setErroMsg('Por favor, informe o título da benfeitoria ou conquista.');
      return;
    }
    if (!descricao.trim()) {
      setErroMsg('Por favor, descreva detalhadamente a melhoria realizada.');
      return;
    }
    if (!impactoGestao.trim()) {
      setErroMsg('Por favor, descreva o impacto na gestão e equilíbrio das contas.');
      return;
    }

    const investNum = investimento ? parseFloat(investimento.replace(',', '.')) : undefined;
    const econNum = economiaMensal ? parseFloat(economiaMensal.replace(',', '.')) : undefined;
    const fotosArray = foto.trim() ? [foto.trim()] : [];

    setIsSaving(true);
    setErroMsg('');

    try {
      if (benfeitoriaToEdit) {
        const res = await editarBenfeitoria(benfeitoriaToEdit.id, {
          titulo: titulo.trim(),
          subtitulo: subtitulo.trim() || 'Melhoria entregue pela administração',
          tipo,
          descricao: descricao.trim(),
          impactoGestao: impactoGestao.trim(),
          investimento: investNum,
          economiaMensal: econNum,
          regrasUso: regrasUso.trim() || undefined,
          fotos: fotosArray.length > 0 ? fotosArray : benfeitoriaToEdit.fotos
        });
        if (res.success) {
          onClose();
        } else {
          setErroMsg(res.error || 'Falha ao atualizar benfeitoria no Firestore.');
        }
      } else {
        adicionarBenfeitoria(
          titulo.trim(),
          subtitulo.trim() || 'Melhoria entregue pela administração',
          tipo,
          descricao.trim(),
          impactoGestao.trim(),
          fotosArray,
          investNum,
          econNum,
          regrasUso.trim() || undefined
        );
        onClose();
      }
    } catch (err: any) {
      console.error('🔥 Erro ao salvar benfeitoria:', err);
      setErroMsg(err.message || 'Erro inesperado ao conectar ao banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="modal-overlay-safe bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="modal-content-safe bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                {benfeitoriaToEdit ? 'Edição de Prestação de Gestão' : 'Nova Benfeitoria'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {benfeitoriaToEdit ? `Editar: ${benfeitoriaToEdit.titulo}` : 'Publicar Benfeitoria & Realização'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {erroMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* 1. Título e Subtítulo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Título da Conquista / Obra *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Instalação de Painéis Solares na Cobertura, Nova Esteira Movement..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Subtítulo / Resumo Curto
              </label>
              <input
                type="text"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
                placeholder="Ex: Economia mensal sustentável e valorização do patrimônio dos moradores"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          {/* 2. Tipo, Investimento & Economia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Tipo da Benfeitoria *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoBenfeitoria)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                {TIPOS_SUGERIDOS.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Investimento Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={investimento}
                onChange={(e) => setInvestimento(e.target.value)}
                placeholder="Ex: 15400.00"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Economia Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={economiaMensal}
                onChange={(e) => setEconomiaMensal(e.target.value)}
                placeholder="Ex: 1200.00 (opcional)"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
              />
            </div>
          </div>

          {/* 3. Descrição & Impacto Gestão */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Descrição Detalhada do que foi Realizado *
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o estado anterior, o conserto ou aquisição realizada, fornecedores contratados e detalhes da obra..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Impacto na Gestão & Equilíbrio das Contas *
              </label>
              <input
                type="text"
                value={impactoGestao}
                onChange={(e) => setImpactoGestao(e.target.value)}
                placeholder="Ex: Redução permanente de despesas operacionais e valorização patrimonial sem chamada de capital extraordinária."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Regras de Utilização (Opcional)
              </label>
              <input
                type="text"
                value={regrasUso}
                onChange={(e) => setRegrasUso(e.target.value)}
                placeholder="Ex: Limite de 30 min por morador em horários de pico; uso exclusivo para moradores."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          {/* 4. Foto de Entrega */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" /> Foto Principal de Entrega da Obra
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Anexe foto de conclusão ou insira a URL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 aspect-square max-w-[140px] mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 relative flex items-center justify-center p-1 group shadow-inner">
                {foto ? (
                  <img
                    src={foto}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="text-center p-3 text-slate-500">
                    <ImageIcon className="w-7 h-7 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] block">Sem imagem</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-8 space-y-2">
                <input
                  type="text"
                  value={foto}
                  onChange={(e) => setFoto(e.target.value)}
                  placeholder="URL da imagem (ex: https://...)"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />

                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Anexar foto por Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:scale-100 cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no Firestore...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{benfeitoriaToEdit ? 'Salvar Alterações' : 'Publicar Benfeitoria'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
