import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { Dependencia, TipoDependencia } from '../../types';
import { 
  Building2, 
  X, 
  DollarSign, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Plus, 
  Trash2, 
  Upload, 
  Camera, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const TIPOS_SUGERIDOS: TipoDependencia[] = [
  'Lazer & Convivência',
  'Esporte & Saúde',
  'Infantil',
  'Infraestrutura & Acesso'
];

const FOTOS_SUGERIDAS = [
  { label: 'Salão de Festas', url: '/Salão de festas.jpg' },
  { label: 'Piscina', url: '/Piscina.jpg' },
  { label: 'Academia', url: '/academia.jpg' },
  { label: 'Brinquedoteca', url: '/Brinquedoteca.jpg' },
  { label: 'Jardim & Praça', url: '/jardin.jpg' },
  { label: 'Fachada', url: '/Faixada.jpg' },
  { label: 'Quadra Poliesportiva', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
  { label: 'Espaço Coworking', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Churrasqueira Gourmet', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sala de Jogos', url: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80' },
];

const COMODIDADES_SUGERIDAS = [
  'Ar-condicionado split',
  'Churrasqueira a carvão',
  'Forno de pizza',
  'Geladeira duplex',
  'Cervejeira expositora',
  'Sistema de som Bluetooth',
  'Wi-Fi de alta velocidade',
  'Smart TV 65"',
  'Mesas e cadeiras estofadas',
  'Vestiários com duchas',
  'Piscina aquecida',
  'Espreguiçadeiras e ombrelones',
  'Halteres e anilhas',
  'Esteiras Movement novas',
  'Bebedouro refrigerado',
  'Piso emborrachado anti-impacto',
  'Brinquedos e piscina de bolinhas'
];

const REGRAS_SUGERIDAS = [
  'Horário de silêncio rigoroso a partir das 22:00 conforme convenção.',
  'Lista de convidados deve ser enviada para a portaria com antecedência de 24h.',
  'Taxa de reserva inclui serviço de higienização e limpeza pesada pós-uso.',
  'Proibido recipientes, copos ou garrafas de vidro na área.',
  'Crianças menores de 12 anos devem estar acompanhadas por responsáveis.',
  'Obrigatório exame médico dermatológico atualizado no cadastro da administração.',
  'Guardar pesos e equipamentos nos respectivos suportes após a utilização.',
  'Proibido fumar ou fazer uso de narguilé no local.',
  'Manter o ambiente organizado e recolher lixo nos recipientes indicados.'
];

interface CreateEditDependenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependenciaToEdit?: Dependencia | null;
}

export const CreateEditDependenciaModal: React.FC<CreateEditDependenciaModalProps> = ({
  isOpen,
  onClose,
  dependenciaToEdit
}) => {
  const { adicionarDependencia, editarDependencia } = useCondo();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoDependencia>('Lazer & Convivência');
  const [foto, setFoto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
  const [capacidadePessoas, setCapacidadePessoas] = useState<number | string>(30);
  const [requerReserva, setRequerReserva] = useState<boolean>(true);
  const [taxaReserva, setTaxaReserva] = useState<string>('150.00');

  // Listas dinâmicas
  const [comodidades, setComodidades] = useState<string[]>([]);
  const [novaComodidadeInput, setNovaComodidadeInput] = useState('');
  const [regrasUso, setRegrasUso] = useState<string[]>([]);
  const [novaRegraInput, setNovaRegraInput] = useState('');

  const [erroMsg, setErroMsg] = useState('');

  // Sincroniza formulário ao abrir para edição ou novo cadastro
  useEffect(() => {
    if (dependenciaToEdit) {
      setNome(dependenciaToEdit.nome || '');
      setTipo(dependenciaToEdit.tipo || 'Lazer & Convivência');
      setFoto(dependenciaToEdit.foto || '');
      setDescricao(dependenciaToEdit.descricao || '');
      setHorarioFuncionamento(dependenciaToEdit.horarioFuncionamento || '');
      setCapacidadePessoas(dependenciaToEdit.capacidadePessoas || 30);
      setRequerReserva(dependenciaToEdit.requerReserva ?? true);
      setTaxaReserva(dependenciaToEdit.taxaReserva ? String(dependenciaToEdit.taxaReserva) : '');
      setComodidades(dependenciaToEdit.comodidades || []);
      setRegrasUso(dependenciaToEdit.regrasUso || []);
    } else {
      setNome('');
      setTipo('Lazer & Convivência');
      setFoto('/Salão de festas.jpg');
      setDescricao('');
      setHorarioFuncionamento('09:00 às 23:00');
      setCapacidadePessoas(30);
      setRequerReserva(true);
      setTaxaReserva('150.00');
      setComodidades([
        'Ar-condicionado split',
        'Mesas e cadeiras estofadas',
        'Wi-Fi de alta velocidade',
        'Geladeira duplex'
      ]);
      setRegrasUso([
        'Horário de silêncio rigoroso a partir das 22:00 conforme convenção.',
        'Lista de convidados deve ser enviada para a portaria com antecedência de 24h.'
      ]);
    }
    setErroMsg('');
    setNovaComodidadeInput('');
    setNovaRegraInput('');
  }, [dependenciaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComodidade = () => {
    const trimmed = novaComodidadeInput.trim();
    if (trimmed && !comodidades.includes(trimmed)) {
      setComodidades(prev => [...prev, trimmed]);
      setNovaComodidadeInput('');
    }
  };

  const handleRemoveComodidade = (index: number) => {
    setComodidades(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSugestaoComodidade = (sug: string) => {
    if (comodidades.includes(sug)) {
      setComodidades(prev => prev.filter(c => c !== sug));
    } else {
      setComodidades(prev => [...prev, sug]);
    }
  };

  const handleAddRegra = () => {
    const trimmed = novaRegraInput.trim();
    if (trimmed && !regrasUso.includes(trimmed)) {
      setRegrasUso(prev => [...prev, trimmed]);
      setNovaRegraInput('');
    }
  };

  const handleRemoveRegra = (index: number) => {
    setRegrasUso(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSugestaoRegra = (sug: string) => {
    if (regrasUso.includes(sug)) {
      setRegrasUso(prev => prev.filter(r => r !== sug));
    } else {
      setRegrasUso(prev => [...prev, sug]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErroMsg('Por favor, informe o nome da dependência ou área comum.');
      return;
    }
    if (!descricao.trim()) {
      setErroMsg('Por favor, descreva o espaço para os moradores.');
      return;
    }
    if (!horarioFuncionamento.trim()) {
      setErroMsg('Por favor, informe o horário de funcionamento.');
      return;
    }
    if (!foto.trim()) {
      setErroMsg('Por favor, selecione ou envie uma foto para a dependência.');
      return;
    }

    const capacidadeNum = Number(capacidadePessoas) || 1;
    const taxaNum = requerReserva && taxaReserva ? parseFloat(taxaReserva.replace(',', '.')) : undefined;

    const payload = {
      nome: nome.trim(),
      tipo,
      foto: foto.trim(),
      descricao: descricao.trim(),
      horarioFuncionamento: horarioFuncionamento.trim(),
      capacidadePessoas: capacidadeNum,
      requerReserva,
      taxaReserva: taxaNum,
      comodidades: comodidades.length > 0 ? comodidades : ['Wi-Fi', 'Iluminação LED'],
      regrasUso: regrasUso.length > 0 ? regrasUso : ['Respeitar as normas de convivência e horário de silêncio.']
    };

    if (dependenciaToEdit) {
      editarDependencia(dependenciaToEdit.id, payload);
    } else {
      adicionarDependencia(payload);
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                {dependenciaToEdit ? 'Edição Administrativa' : 'Nova Área Comum'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {dependenciaToEdit ? `Editar: ${dependenciaToEdit.nome}` : 'Cadastrar Dependência & Espaço'}
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          
          {erroMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* 1. Foto Principal & Preview */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" /> Foto Principal da Dependência *
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Use foto local, link externo ou upload
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview Thumbnail */}
              <div className="sm:col-span-4 h-32 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 relative flex items-center justify-center group shadow-inner">
                {foto ? (
                  <img
                    src={foto}
                    alt="Preview da Dependência"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Salão de festas.jpg';
                    }}
                  />
                ) : (
                  <div className="text-center p-3 text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] block">Sem imagem</span>
                  </div>
                )}
                {foto && (
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                    Foto Ativa
                  </div>
                )}
              </div>

              {/* Upload e URL Input */}
              <div className="sm:col-span-8 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={foto}
                    onChange={(e) => setFoto(e.target.value)}
                    placeholder="URL da imagem (ex: /Salão de festas.jpg ou https://...)"
                    className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
                  <label className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sugestões Rápidas de Fotos */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    Sugestões prontas do condomínio:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {FOTOS_SUGERIDAS.map((sug) => (
                      <button
                        key={sug.url}
                        type="button"
                        onClick={() => setFoto(sug.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-colors cursor-pointer ${
                          foto === sug.url
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {sug.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Informações Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Nome da Dependência / Área Comum *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Salão de Festas Premium, Espaço Gourmet & Parrilla, Piscina Adulto..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Tipo / Categoria *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoDependencia)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                {TIPOS_SUGERIDOS.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Horário de Funcionamento *
              </label>
              <input
                type="text"
                value={horarioFuncionamento}
                onChange={(e) => setHorarioFuncionamento(e.target.value)}
                placeholder="Ex: 09:00 às 23:00 ou 06:00 às 22:00 (Ter a Dom)"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Capacidade Máxima de Pessoas *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={capacidadePessoas}
                onChange={(e) => setCapacidadePessoas(e.target.value)}
                placeholder="Ex: 50"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-300">
                Regime de Acesso & Agendamento
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setRequerReserva(true)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    requerReserva
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${requerReserva ? 'opacity-100' : 'opacity-0'}`} />
                  Requer Reserva
                </button>
                <button
                  type="button"
                  onClick={() => setRequerReserva(false)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    !requerReserva
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${!requerReserva ? 'opacity-100' : 'opacity-0'}`} />
                  Uso Livre (Sem Reserva)
                </button>
              </div>
            </div>

            {requerReserva && (
              <div className="space-y-1.5 sm:col-span-2 bg-purple-950/20 border border-purple-800/40 p-3.5 rounded-2xl">
                <label className="text-[11px] font-extrabold uppercase text-purple-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-purple-400" /> Taxa de Limpeza / Manutenção da Reserva (R$)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={taxaReserva}
                    onChange={(e) => setTaxaReserva(e.target.value)}
                    placeholder="Ex: 180.00 (deixe vazio se for gratuito)"
                    className="w-full bg-slate-950/80 border border-purple-700/60 rounded-xl px-3 py-2 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 font-bold"
                  />
                  <span className="text-[10px] text-purple-300 font-semibold whitespace-nowrap">
                    Cobrado por período agendado
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Descrição Detalhada */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-slate-300">
              Descrição Detalhada do Ambiente *
            </label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva as características, ambiente, conforto, mobília, objetivos do espaço..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium leading-relaxed resize-none"
            />
          </div>

          {/* 4. Comodidades & Equipamentos Inclusos */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Comodidades & Equipamentos Inclusos ({comodidades.length})
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Itens disponíveis para os moradores
              </span>
            </div>

            {/* Tags Atuais */}
            <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-slate-950/80 rounded-xl border border-slate-800">
              {comodidades.length === 0 ? (
                <span className="text-slate-500 text-[11px] italic p-1">Nenhuma comodidade adicionada ainda.</span>
              ) : (
                comodidades.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
                  >
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveComodidade(idx)}
                      className="text-amber-400/80 hover:text-rose-400 ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input para adicionar nova comodidade */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={novaComodidadeInput}
                onChange={(e) => setNovaComodidadeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddComodidade();
                  }
                }}
                placeholder="Digitar nova comodidade (ex: Cervejeira, Wi-Fi 500mb)..."
                className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
              <button
                type="button"
                onClick={handleAddComodidade}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            {/* Sugestões Rápidas de Comodidades */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                Sugestões rápidas (clique para alternar):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {COMODIDADES_SUGERIDAS.map((sug) => {
                  const isChecked = comodidades.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleToggleSugestaoComodidade(sug)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isChecked ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 opacity-60" />}
                      {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Regras de Uso & Convivência */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Regras de Uso & Convivência ({regrasUso.length})
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Normas obrigatórias de convivência
              </span>
            </div>

            {/* Lista de Regras Atuais */}
            <div className="space-y-1.5 min-h-[40px] p-2 bg-slate-950/80 rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
              {regrasUso.length === 0 ? (
                <span className="text-slate-500 text-[11px] italic p-1">Nenhuma regra cadastrada ainda.</span>
              ) : (
                regrasUso.map((regra, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px] font-medium"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="break-words">{regra}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRegra(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Input para adicionar nova regra */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={novaRegraInput}
                onChange={(e) => setNovaRegraInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRegra();
                  }
                }}
                placeholder="Digitar regra de uso específica..."
                className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
              <button
                type="button"
                onClick={handleAddRegra}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Inserir
              </button>
            </div>

            {/* Sugestões Rápidas de Regras */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                Sugestões de regras padrão (clique para adicionar/remover):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {REGRAS_SUGERIDAS.map((sug) => {
                  const isChecked = regrasUso.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleToggleSugestaoRegra(sug)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer text-left ${
                        isChecked
                          ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/60'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {sug.slice(0, 45)}...
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2">
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
              <Check className="w-4 h-4" />
              {dependenciaToEdit ? 'Salvar Alterações' : 'Publicar Dependência'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
