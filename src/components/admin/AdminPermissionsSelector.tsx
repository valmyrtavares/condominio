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
  Sparkles,
  Check, 
  ShieldCheck,
  X,
  PlusCircle
} from 'lucide-react';

interface AdminPermissionsSelectorProps {
  selectedModulos: AdminModuloKey[];
  onChange: (modulos: AdminModuloKey[]) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Package: <Package className="w-3.5 h-3.5" />,
  Truck: <Truck className="w-3.5 h-3.5" />,
  CalendarDays: <CalendarDays className="w-3.5 h-3.5" />,
  Wrench: <Wrench className="w-3.5 h-3.5" />,
  AlertTriangle: <AlertTriangle className="w-3.5 h-3.5" />,
  PartyPopper: <PartyPopper className="w-3.5 h-3.5" />,
  Briefcase: <Briefcase className="w-3.5 h-3.5" />,
  ShoppingBag: <ShoppingBag className="w-3.5 h-3.5" />,
  Building: <Building className="w-3.5 h-3.5" />,
  Users: <Users className="w-3.5 h-3.5" />,
  DollarSign: <DollarSign className="w-3.5 h-3.5" />,
  Scale: <Scale className="w-3.5 h-3.5" />,
  Home: <Home className="w-3.5 h-3.5" />,
  Building2: <Building2 className="w-3.5 h-3.5" />,
  Gavel: <Gavel className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />
};

export const AdminPermissionsSelector: React.FC<AdminPermissionsSelectorProps> = ({
  selectedModulos,
  onChange
}) => {
  const addModulo = (key: string) => {
    if (!key) return;
    if (key === '__ALL__') {
      onChange(ADMIN_MODULOS_LIST.map(m => m.key));
      return;
    }
    const moduloKey = key as AdminModuloKey;
    if (!selectedModulos.includes(moduloKey)) {
      onChange([...selectedModulos, moduloKey]);
    }
  };

  const removeModulo = (key: AdminModuloKey) => {
    onChange(selectedModulos.filter(k => k !== key));
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_PERMISSOES[presetKey];
    if (preset) {
      onChange([...preset.modulos]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const availableModulos = ADMIN_MODULOS_LIST.filter(m => !selectedModulos.includes(m.key));
  const selectedModuloObjects = ADMIN_MODULOS_LIST.filter(m => selectedModulos.includes(m.key));

  return (
    <div className="space-y-2 bg-white/80 border border-amber-200/90 rounded-xl p-2.5 shadow-2xs">
      {/* Linha Superior: Título, Select de Adição de Permissão e Atalhos Rápidos */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            Permissões de Abas:
          </label>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-950 border border-amber-300">
            {selectedModulos.length}/{ADMIN_MODULOS_LIST.length} liberadas
          </span>
        </div>

        {/* Select de Ambientes + Atalhos Compactos */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1 lg:justify-end">
          <div className="relative min-w-[230px] sm:min-w-[260px] flex-1 sm:flex-initial">
            <PlusCircle className="w-3.5 h-3.5 text-amber-700 absolute left-2.5 top-2 pointer-events-none" />
            <select
              value=""
              onChange={(e) => addModulo(e.target.value)}
              className="w-full bg-amber-50/70 hover:bg-amber-50 border border-amber-300 rounded-lg pl-7 pr-3 py-1 text-[11px] font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
            >
              <option value="">
                {availableModulos.length === 0
                  ? '✓ Todos os ambientes já foram adicionados'
                  : `+ Adicionar ambiente / permissão (${availableModulos.length} disponíveis)...`}
              </option>
              {availableModulos.length > 1 && (
                <option value="__ALL__">🔓 + Liberar Todos os {ADMIN_MODULOS_LIST.length} Ambientes</option>
              )}
              {availableModulos.map((modulo) => (
                <option key={modulo.key} value={modulo.key}>
                  {modulo.numero > 0 ? `${modulo.numero}. ` : ''}{modulo.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Presets enxutos */}
          <div className="flex items-center gap-1 flex-wrap">
            {Object.entries(PRESET_PERMISSOES).map(([key, preset]) => {
              const isSelected =
                preset.modulos.length === selectedModulos.length &&
                preset.modulos.every(m => selectedModulos.includes(m));

              const shortLabel = preset.label.split(' ')[0];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  title={`Atalho: ${preset.label} (${preset.descricao})`}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  {preset.label.includes('Gestão Total') ? 'Gestão Total' : shortLabel}
                </button>
              );
            })}

            {selectedModulos.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                title="Remover todas as permissões selecionadas"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards dos Ambientes Selecionados (excluíveis individualmente) */}
      {selectedModuloObjects.length === 0 ? (
        <div className="text-[10px] text-slate-500 font-semibold italic py-1 px-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          Nenhum ambiente liberado. Selecione um ambiente na lista acima ou clique em um atalho rápido.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {selectedModuloObjects.map((modulo) => {
            const icon = ICON_MAP[modulo.icone] || <ShieldCheck className="w-3.5 h-3.5" />;
            return (
              <div
                key={modulo.key}
                className="group inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-amber-50/90 border border-amber-300 text-slate-950 shadow-2xs hover:border-amber-400 transition-all"
                title={modulo.subtitulo}
              >
                <span className={`p-0.5 rounded-md ${modulo.corBadge} shrink-0`}>
                  {icon}
                </span>
                <span className="text-[10px] font-black leading-none whitespace-nowrap">
                  {modulo.numero > 0 ? `${modulo.numero}. ` : ''}{modulo.titulo}
                </span>
                <button
                  type="button"
                  onClick={() => removeModulo(modulo.key)}
                  className="p-0.5 rounded-md text-slate-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                  title={`Remover acesso a ${modulo.titulo}`}
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
