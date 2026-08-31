import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { CondominioProfile, ModeloInicialCondominio, StatusCondominio } from '../../types';
import { 
  Building2, 
  X, 
  Check, 
  AlertCircle, 
  KeyRound, 
  MapPin, 
  Camera, 
  Sparkles, 
  Layers, 
  UserCheck, 
  Phone, 
  Mail, 
  Globe,
  HelpCircle,
  Copy
} from 'lucide-react';

const FOTOS_FACHADAS_SUGERIDAS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
];

interface CreateEditCondominioModalProps {
  isOpen: boolean;
  onClose: () => void;
  condominioToEdit?: CondominioProfile | null;
}

export const CreateEditCondominioModal: React.FC<CreateEditCondominioModalProps> = ({
  isOpen,
  onClose,
  condominioToEdit
}) => {
  const { adicionarCondominio, editarCondominio } = useCondo();

  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [estado, setEstado] = useState('SP');
  const [totalUnidades, setTotalUnidades] = useState<number>(32);
  const [totalBlocos, setTotalBlocos] = useState<number>(1);
  const [fotoFachada, setFotoFachada] = useState('');
  const [senhaAdminGeral, setSenhaAdminGeral] = useState('admin');
  const [nomeSindico, setNomeSindico] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [telefoneSindico, setTelefoneSindico] = useState('');
  const [modeloInicial, setModeloInicial] = useState<ModeloInicialCondominio>('limpo');
  const [status, setStatus] = useState<StatusCondominio>('ativo');

  const [erroMsg, setErroMsg] = useState('');

  const isEditing = Boolean(condominioToEdit);

  useEffect(() => {
    if (condominioToEdit) {
      setNome(condominioToEdit.nome);
      setSlug(condominioToEdit.slug);
      setEndereco(condominioToEdit.endereco);
      setCidade(condominioToEdit.cidade || 'São Paulo');
      setEstado(condominioToEdit.estado || 'SP');
      setTotalUnidades(condominioToEdit.totalUnidades || 32);
      setTotalBlocos(condominioToEdit.totalBlocos || 1);
      setFotoFachada(condominioToEdit.fotoFachada || FOTOS_FACHADAS_SUGERIDAS[0]);
      setSenhaAdminGeral(condominioToEdit.senhaAdminGeral || 'admin');
      setNomeSindico(condominioToEdit.nomeSindico || '');
      setEmailAdmin(condominioToEdit.emailAdmin || '');
      setTelefoneSindico(condominioToEdit.telefoneSindico || '');
      setModeloInicial(condominioToEdit.modeloInicial || 'limpo');
      setStatus(condominioToEdit.status || 'ativo');
    } else {
      setNome('');
      setSlug('');
      setEndereco('');
      setCidade('São Paulo');
      setEstado('SP');
      setTotalUnidades(32);
      setTotalBlocos(1);
      setFotoFachada(FOTOS_FACHADAS_SUGERIDAS[0]);
      setSenhaAdminGeral('admin');
      setNomeSindico('');
      setEmailAdmin('');
      setTelefoneSindico('');
      setModeloInicial('limpo');
      setStatus('ativo');
    }
    setErroMsg('');
  }, [condominioToEdit, isOpen]);

  // Gera slug automaticamente ao digitar o nome se for novo condomínio
  const handleNomeChange = (val: string) => {
    setNome(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoFachada(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErroMsg('Por favor, informe o nome do condomínio.');
      return;
    }
    if (!slug.trim()) {
      setErroMsg('Por favor, defina a URL (Slug) de acesso do condomínio.');
      return;
    }
    if (!senhaAdminGeral.trim()) {
      setErroMsg('Defina uma senha master de administração para o condomínio.');
      return;
    }

    if (isEditing && condominioToEdit) {
      editarCondominio(condominioToEdit.id, {
        nome: nome.trim(),
        slug: slug.trim(),
        endereco: endereco.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        totalUnidades: Number(totalUnidades) || 16,
        totalBlocos: Number(totalBlocos) || 1,
        fotoFachada: fotoFachada.trim(),
        senhaAdminGeral: senhaAdminGeral.trim(),
        nomeSindico: nomeSindico.trim() || undefined,
        emailAdmin: emailAdmin.trim() || undefined,
        telefoneSindico: telefoneSindico.trim() || undefined,
        status
      });
    } else {
      adicionarCondominio({
        nome: nome.trim(),
        slug: slug.trim(),
        endereco: endereco.trim() || 'Endereço não informado',
        cidade: cidade.trim() || 'São Paulo',
        estado: estado.trim() || 'SP',
        totalUnidades: Number(totalUnidades) || 16,
        totalBlocos: Number(totalBlocos) || 1,
        fotoFachada: fotoFachada.trim() || FOTOS_FACHADAS_SUGERIDAS[0],
        senhaAdminGeral: senhaAdminGeral.trim() || 'admin',
        nomeSindico: nomeSindico.trim() || undefined,
        emailAdmin: emailAdmin.trim() || undefined,
        telefoneSindico: telefoneSindico.trim() || undefined,
        modeloInicial,
        status: 'ativo'
      });
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                Plataforma Master Multi-Condomínio
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isEditing ? 'Editar Configurações do Condomínio' : 'Criar Novo Condomínio'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          
          {erroMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* Nome e Slug da URL */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Nome do Condomínio *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Residencial Jardim Paulista, Edifício Aurora..."
                value={nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> Link de Acesso / URL Slug *:
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs">
                <span className="text-slate-500 font-bold select-none">/c/</span>
                <input
                  type="text"
                  required
                  placeholder="nome-do-condominio"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full bg-transparent text-amber-300 font-bold focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Este link será usado pelos moradores e pelo síndico para acessar este condomínio de forma exclusiva.
              </span>
            </div>
          </div>

          {/* Endereço, Cidade e Estado */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Endereço Completo:
              </label>
              <input
                type="text"
                placeholder="Ex: Alameda Campinas, 1200 - Jardim Paulista"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300">Cidade:</label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300">Estado (UF):</label>
                <input
                  type="text"
                  placeholder="Ex: SP"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium uppercase"
                />
              </div>
            </div>
          </div>

          {/* Estrutura: Total de Unidades e Blocos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Quantidade de Unidades / Aptos:
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={totalUnidades}
                onChange={(e) => setTotalUnidades(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Quantidade de Blocos / Torres:
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={totalBlocos}
                onChange={(e) => setTotalBlocos(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          {/* Senha Mestre do Síndico & Dados de Contato */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Senha Inicial do Síndico / Painel Admin *:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: admin ou aurora2026"
                value={senhaAdminGeral}
                onChange={(e) => setSenhaAdminGeral(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2 text-amber-300 font-mono font-black text-sm"
              />
              <span className="text-[10px] text-slate-400 block">
                O síndico deste condomínio usará esta senha para acessar o painel administrativo em <b>/c/{slug || 'slug'}/admin</b>.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-slate-400" /> Nome do Síndico:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Adriana Silva"
                  value={nomeSindico}
                  onChange={(e) => setNomeSindico(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> E-mail de Gestão:
                </label>
                <input
                  type="email"
                  placeholder="gestao@condominio.com"
                  value={emailAdmin}
                  onChange={(e) => setEmailAdmin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> WhatsApp / Tel:
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={telefoneSindico}
                  onChange={(e) => setTelefoneSindico(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Modelo Inicial (Apenas para novos condomínios) */}
          {!isEditing && (
            <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Como deseja inicializar este novo condomínio?
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setModeloInicial('limpo')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    modeloInicial === 'limpo'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <strong className="block text-xs font-black text-emerald-300">
                      🧹 Condomínio Limpo em Branco
                    </strong>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                      Gera a base vazia com os {totalUnidades} apartamentos criados, pronta para o novo síndico cadastrar tudo do zero.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-emerald-400 mt-2">
                    {modeloInicial === 'limpo' ? '✓ Selecionado' : 'Selecionar'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModeloInicial('exemplo')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    modeloInicial === 'exemplo'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <strong className="block text-xs font-black text-amber-300">
                      📦 Clonar com Dados de Demonstração
                    </strong>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                      Preenche o condomínio com exemplos de regras, dependências, vagas, funcionários e eventos para testes rápidos.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-amber-400 mt-2">
                    {modeloInicial === 'exemplo' ? '✓ Selecionado' : 'Selecionar'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Foto da Fachada */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" /> Foto da Fachada / Prédio:
              </label>
              {fotoFachada && (
                <span className="text-[10px] text-emerald-400 font-bold">✓ Foto selecionada</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {fotoFachada ? (
                <img
                  src={fotoFachada}
                  alt="Fachada"
                  className="w-full sm:w-36 h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0 bg-slate-800"
                />
              ) : (
                <div className="w-full sm:w-36 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-2 flex-1 w-full">
                <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-amber-400" /> Enviar Foto do Prédio
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Fotos Sugeridas:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {FOTOS_FACHADAS_SUGERIDAS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFotoFachada(url)}
                        className={`w-12 h-9 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                          fotoFachada === url ? 'border-amber-400 ring-2 ring-amber-400 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-extrabold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Condomínio'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
