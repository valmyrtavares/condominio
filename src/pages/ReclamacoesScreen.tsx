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
  Plus
} from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { CategoriaReclamacao, StatusReclamacao } from '../types';

export const ReclamacoesScreen: React.FC = () => {
  const { 
    reclamacoes, 
    currentUser, 
    selectedReclamacaoId, 
    setSelectedReclamacaoId, 
    apoiarReclamacao, 
    adicionarComentario,
    adicionarReclamacao,
    atualizarStatusReclamacao
  } = useCondo();

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterResident, setFilterResident] = useState<string>('');

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaReclamacao>('Barulho');
  const [anexoFile, setAnexoFile] = useState<File | null>(null);

  const [novoComentarioTexto, setNovoComentarioTexto] = useState<string>('');
  const [cardCommentsInput, setCardCommentsInput] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const selectedReclamacao = reclamacoes.find(r => r.id === selectedReclamacaoId) || reclamacoes[0];

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

  const handleSendDetailComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentarioTexto.trim() || !selectedReclamacao) return;
    adicionarComentario(selectedReclamacao.id, novoComentarioTexto.trim());
    setNovoComentarioTexto('');
  };

  const handleSendCardComentario = (e: React.FormEvent, recId: string) => {
    e.preventDefault();
    const text = cardCommentsInput[recId];
    if (!text?.trim()) return;
    adicionarComentario(recId, text.trim());
    setCardCommentsInput(prev => ({ ...prev, [recId]: '' }));
    setExpandedComments(prev => ({ ...prev, [recId]: true }));
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
      r.autorUnidade.toLowerCase().includes(filterResident.toLowerCase());
    return matchesCategory && matchesDate && matchesResident;
  });

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';
  const userIdentifier = currentUser?.id || currentUser?.unidade || '';
  const selectedReclamacaoApoiado = selectedReclamacao 
    ? ((selectedReclamacao.apoiadores && userIdentifier ? selectedReclamacao.apoiadores.includes(userIdentifier) : false) || Boolean(selectedReclamacao.apoiadoPeloUsuario))
    : false;

  const userDisplayUnidade = currentUser?.unidade 
    ? (currentUser.unidade.toLowerCase().startsWith('apt') || currentUser.unidade.toLowerCase().startsWith('cobertura') ? currentUser.unidade : `Apt ${currentUser.unidade}`)
    : (currentUser?.role !== 'morador' ? 'Administração' : 'Morador');

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
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
              placeholder="Filtrar por morador ou apt..."
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

      {/* List / Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full max-w-full">
        <div className="lg:col-span-5 space-y-3 w-full max-w-full min-w-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Lista de Ocorrências ({filteredReclamacoes.length})
          </span>

          {filteredReclamacoes.length === 0 ? (
            <div className="p-5 text-center bg-white/30 rounded-3xl border border-white/40 text-xs font-semibold text-slate-800 w-full">
              Nenhuma reclamação encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredReclamacoes.map((rec) => {
              const isSelected = rec.id === selectedReclamacaoId;
              const isApoiado = (rec.apoiadores && userIdentifier ? rec.apoiadores.includes(userIdentifier) : false) || Boolean(rec.apoiadoPeloUsuario);
              const isCommentsExpanded = Boolean(expandedComments[rec.id]);

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedReclamacaoId(rec.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-lg space-y-2.5 ${
                    isSelected
                      ? 'bg-white/65 border-amber-400 ring-2 ring-amber-400/30 scale-102'
                      : 'bg-white/45 border-white/60 hover:bg-white/55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20 uppercase">
                      {rec.categoria}
                    </span>
                    <StatusBadge status={rec.status} />
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-950 leading-snug">
                    {rec.titulo}
                  </h3>

                  <p className="text-xs text-slate-800 line-clamp-2 font-medium">
                    {rec.descricao}
                  </p>

                  <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-xs text-slate-700">
                    <span className="text-[11px] font-extrabold text-slate-950 truncate max-w-[55%]">
                      {rec.autorNome} • {rec.autorUnidade}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          apoiarReclamacao(rec.id);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-2xs active:scale-90 cursor-pointer ${
                          isApoiado
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm border border-amber-400 font-black scale-105'
                            : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                        }`}
                        title={isApoiado ? "Você apoiou esta ocorrência (clique para remover apoio)" : "Clique no joinha para apoiar esta ocorrência"}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isApoiado ? 'fill-slate-950 stroke-[2.5]' : 'text-amber-800'}`} />
                        <span>{rec.apoiosCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedComments(prev => ({ ...prev, [rec.id]: !prev[rec.id] }));
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 border shadow-2xs cursor-pointer transition-all active:scale-95 ${
                          isCommentsExpanded
                            ? 'bg-indigo-700 text-white border-indigo-800'
                            : 'bg-white/80 hover:bg-white text-slate-800 border border-white/90'
                        }`}
                        title="Ver ou ocultar comentários e manifestações"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{rec.comentarios.length}</span>
                      </button>
                    </div>
                  </div>

                  <div 
                    className="pt-2 border-t border-slate-900/10 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <form 
                      onSubmit={(e) => handleSendCardComentario(e, rec.id)}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder={`Escrever apoio ou comentário como ${userDisplayUnidade}...`}
                        value={cardCommentsInput[rec.id] || ''}
                        onChange={(e) => setCardCommentsInput(prev => ({ ...prev, [rec.id]: e.target.value }))}
                        className="flex-1 bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={!cardCommentsInput[rec.id]?.trim()}
                        className="p-1.5 px-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Publicar apoio / comentário"
                      >
                        <Send className="w-3 h-3" />
                        <span className="text-[11px] hidden sm:inline font-black">Enviar</span>
                      </button>
                    </form>

                    {isCommentsExpanded && rec.comentarios.length > 0 && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1 animate-in fade-in duration-200">
                        {rec.comentarios.map((com) => (
                          <div
                            key={com.id}
                            className={`p-2 rounded-xl text-[11px] space-y-0.5 ${
                              com.oficial
                                ? 'bg-amber-500/20 border border-amber-400/50'
                                : 'bg-white/70 border border-white/90 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`font-black flex items-center gap-1 ${com.oficial ? 'text-amber-950' : 'text-slate-950'}`}>
                                {com.oficial ? <ShieldCheck className="w-3 h-3 text-amber-700" /> : <User className="w-3 h-3 text-indigo-700" />}
                                {com.autorNome}
                                {com.autorUnidade && (
                                  <span className="text-slate-600 font-bold">({com.autorUnidade})</span>
                                )}
                              </span>
                              <span className="text-slate-500 font-mono text-[9px] font-semibold">{com.data}</span>
                            </div>
                            <p className="text-slate-900 font-semibold pl-4 leading-tight">{com.texto}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Right Column */}
        {selectedReclamacao ? (
          <div className="lg:col-span-7 bg-white/45 border border-white/60 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-900/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-amber-500/20 text-amber-950 border border-amber-400/40 uppercase">
                  {selectedReclamacao.categoria}
                </span>
                <StatusBadge status={selectedReclamacao.status} />
              </div>
              <span className="text-[11px] text-slate-800 font-mono font-bold">
                {selectedReclamacao.data}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-950 leading-tight">
                {selectedReclamacao.titulo}
              </h2>
              <p className="text-xs text-amber-950 mt-1 font-extrabold">
                Por: {selectedReclamacao.autorNome} ({selectedReclamacao.autorUnidade})
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-2xl border border-white/80 text-xs text-slate-900 leading-relaxed font-semibold">
              {selectedReclamacao.descricao}
              
              {selectedReclamacao.anexoUrl && (
                <div className="mt-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Anexo Enviado pelo Morador:
                  </span>
                  {selectedReclamacao.anexoTipo === 'video' ? (
                    <video
                      src={selectedReclamacao.anexoUrl}
                      controls
                      className="w-full max-h-64 rounded-xl border border-slate-300 bg-black/10 object-contain shadow-sm"
                    />
                  ) : (
                    <img
                      src={selectedReclamacao.anexoUrl}
                      alt="Anexo da Ocorrência"
                      className="w-full max-h-64 rounded-xl border border-slate-300 bg-slate-100 object-cover shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => window.open(selectedReclamacao.anexoUrl, '_blank')}
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
                    {selectedReclamacao.apoiosCount} moradores apoiam esta ocorrência
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">
                    Quanto mais apoios, maior a prioridade de resolução
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => apoiarReclamacao(selectedReclamacao.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                  selectedReclamacaoApoiado
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/30 scale-105'
                    : 'bg-white/80 hover:bg-amber-50 text-amber-950 border border-amber-400'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${selectedReclamacaoApoiado ? 'fill-slate-950 stroke-[2.5]' : ''}`} />
                {selectedReclamacaoApoiado ? 'Apoiado ✓' : 'Apoiar'}
              </button>
            </div>

            {/* Admin Action: Status Management */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/60 space-y-2.5">
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
                      onClick={() => atualizarStatusReclamacao(selectedReclamacao.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                        selectedReclamacao.status === st
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

            {/* Comments Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-700" />
                Manifestações & Apoios ({selectedReclamacao.comentarios.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedReclamacao.comentarios.map((com) => (
                  <div
                    key={com.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      com.oficial
                        ? 'bg-amber-500/20 border border-amber-400/50'
                        : 'bg-white/60 border border-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-extrabold flex items-center gap-1.5 ${com.oficial ? 'text-amber-950' : 'text-slate-950'}`}>
                        {com.oficial ? <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> : <User className="w-3.5 h-3.5 text-indigo-700" />}
                        {com.autorNome}
                        {com.autorUnidade && (
                          <span className="text-slate-600 font-bold">({com.autorUnidade})</span>
                        )}
                      </span>
                      <span className="text-slate-700 font-mono text-[10px] font-bold">{com.data}</span>
                    </div>
                    <p className="text-slate-900 leading-relaxed pl-5 font-semibold">{com.texto}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSendDetailComentario} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder={isAdmin ? "Escrever comunicado oficial ou parecer da sindicância..." : `Escrever comentário ou apoio como ${userDisplayUnidade}...`}
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
          </div>
        ) : null}
      </div>
    </div>
  );
};
