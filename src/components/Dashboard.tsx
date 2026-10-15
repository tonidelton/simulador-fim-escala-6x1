import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { CompanyProfile } from '../lib/types';
import { runSimulation } from '../lib/calculations';
import { formatCurrency, formatNumber, formatHours } from '../lib/format';

interface Props {
  profile: CompanyProfile;
}

export default function Dashboard({ profile }: Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const results = useMemo(() => runSimulation(profile), [profile]);

  const impactPercent = results.currentMonthlySheet > 0
    ? (results.step2.scenarioA.monthlyCost / results.currentMonthlySheet) * 100
    : 0;

  // Chart data
  const chartData = useMemo(() => {
    const data = [
      {
        name: 'Atual (44h)',
        'Folha Atual': results.currentMonthlySheet,
        'Cenário A': results.currentMonthlySheet,
        'Cenário B': results.currentMonthlySheet,
        ...(results.step1.scenarioC ? { 'Cenário C': results.currentMonthlySheet } : {}),
      },
      {
        name: `Etapa 1 (${results.step1.weeklyHours}h)`,
        'Folha Atual': results.currentMonthlySheet,
        'Cenário A': results.currentMonthlySheet + results.step1.scenarioA.monthlyCost,
        'Cenário B': results.currentMonthlySheet + results.step1.scenarioB.monthlyCost,
        ...(results.step1.scenarioC ? { 'Cenário C': results.currentMonthlySheet + results.step1.scenarioC.monthlyCost } : {}),
      },
      {
        name: `Etapa 2 (${results.step2.weeklyHours}h)`,
        'Folha Atual': results.currentMonthlySheet,
        'Cenário A': results.currentMonthlySheet + results.step2.scenarioA.monthlyCost,
        'Cenário B': results.currentMonthlySheet + results.step2.scenarioB.monthlyCost,
        ...(results.step2.scenarioC ? { 'Cenário C': results.currentMonthlySheet + results.step2.scenarioC.monthlyCost } : {}),
      },
    ];
    return data;
  }, [results]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
    return `R$ ${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const hasEmployees = profile.employees44h > 0;

  if (!hasEmployees) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum empregado em 44h cadastrado</h3>
        <p className="text-slate-500">Preencha o perfil da empresa com ao menos 1 empregado na jornada 44h (escala 6x1) para ver a simulação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 border-l-4 border-l-blue-600">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Folha Mensal Atual</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(results.currentMonthlySheet)}</p>
          <p className="text-xs text-slate-500 mt-1">{results.totalEmployees} empregados</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 border-l-4 border-l-amber-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Horas Perdidas/Mês</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{formatHours(results.step2.hoursLostPerMonth)}</p>
          <p className="text-xs text-slate-500 mt-1">Na etapa final (40h)</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 border-l-4 border-l-red-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Custo Cenário A</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(results.step2.scenarioA.monthlyCost)}</p>
          <p className="text-xs text-slate-500 mt-1">Contratação ({formatNumber(results.step2.scenarioA.fteNeeded || 0, 1)} FTEs)</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 border-l-4 border-l-purple-600">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Impacto % na Folha</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{impactPercent.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">Cenário A — etapa final</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Comparativo por Etapa</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-2 font-semibold text-slate-600">Etapa</th>
              <th className="text-left py-3 px-2 font-semibold text-slate-600">Vigência</th>
              <th className="text-right py-3 px-2 font-semibold text-slate-600">Jornada</th>
              <th className="text-right py-3 px-2 font-semibold text-slate-600">Horas Perdidas/Mês</th>
              <th className="text-right py-3 px-2 font-semibold text-slate-600">
                <span className="flex items-center justify-end gap-1">
                  Cenário A
                  <button
                    className="w-4 h-4 bg-slate-100 text-slate-500 rounded-full text-xs flex items-center justify-center hover:bg-blue-100"
                    onMouseEnter={() => setShowTooltip('a')}
                    onMouseLeave={() => setShowTooltip(null)}
                    aria-label="Info Cenário A"
                  >?</button>
                </span>
              </th>
              <th className="text-right py-3 px-2 font-semibold text-slate-600">
                <span className="flex items-center justify-end gap-1">
                  Cenário B
                  <button
                    className="w-4 h-4 bg-slate-100 text-slate-500 rounded-full text-xs flex items-center justify-center hover:bg-blue-100"
                    onMouseEnter={() => setShowTooltip('b')}
                    onMouseLeave={() => setShowTooltip(null)}
                    aria-label="Info Cenário B"
                  >?</button>
                </span>
              </th>
              {profile.operates6Days && (
                <th className="text-right py-3 px-2 font-semibold text-slate-600">
                  <span className="flex items-center justify-end gap-1">
                    Cenário C
                    <button
                      className="w-4 h-4 bg-slate-100 text-slate-500 rounded-full text-xs flex items-center justify-center hover:bg-blue-100"
                      onMouseEnter={() => setShowTooltip('c')}
                      onMouseLeave={() => setShowTooltip(null)}
                      aria-label="Info Cenário C"
                    >?</button>
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {[results.step1, results.step2].map((step, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-2 font-medium text-slate-700">Etapa {i + 1}</td>
                <td className="py-3 px-2 text-slate-600">{step.date.split('-').reverse().join('/')}</td>
                <td className="py-3 px-2 text-right text-slate-700">{step.weeklyHours}h/sem</td>
                <td className="py-3 px-2 text-right text-slate-700">{formatHours(step.hoursLostPerMonth)}</td>
                <td className="py-3 px-2 text-right font-medium text-blue-700">{formatCurrency(step.scenarioA.monthlyCost)}</td>
                <td className="py-3 px-2 text-right font-medium text-amber-700">{formatCurrency(step.scenarioB.monthlyCost)}</td>
                {profile.operates6Days && step.scenarioC && (
                  <td className="py-3 px-2 text-right font-medium text-purple-700">{formatCurrency(step.scenarioC.monthlyCost)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tooltips */}
        {showTooltip === 'a' && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <strong>Cenário A — Contratar:</strong> Calcula quantos FTEs são necessários para cobrir as horas perdidas na nova jornada. Custo = FTEs × custo mensal por empregado.
          </div>
        )}
        {showTooltip === 'b' && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>Cenário B — Hora Extra:</strong> Custo das horas extras necessárias para manter a produção. Calculado com adicional de 50% sobre a hora normal + encargos.
          </div>
        )}
        {showTooltip === 'c' && (
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800">
            <strong>Cenário C — Redistribuir Escala:</strong> Para empresas que operam 6 dias/semana, manter a cobertura com equipe em escala 5x2 exige ~20% mais efetivo.
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Projeção da Folha por Cenário</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <ReferenceLine y={results.currentMonthlySheet} stroke="#64748b" strokeDasharray="5 5" label={{ value: 'Folha Atual', position: 'right', fontSize: 11 }} />
              <Bar dataKey="Folha Atual" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cenário A" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cenário B" fill="#d97706" radius={[4, 4, 0, 0]} />
              {profile.operates6Days && <Bar dataKey="Cenário C" fill="#7c3aed" radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annual Impact */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">💰 Impacto Anualizado — Etapa Final (40h)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-slate-300 uppercase tracking-wide">Cenário A (Contratar)</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(results.step2.scenarioA.annualCost)}</p>
            <p className="text-xs text-slate-400 mt-1">por ano</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-slate-300 uppercase tracking-wide">Cenário B (Hora Extra)</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(results.step2.scenarioB.annualCost)}</p>
            <p className="text-xs text-slate-400 mt-1">por ano</p>
          </div>
          {profile.operates6Days && results.step2.scenarioC && (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs text-slate-300 uppercase tracking-wide">Cenário C (Redistribuir)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(results.step2.scenarioC.annualCost)}</p>
              <p className="text-xs text-slate-400 mt-1">por ano</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
