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
        <p className="text-slate-500 text-sm">Módulo não encontrado.</p>
        <button onClick={() => setCurrentScreen('home')} className="px-4 py-2 bg-indigo-600 rounded-xl text-xs text-white font-bold">
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
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase font-bold">
          Espinha Dorsal
        </span>
      </div>

      {/* Module Title Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{item.titulo}</h2>
            <p className="text-xs text-slate-500 font-medium">{item.descricaoCurta}</p>
          </div>
        </div>

        {/* Desdobramentos from diagram */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            Desdobramentos Previstos no Diagrama:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.desdobramentos.map((desd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{desd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Content for Funcionários */}
      {moduleId === 'funcionarios' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Quadro de Funcionários & Avaliações
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {funcionarios.map((func) => (
              <div key={func.id} className="bg-white border border-slate-200 p-4 rounded-3xl space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <img src={func.foto} alt={func.nome} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{func.nome}</h4>
                    <p className="text-xs text-indigo-700 font-semibold">{func.funcao}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                  <p>⏰ Horário: <strong className="text-slate-900">{func.horario}</strong></p>
                  <p>📅 Disponibilidade: {func.disponibilidade}</p>
                  <p className="text-amber-800 font-extrabold mt-1">
                    ⭐ {func.mediaNota.toFixed(1)} / 5.0 ({func.avaliacoesCount} avaliações dos moradores)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General PoC Note */}
      <div className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 space-y-2 font-medium">
        <span className="font-extrabold text-indigo-900 block">📌 Nota do Protótipo (PoC 1.0)</span>
        <p className="leading-relaxed">
          Este módulo faz parte da **Espinha Dorsal do Condomínio** especificada no diagrama. Para a demonstração atual da subsíndica, priorizamos o fluxo crítico e integrado:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setCurrentScreen('reclamacoes')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 shadow-2xs"
          >
            Ir para Reclamações →
          </button>
          <button
            onClick={() => setCurrentScreen('reparos')}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-50 border border-slate-200 shadow-2xs"
          >
            Ir para Reparos →
          </button>
        </div>
      </div>

    </div>
  );
};
