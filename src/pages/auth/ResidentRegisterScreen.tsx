import React, { useState, useRef } from 'react';
import { useCondo } from '../../context/CondoContext';
import { ChangePasswordModal } from '../../components/auth/ChangePasswordModal';
import { otimizarImagemArquivo } from '../../utils/imageOptimizer';
import { 
  Building2, 
  ArrowLeft, 
  Upload, 
  Camera, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  User,
  Briefcase,
  Mail,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface MoradorInput {
  id: string;
  nome: string;
  email: string;
  profissao: string;
}

export const ResidentRegisterScreen: React.FC = () => {
  const { 
    pendingRegistrationUnit, 
    concluirCadastroMorador, 
    pularCadastroMorador, 
    setCurrentScreen 
  } = useCondo();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [moradores, setMoradores] = useState<MoradorInput[]>([
    { id: '1', nome: '', email: '', profissao: '' }
  ]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const unidadeNumero = pendingRegistrationUnit?.numero || '';
  const blocoNome = pendingRegistrationUnit?.bloco || 'Bloco A';

  React.useEffect(() => {
    if (!pendingRegistrationUnit) {
      setCurrentScreen('resident-login');
    }
  }, [pendingRegistrationUnit, setCurrentScreen]);

  const handleAddMorador = () => {
    setMoradores(prev => [
      ...prev,
      { id: `${Date.now()}-${prev.length + 1}`, nome: '', email: '', profissao: '' }
    ]);
  };

  const handleRemoveMorador = (id: string) => {
    if (moradores.length <= 1) return;
    setMoradores(prev => prev.filter(m => m.id !== id));
  };

  const handleMoradorChange = (id: string, field: 'nome' | 'email' | 'profissao', value: string) => {
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
      // Comprime e redimensiona automaticamente para max 1024px e JPEG leve
      const fotoOtimizada = await otimizarImagemArquivo(file, {
        maxLargura: 1024,
        maxAltura: 1024,
        qualidade: 0.82
      });
      setFotoPreview(fotoOtimizada);
    } catch (err: any) {
      console.warn('Erro ao otimizar imagem:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const primeiroNome = moradores[0]?.nome.trim();
    const primeiroEmail = moradores[0]?.email.trim();

    if (!primeiroNome) {
      setErro('Por favor, informe o nome do morador principal.');
      return;
    }

    if (!primeiroEmail || !primeiroEmail.includes('@')) {
      setErro('Por favor, informe um e-mail válido para recuperação e troca de senha.');
      return;
    }

    // Abre o popup de verificação de e-mail e troca de senha padrão
    setIsChangePasswordModalOpen(true);
  };

  const handleSaveWithNewPassword = async (novaSenha: string) => {
    setIsChangePasswordModalOpen(false);
    setIsSalvando(true);
    setErro('');
    
    try {
      const res = await concluirCadastroMorador(
        unidadeNumero,
        moradores.map(m => ({ 
          nome: m.nome.trim(), 
          email: m.email.trim(), 
          profissao: m.profissao.trim() 
        })),
        fotoPreview || undefined,
        novaSenha
      );

      if (res.success) {
        setSucesso(true);
      } else {
        setErro(res.error || 'Erro ao persistir cadastro no banco.');
      }
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setIsSalvando(false);
    }
  };

  const handleSaveKeepDefaultPassword = async () => {
    setIsChangePasswordModalOpen(false);
    setIsSalvando(true);
    setErro('');
    
    try {
      const res = await concluirCadastroMorador(
        unidadeNumero,
        moradores.map(m => ({ 
          nome: m.nome.trim(), 
          email: m.email.trim(), 
          profissao: m.profissao.trim() 
        })),
        fotoPreview || undefined
      );

      if (res.success) {
        setSucesso(true);
      } else {
        setErro(res.error || 'Erro ao persistir cadastro no banco.');
      }
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setIsSalvando(false);
    }
  };

  const handleSkip = () => {
    pularCadastroMorador(unidadeNumero);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white/60 border-2 border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => setCurrentScreen('resident-login')}
          className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-slate-950 font-extrabold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-950 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">
            Cadastro da Unidade {unidadeNumero}
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Preencha os dados dos moradores e e-mail para liberação de acesso.
          </p>
        </div>

        {/* Error Alert */}
        {erro && (
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Success Alert */}
        {sucesso && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Cadastro finalizado com sucesso! Entrando no sistema...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Foto dos Moradores / Família (Opcional)
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
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-slate-400 bg-white/50 hover:bg-white/70 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 overflow-hidden group shadow-inner"
              >
                {fotoPreview ? (
                  <img 
                    src={fotoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 group-hover:text-amber-700">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-extrabold uppercase">Tirar/Subir</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white border border-white rounded-xl text-slate-900 font-extrabold shadow-sm transition-all text-xs active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  {fotoPreview ? 'Trocar Foto' : 'Selecionar Foto'}
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
                <p className="text-[10px] text-slate-600">
                  Esta foto aparecerá no cartão da sua unidade na lista de apartamentos.
                </p>
              </div>
            </div>
          </div>

          {/* Residents List Form */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Moradores da Unidade
              </label>
              <button
                type="button"
                onClick={handleAddMorador}
                className="inline-flex items-center gap-1 text-[11px] text-amber-900 hover:text-amber-950 font-black bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-xl transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Adicionar outro morador
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {moradores.map((morador, index) => (
                <div 
                  key={morador.id}
                  className="p-3.5 rounded-2xl bg-white/50 border border-white/80 shadow-sm space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-700">
                      {index === 0 ? 'Morador Principal (Responsável)' : `Morador ${index + 1}`}
                    </span>
                    {moradores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMorador(morador.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Remover morador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                          className="w-full bg-white/90 border border-white rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                          required={index === 0}
                        />
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Profissão (ex: Arquiteto)"
                          value={morador.profissao}
                          onChange={(e) => handleMoradorChange(morador.id, 'profissao', e.target.value)}
                          className="w-full bg-white/90 border border-white rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                        />
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <input
                        type="email"
                        placeholder={index === 0 ? "E-mail do morador (obrigatório para recuperação de senha) *" : "E-mail do morador (opcional)"}
                        value={morador.email}
                        onChange={(e) => handleMoradorChange(morador.id, 'email', e.target.value)}
                        className="w-full bg-white/90 border border-white rounded-xl px-3 py-2 pl-8 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                        required={index === 0}
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={sucesso || isSalvando}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSalvando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no Firebase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Salvar e Concluir Cadastro</span>
                </>
              )}
            </button>

            {/* Big "Cadastrar depois" Button */}
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSalvando}
              className="w-full py-3.5 bg-white/50 hover:bg-white/80 border-2 border-white/90 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              Cadastrar depois
            </button>
          </div>

        </form>

      </div>

      {/* Change Password / Email check modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        unidadeNumero={unidadeNumero}
        email={moradores[0]?.email || ''}
        onSaveNewPassword={handleSaveWithNewPassword}
        onSkip={handleSaveKeepDefaultPassword}
      />
    </div>
  );
};

