import React, { useState, useMemo, useCallback } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Unidade } from '../../types';
import { 
  Bell, 
  X, 
  Send, 
  Sparkles,
  BookmarkPlus,
  Trash2,
  Check
} from 'lucide-react';

interface PrivateNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidade: Unidade | null;
}

interface TemplateNotificacao {
  id: string;
  titulo: string;
  mensagem: string;
  isCustom?: boolean;
}

const TEMPLATES_PADRAO: TemplateNotificacao[] = [
  {
    id: 'padrao-1',
    titulo: 'Aviso de Encomenda na Portaria',
    mensagem: 'Aviso: Encomenda disponível para retirada na portaria/zeladoria.'
  },
  {
    id: 'padrao-2',
    titulo: 'Notificação de Silêncio (após 22h)',
    mensagem: 'Notificação: Solicitamos atenção às normas de silêncio após as 22h.'
  },
  {
    id: 'padrao-3',
    titulo: 'Comunicado sobre Vaga de Garagem',
    mensagem: 'Comunicado: Favor regularizar a posição do veículo na vaga de garagem.'
  },
  {
    id: 'padrao-4',
    titulo: 'Aviso de Manutenção Preventiva',
    mensagem: 'Aviso: Manutenção preventiva agendada na prumada de água da sua coluna.'
  }
];

const STORAGE_KEY = 'condo_custom_notify_templates';

// Sub-componente isolado para evitar re-renderizar o modal pai a cada caractere digitado
interface NovoModeloModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (titulo: string, mensagem: string) => void;
}

const NovoModeloModal: React.FC<NovoModeloModalProps> = React.memo(({
  isOpen,
  onClose,
  onSalvar
}) => {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !mensagem.trim()) return;
    onSalvar(titulo.trim(), mensagem.trim());
    setTitulo('');
    setMensagem('');
  };

  const handleClose = () => {
    setTitulo('');
    setMensagem('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
      <div className="fixed inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white border-2 border-amber-500 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-400/60 flex items-center justify-center shrink-0">
              <BookmarkPlus className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-950">
                Criar Modelo Rápido
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Personalize seus modelos frequentes de aviso.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-700">
              Título / Assunto do Modelo:
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Advertência de Barulho, Obra no Apartamento..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-700">
              Texto da Mensagem:
            </label>
            <textarea
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite o texto padrão que será preenchido automaticamente ao clicar no card..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Salvar Modelo
            </button>
          </div>
        </form>

      </div>
    </div>
  );
});

