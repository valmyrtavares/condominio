import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Funcionario, StatusFuncionario, CategoriaFuncionario } from '../../types';
import { 
  X, 
  Check, 
  Camera, 
  User, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  Briefcase,
  Sun,
  Activity,
  UserX,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: Funcionario | null;
}

const AVATARES_SUGERIDOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  '/ademar_porteiro.png',
  '/anastacia_faxineira.png',
  '/jose_casimiro_porteiro.png',
  '/jose_vigia.png',
  '/adriana_sindica.png',
  '/cassia_sub_sindica.png'
];

export const EditFuncionarioModal: React.FC<EditFuncionarioModalProps> = ({
  isOpen,
  onClose,
  funcionario
}) => {
  const { editarFuncionario, adminRoles } = useCondo();

  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaFuncionario>('Portaria');
  const [horario, setHorario] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');
  const [status, setStatus] = useState<StatusFuncionario>('Ativo');
  const [foto, setFoto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (funcionario) {
      setNome(funcionario.nome || '');
      setFuncao(funcionario.funcao || '');
      setCategoria(funcionario.categoria || 'Portaria');
      setHorario(funcionario.horario || '08:00 - 17:00');
      setDisponibilidade(funcionario.disponibilidade || 'Segunda a Sexta');
      setStatus(funcionario.status || 'Ativo');
      setFoto(funcionario.foto || AVATARES_SUGERIDOS[0]);
      setEmail(funcionario.email || '');
      setTelefone(funcionario.telefone || '');
      setUsuario(funcionario.usuario || '');
      setSenha(funcionario.senha || '');
    }
  }, [funcionario, isOpen]);

  if (!isOpen || !funcionario) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !funcao.trim()) return;

    editarFuncionario(funcionario.id, {
      nome: nome.trim(),
      funcao: funcao.trim(),
      categoria,
      horario: horario.trim(),
      disponibilidade: disponibilidade.trim(),
      status,
      foto,
      email: email.trim() || undefined,
      telefone: telefone.trim() || undefined,
      usuario: usuario.trim() || undefined,
      senha: senha.trim() || undefined
    });

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                Editar Colaborador / Funcionário
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Atualize dados, fotos, horários e status operacional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {sucesso && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Colaborador atualizado com sucesso!</span>
            </div>
          )}

          {/* Seletor de Status com Destaque Colorido */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block">
              Status Operacional Atual:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { label: 'Ativo', value: 'Ativo', bg: 'bg-emerald-500 text-white', border: 'border-emerald-600' },
                { label: 'Férias', value: 'Férias', bg: 'bg-amber-500 text-slate-950', border: 'border-amber-600' },
                { label: 'Doente', value: 'Doente', bg: 'bg-orange-500 text-white', border: 'border-orange-600' },
                { label: 'Ausente', value: 'Ausente', bg: 'bg-rose-500 text-white', border: 'border-rose-600' },
                { label: 'Desligado', value: 'Desligado', bg: 'bg-slate-700 text-white', border: 'border-slate-800' }
              ].map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setStatus(st.value as StatusFuncionario)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                    status === st.value
                      ? `${st.bg} ${st.border} shadow-md scale-105 ring-2 ring-amber-400`
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Foto e Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/70">
            <div className="sm:col-span-4 text-center space-y-1.5">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={foto || AVATARES_SUGERIDOS[0]}
                  alt="Preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-100"
                />
                <label 
                  htmlFor="edit-foto-upload"
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md border border-white"
                  title="Trocar Foto"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    id="edit-foto-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                Foto de Perfil
              </span>
            </div>

            <div className="sm:col-span-8 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-600 block">
                Ou escolha um avatar sugerido:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVATARES_SUGERIDOS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFoto(av)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 shrink-0 transition-transform active:scale-95 cursor-pointer ${
                      foto === av ? 'border-amber-500 scale-110 shadow-md' : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nome e Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Nome Completo:
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: José Casimiro, Anastácia Moreira..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Cargo / Função:
              </label>
              <input
                type="text"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                placeholder="Ex: Porteiro Diurno (12x36), Faxineira..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Categoria, Horário e Escala */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Categoria:
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaFuncionario)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Portaria">Portaria</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Segurança">Segurança</option>
                <option value="Gestão">Gestão</option>
                <option value="Zeladoria">Zeladoria</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Conselho">Conselho</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Horário de Turno:
              </label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex: 07:00 - 19:00, 12x36..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Escala / Dias:
              </label>
              <input
                type="text"
                value={disponibilidade}
                onChange={(e) => setDisponibilidade(e.target.value)}
                placeholder="Ex: Segunda a Sexta, 12x36..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Credenciais de Acesso (se for Gestão / Acesso ao Sistema) */}
          {categoria === 'Gestão' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-800 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-800" /> Credenciais de Acesso ao Painel:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-600">Usuário:</label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="usuario.login"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-600">Senha:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Salvar Alterações
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
