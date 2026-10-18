import { useMemo } from 'react';
import type { CompanyProfile } from '../lib/types';
import { generateTimeline } from '../lib/calculations';

interface Props {
  profile: CompanyProfile;
}

export default function Timeline({ profile }: Props) {
  const events = useMemo(() => generateTimeline(profile.publicService), [profile.publicService]);

  return (
    <div className="space-y-6">
      {/* Alert */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">✅</span>
        <div>
          <p className="font-semibold text-emerald-800 text-sm">EC 141/2026 — Promulgada e Publicada</p>
          <p className="text-xs text-emerald-700 mt-1">
            A Emenda Constitucional 141/2026 foi promulgada e publicada em edição extra do Diário Oficial da União em <strong>16/10/2026</strong>. 
            A contagem dos prazos já começou. As datas abaixo são <strong>fixas e definitivas</strong>.
          </p>
        </div>
      </div>

      {profile.publicService && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">🏛️</span>
          <div>
            <p className="font-semibold text-indigo-800 text-sm">Empresa Prestadora de Serviço à Administração Pública</p>
            <p className="text-xs text-indigo-700 mt-1">
              Para terceirizados da administração pública, a Etapa 1 (42h) é postergada para <strong>+12 meses da publicação (16/10/2027)</strong>, 
              condicionada ao aditamento do contrato. A Etapa 2 (40h) permanece em 16/12/2027.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Cronograma Legal da Transição</h3>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>

          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-amber-500' : 'bg-red-600'
                }`}>
                  <span className="text-white text-lg">{index === 0 ? '📜' : index === 1 ? '📋' : '🎯'}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="font-bold text-slate-800">{event.label}</h4>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-600">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Prazos Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-semibold text-blue-800 text-sm">Cláusulas Coletivas</p>
            <p className="text-xs text-blue-700 mt-1">
              Cláusulas coletivas sobre jornada incompatíveis com o novo patamar perdem validade em <strong>15/12/2026</strong> (Etapa 1).
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="font-semibold text-green-800 text-sm">Janela de Transição 42h→40h</p>
            <p className="text-xs text-green-700 mt-1">
              Na janela entre a Etapa 1 e a Etapa 2, acordo ou convenção coletiva pode ampliar a jornada diária acima de 8h para viabilizar a transição.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="font-semibold text-purple-800 text-sm">Sem Redução Salarial</p>
            <p className="text-xs text-purple-700 mt-1">
              A redução de jornada é <strong>SEM qualquer redução salarial</strong> (nominal, proporcional ou de qualquer espécie), inclusive nos pisos salariais.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="font-semibold text-amber-800 text-sm">RSR de 2 Dias</p>
            <p className="text-xs text-amber-700 mt-1">
              A partir da Etapa 1, o repouso semanal remunerado será de 2 dias, sendo um <strong>preferencialmente aos domingos</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
