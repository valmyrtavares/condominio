import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Assembleia, AtaAssembleia, PautaAssembleia } from '../../types';
import { 
  X, 
  FileText, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Scale, 
  FileCheck,
  Building,
  Layers,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface PublicarAtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  assembleia: Assembleia | null;
}

export const PublicarAtaModal: React.FC<PublicarAtaModalProps> = ({
  isOpen,
  onClose,
  assembleia
}) => {
  const { publicarAtaAssembleia, currentUser } = useCondo();

  const [numeroAta, setNumeroAta] = useState('');
  const [dataLavratura, setDataLavratura] = useState('');
  const [presidenteMesa, setPresidenteMesa] = useState('');
  const [secretarioMesa, setSecretarioMesa] = useState('');
  const [registroCartorio, setRegistroCartorio] = useState('');
  const [resumoDecisoes, setResumoDecisoes] = useState('');
  const [textoCompleto, setTextoCompleto] = useState('');

  // Soluções para cada pauta
  const [solucoesPautas, setSolucoesPautas] = useState<{ [pautaId: string]: { solucao: string; aprovada: boolean; resultadoVotacao: string } }>({});

  useEffect(() => {
    if (assembleia && isOpen) {
      const hoje = new Date().toLocaleDateString('pt-BR');
      setNumeroAta(assembleia.ata?.numeroAta || `ATA-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}/${new Date().getFullYear()}`);
      setDataLavratura(assembleia.ata?.dataLavratura || hoje);
      setPresidenteMesa(assembleia.ata?.presidenteMesa || currentUser.nome || 'Valmyr Tavares (Síndico)');
      setSecretarioMesa(assembleia.ata?.secretarioMesa || 'Mariana Silva (Subsíndica)');
      setRegistroCartorio(assembleia.ata?.registroCartorio || '1º Oficial de Registro de Imóveis e Títulos - Protocolo nº ' + Math.floor(Math.random() * 800000 + 100000));
      setResumoDecisoes(assembleia.ata?.resumoDecisoes || '');
      setTextoCompleto(assembleia.ata?.textoCompleto || '');

      // Inicializar soluções de pautas existentes
      const initSolucoes: { [pautaId: string]: { solucao: string; aprovada: boolean; resultadoVotacao: string } } = {};
      assembleia.pautas.forEach(p => {
        initSolucoes[p.id] = {
          solucao: p.solucaoAta || '',
          aprovada: p.aprovada !== undefined ? p.aprovada : true,
          resultadoVotacao: p.resultadoVotacao || (p.aprovada ? 'Aprovado por maioria' : 'Deliberado')
        };
      });
      setSolucoesPautas(initSolucoes);
    }
  }, [assembleia, isOpen, currentUser]);

  if (!isOpen || !assembleia) return null;

  const handleSolucaoChange = (pautaId: string, solucao: string) => {
    setSolucoesPautas(prev => ({
      ...prev,
      [pautaId]: {
        ...prev[pautaId],
        solucao
      }
    }));
  };

  const handleAprovacaoChange = (pautaId: string, aprovada: boolean) => {
    setSolucoesPautas(prev => ({
      ...prev,
      [pautaId]: {
        ...prev[pautaId],
        aprovada,
        resultadoVotacao: aprovada ? 'Aprovado por maioria absoluta' : 'Rejeitado / Arquivado'
      }
    }));
  };

  // Gerar minuta automática
  const handleGerarMinutaAutomatica = () => {
    const itensTexto = assembleia.pautas.map((p, idx) => {
      const sol = solucoesPautas[p.id];
      const solucaoTxt = sol?.solucao ? `\nDeliberação e Solução: ${sol.solucao}` : '';
      const statusTxt = sol?.aprovada ? '[APROVADO]' : '[NÃO APROVADO / AJUSTADO]';
      return `${idx + 1}. ${p.titulo} (${statusTxt}): ${p.descricao}${solucaoTxt}`;
    }).join('\n\n');

    const resumo = `Em assembleia realizada em ${assembleia.dataHora}, com início em 2ª chamada às ${assembleia.segundaChamada} no ${assembleia.local}, foram deliberadas todas as matérias da ordem do dia. As decisões tomadas possuem vigência imediata e ficam homologadas sob esta ata.`;

    const texto = `ATA OFICIAL DA ${assembleia.tipo.toUpperCase()} (${assembleia.tipoEncontro || 'ASSEMBLEIA GERAL'})\n` +
      `CONDOMÍNIO RESIDENCIAL JARDIM PAULISTA - REGISTRO ${numeroAta}\n\n` +
      `Aos ${dataLavratura}, reuniu-se a assembleia sob presidência de ${presidenteMesa} e secretariada por ${secretarioMesa}.\n\n` +
      `ORDEM DO DIA E DELIBERAÇÕES:\n\n${itensTexto}\n\n` +
      `Nada mais havendo a tratar, lavrou-se a presente ata que segue assinada pelos membros da mesa diretora e condôminos presentes.`;

    setResumoDecisoes(resumo);
    setTextoCompleto(texto);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroAta.trim() || !resumoDecisoes.trim()) {
      alert('Por favor, informe o número da ata e o resumo das decisões.');
      return;
    }

    const pautasAtualizadas: PautaAssembleia[] = assembleia.pautas.map(p => {
      const sol = solucoesPautas[p.id];
      return {
        ...p,
        solucaoAta: sol?.solucao || p.solucaoAta,
        aprovada: sol ? sol.aprovada : p.aprovada,
        resultadoVotacao: sol?.resultadoVotacao || p.resultadoVotacao
      };
    });

    const novaAta: AtaAssembleia = {
      numeroAta: numeroAta.trim(),
      dataLavratura: dataLavratura.trim(),
      presidenteMesa: presidenteMesa.trim(),
      secretarioMesa: secretarioMesa.trim(),
      registroCartorio: registroCartorio.trim() || undefined,
      resumoDecisoes: resumoDecisoes.trim(),
      textoCompleto: textoCompleto.trim() || resumoDecisoes.trim(),
      solucoesPautas: assembleia.pautas.map(p => ({
        pautaId: p.id,
        solucao: solucoesPautas[p.id]?.solucao || '',
        aprovada: solucoesPautas[p.id]?.aprovada
      }))
    };

    publicarAtaAssembleia(assembleia.id, novaAta, 'Realizada com Ata Publicada', pautasAtualizadas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-emerald-500 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between border-b border-emerald-200/60 bg-emerald-500/10 p-4 sm:p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-900 border border-emerald-400/50 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">
                Publicar Ata Oficial & Soluções Geradas
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Registre as decisões, soluções de cada pauta e publique o documento formal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
            title="Fechar Janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          {/* Corpo com Scroll Interno */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 overscroll-contain">
            
            {/* Resumo da Reunião Selecionada */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider">
                  {assembleia.tipoEncontro || 'Assembleia Geral'} • {assembleia.tipo}
                </span>
                <span className="text-[10px] font-bold text-slate-700">
                  {assembleia.dataHora} • {assembleia.local}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-950">
                {assembleia.titulo}
              </h4>
            </div>
            
            {/* Dados Cartoriais e de Mesa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Número da Ata *
                </label>
                <input
                  type="text"
                  value={numeroAta}
                  onChange={(e) => setNumeroAta(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white focus:border-emerald-500 font-mono"
                  placeholder="Ex: ATA-2026/003-AGE"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Data da Lavratura *
                </label>
                <input
                  type="text"
                  value={dataLavratura}
                  onChange={(e) => setDataLavratura(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  placeholder="Ex: 03 de Setembro de 2026"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Presidente da Mesa *
                </label>
                <input
                  type="text"
                  value={presidenteMesa}
                  onChange={(e) => setPresidenteMesa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  Secretário(a) da Mesa *
                </label>
                <input
                  type="text"
                  value={secretarioMesa}
                  onChange={(e) => setSecretarioMesa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Cartório de Registro */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Cartório de Registro (Opcional / Homologação)
              </label>
              <input
                type="text"
                value={registroCartorio}
                onChange={(e) => setRegistroCartorio(e.target.value)}
                placeholder="Ex: 1º Oficial de Registro de Imóveis e Títulos de São Paulo"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            {/* Deliberação & Solução de Cada Pauta */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Soluções & Decisões Item a Item da Pauta ({assembleia.pautas.length}):
                </label>
              </div>

              <div className="space-y-3">
                {assembleia.pautas.map((pauta, idx) => {
                  const solData = solucoesPautas[pauta.id] || {};
                  return (
                    <div
                      key={pauta.id}
                      className="p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50/80 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="space-y-0.5 min-w-0">
                          <strong className="text-xs font-extrabold text-slate-950 block">
                            {idx + 1}. {pauta.titulo}
                          </strong>
                          <p className="text-[11px] text-slate-600">
                            {pauta.descricao}
                          </p>
                        </div>

                        {/* Botões Aprovada / Não Aprovada */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAprovacaoChange(pauta.id, true)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                              solData.aprovada === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            ✓ Aprovada
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAprovacaoChange(pauta.id, false)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                              solData.aprovada === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            ✕ Rejeitada
                          </button>
                        </div>
                      </div>

                      {/* Campo de Solução Homologada */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700 block">
                          Solução / Decisão que a Reunião Gerou para esta Pauta:
                        </label>
                        <input
                          type="text"
                          value={solData.solucao || ''}
                          onChange={(e) => handleSolucaoChange(pauta.id, e.target.value)}
                          placeholder="Ex: Aprovada contratação da empresa SolarTech por R$ 45.000 em 10x; início em 15/10."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-950 font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gerador de Minuta Automática */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-600">
                Redação da Ata
              </span>
              <button
                type="button"
                onClick={handleGerarMinutaAutomatica}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 font-bold text-xs flex items-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Gerar Minuta Automática</span>
              </button>
            </div>

            {/* Resumo das Decisões */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Resumo Geral das Decisões (Exibido no Card do Morador) *
              </label>
              <textarea
                value={resumoDecisoes}
                onChange={(e) => setResumoDecisoes(e.target.value)}
                rows={2}
                placeholder="Breve resumo com as principais deliberações..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500 resize-none"
                required
              />
            </div>

            {/* Texto Formal Completo */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                Texto Completo da Ata (Para o PDF Oficial)
              </label>
              <textarea
                placeholder="Texto formal completo com a íntegra das deliberações e fechamento da ata..."
                value={textoCompleto}
                onChange={(e) => setTextoCompleto(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-emerald-500 resize-none"
              />
            </div>

          </div>

          {/* Footer Fixo */}
          <div className="flex items-center justify-end gap-2 p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar e Publicar Ata no Mural
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
