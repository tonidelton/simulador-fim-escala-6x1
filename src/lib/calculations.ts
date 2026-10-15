import type { CompanyProfile, StepResult, ScenarioResult, TimelineEvent } from './types';

/**
 * Convert weekly hours to monthly hours average
 * Formula: weeklyHours × (30/7)
 */
export function weeklyToMonthlyHours(weeklyHours: number): number {
  return weeklyHours * (30 / 7);
}

/**
 * Calculate monthly cost per employee
 * Formula: salary × (1 + charges/100)
 */
export function monthlyCostPerEmployee(salary: number, chargesPercent: number): number {
  return salary * (1 + chargesPercent / 100);
}

/**
 * Calculate current monthly sheet
 */
export function currentMonthlySheet(profile: CompanyProfile): number {
  const costPerEmployee = monthlyCostPerEmployee(profile.avgSalary, profile.chargesPercent);
  const totalEmployees = profile.employees44h + profile.employees40hOrLess + profile.employees12x36;
  return totalEmployees * costPerEmployee;
}

/**
 * Calculate total employees
 */
export function totalEmployees(profile: CompanyProfile): number {
  return profile.employees44h + profile.employees40hOrLess + profile.employees12x36;
}

/**
 * Calculate hours lost per month for a given step
 */
export function hoursLostPerMonth(employees44h: number, currentWeekly: number, targetWeekly: number): number {
  return employees44h * (currentWeekly - targetWeekly) * (30 / 7);
}

/**
 * Scenario A: Hire new employees
 * FTE needed = hoursLost / monthlyHoursOfNewJourney
 * Cost = FTE × costPerEmployee
 */
export function scenarioA(
  hoursLost: number,
  targetWeeklyHours: number,
  avgSalary: number,
  chargesPercent: number
): ScenarioResult {
  const monthlyHoursNew = weeklyToMonthlyHours(targetWeeklyHours);
  const fteNeeded = monthlyHoursNew > 0 ? hoursLost / monthlyHoursNew : 0;
  const costPerEmployee = monthlyCostPerEmployee(avgSalary, chargesPercent);
  const monthlyCost = fteNeeded * costPerEmployee;
  return {
    monthlyCost,
    annualCost: monthlyCost * 12,
    fteNeeded,
  };
}

/**
 * Scenario B: Overtime
 * Cost = hoursLost × (salary / monthlyHoursNew) × 1.5 × (1 + charges/100)
 */
export function scenarioB(
  hoursLost: number,
  targetWeeklyHours: number,
  avgSalary: number,
  chargesPercent: number
): ScenarioResult {
  const monthlyHoursNew = weeklyToMonthlyHours(targetWeeklyHours);
  const hourlyRate = monthlyHoursNew > 0 ? avgSalary / monthlyHoursNew : 0;
  const monthlyCost = hoursLost * hourlyRate * 1.5 * (1 + chargesPercent / 100);
  return {
    monthlyCost,
    annualCost: monthlyCost * 12,
  };
}

/**
 * Scenario C: Redistribute schedule (only if operates 6 days)
 * Cost = employees44h × 20% × costPerEmployee
 */
export function scenarioC(
  employees44h: number,
  avgSalary: number,
  chargesPercent: number
): ScenarioResult {
  const costPerEmployee = monthlyCostPerEmployee(avgSalary, chargesPercent);
  const monthlyCost = employees44h * 0.2 * costPerEmployee;
  return {
    monthlyCost,
    annualCost: monthlyCost * 12,
  };
}

/**
 * Calculate step result for a given target weekly hours
 */
export function calculateStep(
  profile: CompanyProfile,
  targetWeeklyHours: number,
  date: string
): StepResult {
  const hoursLost = hoursLostPerMonth(profile.employees44h, 44, targetWeeklyHours);
  const a = scenarioA(hoursLost, targetWeeklyHours, profile.avgSalary, profile.chargesPercent);
  const b = scenarioB(hoursLost, targetWeeklyHours, profile.avgSalary, profile.chargesPercent);
  const c = profile.operates6Days
    ? scenarioC(profile.employees44h, profile.avgSalary, profile.chargesPercent)
    : null;

  return {
    date,
    weeklyHours: targetWeeklyHours,
    hoursLostPerMonth: hoursLost,
    scenarioA: a,
    scenarioB: b,
    scenarioC: c,
  };
}

/**
 * Add days to a date
 */
export function addDays(dateStr: string, days: number): Date {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Add months to a date, handling end-of-month
 */
export function addMonths(dateStr: string, months: number): Date {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate();
  date.setMonth(date.getMonth() + months);
  // Handle end-of-month (e.g., Jan 31 + 1 month = Feb 28)
  if (date.getDate() !== day) {
    date.setDate(0); // Go to last day of previous month
  }
  return date;
}

/**
 * Format date to dd/mm/yyyy
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Generate timeline events from promulgation date
 */
export function generateTimeline(promulgationDate: string): TimelineEvent[] {
  const promDate = new Date(promulgationDate + 'T00:00:00');
  const step1Date = addDays(promulgationDate, 60);
  const step2Date = addMonths(promulgationDate, 14);

  return [
    {
      date: formatDate(promDate),
      label: 'Promulgação',
      description: 'Data estimada da promulgação da PEC. Início da contagem dos prazos.',
    },
    {
      date: formatDate(step1Date),
      label: 'Etapa 1 — 42h semanais',
      description: '+60 dias após promulgação. Jornada máxima de 42h semanais com RSR de 2 dias (um preferencialmente aos domingos).',
    },
    {
      date: formatDate(step2Date),
      label: 'Etapa 2 — 40h semanais',
      description: '+14 meses após promulgação. Jornada máxima de 40h semanais. Fim da transição.',
    },
  ];
}

/**
 * Get step dates as ISO strings
 */
export function getStepDates(promulgationDate: string): { step1: string; step2: string } {
  const step1Date = addDays(promulgationDate, 60);
  const step2Date = addMonths(promulgationDate, 14);
  return {
    step1: step1Date.toISOString().split('T')[0],
    step2: step2Date.toISOString().split('T')[0],
  };
}

/**
 * Run full simulation
 */
export function runSimulation(profile: CompanyProfile): {
  currentMonthlySheet: number;
  totalEmployees: number;
  step1: StepResult;
  step2: StepResult;
} {
  const dates = getStepDates(profile.promulgationDate);
  const sheet = currentMonthlySheet(profile);
  const total = totalEmployees(profile);
  const s1 = calculateStep(profile, 42, dates.step1);
  const s2 = calculateStep(profile, 40, dates.step2);

  return {
    currentMonthlySheet: sheet,
    totalEmployees: total,
    step1: s1,
    step2: s2,
  };
}
