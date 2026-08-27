import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { CategoriaFuncionario, Funcionario } from '../types';
import { 
  Users2, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';
import { RateFuncionarioModal } from '../components/moradores/RateFuncionarioModal';

export const FuncionariosScreen: React.FC = () => {
  const { 
    funcionarios, 
    setCurrentScreen,
    currentUser,
    avaliacoesFuncionarios
  } = useCondo();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Todos');
  const [selectedFuncionarioToRate, setSelectedFuncionarioToRate] = useState<Funcionario | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  const categorias = ['Todos', 'Gestão', 'Conselho', 'Portaria', 'Limpeza', 'Segurança', 'Zeladoria', 'Manutenção'];

  // Helper para identificar categoria do funcionário
  const getFuncionarioCategoria = (func: Funcionario): string => {
    if (func.categoria) return func.categoria;
    const funcaoLower = func.funcao.toLowerCase();
    if (funcaoLower.includes('conselh')) return 'Conselho';
    if (funcaoLower.includes('porteir') || funcaoLower.includes('portaria')) return 'Portaria';
    if (funcaoLower.includes('faxin') || funcaoLower.includes('limpeza')) return 'Limpeza';
    if (funcaoLower.includes('vigi') || funcaoLower.includes('seguran') || funcaoLower.includes('ronda')) return 'Segurança';
    if (funcaoLower.includes('zelad')) return 'Zeladoria';
    if (funcaoLower.includes('manuten')) return 'Manutenção';
    return 'Gestão';
  };

  // Status helper
  const getStatusInfo = (st?: string) => {
    switch (st) {
      case 'Férias':
        return {
          label: '🌴 Em Férias',
          badgeClass: 'bg-amber-100 text-amber-950 border-amber-300',
          dotBg: 'bg-amber-500 text-slate-950',
          title: 'Colaborador em período de férias'
        };
      case 'Doente':
        return {
          label: '🩹 Licença Médica',
          badgeClass: 'bg-orange-100 text-orange-950 border-orange-300',
          dotBg: 'bg-orange-500 text-white',
          title: 'Em licença médica / afastamento temporário'
        };
      case 'Ausente':
        return {
          label: '⚠️ Ausente',
          badgeClass: 'bg-rose-100 text-rose-950 border-rose-300',
          dotBg: 'bg-rose-500 text-white',
          title: 'Colaborador ausente no momento'
        };
      case 'Desligado':
        return {
          label: '⚫ Desligado',
          badgeClass: 'bg-slate-200 text-slate-700 border-slate-300',
          dotBg: 'bg-slate-700 text-white',
          title: 'Colaborador não ativo / desligado'
        };
      case 'Ativo':
      default:
        return {
          label: '✓ Em Serviço',
          badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          dotBg: 'bg-emerald-500 text-white',
          title: 'Ativo e em serviço no condomínio'
        };
    }
  };

  // Filtragem precisa por Categoria e Busca
  const filteredFuncionarios = funcionarios.filter(func => {
    const cat = getFuncionarioCategoria(func);
    const status = func.status || 'Ativo';
    
    // Filtro por Categoria selecionada
    const matchesCategoria = selectedCategoria === 'Todos' || cat === selectedCategoria;

    // Filtro por termo de busca
    const matchesSearch = !searchTerm || 
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.disponibilidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.horario.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategoria && matchesSearch;
  });

  // Badge color helper por Categoria
  const getCategoriaBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'Portaria':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      case 'Limpeza':
        return 'bg-teal-100 text-teal-950 border-teal-300';
      case 'Segurança':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      case 'Zeladoria':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'Manutenção':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Conselho':
        return 'bg-indigo-100 text-indigo-950 border-indigo-300';
      case 'Gestão':
      default:
        return 'bg-amber-200 text-amber-950 border-amber-400 font-black';
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Users2 className="w-5 h-5 text-amber-400" />
          Quadro de Funcionários & Colaboradores
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Equipe de portaria, limpeza, zeladoria e administração do condomínio.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Filtro:
          </span>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoria(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                selectedCategoria === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por funcionário, cargo, escala ou status (ex: Ademar, Portaria, Férias, Síndica)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* Grid de Cards dos Funcionários */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Colaboradores ({filteredFuncionarios.length})
        </span>

        {filteredFuncionarios.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-white/70 rounded-3xl space-y-2">
            <p className="text-sm font-black text-slate-950">Nenhum colaborador encontrado para este filtro.</p>
            <button
              onClick={() => { setSelectedCategoria('Todos'); setSearchTerm(''); }}
              className="text-xs text-indigo-800 font-bold hover:underline cursor-pointer"
            >
              Limpar filtros e ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFuncionarios.map((func) => {
              const cat = getFuncionarioCategoria(func);
              const badgeStyle = getCategoriaBadgeStyle(cat);
              const statusInfo = getStatusInfo(func.status);
              const isDesligado = func.status === 'Desligado';

              return (
                <div
                  key={func.id}
                  className={`bg-white/50 border-2 border-white/70 rounded-3xl p-4 sm:p-5 shadow-xl hover:bg-white/60 transition-all flex flex-col justify-between space-y-3.5 backdrop-blur-xs ${
                    isDesligado ? 'opacity-70 grayscale-30' : ''
                  }`}
                >
                  {/* Topo do Card: Foto, Nome, Cargo e Badge de Categoria */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={func.foto}
                        alt={func.nome}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-200"
                      />
                      <span 
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-xs ${statusInfo.dotBg}`} 
                        title={statusInfo.title}
                      >
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-2xs ${badgeStyle}`}>
                          {cat}
                        </span>
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-2xs ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <h3 className="font-black text-sm sm:text-base text-slate-950 truncate leading-tight">
                        {func.nome}
                      </h3>
                      <p className="text-xs text-indigo-900 font-extrabold truncate">
                        {func.funcao}
                      </p>
                    </div>
                  </div>

                  {/* Detalhes de Horário, Escala e Avaliação */}
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-2xl bg-white/75 border border-white/90 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600 text-[10px] uppercase font-bold">
                          <Clock className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Horário de Turno:</span>
                        </div>
                        <strong className="text-slate-950 font-black text-[11px] block">
                          {func.horario || 'Integral'}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-white/75 border border-white/90 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600 text-[10px] uppercase font-bold">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>Escala / Dias:</span>
                        </div>
                        <span className="text-slate-900 font-bold text-[11px] block truncate" title={func.disponibilidade}>
                          {func.disponibilidade || 'Segunda a Sexta'}
                        </span>
                      </div>
                    </div>

                    {(() => {
                      // Não exibe avaliação para Conselheiros e Subsíndicos
                      const funcaoLower = func.funcao.toLowerCase();
                      const isGestaoNaoAvaliavel = cat === 'Conselho' || funcaoLower.includes('conselh') || funcaoLower.includes('subsindic') || funcaoLower.includes('subsíndic');
                      if (isGestaoNaoAvaliavel) return null;

                      const userIdentifier = currentUser?.id || currentUser?.unidade || '';
                      const minhaAval = avaliacoesFuncionarios.find(
                        a => a.funcionarioId === func.id && (a.usuarioId === userIdentifier || (currentUser?.unidade && a.unidade === currentUser.unidade))
                      );
                      const notaAtual = func.mediaNota !== undefined ? func.mediaNota : 5.0;
                      const countAtual = func.avaliacoesCount !== undefined ? func.avaliacoesCount : 0;

                      return (
                        <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Star className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                            <span className="font-black text-xs text-amber-950">
                              {notaAtual.toFixed(1)} / 5.0
                            </span>
                            <span className="text-[10px] text-slate-700 font-bold whitespace-nowrap">
                              ({countAtual} {countAtual === 1 ? 'avaliação' : 'avaliações'})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Botão de Avaliar com 5 Estrelas */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFuncionarioToRate(func);
                                setIsRateModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer bg-white hover:bg-amber-100 text-amber-950 border border-amber-300"
                              title="Clique para avaliar este colaborador de 1 a 5 estrelas"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                              <span>Avaliar</span>
                              {minhaAval && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black ml-0.5 shadow-2xs">
                                  {minhaAval.nota}★
                                </span>
                              )}
                            </button>

                            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              {notaAtual >= 4.7 ? 'Excelente' : notaAtual >= 4.0 ? 'Muito Bom' : 'Bom'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Avaliação Confidencial de 5 Estrelas */}
      <RateFuncionarioModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setSelectedFuncionarioToRate(null);
        }}
        funcionario={selectedFuncionarioToRate}
      />

    </div>
  );
};
