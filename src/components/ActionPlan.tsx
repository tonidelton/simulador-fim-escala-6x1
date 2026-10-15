import { useState, useEffect } from 'react';

interface Props {
  companyId: string;
}

const CHECKLIST_ITEMS = [
  { id: 'map', text: 'Mapear quadro de empregados (6x1, 5x2, 12x36, teletrabalho)', category: 'Diagnóstico' },
  { id: 'conv', text: 'Levantar convenção/acordo coletivo vigente', category: 'Diagnóstico' },
  { id: 'neg', text: 'Negociar acordo de transição na janela 42h→40h', category: 'Negociação' },
  { id: 'esc', text: 'Reprojetar escalas de trabalho para formato 5x2', category: 'Operacional' },
  { id: 'he', text: 'Revisar política de horas extras e banco de horas', category: 'Operacional' },
  { id: 'sup', text: 'Avaliar exceção de empregados com diploma superior (salário > 2,5× teto INSS)', category: 'Jurídico' },
  { id: 'mei', text: 'Acompanhar lei complementar para MEI/micro/pequena empresa', category: 'Jurídico' },
  { id: 'apres', text: 'Apresentar simulação de impacto ao cliente', category: 'Consultoria' },
];

const LEGAL_POINTS = [
  { title: 'Sem redução salarial', desc: 'A redução de jornada não permite qualquer redução salarial — nominal, proporcional ou de qualquer espécie, inclusive pisos salariais.' },
  { title: 'Escala 12x36', desc: 'Regime diferenciado por lei ordinária, com compensação de repouso via acordo coletivo (média mensal).' },
  { title: 'Terceirizados da administração pública', desc: 'Transição via aditamento contratual.' },
  { title: 'Empregados públicos', desc: 'Não alcançados pelas novas regras de jornada.' },
  { title: 'PEC 12/2026', desc: 'Monitorar tramitação — pode trazer alterações complementares.' },
  { title: 'Diploma superior + salário elevado', desc: 'Empregado com diploma de curso superior e salário acima de 2,5× teto do INSS (≈R$ 21.188,87) fica fora das regras de duração e controle de jornada, por liberalidade do empregador ou acordo coletivo. Mantido o repouso de 2 dias.' },
];

export default function ActionPlan({ companyId }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem(`action_plan_${companyId}`);
    if (stored) {
      setChecked(JSON.parse(stored));
    }
  }, [companyId]);

  const toggle = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem(`action_plan_${companyId}`, JSON.stringify(updated));
  };

  const categories = [...new Set(CHECKLIST_ITEMS.map((item) => item.category))];
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = (completedCount / CHECKLIST_ITEMS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-800">Plano de Ação</h3>
          <span className="text-sm font-medium text-slate-500">{completedCount}/{CHECKLIST_ITEMS.length} itens</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Checklist de Implementação</h3>
        
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 border-b border-slate-100 pb-2">
              {category}
            </h4>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.filter((item) => item.category === category).map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                    checked[item.id] ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="w-5 h-5 mt-0.5 text-green-600 border-slate-300 rounded focus:ring-green-500 flex-shrink-0"
                  />
                  <span className={`text-sm ${checked[item.id] ? 'text-green-800 line-through' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legal Points */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>⚖️</span> Pontos de Atenção Jurídicos
        </h3>
        <div className="space-y-3">
          {LEGAL_POINTS.map((point, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-800 text-sm">{point.title}</p>
              <p className="text-xs text-slate-600 mt-1">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
