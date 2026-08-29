import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { ServicoContratado, StatusServicoContratado } from '../../types';
import { 
  Briefcase, 
  X, 
  DollarSign, 
  Phone, 
  MessageCircle, 
  Mail, 
  Globe, 
  User, 
  Check, 
  Tag, 
  Layers, 
  FileText,
  Calendar,
  ShieldCheck,
  Building2
} from 'lucide-react';

const CATEGORIAS_SUGERIDAS = [
  'Elevadores',
  'Paisagismo',
  'Elétrica',
  'Segurança & Portaria',
  'CFTV & Interfonia',
  'Piscina',
  'Pintura & Fachada',
  'Dedetização & Pragas',
  'Serralheria & Portões',
  'Limpeza & Conservação',
  'Assessoria & Contabilidade'
];

interface CreateEditServicoContratadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicoToEdit?: ServicoContratado | null;
}

export const CreateEditServicoContratadoModal: React.FC<CreateEditServicoContratadoModalProps> = ({
  isOpen,
  onClose,
  servicoToEdit
}) => {
  const { adicionarServicoContratado, editarServicoContratado } = useCondo();

  const [empresaNome, setEmpresaNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [categoria, setCategoria] = useState('Elevadores');
  const [status, setStatus] = useState<StatusServicoContratado>('Contratada');
  const [servicoDescricao, setServicoDescricao] = useState('');
  const [valor, setValor] = useState<string>('');
  const [tipoValor, setTipoValor] = useState<'mensal' | 'pontual' | 'semestral' | 'anual'>('mensal');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [responsavelContato, setResponsavelContato] = useState('');
  const [dataContratoOuOrcamento, setDataContratoOuOrcamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Sincroniza formulário ao abrir com item a ser editado ou reseta para novo cadastro
  useEffect(() => {
    if (servicoToEdit) {
      setEmpresaNome(servicoToEdit.empresaNome || '');
      setCnpj(servicoToEdit.cnpj || '');
      setCategoria(servicoToEdit.categoria || 'Elevadores');
      setStatus(servicoToEdit.status || 'Contratada');
      setServicoDescricao(servicoToEdit.servicoDescricao || '');
      setValor(servicoToEdit.valor ? String(servicoToEdit.valor) : '');
      setTipoValor(servicoToEdit.tipoValor || 'mensal');
      setFormaPagamento(servicoToEdit.formaPagamento || '');
      setTelefone(servicoToEdit.telefone || '');
      setWhatsapp(servicoToEdit.whatsapp || '');
      setEmail(servicoToEdit.email || '');
      setSiteUrl(servicoToEdit.siteUrl || '');
      setResponsavelContato(servicoToEdit.responsavelContato || '');
      setDataContratoOuOrcamento(servicoToEdit.dataContratoOuOrcamento || '');
      setObservacoes(servicoToEdit.observacoes || '');
    } else {
      setEmpresaNome('');
      setCnpj('');
      setCategoria('Elevadores');
      setStatus('Contratada');
      setServicoDescricao('');
      setValor('');
      setTipoValor('mensal');
      setFormaPagamento('Boleto bancário faturado');
      setTelefone('(11) ');
      setWhatsapp('5511');
      setEmail('');
      setSiteUrl('https://');
      setResponsavelContato('');
      setDataContratoOuOrcamento(new Date().toLocaleDateString('pt-BR'));
      setObservacoes('');
    }
  }, [servicoToEdit, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numValor = valor ? parseFloat(valor.replace(',', '.')) : undefined;
    const cleanWhatsapp = whatsapp.replace(/\D/g, '') || telefone.replace(/\D/g, '');

    const dadosEmpresa = {
      empresaNome: empresaNome.trim(),
      cnpj: cnpj.trim() || undefined,
      categoria: categoria.trim() || 'Manutenção Geral',
      status,
      servicoDescricao: servicoDescricao.trim(),
      valor: numValor,
      tipoValor,
      formaPagamento: formaPagamento.trim() || undefined,
      telefone: telefone.trim(),
      whatsapp: cleanWhatsapp ? (cleanWhatsapp.startsWith('55') ? cleanWhatsapp : `55${cleanWhatsapp}`) : undefined,
      email: email.trim() || undefined,
      siteUrl: siteUrl.trim() || undefined,
      responsavelContato: responsavelContato.trim() || undefined,
      dataContratoOuOrcamento: dataContratoOuOrcamento.trim() || new Date().toLocaleDateString('pt-BR'),
      observacoes: observacoes.trim() || undefined
    };

    if (servicoToEdit) {
      editarServicoContratado(servicoToEdit.id, dadosEmpresa);
    } else {
      adicionarServicoContratado(dadosEmpresa);
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
        
        {/* Header Fixo */}
        <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-amber-100 via-amber-50 to-white flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
              <Briefcase className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                {servicoToEdit ? 'Editar Fornecedor / Empresa' : 'Cadastrar Fornecedor / Empresa'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {servicoToEdit
                  ? `Atualize os dados comerciais e de contato de ${servicoToEdit.empresaNome}`
                  : 'Cadastre uma empresa contratada ou que enviou cotação ao condomínio'}
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

        {/* Formulário com Rolagem Interna */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-4 sm:p-6 space-y-5">
          
          {/* 1. DADOS PRINCIPAIS: NOME, CNPJ E STATUS */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-800" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                1. Identificação da Empresa & Status *
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Razão Social / Nome Fantasia *</span>
                <input
                  type="text"
                  placeholder="Ex: Atlas Schindler do Brasil Ltda"
                  value={empresaNome}
                  onChange={(e) => setEmpresaNome(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">CNPJ (Opcional):</span>
                <input
                  type="text"
                  placeholder="Ex: 00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Status Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">Situação do Fornecedor *</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Contratada')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                    status === 'Contratada'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ Contratada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Orçada')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                    status === 'Orçada'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>📋 Orçada / Cotação</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Histórico')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                    status === 'Histórico'
                      ? 'bg-slate-700 text-white border-slate-800 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>📁 Histórico</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. CATEGORIA DO SERVIÇO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-800" />
                2. Categoria do Serviço *
              </label>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Ex: Elevadores, Paisagismo, Elétrica, Segurança..."
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500"
                required
              />

              {/* Sugestões de Categorias */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIAS_SUGERIDAS.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoria(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                      categoria === cat
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-100 hover:text-slate-950'
                    }`}
                  >
                    + {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. ESCOPO DO SERVIÇO */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-800" />
              3. Descrição do Serviço Prestado / Cotado *
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Manutenção preventiva e corretiva mensal de 4 elevadores, vistorias técnicas quinzenais, cobertura emergencial 24h e seguro de responsabilidade civil..."
              value={servicoDescricao}
              onChange={(e) => setServicoDescricao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-medium focus:outline-none focus:bg-white focus:border-amber-500 resize-none shadow-xs"
              required
            />
          </div>

          {/* 4. VALORES FINANCEIROS E PERIODICIDADE */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-800" />
              4. Valores Financeiros & Forma de Pagamento
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Valor (R$):</span>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 4100.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Periodicidade:</span>
                <select
                  value={tipoValor}
                  onChange={(e) => setTipoValor(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                >
                  <option value="mensal">Mensal (Contrato Recorrente)</option>
                  <option value="pontual">Pontual (Serviço Único / Obra)</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Condições / Vencimento:</span>
                <input
                  type="text"
                  placeholder="Ex: Boleto todo dia 15"
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 5. CONTATOS E RESPONSÁVEL */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              5. Dados de Contato & Responsável
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Telefone Comercial *</span>
                <input
                  type="text"
                  placeholder="Ex: (11) 3878-9000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">WhatsApp Direto:</span>
                <input
                  type="text"
                  placeholder="Ex: 5511988776655"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">E-mail:</span>
                <input
                  type="email"
                  placeholder="Ex: contato@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Website / Link:</span>
                <input
                  type="url"
                  placeholder="Ex: https://www.empresa.com.br"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Nome do Responsável / Técnico:</span>
                <input
                  type="text"
                  placeholder="Ex: Eng. Maurício Peixoto"
                  value={responsavelContato}
                  onChange={(e) => setResponsavelContato(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Data do Contrato / Orçamento:</span>
                <input
                  type="text"
                  placeholder="Ex: 15/07/2026"
                  value={dataContratoOuOrcamento}
                  onChange={(e) => setDataContratoOuOrcamento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 6. OBSERVAÇÕES & PARECER DA GESTÃO */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              6. Parecer da Sindicância / Avaliação do Desempenho
            </label>
            <input
              type="text"
              placeholder="Ex: Atendimento pontual em chamados de emergência, equipe treinada e peças originais."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-medium focus:outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          {/* RODAPÉ FIXO */}
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
              <span>{servicoToEdit ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
