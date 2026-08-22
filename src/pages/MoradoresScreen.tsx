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
      
      {/* Title — ONLY "Apartamentos" */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          Apartamentos
        </h2>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Buscar por unidade, nome ou profissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-amber-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 shadow-2xs transition-colors font-medium"
        />
      </div>

      {/* Label — ONLY "Unidades" */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block mb-2">
          Unidades
        </span>

        {/* Horizontal Unit Carousel — Compact Pills (Apt 101, Apt 102...) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredUnidades.map((u) => {
            const isSelected = u.id === selectedUnidadeId;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnidadeId(u.id)}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
                    : 'bg-white text-stone-700 border-amber-200/70 hover:border-amber-400 hover:text-stone-900 shadow-2xs'
                }`}
              >
                Apt {u.numero}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Details — Starts DIRECTLY with Resident Profiles */}
      {selectedUnidade && (
        <div className="space-y-3 pt-1">
          {selectedUnidade.moradores.map((morador) => (
            <div 
              key={morador.id}
              className="bg-gradient-to-b from-white via-amber-50/30 to-stone-50/80 border border-amber-200/70 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs hover:border-amber-300 transition-all"
            >
              {/* Resident Photo */}
              <img
                src={morador.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={morador.nome}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-2xs shrink-0"
              />

              {/* Resident Info — Organized Layout */}
              <div className="flex-1 space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                    {morador.nome}
                  </h3>
                  {morador.role === 'subsindico' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                      Subsíndica
                    </span>
                  )}
                </div>

                {morador.profissao && (
                  <p className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    {morador.profissao}
                  </p>
                )}

                {/* Details Pills: Parking Space, Hobby, Birthday */}
                <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-stone-800 border border-amber-200/80 shadow-2xs font-semibold">
                    <Car className="w-3.5 h-3.5 text-amber-600" /> Vaga: {morador.vagaGaragem || selectedUnidade.vagaGaragem}
                  </span>

                  {morador.hobby && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-stone-700 border border-amber-200/80 shadow-2xs font-medium">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> {morador.hobby}
                    </span>
                  )}

                  {morador.aniversario && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-stone-700 border border-amber-200/80 shadow-2xs font-medium">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" /> Niver: {morador.aniversario}
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
