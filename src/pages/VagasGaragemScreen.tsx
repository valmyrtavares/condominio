import React, { useState, useMemo, useCallback, memo } from 'react';
import { useCondo } from '../context/CondoContext';
import { StatusVaga, VagaGaragem, VeiculoInfo } from '../types';
import { 
  Car, 
  ArrowLeft, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle, 
  User, 
  Building,
  KeyRound
} from 'lucide-react';

// Status badge memoizado
const StatusBadgeItem: React.FC<{ status: StatusVaga }> = memo(({ status }) => {
  switch (status) {
    case 'Em uso':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Em uso
        </span>
      );
    case 'Para Alugar':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Para Alugar
        </span>
      );
    case 'Vazia':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Vazia
        </span>
      );
    default:
      return null;
  }
});

// Componente isolado para o formulário da Minha Vaga
// Evita re-renderizar as 815 vagas da lista a cada tecla digitada
interface MinhaVagaPanelProps {
  minhaVaga: VagaGaragem;
  currentUserUnidade: string;
  onSalvar: (
    id: string, 
    meuStatus: StatusVaga, 
    veiculoData?: VeiculoInfo, 
    valorAluguel?: number, 
    observacoes?: string,
    alugadaParaUnidade?: string,
    locatarioNome?: string
  ) => void;
}

