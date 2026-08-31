import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { PorteReparo, CategoriaReparo, StatusReparo, Reparo } from '../types';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Image as ImageIcon, 
  ChevronRight,
  Plus,
  Send,
  Upload,
  Search,
  CheckCircle,
  Sparkles,
  Layers,
  ThumbsUp,
  MessageSquare,
  User,
  EyeOff,
  Lock,
  Zap,
  Filter,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { BudgetComparator } from '../components/reparos/BudgetComparator';
import { TimelineView } from '../components/reparos/TimelineView';

export const ReparosScreen: React.FC = () => {
  const { 
    reparos, 
    currentUser, 
    adicionarReparo,
    apoiarReparo,
    adicionarComentarioReparo,
    atualizarStatusReparo,
    resolverReparoSimples,
    excluirReparo,
    setCurrentScreen,
    isAdminLoggedIn
  } = useCondo();

  // Accordion Expand State
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [porte, setPorte] = useState<PorteReparo>('Pequeno');
  const [categoria, setCategoria] = useState<CategoriaReparo>('Hall / Corredor');
  const [anexoFile, setAnexoFile] = useState<File | null>(null);

  // Filters State
  const [filterPorte, setFilterPorte] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [filterResident, setFilterResident] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  // Comment inputs
  const [cardCommentsInput, setCardCommentsInput] = useState<Record<string, string>>({});

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico' || Boolean(isAdminLoggedIn);
  const userIdentifier = currentUser?.id || currentUser?.unidade || '';

  const userDisplayUnidade = currentUser?.unidade 
    ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`)
    : (currentUser?.role !== 'morador' ? 'Administração' : 'Morador');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const checkIsOwner = (rep: Reparo) => {
    if (isAdmin) return true;
    const userUnidade = currentUser.unidade ? currentUser.unidade.replace(/[^0-9]/g, '') : '';
    const repUnidade = rep.solicitanteUnidade ? rep.solicitanteUnidade.replace(/[^0-9]/g, '') : '';
    return (
      (userUnidade && repUnidade && userUnidade === repUnidade) ||
      (currentUser.nome && rep.solicitanteNome.toLowerCase().includes(currentUser.nome.toLowerCase()))
    );
  };

  const handleDeleteReparo = (id: string, titulo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a solicitação de reparo "${titulo}"?`)) {
      excluirReparo(id);
      if (expandedId === id) setExpandedId(null);
    }
  };

  const categoriasOptions: CategoriaReparo[] = [
    'Pintura',
    'Elevador',
    'Garagem',
    'Escadas',
    'Academia',
    'Churrasqueira',
    'Quadra',
    'Salão de Festas',
    'Hall / Corredor',
    'Inter-Apartamentos',
    'Outros'
  ];

  const portesOptions: { label: PorteReparo; desc: string; color: string }[] = [
    { label: 'Pequeno', desc: 'Lâmpadas, maçanetas, molas, porta torta, torneiras', color: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-950' },
    { label: 'Médio', desc: 'Portões, pintura de setor, pisos, alvenaria pontual', color: 'border-amber-400/50 bg-amber-500/10 text-amber-950' },
    { label: 'Grande', desc: 'Elevadores, impermeabilização, estrutura, fachada', color: 'border-rose-400/50 bg-rose-500/10 text-rose-950' }
  ];

  const statusOptions: StatusReparo[] = [
    'Solicitado', 
    'Em análise', 
    'Buscando Orçamento', 
    'Análise de Orçamento', 
    'Orçamento Contratado', 
    'Em Execução', 
    'Resolvido', 
    'Cancelado'
  ];

  const handleSubmitReparo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    if (anexoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const isVideo = anexoFile.type.startsWith('video');
        adicionarReparo(titulo, descricao, porte, categoria, result, isVideo ? 'video' : 'imagem');
      };
      reader.readAsDataURL(anexoFile);
    } else {
      adicionarReparo(titulo, descricao, porte, categoria);
    }

    setTitulo('');
    setDescricao('');
    setAnexoFile(null);
    const fileInput = document.getElementById('reparo-anexo-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSendCardComentario = (e: React.FormEvent, repId: string) => {
    e.preventDefault();
    const text = cardCommentsInput[repId];
    if (!text?.trim()) return;
    adicionarComentarioReparo(repId, text.trim());
    setCardCommentsInput(prev => ({ ...prev, [repId]: '' }));
  };

  // Date formatting for comparison
  let formattedFilterDate = '';
  if (filterDate) {
    const [year, month, day] = filterDate.split('-');
    formattedFilterDate = `${day}/${month}/${year}`;
  }

  // Filtering Logic
  const filteredReparos = reparos.filter((rep) => {
    const matchesPorte = filterPorte === 'Todos' || rep.porte === filterPorte;
    const matchesCat = filterCategoria === 'Todas' || rep.categoria === filterCategoria;
    const matchesStatus = filterStatus === 'Todos' || rep.status === filterStatus;
    const matchesDate = !filterDate || rep.dataSolicitacao === formattedFilterDate;
    const matchesResident = !filterResident || 
      rep.solicitanteNome.toLowerCase().includes(filterResident.toLowerCase()) || 
      rep.solicitanteUnidade.toLowerCase().includes(filterResident.toLowerCase()) ||
      rep.titulo.toLowerCase().includes(filterResident.toLowerCase()) ||
      rep.descricao.toLowerCase().includes(filterResident.toLowerCase());

    return matchesPorte && matchesCat && matchesStatus && matchesDate && matchesResident;
  });

  const getPorteBadgeStyle = (p: PorteReparo) => {
    switch (p) {
      case 'Pequeno':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Médio':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Grande':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <Wrench className="w-5 h-5 text-amber-400" />
            Reparos, Manutenções & Obras
          </h2>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            Solicitações de consertos prediais, infraestrutura física, cotações e controle de obras.
          </p>
        </div>
      </div>

      {/* 1. Form: Solicitar Novo Reparo */}
      <div className="bg-white/45 border border-white/60 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 w-full max-w-full box-border overflow-hidden backdrop-blur-xs">
        <div className="flex items-center gap-2 text-slate-950 border-b border-white/60 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-400/40 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-950">
              Solicitar Novo Reparo ou Manutenção
            </h3>
            <p className="text-[11px] text-slate-800 font-medium">
              Relate avarias físicas, lâmpadas queimadas, vazamentos ou solicitações de infraestrutura
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitReparo} className="space-y-3.5 w-full max-w-full">
          
          {/* Step 1: Escolha o Porte / Tamanho do Reparo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-800" /> 1. Tamanho do Reparo (Porte)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {portesOptions.map((item) => {
                const isSelected = porte === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setPorte(item.label)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400/50 scale-102'
                        : 'bg-white/70 hover:bg-white border-white/90 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs">{item.label} Reparo</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <span className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Step 2: Categoria / Dependência */}
            <div className="space-y-1 min-w-0 w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                2. Dependência / Local Afetado
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaReparo)}
                className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white font-semibold shadow-xs"
              >
                {categoriasOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1 min-w-0 w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                3. Título do Reparo
              </label>
              <input
                type="text"
                placeholder="Ex: Troca de lâmpada do hall, ajuste da porta da academia..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
              4. Descrição do Problema & Detalhes
            </label>
            <textarea
              placeholder="Descreva o que precisa ser consertado, andar/local exato, urgência e impacto para os moradores..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs resize-none"
              required
            />
          </div>

          {/* File Upload Attachment (Image or Video) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 w-full">
            <div className="relative w-full sm:w-auto">
              <input
                type="file"
                id="reparo-anexo-input"
                accept="image/*,video/*"
                onChange={(e) => setAnexoFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="reparo-anexo-input"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/80 hover:bg-white border border-white/90 rounded-xl text-[11px] text-slate-950 font-extrabold cursor-pointer shadow-sm transition-all active:scale-95 w-full sm:w-auto text-center truncate"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span className="truncate">{anexoFile ? `Anexo: ${anexoFile.name}` : 'Anexar Foto ou Vídeo da Avaria'}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Abrir Solicitação de Reparo</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Filters Row */}
      <div className="space-y-3 w-full max-w-full">
        
        {/* Porte Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          <span className="text-[10px] font-extrabold uppercase text-white drop-shadow whitespace-nowrap pl-1">
            Porte:
          </span>
          {['Todos', 'Pequeno', 'Médio', 'Grande'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPorte(p)}
              className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterPorte === p
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          <span className="text-[10px] font-extrabold uppercase text-white drop-shadow whitespace-nowrap pl-1">
            Status:
          </span>
          {['Todos', 'Solicitado', 'Em análise', 'Buscando Orçamento', 'Análise de Orçamento', 'Orçamento Contratado', 'Em Execução', 'Resolvido'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Categories / Dependencies Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          <span className="text-[10px] font-extrabold uppercase text-white drop-shadow whitespace-nowrap pl-1">
            Dependência:
          </span>
          {['Todas', ...categoriasOptions].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategoria(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterCategoria === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date and Resident / Title Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/30 border border-white/40 p-3 rounded-2xl shadow-sm w-full max-w-full box-border">
          <div className="relative min-w-0 w-full">
            <input
              type="text"
              placeholder="Buscar por morador, local, título ou problema..."
              value={filterResident}
              onChange={(e) => setFilterResident(e.target.value)}
              className="w-full max-w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.8 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="relative min-w-0 w-full">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full max-w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.8 pl-9 text-xs text-slate-900 focus:outline-none focus:bg-white font-semibold"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

      </div>

      {/* Lista de Reparos & Manutenções (Cards Curtos Expansíveis com Animação Fluida) */}
      <div className="space-y-3 w-full max-w-full">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            LISTA DE REPAROS & MANUTENÇÕES ({filteredReparos.length})
          </span>
        </div>

        {filteredReparos.length === 0 ? (
          <div className="p-8 text-center bg-white/40 border border-white/60 rounded-3xl space-y-2">
            <Wrench className="w-8 h-8 text-amber-700 mx-auto" />
            <p className="text-sm font-black text-slate-950">Nenhum reparo encontrado no momento.</p>
            <p className="text-xs text-slate-700 font-medium">Tente ajustar os filtros acima ou solicite um novo reparo.</p>
          </div>
        ) : (
          filteredReparos.map((rep) => {
            const isExpanded = expandedId === rep.id;
            const isApoiado = (rep.apoiadores && userIdentifier ? rep.apoiadores.includes(userIdentifier) : false) || Boolean(rep.apoiadoPeloUsuario);
            const isOwner = checkIsOwner(rep);
            const comentariosCount = rep.comentarios?.length || 0;

            return (
              <div 
                key={rep.id}
                className={`bg-white/45 border-2 rounded-3xl overflow-hidden shadow-xl hover:bg-white/50 transition-all duration-300 backdrop-blur-xs ${
                  isExpanded ? 'border-amber-400/90 ring-2 ring-amber-400/20' : 'border-white/60'
                }`}
              >
                {/* Header section (Always visible) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(rep.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer select-none"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase shadow-2xs ${getPorteBadgeStyle(rep.porte)}`}>
                        {rep.porte}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20">
                        {rep.categoria}
                      </span>
                      <StatusBadge status={rep.status} />
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
                      {rep.titulo}
                    </h3>

                    <p className="text-[10px] text-amber-950 font-bold flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-indigo-700" />
                        {rep.solicitanteNome} • {rep.solicitanteUnidade}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-800" />
                        {rep.dataSolicitacao}
                      </span>
                      {rep.valorFinal && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-lg font-black text-[10px] whitespace-nowrap">
                            R$ {rep.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão de Apoios no Header */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        apoiarReparo(rep.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-2xs active:scale-90 cursor-pointer ${
                        isApoiado
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 font-black scale-105'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                      }`}
                      title={isApoiado ? "Você apoiou este reparo (clique para remover apoio)" : "Clique para apoiar a urgência deste reparo"}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : 'text-amber-800'}`} />
                      <span>{rep.apoiosCount || 0}</span>
                    </div>

                    {/* Botão Contador de Comentários */}
                    <div 
                      className="px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 border border-white/90 bg-white/80 text-slate-800 shadow-2xs"
                      title={`${comentariosCount} comentários`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{comentariosCount}</span>
                    </div>

                    {/* Botão Excluir (Dono / Admin) */}
                    {isOwner && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteReparo(rep.id, rep.titulo, e)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-rose-100 text-rose-600 border border-white/90 shadow-2xs hover:text-rose-800 transition-all cursor-pointer"
                          title="Excluir solicitação de reparo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Botão Chevron com rotação animada */}
                    <div className="p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                  </div>
                </button>

                {/* Expandable Section com Animação Suave Grid */}
                <div 
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-4 pb-4 space-y-3.5 border-t border-slate-950/10 pt-3">
                      
                      {/* Descrição Detalhada */}
                      <div className="bg-white/60 p-4 rounded-2xl border border-white/80 text-xs text-slate-900 leading-relaxed font-semibold space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                          Descrição do Problema & Impacto:
                        </span>
                        <p>{rep.descricao}</p>

                        {/* Anexo Enviado (Imagem ou Vídeo) */}
                        {rep.anexoUrl && (
                          <div className="mt-3 pt-2.5 border-t border-slate-900/10">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                              Evidência / Anexo Enviado:
                            </span>
                            {rep.anexoTipo === 'video' ? (
                              <video
                                src={rep.anexoUrl}
                                controls
                                className="w-full max-h-72 rounded-xl border border-slate-300 bg-black/10 object-contain shadow-sm"
                              />
                            ) : (
                              <img
                                src={rep.anexoUrl}
                                alt="Anexo do Reparo"
                                className="w-full max-h-72 rounded-xl border border-slate-300 bg-slate-100 object-cover shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => window.open(rep.anexoUrl, '_blank')}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Fotos de Evidências Antes & Depois */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-sky-700" />
                          Evidências do Serviço (Fotos Antes & Conclusão)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="relative rounded-2xl overflow-hidden border border-white/80 h-36 group shadow-md bg-slate-900">
                            <img
                              src={rep.fotosAntes[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'}
                              alt="Antes do reparo"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-end p-2.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
                                Problema Constatado
                              </span>
                            </div>
                          </div>

                          <div className="relative rounded-2xl overflow-hidden border border-white/80 h-36 group shadow-md bg-slate-900">
                            <img
                              src={rep.fotosDepois?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                              alt="Depois do reparo"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-end p-2.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                                {rep.status === 'Resolvido' || rep.status === 'Executado' || rep.status === 'Confirmado' ? 'Serviço Concluído ✓' : 'Previsão de Entrega'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comparador de 3 Orçamentos (se houver cotações) */}
                      {rep.orcamentos && rep.orcamentos.length > 0 && (
                        <BudgetComparator
                          reparoId={rep.id}
                          orcamentos={rep.orcamentos}
                        />
                      )}

                      {/* Linha do Tempo de Evolução */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-700" />
                          Linha do Tempo de Evolução ({rep.timeline?.length || 0} etapas)
                        </span>

                        <TimelineView steps={rep.timeline || []} />
                      </div>

                      {/* Card de Apoios / Urgência */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-white/80 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                            <ThumbsUp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-950 block">
                              {rep.apoiosCount || 0} moradores apoiam a prioridade deste reparo
                            </span>
                            <span className="text-[10px] text-slate-600 font-medium">
                              Ajuda a administração a mapear a urgência coletiva do problema
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => apoiarReparo(rep.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                            isApoiado
                              ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/30 scale-105'
                              : 'bg-white/80 hover:bg-amber-50 text-amber-950 border border-amber-400'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : ''}`} />
                          {isApoiado ? 'Apoiado ✓' : 'Apoiar Reparo'}
                        </button>
                      </div>

                      {/* Gestão da Administração (Alteração de Status e Resolução Rápida se for admin) */}
                      {isAdmin && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/60 space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-amber-700" /> Gestão da Ordem de Serviço (Administração)
                            </span>
                            
                            {rep.status !== 'Resolvido' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const obs = prompt('Observação de conclusão (Ex: Lâmpada trocada pela zeladoria):', 'Serviço pontual executado diretamente pela equipe interna.');
                                  if (obs !== null) {
                                    resolverReparoSimples(rep.id, obs);
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                                title="Para lâmpadas queimadas, portas tortas ou serviços rápidos sem necessidade de cotações"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>⚡ Resolver Reparo Direto (Simples)</span>
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {statusOptions.map((st) => (
                              <button
                                key={st}
                                onClick={() => atualizarStatusReparo(rep.id, st)}
                                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                                  rep.status === st
                                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md scale-105'
                                    : 'bg-white/60 text-slate-900 border-white/80 hover:bg-white/80'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Seção de Manifestações & Comentários */}
                      <div className="space-y-2.5 pt-1">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-indigo-700" />
                          Manifestações & Acompanhamento ({comentariosCount})
                        </h4>

                        {comentariosCount > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {rep.comentarios?.map((com) => {
                              const isModerado = Boolean(com.oculto);

                              return (
                                <div
                                  key={com.id}
                                  className={`p-3 rounded-2xl text-xs space-y-1.5 transition-all ${
                                    isModerado
                                      ? isAdmin
                                        ? 'bg-rose-50/80 border-2 border-rose-300'
                                        : 'bg-slate-100/80 border border-slate-200'
                                      : com.oficial
                                        ? 'bg-amber-500/20 border border-amber-400/50'
                                        : 'bg-white/60 border border-white/80'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className={`font-extrabold flex items-center gap-1.5 ${com.oficial ? 'text-amber-950' : 'text-slate-950'}`}>
                                        {com.oficial ? <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> : <User className="w-3.5 h-3.5 text-indigo-700" />}
                                        {com.autorNome}
                                        {com.autorUnidade && (
                                          <span className="text-slate-600 font-bold">({com.autorUnidade})</span>
                                        )}
                                      </span>

                                      {isModerado && (
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase flex items-center gap-1 border ${
                                          isAdmin
                                            ? 'bg-rose-200 text-rose-900 border-rose-300'
                                            : 'bg-slate-200 text-slate-700 border-slate-300'
                                        }`}>
                                          <EyeOff className="w-3 h-3 text-slate-500" />
                                          {isAdmin ? 'Ocultado ao Público' : 'Conteúdo Indisponível'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-slate-700 font-mono text-[10px] font-bold">{com.data}</span>
                                  </div>

                                  {isModerado && !isAdmin ? (
                                    <div className="pl-5 space-y-1">
                                      <p className="blur-[4px] select-none pointer-events-none text-slate-400 font-medium leading-relaxed">
                                        {com.texto}
                                      </p>
                                      <div className="p-2 rounded-xl bg-slate-200/60 border border-slate-300 text-[11px] text-slate-700 font-semibold flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                        <span>Este comentário foi moderado pela administração e está indisponível para visualização pública.</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-slate-900 leading-relaxed pl-5 font-semibold">{com.texto}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Formulário de Adicionar Comentário no Card */}
                        <form onSubmit={(e) => handleSendCardComentario(e, rep.id)} className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder={isAdmin ? "Escrever parecer técnico ou posicionamento..." : `Comentar ou manifestar apoio como ${userDisplayUnidade}...`}
                            value={cardCommentsInput[rep.id] || ''}
                            onChange={(e) => setCardCommentsInput(prev => ({ ...prev, [rep.id]: e.target.value }))}
                            className="flex-1 bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white font-semibold shadow-xs"
                          />
                          <button
                            type="submit"
                            disabled={!cardCommentsInput[rep.id]?.trim()}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Enviar
                          </button>
                        </form>
                      </div>

                      {/* Link to Prestação de Contas */}
                      <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-900">
                          Gasto de <strong className="text-emerald-800 font-extrabold">{rep.valorFinal ? `R$ ${rep.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Cotação em andamento'}</strong> registrado na Prestação de Contas.
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentScreen('prestacao-contas')}
                          className="text-indigo-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Consultar Contas <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

