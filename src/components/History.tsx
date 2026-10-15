import { useMemo } from 'react';
import type { SimulationResult } from '../lib/types';
import { getSimulations, deleteSimulation, exportToCSV } from '../lib/storage';
import { formatCurrency } from '../lib/format';

interface Props {
  onSave: () => void;
  onLoad: (result: SimulationResult) => void;
  currentResult: SimulationResult | null;
}

export default function History({ onSave, onLoad, currentResult }: Props) {
  const simulations = useMemo(() => getSimulations(), []);

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta simulação?')) {
      deleteSimulation(id);
      window.location.reload();
    }
  };

  const handleExport = () => {
    if (simulations.length === 0) {
      alert('Nenhuma simulação salva para exportar.');
      return;
    }
    exportToCSV(simulations);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Ações</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onSave}
            disabled={!currentResult}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <span>💾</span> Salvar Simulação Atual
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
          >
            <span>📊</span> Exportar CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition flex items-center gap-2"
          >
            <span>🖨️</span> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Simulações Salvas</h3>
        
        {simulations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-slate-500">Nenhuma simulação salva ainda.</p>
            <p className="text-xs text-slate-400 mt-1">Configure os parâmetros e clique em "Salvar Simulação".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {simulations.map((sim) => (
              <div
                key={sim.profile.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{sim.profile.name || 'Sem nome'}</h4>
                    <p className="text-xs text-slate-500">
                      {sim.profile.sector} • {sim.profile.employees44h} emp. 44h • Salário médio: {formatCurrency(sim.profile.avgSalary)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Salva em: {new Date(sim.savedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoad(sim)}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => handleDelete(sim.profile.id)}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-500">Folha atual:</span>
                    <span className="font-semibold text-slate-700 ml-1">{formatCurrency(sim.currentMonthlySheet)}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-500">Cen. A (anual):</span>
                    <span className="font-semibold text-blue-700 ml-1">{formatCurrency(sim.step2.scenarioA.annualCost)}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-500">Cen. B (anual):</span>
                    <span className="font-semibold text-amber-700 ml-1">{formatCurrency(sim.step2.scenarioB.annualCost)}</span>
                  </div>
                  {sim.step2.scenarioC && (
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-slate-500">Cen. C (anual):</span>
                      <span className="font-semibold text-purple-700 ml-1">{formatCurrency(sim.step2.scenarioC.annualCost)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
