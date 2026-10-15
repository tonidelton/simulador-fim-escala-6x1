import { useState, useEffect } from 'react';
import type { CompanyProfile } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  profile: CompanyProfile;
  onChange: (profile: CompanyProfile) => void;
}

const SECTORS = ['Comércio', 'Alimentação', 'Serviços', 'Indústria', 'Saúde', 'Transporte', 'Outro'];

export default function CompanyForm({ profile, onChange }: Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    // Ensure profile is initialized
  }, []);

  const update = (field: keyof CompanyProfile, value: string | number | boolean) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
        Perfil da Empresa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ex: Empresa XYZ Ltda"
          />
        </div>

        {/* Setor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
          <select
            value={profile.sector}
            onChange={(e) => update('sector', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Data promulgação */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data Estimada de Promulgação
          </label>
          <input
            type="date"
            value={profile.promulgationDate}
            onChange={(e) => update('promulgationDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Empregados 44h */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Empregados em 44h (escala 6x1)
          </label>
          <input
            type="number"
            min={0}
            value={profile.employees44h}
            onChange={(e) => update('employees44h', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Empregados ≤40h */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Empregados já em ≤ 40h
          </label>
          <input
            type="number"
            min={0}
            value={profile.employees40hOrLess}
            onChange={(e) => update('employees40hOrLess', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Empregados 12x36 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Empregados em escala 12x36
          </label>
          <input
            type="number"
            min={0}
            value={profile.employees12x36}
            onChange={(e) => update('employees12x36', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Salário médio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Salário Médio (R$)
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={profile.avgSalary}
            onChange={(e) => update('avgSalary', Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Encargos */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            Encargos e Provisões (%)
            <button
              type="button"
              className="w-4 h-4 bg-slate-200 text-slate-600 rounded-full text-xs flex items-center justify-center hover:bg-blue-100"
              onMouseEnter={() => setShowTooltip('encargos')}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => setShowTooltip(showTooltip === 'encargos' ? null : 'encargos')}
              aria-label="Informações sobre encargos"
            >
              ?
            </button>
          </label>
          {showTooltip === 'encargos' && (
            <div className="absolute z-10 bottom-full mb-2 left-0 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-lg max-w-xs">
              Inclui FGTS, INSS, férias, 13º, aviso prévio, etc. No Simples Nacional, o INSS patronal é recolhido no DAS — ajuste para um valor menor (ex: 30-40%).
              <div className="absolute top-full left-4 w-2 h-2 bg-slate-800 rotate-45 -mt-1"></div>
            </div>
          )}
          <input
            type="range"
            min={0}
            max={120}
            step={1}
            value={profile.chargesPercent}
            onChange={(e) => update('chargesPercent', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-right text-sm font-semibold text-blue-700 mt-1">{profile.chargesPercent}%</div>
        </div>

        {/* Horas extras */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Horas Extras Atuais (h/semana por empregado)
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={profile.overtimeHoursPerWeek}
            onChange={(e) => update('overtimeHoursPerWeek', Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Opera 6 dias */}
        <div className="md:col-span-2 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <input
            type="checkbox"
            id="operates6days"
            checked={profile.operates6Days}
            onChange={(e) => update('operates6Days', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="operates6days" className="text-sm font-medium text-slate-700">
            Opera 6 dias por semana
            <span className="text-xs text-slate-500 ml-2">(Habilita o Cenário C — redistribuição de escala)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function createDefaultProfile(): CompanyProfile {
  return {
    id: uuidv4(),
    name: '',
    sector: 'Serviços',
    employees44h: 0,
    employees40hOrLess: 0,
    employees12x36: 0,
    avgSalary: 3000,
    chargesPercent: 70,
    overtimeHoursPerWeek: 0,
    operates6Days: false,
    promulgationDate: '2026-11-15',
  };
}
