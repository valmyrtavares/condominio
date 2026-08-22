import React from 'react';
import { CondoProvider, useCondo } from './context/CondoContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { EspinhaDorsalDrawer } from './components/layout/EspinhaDorsalDrawer';

import { HomeScreen } from './pages/HomeScreen';
import { MoradoresScreen } from './pages/MoradoresScreen';
import { ReclamacoesScreen } from './pages/ReclamacoesScreen';
import { ReparosScreen } from './pages/ReparosScreen';
import { PrestacaoContasScreen } from './pages/PrestacaoContasScreen';
import { GenericModuleScreen } from './pages/GenericModuleScreen';

const MainContent: React.FC = () => {
  const { currentScreen } = useCondo();

  if (currentScreen === 'home') {
    return <HomeScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'moradores':
        return <MoradoresScreen />;
      case 'reclamacoes':
        return <ReclamacoesScreen />;
      case 'reparos':
        return <ReparosScreen />;
      case 'prestacao-contas':
        return <PrestacaoContasScreen />;
      default:
        return <GenericModuleScreen moduleId={currentScreen} />;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 pt-20 pb-24 min-h-screen">
      {renderScreen()}
    </main>
  );
};

export default function App() {
  return (
    <CondoProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        <EspinhaDorsalDrawer />
        <MainContent />
        <BottomNav />
      </div>
    </CondoProvider>
  );
}
