import type { CompanyProfile, SimulationResult } from './types';

const STORAGE_KEY = 'simulador_6x1_simulations';
const PROFILE_KEY = 'simulador_6x1_current_profile';

export function saveSimulation(result: SimulationResult): void {
  const existing = getSimulations();
  existing.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getSimulations(): SimulationResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteSimulation(id: string): void {
  const existing = getSimulations();
  const filtered = existing.filter((s) => s.profile.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function saveCurrentProfile(profile: CompanyProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getCurrentProfile(): CompanyProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function exportToCSV(results: SimulationResult[]): void {
  const BOM = '\uFEFF';
  const headers = [
    'Empresa',
    'Setor',
    'Empregados 44h',
    'Empregados ≤40h',
    'Empregados 12x36',
    'Salário Médio',
    'Encargos %',
    'HE Semanal',
    'Opera 6 dias',
    'Data Promulgação',
    'Folha Mensal Atual',
    'Horas Perdidas/mês (Etapa Final)',
    'Custo Cenário A (mensal)',
    'Custo Cenário B (mensal)',
    'Custo Cenário C (mensal)',
    'Impacto Anual A',
    'Impacto Anual B',
    'Impacto Anual C',
    'Data Simulação',
  ];

  const rows = results.map((r) => [
    r.profile.name,
    r.profile.sector,
    r.profile.employees44h.toString(),
    r.profile.employees40hOrLess.toString(),
    r.profile.employees12x36.toString(),
    r.profile.avgSalary.toString(),
    r.profile.chargesPercent.toString(),
    r.profile.overtimeHoursPerWeek.toString(),
    r.profile.operates6Days ? 'Sim' : 'Não',
    r.profile.promulgationDate,
    r.currentMonthlySheet.toFixed(2),
    r.step2.hoursLostPerMonth.toFixed(2),
    r.step2.scenarioA.monthlyCost.toFixed(2),
    r.step2.scenarioB.monthlyCost.toFixed(2),
    r.step2.scenarioC ? r.step2.scenarioC.monthlyCost.toFixed(2) : 'N/A',
    r.step2.scenarioA.annualCost.toFixed(2),
    r.step2.scenarioB.annualCost.toFixed(2),
    r.step2.scenarioC ? r.step2.scenarioC.annualCost.toFixed(2) : 'N/A',
    r.savedAt,
  ]);

  const csv = BOM + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `simulacao_6x1_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
