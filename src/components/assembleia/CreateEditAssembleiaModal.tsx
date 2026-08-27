import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { 
  Assembleia, 
  PautaAssembleia, 
  TipoEncontroAssembleia,
  OrigemPautaAssembleia,
  StatusAssembleia
} from '../../types';
import { 
  X, 
  Gavel, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Wrench, 
  FileText, 
  Users, 
  Check, 
  Building2,
  Sparkles,
  Layers,
  HelpCircle,
  Bell
} from 'lucide-react';

interface CreateEditAssembleiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  assembleiaToEdit?: Assembleia | null;
}

const PRESET_LOCAIS = [
  'Salão de Festas & Espaço Gourmet',
  'Churrasqueira Gourmet & Deck',
  'Auditório / Hall Nobre',
  'Deck da Piscina & Solarium',
  'Sala de Reuniões da Administração',
  'Online via Videoconferência (Zoom / Google Meet)',
  'Outro Local'
];

export const CreateEditAssembleiaModal: React.FC<CreateEditAssembleiaModalProps> = ({
  isOpen,
  onClose,
  assembleiaToEdit
}) => {
  const { 
    unidades, 
    reclamacoes, 
    reparos, 
    adicionarAssembleia, 
    editarAssembleia,
    enviarNotificacaoPrivada
  } = useCondo();

  // Estados principais
  const [tipoEncontro, setTipoEncontro] = useState<TipoEncontroAssembleia>('Assembleia Geral');
  const [tipoSubformato, setTipoSubformato] = useState<'Ordinária' | 'Extraordinária' | 'Reunião de Comissão' | 'Reunião com Moradores' | 'Outro'>('Ordinária');
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [primeiraChamada, setPrimeiraChamada] = useState('19:30');
  const [segundaChamada, setSegundaChamada] = useState('20:00');
  const [local, setLocal] = useState(PRESET_LOCAIS[0]);
  const [localCustom, setLocalCustom] = useState('');
  const [descricaoGeral, setDescricaoGeral] = useState('');
  const [status, setStatus] = useState<StatusAssembleia>('Agendada');

  // Participantes (para reuniões informais)
  const [participantesTipo, setParticipantesTipo] = useState<'todos' | 'especificos'>('todos');
  const [participantesSelecionados, setParticipantesSelecionados] = useState<string[]>([]);
  const [participantesDescricao, setParticipantesDescricao] = useState('');

  // Pautas / Assuntos em Pauta
  const [pautas, setPautas] = useState<PautaAssembleia[]>([]);

  // Novo item de pauta temporário
  const [novoTipoOrigem, setNovoTipoOrigem] = useState<OrigemPautaAssembleia>('extra');
  const [selectedOrigemId, setSelectedOrigemId] = useState('');
  const [novoPautaTitulo, setNovoPautaTitulo] = useState('');
  const [novoPautaDescricao, setNovoPautaDescricao] = useState('');

  // Notificar convocados ao salvar
  const [notificarParticipantes, setNotificarParticipantes] = useState(true);

  useEffect(() => {
    if (assembleiaToEdit && isOpen) {
      setTipoEncontro(assembleiaToEdit.tipoEncontro || (assembleiaToEdit.tipo === 'Reunião com Moradores' || assembleiaToEdit.tipo === 'Reunião de Comissão' ? 'Reunião Informal' : 'Assembleia Geral'));
      setTipoSubformato(assembleiaToEdit.tipo);
      setTitulo(assembleiaToEdit.titulo);
      
      // Data ISO
      let dataIso = assembleiaToEdit.dataHora;
      if (dataIso.includes('/')) {
        const parts = dataIso.split('/');
        if (parts.length === 3) {
          dataIso = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      setData(dataIso);
      setPrimeiraChamada(assembleiaToEdit.primeiraChamada || '19:30');
      setSegundaChamada(assembleiaToEdit.segundaChamada || '20:00');
      
      if (PRESET_LOCAIS.includes(assembleiaToEdit.local)) {
        setLocal(assembleiaToEdit.local);
        setLocalCustom('');
      } else {
        setLocal('Outro Local');
        setLocalCustom(assembleiaToEdit.local);
      }
      
      setDescricaoGeral(assembleiaToEdit.descricaoGeral);
      setStatus(assembleiaToEdit.status);
      setParticipantesTipo(assembleiaToEdit.participantesTipo || (assembleiaToEdit.tipoEncontro === 'Reunião Informal' ? 'especificos' : 'todos'));
      setParticipantesSelecionados(assembleiaToEdit.participantesIds || []);
      setParticipantesDescricao(assembleiaToEdit.participantesDescricao || '');
      setPautas(assembleiaToEdit.pautas || []);
    } else if (isOpen) {
      setTipoEncontro('Assembleia Geral');
      setTipoSubformato('Ordinária');
      setTitulo('');
      const today = new Date();
      today.setDate(today.getDate() + 7); // Daqui a 7 dias
      setData(today.toISOString().split('T')[0]);
      setPrimeiraChamada('19:30');
      setSegundaChamada('20:00');
      setLocal(PRESET_LOCAIS[0]);
      setLocalCustom('');
      setDescricaoGeral('');
      setStatus('Agendada');
      setParticipantesTipo('todos');
      setParticipantesSelecionados([]);
      setParticipantesDescricao('');
      setPautas([
        {
          id: `pauta-${Date.now()}-1`,
          titulo: 'Apresentação e Deliberações da Ordem do Dia',
          descricao: 'Discussão dos tópicos prioritários de interesse coletivo dos moradores.',
          origemTipo: 'extra'
        }
      ]);
    }
  }, [assembleiaToEdit, isOpen]);

  if (!isOpen) return null;

  // Handler de seleção de origem de pauta (Reclamação, Reparo ou Extra)
  const handleSelectOrigemPauta = (origemId: string, tipo: OrigemPautaAssembleia) => {
    setSelectedOrigemId(origemId);
    if (tipo === 'reclamacao') {
      const rec = reclamacoes.find(r => r.id === origemId);
      if (rec) {
        setNovoPautaTitulo(`[Reclamação] ${rec.titulo}`);
        setNovoPautaDescricao(`Reclamação aberta pelo morador da Unidade ${rec.autorUnidade} (${rec.categoria}). Detalhes: ${rec.descricao}`);
      }
    } else if (tipo === 'reparo') {
      const rep = reparos.find(r => r.id === origemId);
      if (rep) {
        setNovoPautaTitulo(`[Reparo/Manutenção] ${rep.titulo}`);
        setNovoPautaDescricao(`Reparo de categoria ${rep.categoria} (${rep.porte}). Solicitante: ${rep.solicitanteUnidade}. Status Atual: ${rep.status}. Descrição: ${rep.descricao}`);
      }
    }
  };

  const handleAddPauta = () => {
    if (!novoPautaTitulo.trim()) return;

    const nova: PautaAssembleia = {
      id: `pauta-${Date.now()}`,
      titulo: novoPautaTitulo.trim(),
      descricao: novoPautaDescricao.trim() || 'Sem descrição complementar.',
      origemTipo: novoTipoOrigem,
      origemId: selectedOrigemId || undefined
    };

    setPautas(prev => [...prev, nova]);
    setNovoPautaTitulo('');
    setNovoPautaDescricao('');
    setSelectedOrigemId('');
  };

  const handleRemovePauta = (id: string) => {
    setPautas(prev => prev.filter(p => p.id !== id));
  };

  const toggleParticipanteUnidade = (unidadeNumero: string) => {
    setParticipantesSelecionados(prev => 
      prev.includes(unidadeNumero)
        ? prev.filter(u => u !== unidadeNumero)
        : [...prev, unidadeNumero]
    );
  };

  const handleTipoEncontroChange = (tipo: TipoEncontroAssembleia) => {
    setTipoEncontro(tipo);
    if (tipo === 'Assembleia Geral') {
      setParticipantesTipo('todos');
      setTipoSubformato('Ordinária');
    } else {
      setParticipantesTipo('especificos');
      setTipoSubformato('Reunião de Comissão');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || pautas.length === 0) {
      alert('Por favor, informe o título da reunião e inclua ao menos uma pauta.');
      return;
    }

    // Formatar data dd/mm/aaaa
    let dataFormatada = data;
    if (data.includes('-')) {
      const [year, month, day] = data.split('-');
      dataFormatada = `${day}/${month}/${year}`;
    }

    const localFinal = local === 'Outro Local' && localCustom.trim() ? localCustom.trim() : local;

    const dadosAssembleia = {
      titulo: titulo.trim(),
      tipo: tipoSubformato,
      tipoEncontro,
      participantesTipo: tipoEncontro === 'Assembleia Geral' ? 'todos' : participantesTipo,
      participantesIds: tipoEncontro === 'Reunião Informal' ? participantesSelecionados : undefined,
      participantesDescricao: tipoEncontro === 'Reunião Informal' && participantesDescricao.trim() ? participantesDescricao.trim() : undefined,
      dataHora: dataFormatada,
      primeiraChamada: primeiraChamada.trim(),
      segundaChamada: segundaChamada.trim(),
      local: localFinal,
      status,
      descricaoGeral: descricaoGeral.trim(),
      pautas
    };

    if (assembleiaToEdit) {
      editarAssembleia(assembleiaToEdit.id, dadosAssembleia);
    } else {
      adicionarAssembleia(dadosAssembleia);
    }

    // Notificar participantes se solicitado
    if (notificarParticipantes) {
      const msg = `Convocação: ${tipoEncontro} agendada para ${dataFormatada} às ${primeiraChamada} no ${localFinal}. Pauta: ${titulo.trim()}.`;
      if (tipoEncontro === 'Assembleia Geral' || participantesTipo === 'todos') {
        unidades.forEach(u => {
          enviarNotificacaoPrivada(u.numero, msg, `Convocação: ${titulo.trim()}`);
        });
      } else {
        participantesSelecionados.forEach(num => {
          enviarNotificacaoPrivada(num, msg, `Convocação: ${titulo.trim()}`);
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between border-b border-amber-200/60 bg-amber-500/10 p-4 sm:p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">
                {assembleiaToEdit ? 'Editar Reunião / Assembleia' : 'Agendar Nova Assembleia ou Reunião Informal'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Defina data, pautas integradas a reclamações/reparos e convoque os participantes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
            title="Fechar Janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          {/* Corpo com Scroll Interno */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 overscroll-contain">

          {/* 1. SELEÇÃO DO TIPO DE ENCONTRO (Assembleia Geral vs Reunião Informal) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Tipo de Encontro *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTipoEncontroChange('Assembleia Geral')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  tipoEncontro === 'Assembleia Geral'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 text-slate-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${tipoEncontro === 'Assembleia Geral' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-600'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-black">🏛️ Assembleia Geral</strong>
                  <span className="text-[10px] text-slate-600 leading-tight block mt-0.5">
                    Convocação aberta para <strong>todos os condôminos</strong> (AGO ou AGE formal).
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTipoEncontroChange('Reunião Informal')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  tipoEncontro === 'Reunião Informal'
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/40 text-slate-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${tipoEncontro === 'Reunião Informal' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-black">🤝 Reunião Informal</strong>
                  <span className="text-[10px] text-slate-600 leading-tight block mt-0.5">
                    Encontro específico com <strong>participantes selecionados</strong> (Comissões, Conselho ou Moradores afetados).
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. SELEÇÃO DE PARTICIPANTES (Aparece se for Reunião Informal) */}
          {tipoEncontro === 'Reunião Informal' && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-700" /> Quem vai participar desta reunião? *
                </span>
                <span className="text-[10px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full">
                  {participantesSelecionados.length} unidades selecionadas
                </span>
              </div>

              {/* Grid de Unidades para Seleção Rápida */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 block">
                  Selecione as Unidades / Apartamentos convidados:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-32 overflow-y-auto p-2 bg-white rounded-xl border border-indigo-200">
                  {unidades.map((u) => {
                    const isSelected = participantesSelecionados.includes(u.numero);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleParticipanteUnidade(u.numero)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs scale-105'
                            : 'bg-slate-100 hover:bg-indigo-100 text-slate-700'
                        }`}
                      >
                        {u.numero}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descrição textual complementar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700">
                  Descrição textual dos participantes / Comissões:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Moradores do Bloco B afetados pela obra, Membros do Conselho Consultivo e Engenheiro"
                  value={participantesDescricao}
                  onChange={(e) => setParticipantesDescricao(e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* 3. TÍTULO E FORMATO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Título da Reunião / Assembleia *
              </label>
              <input
                type="text"
                placeholder="Ex: Assembleia Geral Ordinária de Prestação de Contas 2026"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Formato
              </label>
              <select
                value={tipoSubformato}
                onChange={(e) => setTipoSubformato(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
              >
                <option value="Ordinária">Ordinária (AGO)</option>
                <option value="Extraordinária">Extraordinária (AGE)</option>
                <option value="Reunião de Comissão">Reunião de Comissão</option>
                <option value="Reunião com Moradores">Reunião com Moradores</option>
                <option value="Outro">Outro Formato</option>
              </select>
            </div>
          </div>

          {/* 4. DATA, HORÁRIOS & LOCAL */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-700" /> Data *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> 1ª Chamada *
              </label>
              <input
                type="text"
                placeholder="19:30"
                value={primeiraChamada}
                onChange={(e) => setPrimeiraChamada(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-700" /> 2ª Chamada / Início *
              </label>
              <input
                type="text"
                placeholder="20:00"
                value={segundaChamada}
                onChange={(e) => setSegundaChamada(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusAssembleia)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
              >
                <option value="Agendada">📅 Agendada (A Ocorrer)</option>
                <option value="Realizada - Aguardando Ata">⏳ Realizada - Aguardando Ata</option>
                <option value="Realizada com Ata Publicada">✓ Realizada com Ata Publicada</option>
              </select>
            </div>
          </div>

          {/* LOCAL */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-700" /> Local da Reunião *
            </label>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
            >
              {PRESET_LOCAIS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {local === 'Outro Local' && (
              <input
                type="text"
                placeholder="Especifique o local..."
                value={localCustom}
                onChange={(e) => setLocalCustom(e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />
            )}
          </div>

          {/* DESCRIÇÃO GERAL */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Descrição Geral / Convocação Formal
            </label>
            <textarea
              placeholder="Descreva o objetivo geral do encontro, regras de quórum ou informações preliminares..."
              value={descricaoGeral}
              onChange={(e) => setDescricaoGeral(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-amber-500 resize-none"
            />
          </div>

          {/* 5. PAUTAS & ASSUNTOS EM DISCUSSÃO (Com Select dinâmico de Reclamações, Reparos e Extras) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" /> Pautas & Assuntos em Discussão ({pautas.length})
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Vincule Reclamações, Reparos ou temas Livres
              </span>
            </div>

            {/* Lista de Pautas Adicionadas */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {pautas.map((p, idx) => (
                <div 
                  key={p.id || idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2.5 group hover:bg-slate-100 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <strong className="text-xs font-extrabold text-slate-950">
                        {p.titulo}
                      </strong>
                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${
                        p.origemTipo === 'reclamacao'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : p.origemTipo === 'reparo'
                          ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                          : 'bg-slate-200 text-slate-800 border-slate-300'
                      }`}>
                        {p.origemTipo === 'reclamacao' ? '📌 Reclamação' : p.origemTipo === 'reparo' ? '🔧 Reparo' : '➕ Pauta Livre'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium pl-7">
                      {p.descricao}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePauta(p.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remover Pauta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bloco para Adicionar Novo Item de Pauta */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-300/80 space-y-3">
              <span className="text-[11px] font-black uppercase text-amber-950 block">
                + Adicionar Assunto / Pauta à Reunião:
              </span>

              {/* Seletor de Tipo de Origem */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNovoTipoOrigem('reclamacao');
                    setSelectedOrigemId('');
                    setNovoPautaTitulo('');
                    setNovoPautaDescricao('');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    novoTipoOrigem === 'reclamacao'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Reclamação
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNovoTipoOrigem('reparo');
                    setSelectedOrigemId('');
                    setNovoPautaTitulo('');
                    setNovoPautaDescricao('');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    novoTipoOrigem === 'reparo'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Reparo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNovoTipoOrigem('extra');
                    setSelectedOrigemId('');
                    setNovoPautaTitulo('');
                    setNovoPautaDescricao('');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    novoTipoOrigem === 'extra'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Assunto Extra
                </button>
              </div>

              {/* Select de Reclamações Pendentes */}
              {novoTipoOrigem === 'reclamacao' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-700">
                    Selecione a Reclamação Pendente:
                  </label>
                  <select
                    value={selectedOrigemId}
                    onChange={(e) => handleSelectOrigemPauta(e.target.value, 'reclamacao')}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Escolha uma reclamação para colocar em pauta --</option>
                    {reclamacoes.map(r => (
                      <option key={r.id} value={r.id}>
                        [Apto {r.autorUnidade}] {r.titulo} ({r.categoria} • {r.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select de Reparos / Obras Pendentes */}
              {novoTipoOrigem === 'reparo' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-700">
                    Selecione o Reparo / Obra Pendente:
                  </label>
                  <select
                    value={selectedOrigemId}
                    onChange={(e) => handleSelectOrigemPauta(e.target.value, 'reparo')}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Escolha um reparo/manutenção para colocar em pauta --</option>
                    {reparos.map(rep => (
                      <option key={rep.id} value={rep.id}>
                        {rep.titulo} ({rep.categoria} • {rep.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Inputs de Título e Descrição da Pauta */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Título do Item da Pauta (Ex: Troca de iluminação do subsolo)"
                  value={novoPautaTitulo}
                  onChange={(e) => setNovoPautaTitulo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                />

                <textarea
                  placeholder="Descrição da deliberação ou propostas a serem votadas..."
                  value={novoPautaDescricao}
                  onChange={(e) => setNovoPautaDescricao(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 resize-none"
                />

                <button
                  type="button"
                  onClick={handleAddPauta}
                  disabled={!novoPautaTitulo.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Incluir Pauta
                </button>
              </div>

            </div>
          </div>

          {/* Notificação automática */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="checkNotif"
              checked={notificarParticipantes}
              onChange={(e) => setNotificarParticipantes(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <label htmlFor="checkNotif" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              Enviar notificação privada automática para as unidades convocadas ao salvar
            </label>
          </div>

          </div>

          {/* Footer Fixo */}
          <div className="flex items-center justify-end gap-2 p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {assembleiaToEdit ? 'Salvar Alterações' : 'Agendar e Publicar'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
