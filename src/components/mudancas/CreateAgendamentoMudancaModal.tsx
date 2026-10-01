import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { MudancaAgendamento, TipoMudanca, StatusMudanca, Unidade } from '../../types';
import { 
  Truck, 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Building,
  User,
  Phone,
  FileText,
  CheckCircle2
} from 'lucide-react';

/** Formata número de WhatsApp / Telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX (máx 11 dígitos) */
const formatWhatsApp = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/** Formata CPF brasileiro: XXX.XXX.XXX-XX (máx 11 dígitos) */
const formatCPF = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

interface CreateAgendamentoMudancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mudancaToEdit?: MudancaAgendamento | null;
}

export const CreateAgendamentoMudancaModal: React.FC<CreateAgendamentoMudancaModalProps> = ({
  isOpen,
  onClose,
  mudancaToEdit
}) => {
  const { currentUser, unidades, currentCondo, adicionarMudanca, editarMudanca, regrasMudanca, isAdminLoggedIn, isMasterLoggedIn } = useCondo();

  const isCasas = currentCondo?.tipoCondominio === 'casas';
  const isAdmin = Boolean(
    isAdminLoggedIn || 
    isMasterLoggedIn || 
    currentUser.isDev || 
    currentUser.role === 'sindico' || 
    currentUser.role === 'subsindico' || 
    currentUser.role === 'colaborador'
  );

  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [blocoSelecionado, setBlocoSelecionado] = useState('');
  const [moradorNome, setMoradorNome] = useState('');
  const [moradorId, setMoradorId] = useState('');
  const [statusMudanca, setStatusMudanca] = useState<StatusMudanca>('Confirmada');

  const [tipo, setTipo] = useState<TipoMudanca>('Entrada (Novo Morador)');
  const [dataMudanca, setDataMudanca] = useState('');
  const [periodo, setPeriodo] = useState<MudancaAgendamento['periodo']>('Manhã (08h às 13h)');
  const [transportadora, setTransportadora] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  const [cpfMotorista, setCpfMotorista] = useState('');
  const [telefone, setTelefone] = useState('');
  const [precisaElevadorServico, setPrecisaElevadorServico] = useState(!isCasas);
  const [precisaAcolchoamentoElevador, setPrecisaAcolchoamentoElevador] = useState(!isCasas);
  const [observacoes, setObservacoes] = useState('');
  const [concordouTermo, setConcordouTermo] = useState(true);

  const [erroMsg, setErroMsg] = useState('');

  // Lista de unidades ordenadas
  const unidadesOrdenadas = [...unidades].sort((a, b) => {
    const numA = parseInt(a.numero.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.numero.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  useEffect(() => {
    if (mudancaToEdit) {
      setUnidadeSelecionada(mudancaToEdit.unidade || '');
      setBlocoSelecionado(mudancaToEdit.bloco || '');
      setMoradorNome(mudancaToEdit.moradorNome || '');
      setMoradorId(mudancaToEdit.moradorId || '');
      setStatusMudanca(mudancaToEdit.status || 'Confirmada');
      setTipo(mudancaToEdit.tipo);
      setDataMudanca(mudancaToEdit.dataMudancaIso || '');
      setPeriodo(mudancaToEdit.periodo);
      setTransportadora(mudancaToEdit.transportadora || '');
      setPlacaVeiculo(mudancaToEdit.placaVeiculo || '');
      setNomeMotorista(mudancaToEdit.nomeMotorista || '');
      setCpfMotorista(formatCPF(mudancaToEdit.cpfMotorista || mudancaToEdit.rgMotorista || ''));
      setTelefone(formatWhatsApp(mudancaToEdit.moradorTelefone || ''));
      setPrecisaElevadorServico(mudancaToEdit.precisaElevadorServico);
      setPrecisaAcolchoamentoElevador(mudancaToEdit.precisaAcolchoamentoElevador);
      setObservacoes(mudancaToEdit.observacoes || '');
      setConcordouTermo(mudancaToEdit.termoCienciaAssinado ?? true);
    } else {
      // Valor padrão da unidade
      if (unidadesOrdenadas.length > 0) {
        const primeira = unidadesOrdenadas[0];
        setUnidadeSelecionada(primeira.numero);
        setBlocoSelecionado(primeira.rua || primeira.bloco || '');
        const nomePrincipal = primeira.moradores?.[0]?.nome || primeira.nomeCelula || '';
        setMoradorNome(nomePrincipal);
        setMoradorId(primeira.moradores?.[0]?.id || '');
      } else {
        setUnidadeSelecionada(currentUser.unidade || '');
        setBlocoSelecionado(currentUser.bloco || '');
        setMoradorNome(currentUser.nome || '');
        setMoradorId(currentUser.id || '');
      }

      setStatusMudanca('Confirmada');
      setTipo('Entrada (Novo Morador)');
      setDataMudanca('');
      setPeriodo('Manhã (08h às 13h)');
      setTransportadora('');
      setPlacaVeiculo('');
      setNomeMotorista('');
      setCpfMotorista('');
      setTelefone('');
      setPrecisaElevadorServico(!isCasas);
      setPrecisaAcolchoamentoElevador(!isCasas);
      setObservacoes('');
      setConcordouTermo(true);
    }
    setErroMsg('');
  }, [mudancaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectUnidade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = e.target.value;
    setUnidadeSelecionada(num);
    const u = unidades.find(un => un.numero === num || un.id === num);
    if (u) {
      setBlocoSelecionado(u.rua || u.bloco || '');
      const nomeMorador = u.moradores?.[0]?.nome || u.nomeCelula || '';
      setMoradorNome(nomeMorador);
      setMoradorId(u.moradores?.[0]?.id || '');
      if (u.moradores?.[0]?.email && !telefone) {
        // Se houver telefone cadastrado nos moradores
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unidadeSelecionada.trim()) {
      setErroMsg(isCasas ? 'Por favor, selecione a casa em questão.' : 'Por favor, selecione o apartamento / unidade.');
      return;
    }
    if (!moradorNome.trim()) {
      setErroMsg('Por favor, informe o nome do morador responsável pela mudança/carreto.');
      return;
    }
    if (!dataMudanca) {
      setErroMsg('Por favor, selecione a data desejada para a mudança.');
      return;
    }

    const [ano, mes, dia] = dataMudanca.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const payload = {
      moradorId: moradorId || `usr-${Date.now()}`,
      moradorNome: moradorNome.trim(),
      moradorTelefone: telefone.trim() || undefined,
      unidade: unidadeSelecionada.trim(),
      bloco: blocoSelecionado.trim() || 'Principal',
      tipo,
      dataMudanca: dataFormatada,
      dataMudancaIso: dataMudanca,
      periodo,
      status: statusMudanca,
      transportadora: transportadora.trim() || undefined,
      placaVeiculo: placaVeiculo.trim().toUpperCase() || undefined,
      nomeMotorista: nomeMotorista.trim() || undefined,
      cpfMotorista: cpfMotorista.trim() || undefined,
      rgMotorista: cpfMotorista.trim() || undefined, // compatibilidade
      precisaElevadorServico,
      precisaAcolchoamentoElevador,
      termoCienciaAssinado: concordouTermo,
      observacoes: observacoes.trim() || undefined
    };

    if (mudancaToEdit) {
      editarMudanca(mudancaToEdit.id, payload);
    } else {
      adicionarMudanca(payload);
    }

    onClose();
  };

  return createPortal(
    <div className="modal-overlay-safe bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="modal-content-safe bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                {isAdmin ? 'Gestão Administrativa de Mudanças' : 'Agendamento de Mudança & Carreto'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {mudancaToEdit ? 'Editar Mudança / Carreto' : 'Agendar Mudança ou Transporte de Carga'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {erroMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* 1. SELEÇÃO DE UNIDADE & MORADOR RESPONSÁVEL (Admin Link) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-400" />
                Vincular {isCasas ? 'Casa' : 'Apartamento'} & Morador Envolvido *
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                Agendamento pelo Administrador
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Select da Unidade */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-300">
                  {isCasas ? 'Casa / Imóvel:' : 'Unidade / Apartamento:'} *
                </label>
                <select
                  value={unidadeSelecionada}
                  onChange={handleSelectUnidade}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
                  required
                >
                  <option value="" disabled>Selecione a unidade...</option>
                  {unidadesOrdenadas.map((u) => {
                    const moradorPrincipal = u.moradores?.[0]?.nome || u.nomeCelula;
                    const rotulo = isCasas
                      ? `Casa ${u.numero} ${u.rua ? `(${u.rua})` : ''} ${moradorPrincipal ? `— ${moradorPrincipal}` : '(Vazia)'}`
                      : `Apto ${u.numero} ${u.bloco ? `(Bloco ${u.bloco})` : ''} ${moradorPrincipal ? `— ${moradorPrincipal}` : '(Vazio)'}`;

                    return (
                      <option key={u.id} value={u.numero} className="bg-slate-900 text-white">
                        {rotulo}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Nome do Morador / Solicitante */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Nome do Morador / Titular: *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo, Mariana Lopes..."
                  value={moradorNome}
                  onChange={(e) => setMoradorNome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 font-bold focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Telefone / WhatsApp do Morador */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> Celular / WhatsApp do Morador (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  value={telefone}
                  onChange={(e) => setTelefone(formatWhatsApp(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
                />
              </div>

              {/* Status Inicial da Mudança */}
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Status da Autorização:
                </label>
                <select
                  value={statusMudanca}
                  onChange={(e) => setStatusMudanca(e.target.value as StatusMudanca)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Confirmada" className="bg-slate-900 text-emerald-400 font-bold">
                    ✓ Confirmada (Liberada para a Portaria)
                  </option>
                  <option value="Pendente de Aprovação" className="bg-slate-900 text-amber-400">
                    ⏳ Pendente de Aprovação
                  </option>
                  <option value="Recusada" className="bg-slate-900 text-rose-400">
                    ❌ Recusada / Bloqueada
                  </option>
                  <option value="Concluída" className="bg-slate-900 text-slate-300">
                    🏁 Concluída / Realizada
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* 2. TIPO DE MUDANÇA */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Finalidade / Tipo da Mudança *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Entrada (Novo Morador)', label: '📦 Entrada (Novo Morador)' },
                { id: 'Saída (Desocupação)', label: '🚚 Saída (Desocupação)' },
                { id: 'Carreto / Mobília Pesada', label: '🛋️ Carreto / Carga Pesada' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTipo(item.id as TipoMudanca)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    tipo === item.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. DATA & PERÍODO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Data da Mudança *
              </label>
              <input
                type="date"
                required
                value={dataMudanca}
                onChange={(e) => setDataMudanca(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 font-semibold block">
                Horários permitidos: {regrasMudanca.horarioSegundaSexta} (Seg-Sex) / {regrasMudanca.horarioSabado} (Sáb)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Turno / Período *
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as MudancaAgendamento['periodo'])}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Manhã (08h às 13h)" className="bg-slate-900 text-white">
                  Manhã (08:00 às 13:00)
                </option>
                <option value="Tarde (13h às 18h)" className="bg-slate-900 text-white">
                  Tarde (13:00 às 18:00)
                </option>
                <option value="Integral (08h às 17h)" className="bg-slate-900 text-white">
                  Dia Integral (08:00 às 17:00)
                </option>
              </select>
            </div>
          </div>

          {/* 4. DADOS DA TRANSPORTADORA E VEÍCULO (Para Portaria) */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Dados para Liberação na Portaria
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300">
                  Empresa Transportadora / Carreto:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Granero Mudanças, Frete Particular..."
                  value={transportadora}
                  onChange={(e) => setTransportadora(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300">
                  Placa do Caminhão / Veículo:
                </label>
                <input
                  type="text"
                  placeholder="Ex: ABC-1234 ou BRA2E19"
                  value={placaVeiculo}
                  onChange={(e) => setPlacaVeiculo(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-bold uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300">
                  Nome do Motorista / Responsável:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo"
                  value={nomeMotorista}
                  onChange={(e) => setNomeMotorista(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" /> CPF do Motorista (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={cpfMotorista}
                  onChange={(e) => setCpfMotorista(formatCPF(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium font-mono"
                />
              </div>
            </div>
          </div>

          {/* 5. PROTEÇÃO DO ELEVADOR DE SERVIÇO (Se for Edifício) */}
          {!isCasas && (
            <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-extrabold uppercase text-slate-300 block">
                Equipamentos & Proteção Predial
              </span>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={precisaElevadorServico}
                    onChange={(e) => setPrecisaElevadorServico(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="text-white block font-bold">Reserva do Elevador de Serviço</strong>
                    <span className="text-[10px] text-slate-400">É terminantemente proibido o transporte de móveis no elevador social.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={precisaAcolchoamentoElevador}
                    onChange={(e) => setPrecisaAcolchoamentoElevador(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="text-white block font-bold">Acolchoado Protetor de Cabine</strong>
                    <span className="text-[10px] text-slate-400">A zeladoria e portaria serão notificadas para instalar a proteção antes do início.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 6. OBSERVAÇÕES */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Observações Adicionais (Opcional):
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Içamentos, móveis muito grandes, horário aproximado de chegada..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 font-medium resize-none"
            />
          </div>

          {/* 7. TERMO DE CIÊNCIA */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={concordouTermo}
                onChange={(e) => setConcordouTermo(e.target.checked)}
                className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer shrink-0"
              />
              <div className="text-[11px] text-amber-200">
                <strong className="block font-black text-amber-300">
                  Termo de Responsabilidade & Regras de Mudança
                </strong>
                Ciente dos horários permitidos ({regrasMudanca.horarioSegundaSexta} / {regrasMudanca.horarioSabado}), da prioridade do elevador de serviço e da comunicação oficial à portaria para controle de fluxo de carga.
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-extrabold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{mudancaToEdit ? 'Salvar Alterações' : 'Confirmar Agendamento'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
