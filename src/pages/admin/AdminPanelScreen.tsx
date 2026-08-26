import React, { useState } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade } from '../../types';
import { 
  Building, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  KeyRound, 
  LogOut, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowLeft,
  Users,
  Car,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminPanelScreen: React.FC = () => {
  const { 
    unidades, 
    adicionarUnidade, 
    editarUnidade, 
    excluirUnidade, 
    logoutAdmin, 
    setCurrentScreen 
  } = useCondo();

  const [novoNumero, setNovoNumero] = useState('');
  const [novaVaga, setNovaVaga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumero, setEditNumero] = useState('');
  const [editVaga, setEditVaga] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [showEditSenha, setShowEditSenha] = useState(false);

  const handleAddUnidade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNumero.trim()) return;

    adicionarUnidade(
      novoNumero.trim(),
      novaVaga.trim() || `Vaga ${novoNumero.trim()}`,
      novaSenha.trim() || novoNumero.trim()
    );

    setNovoNumero('');
    setNovaVaga('');
    setNovaSenha('');
  };

  const handleStartEdit = (u: Unidade) => {
    setEditingId(u.id);
    setEditNumero(u.numero);
    setEditVaga(u.vagaGaragem || '');
    setEditSenha(u.senhaAcesso || u.numero);
  };

  const handleSaveEdit = (id: string) => {
    if (!editNumero.trim()) return;
    editarUnidade(id, editNumero, editVaga, editSenha || editNumero);
    setEditingId(null);
  };

  const handleCopySenha = (u: Unidade) => {
    const texto = `Condomínio - Unidade: ${u.numero}\nVaga de Garagem: ${u.vagaGaragem || 'Sem vaga'}\nLogin / Senha: ${u.senhaAcesso || u.numero}`;
    navigator.clipboard.writeText(texto);
    setCopiadoId(u.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const filteredUnidades = unidades.filter(u => 
    u.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.vagaGaragem && u.vagaGaragem.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header with Navigation & Logout */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Ir para a Visão do Morador
        </button>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1 text-xs text-rose-200 hover:text-rose-100 bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 rounded-xl font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair do Admin
        </button>
      </div>

      {/* Screen Title */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            Gestão de Unidades & Senhas
          </h2>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            Cadastre os apartamentos do condomínio para liberar o primeiro acesso dos moradores.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-full font-black text-xs shadow-md">
          {unidades.length} Unidades Cadastradas
        </span>
      </div>

      {/* Form de Criação de Unidade */}
      <div className="bg-white/50 border-2 border-white/70 rounded-3xl p-5 shadow-xl space-y-3.5 backdrop-blur-xs">
        <div className="flex items-center gap-2 border-b border-slate-950/10 pb-2">
          <Building className="w-4 h-4 text-amber-800" />
          <h3 className="font-extrabold text-sm text-slate-950">
            Cadastrar Nova Unidade / Apartamento
          </h3>
        </div>

        <form onSubmit={handleAddUnidade} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
            {/* Número / Identificação Completa da Unidade */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Número do Apto / Identificação:
              </label>
              <input
                type="text"
                placeholder="Ex: 101 Bloco A, 001, 102..."
                value={novoNumero}
                onChange={(e) => setNovoNumero(e.target.value)}
                className="w-full bg-white/80 border border-white rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                required
              />
            </div>

            {/* Vaga de Garagem */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Vaga de Garagem:
              </label>
              <input
                type="text"
                placeholder="Ex: 12 subsolo, 13, G-01..."
                value={novaVaga}
                onChange={(e) => setNovaVaga(e.target.value)}
                className="w-full bg-white/80 border border-white rounded-xl px-3.5 py-2 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
            </div>

            {/* Senha Padrão (Opcional - default é o próprio número da unidade) */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-slate-700">
                Senha de Acesso (Opcional):
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? 'text' : 'password'}
                  placeholder={novoNumero ? `Padrão: ${novoNumero}` : 'Padrão: número do apto'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full bg-white/80 border border-white rounded-xl px-3.5 py-2 pr-9 text-xs text-slate-950 placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="p-1 text-slate-500 hover:text-slate-800 absolute right-2.5 top-1.5 rounded-lg"
                  tabIndex={-1}
                  title={showNovaSenha ? "Ocultar senha" : "Ver senha"}
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-700 font-medium hidden sm:inline">
              * A senha inicial para o morador é por padrão a própria identificação da unidade.
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md transition-all active:scale-95 ml-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Adicionar Unidade à Fila
            </button>
          </div>
        </form>
      </div>

      {/* Busca e Lista / Fila de Unidades */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Fila de Unidades ({filteredUnidades.length})
          </span>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Filtrar por apto ou vaga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-600 focus:outline-none font-semibold shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Grid de Cards de Unidades na Fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredUnidades.map((u) => {
            const isEditing = editingId === u.id;
            const senhaDisplay = u.senhaAcesso || u.numero;

            if (isEditing) {
              return (
                <div
                  key={u.id}
                  className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3.5 shadow-lg space-y-2.5 animate-in zoom-in-95 duration-150"
                >
                  <span className="text-[10px] uppercase font-black text-amber-950 block">
                    Editando Unidade
                  </span>
                  
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={editNumero}
                      onChange={(e) => setEditNumero(e.target.value)}
                      placeholder="Número / Identificação"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-950"
                    />
                    <input
                      type="text"
                      value={editVaga}
                      onChange={(e) => setEditVaga(e.target.value)}
                      placeholder="Vaga de Garagem"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-950"
                    />
                    <div className="relative">
                      <input
                        type={showEditSenha ? 'text' : 'password'}
                        value={editSenha}
                        onChange={(e) => setEditSenha(e.target.value)}
                        placeholder="Senha de Acesso"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 pr-8 text-xs font-bold text-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditSenha(!showEditSenha)}
                        className="p-1 text-slate-500 hover:text-slate-800 absolute right-1.5 top-0.5 rounded-lg"
                        tabIndex={-1}
                        title={showEditSenha ? "Ocultar senha" : "Ver senha"}
                      >
                        {showEditSenha ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleSaveEdit(u.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            }

            const formatUnitTitle = (num: string) => {
              if (num.toLowerCase().startsWith('apt') || num.toLowerCase().startsWith('cobertura')) {
                return num;
              }
              return `Apto ${num}`;
            };

            return (
              <div
                key={u.id}
                className="bg-white/50 border-2 border-white/70 rounded-2xl p-3.5 shadow-md hover:bg-white/60 transition-all flex flex-col justify-between space-y-2.5 backdrop-blur-xs"
              >
                {/* Topo do Card de Unidade */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-base text-slate-950 leading-tight">
                      {formatUnitTitle(u.numero)}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                      <Car className="w-3 h-3 text-amber-800" />
                      Vaga: {u.vagaGaragem || 'Sem vaga'}
                    </span>
                  </div>

                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    u.moradores && u.moradores.length > 0
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}>
                    {u.moradores && u.moradores.length > 0 ? 'Cadastrado' : 'Pendente'}
                  </span>
                </div>

                {/* Senha e Credencial */}
                <div className="p-2 rounded-xl bg-white/75 border border-white/90 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-amber-800" />
                    <span className="text-[10px] font-extrabold uppercase">Senha:</span>
                    <strong className="text-slate-950 font-mono font-black ml-1">{senhaDisplay}</strong>
                  </div>

                  <button
                    onClick={() => handleCopySenha(u)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Copiar dados de acesso"
                  >
                    {copiadoId === u.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Ações: Editar e Excluir */}
                <div className="flex items-center justify-end gap-1 pt-1 border-t border-slate-950/10">
                  <button
                    onClick={() => handleStartEdit(u)}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-indigo-700 hover:bg-white/80 transition-colors text-xs flex items-center gap-1 font-bold"
                    title="Editar Unidade"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => excluirUnidade(u.id)}
                    className="p-1.5 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-100 transition-colors text-xs flex items-center gap-1 font-bold"
                    title="Excluir Unidade"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
