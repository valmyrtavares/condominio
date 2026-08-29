import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { UnidadeDisponivel, FinalidadeImovel } from '../../types';
import { 
  Building2, 
  X, 
  DollarSign, 
  Maximize2, 
  BedDouble, 
  Car, 
  Phone, 
  MessageCircle, 
  User, 
  Check, 
  Tag,
  Bath,
  FileText
} from 'lucide-react';

interface CreateEditUnidadeDisponivelModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidadeToEdit?: UnidadeDisponivel | null;
}

export const CreateEditUnidadeDisponivelModal: React.FC<CreateEditUnidadeDisponivelModalProps> = ({
  isOpen,
  onClose,
  unidadeToEdit
}) => {
  const { unidades, adicionarUnidadeDisponivel, editarUnidadeDisponivel } = useCondo();

  const [apartamento, setApartamento] = useState('');
  const [bloco, setBloco] = useState('Bloco A');
  const [finalidade, setFinalidade] = useState<FinalidadeImovel>('Aluga-se');
  const [valor, setValor] = useState<string>('');
  const [valorCondominio, setValorCondominio] = useState<string>('');
  const [valorIptu, setValorIptu] = useState<string>('');
  const [metragemM2, setMetragemM2] = useState<string>('');
  const [quartos, setQuartos] = useState<number>(2);
  const [suites, setSuites] = useState<number>(1);
  const [vagasGaragem, setVagasGaragem] = useState<number>(1);
  const [proprietarioNome, setProprietarioNome] = useState('');
  const [proprietarioTelefone, setProprietarioTelefone] = useState('');
  const [proprietarioWhatsapp, setProprietarioWhatsapp] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');

  // Sincroniza formulário com o item a ser editado ou reseta para novo cadastro
  useEffect(() => {
    if (unidadeToEdit) {
      setApartamento(unidadeToEdit.apartamento || '');
      setBloco(unidadeToEdit.bloco || 'Bloco A');
      setFinalidade(unidadeToEdit.finalidade || 'Aluga-se');
      setValor(unidadeToEdit.valor ? String(unidadeToEdit.valor) : '');
      setValorCondominio(unidadeToEdit.valorCondominio ? String(unidadeToEdit.valorCondominio) : '');
      setValorIptu(unidadeToEdit.valorIptu ? String(unidadeToEdit.valorIptu) : '');
      setMetragemM2(unidadeToEdit.metragemM2 ? String(unidadeToEdit.metragemM2) : '');
      setQuartos(unidadeToEdit.quartos || 2);
      setSuites(unidadeToEdit.suites || 0);
      setVagasGaragem(unidadeToEdit.vagasGaragem || 1);
      setProprietarioNome(unidadeToEdit.proprietarioNome || '');
      setProprietarioTelefone(unidadeToEdit.proprietarioTelefone || '');
      setProprietarioWhatsapp(unidadeToEdit.proprietarioWhatsapp || '');
      setDescricaoCurta(unidadeToEdit.descricaoCurta || '');
    } else {
      // Valor padrão inicial para novo anúncio
      const primeiraUnidade = unidades[0]?.numero || '101';
      setApartamento(primeiraUnidade);
      setBloco(unidades[0]?.bloco || 'Bloco A');
      setFinalidade('Aluga-se');
      setValor('');
      setValorCondominio('850');
      setValorIptu('220');
      setMetragemM2('75');
      setQuartos(2);
      setSuites(1);
      setVagasGaragem(1);
      setProprietarioNome('');
      setProprietarioTelefone('(11) 9');
      setProprietarioWhatsapp('5511');
      setDescricaoCurta('');
    }
  }, [unidadeToEdit, isOpen, unidades]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ao selecionar um apartamento no <select>, atualiza bloco e proprietário conhecido se houver
  const handleSelectApartamento = (numApto: string) => {
    setApartamento(numApto);
    const undEncontrada = unidades.find(u => u.numero.toLowerCase() === numApto.toLowerCase());
    if (undEncontrada) {
      if (undEncontrada.bloco) setBloco(undEncontrada.bloco);
      if (undEncontrada.moradores && undEncontrada.moradores.length > 0) {
        const primeiroMorador = undEncontrada.moradores[0];
        if (!proprietarioNome) {
          setProprietarioNome(primeiroMorador.nome || '');
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numValor = parseFloat(valor.replace(',', '.')) || 0;
    const numCondo = valorCondominio ? parseFloat(valorCondominio.replace(',', '.')) : undefined;
    const numIptu = valorIptu ? parseFloat(valorIptu.replace(',', '.')) : undefined;
    const numMetros = parseFloat(metragemM2.replace(',', '.')) || 0;

    const cleanWhatsapp = proprietarioWhatsapp.replace(/\D/g, '') || proprietarioTelefone.replace(/\D/g, '');

    const dadosUnidade = {
      apartamento: apartamento.trim(),
      bloco: bloco.trim() || 'Bloco A',
      finalidade,
      valor: numValor,
      valorCondominio: numCondo,
      valorIptu: numIptu,
      metragemM2: numMetros,
      quartos: Number(quartos),
      suites: Number(suites),
      vagasGaragem: Number(vagasGaragem),
      proprietarioNome: proprietarioNome.trim() || 'Proprietário',
      proprietarioTelefone: proprietarioTelefone.trim() || '(11) 99999-9999',
      proprietarioWhatsapp: cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`,
      descricaoCurta: descricaoCurta.trim()
    };

    if (unidadeToEdit) {
      editarUnidadeDisponivel(unidadeToEdit.id, dadosUnidade);
    } else {
      adicionarUnidadeDisponivel(dadosUnidade);
    }

    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white border-2 border-amber-400 rounded-3xl shadow-2xl flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header Fixo */}
        <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-amber-100 via-amber-50 to-white flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                {unidadeToEdit ? 'Editar Anúncio de Imóvel' : 'Anunciar Nova Unidade Disponível'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {unidadeToEdit 
                  ? `Atualize os valores e informações do Apto ${unidadeToEdit.apartamento}`
                  : 'Selecione uma unidade existente do condomínio para alugar ou vender'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-amber-200/60 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body com Rolagem Interna */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-4 sm:p-6 space-y-5">
          
          {/* SELEÇÃO DA UNIDADE (SELECT DE UNIDADES EXISTENTES) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-800" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                1. Seleção da Unidade do Condomínio *
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  Apartamento Existente:
                </span>
                <select
                  value={apartamento}
                  onChange={(e) => handleSelectApartamento(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
                  required
                >
                  <option value="">Selecione um apartamento...</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.numero}>
                      Apto {u.numero} {u.bloco ? `(${u.bloco})` : ''} {u.vagaGaragem ? `- ${u.vagaGaragem}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  Bloco / Torre:
                </span>
                <input
                  type="text"
                  placeholder="Ex: Bloco A, Torre Sul..."
                  value={bloco}
                  onChange={(e) => setBloco(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* FINALIDADE DO ANÚNCIO (ALUGA-SE / VENDE-SE / ALUGA OU VENDE) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-800" />
              2. Modalidade do Anúncio *
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(['Aluga-se', 'Vende-se', 'Aluga-se ou Vende-se'] as FinalidadeImovel[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFinalidade(mode)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all border text-center cursor-pointer ${
                    finalidade === mode
                      ? mode === 'Aluga-se'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]'
                        : mode === 'Vende-se'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                          : 'bg-purple-600 text-white border-purple-700 shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'Aluga-se' && '🔑 '}
                  {mode === 'Vende-se' && '🏷️ '}
                  {mode === 'Aluga-se ou Vende-se' && '✨ '}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* VALORES FINANCEIROS (VALOR PRINCIPAL, CONDOMÍNIO E IPTU) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-800" />
              3. Valores Financeiros *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  {finalidade === 'Vende-se' ? 'Valor de Venda (R$) *' : 'Valor Locação / Mês (R$) *'}
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 3500.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 font-mono shadow-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  Taxa Condomínio (R$):
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 850.00"
                    value={valorCondominio}
                    onChange={(e) => setValorCondominio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  IPTU Mensal (R$):
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 220.00"
                    value={valorIptu}
                    onChange={(e) => setValorIptu(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS FÍSICAS DO IMÓVEL */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-amber-800" />
              4. Características do Imóvel *
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Área Útil (m²):</span>
                <input
                  type="number"
                  placeholder="Ex: 85"
                  value={metragemM2}
                  onChange={(e) => setMetragemM2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Quartos:</span>
                <select
                  value={quartos}
                  onChange={(e) => setQuartos(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Quarto' : 'Quartos'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Suítes:</span>
                <select
                  value={suites}
                  onChange={(e) => setSuites(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                >
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Suíte' : 'Suítes'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Vagas de Garagem:</span>
                <select
                  value={vagasGaragem}
                  onChange={(e) => setVagasGaragem(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                >
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Vaga' : 'Vagas'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DADOS DO PROPRIETÁRIO / CONTATO */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-800" />
              5. Dados do Proprietário / Responsável *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Nome do Responsável:</span>
                <input
                  type="text"
                  placeholder="Ex: Dr. Roberto Alcantara"
                  value={proprietarioNome}
                  onChange={(e) => setProprietarioNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Telefone:</span>
                <input
                  type="text"
                  placeholder="Ex: (11) 98888-2233"
                  value={proprietarioTelefone}
                  onChange={(e) => setProprietarioTelefone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">WhatsApp (Número Completo):</span>
                <input
                  type="text"
                  placeholder="Ex: 5511988882233"
                  value={proprietarioWhatsapp}
                  onChange={(e) => setProprietarioWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO CURTA DOS DIFERENCIAIS */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-800" />
              6. Descrição dos Diferenciais do Apartamento *
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Apartamento em andar alto com vista panorâmica, sacada gourmet envidraçada, armários planejados na cozinha e quartos, recém-pintado..."
              value={descricaoCurta}
              onChange={(e) => setDescricaoCurta(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-medium focus:outline-none focus:bg-white focus:border-amber-500 resize-none shadow-xs"
              required
            />
          </div>

          {/* RODAPÉ FIXO DO MODAL */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{unidadeToEdit ? 'Salvar Alterações' : 'Publicar Anúncio'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
