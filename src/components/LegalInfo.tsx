export default function LegalInfo() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📜</span> Resumo da PEC — Fim da Escala 6x1
        </h3>
        <div className="prose prose-sm max-w-none text-slate-700">
          <p>
            A <strong>PEC 221/2019</strong> (que absorveu a PEC 8/2025) foi aprovada pela Câmara dos Deputados em <strong>27/05/2026</strong> e pelo Senado Federal em <strong>14/10/2026</strong>, aguardando promulgação.
          </p>
          <p className="mt-3">
            A proposta reduz a jornada máxima semanal de <strong>44h para 40h</strong>, em duas etapas, sem qualquer redução salarial.
          </p>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Principais Pontos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span className="font-semibold text-blue-800 text-sm">Jornada Atual</span>
            </div>
            <p className="text-xs text-blue-700">44h semanais — escala 6x1 (6 dias de trabalho, 1 de descanso)</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span className="font-semibold text-amber-800 text-sm">Etapa 1 — 42h semanais</span>
            </div>
            <p className="text-xs text-amber-700">60 dias após promulgação. RSR de 2 dias (um preferencialmente aos domingos).</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span className="font-semibold text-red-800 text-sm">Etapa 2 — 40h semanais</span>
            </div>
            <p className="text-xs text-red-700">14 meses após promulgação. Fim da transição.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span className="font-semibold text-green-800 text-sm">Sem Redução Salarial</span>
            </div>
            <p className="text-xs text-green-700">A redução é SEM qualquer redução salarial — nominal, proporcional ou de qualquer espécie, inclusive pisos.</p>
          </div>
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>⚠️</span> Exceções e Regras Especiais
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span className="text-lg">🏪</span> MEI, Micro e Pequenas Empresas
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              Regras transitórias serão definidas em <strong>lei complementar futura</strong>, condicionadas à manutenção do emprego.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span className="text-lg">🏥</span> Escala 12x36 e Atividades Essenciais
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              Saúde, segurança, transporte e limpeza urbana terão <strong>regimes diferenciados por lei ordinária</strong>, com compensação de repouso via acordo coletivo (média mensal).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span className="text-lg">🎓</span> Empregados com Diploma Superior + Salário Elevado
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              Empregado com diploma de curso superior e salário acima de <strong>2,5× o teto do INSS (≈ R$ 21.188,87)</strong>: fora das regras de duração e controle de jornada (por liberalidade do empregador ou acordo coletivo). Mantido o repouso de 2 dias.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span className="text-lg">🏛️</span> Empregados Públicos e Terceirizados
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              <strong>Empregados públicos:</strong> não alcançados pelas novas regras.<br />
              <strong>Terceirizados da administração pública:</strong> transição via aditamento contratual.
            </p>
          </div>
        </div>
      </div>

      {/* Transition Window */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Janela de Transição</h3>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-800">
            Na janela de <strong>1 ano entre 42h e 40h</strong> (da Etapa 1 à Etapa 2), acordo ou convenção coletiva pode ampliar a jornada diária acima de 8h para viabilizar a transição.
          </p>
          <p className="text-xs text-indigo-600 mt-2">
            Cláusulas coletivas sobre jornada incompatíveis com o novo patamar perdem validade <strong>2 meses após a promulgação</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
