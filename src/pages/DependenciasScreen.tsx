import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { Dependencia, TipoDependencia, ReservaDependencia } from '../types';
import { 
  Building2, 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  AlertCircle, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Check, 
  Info,
  Layers
} from 'lucide-react';

export const DependenciasScreen: React.FC = () => {
  const { 
    dependencias, 
    reservas, 
    currentUser, 
    solicitarReserva, 
    cancelarReserva, 
    setCurrentScreen 
  } = useCondo();

  const [filterTipo, setFilterTipo] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRegrasId, setExpandedRegrasId] = useState<string | null>(null);

  // Modal Reserva State
  const [selectedDependenciaReserva, setSelectedDependenciaReserva] = useState<Dependencia | null>(null);
  const [dataReserva, setDataReserva] = useState<string>('');
  const [periodoReserva, setPeriodoReserva] = useState<ReservaDependencia['periodo']>('Tarde/Noite (16h-23h)');
  const [concordouRegras, setConcordouRegras] = useState(false);
  const [sucessoFeedback, setSucessoFeedback] = useState(false);

  const tiposOptions: string[] = [
    'Todas',
    'Lazer & Convivência',
    'Esporte & Saúde',
    'Infantil',
    'Infraestrutura & Acesso'
  ];

  // Filter Logic
  const filteredDependencias = dependencias.filter(d => {
    const matchesTipo = filterTipo === 'Todas' || d.tipo === filterTipo;
    const matchesSearch = !searchTerm || 
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.comodidades.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTipo && matchesSearch;
  });

  const minhasReservas = reservas.filter(r => r.moradorId === currentUser.id);

  const handleAbrirReserva = (dep: Dependencia) => {
    setSelectedDependenciaReserva(dep);
    setDataReserva('');
    setPeriodoReserva('Tarde/Noite (16h-23h)');
    setConcordouRegras(false);
    setSucessoFeedback(false);
  };

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDependenciaReserva || !dataReserva || !concordouRegras) return;

    // Converte YYYY-MM-DD para DD/MM/YYYY
    const [ano, mes, dia] = dataReserva.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    solicitarReserva(selectedDependenciaReserva.id, dataFormatada, periodoReserva);
    setSucessoFeedback(true);
    setTimeout(() => {
      setSelectedDependenciaReserva(null);
      setSucessoFeedback(false);
    }, 2000);
  };

  const toggleRegras = (id: string) => {
    setExpandedRegrasId(prev => (prev === id ? null : id));
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
          <Building2 className="w-5 h-5 text-amber-400" />
          Dependências & Áreas Comuns
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Conheça as instalações do condomínio, horários de funcionamento, regras de convivência e agendamento de espaços.
        </p>
      </div>

      {/* 1. Minhas Reservas Ativas (se houver) */}
      {minhasReservas.length > 0 && (
        <div className="bg-white/50 border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-emerald-500 text-slate-950 font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-800 block">
                  Suas Reservas Confirmadas
                </span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Agendamentos para a Unidade {currentUser.unidade}
                </h3>
              </div>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              {minhasReservas.length} reserva(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {minhasReservas.map((res) => {
              const dep = dependencias.find(d => d.id === res.dependenciaId);
              return (
                <div 
                  key={res.id}
                  className="bg-white/80 border border-white/90 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-0.5 min-w-0">
                    <strong className="text-xs font-black text-slate-950 block truncate">
                      {dep?.nome || 'Espaço do Condomínio'}
                    </strong>
                    <div className="text-[11px] text-slate-800 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{res.dataReserva}</span>
                      <span>•</span>
                      <span>{res.periodo}</span>
                    </div>
                    {res.valorTaxa && (
                      <span className="text-[10px] text-emerald-900 font-bold block">
                        Taxa de limpeza: R$ {res.valorTaxa.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => cancelarReserva(res.id)}
                    className="text-[10px] text-rose-700 hover:text-rose-900 font-extrabold px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
                  >
                    Cancelar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Filtros e Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Espaços:
          </span>
          {tiposOptions.map((tp) => (
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

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por espaço (ex: Piscina, Academia, Salão de Festas, Brinquedoteca)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* 3. Grid de Cards das Dependências com Imagens Fornecidas */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Espaços do Condomínio ({filteredDependencias.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDependencias.map((dep) => {
            const isRegrasOpen = expandedRegrasId === dep.id;

            return (
              <div
                key={dep.id}
                className="bg-white/45 border border-white/60 rounded-3xl overflow-hidden shadow-xl hover:bg-white/55 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Foto da Dependência */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dep.foto}
                      alt={dep.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-between p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-950/70 text-amber-300 backdrop-blur-xs border border-amber-400/40">
                          {dep.tipo}
                        </span>

                        {dep.requerReserva ? (
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-md">
                            Espaço Reservável
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md">
                            Uso Livre
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
                          {dep.nome}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Informações Principais: Horário, Capacidade, Taxa */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 border border-white/80 p-2 rounded-xl flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-700 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-extrabold text-slate-600 block">Horário</span>
                          <span className="font-bold text-slate-950 text-[11px] truncate block">{dep.horarioFuncionamento}</span>
                        </div>
                      </div>

                      <div className="bg-white/60 border border-white/80 p-2 rounded-xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-800 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-extrabold text-slate-600 block">Capacidade</span>
                          <span className="font-bold text-slate-950 text-[11px] block">{dep.capacidadePessoas} pessoas</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-900 font-medium leading-relaxed bg-white/40 p-2.5 rounded-xl border border-white/70">
                      {dep.descricao}
                    </p>

                    {/* Comodidades & Equipamentos */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-slate-800 block">
                        Estrutura & Comodidades Inclusas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dep.comodidades.map((com, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/70 text-slate-900 border border-white/90 shadow-2xs"
                          >
                            ✓ {com}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Regras e Normas (Colapsável) */}
                    <div className="border-t border-slate-950/10 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleRegras(dep.id)}
                        className="w-full flex items-center justify-between text-[11px] font-extrabold text-slate-800 hover:text-slate-950 py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-700" />
                          Regras de Convivência & Uso
                        </span>
                        {isRegrasOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isRegrasOpen && (
                        <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-white/80 mt-1.5 animate-in slide-in-from-top-1 text-xs">
                          {dep.regrasUso.map((reg, idx) => (
                            <p key={idx} className="text-[11px] text-slate-900 font-medium leading-tight flex items-start gap-1.5">
                              <span className="text-amber-700 font-bold">•</span>
                              <span>{reg}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ação: Agendar ou Informação de Acesso */}
                <div className="p-4 pt-0">
                  {dep.requerReserva ? (
                    <button
                      type="button"
                      onClick={() => handleAbrirReserva(dep)}
                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar / Reservar Espaço</span>
                      {dep.taxaReserva && (
                        <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md font-mono">
                          R$ {dep.taxaReserva.toFixed(2)}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-center">
                      <span className="text-xs font-extrabold text-emerald-950 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Acesso Livre para Moradores no Horário de Funcionamento
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Modal de Agendamento / Reserva */}
      {selectedDependenciaReserva && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pt-20 pb-24 sm:py-6 px-3 sm:px-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto max-h-[calc(100vh-170px)] sm:max-h-[85vh] flex flex-col">
            
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-950">
                    Reserva: {selectedDependenciaReserva.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Unidade solicitante: {currentUser.unidade} - {currentUser.bloco}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDependenciaReserva(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <form onSubmit={handleConfirmarReserva} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {sucessoFeedback ? (
                <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-300 animate-in zoom-in-95">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-emerald-950">Reserva Confirmada com Sucesso!</h4>
                  <p className="text-xs text-emerald-900 font-medium">
                    A reserva foi cadastrada para o seu apartamento e comunicada à portaria e zeladoria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Escolha a Data do Evento:
                    </label>
                    <input
                      type="date"
                      value={dataReserva}
                      onChange={(e) => setDataReserva(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Turno / Período:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(['Manhã (09h-14h)', 'Tarde/Noite (16h-23h)', 'Dia Inteiro'] as ReservaDependencia['periodo'][]).map((per) => (
                        <button
                          key={per}
                          type="button"
                          onClick={() => setPeriodoReserva(per)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            periodoReserva === per
                              ? 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold'
                          }`}
                        >
                          {per}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDependenciaReserva.taxaReserva && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-950">Taxa de Limpeza Pós-Evento:</span>
                      <strong className="text-sm font-black text-amber-900 font-mono">
                        R$ {selectedDependenciaReserva.taxaReserva.toFixed(2)}
                      </strong>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                      Normas Obrigatórias da Reserva:
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 font-medium">
                      <li>Horário de silêncio rigoroso a partir das 22:00.</li>
                      <li>Envio da lista de convidados na portaria com antecedência.</li>
                      <li>Vistoria de entrega do espaço no dia seguinte pela zeladoria.</li>
                    </ul>
                  </div>

                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={concordouRegras}
                      onChange={(e) => setConcordouRegras(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                      required
                    />
                    <span className="text-[11px] text-slate-800 font-bold">
                      Li e concordo com o regulamento interno e regras de uso do espaço.
                    </span>
                  </label>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDependenciaReserva(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!concordouRegras || !dataReserva}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