export const PrivateNotifyModal: React.FC<PrivateNotifyModalProps> = ({
  isOpen,
  onClose,
  unidade
}) => {
  const { notificacoesPrivadas, enviarNotificacaoPrivada } = useCondo();
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Modelos rápidos personalizados salvos
  const [customTemplates, setCustomTemplates] = useState<TemplateNotificacao[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Erro ao carregar modelos rápidos personalizados:', err);
    }
    return [];
  });

  // Estado do modal de criação de modelo
  const [isNovoModeloModalOpen, setIsNovoModeloModalOpen] = useState(false);

  const normalizeUnit = useCallback((str?: string) => str ? str.toLowerCase().replace(/^(apt|apto|unidade|apartamento)\s*/i, '').trim() : '', []);

  const notificacoesDestaUnidade = useMemo(() => {
    if (!unidade) return [];
    const norm = normalizeUnit(unidade.numero);
    const filtradas = notificacoesPrivadas.filter(
      n => normalizeUnit(n.unidadeNumero) === norm
    );
    return [...filtradas].sort((a, b) => {
      const idA = a.id?.startsWith('notif-') ? parseInt(a.id.replace('notif-', ''), 10) : 0;
      const idB = b.id?.startsWith('notif-') ? parseInt(b.id.replace('notif-', ''), 10) : 0;
      if (idA && idB) return idB - idA;
      return 0;
    });
  }, [notificacoesPrivadas, unidade, normalizeUnit]);

  const todosModelos = useMemo(() => {
    return [...TEMPLATES_PADRAO, ...customTemplates];
  }, [customTemplates]);

  if (!isOpen || !unidade) return null;

  const unitTitle = unidade.numero.toLowerCase().startsWith('apt') || unidade.numero.toLowerCase().startsWith('cobertura')
    ? unidade.numero
    : `Apto ${unidade.numero}`;

  const salvarCustomTemplates = (novos: TemplateNotificacao[]) => {
    setCustomTemplates(novos);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    } catch (err) {
      console.error('Erro ao salvar modelos rápidos personalizados:', err);
    }
  };

  const handleSalvarNovoModelo = (novoTitulo: string, novaMensagem: string) => {
    const novoItem: TemplateNotificacao = {
      id: `custom-${Date.now()}`,
      titulo: novoTitulo,
      mensagem: novaMensagem,
      isCustom: true
    };

    const listaAtualizada = [...customTemplates, novoItem];
    salvarCustomTemplates(listaAtualizada);

    // Preenche automaticamente no formulário principal
    setTitulo(novoItem.titulo);
    setMensagem(novoItem.mensagem);
    setIsNovoModeloModalOpen(false);
  };

  const handleExcluirModeloCustomizado = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const listaAtualizada = customTemplates.filter(t => t.id !== id);
    salvarCustomTemplates(listaAtualizada);
  };

  const handleSelecionarModelo = (tpl: TemplateNotificacao) => {
    setTitulo(tpl.titulo);
    setMensagem(tpl.mensagem);
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    enviarNotificacaoPrivada(unidade.numero, mensagem.trim(), titulo.trim() || 'Notificação da Sindicância');
    setTitulo('');
    setMensagem('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
        <div className="fixed inset-0" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 z-10 flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-slate-950">
                    Notificar {unitTitle}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                    Privado
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Envie um aviso ou comunicado direto e confidencial para esta moradia.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">

            {/* Form de Envio */}
            <form onSubmit={handleEnviar} className="space-y-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-700">
                  Assunto / Título do Aviso:
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Aviso de Encomenda, Notificação de Ruído..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Modelos Rápidos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Modelos rápidos de texto:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNovoModeloModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[10.5px] font-black text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-500/70 px-2.5 py-1 rounded-lg transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-900" />
                    Crie os seus modelos de texto
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white/70 border border-amber-100 rounded-xl">
                  {todosModelos.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="group relative inline-flex items-center"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelecionarModelo(tpl)}
                        title={`Título: ${tpl.titulo}\nMensagem: ${tpl.mensagem}`}
                        className={`text-[10px] font-semibold text-slate-800 bg-white hover:bg-amber-100 border ${
                          tpl.isCustom 
                            ? 'border-amber-400 bg-amber-50/50 pr-6 text-amber-950' 
                            : 'border-slate-200 hover:border-amber-300'
                        } px-2.5 py-1.5 rounded-lg text-left transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5`}
                      >
                        {tpl.isCustom && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                        <span className="truncate max-w-[200px] sm:max-w-[240px]">
                          {tpl.titulo || tpl.mensagem.substring(0, 32)}
                        </span>
                      </button>

                      {tpl.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleExcluirModeloCustomizado(tpl.id, e)}
                          title="Excluir este modelo"
                          className="absolute right-1 text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-700">
                  Mensagem Privada:
                </label>
                <textarea
                  rows={3}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite a notificação que será exibida reservadamente para os moradores desta unidade..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                Enviar Notificação à Unidade
              </button>
            </form>

            {/* Histórico de Notificações Desta Unidade */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 block">
                Histórico de Notificações Enviadas ({notificacoesDestaUnidade.length})
              </span>

              {notificacoesDestaUnidade.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                  Nenhuma notificação enviada para esta unidade até o momento.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notificacoesDestaUnidade.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-950 font-black">
                          {n.titulo}
                        </strong>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          n.lida 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {n.lida ? '✓ RECEBIDA / LIDA' : 'ENVIADA'}
                        </span>
                      </div>

                      <p className="text-slate-700 font-medium whitespace-pre-wrap">
                        {n.mensagem}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Por: {n.autorNome}</span>
                        <span>{n.dataHora}</span>
                      </div>

                      {n.lida && (
                        <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50/90 px-2 py-1 rounded-lg flex items-center justify-between border border-emerald-200/60">
                          <span>Status de entrega:</span>
                          <span>✓ Recebida e lida pelo morador {n.lidaEm ? `em ${n.lidaEm}` : ''}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer */}
          <div className="flex justify-end pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>

      {/* Popup / Modal para Criar Novo Modelo de Texto (Isolado e Otimizado) */}
      <NovoModeloModal
        isOpen={isNovoModeloModalOpen}
        onClose={() => setIsNovoModeloModalOpen(false)}
        onSalvar={handleSalvarNovoModelo}
      />
    </>
  );
};
