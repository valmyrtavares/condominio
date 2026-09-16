import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { CondominioProfile, ModeloInicialCondominio, StatusCondominio, TipoCondominio } from '../../types';
import { 
  Building2, 
  Home,
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
  Copy,
  Plus,
  Trash2,
  ListOrdered,
  CheckCheck,
  Compass
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
  const { adicionarCondominio, editarCondominio, unidades, currentCondoId } = useCondo();

  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  // Tipo de condomínio (Radio: Apartamentos ou Casas)
  const [tipoCondominio, setTipoCondominio] = useState<TipoCondominio>('apartamentos');
  
  // Campos para Condomínio de Apartamentos
  const [totalUnidades, setTotalUnidades] = useState<number>(32);
  const [totalBlocos, setTotalBlocos] = useState<number>(1);
  const [totalAndares, setTotalAndares] = useState<number | ''>('');
  const [padraoPrimeiroAndar, setPadraoPrimeiroAndar] = useState<string>('');

  // Campos para Condomínio de Casas
  const [ruas, setRuas] = useState<string[]>([]);
  const [novaRuaInput, setNovaRuaInput] = useState<string>('');
  const [unidadesCasas, setUnidadesCasas] = useState<{ numero: string; rua: string }[]>([]);
  const [ruaMassaSelecionada, setRuaMassaSelecionada] = useState<string>('');

  const [fotoFachada, setFotoFachada] = useState('');
  const [senhaAdminGeral, setSenhaAdminGeral] = useState('');
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
      setCidade(condominioToEdit.cidade || '');
      setEstado(condominioToEdit.estado || '');
      
      const tipo = condominioToEdit.tipoCondominio || 'apartamentos';
      setTipoCondominio(tipo);
      
      const qty = condominioToEdit.totalUnidades || 32;
      setTotalUnidades(qty);
      setTotalBlocos(condominioToEdit.totalBlocos || 1);
      setTotalAndares(condominioToEdit.totalAndares || '');
      setPadraoPrimeiroAndar(condominioToEdit.padraoPrimeiroAndar || '');
      
      const ruasSalvas = condominioToEdit.ruas || [];
      setRuas(ruasSalvas);
      setNovaRuaInput('');

      // Carrega unidades de casas existentes
      const casasExistentes = unidades
        .filter(u => u.condominioId === condominioToEdit.id || currentCondoId === condominioToEdit.id)
        .map(u => ({ numero: u.numero, rua: u.rua || u.bloco || (ruasSalvas[0] || '') }));

      const casasArray: { numero: string; rua: string }[] = [];
      for (let i = 0; i < qty; i++) {
        if (casasExistentes[i]) {
          casasArray.push({
            numero: casasExistentes[i].numero || String(i + 1),
            rua: casasExistentes[i].rua || (ruasSalvas[0] || '')
          });
        } else {
          casasArray.push({
            numero: String(i + 1),
            rua: ruasSalvas[0] || ''
          });
        }
      }
      setUnidadesCasas(casasArray);

      setFotoFachada(condominioToEdit.fotoFachada || FOTOS_FACHADAS_SUGERIDAS[0]);
      setSenhaAdminGeral(condominioToEdit.senhaAdminGeral || '');
      setNomeSindico(condominioToEdit.nomeSindico || '');
      setEmailAdmin(condominioToEdit.emailAdmin || '');
      setTelefoneSindico(condominioToEdit.telefoneSindico || '');
      setModeloInicial(condominioToEdit.modeloInicial || 'limpo');
      setStatus(condominioToEdit.status || 'ativo');
    } else {
      setNome('');
      setSlug('');
      setEndereco('');
      setCidade('');
      setEstado('');
      setTipoCondominio('apartamentos');
      setTotalUnidades(32);
      setTotalBlocos(1);
      setTotalAndares('');
      setPadraoPrimeiroAndar('');
      setRuas([]);
      setNovaRuaInput('');
      setUnidadesCasas(Array.from({ length: 32 }, (_, i) => ({ numero: String(i + 1), rua: '' })));
      setFotoFachada('');
      setSenhaAdminGeral('');
      setNomeSindico('');
      setEmailAdmin('');
      setTelefoneSindico('');
      setModeloInicial('limpo');
      setStatus('ativo');
    }
    setErroMsg('');
  }, [condominioToEdit, isOpen]);

  // Atualiza quantidade de unidades para casas quando o usuário altera o número
  const handleTotalUnidadesChange = (novoTotal: number) => {
    const qty = Math.max(1, Math.min(1000, novoTotal));
    setTotalUnidades(qty);
    setUnidadesCasas(prev => {
      const next = [...prev];
      if (next.length < qty) {
        for (let i = next.length; i < qty; i++) {
          next.push({
            numero: String(i + 1),
            rua: ruas[0] || ''
          });
        }
      } else if (next.length > qty) {
        return next.slice(0, qty);
      }
      return next;
    });
  };

  // Adicionar rua ao pressionar Enter ou clicar
  const handleAdicionarRua = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const nomeLimpo = novaRuaInput.trim();
    if (!nomeLimpo) return;

    if (ruas.some(r => r.toLowerCase() === nomeLimpo.toLowerCase())) {
      setErroMsg(`A rua "${nomeLimpo}" já está cadastrada.`);
      return;
    }

    const novasRuas = [...ruas, nomeLimpo];
    setRuas(novasRuas);
    setNovaRuaInput('');
    setErroMsg('');

    // Se for a primeira rua, pré-seleciona para as casas que estão sem rua
    if (novasRuas.length === 1) {
      setUnidadesCasas(prev => prev.map(casa => ({
        ...casa,
        rua: casa.rua || nomeLimpo
      })));
    }
  };

  const handleRemoverRua = (ruaParaRemover: string) => {
    setRuas(prev => prev.filter(r => r !== ruaParaRemover));
  };

  const handleUpdateCasa = (index: number, campo: 'numero' | 'rua', valor: string) => {
    setUnidadesCasas(prev => {
      const clone = [...prev];
      if (clone[index]) {
        clone[index] = { ...clone[index], [campo]: valor };
      }
      return clone;
    });
  };

  const handleAplicarRuaEmMassa = (ruaEscolhida: string) => {
    if (!ruaEscolhida) return;
    setUnidadesCasas(prev => prev.map(c => ({ ...c, rua: ruaEscolhida })));
  };

  const handleNumeracaoSequencialCasas = () => {
    setUnidadesCasas(prev => prev.map((c, i) => ({ ...c, numero: String(i + 1) })));
  };

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

    if (tipoCondominio === 'casas' && ruas.length === 0) {
      setErroMsg('Por favor, cadastre pelo menos uma rua ou alameda para o condomínio de casas.');
      return;
    }

    const numAndares = typeof totalAndares === 'number' && totalAndares > 0 ? totalAndares : undefined;

    if (isEditing && condominioToEdit) {
      editarCondominio(
        condominioToEdit.id, 
        {
          nome: nome.trim(),
          slug: slug.trim(),
          tipoCondominio,
          ruas: tipoCondominio === 'casas' ? ruas : undefined,
          endereco: endereco.trim(),
          cidade: cidade.trim(),
          estado: estado.trim(),
          totalUnidades: Number(totalUnidades) || 16,
          totalBlocos: tipoCondominio === 'casas' ? ruas.length || 1 : (Number(totalBlocos) || 1),
          totalAndares: tipoCondominio === 'casas' ? undefined : numAndares,
          padraoPrimeiroAndar: tipoCondominio === 'casas' ? undefined : (padraoPrimeiroAndar.trim() || undefined),
          fotoFachada: fotoFachada.trim(),
          senhaAdminGeral: senhaAdminGeral.trim(),
          nomeSindico: nomeSindico.trim() || undefined,
          emailAdmin: emailAdmin.trim() || undefined,
          telefoneSindico: telefoneSindico.trim() || undefined,
          status
        },
        tipoCondominio === 'casas' ? unidadesCasas : undefined
      );
    } else {
      adicionarCondominio(
        {
          nome: nome.trim(),
          slug: slug.trim(),
          tipoCondominio,
          ruas: tipoCondominio === 'casas' ? ruas : undefined,
          endereco: endereco.trim() || 'Endereço não informado',
          cidade: cidade.trim() || 'São Paulo',
          estado: estado.trim() || 'SP',
          totalUnidades: Number(totalUnidades) || 16,
          totalBlocos: tipoCondominio === 'casas' ? ruas.length || 1 : (Number(totalBlocos) || 1),
          totalAndares: tipoCondominio === 'casas' ? undefined : numAndares,
          padraoPrimeiroAndar: tipoCondominio === 'casas' ? undefined : (padraoPrimeiroAndar.trim() || undefined),
          fotoFachada: fotoFachada.trim() || FOTOS_FACHADAS_SUGERIDAS[0],
          senhaAdminGeral: senhaAdminGeral.trim() || 'admin',
          nomeSindico: nomeSindico.trim() || undefined,
          emailAdmin: emailAdmin.trim() || undefined,
          telefoneSindico: telefoneSindico.trim() || undefined,
          modeloInicial,
          status: 'ativo'
        },
        tipoCondominio === 'casas' ? unidadesCasas : undefined
      );
    }

    onClose();
  };

  return createPortal(
    <div className="modal-overlay-safe bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="modal-content-safe bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
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
                placeholder="Ex: Residencial Jardim Paulista, Edifício Aurora, Condomínio Quinta da Boa Vista..."
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

          {/* ========================================================================= */}
          {/* TIPO DE CONDOMÍNIO (SELECT RADIO BUTTONS: APARTAMENTOS VS CASAS) */}
          {/* ========================================================================= */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border-2 border-amber-500/40 shadow-inner">
            <label className="text-[11px] font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Tipo de Empreendimento / Condomínio *:
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opção 1: Condomínio de Apartamentos */}
              <label
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                  tipoCondominio === 'apartamentos'
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/20 text-white shadow-md'
                    : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="tipoCondominio"
                  value="apartamentos"
                  checked={tipoCondominio === 'apartamentos'}
                  onChange={() => setTipoCondominio('apartamentos')}
                  className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${tipoCondominio === 'apartamentos' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs font-black text-white">Condomínio de Apartamentos</strong>
                    <span className="text-[10px] text-slate-400">Edifícios verticais, blocos e andares</span>
                  </div>
                </div>
              </label>

              {/* Opção 2: Condomínio de Casas */}
              <label
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                  tipoCondominio === 'casas'
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/20 text-white shadow-md'
                    : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <input
                  type="radio"
                  name="tipoCondominio"
                  value="casas"
                  checked={tipoCondominio === 'casas'}
                  onChange={() => setTipoCondominio('casas')}
                  className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${tipoCondominio === 'casas' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs font-black text-white">Condomínio de Casas</strong>
                    <span className="text-[10px] text-slate-400">Condomínio fechado horizontal, ruas e alamedas</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CONDICIONAL: SE FOR CONDOMÍNIO DE APARTAMENTOS */}
          {/* ========================================================================= */}
          {tipoCondominio === 'apartamentos' && (
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" /> Total de Unidades:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={totalUnidades}
                    onChange={(e) => setTotalUnidades(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase text-slate-300">
                    Total de Blocos:
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

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" /> Total de Andares:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Ex: 12 (opcional)"
                    value={totalAndares}
                    onChange={(e) => setTotalAndares(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              {/* Padrão do 1º Andar (Aparece se totalAndares for informado) */}
              {typeof totalAndares === 'number' && totalAndares > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
                  <label className="text-[11px] font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Padrão de Apartamentos do 1º Andar:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 11, 12, 13  OU  01 02 04 05 07 08"
                    value={padraoPrimeiroAndar}
                    onChange={(e) => setPadraoPrimeiroAndar(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2 text-amber-300 font-mono font-bold text-sm"
                  />
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-slate-300 leading-relaxed space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Gerador automático de numeração por andares ativado!
                    </p>
                    <p>
                      Se o 1º andar tiver os APs <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">11 12 13</code>, os andares seguintes gerarão automaticamente <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">21 22 23</code> (2º andar), <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">31 32 33</code> (3º andar)... até o total de <strong>{totalUnidades} APs</strong>.
                    </p>
                    <p className="text-slate-400">
                      O último andar será truncado com o saldo exato restante. As senhas padrão serão réplicas dos APs e as vagas ficarão em branco.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* CONDICIONAL: SE FOR CONDOMÍNIO DE CASAS */}
          {/* ========================================================================= */}
          {tipoCondominio === 'casas' && (
            <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 animate-in fade-in duration-200">
              
              {/* Topo: Total de Unidades + Cadastro Prévio de Ruas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                
                {/* 1. Total de Unidades */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-400" /> Total de Unidades (Casas):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    placeholder="Ex: 400"
                    value={totalUnidades}
                    onChange={(e) => handleTotalUnidadesChange(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-black text-sm focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Gera exatamente {totalUnidades} linhas de cadastro na lista abaixo.
                  </span>
                </div>

                {/* 2. Cadastre previamente o nome das ruas */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Cadastre previamente o nome das ruas:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Ex: Alameda dos Ipês, Rua 1, Rua das Flores..."
                      value={novaRuaInput}
                      onChange={(e) => setNovaRuaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAdicionarRua();
                        }
                      }}
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-amber-400 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdicionarRua()}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1"
                      title="Adicionar Rua à Lista (ou dê Enter)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Digite o nome da rua e pressione <b>Enter</b> para incluir no select das casas.
                  </span>
                </div>

              </div>

              {/* Lista de Ruas Cadastradas (Pills / Badges) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Ruas / Alamedas Cadastradas ({ruas.length}):
                  </span>
                  {ruas.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ✓ Disponíveis no select das casas
                    </span>
                  )}
                </div>

                {ruas.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Nenhuma rua cadastrada ainda. Digite o nome acima e pressione Enter para compor o select das casas.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1">
                    {ruas.map((ruaItem, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs"
                      >
                        <span>{ruaItem}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoverRua(ruaItem)}
                          className="hover:text-rose-400 transition-colors p-0.5 rounded cursor-pointer"
                          title={`Remover ${ruaItem}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* JANELA ESCROLÁVEL DE UNIDADES (EX: 400 LINHAS) */}
              {/* ========================================================================= */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] font-black uppercase text-white">
                      Mapeamento das {totalUnidades} Casas ({unidadesCasas.length} linhas geradas)
                    </span>
                  </div>

                  {/* Ações em Massa / Facilidades para o Dev */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ruas.length > 0 && (
                      <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium">Aplicar rua a todas:</span>
                        <select
                          value={ruaMassaSelecionada}
                          onChange={(e) => {
                            setRuaMassaSelecionada(e.target.value);
                            handleAplicarRuaEmMassa(e.target.value);
                          }}
                          className="bg-slate-900 border border-slate-700 text-amber-300 text-[10px] font-bold rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="">Selecione...</option>
                          {ruas.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleNumeracaoSequencialCasas}
                      className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold transition-all cursor-pointer"
                      title="Preenche os números de 1 até o total sequencialmente"
                    >
                      1 a {totalUnidades}
                    </button>
                  </div>
                </div>

                {/* Tabela / Grid Escrolável com Header Fixo */}
                <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950/80 shadow-inner">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-950 border-b border-slate-800 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider sticky top-0 z-10 select-none">
                    <div className="col-span-2 text-center">Unidade</div>
                    <div className="col-span-4">Número da Casa *</div>
                    <div className="col-span-6">Rua / Alameda Selecionada *</div>
                  </div>

                  {/* Linhas Escroláveis */}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60 p-1">
                    {unidadesCasas.map((casa, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 p-1.5 items-center hover:bg-slate-800/40 transition-colors rounded-xl"
                      >
                        {/* 1. Identificador de Linha */}
                        <div className="col-span-2 text-center">
                          <span className="text-[10px] font-black text-amber-400/80 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 inline-block min-w-[36px]">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* 2. Campo de Número */}
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={casa.numero}
                            onChange={(e) => handleUpdateCasa(idx, 'numero', e.target.value)}
                            placeholder={`Ex: ${idx + 1}`}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                          />
                        </div>

                        {/* 3. Select com as Ruas Cadastradas */}
                        <div className="col-span-6">
                          <select
                            value={casa.rua}
                            onChange={(e) => handleUpdateCasa(idx, 'rua', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-amber-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
                          >
                            <option value="" className="text-slate-500">Selecione a rua...</option>
                            {ruas.map((r, rIdx) => (
                              <option key={rIdx} value={r} className="text-white bg-slate-900">
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Total de unidades configuradas: <b>{unidadesCasas.length}</b></span>
                  <span>Ruas no select: <b>{ruas.length}</b></span>
                </div>
              </div>

            </div>
          )}

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
