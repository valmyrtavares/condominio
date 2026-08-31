import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { 
  AlertTriangle, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Send,
  Upload,
  Calendar,
  Search,
  Plus,
  EyeOff,
  AlertCircle,
  Lock,
  ChevronDown,
  Clock,
  Trash2
} from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { CategoriaReclamacao, StatusReclamacao, Reclamacao } from '../types';

export const ReclamacoesScreen: React.FC = () => {
  const { 
    reclamacoes, 
    currentUser, 
    apoiarReclamacao, 
    adicionarComentario,
    adicionarReclamacao,
    atualizarStatusReclamacao,
    excluirReclamacao,
    isAdminLoggedIn
  } = useCondo();

  // Accordion Expand State
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterResident, setFilterResident] = useState<string>('');

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaReclamacao>('Barulho');
  const [anexoFile, setAnexoFile] = useState<File | null>(null);
  const [cardCommentsInput, setCardCommentsInput] = useState<Record<string, string>>({});

  const categories = [
    'Todas', 
    'Barulho', 
    'Limpeza', 
    'Segurança', 
    'Ameaça', 
    'Assédio', 
    'Animais Domésticos', 
    'Convivência / Regras', 
    'Outros'
  ];

  const statusOptions: StatusReclamacao[] = [
    'Recebida',
    'Em análise',
    'Em andamento',
    'Resolvida',
    'Encerrada'
  ];

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico' || Boolean(isAdminLoggedIn);
  const userIdentifier = currentUser?.id || currentUser?.unidade || '';

  const userDisplayUnidade = currentUser?.unidade 
    ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`)
    : (currentUser?.role !== 'morador' ? 'Administração' : 'Morador');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const checkIsOwner = (rec: Reclamacao) => {
    if (isAdmin) return true;
    const userUnidade = currentUser.unidade ? currentUser.unidade.replace(/[^0-9]/g, '') : '';
    const recUnidade = rec.autorUnidade ? rec.autorUnidade.replace(/[^0-9]/g, '') : '';
    return (
      (rec.autorId && rec.autorId === currentUser.id) ||
      (userUnidade && recUnidade && userUnidade === recUnidade) ||
      (currentUser.nome && rec.autorNome.toLowerCase().includes(currentUser.nome.toLowerCase()))
    );
  };

  const handleDeleteReclamacao = (id: string, titulo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a ocorrência "${titulo}"?`)) {
      excluirReclamacao(id);
      if (expandedId === id) setExpandedId(null);
    }
  };

  // Submit new Complaint
  const handleSubmitReclamacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    if (anexoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const isVideo = anexoFile.type.startsWith('video');
        adicionarReclamacao(titulo, descricao, categoria, result, isVideo ? 'video' : 'imagem');
      };
      reader.readAsDataURL(anexoFile);
    } else {
      adicionarReclamacao(titulo, descricao, categoria);
    }

    setTitulo('');
    setDescricao('');
    setAnexoFile(null);
    const fileInput = document.getElementById('anexo-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSendCardComentario = (e: React.FormEvent, recId: string) => {
    e.preventDefault();
    const text = cardCommentsInput[recId];
    if (!text?.trim()) return;
    adicionarComentario(recId, text.trim());
    setCardCommentsInput(prev => ({ ...prev, [recId]: '' }));
  };

  // Date formatting for comparison
  let formattedFilterDate = '';
  if (filterDate) {
    const [year, month, day] = filterDate.split('-');
    formattedFilterDate = `${day}/${month}/${year}`;
  }

  // Filtering Logic
  const filteredReclamacoes = reclamacoes.filter(r => {
    const matchesCategory = filterCategory === 'Todas' || r.categoria === filterCategory;
    const matchesDate = !filterDate || r.data === formattedFilterDate;
    const matchesResident = !filterResident || 
      r.autorNome.toLowerCase().includes(filterResident.toLowerCase()) || 
      r.autorUnidade.toLowerCase().includes(filterResident.toLowerCase()) ||
      r.titulo.toLowerCase().includes(filterResident.toLowerCase()) ||
      r.descricao.toLowerCase().includes(filterResident.toLowerCase());
    return matchesCategory && matchesDate && matchesResident;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Form: Faça uma Reclamação */}
      <div className="bg-white/40 border border-white/60 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4 backdrop-blur-xs w-full max-w-full box-border">
        <div className="flex items-center justify-between border-b border-white/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-400/40 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-950">
                Registrar Ocorrência / Reclamação
              </h3>
              <p className="text-[11px] text-slate-800 font-medium">
                Notifique a administração ou relate um problema de convivência
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitReclamacao} className="space-y-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <div className="space-y-1 min-w-0 md:col-span-2 w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">Título da Ocorrência</label>
              <input
                type="text"
                placeholder="Ex: Barulho excessivo no 4º andar após 23h..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                required
              />
            </div>

            <div className="space-y-1 min-w-0 w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaReclamacao)}
                className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white font-semibold shadow-xs"
              >
                {categories.filter(c => c !== 'Todas').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">Descrição Detalhada</label>
            <textarea
              placeholder="Descreva a ocorrência com detalhes (local, horário aproximado, relato do ocorrido)..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 w-full">
            <div className="relative w-full sm:w-auto">
              <input
                type="file"
                id="anexo-file-input"
                accept="image/*,video/*"
                onChange={(e) => setAnexoFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="anexo-file-input"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/80 hover:bg-white border border-white/90 rounded-xl text-[11px] text-slate-950 font-extrabold cursor-pointer shadow-sm transition-all active:scale-95 w-full sm:w-auto text-center truncate"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span className="truncate">{anexoFile ? `Anexado: ${anexoFile.name}` : 'Anexar Imagem ou Vídeo'}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Publicar Ocorrência</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Filters Row */}
      <div className="space-y-3 w-full max-w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/30 border border-white/40 p-3 rounded-2xl shadow-sm w-full max-w-full box-border">
          <div className="relative min-w-0 w-full">
            <input
              type="text"
              placeholder="Filtrar por morador, apt ou título..."
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

      {/* Lista de Ocorrências (Cards Curtos Expansíveis com Animação Fluida) */}
      <div className="space-y-3 w-full max-w-full">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            LISTA DE OCORRÊNCIAS ({filteredReclamacoes.length})
          </span>
        </div>

        {filteredReclamacoes.length === 0 ? (
          <div className="p-8 text-center bg-white/40 border border-white/60 rounded-3xl space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-700 mx-auto" />
            <p className="text-sm font-black text-slate-950">Nenhuma ocorrência encontrada no momento.</p>
            <p className="text-xs text-slate-700 font-medium">Tente ajustar os filtros acima ou registre uma nova ocorrência.</p>
          </div>
        ) : (
          filteredReclamacoes.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const isApoiado = (rec.apoiadores && userIdentifier ? rec.apoiadores.includes(userIdentifier) : false) || Boolean(rec.apoiadoPeloUsuario);
            const isOwner = checkIsOwner(rec);
            const comentariosCount = rec.comentarios?.length || 0;

            return (
              <div 
                key={rec.id}
                className={`bg-white/45 border-2 rounded-3xl overflow-hidden shadow-xl hover:bg-white/50 transition-all duration-300 backdrop-blur-xs ${
                  isExpanded ? 'border-amber-400/90 ring-2 ring-amber-400/20' : 'border-white/60'
                }`}
              >
                {/* Header section (Always visible) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(rec.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer select-none"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20 uppercase shadow-2xs">
                        {rec.categoria}
                      </span>
                      <StatusBadge status={rec.status} />
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
                      {rec.titulo}
                    </h3>

                    <p className="text-[10px] text-amber-950 font-bold flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-indigo-700" />
                        {rec.autorNome} • {rec.autorUnidade}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-800" />
                        {rec.data}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão de Apoios no Header */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        apoiarReclamacao(rec.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-2xs active:scale-90 cursor-pointer ${
                        isApoiado
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 font-black scale-105'
                          : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                      }`}
                      title={isApoiado ? "Você apoiou esta ocorrência (clique para remover apoio)" : "Clique para apoiar esta ocorrência"}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : 'text-amber-800'}`} />
                      <span>{rec.apoiosCount}</span>
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
                          onClick={(e) => handleDeleteReclamacao(rec.id, rec.titulo, e)}
                          className="p-1.5 rounded-xl bg-white/80 hover:bg-rose-100 text-rose-600 border border-white/90 shadow-2xs hover:text-rose-800 transition-all cursor-pointer"
                          title="Excluir ocorrência"
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
                          Relato da Ocorrência:
                        </span>
                        <p>{rec.descricao}</p>
                        
                        {/* Anexo Enviado (Imagem ou Vídeo) */}
                        {rec.anexoUrl && (
                          <div className="mt-3 pt-2.5 border-t border-slate-900/10">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                              Evidência / Anexo Enviado:
                            </span>
                            {rec.anexoTipo === 'video' ? (
                              <video
                                src={rec.anexoUrl}
                                controls
                                className="w-full max-h-72 rounded-xl border border-slate-300 bg-black/10 object-contain shadow-sm"
                              />
                            ) : (
                              <img
                                src={rec.anexoUrl}
                                alt="Anexo da Ocorrência"
                                className="w-full max-h-72 rounded-xl border border-slate-300 bg-slate-100 object-cover shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => window.open(rec.anexoUrl, '_blank')}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card de Apoios e Relevância Coletiva */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-white/80 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                            <ThumbsUp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-950 block">
                              {rec.apoiosCount} moradores apoiam esta ocorrência
                            </span>
                            <span className="text-[10px] text-slate-600 font-medium">
                              Quanto mais apoios, maior a prioridade de resolução pela sindicância
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => apoiarReclamacao(rec.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                            isApoiado
                              ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/30 scale-105'
                              : 'bg-white/80 hover:bg-amber-50 text-amber-950 border border-amber-400'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : ''}`} />
                          {isApoiado ? 'Apoiado ✓' : 'Apoiar Ocorrência'}
                        </button>
                      </div>

                      {/* Gestão da Administração (Alteração de Status se for admin) */}
                      {isAdmin && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-amber-700" /> Gestão da Ocorrência (Administração)
                            </span>
                            <span className="text-[10px] text-slate-800 font-bold">Status Atual</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {statusOptions.map((st) => (
                              <button
                                key={st}
                                onClick={() => atualizarStatusReclamacao(rec.id, st)}
                                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                                  rec.status === st
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
                          Manifestações & Comentários ({comentariosCount})
                        </h4>

                        {comentariosCount > 0 && (
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {rec.comentarios.map((com) => {
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
                        <form onSubmit={(e) => handleSendCardComentario(e, rec.id)} className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder={isAdmin ? "Escrever comunicado oficial ou parecer..." : `Escrever apoio ou comentário como ${userDisplayUnidade}...`}
                            value={cardCommentsInput[rec.id] || ''}
                            onChange={(e) => setCardCommentsInput(prev => ({ ...prev, [rec.id]: e.target.value }))}
                            className="flex-1 bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white font-semibold shadow-xs"
                          />
                          <button
                            type="submit"
                            disabled={!cardCommentsInput[rec.id]?.trim()}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Enviar
                          </button>
                        </form>
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
