import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { 
  Users2, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  MessageSquareHeart
} from 'lucide-react';

export const FuncionariosScreen: React.FC = () => {
  const { funcionarios, setCurrentScreen } = useCondo();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFuncao, setSelectedFuncao] = useState<string>('Todos');

  const funcoes = ['Todos', 'Portaria', 'Limpeza', 'Segurança', 'Gestão'];

  const filteredFuncionarios = funcionarios.filter(func => {
    const matchesSearch = !searchTerm || 
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.disponibilidade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFuncao = selectedFuncao === 'Todos' || 
      func.funcao.toLowerCase().includes(selectedFuncao.toLowerCase());

    return matchesSearch && matchesFuncao;
  });

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
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
          Equipe dedicada de portaria, limpeza, zeladoria e segurança do condomínio.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Função:
          </span>
          {funcoes.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFuncao(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                selectedFuncao === f
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por funcionário ou cargo (ex: Ademar, Portaria, Faxineira)..."
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
          Colaboradores Ativos ({filteredFuncionarios.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFuncionarios.map((func) => (
            <div
              key={func.id}
              className="bg-white/50 border-2 border-white/70 rounded-3xl p-4 sm:p-5 shadow-xl hover:bg-white/60 transition-all flex flex-col justify-between space-y-3.5 backdrop-blur-xs"
            >
              {/* Topo do Card: Foto, Nome e Cargo */}
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={func.foto}
                    alt={func.nome}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-200"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-xs" title="Ativo no condomínio">
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-950 border border-amber-400/40 inline-block mb-1">
                    Equipe Operacional
                  </span>
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
                      {func.horario}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/75 border border-white/90 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-600 text-[10px] uppercase font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>Escala / Dias:</span>
                    </div>
                    <span className="text-slate-900 font-bold text-[11px] block truncate" title={func.disponibilidade}>
                      {func.disponibilidade}
                    </span>
                  </div>
                </div>

                {func.mediaNota !== undefined && func.avaliacoesCount !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <span className="font-black text-xs text-amber-950">
                        {func.mediaNota.toFixed(1)} / 5.0
                      </span>
                      <span className="text-[10px] text-slate-700 font-bold">
                        ({func.avaliacoesCount} avaliações)
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Excelente
                    </span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
