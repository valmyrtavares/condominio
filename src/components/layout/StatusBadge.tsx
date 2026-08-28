import React from 'react';
import { StatusReclamacao, StatusReparo } from '../../types';

interface StatusBadgeProps {
  status: StatusReclamacao | StatusReparo | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (s: string) => {
    switch (s) {
      case 'Recebida':
      case 'Solicitado':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Em análise':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Buscando Orçamento':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Análise de Orçamento':
        return 'bg-orange-50 text-orange-800 border-orange-300 font-bold';
      case 'Orçamento Contratado':
      case 'Aprovado':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-bold';
      case 'Em Execução':
      case 'Em andamento':
      case 'Aguardando Conserto':
      case 'Agendado':
        return 'bg-sky-50 text-sky-800 border-sky-300 font-bold';
      case 'Resolvido':
      case 'Resolvida':
      case 'Executado':
      case 'Confirmado':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Cancelado':
      case 'Encerrada':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      case 'Orçamento':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(status)} shadow-2xs`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};
