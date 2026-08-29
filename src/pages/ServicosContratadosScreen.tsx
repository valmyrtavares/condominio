import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ServicoContratado, StatusServicoContratado } from '../types';
import { 
  Briefcase, 
  ArrowLeft, 
  Search, 
  Phone, 
  MessageCircle, 
  Mail, 
  Globe, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Check, 
  Layers, 
  DollarSign, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const ServicosContratadosScreen: React.FC = () => {
  const { 
    servicosContratados, 
    setCurrentScreen
  } = useCondo();

  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estado para controlar quais cards estão expandidos individualmente (permite abrir múltiplos ao mesmo tempo)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredServicos.forEach(s => {
      allExpanded[s.id] = true;
    });
    setExpandedCards(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  // Extrai todas as categorias únicas disponíveis
  const categoriasDisponiveis = [
    'Todas',
    ...Array.from(new Set(servicosContratados.map(s => s.categoria).filter(Boolean)))
  ];

  // Filtros combinados
  const filteredServicos = servicosContratados.filter(s => {
    const matchCat = filterCategoria === 'Todas' || s.categoria.toLowerCase() === filterCategoria.toLowerCase();
    const matchSt = filterStatus === 'Todas' || s.status === filterStatus;
    const termo = searchTerm.toLowerCase().trim();
    const matchBusca = !termo ||
      s.empresaNome.toLowerCase().includes(termo) ||
      s.categoria.toLowerCase().includes(termo) ||
      s.servicoDescricao.toLowerCase().includes(termo) ||
      (s.responsavelContato && s.responsavelContato.toLowerCase().includes(termo)) ||
      (s.cnpj && s.cnpj.includes(termo));

    return matchCat && matchSt && matchBusca;
  });

  const totalContratadas = servicosContratados.filter(s => s.status === 'Contratada').length;
  const totalOrcadas = servicosContratados.filter(s => s.status === 'Orçada').length;

  const getStatusBadge = (st: StatusServicoContratado) => {
    switch (st) {
      case 'Contratada':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: 'Contratada'
        };
      case 'Orçada':
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
          icon: <Tag className="w-3.5 h-3.5 text-blue-700" />,
          label: 'Orçada'
        };
      case 'Histórico':
      default:
        return {
          bg: 'bg-slate-100 text-slate-900 border-slate-300',
          icon: <Clock className="w-3.5 h-3.5 text-slate-700" />,
          label: 'Histórico'
        };
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button */}
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
          <Briefcase className="w-5 h-5 text-amber-400" />
          Serviços & Fornecedores do Condomínio
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Catálogo interativo de fornecedores contratados e cotados. Toque nos cards para expandir detalhes.
        </p>
      </div>

      {/* Categorias - Estilo Pills (Igual ao módulo de Regras) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          {categoriasDisponiveis.map((cat) => {
            const isSelected = filterCategoria === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategoria(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border shadow-xs shrink-0 cursor-pointer font-extrabold ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-md'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {cat === 'Todas' ? 'Todos' : cat}
              </button>
            );
          })}
        </div>

        {/* Filtro secundário por Situação + Busca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
              Situação:
            </span>
            {['Todas', 'Contratada', 'Orçada'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-900 text-amber-300 border-slate-900 font-black shadow-2xs'
                    : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
                }`}
              >
                {st === 'Todas' ? 'Todas' : st === 'Contratada' ? '✓ Contratadas' : '📋 Orçadas'}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por empresa, serviço ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

        </div>
      </div>

      {/* Cabeçalho da Lista com Contador e Botões Expandir/Recolher Todos */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow">
          Empresas & Cotações ({filteredServicos.length})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] font-extrabold text-amber-300 hover:underline cursor-pointer drop-shadow"
          >
            Abrir todos
          </button>
          <span className="text-white/40 text-xs">•</span>
          <button
            onClick={collapseAll}
            className="text-[11px] font-extrabold text-amber-300 hover:underline cursor-pointer drop-shadow"
          >
            Fechar todos
          </button>
        </div>
      </div>

      {/* Lista de Cards Sanfonados (Accordion Compacto como Regras de Condomínio) */}
      <div className="space-y-2.5">
        {filteredServicos.length === 0 ? (
          <div className="p-8 text-center bg-white/45 border border-white/65 rounded-3xl space-y-2 backdrop-blur-xs">
            <p className="text-sm font-black text-slate-950">Nenhuma empresa encontrada para este filtro.</p>
            <button
              onClick={() => { setFilterCategoria('Todas'); setFilterStatus('Todas'); setSearchTerm(''); }}
              className="text-xs text-indigo-900 font-extrabold hover:underline cursor-pointer"
            >
              Limpar filtros e ver todas as empresas
            </button>
          </div>
        ) : (
          filteredServicos.map((servico) => {
            const isExpanded = !!expandedCards[servico.id];
            const badge = getStatusBadge(servico.status);
            const isContratada = servico.status === 'Contratada';

            return (
              <div
                key={servico.id}
                className={`border rounded-3xl overflow-hidden shadow-lg transition-all duration-300 backdrop-blur-xs ${
                  isContratada
                    ? 'bg-white/50 border-emerald-300/80 hover:bg-white/60'
                    : 'bg-white/45 border-white/60 hover:bg-white/55'
                }`}
              >
                
                {/* CABEÇALHO COMPACTO (Sempre Visível - Clicável) */}
                <button
                  type="button"
                  onClick={() => toggleCard(servico.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                >
                  <div className="space-y-1.5 min-w-0 pr-2">
                    
                    {/* Título da Empresa */}
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-950 leading-tight">
                      {servico.empresaNome}
                    </h3>

                    {/* Chips de Categoria e Status */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-slate-900 text-amber-300 shadow-2xs">
                        {servico.categoria}
                      </span>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      {servico.valor && (
                        <span className="text-[11px] font-black font-mono text-slate-900 bg-white/70 px-2 py-0.5 rounded-lg border border-white/90">
                          R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          {servico.tipoValor === 'mensal' && <span className="text-[10px] font-normal text-slate-600">/mês</span>}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Botão Chevron Circular com Transição de Rotação */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/70 border border-white/90 text-slate-900 shadow-xs flex items-center justify-center">
                    <ChevronDown className={`w-4 h-4 text-slate-900 transition-transform duration-300 ease-in-out ${
                      isExpanded ? 'transform rotate-180' : 'transform rotate-0'
                    }`} />
                  </div>
                </button>

                {/* CORPO EXPANSÍVEL COM TRANSIÇÃO SUAVE DE GRID */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-5 space-y-3.5 border-t border-slate-950/10 pt-3.5">
                      
                      {/* Identificação Fiscal / CNPJ */}
                      {servico.cnpj && (
                        <div className="text-[11px] font-mono text-slate-600">
                          CNPJ: <strong className="text-slate-900 font-bold">{servico.cnpj}</strong>
                        </div>
                      )}

                      {/* Valor e Condições Financeiras */}
                      {servico.valor && (
                        <div className="bg-white/70 border border-white/90 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <span className="text-[9px] uppercase font-extrabold text-slate-600 block">
                              {isContratada ? 'Valor do Contrato:' : 'Valor da Cotação / Orçamento:'}
                            </span>
                            <strong className="text-base font-black text-slate-950 tracking-tight font-mono">
                              R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              {servico.tipoValor === 'mensal' && <span className="text-xs font-normal text-slate-600"> / mês</span>}
                              {servico.tipoValor === 'semestral' && <span className="text-xs font-normal text-slate-600"> / semestral</span>}
                              {servico.tipoValor === 'anual' && <span className="text-xs font-normal text-slate-600"> / ano</span>}
                              {servico.tipoValor === 'pontual' && <span className="text-xs font-normal text-slate-600"> (serviço pontual)</span>}
                            </strong>
                          </div>

                          {servico.formaPagamento && (
                            <div className="text-left sm:text-right text-xs text-slate-700 font-medium">
                              Condições: <strong className="text-slate-950 font-bold">{servico.formaPagamento}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Escopo do Serviço */}
                      <div className="bg-white/50 border border-white/80 p-3.5 rounded-2xl space-y-1 shadow-2xs">
                        <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                          Escopo do Serviço:
                        </span>
                        <p className="text-xs text-slate-950 font-medium leading-relaxed">
                          {servico.servicoDescricao}
                        </p>
                      </div>

                      {/* Parecer da Sindicância */}
                      {servico.observacoes && (
                        <div className="p-3 bg-amber-500/15 border border-amber-300/70 rounded-2xl text-xs flex items-start gap-2.5 shadow-2xs">
                          <ShieldCheck className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                          <div className="text-[11px] text-amber-950 font-medium leading-snug">
                            <strong>Parecer da Gestão:</strong> {servico.observacoes}
                          </div>
                        </div>
                      )}

                      {/* Responsável e Data */}
                      <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
                        {servico.responsavelContato && (
                          <div className="text-[11px]">
                            Contato: <strong className="text-slate-950 font-bold">{servico.responsavelContato}</strong>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 font-semibold ml-auto flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {servico.dataContratoOuOrcamento}
                        </div>
                      </div>

                      {/* Botões de Ação Rápida */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                        {servico.whatsapp && (
                          <a
                            href={`https://wa.me/${servico.whatsapp}?text=Olá%20${encodeURIComponent(servico.empresaNome)},%20sou%20morador%20do%20Residencial%20Jardim%20Paulista.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <a
                          href={`tel:${servico.telefone}`}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>{servico.telefone}</span>
                        </a>

                        {servico.siteUrl && (
                          <a
                            href={servico.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 col-span-2 sm:col-span-1 cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Site Oficial</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