const MinhaVagaPanel: React.FC<MinhaVagaPanelProps> = memo(({ minhaVaga, currentUserUnidade, onSalvar }) => {
  const [meuStatus, setMeuStatus] = useState<StatusVaga>(minhaVaga.status || 'Em uso');
  const [meuModelo, setMeuModelo] = useState(minhaVaga.veiculo?.modelo || '');
  const [minhaCor, setMinhaCor] = useState(minhaVaga.veiculo?.cor || '');
  const [minhaPlaca, setMinhaPlaca] = useState(minhaVaga.veiculo?.placa || '');
  const [meuAluguel, setMeuAluguel] = useState(minhaVaga.valorAluguelMensal?.toString() || '250');
  const [minhasObs, setMinhasObs] = useState(minhaVaga.observacoes || '');
  const [alugadaPara, setAlugadaPara] = useState(minhaVaga.alugadaParaUnidade || '');
  const [meuLocatario, setMeuLocatario] = useState(minhaVaga.locatarioNome || '');
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  // Sincroniza apenas quando o objeto/id da vaga muda
  React.useEffect(() => {
    setMeuStatus(minhaVaga.status || 'Em uso');
    setMeuModelo(minhaVaga.veiculo?.modelo || '');
    setMinhaCor(minhaVaga.veiculo?.cor || '');
    setMinhaPlaca(minhaVaga.veiculo?.placa || '');
    setMeuAluguel(minhaVaga.valorAluguelMensal?.toString() || '250');
    setMinhasObs(minhaVaga.observacoes || '');
    setAlugadaPara(minhaVaga.alugadaParaUnidade || '');
    setMeuLocatario(minhaVaga.locatarioNome || '');
  }, [minhaVaga.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let veiculoData: VeiculoInfo | undefined = undefined;
    if (meuStatus === 'Em uso') {
      veiculoData = {
        modelo: meuModelo || 'Veículo Cadastrado',
        cor: minhaCor || 'Não informada',
        placa: minhaPlaca || '---',
        tipo: 'Carro'
      };
    }

    onSalvar(
      minhaVaga.id,
      meuStatus,
      veiculoData,
      meuStatus === 'Para Alugar' && meuAluguel ? parseFloat(meuAluguel) : undefined,
      minhasObs,
      meuStatus === 'Em uso' ? alugadaPara : '',
      meuStatus === 'Em uso' ? meuLocatario : ''
    );

    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 3000);
  };

  return (
    <div className="bg-white/50 border-2 border-amber-400/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5 relative overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-extrabold shadow-sm">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 block">
              Painel do Morador Logado
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-950">
              Minha Vaga: <strong className="text-amber-900 font-black">{minhaVaga.numeroVaga}</strong> ({minhaVaga.subsolo}) • Apt {currentUserUnidade}
            </h3>
          </div>
        </div>

        {salvoFeedback && (
          <span className="text-[11px] font-extrabold px-3 py-1 bg-emerald-500 text-slate-950 rounded-full flex items-center gap-1 shadow-md animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" /> Status atualizado com sucesso!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 ml-1">
            Defina o Status da sua Vaga:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['Em uso', 'Para Alugar', 'Vazia'] as StatusVaga[]).map((st) => {
              const isSelected = meuStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setMeuStatus(st)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-black scale-102 ring-2 ring-amber-400/40'
                      : 'bg-white/70 hover:bg-white border-white/90 text-slate-900 font-bold'
                  }`}
                >
                  <span className="text-xs">{st}</span>
                  {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Condicional se Em uso: campos de veículo e locatário */}
        {meuStatus === 'Em uso' && (
          <div className="space-y-2.5 bg-white/50 p-3 rounded-2xl border border-white/80 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-0.5">
                <label className="text-[10px] font-extrabold text-slate-900">Modelo do Veículo</label>
                <input
                  type="text"
                  placeholder="Ex: Corolla Cross"
                  value={meuModelo}
                  onChange={(e) => setMeuModelo(e.target.value)}
                  className="w-full bg-white border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none font-sans"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-extrabold text-slate-900">Cor</label>
                <input
                  type="text"
                  placeholder="Ex: Prata"
                  value={minhaCor}
                  onChange={(e) => setMinhaCor(e.target.value)}
                  className="w-full bg-white border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none font-sans"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-extrabold text-slate-900">Placa</label>
                <input
                  type="text"
                  placeholder="Ex: BRA-2E19"
                  value={minhaPlaca}
                  onChange={(e) => setMinhaPlaca(e.target.value)}
                  className="w-full bg-white border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold uppercase focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Campo de Aluguel para outro Morador / Usuário Autorizado (Imagem 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-900/10">
              <div className="space-y-0.5">
                <label className="text-[10px] font-extrabold text-amber-950 flex items-center gap-1">
                  <Building className="w-3 h-3 text-indigo-700" />
                  Se alugou, informe Apt / Bloco Contratante:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Apt 14 - Milão"
                  value={alugadaPara}
                  onChange={(e) => setAlugadaPara(e.target.value)}
                  className="w-full bg-white border-2 border-rose-400 focus:border-rose-600 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-extrabold focus:outline-none font-sans shadow-2xs"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-extrabold text-amber-950 flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-800" />
                  Nome do Morador / Usuário que está usando:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Antonio"
                  value={meuLocatario}
                  onChange={(e) => setMeuLocatario(e.target.value)}
                  className="w-full bg-white border-2 border-rose-400 focus:border-rose-600 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-extrabold focus:outline-none font-sans shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Condicional se Para Alugar: valor do aluguel */}
        {meuStatus === 'Para Alugar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-amber-500/15 p-3 rounded-2xl border border-amber-400/50 animate-in fade-in">
            <div className="space-y-0.5">
              <label className="text-[10px] font-extrabold text-amber-950">Valor Pretendido (R$/mês)</label>
              <input
                type="number"
                placeholder="Ex: 250.00"
                value={meuAluguel}
                onChange={(e) => setMeuAluguel(e.target.value)}
                className="w-full bg-white border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-bold focus:outline-none font-sans"
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-extrabold text-amber-950">Observações para os Vizinhos</label>
              <input
                type="text"
                placeholder="Ex: Próxima ao elevador, livre para uso imediato"
                value={minhasObs}
                onChange={(e) => setMinhasObs(e.target.value)}
                className="w-full bg-white border border-white/90 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-semibold focus:outline-none font-sans"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            Salvar Alterações da Minha Vaga
          </button>
        </div>
      </form>
    </div>
  );
});

// Componente isolado para os Cards de Vagas no Mapa
interface VagaCardProps {
  vaga: VagaGaragem;
  isMinha: boolean;
  onChamarInterfone: (ramal: string, apto: string, morador: string) => void;
}

const VagaCard: React.FC<VagaCardProps> = memo(({ vaga, isMinha, onChamarInterfone }) => {
  return (
    <div
      className={`bg-white/45 border rounded-3xl p-4 shadow-xl space-y-3 flex flex-col justify-between transition-all hover:bg-white/55 ${
        isMinha ? 'border-amber-400 ring-2 ring-amber-400/40 bg-white/60' : 'border-white/60'
      }`}
    >
      {/* Header: Vaga + Subsolo + Status */}
      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-900/10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-amber-300 font-mono font-black text-sm shadow-xs">
            {vaga.numeroVaga}
          </span>
          <div>
            <span className="text-[10px] font-bold text-slate-700 block">
              {vaga.subsolo}
            </span>
            {isMinha && (
              <span className="text-[9px] font-extrabold text-amber-900 uppercase">
                ★ Sua Vaga
              </span>
            )}
          </div>
        </div>

        <StatusBadgeItem status={vaga.status} />
      </div>

      {/* Apartamento & Morador */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-950 flex items-center gap-1 flex-wrap">
            <Building className="w-3.5 h-3.5 text-indigo-700" />
            Apt {vaga.unidadeNumero} - {vaga.bloco}
            {vaga.alugadaParaUnidade && (
              <span className="text-[10px] font-black text-indigo-900 bg-indigo-100 border border-indigo-300 px-1.5 py-0.5 rounded-md shadow-2xs">
                (Alugada p/ {vaga.alugadaParaUnidade})
              </span>
            )}
          </span>
          <span className="text-[10px] text-slate-700 font-extrabold">
            Tipo: {vaga.tipoVaga || 'Simples'}
          </span>
        </div>

        <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-amber-800 shrink-0" />
          <span className="truncate">Proprietário: {vaga.moradorNome}</span>
        </p>

        {/* Morador / Usuário pagando pelo uso autorizado (Imagem 3) */}
        {vaga.alugadaParaUnidade && (
          <div className="bg-amber-500/15 border border-amber-400/70 p-2 rounded-2xl space-y-0.5 mt-1 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-950 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-900" />
                Usuário Autorizado (Locatário):
              </span>
              <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full uppercase">
                Alugado
              </span>
            </div>
            <p className="font-black text-slate-950 text-xs flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-700" />
              {vaga.locatarioNome || 'Morador autorizado'} ({vaga.alugadaParaUnidade})
            </p>
          </div>
        )}
      </div>

      {/* Veículo ou Detalhes da Locação / Vazia */}
      <div className="bg-white/60 border border-white/80 p-2.5 rounded-2xl space-y-1 text-xs">
        {vaga.status === 'Em uso' && vaga.veiculo && (
          <div>
            <span className="text-[10px] font-extrabold text-slate-700 uppercase block">
              Veículo Cadastrado:
            </span>
            <p className="font-extrabold text-slate-950 text-xs">
              {vaga.veiculo.modelo} ({vaga.veiculo.cor})
            </p>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Placa: {vaga.veiculo.placa}
              </span>
              <span className="text-[10px] text-slate-700 font-bold">{vaga.veiculo.tipo}</span>
            </div>
          </div>
        )}

        {vaga.status === 'Para Alugar' && (
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-950 uppercase">
                Aluguel Disponível:
              </span>
              <strong className="text-emerald-800 font-black text-xs">
                {vaga.valorAluguelMensal ? `R$ ${vaga.valorAluguelMensal.toFixed(2)}/mês` : 'A combinar'}
              </strong>
            </div>
            {vaga.observacoes && (
              <p className="text-[10px] text-slate-800 font-semibold italic line-clamp-2">
                "{vaga.observacoes}"
              </p>
            )}
          </div>
        )}

        {vaga.status === 'Vazia' && (
          <div className="py-1 text-center">
            <span className="text-[11px] font-bold text-slate-600">
              Vaga desocupada no momento
            </span>
            {vaga.observacoes && (
              <p className="text-[10px] text-slate-500 mt-0.5">
                {vaga.observacoes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Ações: Chamar Interfone & Contatar */}
      <div className="pt-1 flex items-center gap-2">
        <button
          onClick={() => onChamarInterfone(vaga.interfoneRamal, `Apt ${vaga.unidadeNumero}`, vaga.moradorNome)}
          className="flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Interfone: #{vaga.interfoneRamal}</span>
        </button>

        {vaga.contatoWhatsapp && (
          <a
            href={`https://wa.me/55${vaga.contatoWhatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Enviar mensagem WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
});

export const VagasGaragemScreen: React.FC = () => {
  const { 
    vagasGaragem, 
    currentUser, 
    atualizarStatusVaga, 
    setCurrentScreen 
  } = useCondo();

  // Filters State
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  const [filterSubsolo, setFilterSubsolo] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Identifica a vaga pertencente ao morador logado de forma precisa e estável
  const minhaVaga = useMemo(() => {
    const uUser = (currentUser.unidade || '').replace(/\D/g, '');
    return (
      vagasGaragem.find(v => {
        const uVaga = (v.unidadeNumero || '').replace(/\D/g, '');
        return (uVaga && uUser && uVaga === uUser) || (v.unidadeNumero && currentUser.unidade && v.unidadeNumero.trim().toLowerCase() === currentUser.unidade.trim().toLowerCase());
      }) ||
      vagasGaragem.find(v => v.unidadeNumero === currentUser.unidade) ||
      vagasGaragem[0]
    );
  }, [vagasGaragem, currentUser.unidade]);

  // Modal / Feedback de chamada de interfone
  const [interfoneChamando, setInterfoneChamando] = useState<string | null>(null);

  const handleSalvarMinhaVaga = useCallback((
    id: string, 
    meuStatus: StatusVaga, 
    veiculoData?: VeiculoInfo, 
    valorAluguel?: number, 
    observacoes?: string,
    alugadaParaUnidade?: string,
    locatarioNome?: string
  ) => {
    atualizarStatusVaga(id, meuStatus, {
      veiculo: veiculoData,
      valorAluguelMensal: valorAluguel,
      observacoes,
      alugadaParaUnidade,
      locatarioNome
    });
  }, [atualizarStatusVaga]);

  const handleChamarInterfone = useCallback((ramal: string, apto: string, morador: string) => {
    setInterfoneChamando(`Discando ramal #${ramal} (${apto} - ${morador})...`);
    setTimeout(() => {
      setInterfoneChamando(null);
    }, 4000);
  }, []);

  // Filter Logic memoizado
  const filteredVagas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return vagasGaragem.filter(v => {
      const matchesStatus = filterStatus === 'Todas' || v.status === filterStatus;
      const matchesSubsolo = filterSubsolo === 'Todos' || v.subsolo === filterSubsolo;
      const matchesSearch = !term || 
        v.numeroVaga.toLowerCase().includes(term) ||
        v.unidadeNumero.toLowerCase().includes(term) ||
        v.moradorNome.toLowerCase().includes(term) ||
        (v.alugadaParaUnidade && v.alugadaParaUnidade.toLowerCase().includes(term)) ||
        (v.locatarioNome && v.locatarioNome.toLowerCase().includes(term)) ||
        (v.veiculo?.placa && v.veiculo.placa.toLowerCase().includes(term)) ||
        (v.veiculo?.modelo && v.veiculo.modelo.toLowerCase().includes(term));

      return matchesStatus && matchesSubsolo && matchesSearch;
    });
  }, [vagasGaragem, filterStatus, filterSubsolo, searchTerm]);

  // Counters memoizados
  const countEmUso = useMemo(() => vagasGaragem.filter(v => v.status === 'Em uso').length, [vagasGaragem]);
  const countParaAlugar = useMemo(() => vagasGaragem.filter(v => v.status === 'Para Alugar').length, [vagasGaragem]);
  const countVazia = useMemo(() => vagasGaragem.filter(v => v.status === 'Vazia').length, [vagasGaragem]);

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <Car className="w-5 h-5 text-amber-400" />
          Vagas de Garagem & Veículos
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Consulte qual vaga pertence a cada apartamento, contate o morador via interfone e veja vagas disponíveis para locação.
        </p>
      </div>

      {/* Toast de Chamada de Interfone */}
      {interfoneChamando && (
        <div className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-3 border border-indigo-400">
          <div className="flex items-center gap-2.5 text-xs font-extrabold">
            <PhoneCall className="w-4 h-4 animate-bounce text-amber-300" />
            <span>{interfoneChamando}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">Chamando...</span>
        </div>
      )}

      {/* 1. Painel Superior: Gestão da Minha Vaga (Isolado para não travar a digitação) */}
      {minhaVaga && (
        <MinhaVagaPanel
          minhaVaga={minhaVaga}
          currentUserUnidade={currentUser.unidade || ''}
          onSalvar={handleSalvarMinhaVaga}
        />
      )}

      {/* 2. Summary Counters */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Em Uso</span>
          <span className="text-base sm:text-lg font-black text-emerald-950">{countEmUso} vagas</span>
        </div>
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Para Alugar</span>
          <span className="text-base sm:text-lg font-black text-amber-950">{countParaAlugar} vagas</span>
        </div>
        <div className="bg-white/45 border border-white/60 p-3 rounded-3xl text-center shadow-md">
          <span className="text-[10px] font-extrabold uppercase text-slate-800 block">Vazias</span>
          <span className="text-base sm:text-lg font-black text-slate-700">{countVazia} vagas</span>
        </div>
      </div>

      {/* 3. Filters Row & Search */}
      <div className="space-y-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Status:
          </span>
          {['Todas', 'Em uso', 'Para Alugar', 'Vazia'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 cursor-pointer ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Subsolo Pills & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white/30 border border-white/40 p-3 rounded-2xl shadow-sm">
          {/* Subsolo Filter */}
          <div className="sm:col-span-4 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['Todos', 'Subsolo 1', 'Subsolo 2'].map((sub) => (
              <button
                key={sub}
                onClick={() => setFilterSubsolo(sub)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all border shadow-xs cursor-pointer ${
                  filterSubsolo === sub
                    ? 'bg-slate-950 text-amber-300 border-slate-800 font-black'
                    : 'bg-white/60 text-slate-900 border-white/80 hover:bg-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              placeholder="Buscar por vaga (ex: G-12), apartamento, morador ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-1.8 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* 4. Grid de Cards de Vagas por Apartamento */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
          Mapa de Vagas ({filteredVagas.length} encontradas)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredVagas.map((vaga) => (
            <VagaCard
              key={vaga.id}
              vaga={vaga}
              isMinha={vaga.unidadeNumero === currentUser.unidade}
              onChamarInterfone={handleChamarInterfone}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
