import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CompanyProfile, TabId, SimulationResult } from './lib/types';
import { runSimulation } from './lib/calculations';
import { saveSimulation, saveCurrentProfile, getCurrentProfile } from './lib/storage';
import CompanyForm, { createDefaultProfile } from './components/CompanyForm';
import Dashboard from './components/Dashboard';
import ProfessoresAulistas from './components/ProfessoresAulistas';
import Timeline from './components/Timeline';
import ActionPlan from './components/ActionPlan';
import History from './components/History';
import LegalInfo from './components/LegalInfo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'resumo', label: 'Resumo da EC 141/2026', icon: '📜' },
  { id: 'simulacao', label: 'Simulação', icon: '📊' },
  { id: 'professores', label: 'Professores Aulistas', icon: '👨‍🏫' },
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-900/40 px-2 py-0.5 rounded">
                  OSL Contadores Associados
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Simulador de Impacto — Fim da Escala 6x1
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                EC 141/2026 • Redução de jornada de 44h para 40h semanais • Publicada em 16/10/2026
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

        {activeTab === 'professores' && (
          <ProfessoresAulistas />
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/553588711176"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center gap-2 px-4 py-3 transition-all hover:scale-105 print:hidden"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
      </a>

      {/* Footer / Legal Disclaimer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-300 text-xs py-3 px-4 border-t border-slate-700 print:relative print:border-t-0 print:bg-white print:text-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 flex-shrink-0">⚠️</span>
            <p className="text-[11px] leading-relaxed">
              <strong>Aviso Legal:</strong> Os valores apresentados são estimativas para planejamento. Não consideram desonerações específicas, ganhos de produtividade nem remuneração variável. 
              A simulação apoia a consultoria, mas não substitui análise jurídica caso a caso. Os cálculos da calculadora de DSR são estimativas de planejamento e não substituem análise jurídica nem a convenção coletiva aplicável.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 sm:text-right flex-shrink-0">
            <p className="font-semibold text-emerald-400">OSL Contadores Associados</p>
            <p>
              <a href="https://wa.me/553588711176" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 underline">
                📱 +55 (35) 8871-1176
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
