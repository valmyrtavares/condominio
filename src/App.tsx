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
import { ServicosMoradoresScreen } from './pages/ServicosMoradoresScreen';
import { RegrasCondominioScreen } from './pages/RegrasCondominioScreen';
import { BenfeitoriasScreen } from './pages/BenfeitoriasScreen';
import { VagasGaragemScreen } from './pages/VagasGaragemScreen';
import { ServicosContratadosScreen } from './pages/ServicosContratadosScreen';
import { DependenciasScreen } from './pages/DependenciasScreen';
import { AssembleiasScreen } from './pages/AssembleiasScreen';
import { FuncionariosScreen } from './pages/FuncionariosScreen';
import { EventosScreen } from './pages/EventosScreen';
import { UnidadesDisponiveisScreen } from './pages/UnidadesDisponiveisScreen';

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
      case 'benfeitorias':
        return <BenfeitoriasScreen />;
      case 'vagas-garagem':
        return <VagasGaragemScreen />;
      case 'servicos-contratados':
        return <ServicosContratadosScreen />;
      case 'dependencias':
        return <DependenciasScreen />;
      case 'assembleias':
        return <AssembleiasScreen />;
      case 'eventos':
        return <EventosScreen />;
      case 'funcionarios':
        return <FuncionariosScreen />;
      case 'unidades-disponiveis':
        return <UnidadesDisponiveisScreen />;
      case 'prestacao-contas':
        return <PrestacaoContasScreen />;
      case 'servicos-moradores':
        return <ServicosMoradoresScreen />;
      case 'regras-condominio':
        return <RegrasCondominioScreen />;
      default:
        return <GenericModuleScreen moduleId={currentScreen} />;
    }
  };

  return (
    <main className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 pt-20 pb-24 min-h-screen overflow-x-hidden">
      {renderScreen()}
    </main>
  );
};

export default function App() {
  return (
    <CondoProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
        {/* Fullscreen Building Background Image Shared Across ALL Screens */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90"
            alt="Residencial Jardim Paulista"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>

        <Header />
        <EspinhaDorsalDrawer />
        <MainContent />
        <BottomNav />
      </div>
    </CondoProvider>
  );
}
