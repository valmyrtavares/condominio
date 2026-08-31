import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { EncomendaEntrega, TipoEncomenda } from '../../types';
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
  Clock
} from 'lucide-react';

const FOTOS_PACOTES_EXEMPLO = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'
];

interface CreateEncomendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEncomendaModal: React.FC<CreateEncomendaModalProps> = ({
  isOpen,
  onClose
}) => {
  const { unidades, adicionarEncomenda, currentUser } = useCondo();

  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [tipo, setTipo] = useState<TipoEncomenda>('Pacote / Caixa');
  const [empresaTransporte, setEmpresaTransporte] = useState('Mercado Livre');
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const [localArmazenamento, setLocalArmazenamento] = useState('Armário da Portaria');
  const [fotoPacote, setFotoPacote] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [porteiroRecebedor, setPorteiroRecebedor] = useState(currentUser.nome || 'Portaria');

  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUnidadeSelecionada(unidades[0]?.numero || '101');
      setDestinatarioNome('');
      setTipo('Pacote / Caixa');
      setEmpresaTransporte('Mercado Livre');
      setCodigoRastreio('');
      setLocalArmazenamento('Armário da Portaria');
      setFotoPacote('');
      setObservacoes('');
      setPorteiroRecebedor(currentUser.nome || 'Portaria');
      setErroMsg('');
    }
  }, [isOpen, unidades, currentUser]);

  // Ao mudar a unidade, tenta sugerir o nome do morador
  const handleUnidadeChange = (numero: string) => {
    setUnidadeSelecionada(numero);
    const unitObj = unidades.find(u => u.numero === numero);
    if (unitObj && unitObj.moradores && unitObj.moradores.length > 0) {
      setDestinatarioNome(unitObj.moradores[0].nome);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPacote(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unidadeSelecionada.trim()) {
      setErroMsg('Selecione o apartamento de destino da encomenda.');
      return;
    }
    if (!destinatarioNome.trim()) {
      setErroMsg('Informe o nome do morador/destinatário.');
      return;
    }

    const unitObj = unidades.find(u => u.numero === unidadeSelecionada);

    adicionarEncomenda({
      unidade: unidadeSelecionada,
      bloco: unitObj?.bloco || undefined,
      destinatarioNome: destinatarioNome.trim(),
      tipo,
      empresaTransporte: empresaTransporte.trim(),
      codigoRastreio: codigoRastreio.trim() || undefined,
      localArmazenamento: localArmazenamento.trim() || undefined,
      fotoPacote: fotoPacote.trim() || undefined,
      porteiroRecebedor: porteiroRecebedor.trim() || 'Portaria',
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
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
                Portaria & Recepção de Mercadorias
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Registrar Chegada de Encomenda
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

          {/* Unidade & Destinatário */}
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
                <User className="w-3.5 h-3.5 text-indigo-400" /> Nome do Morador / Destinatário *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Marcos Almeida, Sandra..."
                value={destinatarioNome}
                onChange={(e) => setDestinatarioNome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Tipo de Encomenda */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Tipo do Volume / Encomenda:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'Pacote / Caixa', label: '📦 Pacote / Caixa' },
                { id: 'Envelope / Documento', label: '✉️ Envelope / Carta' },
                { id: 'Delivery / Alimentação', label: '🍔 Delivery / Comida' },
                { id: 'Medicamento', label: '💊 Medicamento' },
                { id: 'Volume Grande', label: '🛋️ Volume Grande' },
                { id: 'Outro', label: '🏷️ Outro' }
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
                <Truck className="w-3.5 h-3.5 text-indigo-400" /> Empresa / Transportadora:
              </label>
              <input
                type="text"
                placeholder="Ex: Mercado Livre, Correios, Amazon, iFood..."
                value={empresaTransporte}
                onChange={(e) => setEmpresaTransporte(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300">
                Código / Rastreio / Nota (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: MLB-12345, Sedex..."
                value={codigoRastreio}
                onChange={(e) => setCodigoRastreio(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Local de Armazenamento na Portaria */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Onde foi guardado na Portaria:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                'Armário A - Prat. 1',
                'Armário B - Prat. 2',
                'Geladeira Portaria',
                'Gaveta Documentos'
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
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Foto do Pacote (Opcional):
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
                  className="w-14 h-14 rounded-xl object-cover border border-indigo-400 shrink-0"
                />
              )}
              <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Fotografar Encomenda
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
              Observações do Porteiro:
            </label>
            <input
              type="text"
              placeholder="Ex: Caixa com fita adesiva amarela, entregue às pressas pelo motoboy..."
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
              <span>Salvar & Notificar Morador</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
