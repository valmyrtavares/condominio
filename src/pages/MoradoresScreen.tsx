import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Car, Search, Building2, ShieldCheck } from 'lucide-react';

export const MoradoresScreen: React.FC = () => {
  const { unidades } = useCondo();
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string>(unidades[1]?.id || unidades[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedUnidade = unidades.find(u => u.id === selectedUnidadeId) || unidades[0];

  const filteredUnidades = unidades.filter(u => 
    u.numero.includes(searchTerm) || 
    u.moradores.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
          Apartamentos
        </h2>
      </div>

      {/* Translucent Glass Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-700 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Buscar por unidade ou morador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/50 border border-white/70 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white/70 shadow-md transition-colors font-semibold"
        />
      </div>

      {/* Unidades selector */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block mb-2">
          Unidades
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredUnidades.map((u) => {
            const isSelected = u.id === selectedUnidadeId;
            const title = u.numero.toLowerCase().startsWith('apt') || u.numero.toLowerCase().startsWith('cobertura')
              ? u.numero
              : `Apt ${u.numero}`;

            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnidadeId(u.id)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-extrabold transition-all shrink-0 shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Details — Unified Household Cell Card */}
      {selectedUnidade && (() => {
        const hasMoradorConfigurado = Boolean(
          (selectedUnidade.moradores && selectedUnidade.moradores.length > 0) || 
          selectedUnidade.fotoCelula
        );

        const unitLabel = selectedUnidade.numero.toLowerCase().startsWith('apt') || selectedUnidade.numero.toLowerCase().startsWith('cobertura')
          ? selectedUnidade.numero
          : `Apt ${selectedUnidade.numero}`;

        if (!hasMoradorConfigurado) {
          return (
            <div className="bg-white/45 border border-white/60 rounded-3xl p-4 sm:p-5 shadow-xl hover:bg-white/55 transition-all duration-300">
              <div className="flex items-center gap-4">
                {/* Quadrado vazio sem foto */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-500/40 bg-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <div className="w-7 h-7 rounded-xl border border-slate-400/40 bg-white/20" />
                  <span className="text-[9px] font-black text-slate-700 mt-1">{unitLabel}</span>
                </div>

                {/* Morador sem dados configurados */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                    Morador sem dados configurados
                  </h3>
                  {selectedUnidade.vagaGaragem && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 text-slate-900 border border-white/80 shadow-2xs text-[11px] font-bold">
                      <Car className="w-3.5 h-3.5 text-amber-800" /> Vaga: {selectedUnidade.vagaGaragem}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white/45 border border-white/60 rounded-3xl p-5 shadow-xl hover:bg-white/55 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              
              {/* Resident Cell Portrait - Large and clearly identifiable */}
              <div className="relative w-full md:w-44 shrink-0 flex justify-center md:block">
                <img
                  src={selectedUnidade.fotoCelula || 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedUnidade.nomeCelula || 'Célula de Moradores'}
                  className="w-40 h-40 md:w-44 md:h-44 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:left-2 md:translate-x-0 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {unitLabel}
                </div>
              </div>

              {/* Resident Information */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                    Quem reside no apartamento
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-950 leading-tight">
                    Célula de Moradores
                  </h3>
                </div>

                {/* Residents names list inside the cell */}
                <div className="space-y-2">
                  {selectedUnidade.moradores.map((morador) => (
                    <div 
                      key={morador.id} 
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 border border-white/30 shadow-2xs hover:bg-white/65 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-extrabold text-slate-950 leading-tight">
                          {morador.nome}
                        </p>
                        {morador.profissao && (
                          <p className="text-[10px] text-amber-900 font-bold mt-0.5">
                            {morador.profissao}
                          </p>
                        )}
                      </div>

                      {morador.role === 'subsindico' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold shadow-2xs uppercase tracking-wider shrink-0 ml-2">
                          <ShieldCheck className="w-3 h-3" /> Subsíndica
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Operational details */}
                <div className="border-t border-slate-950/10 pt-3 flex flex-wrap gap-2.5 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 text-slate-950 border border-white/80 shadow-2xs font-extrabold">
                    <Car className="w-3.5 h-3.5 text-amber-800" /> Vaga de Garagem: {selectedUnidade.vagaGaragem || 'Sem vaga vinculada'}
                  </span>
                  {selectedUnidade.bloco && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 text-slate-950 border border-white/80 shadow-2xs font-extrabold">
                      <Building2 className="w-3.5 h-3.5 text-slate-800" /> Bloco: {selectedUnidade.bloco}
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
