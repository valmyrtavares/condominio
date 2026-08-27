import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { ServicoMorador } from '../types';
import { CreateEditServiceModal } from '../components/servicos/CreateEditServiceModal';
import { 
  ArrowLeft, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Briefcase, 
  MessageCircle, 
  Globe, 
  AlertTriangle, 
  Edit3, 
  Search,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const ServicosMoradoresScreen: React.FC = () => {
  const { 
    servicosMoradores, 
    currentUser, 
    isAdminLoggedIn, 
    setCurrentScreen 
  } = useCondo();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState<ServicoMorador | null>(null);

  const categorias = [
    'Todos', 
    'Gastronomia', 
    'Advocacia & Consultoria', 
    'Pets & Cuidados', 
    'Saúde & Esportes', 
    'Design & Organização', 
    'Limpeza & Higienização',
    'Aulas & Educação',
    'Outros'
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleOpenNovoAnuncio = () => {
    setServicoParaEditar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (servico: ServicoMorador, e: React.MouseEvent) => {
    e.stopPropagation();
    setServicoParaEditar(servico);
    setIsModalOpen(true);
  };

  // Regra de Visibilidade:
  // - Anúncios ativos aparecem para todos
  // - Anúncios suspensos (ativo === false) só aparecem para o dono do anúncio ou administrador
  const filteredServicos = servicosMoradores.filter(servico => {
    const isDono = Boolean(
      (currentUser.unidade && servico.moradorUnidade && currentUser.unidade.toLowerCase() === servico.moradorUnidade.toLowerCase()) ||
      (currentUser.nome && servico.moradorNome && currentUser.nome.toLowerCase() === servico.moradorNome.toLowerCase())
    );
    const isAdmin = currentUser.role === 'sindico' || currentUser.role === 'subsindico' || isAdminLoggedIn;

    // Se estiver inativo/suspenso e não for dono nem admin, esconde do mural
    if (!servico.ativo && !isDono && !isAdmin) {
      return false;
    }

    // Filtro por Categoria
    const matchesCat = selectedCategoria === 'Todos' || servico.categoria.toLowerCase().includes(selectedCategoria.toLowerCase());

    // Filtro por Busca
    const matchesSearch = !searchTerm ||
      servico.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (servico.subtitulo && servico.subtitulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.moradorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.moradorUnidade.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden">
      
      {/* Header back button + Criar Anúncio Button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-extrabold drop-shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        {/* Botão + Anunciar Meu Serviço */}
        <button
          onClick={handleOpenNovoAnuncio}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 shadow-lg font-black text-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Anunciar Meu Serviço</span>
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" />
          Serviços de Moradores
        </h2>
        <p className="text-xs text-amber-100/90 font-medium mt-0.5">
          Mural de classificados internos. Dê preferência a contratar quem mora no seu condomínio!
        </p>
      </div>

      {/* Categorias & Busca */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full">
          <span className="text-[10px] font-extrabold uppercase text-amber-100/90 whitespace-nowrap pl-1">
            Filtro:
          </span>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoria(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shadow-sm shrink-0 ${
                selectedCategoria === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/40 text-slate-900 border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por serviço, profissional ou apto (ex: Tortas, Advocacia, 404)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 border border-white/80 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white font-semibold shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.8" />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow block">
            Anúncios Disponíveis ({filteredServicos.length})
          </span>
        </div>

        {filteredServicos.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border border-white/70 rounded-3xl space-y-3">
            <p className="text-sm font-black text-slate-950">Nenhum serviço encontrado para este filtro.</p>
            <button
              onClick={handleOpenNovoAnuncio}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Seja o primeiro a anunciar seu serviço!
            </button>
          </div>
        ) : (
          filteredServicos.map((servico) => {
            const isExpanded = expandedId === servico.id;
            const isDono = Boolean(
              (currentUser.unidade && servico.moradorUnidade && currentUser.unidade.toLowerCase() === servico.moradorUnidade.toLowerCase()) ||
              (currentUser.nome && servico.moradorNome && currentUser.nome.toLowerCase() === servico.moradorNome.toLowerCase())
            );
            const isSuspenso = !servico.ativo;

            // Link de contato
            let contactLink = '#';
            let buttonLabel = 'Clique aqui para ver mais';
            let isWhatsApp = servico.tipoBotao === 'whatsapp';

            if (isWhatsApp) {
              const rawPhone = servico.whatsapp || servico.contato || '';
              const cleanDigits = rawPhone.replace(/\D/g, '');
              contactLink = `https://wa.me/55${cleanDigits}`;
              buttonLabel = `Falar no WhatsApp (${servico.whatsapp || servico.contato})`;
            } else {
              contactLink = servico.linkSite?.startsWith('http') ? servico.linkSite : `https://${servico.linkSite || ''}`;
              buttonLabel = 'Acessar Site / Portfólio Externo';
            }

            return (
              <div 
                key={servico.id}
                className={`border rounded-3xl overflow-hidden shadow-xl transition-all duration-300 ${
                  isSuspenso
                    ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-white/45 border-white/60 hover:bg-white/55'
                }`}
              >
                {/* Header section (Always visible) */}
                <button
                  onClick={() => toggleExpand(servico.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-2xs ${
                        isSuspenso 
                          ? 'bg-rose-100 text-rose-950 border-rose-300' 
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        {servico.categoria || 'Geral'}
                      </span>

                      {isSuspenso && (
                        <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-2.5 h-2.5" /> Suspenso pela Administração
                        </span>
                      )}

                      {isDono && (
                        <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                          Seu Anúncio
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight mt-1 truncate">
                      {servico.titulo}
                    </h3>
                    
                    <p className="text-[11px] text-amber-950 font-bold mt-0.5">
                      Oferecido por: <strong>{servico.moradorNome}</strong> {servico.moradorUnidade ? `(Apto ${servico.moradorUnidade})` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão de Edição para o Dono */}
                    {isDono && (
                      <button
                        onClick={(e) => handleOpenEditar(servico, e)}
                        className="p-1.5 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                        title="Editar Anúncio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                    )}

                    <div className="p-1.5 rounded-full bg-white/50 border border-white/60 text-slate-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expandable Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-950/10 pt-3 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Banner de Aviso caso o anúncio esteja suspenso */}
                    {isSuspenso && (
                      <div className="p-3.5 rounded-2xl bg-rose-100/90 border border-rose-300 text-rose-950 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-black text-rose-900">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>Este anúncio está temporariamente suspenso para os outros moradores.</span>
                        </div>
                        <p className="text-[11px] font-semibold text-rose-900/90 pl-5">
                          <strong>Motivo da Sindicância:</strong> {servico.motivoSuspensao || 'Ajustes necessários no cadastro.'}
                        </p>
                        <div className="pl-5 pt-1">
                          <button
                            onClick={(e) => handleOpenEditar(servico, e)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar Anúncio e Reativar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Service Image */}
                    {servico.imagem && (
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl border border-white/50 shadow-sm bg-slate-100">
                        <img 
                          src={servico.imagem} 
                          alt={servico.titulo} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Service Details */}
                    <div className="space-y-2">
                      <div className="bg-white/55 border border-white/60 p-3.5 rounded-2xl text-xs space-y-1.5 shadow-2xs">
                        {servico.subtitulo && (
                          <p className="font-extrabold text-slate-950 text-sm">
                            {servico.subtitulo}
                          </p>
                        )}
                        <p className="text-xs text-slate-800 leading-relaxed font-semibold whitespace-pre-line">
                          {servico.descricao}
                        </p>
                      </div>

                      {/* Action Button: WhatsApp or Site */}
                      <a
                        href={contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-3 w-full justify-center rounded-2xl text-xs font-black uppercase shadow-md transition-all active:scale-95 ${
                          isWhatsApp
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                        }`}
                      >
                        {isWhatsApp ? <MessageCircle className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {buttonLabel}
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação / Edição de Anúncio */}
      <CreateEditServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setServicoParaEditar(null);
        }}
        servicoParaEditar={servicoParaEditar}
      />

    </div>
  );
};
