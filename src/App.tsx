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
import { EnjoeiScreen } from './pages/EnjoeiScreen';
import { MudancasScreen } from './pages/MudancasScreen';
import { DiarioSindicoScreen } from './pages/DiarioSindicoScreen';
import { PortariaScreen } from './pages/PortariaScreen';
import { SuperAdminLoginScreen } from './pages/master/SuperAdminLoginScreen';
import { SuperAdminDashboardScreen } from './pages/master/SuperAdminDashboardScreen';
import { AdminLoginScreen } from './pages/admin/AdminLoginScreen';
import { AdminPanelScreen } from './pages/admin/AdminPanelScreen';
import { ResidentLoginScreen } from './pages/auth/ResidentLoginScreen';
import { ResidentRegisterScreen } from './pages/auth/ResidentRegisterScreen';
import { getRouteConfig } from './router/routes';

const MainContent: React.FC = () => {
  const { 
    currentScreen, 
    isAdminLoggedIn, 
    isResidentLoggedIn,
    isMasterLoggedIn,
    setTargetRedirectScreen 
  } = useCondo();

  if (currentScreen === 'master') {
    return isMasterLoggedIn ? <SuperAdminDashboardScreen /> : <SuperAdminLoginScreen />;
  }

  const routeConfig = getRouteConfig(currentScreen);

  // Interceptor 1: Rota de Administração protegida por login do Síndico
  if (routeConfig?.auth === 'admin' && !isAdminLoggedIn) {
    return <AdminLoginScreen />;
  }

  // Interceptor 2: Módulo exclusivo de Moradores protegido por login da unidade
  if (routeConfig?.auth === 'resident' && !isResidentLoggedIn) {
    return <ResidentLoginScreen />;
  }

  if (currentScreen === 'home') {
    return <HomeScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'admin':
        return <AdminPanelScreen />;
      case 'admin-login':
        return <AdminLoginScreen />;
      case 'resident-login':
        return <ResidentLoginScreen />;
      case 'resident-register':
        return <ResidentRegisterScreen />;
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
      case 'enjoei':
        return <EnjoeiScreen />;
      case 'mudancas':
        return <MudancasScreen />;
      case 'diario-sindico':
        return <DiarioSindicoScreen />;
      case 'portaria':
        return <PortariaScreen />;
      case 'master':
        return isMasterLoggedIn ? <SuperAdminDashboardScreen /> : <SuperAdminLoginScreen />;
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

const AppLayout: React.FC = () => {
  const { currentScreen, currentCondo, setCurrentScreen } = useCondo();
  const isAdminScreen = currentScreen === 'admin';
  const isMasterScreen = currentScreen === 'master';

  if (isMasterScreen) {
    return <MainContent />;
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans transition-colors duration-500 relative ${
      isAdminScreen ? 'bg-[#f4efe6] text-slate-900' : 'bg-slate-950 text-slate-900'
    }`}>
      {/* Fullscreen Building Background Image (Hidden on Admin screen to differentiate) */}
      {!isAdminScreen && (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <img
            src={currentCondo?.fotoFachada || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90"}
            alt={currentCondo?.nome || "Residencial Jardim Paulista"}
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>
      )}

      {/* Admin specific subtle texture & header glow when on admin */}
      {isAdminScreen && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:16px_16px]" />
      )}

      <Header />
      <EspinhaDorsalDrawer />
      <MainContent />
      <BottomNav />

      {/* Floating SuperAdmin Portal Shortcut (Bottom-right discrete button) */}
      <div className="fixed bottom-20 right-3 z-40">
        <button
          type="button"
          onClick={() => setCurrentScreen('master')}
          className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/40 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
          title="Abrir Painel SuperAdmin Master (/master)"
        >
          <span className="text-sm">👑</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-[11px] font-black text-amber-300 px-0 group-hover:px-1.5">
            SuperAdmin Master
          </span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CondoProvider>
      <AppLayout />
    </CondoProvider>
  );
}
