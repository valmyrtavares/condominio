import React from 'react';
import { useCondo } from '../../context/CondoContext';
import { Home, Users, AlertTriangle, Wrench, PieChart } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useCondo();

  const isHome = currentScreen === 'home';

  const NAV_ITEMS = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'moradores', label: 'Moradores', icon: Users },
    { id: 'reclamacoes', label: 'Reclamações', icon: AlertTriangle },
    { id: 'reparos', label: 'Reparos', icon: Wrench },
    { id: 'prestacao-contas', label: 'Contas', icon: PieChart }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 py-3 px-4 transition-colors ${
      isHome 
        ? 'bg-transparent text-white drop-shadow-md' 
        : 'bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-600 shadow-lg'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-all active:scale-95 ${
                isHome
                  ? isActive
                    ? 'text-white font-extrabold scale-110'
                    : 'text-white/80 hover:text-white'
                  : isActive
                    ? 'text-indigo-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-6 h-6 ${isHome ? 'text-white stroke-[2.2]' : ''}`} />
              <span className={`text-[11px] mt-1 tracking-tight font-extrabold ${isHome ? 'text-white text-shadow' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
