import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { 
  AlertTriangle, 
  ThumbsUp, 
  MessageSquare, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  User, 
  Send
} from 'lucide-react';
import { StatusBadge } from '../components/layout/StatusBadge';
import { TransformToRepairModal } from '../components/reclamacoes/TransformToRepairModal';

export const ReclamacoesScreen: React.FC = () => {
  const { 
    reclamacoes, 
    currentUser, 
    selectedReclamacaoId, 
    setSelectedReclamacaoId, 
    apoiarReclamacao, 
    adicionarComentario,
    setCurrentScreen,
    setSelectedReparoId
  } = useCondo();

  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [showTransformModal, setShowTransformModal] = useState<boolean>(false);
  const [novoComentarioTexto, setNovoComentarioTexto] = useState<string>('');

  const selectedReclamacao = reclamacoes.find(r => r.id === selectedReclamacaoId) || reclamacoes[0];

  const categories = ['Todas', 'Garagem', 'Manutenção', 'Barulho', 'Limpeza', 'Segurança', 'Outros'];

  const filteredReclamacoes = reclamacoes.filter(r => 
    filterCategory === 'Todas' || r.categoria === filterCategory
  );

  const handleSendComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentarioTexto.trim() || !selectedReclamacao) return;
    adicionarComentario(selectedReclamacao.id, novoComentarioTexto);
    setNovoComentarioTexto('');
  };

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Reclamações & Ocorrências
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Relate problemas, apoie a vizinhança e acompanhe providências
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-2xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List / Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Complaints List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Lista de Reclamações ({filteredReclamacoes.length})
          </span>

          {filteredReclamacoes.map((rec) => {
            const isSelected = rec.id === selectedReclamacaoId;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedReclamacaoId(rec.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    {rec.categoria}
                  </span>
                  <StatusBadge status={rec.status} />
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {rec.titulo}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {rec.descricao}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {rec.autorNome} • {rec.autorUnidade}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-extrabold text-amber-700">
                      <ThumbsUp className="w-3.5 h-3.5" /> {rec.apoiosCount}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" /> {rec.comentarios.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Complaint Detail Page */}
        {selectedReclamacao ? (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 uppercase">
                  {selectedReclamacao.categoria}
                </span>
                <StatusBadge status={selectedReclamacao.status} />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedReclamacao.data}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {selectedReclamacao.titulo}
              </h2>
              <p className="text-xs text-indigo-700 mt-1 font-semibold">
                Por: {selectedReclamacao.autorNome} ({selectedReclamacao.autorUnidade})
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
              {selectedReclamacao.descricao}
            </div>

            {/* Support Action Button */}
            <div className="flex items-center justify-between bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block">Apoio Comunitário</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedReclamacao.apoiosCount} vizinhos consideram este problema prioritário
                </span>
              </div>

              <button
                onClick={() => apoiarReclamacao(selectedReclamacao.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 shadow-sm ${
                  selectedReclamacao.apoiadoPeloUsuario
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-amber-500/20'
                    : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${selectedReclamacao.apoiadoPeloUsuario ? 'fill-current' : ''}`} />
                {selectedReclamacao.apoiadoPeloUsuario ? 'Apoiado ✓' : 'Apoiar'}
              </button>
            </div>

            {/* Admin Action: Transform to Repair */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Ação Administrativa
                  </span>
                  {selectedReclamacao.reparoId && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Já Vinculado a Reparo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  Transforme este relato de morador em uma Ação de Reparo formal com cotações de fornecedores e controle de execução.
                </p>

                {selectedReclamacao.reparoId ? (
                  <button
                    onClick={() => {
                      setSelectedReparoId(selectedReclamacao.reparoId!);
                      setCurrentScreen('reparos');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 transition-all shadow-sm"
                  >
                    Ver Reparo Gerado & Orçamentos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTransformModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs transition-all active:scale-95 shadow-sm"
                  >
                    <Wrench className="w-4 h-4" />
                    Transformar Reclamação em Reparo
                  </button>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Manifestações & Comentários ({selectedReclamacao.comentarios.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedReclamacao.comentarios.map((com) => (
                  <div
                    key={com.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      com.oficial
                        ? 'bg-amber-50/80 border border-amber-200'
                        : 'bg-slate-50 border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-extrabold flex items-center gap-1.5 ${com.oficial ? 'text-amber-900' : 'text-slate-900'}`}>
                        {com.oficial ? <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> : <User className="w-3.5 h-3.5 text-indigo-600" />}
                        {com.autorNome}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{com.data}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-5 font-medium">{com.texto}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSendComentario} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder={isAdmin ? "Escrever resposta oficial da administração..." : "Escrever um comentário..."}
                  value={novoComentarioTexto}
                  onChange={(e) => setNovoComentarioTexto(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </form>
            </div>

          </div>
        ) : null}

      </div>

      {/* Transform Modal */}
      {showTransformModal && selectedReclamacao && (
        <TransformToRepairModal
          reclamacao={selectedReclamacao}
          onClose={() => setShowTransformModal(false)}
        />
      )}
    </div>
  );
};
