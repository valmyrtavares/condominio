import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { StatusServicoContratado, ServicoContratado, PropostaEmpresa } from '../types';
import { 
  FileText, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Send, 
  Search, 
  DollarSign, 
  Check, 
  HelpCircle, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const ServicosContratadosScreen: React.FC = () => {
  const { 
    servicosContratados, 
    currentUser, 
    adicionarServicoContratado, 
    selecionarPropostaVencedora,
    setCurrentScreen,
    toggleRole 
  } = useCondo();

  const [expandedId, setExpandedId] = useState<string | null>('sc-elevadores');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isAdmin = currentUser.role === 'subsindico' || currentUser.role === 'sindico';

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Manutenção Geral');
  const [status, setStatus] = useState<StatusServicoContratado>('Contratada');
  const [observacoesFinais, setObservacoesFinais] = useState('');

  // 3 Empresas Form State
  const [emp1Nome, setEmp1Nome] = useState('');
  const [emp1Site, setEmp1Site] = useState('');
  const [emp1Valor, setEmp1Valor] = useState('');
  const [emp1Pagto, setEmp1Pagto] = useState('');
  const [emp1Prazo, setEmp1Prazo] = useState('');
  const [emp1Desc, setEmp1Desc] = useState('');
  const [emp1JaPrestou, setEmp1JaPrestou] = useState(false);
  const [emp1Vencedora, setEmp1Vencedora] = useState(true);

  const [emp2Nome, setEmp2Nome] = useState('');
  const [emp2Site, setEmp2Site] = useState('');
  const [emp2Valor, setEmp2Valor] = useState('');
  const [emp2Pagto, setEmp2Pagto] = useState('');
  const [emp2Prazo, setEmp2Prazo] = useState('');
  const [emp2Desc, setEmp2Desc] = useState('');
  const [emp2JaPrestou, setEmp2JaPrestou] = useState(false);

  const [emp3Nome, setEmp3Nome] = useState('');
  const [emp3Site, setEmp3Site] = useState('');
  const [emp3Valor, setEmp3Valor] = useState('');
  const [emp3Pagto, setEmp3Pagto] = useState('');
  const [emp3Prazo, setEmp3Prazo] = useState('');
  const [emp3Desc, setEmp3Desc] = useState('');
  const [emp3JaPrestou, setEmp3JaPrestou] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!titulo.trim() || !descricao.trim() || !emp1Nome.trim()) return;

    const propostas: PropostaEmpresa[] = [
      {
        id: `prop-${Date.now()}-1`,
        empresaNome: emp1Nome,
        siteUrl: emp1Site || 'https://empresa.exemplo.com.br',
        valor: emp1Valor ? parseFloat(emp1Valor) : 0,
        formaPagamento: emp1Pagto || 'Boleto faturado',
        prazoEntrega: emp1Prazo || 'A combinar',
        descricao: emp1Desc || 'Proposta comercial apresentada.',
        jaPrestouServico: emp1JaPrestou,
        selecionada: status === 'Contratada' ? emp1Vencedora : false
      }
    ];

    if (emp2Nome.trim()) {
      propostas.push({
        id: `prop-${Date.now()}-2`,
        empresaNome: emp2Nome,
        siteUrl: emp2Site || 'https://concorrente.exemplo.com.br',
        valor: emp2Valor ? parseFloat(emp2Valor) : 0,
        formaPagamento: emp2Pagto || 'Boleto bancário',
        prazoEntrega: emp2Prazo || 'A combinar',
        descricao: emp2Desc || 'Proposta técnica concorrente.',
        jaPrestouServico: emp2JaPrestou,
        selecionada: false
      });
    }

    if (emp3Nome.trim()) {
      propostas.push({
        id: `prop-${Date.now()}-3`,
        empresaNome: emp3Nome,
        siteUrl: emp3Site || 'https://concorrente3.exemplo.com.br',
        valor: emp3Valor ? parseFloat(emp3Valor) : 0,
        formaPagamento: emp3Pagto || 'Boleto bancário',
        prazoEntrega: emp3Prazo || 'A combinar',
        descricao: emp3Desc || 'Proposta técnica concorrente.',
        jaPrestouServico: emp3JaPrestou,
        selecionada: false
      });
    }

    adicionarServicoContratado(
      titulo,
      descricao,
      categoria,
      status,
      propostas,
      observacoesFinais
    );

    // Reset Form & Collapse
    setTitulo('');
    setDescricao('');
    setObservacoesFinais('');
    setEmp1Nome('');
    setEmp1Site('');
    setEmp1Valor('');
    setEmp1Pagto('');
    setEmp1Prazo('');
    setEmp1Desc('');
    setEmp2Nome('');
    setEmp2Site('');
    setEmp2Valor('');
    setEmp2Pagto('');
    setEmp2Prazo('');
    setEmp2Desc('');
    setEmp3Nome('');
    setEmp3Site('');
    setEmp3Valor('');
    setEmp3Pagto('');
    setEmp3Prazo('');
    setEmp3Desc('');
    setIsFormOpen(false);
  };

  // Filter Logic
  const filteredServicos = servicosContratados.filter(s => {
    const matchesStatus = filterStatus === 'Todas' || s.status === filterStatus;
    const matchesSearch = !searchTerm || 
      s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.propostas.some(p => p.empresaNome.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (st: StatusServicoContratado) => {
    switch (st) {
      case 'Contratada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Contratada
          </span>
        );
      case 'Aguardando avaliação de proposta':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-purple-700" />
            Aguardando Avaliação
          </span>
        );
      case 'Aguardando propostas':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Aguardando Propostas
          </span>
        );
      default:
        return null;
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

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Briefcase className="w-5 h-5 text-amber-400" />
          Serviços Contratados pelo Condomínio
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Processos licitatórios com 3 orçamentos comparativos de empresas, prazos, formas de pagamento e transparência na contratação.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Contratadas</span>
          <span className="text-base sm:text-lg font-black text-emerald-950">
            {servicosContratados.filter(s => s.status === 'Contratada').length} serviços
          </span>
        </div>
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Em Avaliação</span>
          <span className="text-base sm:text-lg font-black text-purple-950">
            {servicosContratados.filter(s => s.status === 'Aguardando avaliação de proposta').length} serviços
          </span>
        </div>
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Em Cotação</span>
          <span className="text-base sm:text-lg font-black text-amber-950">
            {servicosContratados.filter(s => s.status === 'Aguardando propostas').length} editais
          </span>
        </div>
      </div>

      {/* Formulário: Exclusivo para a Síndica (Expansível / Recolhível) */}
      <div className={`bg-white/45 border rounded-3xl overflow-hidden shadow-xl transition-all ${
        isAdmin ? 'border-amber-400/80 ring-2 ring-amber-400/30' : 'border-white/60 opacity-90'
      }`}>
        {/* Cabeçalho Clicável para Abrir/Fechar Formulário */}
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-white/40 transition-all focus:outline-none"
        >
          <div className="flex items-center gap-2.5 text-slate-950">
            <div className={`p-2 rounded-2xl ${isAdmin ? 'bg-amber-500 text-slate-950' : 'bg-slate-300 text-slate-700'} shadow-sm`}>
              {isAdmin ? (
                <Plus className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950">
                Publicar Tomada de Preços & Contratação
              </h3>
              <span className="text-[11px] text-slate-700 font-semibold block">
                {isFormOpen ? 'Clique para recolher o formulário' : 'Clique para expandir e cadastrar novo serviço / cotação'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border hidden sm:flex items-center gap-1 ${
              isAdmin 
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              {isAdmin ? '✓ Acesso Habilitado (Síndica)' : '🔒 Bloqueado: Apenas Síndica'}
            </span>

            <div className="p-2 rounded-full bg-white/70 border border-white/90 text-slate-900 shadow-xs">
              {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Conteúdo do Formulário (Exibido apenas quando aberto) */}
        {isFormOpen && (
          <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-slate-950/10 pt-4 animate-in slide-in-from-top-2 duration-200">
            {!isAdmin && (
              <div className="p-3 bg-amber-500/15 border border-amber-400/50 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    Este formulário é de uso exclusivo da Administração/Síndica para cadastrar as 3 cotações de fornecedores e formalizar contratos.
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <fieldset disabled={!isAdmin} className="space-y-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
            
            {/* Header Data: Título, Categoria e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Título do Serviço a Contratar
                </label>
                <input
                  type="text"
                  placeholder="Ex: Contratação de Manutenção dos Elevadores ou Câmeras CFTV"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1 min-w-0">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                  Status da Contratação
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusServicoContratado)}
                  className="w-full bg-white/70 border border-white/90 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white"
                >
                  <option value="Aguardando propostas">Aguardando propostas</option>
                  <option value="Aguardando avaliação de proposta">Aguardando avaliação de proposta</option>
                  <option value="Contratada">Contratada</option>
                </select>
              </div>
            </div>

            {/* Descrição do Escopo */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                Descrição do Escopo / Objeto da Contratação
              </label>
              <textarea
                placeholder="Descreva as especificações técnicas, exigências de garantia e necessidades do condomínio..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white resize-none"
                required
              />
            </div>

            {/* 3 Cards de Empresas Concorrentes */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-950 block">
                3 Propostas / Orçamentos de Empresas Concorrentes:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Empresa 1 (Vencedora / Principal) */}
                <div className="bg-white/60 border border-emerald-400/80 p-3 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-950">Empresa 1 (Vencedora)</span>
                    <label className="text-[10px] flex items-center gap-1 font-bold text-slate-800">
                      <input 
                        type="checkbox" 
                        checked={emp1JaPrestou} 
                        onChange={(e) => setEmp1JaPrestou(e.target.checked)} 
                        className="rounded"
                      /> Já prestou serviço
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome da Empresa 1 *"
                    value={emp1Nome}
                    onChange={(e) => setEmp1Nome(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Site: https://empresa.com.br"
                    value={emp1Site}
                    onChange={(e) => setEmp1Site(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 font-mono focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Valor (R$)"
                      value={emp1Valor}
                      onChange={(e) => setEmp1Valor(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Prazo entrega"
                      value={emp1Prazo}
                      onChange={(e) => setEmp1Prazo(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Forma de pagamento"
                    value={emp1Pagto}
                    onChange={(e) => setEmp1Pagto(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                  />
                  <textarea
                    placeholder="Resumo da proposta técnica..."
                    value={emp1Desc}
                    onChange={(e) => setEmp1Desc(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none resize-none"
                  />
                </div>

                {/* Empresa 2 */}
                <div className="bg-white/60 border border-white/80 p-3 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-800">Empresa 2 (Concorrente)</span>
                    <label className="text-[10px] flex items-center gap-1 font-bold text-slate-800">
                      <input 
                        type="checkbox" 
                        checked={emp2JaPrestou} 
                        onChange={(e) => setEmp2JaPrestou(e.target.checked)} 
                        className="rounded"
                      /> Já prestou serviço
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome da Empresa 2"
                    value={emp2Nome}
                    onChange={(e) => setEmp2Nome(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Site: https://..."
                    value={emp2Site}
                    onChange={(e) => setEmp2Site(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 font-mono focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Valor (R$)"
                      value={emp2Valor}
                      onChange={(e) => setEmp2Valor(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Prazo entrega"
                      value={emp2Prazo}
                      onChange={(e) => setEmp2Prazo(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Forma de pagamento"
                    value={emp2Pagto}
                    onChange={(e) => setEmp2Pagto(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                  />
                  <textarea
                    placeholder="Resumo da proposta técnica..."
                    value={emp2Desc}
                    onChange={(e) => setEmp2Desc(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none resize-none"
                  />
                </div>

                {/* Empresa 3 */}
                <div className="bg-white/60 border border-white/80 p-3 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-800">Empresa 3 (Concorrente)</span>
                    <label className="text-[10px] flex items-center gap-1 font-bold text-slate-800">
                      <input 
                        type="checkbox" 
                        checked={emp3JaPrestou} 
                        onChange={(e) => setEmp3JaPrestou(e.target.checked)} 
                        className="rounded"
                      /> Já prestou serviço
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome da Empresa 3"
                    value={emp3Nome}
                    onChange={(e) => setEmp3Nome(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Site: https://..."
                    value={emp3Site}
                    onChange={(e) => setEmp3Site(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 font-mono focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Valor (R$)"
                      value={emp3Valor}
                      onChange={(e) => setEmp3Valor(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Prazo entrega"
                      value={emp3Prazo}
                      onChange={(e) => setEmp3Prazo(e.target.value)}
                      className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Forma de pagamento"
                    value={emp3Pagto}
                    onChange={(e) => setEmp3Pagto(e.target.value)}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                  />
                  <textarea
                    placeholder="Resumo da proposta técnica..."
                    value={emp3Desc}
                    onChange={(e) => setEmp3Desc(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-white/90 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900 focus:outline-none resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Observações da Sindicância */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
                Parecer da Sindicância / Justificativa da Escolha
              </label>
              <input
                type="text"
                placeholder="Ex: Proposta da Empresa 1 selecionada por garantia estendida e melhor histórico em chamados de emergência"
                value={observacoesFinais}
                onChange={(e) => setObservacoesFinais(e.target.value)}
                className="w-full bg-white/70 border border-white/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!isAdmin}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Publicar Tomada de Preços & Contratação</span>
              </button>
            </div>

          </fieldset>
        </form>
      </div>
      )}
    </div>

      {/* Filters & Search */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Status:
          </span>
          {['Todas', 'Aguardando propostas', 'Aguardando avaliação de proposta', 'Contratada'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por serviço, categoria ou nome da empresa prestadora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* List of Contracted Services (Cards Expansíveis) */}
      <div className="space-y-3.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Lista de Contratações & Cotações ({filteredServicos.length})
        </span>

        {filteredServicos.map((servico) => {
          const isExpanded = expandedId === servico.id;
          const empresaGanhadora = servico.propostas.find(p => p.selecionada);

          return (
            <div
              key={servico.id}
              className="bg-white/45 border border-white/60 rounded-3xl overflow-hidden shadow-xl hover:bg-white/55 transition-all duration-300"
            >
              {/* Header do Card (Sempre Visível) */}
              <button
                onClick={() => toggleExpand(servico.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div className="space-y-1.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-slate-900/10 text-slate-900 border border-slate-900/20 uppercase">
                      {servico.categoria}
                    </span>
                    {getStatusBadge(servico.status)}
                    <span className="text-[11px] text-slate-800 font-mono font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" /> {servico.data}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight">
                    {servico.titulo}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold flex-wrap">
                    {servico.status === 'Contratada' && empresaGanhadora ? (
                      <span className="text-emerald-950 font-black flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Contratada: {empresaGanhadora.empresaNome} (R$ {empresaGanhadora.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </span>
                    ) : servico.status === 'Aguardando propostas' ? (
                      <span className="text-amber-950 font-bold bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {servico.propostas.length} de 3 Propostas Recebidas (Cotação Aberta)
                      </span>
                    ) : (
                      <span className="text-purple-950 font-bold bg-purple-100/80 px-2 py-0.5 rounded border border-purple-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-700" />
                        {servico.propostas.length} Propostas em Avaliação da Gestão
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 p-2 rounded-full bg-white/60 border border-white/80 text-slate-900 shadow-xs">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Corpo Expansível */}
              {isExpanded && (
                <div className="px-4 pb-5 space-y-4 border-t border-slate-950/10 pt-4 animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Descrição do Edital */}
                  <div className="bg-white/60 border border-white/80 p-3.5 rounded-2xl text-xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-700 block">
                      Escopo da Contratação:
                    </span>
                    <p className="text-slate-900 leading-relaxed font-semibold">
                      {servico.descricao}
                    </p>
                  </div>

                  {/* 3 Cards das Empresas ou Propostas Recebidas */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 flex items-center justify-between">
                      <span>
                        {servico.propostas.length === 1 
                          ? '1ª Proposta Recebida (Aguardando demais orçamentos)' 
                          : 'Propostas Concorrentes das Empresas'}
                      </span>
                      {servico.status === 'Contratada' && (
                        <span className="text-[10px] text-emerald-900 font-bold">
                          Empresa selecionada em destaque
                        </span>
                      )}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {servico.propostas.map((prop, idx) => {
                        const isWinner = prop.selecionada;
                        const isDiscarded = servico.status === 'Contratada' && !prop.selecionada;

                        return (
                          <div
                            key={prop.id || idx}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                              isWinner
                                ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg scale-102'
                                : isDiscarded
                                  ? 'bg-white/35 border-slate-300 opacity-75'
                                  : 'bg-white/60 border-white/80 shadow-sm'
                            }`}
                          >
                            <div className="space-y-2">
                              
                              {/* Status Vencedora vs Descartada */}
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                {isWinner && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white shadow-2xs">
                                    ★ Contratada / Vencedora
                                  </span>
                                )}
                                {isDiscarded && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-700">
                                    Descartada ✗
                                  </span>
                                )}
                                {!isWinner && !isDiscarded && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-900">
                                    {servico.propostas.length === 1 ? '1ª Proposta Recebida' : `Proposta ${idx + 1}`}
                                  </span>
                                )}

                                {prop.jaPrestouServico ? (
                                  <span className="text-[9px] font-extrabold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                                    ✓ Já prestou serviço
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                    Novo fornecedor
                                  </span>
                                )}
                              </div>

                              {/* Nome da Empresa & Site */}
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-950 leading-snug">
                                  {prop.empresaNome}
                                </h4>
                                {prop.cnpj && (
                                  <span className="text-[10px] font-mono text-slate-600 block">
                                    CNPJ: {prop.cnpj}
                                  </span>
                                )}
                              </div>

                              {/* Valor */}
                              <div className="p-2.5 rounded-xl bg-white/70 border border-white/90">
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase block">
                                  Valor da Proposta:
                                </span>
                                <span className={`text-base font-black ${isWinner ? 'text-emerald-950' : 'text-slate-900'}`}>
                                  R$ {prop.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>

                              {/* Detalhes de Pagamento e Prazo */}
                              <div className="space-y-1 text-xs">
                                <div className="text-[11px] text-slate-800">
                                  <strong className="text-slate-950 font-extrabold">Pagamento:</strong> {prop.formaPagamento}
                                </div>
                                <div className="text-[11px] text-slate-800">
                                  <strong className="text-slate-950 font-extrabold">Prazo:</strong> {prop.prazoEntrega}
                                </div>
                                <p className="text-[11px] text-slate-700 leading-relaxed font-medium pt-1 border-t border-slate-900/10">
                                  {prop.descricao}
                                </p>
                              </div>

                            </div>

                            {/* Botão de Link para o Site da Empresa */}
                            <div className="pt-2 space-y-1.5">
                              <a
                                href={prop.siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Acessar Site da Empresa</span>
                              </a>

                              {/* Ação rápida para o Síndico aprovar proposta quando em avaliação */}
                              {isAdmin && servico.status !== 'Contratada' && (
                                <button
                                  type="button"
                                  onClick={() => selecionarPropostaVencedora(servico.id, prop.id)}
                                  className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold shadow-sm transition-all flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  Selecionar como Vencedora
                                </button>
                              )}
                            </div>

                          </div>
                        );
                      })}

                      {/* Placeholders quando houver apenas 1 proposta em cotação aberta */}
                      {servico.propostas.length === 1 && (
                        <>
                          <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-500/10 flex flex-col items-center justify-center text-center space-y-2 min-h-[220px]">
                            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-900">
                              <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
                            </div>
                            <h4 className="font-extrabold text-xs text-amber-950">
                              Aguardando 2ª Proposta Concorrente
                            </h4>
                            <p className="text-[11px] text-slate-800 font-semibold max-w-[200px]">
                              Empresas concorrentes notificadas. Aguardando envio da proposta técnica.
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-500/10 flex flex-col items-center justify-center text-center space-y-2 min-h-[220px]">
                            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-900">
                              <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
                            </div>
                            <h4 className="font-extrabold text-xs text-amber-950">
                              Aguardando 3ª Proposta Concorrente
                            </h4>
                            <p className="text-[11px] text-slate-800 font-semibold max-w-[200px]">
                              Vistoria técnica agendada para formalização do orçamento.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Observações da Sindicância / Parecer */}
                  {servico.observacoesFinais && (
                    <div className="bg-amber-500/15 border border-amber-400/50 p-3 rounded-2xl text-xs space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-950 uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Parecer e Justificativa da Sindicância
                      </span>
                      <p className="text-slate-950 font-semibold leading-relaxed">
                        {servico.observacoesFinais}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
