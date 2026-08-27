import React, { useState, useEffect } from 'react';
import { useCondo } from '../../context/CondoContext';
import { Funcionario } from '../../types';
import { 
  X, 
  Star, 
  Check, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ThumbsUp, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

interface RateFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: Funcionario | null;
}

export const RateFuncionarioModal: React.FC<RateFuncionarioModalProps> = ({
  isOpen,
  onClose,
  funcionario
}) => {
  const { 
    currentUser, 
    avaliarFuncionario, 
    avaliacoesFuncionarios 
  } = useCondo();

  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [sucesso, setSucesso] = useState(false);

  // Busca avaliação prévia deste usuário se houver
  useEffect(() => {
    if (funcionario && isOpen) {
      const userIdentifier = currentUser?.id || currentUser?.unidade || '';
      const minhaAval = avaliacoesFuncionarios.find(
        a => a.funcionarioId === funcionario.id && (a.usuarioId === userIdentifier || (currentUser?.unidade && a.unidade === currentUser.unidade))
      );
      if (minhaAval) {
        setSelectedRating(minhaAval.nota);
      } else {
        setSelectedRating(5);
      }
      setHoveredStar(0);
      setSucesso(false);
    }
  }, [funcionario, isOpen, avaliacoesFuncionarios, currentUser]);

  if (!isOpen || !funcionario) return null;

  const handleConfirm = () => {
    avaliarFuncionario(funcionario.id, selectedRating);
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 500);
  };

  const getRatingLabel = (nota: number) => {
    switch (nota) {
      case 1:
        return { text: '1.0 - Ruim / Precisa de muita atenção', color: 'text-rose-600', emoji: '😡' };
      case 2:
        return { text: '2.0 - Regular / Pode melhorar', color: 'text-orange-600', emoji: '😕' };
      case 3:
        return { text: '3.0 - Bom / Atende o esperado', color: 'text-amber-600', emoji: '🙂' };
      case 4:
        return { text: '4.0 - Muito Bom / Prestativo e dedicado', color: 'text-emerald-600', emoji: '😀' };
      case 5:
      default:
        return { text: '5.0 - Excelente / Trabalho impecável!', color: 'text-emerald-700 font-black', emoji: '🌟' };
    }
  };

  const activeRating = hoveredStar || selectedRating;
  const ratingInfo = getRatingLabel(activeRating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">
                Avaliar Colaborador
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Sua nota ajuda a manter o padrão do condomínio
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

        {/* Informações do Colaborador Sendo Avaliado */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3.5">
          <img
            src={funcionario.foto}
            alt={funcionario.nome}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm bg-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800 inline-block mb-0.5">
              {funcionario.categoria || 'Colaborador'}
            </span>
            <h4 className="font-black text-sm text-slate-950 truncate">
              {funcionario.nome}
            </h4>
            <p className="text-xs text-indigo-900 font-extrabold truncate">
              {funcionario.funcao}
            </p>
          </div>
        </div>

        {/* Sucesso Alert */}
        {sucesso && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Avaliação de {selectedRating} estrelas registrada com sucesso!</span>
          </div>
        )}

        {/* 5 Estrelas Interativas */}
        <div className="text-center space-y-3 py-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
            Clique para selecionar a quantidade de estrelas:
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isFilled = starIndex <= activeRating;
              return (
                <button
                  key={starIndex}
                  type="button"
                  onMouseEnter={() => setHoveredStar(starIndex)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedRating(starIndex)}
                  className="p-1 sm:p-2 rounded-2xl hover:bg-amber-50 active:scale-90 transition-all cursor-pointer group"
                  title={`${starIndex} Estrela${starIndex > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-9 h-9 sm:w-10 sm:h-10 transition-all ${
                      isFilled
                        ? 'text-amber-500 fill-amber-400 drop-shadow-md scale-110'
                        : 'text-slate-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Rótulo da Nota */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xl mr-1.5">{ratingInfo.emoji}</span>
            <span className={`text-xs font-black ${ratingInfo.color}`}>
              {ratingInfo.text}
            </span>
          </div>
        </div>

        {/* Aviso de Privacidade / Sigilo */}
        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-950 font-medium">
          <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="font-extrabold">Avaliação 100% Confidencial:</strong> Os outros moradores e o colaborador não podem ver a sua avaliação individual, apenas a média geral de todas as notas somadas.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Confirmar ({selectedRating} {selectedRating === 1 ? 'Estrela' : 'Estrelas'})
          </button>
        </div>

      </div>
    </div>
  );
};
