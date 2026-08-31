import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { MudancaAgendamento, TipoMudanca } from '../../types';
import { 
  Truck, 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  FileText,
  Building,
  User,
  Phone
} from 'lucide-react';

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
  const { currentUser, adicionarMudanca, editarMudanca, regrasMudanca } = useCondo();

  const [tipo, setTipo] = useState<TipoMudanca>('Entrada (Novo Morador)');
  const [dataMudanca, setDataMudanca] = useState('');
  const [periodo, setPeriodo] = useState<MudancaAgendamento['periodo']>('Manhã (08h às 13h)');
  const [transportadora, setTransportadora] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  const [rgMotorista, setRgMotorista] = useState('');
  const [telefone, setTelefone] = useState('');
  const [precisaElevadorServico, setPrecisaElevadorServico] = useState(true);
  const [precisaAcolchoamentoElevador, setPrecisaAcolchoamentoElevador] = useState(true);
  const [observacoes, setObservacoes] = useState('');
  const [concordouTermo, setConcordouTermo] = useState(false);

  const [erroMsg, setErroMsg] = useState('');

  // Data mínima (hoje + antecedência configurada)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + (regrasMudanca.antecedenciaMinimaDias || 1));
  const minDateStr = minDate.toISOString().split('T')[0];

  useEffect(() => {
    if (mudancaToEdit) {
      setTipo(mudancaToEdit.tipo);
      setDataMudanca(mudancaToEdit.dataMudancaIso || '');
      setPeriodo(mudancaToEdit.periodo);
      setTransportadora(mudancaToEdit.transportadora || '');
      setPlacaVeiculo(mudancaToEdit.placaVeiculo || '');
      setNomeMotorista(mudancaToEdit.nomeMotorista || '');
      setRgMotorista(mudancaToEdit.rgMotorista || '');
      setTelefone(mudancaToEdit.moradorTelefone || '');
      setPrecisaElevadorServico(mudancaToEdit.precisaElevadorServico);
      setPrecisaAcolchoamentoElevador(mudancaToEdit.precisaAcolchoamentoElevador);
      setObservacoes(mudancaToEdit.observacoes || '');
      setConcordouTermo(mudancaToEdit.termoCienciaAssinado);
    } else {
      setTipo('Entrada (Novo Morador)');
      setDataMudanca('');
      setPeriodo('Manhã (08h às 13h)');
      setTransportadora('');
      setPlacaVeiculo('');
      setNomeMotorista('');
      setRgMotorista('');
      setTelefone('');
      setPrecisaElevadorServico(true);
      setPrecisaAcolchoamentoElevador(true);
      setObservacoes('');
      setConcordouTermo(false);
    }
    setErroMsg('');
  }, [mudancaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataMudanca) {
      setErroMsg('Por favor, selecione a data desejada para a mudança.');
      return;
    }
    if (!concordouTermo) {
      setErroMsg('É obrigatório concordar com o termo de regras e horários de mudança.');
      return;
    }

    const [ano, mes, dia] = dataMudanca.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const payload = {
      moradorId: currentUser.id,
      moradorNome: currentUser.nome,
      moradorTelefone: telefone.trim() || undefined,
      unidade: currentUser.unidade,
      bloco: currentUser.bloco,
      tipo,
      dataMudanca: dataFormatada,
      dataMudancaIso: dataMudanca,
      periodo,
      status: 'Pendente de Aprovação' as const,
      transportadora: transportadora.trim() || undefined,
      placaVeiculo: placaVeiculo.trim().toUpperCase() || undefined,
      nomeMotorista: nomeMotorista.trim() || undefined,
      rgMotorista: rgMotorista.trim() || undefined,
      precisaElevadorServico,
      precisaAcolchoamentoElevador,
      termoCienciaAssinado: true,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                Agendamento de Mudança & Carreto
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {mudancaToEdit ? 'Editar Agendamento' : 'Solicitar Horário de Mudança'}
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

          {/* Tipo de Mudança */}
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
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                      : 'bg-slate-950/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data & Período */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Data da Mudança *
              </label>
              <input
                type="date"
                required
                min={minDateStr}
                value={dataMudanca}
                onChange={(e) => setDataMudanca(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 font-semibold block">
                * Antecedência mínima de {regrasMudanca.antecedenciaMinimaDias} dias.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Turno / Período *
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as MudancaAgendamento['periodo'])}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-amber-400"
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

          {/* Dados da Transportadora e Veículo (Para Portaria) */}
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
                <label className="text-[10px] font-bold text-slate-300">
                  Telefone / WhatsApp de Contato no Dia:
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Proteção do Elevador de Serviço */}
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
                  <strong className="text-white block font-bold">Uso do Elevador de Serviço</strong>
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
                  <span className="text-[10px] text-slate-400">A zeladoria providenciará a colocação dos protetores antes do início.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Observações */}
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

          {/* Termo de Ciência */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={concordouTermo}
                onChange={(e) => setConcordouTermo(e.target.checked)}
                className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer shrink-0"
              />
              <div className="text-[11px] text-amber-200">
                <strong className="block font-black text-amber-300">
                  Termo de Responsabilidade & Regras de Mudança
                </strong>
                Declaro que estou ciente dos horários permitidos ({regrasMudanca.horarioSegundaSexta} / {regrasMudanca.horarioSabado}), da proibição de uso do elevador social e da responsabilidade por eventuais danos causados nas áreas comuns.
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
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirmar Solicitação</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
