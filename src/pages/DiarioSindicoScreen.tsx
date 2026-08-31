import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { RegistroAtividade, TipoAtividade } from '../types';
import { 
  BookOpen, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Filter, 
  Plus, 
  Trash2, 
  ExternalLink, 
  User, 
  AlertTriangle, 
  Wrench, 
  Building2, 
  Truck, 
  DollarSign, 
  Gavel, 
  ShoppingBag, 
  Bell, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';

export const DiarioSindicoScreen: React.FC = () => {
  const { 
    registrosAtividades, 
    adicionarRegistroAtividade, 
    excluirRegistroAtividade, 
    setCurrentScreen 
  } = useCondo();

  const hojeIso = new Date().toISOString().split('T')[0];
  const [selectedDateIso, setSelectedDateIso] = useState<string>(hojeIso);
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal para registro manual no diário
  const [isNovoRegistroOpen, setIsNovoRegistroOpen] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoTipo, setNovoTipo] = useState<TipoAtividade>('aviso_geral');
  const [novoAutor, setNovoAutor] = useState('Administração / Síndica');

  const categorias = [
    { id: 'Todas', label: 'Todas as Atividades' },
    { id: 'Ocorrência', label: '🚨 Ocorrências / Reclamações' },
    { id: 'Reparos', label: '🛠️ Reparos & Obras' },
    { id: 'Reservas', label: '📅 Reservas de Áreas' },
    { id: 'Mudanças', label: '🚚 Mudanças' },
    { id: 'Moradores', label: '👤 Moradores & Acesso' },
    { id: 'Financeiro', label: '💰 Financeiro' },
    { id: 'Assembleia', label: '⚖️ Assembleias & Atas' },
    { id: 'Enjoei', label: '🛍️ Enjoei / Desapegos' }
  ];

  // Atividades filtradas por data e critérios
  const atividadesDoDia = registrosAtividades.filter(act => {
    const matchData = !selectedDateIso || act.dataIso === selectedDateIso;
    const matchCat = filterCategoria === 'Todas' || 
      (act.categoriaBadge && act.categoriaBadge.toLowerCase().includes(filterCategoria.toLowerCase())) ||
      act.tipo.toLowerCase().includes(filterCategoria.toLowerCase());
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      act.titulo.toLowerCase().includes(termo) ||
      act.descricao.toLowerCase().includes(termo) ||
      act.autorNome.toLowerCase().includes(termo) ||
      (act.autorUnidade && act.autorUnidade.includes(termo));

    return matchData && matchCat && matchBusca;
  });

  const getTipoIcon = (tipo: TipoAtividade) => {
    switch (tipo) {
      case 'reclamacao_aberta':
      case 'reclamacao_resolvida':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'reparo_aberto':
      case 'reparo_orcamento':
      case 'reparo_concluido':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'reserva_solicitada':
      case 'reserva_cancelada':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'mudanca_agendada':
      case 'mudanca_aprovada':
      case 'mudanca_recusada':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'morador_novo':
      case 'morador_atualizado':
        return <User className="w-4 h-4 text-emerald-500" />;
      case 'financeiro_lancamento':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'assembleia_publicada':
        return <Gavel className="w-4 h-4 text-indigo-500" />;
      case 'enjoei_publicado':
        return <ShoppingBag className="w-4 h-4 text-rose-400" />;
      case 'seguranca_acesso':
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  const handleSalvarRegistroManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo.trim() || !novaDescricao.trim()) return;

    const agora = new Date();
    const dataHoraStr = `${agora.toLocaleDateString('pt-BR')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    
    adicionarRegistroAtividade({
      dataHora: dataHoraStr,
      dataIso: selectedDateIso || hojeIso,
      hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
      tipo: novoTipo,
      titulo: novoTitulo.trim(),
      descricao: novaDescricao.trim(),
      autorNome: novoAutor.trim() || 'Síndico',
      autorTipo: 'admin',
      categoriaBadge: 'Aviso Geral'
    });

    setNovoTitulo('');
    setNovaDescricao('');
    setIsNovoRegistroOpen(false);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('admin')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Admin
        </button>
      </div>

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Diário do Síndico & Galeria Cronológica
          </h2>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            Acompanhe a linha do tempo de tudo o que acontece no condomínio dia a dia (cadastros, reservas, reparos, mudanças e ocorrências).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNovoRegistroOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Registrar Anotação no Diário</span>
        </button>
      </div>

      {/* 1. Barra de Data & Filtros */}
      <div className="bg-white/50 border border-white/70 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xs space-y-4">
        
        {/* Seletor de Data Rápido */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-950/10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-700" /> Selecionar Dia:
            </span>

            <button
              type="button"
              onClick={() => setSelectedDateIso(hojeIso)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                selectedDateIso === hojeIso
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-white/60 text-slate-800 border-white/80 hover:bg-white'
              }`}
            >
              Hoje ({new Date().toLocaleDateString('pt-BR')})
            </button>

            <button
              type="button"
              onClick={() => {
                const ontem = new Date();
                ontem.setDate(ontem.getDate() - 1);
                setSelectedDateIso(ontem.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/60 text-slate-800 border border-white/80 hover:bg-white transition-all cursor-pointer"
            >
              Ontem
            </button>

            <button
              type="button"
              onClick={() => setSelectedDateIso('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                !selectedDateIso
                  ? 'bg-slate-900 text-amber-300 border-slate-900 font-black'
                  : 'bg-white/60 text-slate-800 border-white/80 hover:bg-white'
              }`}
            >
              Todos os Dias
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600">Data específica:</label>
            <input
              type="date"
              value={selectedDateIso}
              onChange={(e) => setSelectedDateIso(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-bold focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Categorias Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategoria(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                filterCategoria === cat.id
                  ? 'bg-slate-900 text-amber-300 border-slate-900 font-black shadow-xs'
                  : 'bg-white/60 text-slate-800 border-white/80 hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Busca Textual */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar registro por título, descrição, autor, unidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 border border-white/90 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-500 font-semibold focus:outline-none focus:bg-white shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        </div>

      </div>

      {/* 2. Linha do Tempo Vertical de Ocorrências */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Linha do Tempo de Atividades ({atividadesDoDia.length} registros)
          </span>
        </div>

        {atividadesDoDia.length === 0 ? (
          <div className="p-8 text-center bg-white/45 border border-white/60 rounded-3xl space-y-2 backdrop-blur-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-black text-slate-950">Nenhuma ocorrência registrada nesta data</h4>
            <p className="text-xs text-slate-700 font-medium">
              Dia calmo sem novos chamados, agendamentos ou manutenções registradas.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDateIso('');
                setFilterCategoria('Todas');
                setSearchTerm('');
              }}
              className="text-xs text-amber-900 font-black underline cursor-pointer"
            >
              Ver histórico completo de todos os dias
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {atividadesDoDia.map((act) => {
              const icon = getTipoIcon(act.tipo);

              return (
                <div
                  key={act.id}
                  className="bg-white/65 border border-white/80 rounded-3xl p-4 sm:p-5 shadow-lg hover:bg-white/80 transition-all backdrop-blur-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    
                    {/* Badge do Horário & Ícone */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {icon}
                      </div>
                      <span className="text-[10px] font-black text-slate-600 mt-1 font-mono">
                        {act.hora}
                      </span>
                    </div>

                    {/* Conteúdo da Atividade */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {act.categoriaBadge && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                            {act.categoriaBadge}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-500">
                          📅 {act.dataHora}
                        </span>
                        {act.autorUnidade && (
                          <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Unidade {act.autorUnidade}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-slate-950 leading-snug">
                        {act.titulo}
                      </h4>

                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {act.descricao}
                      </p>

                      <div className="text-[11px] text-slate-600 font-medium pt-0.5 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>Registrado por: <b>{act.autorNome}</b></span>
                      </div>
                    </div>

                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-950/10">
                    {act.linkTela && (
                      <button
                        type="button"
                        onClick={() => setCurrentScreen(act.linkTela as any)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Abrir Módulo</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Deseja remover este registro do diário?')) {
                          excluirRegistroAtividade(act.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir anotação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Modal de Inserção Manual de Registro */}
      {isNovoRegistroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Novo Registro no Diário do Síndico</h3>
                  <p className="text-xs text-slate-400">Adicione uma anotação, ronda ou vistoria na linha do tempo.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNovoRegistroOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarRegistroManual} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-300">
                  Título do Acontecimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ronda Noturna Realizada / Vistoria na Bomba d'Água"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-300">
                  Tipo / Categoria
                </label>
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value as TipoAtividade)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="aviso_geral">Aviso Geral / Anotação</option>
                  <option value="seguranca_acesso">Segurança & Portaria</option>
                  <option value="reparo_aberto">Manutenção / Reparo</option>
                  <option value="reclamacao_aberta">Ocorrência / Notificação</option>
                  <option value="mudanca_agendada">Mudança / Carreto</option>
                  <option value="financeiro_lancamento">Financeiro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-300">
                  Descrição Detalhada dos Fatos *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Relate o que ocorreu, medidas tomadas ou observações importantes..."
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-white font-medium resize-none focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-300">
                  Responsável pelo Registro:
                </label>
                <input
                  type="text"
                  value={novoAutor}
                  onChange={(e) => setNovoAutor(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNovoRegistroOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md"
                >
                  Salvar Registro
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
