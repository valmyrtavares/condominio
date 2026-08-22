import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Users, Car, Briefcase, Heart, Calendar, Building, Search } from 'lucide-react';

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
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Comunidade de Moradores
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Conheça os vizinhos e as unidades do Residencial Jardim Paulista
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Buscar por unidade, nome ou profissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs transition-colors"
        />
      </div>

      {/* Units Selector Horizontal Bar */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
          Unidades do Condomínio ({filteredUnidades.length})
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredUnidades.map((u) => {
            const isSelected = u.id === selectedUnidadeId;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnidadeId(u.id)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Apt {u.numero}
                <span className="text-[10px] opacity-80 font-medium">({u.bloco})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Details Card */}
      {selectedUnidade && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                  {selectedUnidade.tipo} • {selectedUnidade.bloco}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Apartamento {selectedUnidade.numero}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-semibold shadow-2xs">
                <Car className="w-4 h-4 text-amber-600" />
                Vaga: <strong className="text-slate-900">{selectedUnidade.vagaGaragem}</strong>
              </div>
            </div>

            {/* Resident Cards */}
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Moradores Registrados
              </span>

              {selectedUnidade.moradores.map((morador) => (
                <div 
                  key={morador.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <img
                    src={morador.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={morador.nome}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm shrink-0"
                  />

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {morador.nome}
                      </h4>
                      {morador.role === 'subsindico' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold">
                          Subsíndica
                        </span>
                      )}
                    </div>

                    {morador.profissao && (
                      <p className="text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        {morador.profissao}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                      {morador.hobby && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-2xs font-medium">
                          <Heart className="w-3 h-3 text-rose-500" /> {morador.hobby}
                        </span>
                      )}
                      {morador.aniversario && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-2xs font-medium">
                          <Calendar className="w-3 h-3 text-sky-500" /> Niver: {morador.aniversario}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
