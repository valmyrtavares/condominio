import React from 'react';
import { TimelineStep } from '../../types';
import { CheckCircle2, Clock, ShieldCheck, User } from 'lucide-react';

interface TimelineViewProps {
  steps: TimelineStep[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ steps }) => {
  return (
    <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.id || idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                isLast
                  ? 'bg-indigo-600 border-indigo-200 ring-4 ring-indigo-100'
                  : 'bg-white border-slate-300'
              }`}
            >
              {isLast ? (
                <CheckCircle2 className="w-3 h-3 text-white" />
              ) : (
                <Clock className="w-2.5 h-2.5 text-slate-400" />
              )}
            </div>

            {/* Step Card */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 text-xs shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  {step.titulo}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-semibold">{step.data}</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">{step.descricao}</p>
              
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1">
                  {step.autorRole === 'subsindico' || step.autorRole === 'sindico' ? (
                    <span className="text-amber-800 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" /> Administração
                    </span>
                  ) : (
                    <span className="text-indigo-700 font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-600" /> Morador
                    </span>
                  )}
                </span>
                {step.statusAlvo && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 font-extrabold">
                    Status: {step.statusAlvo}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
