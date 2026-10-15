import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CompanyProfile, TabId, SimulationResult } from './lib/types';
import { runSimulation } from './lib/calculations';
import { saveSimulation, saveCurrentProfile, getCurrentProfile } from './lib/storage';
import CompanyForm, { createDefaultProfile } from './components/CompanyForm';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import ActionPlan from './components/ActionPlan';
import History from './components/History';
import LegalInfo from './components/LegalInfo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'resumo', label: 'Resumo da PEC', icon: '📜' },
  { id: 'simulacao', label: 'Simulação', icon: '📊' },
  { id: 'cronograma', label: 'Cronograma', icon: '📅' },
  { id: 'plano', label: 'Plano de Ação', icon: '✅' },
  { id: 'historico', label: 'Histórico', icon: '💾' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('resumo');
  const [profile, setProfile] = useState<CompanyProfile>(() => {
    const saved = getCurrentProfile();
    return saved || createDefaultProfile();
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    saveCurrentProfile(profile);
  }, [profile]);

  const simulationResult = useMemo<SimulationResult | null>(() => {
    if (profile.employees44h === 0) return null;
    const sim = runSimulation(profile);
    return {
      profile,
      currentMonthlySheet: sim.currentMonthlySheet,
      totalEmployees: sim.totalEmployees,
      step1: sim.step1,
      step2: sim.step2,
      savedAt: new Date().toISOString(),
    };
  }, [profile]);

  const handleSave = useCallback(() => {
    if (simulationResult) {
      saveSimulation(simulationResult);
      alert('Simulação salva com sucesso!');
    }
  }, [simulationResult]);

  const handleLoad = useCallback((result: SimulationResult) => {
    setProfile(result.profile);
    setActiveTab('simulacao');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Simulador de Impacto — Fim da Escala 6x1
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                PEC 221/2019 • Redução de jornada de 44h para 40h semanais
              </p>
            </div>
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Tabs - Desktop */}
          <nav className="hidden lg:flex gap-1 mt-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tabs - Mobile */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-3 pb-2 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {activeTab === 'resumo' && (
          <div>
            <LegalInfo />
          </div>
        )}

        {activeTab === 'simulacao' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Form - Sidebar on large screens */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <CompanyForm profile={profile} onChange={setProfile} />
              </div>
            </div>
            {/* Dashboard */}
            <div className="xl:col-span-2">
              <Dashboard profile={profile} />
            </div>
          </div>
        )}

        {activeTab === 'cronograma' && (
          <Timeline profile={profile} />
        )}

        {activeTab === 'plano' && (
          <ActionPlan companyId={profile.id} />
        )}

        {activeTab === 'historico' && (
          <History
            onSave={handleSave}
            onLoad={handleLoad}
            currentResult={simulationResult}
          />
        )}
      </main>

      {/* Footer / Legal Disclaimer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-300 text-xs py-3 px-4 border-t border-slate-700 print:relative print:border-t-0 print:bg-white print:text-black">
        <div className="max-w-7xl mx-auto flex items-start gap-2">
          <span className="text-amber-400 flex-shrink-0">⚠️</span>
          <p className="text-[11px] leading-relaxed">
            <strong>Aviso Legal:</strong> Os valores apresentados são estimativas para planejamento. Não consideram desonerações específicas, ganhos de produtividade nem remuneração variável. 
            A simulação apoia a consultoria, mas não substitui análise jurídica caso a caso.
          </p>
        </div>
      </footer>
    </div>
  );
}
