import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { Funcionario, StatusFuncionario, CategoriaFuncionario, AdminModuloKey } from '../../types';
import { AdminPermissionsSelector } from './AdminPermissionsSelector';
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
  EyeOff,
  Mail,
  Phone
} from 'lucide-react';

interface EditFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: Funcionario | null;
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

/** Formata número de WhatsApp / Telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX (máx 11 dígitos) */
const formatWhatsApp = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const EditFuncionarioModal: React.FC<EditFuncionarioModalProps> = ({
  isOpen,
  onClose,
  funcionario
}) => {
  const { editarFuncionario } = useCondo();

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
  const [permissoesModulos, setPermissoesModulos] = useState<AdminModuloKey[]>([]);
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
      setEmail(funcionario.email || funcionario.usuario || '');
      setTelefone(funcionario.telefone ? formatWhatsApp(funcionario.telefone) : '');
      setUsuario(funcionario.usuario || funcionario.email || '');
      setSenha(funcionario.senha || funcionario.email || '');
      
      if (funcionario.permissoesModulos && funcionario.permissoesModulos.length > 0) {
        setPermissoesModulos(funcionario.permissoesModulos);
      } else if (funcionario.categoria === 'Portaria') {
        setPermissoesModulos(['portaria', 'mudancas']);
      } else if (funcionario.categoria === 'Gestão' || (funcionario as any).tipoAcesso === 'total') {
        setPermissoesModulos(['portaria', 'mudancas', 'dependencias', 'reparos', 'reclamacoes', 'eventos', 'servicos', 'unidades', 'equipe', 'financeiro', 'regras', 'imoveis', 'fornecedores', 'enjoei', 'assembleias', 'diario-sindico']);
      } else if (funcionario.categoria === 'Zeladoria' || funcionario.categoria === 'Manutenção') {
        setPermissoesModulos(['portaria', 'mudancas', 'dependencias', 'reparos', 'reclamacoes']);
      } else {
        setPermissoesModulos(['portaria']);
      }
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

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (!usuario || usuario === email) {
      setUsuario(newEmail.trim().toLowerCase());
    }
    if (!senha || senha === email) {
      setSenha(newEmail.trim().toLowerCase());
    }
  };

  const handleTelefoneChange = (val: string) => {
    setTelefone(formatWhatsApp(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !funcao.trim()) return;

    const emailLimpo = email.trim().toLowerCase();
    const loginFinal = emailLimpo || usuario.trim().toLowerCase();
    const senhaFinal = senha.trim() || emailLimpo || '123456';

    editarFuncionario(funcionario.id, {
      nome: nome.trim(),
      funcao: funcao.trim(),
      categoria,
      horario: horario.trim(),
      disponibilidade: disponibilidade.trim(),
      status,
      foto,
      email: emailLimpo || undefined,
      telefone: telefone.trim() || undefined,
      usuario: loginFinal || undefined,
      senha: senhaFinal,
      permissoesModulos: permissoesModulos.length > 0 ? permissoesModulos : ['portaria'],
      tipoAcesso: permissoesModulos.length >= 16 ? 'total' : 'personalizado'
    });

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 400);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[calc(100dvh-5rem)] bg-white border-2 border-amber-400 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Fixo */}
        <div className="shrink-0 p-4 sm:p-5 bg-gradient-to-r from-amber-100 via-amber-50 to-white flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 border border-amber-400/50 flex items-center justify-center shadow-md font-black shrink-0">
              <Briefcase className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                Editar Colaborador / Funcionário
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Atualize dados, fotos, permissões de abas e credenciais de acesso
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-200/60 text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Rolagem Interna */}
        <form id="edit-funcionario-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {sucesso && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Colaborador e permissões atualizados com sucesso!</span>
            </div>
          )}

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
                placeholder="Ex: Porteiro Noturno (12x36), Faxineira..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

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

          <AdminPermissionsSelector
            selectedModulos={permissoesModulos}
            onChange={setPermissoesModulos}
          />

          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-800" /> 
                Credenciais de Acesso Individual (Login & Rastreabilidade):
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400">
                Auditoria por Usuário
              </span>
            </div>

            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              💡 O e-mail informado será o login oficial do colaborador. A senha inicial pode ser a repetição do e-mail, e o colaborador poderá alterá-la para sua senha pessoal. Todas as ações realizadas ficarão registradas em seu nome.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  E-mail de Login do Colaborador:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="porteiro@condominio.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Senha de Acesso:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Repetição do e-mail ou senha inicial"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 pr-9 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Telefone / WhatsApp (Opcional):
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => handleTelefoneChange(e.target.value)}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

        </form>

        {/* Rodapé Fixo com Ações */}
        <div className="shrink-0 p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-funcionario-form"
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Salvar Alterações
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
