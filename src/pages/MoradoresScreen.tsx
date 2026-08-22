import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Car, Briefcase, Heart, Calendar, Search } from 'lucide-react';

export const MoradoresScreen: React.FC = () => {
  const { unidades } = useCondo();
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string>(unidades[1]?.id || unidades[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedUnidade = unidades.find(u => u.id === selectedUnidadeId) || unidades[0];

  const filteredUnidades = unidades.filter(u => 
    u.numero.includes(searchTerm) || 
    u.moradores.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || (m.profissao && m.profissao.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Title — Crisp White over Building Image */}
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
          placeholder="Buscar por unidade, nome ou profissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/50 border border-white/70 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-700 focus:outline-none focus:bg-white/70 shadow-md transition-colors font-semibold"
        />
      </div>

      {/* Label — Crisp White */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block mb-2">
          Unidades
        </span>

        {/* Horizontal Unit Carousel — Translucent Glass Pills (Apt 101, Apt 102...) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredUnidades.map((u) => {
            const isSelected = u.id === selectedUnidadeId;
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
                Apt {u.numero}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Details — Starts DIRECTLY with Resident Profiles over Translucent Glass */}
      {selectedUnidade && (
        <div className="space-y-3 pt-1">
          {selectedUnidade.moradores.map((morador) => (
            <div 
              key={morador.id}
              className="bg-white/45 border border-white/60 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl hover:bg-white/55 transition-all"
            >
              {/* Resident Photo */}
              <img
                src={morador.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={morador.nome}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
              />

              {/* Resident Info — Organized Layout */}
              <div className="flex-1 space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                    {morador.nome}
                  </h3>
                  {morador.role === 'subsindico' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/80 text-slate-950 border border-amber-400 text-[10px] font-extrabold shadow-xs">
                      Subsíndica
                    </span>
                  )}
                </div>

                {morador.profissao && (
                  <p className="text-xs text-amber-900 font-extrabold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-800" />
                    {morador.profissao}
                  </p>
                )}

                {/* Details Pills: Parking Space, Hobby, Birthday */}
                <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 text-slate-900 border border-white/80 shadow-2xs font-bold">
                    <Car className="w-3.5 h-3.5 text-amber-700" /> Vaga: {morador.vagaGaragem || selectedUnidade.vagaGaragem}
                  </span>

                  {morador.hobby && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 text-slate-900 border border-white/80 shadow-2xs font-semibold">
                      <Heart className="w-3.5 h-3.5 text-rose-600" /> {morador.hobby}
                    </span>
                  )}

                  {morador.aniversario && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 text-slate-900 border border-white/80 shadow-2xs font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-sky-700" /> Niver: {morador.aniversario}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
