import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { PorteReparo, CategoriaReparo, StatusReparo } from '../types';
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
  Filter
} from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { BudgetComparator } from '../components/reparos/BudgetComparator';
import { TimelineView } from '../components/reparos/TimelineView';

export const ReparosScreen: React.FC = () => {
  const { 
    reparos, 
    currentUser, 
    selectedReparoId, 
    setSelectedReparoId, 
    adicionarReparo,
    apoiarReparo,
    adicionarComentarioReparo,
    atualizarStatusReparo,
    resolverReparoSimples,
    setCurrentScreen
  } = useCondo();

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

  // Comment inputs & expansion
  const [novoComentarioTexto, setNovoComentarioTexto] = useState<string>('');
  const [cardCommentsInput, setCardCommentsInput] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const selectedReparo = reparos.find(r => r.id === selectedReparoId) || reparos[0];
  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  const userIdentifier = currentUser?.id || currentUser?.unidade || '';
  const selectedReparoApoiado = selectedReparo 
    ? ((selectedReparo.apoiadores && userIdentifier ? selectedReparo.apoiadores.includes(userIdentifier) : false) || Boolean(selectedReparo.apoiadoPeloUsuario))
    : false;

  const userDisplayUnidade = currentUser?.unidade 
    ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`)
    : (currentUser?.role !== 'morador' ? 'Administração' : 'Morador');

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

  const handleSendDetailComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentarioTexto.trim() || !selectedReparo) return;
    adicionarComentarioReparo(selectedReparo.id, novoComentarioTexto.trim());
    setNovoComentarioTexto('');
  };

  const handleSendCardComentario = (e: React.FormEvent, repId: string) => {
    e.preventDefault();
    const text = cardCommentsInput[repId];
    if (!text?.trim()) return;
    adicionarComentarioReparo(repId, text.trim());
    setCardCommentsInput(prev => ({ ...prev, [repId]: '' }));
    setExpandedComments(prev => ({ ...prev, [repId]: true }));
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
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
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

      {/* Grid Layout: Lista à esquerda e Detalhes à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full max-w-full">
        
        {/* Left Column: Repairs List */}
        <div className="lg:col-span-5 space-y-3 w-full max-w-full min-w-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Lista de Reparos & Manutenções ({filteredReparos.length})
          </span>

          {filteredReparos.length === 0 ? (
            <div className="p-5 text-center bg-white/30 rounded-3xl border border-white/40 text-xs font-semibold text-slate-800 w-full">
              Nenhum reparo encontrado com os filtros selecionados.
            </div>
          ) : (
            filteredReparos.map((rep) => {
              const isSelected = rep.id === selectedReparoId;
              const isApoiado = (rep.apoiadores && userIdentifier ? rep.apoiadores.includes(userIdentifier) : false) || Boolean(rep.apoiadoPeloUsuario);
              const comentariosCount = rep.comentarios?.length || 0;
              const isCommentsExpanded = Boolean(expandedComments[rep.id]);

              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReparoId(rep.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-lg space-y-2.5 ${
                    isSelected
                      ? 'bg-white/65 border-amber-400 ring-2 ring-amber-400/30 scale-102'
                      : 'bg-white/45 border-white/60 hover:bg-white/55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${getPorteBadgeStyle(rep.porte)}`}>
                        {rep.porte}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20">
                        {rep.categoria}
                      </span>
                    </div>
                    <StatusBadge status={rep.status} />
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-950 leading-snug">
                    {rep.titulo}
                  </h3>

                  <p className="text-xs text-slate-800 line-clamp-2 font-medium">
                    {rep.descricao}
                  </p>

                  <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-xs text-slate-700">
                    <span className="text-[11px] text-slate-950 font-extrabold truncate max-w-[45%]">
                      {rep.solicitanteNome} • {rep.solicitanteUnidade}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Apoio Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          apoiarReparo(rep.id);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-2xs active:scale-90 cursor-pointer ${
                          isApoiado
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm border border-amber-400 font-black scale-105'
                            : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                        }`}
                        title={isApoiado ? "Você apoiou este reparo (clique para remover apoio)" : "Clique no joinha para apoiar a urgência deste reparo"}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : 'text-amber-800'}`} />
                        <span>{rep.apoiosCount || 0}</span>
                      </button>

                      {/* Comments Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedComments(prev => ({ ...prev, [rep.id]: !prev[rep.id] }));
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 border shadow-2xs cursor-pointer transition-all active:scale-95 ${
                          isCommentsExpanded
                            ? 'bg-indigo-700 text-white border-indigo-800'
                            : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                        }`}
                        title="Ver ou ocultar manifestações sobre o reparo"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{comentariosCount}</span>
                      </button>

                      {rep.valorFinal && (
                        <span className="text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-lg font-black text-[11px] whitespace-nowrap">
                          R$ {rep.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline quick comment input & drawer */}
                  <div 
                    className="pt-2 border-t border-slate-900/10 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <form 
                      onSubmit={(e) => handleSendCardComentario(e, rep.id)}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder={`Comentar ou apoiar como ${userDisplayUnidade}...`}
                        value={cardCommentsInput[rep.id] || ''}
                        onChange={(e) => setCardCommentsInput(prev => ({ ...prev, [rep.id]: e.target.value }))}
                        className="flex-1 bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={!cardCommentsInput[rep.id]?.trim()}
                        className="p-1.5 px-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Publicar comentário sobre este reparo"
                      >
                        <Send className="w-3 h-3" />
                        <span className="text-[11px] hidden sm:inline font-black">Enviar</span>
                      </button>
                    </form>

                    {isCommentsExpanded && rep.comentarios && rep.comentarios.length > 0 && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1 animate-in fade-in duration-200">
                        {rep.comentarios.map((com) => {
                          const isModerado = Boolean(com.oculto);

                          return (
                            <div
                              key={com.id}
                              className={`p-2.5 rounded-xl text-[11px] space-y-1 transition-all ${
                                isModerado
                                  ? isAdmin
                                    ? 'bg-rose-50/80 border border-rose-300'
                                    : 'bg-slate-100/70 border border-slate-200/90'
                                  : com.oficial
                                    ? 'bg-amber-500/20 border border-amber-400/50'
                                    : 'bg-white/70 border border-white/90 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`font-black flex items-center gap-1 ${com.oficial ? 'text-amber-950' : 'text-slate-950'}`}>
                                    {com.oficial ? <ShieldCheck className="w-3 h-3 text-amber-700" /> : <User className="w-3 h-3 text-indigo-700" />}
                                    {com.autorNome}
                                    {com.autorUnidade && (
                                      <span className="text-slate-600 font-bold">({com.autorUnidade})</span>
                                    )}
                                  </span>

                                  {isModerado && (
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase flex items-center gap-1 border ${
                                      isAdmin
                                        ? 'bg-rose-200 text-rose-900 border-rose-300'
                                        : 'bg-slate-200 text-slate-700 border-slate-300'
                                    }`}>
                                      <EyeOff className="w-2.5 h-2.5 text-slate-500" />
                                      {isAdmin ? 'Ocultado ao Público' : 'Conteúdo Indisponível'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-slate-500 font-mono text-[9px] font-semibold">{com.data}</span>
                              </div>

                              {isModerado && !isAdmin ? (
                                <div className="relative pl-4 space-y-1">
                                  <p className="blur-[3.5px] select-none pointer-events-none text-slate-400 font-medium leading-tight">
                                    {com.texto}
                                  </p>
                                  <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-slate-500" />
                                    Comentário moderado pela administração
                                  </span>
                                </div>
                              ) : (
                                <p className="text-slate-900 font-semibold pl-4 leading-tight">{com.texto}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Repair Detail Page */}
        {selectedReparo ? (
          <div className="lg:col-span-7 bg-white/45 border border-white/60 rounded-3xl p-5 space-y-5 shadow-xl">
            
            {/* Header Detail */}
            <div className="flex items-center justify-between border-b border-slate-900/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded border uppercase ${getPorteBadgeStyle(selectedReparo.porte)}`}>
                  {selectedReparo.porte} Reparo
                </span>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-amber-500/20 text-amber-950 border border-amber-400/40">
                  {selectedReparo.categoria}
                </span>
                <StatusBadge status={selectedReparo.status} />
              </div>
              <span className="text-[11px] text-slate-800 font-mono font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedReparo.dataSolicitacao}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-950 leading-tight">
                {selectedReparo.titulo}
              </h2>
              <p className="text-xs text-slate-700 mt-1 font-semibold">
                Solicitado por: <span className="text-slate-950 font-extrabold">{selectedReparo.solicitanteNome}</span> ({selectedReparo.solicitanteUnidade})
              </p>
            </div>

            {/* Description & Media Attachment */}
            <div className="bg-white/60 p-4 rounded-2xl border border-white/80 text-xs text-slate-900 leading-relaxed font-semibold">
              <p>{selectedReparo.descricao}</p>

              {selectedReparo.anexoUrl && (
                <div className="mt-3 pt-3 border-t border-slate-900/10">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Anexo / Evidência Enviada:
                  </span>
                  {selectedReparo.anexoTipo === 'video' ? (
                    <video
                      src={selectedReparo.anexoUrl}
                      controls
                      className="w-full max-h-64 rounded-xl border border-slate-300 bg-black/10 object-contain shadow-sm"
                    />
                  ) : (
                    <img
                      src={selectedReparo.anexoUrl}
                      alt="Anexo do Reparo"
                      className="w-full max-h-64 rounded-xl border border-slate-300 bg-slate-100 object-cover shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => window.open(selectedReparo.anexoUrl, '_blank')}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Apoios Summary / Interaction */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-white/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-950 block">
                    {selectedReparo.apoiosCount || 0} moradores apoiam a prioridade deste reparo
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">
                    Ajuda a administração a mapear a urgência coletiva do problema
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => apoiarReparo(selectedReparo.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                  selectedReparoApoiado
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/30 scale-105'
                    : 'bg-white/80 hover:bg-amber-50 text-amber-950 border border-amber-400'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${selectedReparoApoiado ? 'fill-slate-950 stroke-[2.5]' : ''}`} />
                {selectedReparoApoiado ? 'Apoiado ✓' : 'Apoiar Reparo'}
              </button>
            </div>

            {/* Admin Control Bar: Evolution of Repair Status */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/60 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Gestão da Ordem de Serviço (Administração)
                  </span>
                  
                  {/* Atalho de 1 clique para reparo simples */}
                  {selectedReparo.status !== 'Resolvido' && (
                    <button
                      type="button"
                      onClick={() => {
                        const obs = prompt('Observação de conclusão (Ex: Lâmpada trocada pela zeladoria):', 'Serviço pontual executado diretamente pela equipe interna.');
                        if (obs !== null) {
                          resolverReparoSimples(selectedReparo.id, obs);
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
                      onClick={() => atualizarStatusReparo(selectedReparo.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                        selectedReparo.status === st
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

            {/* Photos Before / After */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-700" />
                Evidências do Serviço (Fotos Antes & Conclusão)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/80 h-36 group shadow-md">
                  <img
                    src={selectedReparo.fotosAntes[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'}
                    alt="Antes do reparo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-end p-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
                      Problema Constatado
                    </span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/80 h-36 group shadow-md">
                  <img
                    src={selectedReparo.fotosDepois?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt="Depois do reparo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-end p-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                      {selectedReparo.status === 'Resolvido' || selectedReparo.status === 'Executado' || selectedReparo.status === 'Confirmado' ? 'Serviço Concluído ✓' : 'Previsão de Entrega'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Quotes Competitor Comparator (Orçamentos) - se houver */}
            {selectedReparo.orcamentos && selectedReparo.orcamentos.length > 0 && (
              <BudgetComparator
                reparoId={selectedReparo.id}
                orcamentos={selectedReparo.orcamentos}
              />
            )}

            {/* Timeline View */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-700" />
                Linha do Tempo de Evolução ({selectedReparo.timeline?.length || 0} etapas)
              </h4>

              <TimelineView steps={selectedReparo.timeline || []} />
            </div>

            {/* Comments & Manifestações Section */}
            <div className="space-y-3 pt-2 border-t border-slate-900/10">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-700" />
                Manifestações & Acompanhamento ({selectedReparo.comentarios?.length || 0})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {!selectedReparo.comentarios || selectedReparo.comentarios.length === 0 ? (
                  <p className="text-xs text-slate-600 italic p-3 bg-white/40 rounded-xl">
                    Nenhum comentário ou manifestação ainda. Seja o primeiro a comentar.
                  </p>
                ) : (
                  selectedReparo.comentarios.map((com) => {
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
                  })
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSendDetailComentario} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder={isAdmin ? "Escrever parecer técnico ou posicionamento da sindicância..." : `Escrever comentário como ${userDisplayUnidade}...`}
                  value={novoComentarioTexto}
                  onChange={(e) => setNovoComentarioTexto(e.target.value)}
                  className="flex-1 bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!novoComentarioTexto.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </form>
            </div>

            {/* Link to Accounts */}
            <div className="p-4 rounded-2xl bg-white/60 border border-white/80 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-900">
                Gasto de <strong className="text-emerald-800 font-extrabold">{selectedReparo.valorFinal ? `R$ ${selectedReparo.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Cotação em andamento'}</strong> registrado na Prestação de Contas.
              </span>
              <button
                onClick={() => setCurrentScreen('prestacao-contas')}
                className="text-indigo-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Consultar Contas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
