import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { EncomendaEntrega, TipoEncomenda, StatusEncomenda, TipoOperacaoEncomenda } from '../../types';
import { 
  Package, 
  X, 
  Building, 
  User, 
  Truck, 
  Camera, 
  Check, 
  AlertCircle, 
  MapPin, 
  FileText,
  Clock,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Phone
} from 'lucide-react';
import { otimizarImagemArquivo } from '../../utils/imageOptimizer';

interface CreateEncomendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  encomendaToEdit?: EncomendaEntrega | null;
}

export const CreateEncomendaModal: React.FC<CreateEncomendaModalProps> = ({
  isOpen,
  onClose,
  encomendaToEdit
}) => {
  const { unidades, adicionarEncomenda, editarEncomenda, currentUser } = useCondo();

  const [fluxoTipo, setFluxoTipo] = useState<TipoOperacaoEncomenda>('entrada_encomenda');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [destinatarioExterno, setDestinatarioExterno] = useState('');
  const [telefoneDestinatario, setTelefoneDestinatario] = useState('');
  const [tipo, setTipo] = useState<TipoEncomenda>('Pacote / Caixa');
  const [status, setStatus] = useState<StatusEncomenda>('Aguardando Chegada na Portaria');
  const [empresaTransporte, setEmpresaTransporte] = useState('');
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const [localArmazenamento, setLocalArmazenamento] = useState('');
  const [fotoPacote, setFotoPacote] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [porteiroRecebedor, setPorteiroRecebedor] = useState('');

  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (encomendaToEdit) {
        setFluxoTipo(encomendaToEdit.fluxoTipo || (encomendaToEdit.status.includes('Embrulho') || encomendaToEdit.status.includes('Despachado') || encomendaToEdit.status.includes('Coleta') ? 'saida_embrulho' : 'entrada_encomenda'));
        setUnidadeSelecionada(encomendaToEdit.unidade || '');
        setDestinatarioNome(encomendaToEdit.destinatarioNome || '');
        setDestinatarioExterno(encomendaToEdit.destinatarioExterno || '');
        setTelefoneDestinatario(encomendaToEdit.telefoneDestinatario || '');
        setTipo(encomendaToEdit.tipo || 'Pacote / Caixa');
        setStatus(encomendaToEdit.status || 'Aguardando Chegada na Portaria');
        setEmpresaTransporte(encomendaToEdit.empresaTransporte || '');
        setCodigoRastreio(encomendaToEdit.codigoRastreio || '');
        setLocalArmazenamento(encomendaToEdit.localArmazenamento || '');
        setFotoPacote(encomendaToEdit.fotoPacote || '');
        setObservacoes(encomendaToEdit.observacoes || '');
        setPorteiroRecebedor(encomendaToEdit.porteiroRecebedor || '');
      } else {
        const isMorador = currentUser.role === 'morador';
        setFluxoTipo('entrada_encomenda');
        setUnidadeSelecionada(currentUser.unidade || unidades[0]?.numero || '');
        setDestinatarioNome(isMorador ? currentUser.nome : '');
        setDestinatarioExterno('');
        setTelefoneDestinatario('');
        setTipo('Pacote / Caixa');
        setStatus(isMorador ? 'Aguardando Chegada na Portaria' : 'Aguardando Retirada');
        setEmpresaTransporte('');
        setCodigoRastreio('');
        setLocalArmazenamento('');
        setFotoPacote('');
        setObservacoes('');
        setPorteiroRecebedor(!isMorador ? currentUser.nome : '');
      }
      setErroMsg('');
    }
  }, [isOpen, encomendaToEdit, unidades, currentUser]);

  // Ao alterar o fluxo (Entrada vs Saída), ajusta o status inicial adequado
  const handleFluxoChange = (novoFluxo: TipoOperacaoEncomenda) => {
    setFluxoTipo(novoFluxo);
    if (!encomendaToEdit) {
      const isMorador = currentUser.role === 'morador';
      if (novoFluxo === 'saida_embrulho') {
        setStatus(isMorador ? 'Embrulho Deixado pelo Morador' : 'Aguardando Coleta na Portaria');
      } else {
        setStatus(isMorador ? 'Aguardando Chegada na Portaria' : 'Aguardando Retirada');
      }
    }
  };

  // Ao mudar a unidade, tenta sugerir o nome do morador
  const handleUnidadeChange = (numero: string) => {
    setUnidadeSelecionada(numero);
    const unitObj = unidades.find(u => u.numero === numero);
    if (unitObj && unitObj.moradores && unitObj.moradores.length > 0) {
      setDestinatarioNome(unitObj.moradores[0].nome);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await otimizarImagemArquivo(file, { maxBytes: 120 * 1024 });
        setFotoPacote(result);
      } catch (err) {
        console.error('Erro ao otimizar foto do pacote:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unidadeSelecionada.trim()) {
      setErroMsg('Selecione o apartamento de origem/destino.');
      return;
    }
    if (!destinatarioNome.trim()) {
      setErroMsg('Informe o nome do morador responsável.');
      return;
    }
    if (fluxoTipo === 'saida_embrulho' && !destinatarioExterno.trim()) {
      setErroMsg('Informe quem vai retirar o embrulho (comprador, transportadora ou pessoa autorizada).');
      return;
    }

    const unitObj = unidades.find(u => u.numero === unidadeSelecionada);

    if (encomendaToEdit) {
      editarEncomenda(encomendaToEdit.id, {
        fluxoTipo,
        unidade: unidadeSelecionada,
        bloco: unitObj?.bloco || undefined,
        destinatarioNome: destinatarioNome.trim(),
        destinatarioExterno: destinatarioExterno.trim() || undefined,
        telefoneDestinatario: telefoneDestinatario.trim() || undefined,
        tipo,
        status,
        empresaTransporte: empresaTransporte.trim(),
        codigoRastreio: codigoRastreio.trim() || undefined,
        localArmazenamento: localArmazenamento.trim() || undefined,
        fotoPacote: fotoPacote.trim() || undefined,
        porteiroRecebedor: porteiroRecebedor.trim() || (status === 'Aguardando Retirada' || status === 'Aguardando Coleta na Portaria' ? (currentUser.nome || 'Portaria') : 'Pendente de Chegada'),
        observacoes: observacoes.trim() || undefined
      });
    } else {
      adicionarEncomenda({
        fluxoTipo,
        unidade: unidadeSelecionada,
        bloco: unitObj?.bloco || undefined,
        destinatarioNome: destinatarioNome.trim(),
        destinatarioExterno: destinatarioExterno.trim() || undefined,
        telefoneDestinatario: telefoneDestinatario.trim() || undefined,
        tipo,
        status,
        empresaTransporte: empresaTransporte.trim(),
        codigoRastreio: codigoRastreio.trim() || undefined,
        localArmazenamento: localArmazenamento.trim() || undefined,
        fotoPacote: fotoPacote.trim() || undefined,
        porteiroRecebedor: porteiroRecebedor.trim() || (status === 'Aguardando Retirada' || status === 'Aguardando Coleta na Portaria' ? (currentUser.nome || 'Portaria') : 'Pendente de Chegada'),
        observacoes: observacoes.trim() || undefined,
        moradorId: currentUser.id
      });
    }

    onClose();
  };

  return createPortal(
    <div className="modal-overlay-safe bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="modal-content-safe bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
                Portaria • Encomendas & Despacho de Embrulhos
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {encomendaToEdit ? 'Editar Registro' : (fluxoTipo === 'saida_embrulho' ? 'Registrar Saída/Despacho de Embrulho' : 'Registrar Encomenda na Portaria')}
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

          {/* SELETOR DE CENÁRIO: ENTRADA DE ENCOMENDA VS SAÍDA DE EMBRULHO */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 block">
              1. Tipo de Operação / Cenário:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFluxoChange('entrada_encomenda')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  fluxoTipo === 'entrada_encomenda'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-white block">
                    1. Recebimento de Encomenda (Entrada)
                  </strong>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                    Morador vai receber um pacote / delivery entregue na portaria.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFluxoChange('saida_embrulho')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  fluxoTipo === 'saida_embrulho'
                    ? 'bg-emerald-600/30 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-white block">
                    2. Despacho de Embrulho (Saída)
                  </strong>
                  <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                    Morador deixa um embrulho para comprador ou entregador retirar.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Unidade & Nome do Morador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-400" /> Apartamento / Unidade *
              </label>
              <select
                value={unidadeSelecionada}
                onChange={(e) => handleUnidadeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-indigo-400"
              >
                {unidades.map(u => (
                  <option key={u.id} value={u.numero} className="bg-slate-900 text-white">
                    Apto {u.numero} {u.bloco ? `(${u.bloco})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" /> {fluxoTipo === 'saida_embrulho' ? 'Morador Remetente *' : 'Morador Destinatário *'}
              </label>
              <input
                type="text"
                required
                placeholder="Nome do morador..."
                value={destinatarioNome}
                onChange={(e) => setDestinatarioNome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Se for Despacho de Saída: Quem vai retirar & Telefone */}
          {fluxoTipo === 'saida_embrulho' && (
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Send className="w-4 h-4" />
                <span>Dados de quem vai retirar o embrulho na portaria:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300">
                    Quem vai retirar (Comprador / Entregador / Familiar) *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Motorista Uber Flash, Comprador OLX, Maria..."
                    value={destinatarioExterno}
                    onChange={(e) => setDestinatarioExterno(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> Telefone / Contato (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={telefoneDestinatario}
                    onChange={(e) => setTelefoneDestinatario(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SITUAÇÃO / STATUS CONFORME O CENÁRIO */}
          <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
            <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Situação Atual *:
            </label>
            
            {fluxoTipo === 'entrada_encomenda' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Aguardando Chegada na Portaria')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Aguardando Chegada na Portaria'
                      ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-sky-400 flex items-center gap-1">
                    ⏳ Aguarda Chegada
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Morador espera encomenda. Ainda não chegou.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Aguardando Retirada')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Aguardando Retirada'
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-amber-400 flex items-center gap-1">
                    📦 Chegou na Portaria
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Recebido pelo porteiro. Aguarda retirada do morador.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Entregue ao Morador')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Entregue ao Morador'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    ✓ Entregue ao Morador
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Pacote já entregue/retirado pelo morador.
                  </div>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Embrulho Deixado pelo Morador')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Embrulho Deixado pelo Morador'
                      ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-sky-400 flex items-center gap-1">
                    📤 Deixado pelo Morador
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Morador deixou embrulho na portaria para retirada.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Aguardando Coleta na Portaria')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Aguardando Coleta na Portaria'
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-amber-400 flex items-center gap-1">
                    📦 Aguarda Coleta/Retirada
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Portaria confirmou custódia. Aguarda terceiro.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Despachado / Retirado por Terceiro')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    status === 'Despachado / Retirado por Terceiro'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    🚀 Despachado / Retirado
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 font-medium leading-tight">
                    Embrulho entregue ao destinatário externo.
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Tipo de Volume */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Tipo do Volume / Objeto:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'Pacote / Caixa', label: '📦 Pacote / Caixa' },
                { id: 'Envelope / Documento', label: '✉️ Envelope / Documento' },
                { id: 'Delivery / Alimentação', label: '🍔 Delivery / Alimentação' },
                { id: 'Medicamento', label: '💊 Medicamento' },
                { id: 'Volume Grande', label: '🛋️ Volume Grande' },
                { id: 'Outro', label: '🏷️ Outro / Objeto' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTipo(item.id as TipoEncomenda)}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all text-center cursor-pointer ${
                    tipo === item.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-slate-950/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empresa / Transportadora & Código de Rastreio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-400" /> {fluxoTipo === 'saida_embrulho' ? 'Transportadora / Modalidade (Opcional):' : 'Empresa / Transportadora:'}
              </label>
              <input
                type="text"
                placeholder={fluxoTipo === 'saida_embrulho' ? "Ex: Uber Flash, Lalamove, Retirada em mãos..." : "Ex: Mercado Livre, Correios, Amazon, iFood..."}
                value={empresaTransporte}
                onChange={(e) => setEmpresaTransporte(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300">
                Código / Rastreio / Nota / Senha (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: MLB-12345, Sedex, Senha 4 Dígitos..."
                value={codigoRastreio}
                onChange={(e) => setCodigoRastreio(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Local de Armazenamento na Portaria */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Onde está guardado na Portaria:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                'Armário A - Prat. 1',
                'Armário B - Prat. 2',
                'Geladeira Portaria',
                'Gaveta Despacho'
              ].map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocalArmazenamento(loc)}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all text-center cursor-pointer ${
                    localArmazenamento === loc
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ou digite o local exato..."
              value={localArmazenamento}
              onChange={(e) => setLocalArmazenamento(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 text-xs mt-1"
            />
          </div>

          {/* Foto do Pacote */}
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Foto do Pacote / Embrulho (Opcional):
              </label>
              {fotoPacote && (
                <button
                  type="button"
                  onClick={() => setFotoPacote('')}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {fotoPacote && (
                <img
                  src={fotoPacote}
                  alt="Pacote"
                  className="w-14 h-14 rounded-xl object-contain border border-indigo-400 bg-slate-900 shrink-0"
                />
              )}
              <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Fotografar Item
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300">
              Observações Adicionais:
            </label>
            <input
              type="text"
              placeholder="Ex: Entregar mediante conferência de documento, pacote frágil..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-medium"
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
              <span>{encomendaToEdit ? 'Salvar Alterações' : 'Salvar & Registrar no Sistema'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
