export default function LegalInfo() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📜</span> Resumo da EC 141/2026 — Fim da Escala 6x1
        </h3>
        <div className="prose prose-sm max-w-none text-slate-700">
          <p>
            A <strong>Emenda Constitucional 141/2026</strong> foi <strong>promulgada e publicada</strong> em edição extra do Diário Oficial da União em <strong>16/10/2026</strong>.
          </p>
          <p className="mt-2 text-xs text-slate-500 italic">
            Nota histórica: a emenda originou-se da PEC 221/2019, que absorveu a PEC 8/2025.
          </p>
          <p className="mt-3">
            A emenda reduz a jornada máxima semanal de <strong>44h para 40h</strong>, em duas etapas, sem qualquer redução salarial. A contagem dos prazos já começou.
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
              <span className="font-semibold text-blue-800 text-sm">Publicação</span>
            </div>
            <p className="text-xs text-blue-700">EC 141/2026 promulgada e publicada em 16/10/2026. Início da contagem dos prazos.</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span className="font-semibold text-amber-800 text-sm">Etapa 1 — 42h semanais (15/12/2026)</span>
            </div>
            <p className="text-xs text-amber-700">+60 dias da publicação. RSR de 2 dias (um preferencialmente aos domingos). Cláusulas coletivas incompatíveis perdem validade.</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span className="font-semibold text-red-800 text-sm">Etapa 2 — 40h semanais (16/12/2027)</span>
            </div>
            <p className="text-xs text-red-700">+14 meses da publicação. Escala 5x2. Fim da transição.</p>
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
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <span>🚨</span> PLP 201/2026 em tramitação no Senado
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Pode criar regras transitórias de mitigação para MEIs, micro e pequenas empresas, condicionadas à manutenção do emprego.
              </p>
            </div>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-semibold flex items-center gap-1">
                <span>📋</span> PLP 186/2026 aprovado
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Limite do MEI para R$ 140 mil em 2028, perdão de dívidas até 13/10/2026, até 2 empregados. Remetido à sanção presidencial em 16/10/2026, prazo de sanção/veto até 06/11/2026.
              </p>
            </div>
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
              <strong>Empregados públicos:</strong> não alcançados pela emenda.<br />
              <strong>Terceirizados da administração pública:</strong> transição condicionada ao aditamento do contrato. Etapa 1 postergada para +12 meses (16/10/2027).
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 text-sm flex items-center gap-2">
              <span className="text-lg">✅</span> Quem já trabalha ≤ 40h (5x2, 40h, 36h)
            </h4>
            <p className="text-xs text-green-700 mt-2">
              <strong>Sem redução de carga horária.</strong> A partir da Etapa 1, passa a ter garantia dos <strong>2 dias de repouso semanal remunerado</strong> (um preferencialmente aos domingos).
            </p>
          </div>
        </div>
      </div>

      {/* Transition Window */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Janela de Transição</h3>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-800">
            Na janela entre a Etapa 1 (15/12/2026) e a Etapa 2 (16/12/2027), acordo ou convenção coletiva pode ampliar a jornada diária acima de 8h para viabilizar a transição.
          </p>
          <p className="text-xs text-indigo-600 mt-2">
            Cláusulas coletivas sobre jornada incompatíveis com o novo patamar perdem validade em <strong>15/12/2026</strong>.
          </p>
        </div>
      </div>

      {/* OSL Branding / Contact */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-900 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-1">Uma iniciativa</p>
            <h3 className="text-xl font-bold">OSL Contadores Associados</h3>
            <p className="text-sm text-slate-300 mt-2">
              Consultoria especializada para apoiar sua empresa na adaptação à nova legislação trabalhista.
            </p>
          </div>
          <a
            href="https://wa.me/553588711176"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale Conosco
          </a>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-slate-300 flex items-center gap-2">
            <span>📱</span>
            <a href="https://wa.me/553588711176" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
              +55 (35) 8871-1176
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
