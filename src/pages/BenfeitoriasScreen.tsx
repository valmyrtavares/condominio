import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { TipoBenfeitoria } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  TrendingDown, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Send, 
  Upload, 
  Layers, 
  DollarSign, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const BenfeitoriasScreen: React.FC = () => {
  const { 
    benfeitorias, 
    currentUser, 
    adicionarBenfeitoria, 
    setCurrentScreen,
    toggleRole 
  } = useCondo();

  const [expandedId, setExpandedId] = useState<string | null>('benf-esteira-academia');
  const [filterTipo, setFilterTipo] = useState<string>('Todas');

  // Form State
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [tipo, setTipo] = useState<TipoBenfeitoria>('Nova Aquisição & Modernização');
  const [descricao, setDescricao] = useState('');
  const [impactoGestao, setImpactoGestao] = useState('');
  const [investimento, setInvestimento] = useState<string>('');
  const [economiaMensal, setEconomiaMensal] = useState<string>('');
  const [regrasUso, setRegrasUso] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  const tiposOptions: TipoBenfeitoria[] = [
    'Grande Reparo & Manutenção',
    'Nova Aquisição & Modernização',
    'Equilíbrio Financeiro & Economia',
    'Área Comum & Convivência'
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!titulo.trim() || !descricao.trim() || !impactoGestao.trim()) return;

    const investNum = investimento ? parseFloat(investimento) : undefined;
    const econNum = economiaMensal ? parseFloat(economiaMensal) : undefined;

    if (fotoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        adicionarBenfeitoria(
          titulo,
          subtitulo || 'Melhoria entregue pela administração',
          tipo,
          descricao,
          impactoGestao,
          [result],
          investNum,
          econNum,
          regrasUso
        );
      };
      reader.readAsDataURL(fotoFile);
    } else {
      adicionarBenfeitoria(
        titulo,
        subtitulo || 'Melhoria entregue pela administração',
        tipo,
        descricao,
        impactoGestao,
        [],
        investNum,
        econNum,
        regrasUso
      );
    }

    setTitulo('');
    setSubtitulo('');
    setDescricao('');
    setImpactoGestao('');
    setInvestimento('');
    setEconomiaMensal('');
    setRegrasUso('');
    setFotoFile(null);
  };

  // Filter Logic
  const filteredBenfeitorias = benfeitorias.filter(b => {
    if (filterTipo === 'Todas') return true;
    return b.tipo === filterTipo;
  });

  // Calculate stats
  const totalEconomia = benfeitorias.reduce((acc, curr) => acc + (curr.economiaMensal || 0), 0);

  const getTipoBadgeStyle = (t: TipoBenfeitoria) => {
    switch (t) {
      case 'Equilíbrio Financeiro & Economia':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold';
      case 'Grande Reparo & Manutenção':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Nova Aquisição & Modernização':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      case 'Área Comum & Convivência':
        return 'bg-sky-100 text-sky-950 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <button
          onClick={toggleRole}
          className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-950 text-[11px] font-extrabold shadow-sm border border-white/80 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
          <span>Perfil: <strong>{isAdmin ? 'Síndica (Admin)' : 'Morador'}</strong> (Clique p/ alternar)</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Benfeitorias & Realizações da Gestão
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Painel de transparência: tudo o que foi transformado, grandes reparos resolvidos e o equilíbrio financeiro do condomínio.
        </p>
      </div>

      {/* Management Balance Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/50 border border-white/70 p-3.5 rounded-3xl shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-950 border border-amber-400/40">
            <CheckCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Entregas Realizadas
            </span>
            <span className="text-base font-extrabold text-slate-950">
              {benfeitorias.length} Obras & Aquisições
            </span>
          </div>
        </div>

        <div className="bg-white/50 border border-white/70 p-3.5 rounded-3xl shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-950 border border-emerald-400/40">
            <TrendingDown className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Economia Mensal Gerada
            </span>
            <span className="text-base font-extrabold text-emerald-900">
              + R$ {totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </span>
          </div>
        </div>

        <div className="bg-white/50 border border-white/70 p-3.5 rounded-3xl shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-950 border border-indigo-400/40">
            <DollarSign className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Equilíbrio das Contas
            </span>
            <span className="text-base font-extrabold text-indigo-950">
              Fundo 100% Preservado
            </span>
          </div>
        </div>
      </div>

      {/* Form: Exclusivo para o Síndico (Desabilitado quando morador) */}
      <div className={`bg-white/45 border rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 transition-all ${
        isAdmin ? 'border-amber-400/80 ring-2 ring-amber-400/30' : 'border-white/60 opacity-90'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-950">
            {isAdmin ? (
              <Plus className="w-5 h-5 text-amber-900" />
            ) : (
              <Lock className="w-5 h-5 text-slate-700" />
            )}
            <h3 className="text-sm font-extrabold uppercase tracking-wider">
              Cadastrar Nova Benfeitoria / Prestação de Gestão
            </h3>
          </div>

          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
            isAdmin 
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
              : 'bg-amber-100 text-amber-950 border-amber-300'
          }`}>
            {isAdmin ? '✓ Acesso Habilitado (Síndico)' : '🔒 Bloqueado: Apenas Síndico'}
          </span>
        </div>

        {!isAdmin && (
          <div className="p-3 bg-amber-500/15 border border-amber-400/50 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 font-semibold">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                Este formulário é de uso restrito do Síndico para publicar melhorias e grandes reparos concluídos.
              </p>
              <button
                type="button"
                onClick={toggleRole}
                className="text-indigo-800 font-extrabold hover:underline block"
              >
                Alternar para perfil de Síndica para testar a inclusão →
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <fieldset disabled={!isAdmin} className="space-y-3 disabled:opacity-60 disabled:cursor-not-allowed">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Title */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Título da Conquista / Obra
                </label>
                <input
                  type="text"
                  placeholder="Ex: Reforma da Brinquedoteca ou Nova Esteira"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Subtítulo / Resumo Curto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aquisição com economia de 30% e garantia estendida"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Type */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Tipo da Benfeitoria
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoBenfeitoria)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white font-semibold shadow-xs"
                >
                  {tiposOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Investimento */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Investimento Realizado (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 3400.00"
                  value={investimento}
                  onChange={(e) => setInvestimento(e.target.value)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
              </div>

              {/* Economia Mensal */}
              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Economia Mensal Gerada (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 850.00 (opcional)"
                  value={economiaMensal}
                  onChange={(e) => setEconomiaMensal(e.target.value)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                Descrição Detalhada do que foi Realizado
              </label>
              <textarea
                placeholder="Descreva o estado anterior, o conserto/compra efetuada e os fornecedores contratados..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs resize-none"
                required
              />
            </div>

            {/* Impacto Gestão */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                Impacto na Gestão & Equilíbrio das Contas
              </label>
              <input
                type="text"
                placeholder="Ex: Redução de despesas, atendimento a demanda antiga dos moradores ou preservação de reserva"
                value={impactoGestao}
                onChange={(e) => setImpactoGestao(e.target.value)}
                className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
                required
              />
            </div>

            {/* File Upload and Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative w-full sm:w-auto">
                <input
                  type="file"
                  id="benfeitoria-foto-input"
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="benfeitoria-foto-input"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/80 hover:bg-white border border-white/90 rounded-xl text-[11px] text-slate-950 font-extrabold cursor-pointer shadow-sm transition-all active:scale-95 w-full sm:w-auto text-center truncate"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <span className="truncate">{fotoFile ? `Foto: ${fotoFile.name}` : 'Anexar Foto de Entrega'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isAdmin}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Publicar Benfeitoria no Mural</span>
              </button>
            </div>

          </fieldset>
        </form>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
        {['Todas', ...tiposOptions].map((tp) => (
          <button
            key={tp}
            onClick={() => setFilterTipo(tp)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
              filterTipo === tp
                ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
            }`}
          >
            {tp}
          </button>
        ))}
      </div>

      {/* Expandable Cards List (Pattern Services for Residents) */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Histórico de Entregas & Obras Concluídas ({filteredBenfeitorias.length})
        </span>

        {filteredBenfeitorias.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white/45 border border-white/60 rounded-3xl overflow-hidden shadow-xl hover:bg-white/55 transition-all duration-300"
            >
              {/* Compact Header (Always Visible) */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${getTipoBadgeStyle(item.tipo)}`}>
                      {item.tipo}
                    </span>
                    <span className="text-[11px] text-slate-800 font-mono font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" /> Entrega: {item.dataEntrega}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight">
                    {item.titulo}
                  </h3>

                  <p className="text-xs text-slate-800 font-semibold line-clamp-1">
                    {item.subtitulo}
                  </p>
                </div>

                <div className="shrink-0 p-2 rounded-full bg-white/60 border border-white/80 text-slate-900 shadow-xs">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable Content Body */}
              {isExpanded && (
                <div className="px-4 pb-5 space-y-4 border-t border-slate-950/10 pt-4 animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Photo Gallery */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.fotosAntes && item.fotosAntes.length > 0 && (
                      <div className="relative rounded-2xl overflow-hidden border border-white/80 h-44 group shadow-md">
                        <img 
                          src={item.fotosAntes[0]} 
                          alt="Antes da melhoria" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 flex items-end p-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white shadow-xs">
                            Estado Anterior (Avaria/Desgaste)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={`relative rounded-2xl overflow-hidden border border-white/80 h-44 group shadow-md ${
                      !item.fotosAntes || item.fotosAntes.length === 0 ? 'sm:col-span-2' : ''
                    }`}>
                      <img 
                        src={item.fotos[0]} 
                        alt={item.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/25 flex items-end p-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                          Entrega Concluída ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="bg-white/60 border border-white/80 p-3.5 rounded-2xl text-xs space-y-2">
                    <h4 className="font-extrabold text-slate-950 uppercase tracking-wide text-[11px]">
                      O que foi realizado:
                    </h4>
                    <p className="text-slate-900 leading-relaxed font-semibold">
                      {item.descricao}
                    </p>
                  </div>

                  {/* Highlights Grid: Gestão & Finanças */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Impact on Management and Accounts */}
                    <div className="bg-amber-500/15 border border-amber-400/50 p-3 rounded-2xl text-xs space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-950 uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Impacto na Gestão & Contas
                      </span>
                      <p className="text-slate-950 font-bold leading-snug">
                        {item.impactoGestao}
                      </p>
                    </div>

                    {/* Financial Values */}
                    <div className="bg-emerald-500/15 border border-emerald-400/50 p-3 rounded-2xl text-xs space-y-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 font-extrabold">Investimento Total:</span>
                        <strong className="text-slate-950 font-extrabold">
                          {item.investimento ? `R$ ${item.investimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Ver prestação'}
                        </strong>
                      </div>
                      {item.economiaMensal && (
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-400/30">
                          <span className="text-emerald-950 font-extrabold">Economia Estimada:</span>
                          <strong className="text-emerald-800 font-extrabold">
                            + R$ {item.economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                          </strong>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Rules of Use (If applicable) */}
                  {item.regrasUso && (
                    <div className="p-3 rounded-2xl bg-white/50 border border-white/70 text-xs">
                      <span className="text-[10px] font-extrabold text-slate-800 uppercase block mb-1">
                        Regras de Utilização:
                      </span>
                      <p className="text-slate-900 font-medium">
                        {item.regrasUso}
                      </p>
                    </div>
                  )}

                  {/* Link to Prestação de Contas */}
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => setCurrentScreen('prestacao-contas')}
                      className="inline-flex items-center gap-1 text-xs text-indigo-800 font-extrabold hover:underline"
                    >
                      Consultar lançamento na Prestação de Contas <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
