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

  const handleSendComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentarioTexto.trim() || !selectedReclamacao) return;
    adicionarComentario(selectedReclamacao.id, novoComentarioTexto);
    setNovoComentarioTexto('');
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

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Reclamações & Ocorrências
          </h2>
        </div>
      </div>

      {/* 1. Form: Faça uma Reclamação */}
      <div className="bg-white/45 border border-white/60 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 w-full max-w-full box-border overflow-hidden">
        <div className="flex items-center gap-2 text-slate-950">
          <Plus className="w-5 h-5 text-amber-900" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            Registrar Nova Ocorrência
          </h3>
        </div>

        <form onSubmit={handleSubmitReclamacao} className="space-y-3 w-full max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Title */}
            <div className="space-y-1 min-w-0 w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">Título da Reclamação</label>
              <input
                type="text"
                placeholder="Ex: Som excessivo após as 22h ou desrespeito às regras"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                required
              />
            </div>

            {/* Category Select */}
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

          {/* Description */}
          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">Descrição Detalhada</label>
            <textarea
              placeholder="Descreva a ocorrência com detalhes (local, horário aproximado, relato do ocorrido)..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full max-w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs resize-none"
              required
            />
          </div>

          {/* File Upload Attachment */}
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
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Publicar Ocorrência</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Filters Row: Category Pills + Search Inputs */}
      <div className="space-y-3 w-full max-w-full">
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date and Resident Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/30 border border-white/40 p-3 rounded-2xl shadow-sm w-full max-w-full box-border">
          {/* Resident Search */}
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

          {/* Date Filter */}
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

      {/* List / Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full max-w-full">
        
        {/* Left Column: Complaints List */}
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
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedReclamacaoId(rec.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-lg ${
                    isSelected
                      ? 'bg-white/65 border-amber-400 ring-2 ring-amber-400/30 scale-102'
                      : 'bg-white/45 border-white/60 hover:bg-white/55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20 uppercase">
                      {rec.categoria}
                    </span>
                    <StatusBadge status={rec.status} />
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-950 leading-snug">
                    {rec.titulo}
                  </h3>

                  <p className="text-xs text-slate-800 mt-1 line-clamp-2 font-medium">
                    {rec.descricao}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-900/10 flex items-center justify-between text-xs text-slate-700">
                    <span className="text-[11px] font-extrabold text-slate-950">
                      {rec.autorNome} • {rec.autorUnidade}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-extrabold text-amber-800">
                        <ThumbsUp className="w-3.5 h-3.5" /> {rec.apoiosCount}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-bold">
                        <MessageSquare className="w-3.5 h-3.5" /> {rec.comentarios.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Complaint Detail Page */}
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
              
              {/* Media Attachment Rendering */}
              {selectedReclamacao.anexoUrl && (
                <div className="mt-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Anexo Enviado pelo Morador:
                  </span>
                  {selectedReclamacao.anexoTipo === 'video' ? (
                    <video 
                      src={selectedReclamacao.anexoUrl} 
                      controls 
                      className="w-full rounded-xl border border-white/50 shadow-sm max-h-64 object-cover"
                    />
                  ) : (
                    <img 
                      src={selectedReclamacao.anexoUrl} 
                      alt="Anexo da ocorrência" 
                      className="w-full rounded-xl border border-white/50 shadow-sm max-h-64 object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Support Action Button */}
            <div className="flex items-center justify-between bg-white/60 p-3.5 rounded-2xl border border-white/80">
              <div className="text-xs">
                <span className="font-extrabold text-slate-950 block">Apoio Comunitário</span>
                <span className="text-[11px] text-slate-800 font-semibold">
                  {selectedReclamacao.apoiosCount} vizinhos consideram este problema prioritário
                </span>
              </div>

              <button
                onClick={() => apoiarReclamacao(selectedReclamacao.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 shadow-md ${
                  selectedReclamacao.apoiadoPeloUsuario
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/30 scale-105'
                    : 'bg-white/80 hover:bg-amber-50 text-amber-950 border border-amber-400'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${selectedReclamacao.apoiadoPeloUsuario ? 'fill-current' : ''}`} />
                {selectedReclamacao.apoiadoPeloUsuario ? 'Apoiado ✓' : 'Apoiar'}
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
                <p className="text-[11px] text-slate-900 leading-relaxed font-semibold">
                  Alterne o status desta reclamação conforme a condução do caso e mediação com os moradores:
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {statusOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => atualizarStatusReclamacao(selectedReclamacao.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
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
                Manifestações & Resoluções ({selectedReclamacao.comentarios.length})
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
                      </span>
                      <span className="text-slate-700 font-mono text-[10px] font-bold">{com.data}</span>
                    </div>
                    <p className="text-slate-900 leading-relaxed pl-5 font-semibold">{com.texto}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSendComentario} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder={isAdmin ? "Escrever comunicado oficial ou parecer da sindicância..." : "Escrever um comentário..."}
                  value={novoComentarioTexto}
                  onChange={(e) => setNovoComentarioTexto(e.target.value)}
                  className="flex-1 bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
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
