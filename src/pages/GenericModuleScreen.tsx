import React from 'react';
import { useCondo } from '../context/CondoContext';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface GenericModuleScreenProps {
  moduleId: string;
}

export const GenericModuleScreen: React.FC<GenericModuleScreenProps> = ({ moduleId }) => {
  const { espinhaDorsalItems, setCurrentScreen, funcionarios } = useCondo();

  const item = espinhaDorsalItems.find(i => i.id === moduleId || i.rota.includes(moduleId));

  if (!item) {
    return (
      <div className="p-5 text-center space-y-3">
        <p className="text-white text-sm font-bold">Módulo não encontrado.</p>
        <button onClick={() => setCurrentScreen('home')} className="px-4 py-2 bg-amber-500 rounded-xl text-xs text-slate-950 font-extrabold">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Module Title Card */}
      <div className="bg-white/45 border border-white/60 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-950 border border-amber-400/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">{item.titulo}</h2>
            <p className="text-xs text-slate-800 font-bold">{item.descricaoCurta}</p>
          </div>
        </div>

        {/* Desdobramentos from diagram */}
        <div className="pt-3 border-t border-slate-900/10 space-y-2">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            Desdobramentos Previstos no Diagrama:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.desdobramentos.map((desd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/60 border border-white/80 text-xs text-slate-900 flex items-center gap-2 font-bold shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>{desd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Content for Funcionários */}
      {moduleId === 'funcionarios' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white drop-shadow">
            Quadro de Funcionários & Avaliações
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {funcionarios.map((func) => (
              <div key={func.id} className="bg-white/45 border border-white/60 p-4 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center gap-4">
                  <img src={func.foto} alt={func.nome} className="w-20 h-20 rounded-2xl object-cover border border-white/80 shadow-xs shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950">{func.nome}</h4>
                    <p className="text-xs text-amber-950 font-extrabold mt-0.5">{func.funcao}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-900 space-y-1 bg-white/60 p-3 rounded-2xl border border-white/80 font-bold">
                  <p>⏰ Horário: <strong className="text-slate-950">{func.horario}</strong></p>
                  <p>📅 Disponibilidade: {func.disponibilidade}</p>
                  {func.mediaNota !== undefined && func.avaliacoesCount !== undefined && (
                    <p className="text-amber-900 font-extrabold mt-1">
                      ⭐ {func.mediaNota.toFixed(1)} / 5.0 ({func.avaliacoesCount} avaliações dos moradores)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General PoC Note */}
      <div className="p-4 rounded-3xl bg-white/45 border border-white/60 text-xs text-slate-950 space-y-2 font-bold shadow-xl">
        <span className="font-extrabold text-slate-950 block">📌 Nota do Protótipo (PoC 1.0)</span>
        <p className="leading-relaxed font-semibold">
          Este módulo faz parte da **Espinha Dorsal do Condomínio** especificada no diagrama. Para a demonstração atual da subsíndica, priorizamos o fluxo crítico e integrado:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setCurrentScreen('reclamacoes')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 shadow-sm"
          >
            Ir para Reclamações →
          </button>
          <button
            onClick={() => setCurrentScreen('reparos')}
            className="px-3.5 py-1.5 rounded-xl bg-white/70 text-slate-950 font-extrabold text-xs hover:bg-white border border-white/90 shadow-sm"
          >
            Ir para Reparos →
          </button>
        </div>
      </div>

    </div>
  );
};
