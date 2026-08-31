import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { AutorizacaoAcesso, TipoVisitante } from '../../types';
import { 
  UserCheck, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Camera, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Phone, 
  FileText,
  Sparkles
} from 'lucide-react';

const FOTOS_PREDEFINIDAS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

interface CreateAutorizacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAutorizacaoModal: React.FC<CreateAutorizacaoModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, adicionarAutorizacaoAcesso } = useCondo();

  const hojeStr = new Date().toLocaleDateString('pt-BR');
  const hojeIso = new Date().toISOString().split('T')[0];

  const [nomeVisitante, setNomeVisitante] = useState('');
  const [tipoVisitante, setTipoVisitante] = useState<TipoVisitante>('Visita / Familiar');
  const [documentoRg, setDocumentoRg] = useState('');
  const [telefoneVisitante, setTelefoneVisitante] = useState('');
  const [fotoVisitante, setFotoVisitante] = useState('');
  const [dataPrevistaIso, setDataPrevistaIso] = useState(hojeIso);
  const [horarioEstimado, setHorarioEstimado] = useState('');
  const [deixarEntrarDireto, setDeixarEntrarDireto] = useState(true);
  const [observacoes, setObservacoes] = useState('');

  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNomeVisitante('');
      setTipoVisitante('Visita / Familiar');
      setDocumentoRg('');
      setTelefoneVisitante('');
      setFotoVisitante('');
      setDataPrevistaIso(hojeIso);
      setHorarioEstimado('');
      setDeixarEntrarDireto(true);
      setObservacoes('');
      setErroMsg('');
    }
  }, [isOpen, hojeIso]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoVisitante(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeVisitante.trim()) {
      setErroMsg('Por favor, informe o nome completo de quem vai chegar.');
      return;
    }
    if (!horarioEstimado.trim()) {
      setErroMsg('Por favor, informe o horário estimado de chegada.');
      return;
    }

    const [ano, mes, dia] = dataPrevistaIso.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    adicionarAutorizacaoAcesso({
      moradorId: currentUser.id,
      moradorNome: currentUser.nome,
      unidade: currentUser.unidade,
      bloco: currentUser.bloco,
      tipoVisitante,
      nomeVisitante: nomeVisitante.trim(),
      documentoRg: documentoRg.trim() || undefined,
      telefoneVisitante: telefoneVisitante.trim() || undefined,
      fotoVisitante: fotoVisitante.trim() || undefined,
      dataPrevista: dataFormatada,
      dataPrevistaIso,
      horarioEstimado: horarioEstimado.trim(),
      deixarEntrarDireto,
      observacoes: observacoes.trim() || undefined
    });

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
                Portaria & Acessos da Unidade {currentUser.unidade}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Autorizar Entrada na Portaria
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          
          {erroMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* Nome e Tipo */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Nome de Quem Vai Chegar *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Roberto Eletricista, Dra. Beatriz Peixoto, João Silva..."
                value={nomeVisitante}
                onChange={(e) => setNomeVisitante(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Tipo / Relação:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  'Visita / Familiar',
                  'Prestador de Serviço',
                  'Delivery / Entregador',
                  'Corretor / Vistoriador',
                  'Outro'
                ].map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => setTipoVisitante(tp as TipoVisitante)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-extrabold transition-all text-center cursor-pointer ${
                      tipoVisitante === tp
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : 'bg-slate-950/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Prevista e Horário Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Data Prevista:
              </label>
              <input
                type="date"
                value={dataPrevistaIso}
                onChange={(e) => setDataPrevistaIso(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Horário Previsto *:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 15h30, Entre 14h e 16h..."
                value={horarioEstimado}
                onChange={(e) => setHorarioEstimado(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Foto do Visitante (Opcional) */}
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Foto da Pessoa (Opcional - Ajuda o Porteiro)
              </label>
              {fotoVisitante && (
                <button
                  type="button"
                  onClick={() => setFotoVisitante('')}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Remover foto
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {fotoVisitante ? (
                <img
                  src={fotoVisitante}
                  alt="Visitante"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0 bg-slate-800"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                  <User className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-1.5 flex-1 min-w-0">
                <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" /> Enviar Foto do Celular
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-500 shrink-0">Exemplos:</span>
                  {FOTOS_PREDEFINIDAS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFotoVisitante(url)}
                      className={`w-6 h-6 rounded-full overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        fotoVisitante === url ? 'border-indigo-400 scale-110 ring-2 ring-indigo-400' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documento RG e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300">
                Documento / RG / CPF (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: 45.123.890-X"
                value={documentoRg}
                onChange={(e) => setDocumentoRg(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300">
                Telefone / WhatsApp (Opcional):
              </label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={telefoneVisitante}
                onChange={(e) => setTelefoneVisitante(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Toggle: Deixar Entrar Direto */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={deixarEntrarDireto}
                onChange={(e) => setDeixarEntrarDireto(e.target.checked)}
                className="mt-0.5 rounded text-indigo-500 focus:ring-indigo-400 w-4 h-4 cursor-pointer shrink-0"
              />
              <div>
                <strong className="text-white block font-black text-xs">
                  ✓ O porteiro pode deixar entrar direto
                </strong>
                <span className="text-[10px] text-indigo-200">
                  {deixarEntrarDireto 
                    ? 'A portaria liberará o acesso imediatamente após a identificação sem precisar interfonar para confirmar.' 
                    : 'A portaria interfonará para a unidade antes de abrir o portão.'}
                </span>
              </div>
            </label>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Recado para a Portaria / Observações (Opcional):
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Pode mandar subir no 2º andar / Estará com ferramentas / Avisar se chegar de carro..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-white placeholder-slate-500 font-medium resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Notificar Portaria</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
