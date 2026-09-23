import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { StatusFuncionario, CategoriaFuncionario } from '../../types';
import { 
  X, 
  Camera, 
  User, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  Briefcase,
  Layers
} from 'lucide-react';

interface CreateFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARES_SUGERIDOS = [
  '/ademar_porteiro.png',
  '/cleber_zelador.png',
  '/anastacia_faxineira.png',
  '/jose_casimiro_porteiro.png',
  '/jose_vigia.png',
  '/adriana_sindica.png',
  '/cassia_sub_sindica.png'
];

export const CreateFuncionarioModal: React.FC<CreateFuncionarioModalProps> = ({
  isOpen,
  onClose
}) => {
  const { adicionarFuncionario } = useCondo();

  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaFuncionario>('Portaria');
  const [horario, setHorario] = useState('08:00 - 17:00');
  const [disponibilidade, setDisponibilidade] = useState('Segunda a Sexta');
  const [status, setStatus] = useState<StatusFuncionario>('Ativo');
  const [foto, setFoto] = useState(AVATARES_SUGERIDOS[0]);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFoto(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNome('');
    setFuncao('');
    setCategoria('Portaria');
    setHorario('08:00 - 17:00');
    setDisponibilidade('Segunda a Sexta');
    setStatus('Ativo');
    setFoto(AVATARES_SUGERIDOS[0]);
    setSucesso(false);
    setErro('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Por favor, informe o Nome Completo do colaborador.');
      return;
    }

    if (!funcao.trim()) {
      setErro('Por favor, informe a Função ou Cargo do colaborador.');
      return;
    }

    adicionarFuncionario({
      nome: nome.trim(),
      foto: foto || AVATARES_SUGERIDOS[0],
      funcao: funcao.trim(),
      categoria: categoria,
      horario: horario.trim() || '08:00 - 17:00',
      disponibilidade: disponibilidade.trim() || 'Segunda a Sexta',
      status: status,
      permiteAcessoAreaMorador: true,
      tipoAcesso: 'personalizado',
      permissoesModulos: ['portaria']
    });

    setSucesso(true);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1200);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white border-2 border-amber-400/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-100 leading-tight">
                Cadastrar Novo Colaborador
              </h2>
              <p className="text-xs text-amber-200/70 font-medium">
                Insira os atributos iniciais exibidos nos cartões de funcionários
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">

          {sucesso && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-3 flex items-center gap-2.5 text-xs font-black animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Colaborador "{nome}" cadastrado com sucesso!</span>
            </div>
          )}

          {erro && (
            <div className="bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl p-3 text-xs font-bold animate-in fade-in">
              {erro}
            </div>
          )}

          {/* Foto de Perfil + Upload + Avatares */}
          <div className="bg-amber-500/10 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={foto || AVATARES_SUGERIDOS[0]}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-100"
              />
              <label 
                htmlFor="upload-create-func-foto"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md border border-white"
                title="Carregar Imagem"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="upload-create-func-foto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-black uppercase text-slate-800 block">
                Selecione um Avatar ou Carregue uma Foto
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                {AVATARES_SUGERIDOS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFoto(av)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      foto === av ? 'border-amber-600 scale-110 shadow-sm ring-2 ring-amber-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Atributos Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nome Completo */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-600" />
                Nome Completo:
              </label>
              <input
                type="text"
                placeholder="Ex: Ademar Lopes, Cléber Silva..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs"
                required
              />
            </div>

            {/* Cargo / Função */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                Função / Cargo:
              </label>
              <input
                type="text"
                placeholder="Ex: Porteiro Noturno, Zeladora, Vigia..."
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Categoria */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Categoria:
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaFuncionario)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs cursor-pointer"
              >
                <option value="Portaria">Portaria</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Segurança">Segurança</option>
                <option value="Zeladoria">Zeladoria</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Gestão">Gestão</option>
                <option value="Conselho">Conselho</option>
              </select>
            </div>

            {/* Horário de Turno */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Horário de Turno:
              </label>
              <input
                type="text"
                placeholder="Ex: 08:00 - 17:00"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs"
              />
            </div>

            {/* Escala / Disponibilidade */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Escala / Dias:
              </label>
              <input
                type="text"
                placeholder="Ex: Segunda a Sexta"
                value={disponibilidade}
                onChange={(e) => setDisponibilidade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Status Inicial */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-700">
                Status Inicial do Colaborador:
              </label>
              <span className="text-[10px] font-black uppercase text-slate-900 px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                {status}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { label: '✓ Ativo', val: 'Ativo', bg: 'bg-emerald-500 text-white' },
                { label: '🌴 Férias', val: 'Férias', bg: 'bg-amber-500 text-slate-950' },
                { label: '🩹 Doente', val: 'Doente', bg: 'bg-orange-500 text-white' },
                { label: '⚠️ Ausente', val: 'Ausente', bg: 'bg-rose-500 text-white' },
                { label: '⚫ Desligado', val: 'Desligado', bg: 'bg-slate-700 text-white' }
              ].map((st) => (
                <button
                  key={st.val}
                  type="button"
                  onClick={() => setStatus(st.val as StatusFuncionario)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                    status === st.val
                      ? `${st.bg} border-transparent shadow-sm scale-102 ring-2 ring-amber-400`
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sucesso}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 stroke-[3]" />
              {sucesso ? 'Cadastrado!' : 'Cadastrar Colaborador'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
