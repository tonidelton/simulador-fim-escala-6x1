export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  employees44h: number;
  employees40hOrLess: number;
  employees12x36: number;
  avgSalary: number;
  chargesPercent: number;
  overtimeHoursPerWeek: number;
  operates6Days: boolean;
  publicService: boolean; // Presta serviço à administração pública
}

export interface SimulationResult {
  profile: CompanyProfile;
  currentMonthlySheet: number;
  totalEmployees: number;
  step1: StepResult;
  step2: StepResult;
  savedAt: string;
}

export interface StepResult {
  date: string;
  weeklyHours: number;
  hoursLostPerMonth: number;
  scenarioA: ScenarioResult;
  scenarioB: ScenarioResult;
  scenarioC: ScenarioResult | null;
}

export interface ScenarioResult {
  monthlyCost: number;
  annualCost: number;
  fteNeeded?: number;
}

export interface TimelineEvent {
  date: string;
  label: string;
  description: string;
}

export type TabId = 'resumo' | 'simulacao' | 'professores' | 'escalas' | 'cronograma' | 'plano' | 'historico';
