import React from 'react';
import { AdminModuloKey } from '../../types';
import { ADMIN_MODULOS_LIST, PRESET_PERMISSOES } from '../../constants/adminModulos';
import { 
  Package, 
  Truck, 
  CalendarDays, 
  Wrench, 
  AlertTriangle, 
  PartyPopper, 
  Briefcase, 
  ShoppingBag, 
  Building, 
  Users, 
  DollarSign, 
  Scale, 
  Home, 
  Building2, 
  Gavel, 
  BookOpen, 
  Check, 
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';

interface AdminPermissionsSelectorProps {
  selectedModulos: AdminModuloKey[];
  onChange: (modulos: AdminModuloKey[]) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Package: <Package className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  CalendarDays: <CalendarDays className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  PartyPopper: <PartyPopper className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Gavel: <Gavel className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />
};

export const AdminPermissionsSelector: React.FC<AdminPermissionsSelectorProps> = ({
  selectedModulos,
  onChange
}) => {
  const toggleModulo = (key: AdminModuloKey) => {
    if (selectedModulos.includes(key)) {
      onChange(selectedModulos.filter(k => k !== key));
    } else {
      onChange([...selectedModulos, key]);
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_PERMISSOES[presetKey];
    if (preset) {
      onChange([...preset.modulos]);
    }
  };

  const selectAll = () => {
    onChange(ADMIN_MODULOS_LIST.map(m => m.key));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
      {/* Header & Counter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Permissões de Acesso às Abas do Admin:
          </label>
          <p className="text-[11px] text-slate-500 font-medium">
            Selecione quais telas este colaborador terá autorização para visualizar e operar.
          </p>
        </div>

        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-950 border border-amber-300">
          {selectedModulos.length} de {ADMIN_MODULOS_LIST.length} abas liberadas
        </span>
      </div>

      {/* Presets Rápidos */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/80">
        <span className="text-[10px] font-black uppercase text-slate-500 mr-1">
          Atalhos Rápidos:
        </span>

        {Object.entries(PRESET_PERMISSOES).map(([key, preset]) => {
          const isSelected = 
            preset.modulos.length === selectedModulos.length &&
            preset.modulos.every(m => selectedModulos.includes(m));

          return (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              title={preset.descricao}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              {preset.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={clearAll}
          className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
        >
          Limpar Todos
        </button>
      </div>

      {/* Grid com todas as 16 abas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
        {ADMIN_MODULOS_LIST.map((modulo) => {
          const isChecked = selectedModulos.includes(modulo.key);
          const icon = ICON_MAP[modulo.icone] || <ShieldCheck className="w-4 h-4" />;

          return (
            <div
              key={modulo.key}
              onClick={() => toggleModulo(modulo.key)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                isChecked
                  ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="mt-0.5 shrink-0 text-slate-900">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-amber-600 fill-amber-500" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`p-1 rounded-lg ${modulo.corBadge} shrink-0`}>
                    {icon}
                  </span>
                  <span className="text-[11px] font-black text-slate-950 truncate leading-tight">
                    {modulo.titulo}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {modulo.subtitulo}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
