import { useMemo } from 'react';
import type { CompanyProfile } from '../lib/types';
import { generateTimeline } from '../lib/calculations';

interface Props {
  profile: CompanyProfile;
}

export default function Timeline({ profile }: Props) {
  const events = useMemo(() => generateTimeline(profile.promulgationDate), [profile.promulgationDate]);

  return (
    <div className="space-y-6">
      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm">Datas estimadas</p>
          <p className="text-xs text-amber-700 mt-1">
            As datas abaixo são calculadas a partir da data de promulgação informada ({profile.promulgationDate.split('-').reverse().join('/')}). 
            A data real dependerá da publicação oficial. Ajuste a data no perfil da empresa conforme necessário.
          </p>
        </div>
      </div>

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
              Cláusulas coletivas sobre jornada incompatíveis com o novo patamar perdem validade <strong>2 meses após a promulgação</strong>.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="font-semibold text-green-800 text-sm">Janela de Transição 42h→40h</p>
            <p className="text-xs text-green-700 mt-1">
              Na janela de 1 ano entre 42h e 40h, acordo ou convenção coletiva pode ampliar a jornada diária acima de 8h para viabilizar a transição.
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
