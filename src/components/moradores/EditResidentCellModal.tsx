import React, { useState, useRef, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade, User } from '../../types';
import { otimizarImagemArquivo } from '../../utils/imageOptimizer';
import { 
  Building2, 
  Upload, 
  Camera, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  User as UserIcon,
  Briefcase,
  Mail,
  AlertCircle,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';

interface EditResidentCellModalProps {
  isOpen: boolean;
  unidade: Unidade;
  onClose: () => void;
}

interface MoradorFormItem {
  id: string;
  nome: string;
  email: string;
  profissao: string;
  role: 'morador' | 'sindico' | 'subsindico';
}

export const EditResidentCellModal: React.FC<EditResidentCellModalProps> = ({
  isOpen,
  unidade,
  onClose
}) => {
  const { atualizarMoradoresUnidade, currentCondoId } = useCondo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [moradores, setMoradores] = useState<MoradorFormItem[]>([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (unidade) {
      setFotoPreview(unidade.fotoCelula || '');
      if (unidade.moradores && unidade.moradores.length > 0) {
        setMoradores(
          unidade.moradores.map(m => ({
            id: m.id,
            nome: m.nome || '',
            email: m.email || '',
            profissao: m.profissao || '',
            role: (m.role === 'sindico' || m.role === 'subsindico') ? m.role : 'morador'
          }))
        );
      } else {
        setMoradores([
          { id: `morador-${Date.now()}`, nome: '', email: '', profissao: '', role: 'morador' }
        ]);
      }
      setErro('');
      setSucesso(false);
    }
  }, [unidade, isOpen]);

  if (!isOpen || !unidade) return null;

  const handleAddMorador = () => {
    setMoradores(prev => [
      ...prev,
      { 
        id: `morador-${Date.now()}-${prev.length + 1}`, 
        nome: '', 
        email: '', 
        profissao: '', 
        role: 'morador' 
      }
    ]);
  };

  const handleRemoveMorador = (id: string) => {
    if (moradores.length <= 1) {
      setErro('A unidade deve conter ao menos 1 morador cadastrado.');
      return;
    }
    setMoradores(prev => prev.filter(m => m.id !== id));
  };

  const handleMoradorChange = (
    id: string, 
    field: 'nome' | 'email' | 'profissao', 
    value: string
  ) => {
    setMoradores(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fotoOtimizada = await otimizarImagemArquivo(file, {
        maxLargura: 1024,
        maxAltura: 1024,
        qualidade: 0.82
      });
      setFotoPreview(fotoOtimizada);
    } catch (err: any) {
      console.warn('Erro ao otimizar imagem no modal:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const primeiroNome = moradores[0]?.nome.trim();
    if (!primeiroNome) {
      setErro('Por favor, informe ao menos o nome do primeiro morador.');
      return;
    }

    const updatedMoradores: User[] = moradores
      .filter(m => m.nome.trim().length > 0)
      .map((m, idx) => ({
        id: m.id.startsWith('morador-') ? `usr-${unidade.numero.replace(/\s+/g, '-')}-${idx + 1}-${Date.now()}` : m.id,
        nome: m.nome.trim(),
        email: m.email.trim() || `morador.${unidade.numero.replace(/\s+/g, '')}.${idx + 1}@condominio.com`,
        profissao: m.profissao.trim() || undefined,
        role: m.role,
        unidade: unidade.numero,
        bloco: unidade.bloco || 'Bloco A',
        foto: fotoPreview || undefined,
        condominioId: currentCondoId
      }));

    const nomesFormatados = updatedMoradores.map(m => m.nome).join(', ');

    await atualizarMoradoresUnidade(
      unidade.id,
      updatedMoradores,
      fotoPreview || '',
      nomesFormatados
    );

    setSucesso(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white/95 border-2 border-white rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl z-10 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
              <Building2 className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                Editar Célula do Apto {unidade.numero}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Adicione, remova ou atualize os dados dos moradores e foto.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {erro && (
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-shake shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Success Alert */}
        {sucesso && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Perfil e moradores atualizados com sucesso!</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
          
          {/* Photo Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Foto da Célula de Moradores
            </label>

            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />

            <div className="flex items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-400 bg-slate-100 hover:bg-slate-200 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 overflow-hidden group shadow-inner"
              >
                {fotoPreview ? (
                  <img 
                    src={fotoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 group-hover:text-amber-700">
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-extrabold uppercase">Tirar/Subir</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-900 font-extrabold shadow-2xs transition-all text-xs active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  {fotoPreview ? 'Trocar Foto' : 'Subir Foto'}
                </button>
                {fotoPreview && (
                  <button
                    type="button"
                    onClick={() => setFotoPreview('')}
                    className="block text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Moradores List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Moradores ({moradores.length})
              </label>
              <button
                type="button"
                onClick={handleAddMorador}
                className="inline-flex items-center gap-1 text-[11px] text-amber-950 font-black bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-xl transition-all active:scale-95 border border-amber-400/40"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Adicionar morador
              </button>
            </div>

            <div className="space-y-3">
              {moradores.map((morador, index) => (
                <div 
                  key={morador.id}
                  className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 shadow-2xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-700">
                      {index === 0 ? 'Morador Principal' : `Morador ${index + 1}`}
                    </span>
                    {moradores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMorador(morador.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Tirar este morador"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Tirar morador
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Nome completo *"
                          value={morador.nome}
                          onChange={(e) => handleMoradorChange(morador.id, 'nome', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={index === 0}
                        />
                        <UserIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Profissão (ex: Engenheiro)"
                          value={morador.profissao}
                          onChange={(e) => handleMoradorChange(morador.id, 'profissao', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        placeholder="E-mail (opcional)"
                        value={morador.email}
                        onChange={(e) => handleMoradorChange(morador.id, 'email', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={sucesso}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Salvar Alterações
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
