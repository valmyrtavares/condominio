import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { EditResidentCellModal } from '../components/moradores/EditResidentCellModal';
import { ResidentMessagesModal } from '../components/moradores/ResidentMessagesModal';
import { Car, Search, Building2, ShieldCheck, Edit3, MessageSquare, Bell } from 'lucide-react';

export const MoradoresScreen: React.FC = () => {
  const { 
    unidades, 
    currentUser, 
    isAdminLoggedIn, 
    notificacoesPrivadas,
    marcarTodasNotificacoesUnidadeComoLidas 
  } = useCondo();
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string>(unidades[1]?.id || unidades[0]?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const selectedUnidade = unidades.find(u => u.id === selectedUnidadeId) || unidades[0];

  const filteredUnidades = unidades.filter(u => 
    u.numero.includes(searchTerm) || 
    u.moradores.some(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const normalizeUnit = (str?: string) => str ? str.toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim() : '';
  const isMyUnit = Boolean(
    currentUser?.unidade &&
    selectedUnidade?.numero &&
    normalizeUnit(currentUser.unidade) === normalizeUnit(selectedUnidade.numero)
  );
  // Privilégio de ver todas as notificações é exclusivo para quem está com perfil de Síndico/Subsíndico ativo
  const isSindicoOrAdmin = currentUser?.role === 'sindico' || currentUser?.role === 'subsindico';
  const canEdit = Boolean(isMyUnit || isSindicoOrAdmin);

  // Notificações privadas desta unidade específica
  const unitNotifs = notificacoesPrivadas.filter(
    n => selectedUnidade && normalizeUnit(n.unidadeNumero) === normalizeUnit(selectedUnidade.numero)
  );
  const unitUnreadCount = unitNotifs.filter(n => !n.lida).length;

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

            const isThisTabMine = Boolean(
              currentUser?.unidade &&
              normalizeUnit(currentUser.unidade) === normalizeUnit(u.numero)
            );
            const canSeeTabNotif = Boolean(isThisTabMine || isSindicoOrAdmin);

            const hasUnread = canSeeTabNotif && notificacoesPrivadas.some(
              n => !n.lida && normalizeUnit(n.unidadeNumero) === normalizeUnit(u.numero)
            );

            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnidadeId(u.id)}
                className={`relative px-3.5 py-1.5 rounded-full border text-xs font-extrabold transition-all shrink-0 shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {title}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Details — Unified Household Cell Card */}
      {selectedUnidade && (() => {
        const isUnidadeVazia = selectedUnidade.semMoradores || selectedUnidade.statusCadastro === 'Vazio';
        const hasMoradorConfigurado = !isUnidadeVazia && Boolean(
          (selectedUnidade.moradores && selectedUnidade.moradores.length > 0) || 
          selectedUnidade.fotoCelula
        );

        const unitLabel = selectedUnidade.numero.toLowerCase().startsWith('apt') || selectedUnidade.numero.toLowerCase().startsWith('cobertura')
          ? selectedUnidade.numero
          : `Apt ${selectedUnidade.numero}`;

        const canSeeNotifications = Boolean(isMyUnit || isSindicoOrAdmin);

        if (!hasMoradorConfigurado) {
          return (
            <div className="bg-white/45 border border-white/60 rounded-3xl p-4 sm:p-5 shadow-xl hover:bg-white/55 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Quadrado vazio sem foto */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-500/40 bg-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <div className="w-7 h-7 rounded-xl border border-slate-400/40 bg-white/20" />
                    <span className="text-[9px] font-black text-slate-700 mt-1">{unitLabel}</span>
                  </div>

                  {/* Morador sem dados configurados ou Unidade Vazia */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                      {isUnidadeVazia ? 'Unidade Vazia (Sem Moradores)' : 'Morador sem dados configurados'}
                    </h3>
                    {selectedUnidade.vagaGaragem && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 text-slate-900 border border-white/80 shadow-2xs text-[11px] font-bold">
                        <Car className="w-3.5 h-3.5 text-amber-800" /> Vaga: {selectedUnidade.vagaGaragem}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {canSeeNotifications && (
                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-md font-black text-xs transition-all active:scale-95 cursor-pointer ${
                        unitUnreadCount > 0
                          ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Todas notificações {unitUnreadCount > 0 ? `(${unitUnreadCount})` : `(${unitNotifs.length})`}</span>
                    </button>
                  )}

                  {canEdit && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 shadow-md font-black text-xs transition-all active:scale-95 shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white/45 border border-white/60 rounded-3xl p-5 shadow-xl hover:bg-white/55 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              
              {/* Resident Cell Portrait & Message Link (Left Column) */}
              <div className="relative w-full md:w-44 shrink-0 flex flex-col items-center md:items-stretch">
                <div className="relative w-40 h-40 md:w-44 md:h-44">
                  <img
                    src={selectedUnidade.fotoCelula || 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80'}
                    alt={selectedUnidade.nomeCelula || 'Célula de Moradores'}
                    className="w-full h-full rounded-2xl object-cover border-2 border-white/80 shadow-md"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {unitLabel}
                  </div>
                </div>

                {/* Link / Botão 'Todas notificações' logo abaixo da foto - VISÍVEL APENAS PARA O MORADOR DA PRÓPRIA UNIDADE OU ADMIN */}
                {canSeeNotifications && (
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className={`w-40 md:w-44 mt-2.5 py-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center justify-between gap-1.5 shadow-md cursor-pointer active:scale-95 ${
                      unitUnreadCount > 0
                        ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-rose-500/30 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-900/20'
                    }`}
                    title="Rever todas as notificações e mensagens recebidas da administração"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span className="truncate">Todas notificações</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                      unitUnreadCount > 0
                        ? 'bg-white text-rose-700'
                        : 'bg-emerald-800 text-emerald-100'
                    }`}>
                      {unitUnreadCount > 0 ? `${unitUnreadCount} nova` : unitNotifs.length}
                    </span>
                  </button>
                )}
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

                {/* Operational details & Yellow Edit Button */}
                <div className="border-t border-slate-950/10 pt-3 flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
                  <div className="flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 text-slate-950 border border-white/80 shadow-2xs font-extrabold">
                      <Car className="w-3.5 h-3.5 text-amber-800" /> Vaga de Garagem: {selectedUnidade.vagaGaragem || 'Sem vaga vinculada'}
                    </span>
                    {selectedUnidade.bloco && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 text-slate-950 border border-white/80 shadow-2xs font-extrabold">
                        <Building2 className="w-3.5 h-3.5 text-slate-800" /> Bloco: {selectedUnidade.bloco}
                      </span>
                    )}
                  </div>

                  {/* Botão Editar em Amarelo exibido apenas para o morador desta unidade ou síndico */}
                  {canEdit && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 shadow-md font-black text-xs transition-all active:scale-95 ml-auto cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-950" /> Editar
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Resident Cell Modal */}
      {selectedUnidade && (
        <EditResidentCellModal
          isOpen={isEditModalOpen}
          unidade={selectedUnidade}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Resident Messages Popup Modal */}
      {selectedUnidade && (
        <ResidentMessagesModal
          isOpen={isMessageModalOpen}
          unidade={selectedUnidade}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}

    </div>
  );
};

