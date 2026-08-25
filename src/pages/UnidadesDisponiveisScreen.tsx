import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { UnidadeDisponivel, FinalidadeImovel } from '../types';
import { 
  KeyRound, 
  ArrowLeft, 
  Search, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Car, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Tag, 
  DollarSign, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const UnidadesDisponiveisScreen: React.FC = () => {
  const { unidadesDisponiveis, setCurrentScreen, currentUser } = useCondo();
  const [filterFinalidade, setFilterFinalidade] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const finalidadeOptions = ['Todas', 'Aluga-se', 'Vende-se'];

  // Filter Logic
  const filteredUnidades = unidadesDisponiveis.filter(uni => {
    const matchesFilter = filterFinalidade === 'Todas' || 
      uni.finalidade === filterFinalidade || 
      uni.finalidade === 'Aluga-se ou Vende-se';

    const matchesSearch = !searchTerm ||
      uni.apartamento.includes(searchTerm) ||
      uni.bloco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.proprietarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.descricaoCurta.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getFinalidadeBadge = (finalidade: FinalidadeImovel) => {
    switch (finalidade) {
      case 'Aluga-se':
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
          text: '🔑 Aluga-se'
        };
      case 'Vende-se':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          text: '🏷️ Vende-se'
        };
      case 'Aluga-se ou Vende-se':
      default:
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300',
          text: '✨ Aluga ou Vende'
        };
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
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
          <KeyRound className="w-5 h-5 text-amber-400" />
          Unidades Disponíveis
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Mural de apartamentos para locação e venda no condomínio com contato direto do proprietário.
        </p>
      </div>

      {/* Aviso de Privacidade Exclusiva para Condôminos */}
      <div className="p-3.5 bg-white/50 border border-emerald-400/60 rounded-3xl flex items-center gap-3 shadow-md backdrop-blur-xs">
        <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-950 shrink-0 border border-emerald-400/40">
          <Lock className="w-4 h-4 text-emerald-800" />
        </div>
        <div className="text-xs">
          <span className="font-extrabold text-slate-950 block leading-tight">
            Acesso Restrito a Condôminos
          </span>
          <p className="text-[11px] text-slate-800 font-medium mt-0.5">
            Dados de contato dos proprietários disponíveis exclusivamente para moradores logados do condomínio.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Modalidade:
          </span>
          {finalidadeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterFinalidade(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                filterFinalidade === opt
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por número do apto, bloco ou proprietário (ex: 204, 502, Roberto)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* Grid de Cards Pequenos de Unidades Disponíveis */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Apartamentos Anunciados ({filteredUnidades.length})
        </span>

        {filteredUnidades.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-white/70 rounded-3xl space-y-2">
            <p className="text-sm font-black text-slate-950">Nenhuma unidade encontrada para esta busca.</p>
            <button
              onClick={() => { setFilterFinalidade('Todas'); setSearchTerm(''); }}
              className="text-xs text-indigo-800 font-bold hover:underline"
            >
              Ver todas as unidades disponíveis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredUnidades.map((unidade) => {
              const badge = getFinalidadeBadge(unidade.finalidade);
              const isVenda = unidade.finalidade === 'Vende-se';

              return (
                <div
                  key={unidade.id}
                  className="bg-white/50 border-2 border-white/70 rounded-3xl p-4 sm:p-5 shadow-xl hover:bg-white/60 transition-all flex flex-col justify-between space-y-3 backdrop-blur-xs"
                >
                  {/* Cabeçalho do Card Pequeno: Número do Apto e Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-950/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-950 font-black border border-amber-400/40">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-950 leading-tight">
                          Apto {unidade.apartamento}
                        </h3>
                        <span className="text-[11px] text-slate-700 font-bold block">
                          {unidade.bloco}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs ${badge.bg}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Valor Principal em Destaque */}
                  <div className="bg-white/70 border border-white/90 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-extrabold text-slate-600 block">
                        {isVenda ? 'Valor de Venda:' : 'Valor de Locação:'}
                      </span>
                      <strong className="text-base sm:text-lg font-black text-slate-950 tracking-tight font-mono">
                        R$ {unidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {!isVenda && <span className="text-xs font-normal text-slate-600"> / mês</span>}
                      </strong>
                    </div>

                    {unidade.valorCondominio && (
                      <div className="text-right text-[10px] text-slate-700 font-semibold space-y-0.5">
                        <div>Condomínio: <strong className="text-slate-900 font-mono">R$ {unidade.valorCondominio.toFixed(2)}</strong></div>
                        {unidade.valorIptu && <div>IPTU: <strong className="text-slate-900 font-mono">R$ {unidade.valorIptu.toFixed(2)}</strong></div>}
                      </div>
                    )}
                  </div>

                  {/* Características do Imóvel: Metragem, Quartos, Vagas */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white/60 border border-white/80 space-y-0.5">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-700 mx-auto" />
                      <span className="text-[10px] font-extrabold text-slate-950 block">{unidade.metragemM2} m²</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/60 border border-white/80 space-y-0.5">
                      <BedDouble className="w-3.5 h-3.5 text-amber-700 mx-auto" />
                      <span className="text-[10px] font-extrabold text-slate-950 block">{unidade.quartos} Quartos</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/60 border border-white/80 space-y-0.5">
                      <Car className="w-3.5 h-3.5 text-emerald-700 mx-auto" />
                      <span className="text-[10px] font-extrabold text-slate-950 block">{unidade.vagasGaragem} Vaga(s)</span>
                    </div>
                  </div>

                  {/* Descrição Curta */}
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white/40 p-2.5 rounded-xl border border-white/70">
                    {unidade.descricaoCurta}
                  </p>

                  {/* Contato do Proprietário / Responsável (Direto) */}
                  <div className="pt-2 border-t border-slate-950/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-600">
                        Proprietário / Responsável:
                      </span>
                      <strong className="text-slate-950 font-extrabold">
                        {unidade.proprietarioNome}
                      </strong>
                    </div>

                    {/* Botões de Ação Rápida: WhatsApp e Telefone */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <a
                        href={`https://wa.me/${unidade.proprietarioWhatsapp}?text=Olá%20${encodeURIComponent(unidade.proprietarioNome)},%20sou%20morador%20do%20condomínio%20e%20vi%20o%20anúncio%20do%20Apto%20${unidade.apartamento}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${unidade.proprietarioTelefone}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{unidade.proprietarioTelefone}</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
