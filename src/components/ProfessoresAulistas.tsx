import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../lib/format';

interface DSRCalculatorState {
  valorHoraAula: number;
  aulasPorSemana: number;
  duracaoAula: number;
  semanasLetivas: number;
  fatorAtual: number;
  fatorProjetado: number;
  numProfessores: number;
}

export default function ProfessoresAulistas() {
  const [calc, setCalc] = useState<DSRCalculatorState>({
    valorHoraAula: 50,
    aulasPorSemana: 24,
    duracaoAula: 50,
    semanasLetivas: 4.33,
    fatorAtual: 1/6,
    fatorProjetado: 2/5,
    numProfessores: 10,
  });

  const updateCalc = (field: keyof DSRCalculatorState, value: number) => {
    setCalc(prev => ({ ...prev, [field]: value }));
  };

  // Cálculos
  const calculations = useMemo(() => {
    const baseHorasAula = calc.valorHoraAula * calc.aulasPorSemana * calc.semanasLetivas;
    
    // Cenário atual
    const dsrAtual = baseHorasAula * calc.fatorAtual;
    const totalAtual = baseHorasAula + dsrAtual;
    
    // Cenário projetado
    const dsrProjetado = baseHorasAula * calc.fatorProjetado;
    const totalProjetado = baseHorasAula + dsrProjetado;
    
    // Deltas
    const deltaMensal = totalProjetado - totalAtual;
    const deltaPercentual = totalAtual > 0 ? (deltaMensal / totalAtual) * 100 : 0;
    const deltaAnualizado = deltaMensal * 12;
    
    // Horas de sala
    const horasSalaSemana = (calc.aulasPorSemana * calc.duracaoAula) / 60;
    const margem40h = 40 - horasSalaSemana;
    
    // Impacto no corpo docente
    const impactoMensal = deltaMensal * calc.numProfessores;
    const impactoAnual = impactoMensal * 12;
    
    // Três cenários para tabela comparativa
    const cenario1_6 = {
      nome: 'Fator 1/6 (regra vigente)',
      dsr: baseHorasAula * (1/6),
      total: baseHorasAula + (baseHorasAula * (1/6)),
      variacao: 0
    };
    
    const cenario2_5 = {
      nome: 'Fator 2/5 (leitura proporcional)',
      dsr: baseHorasAula * (2/5),
      total: baseHorasAula + (baseHorasAula * (2/5)),
      variacao: cenario1_6.total > 0 ? ((cenario1_6.total + (baseHorasAula * (2/5)) - cenario1_6.total) / cenario1_6.total) * 100 : 0
    };
    
    const cenario1_6_folga = {
      nome: 'Fator 1/6 com folga compensatória',
      dsr: baseHorasAula * (1/6),
      total: baseHorasAula + (baseHorasAula * (1/6)),
      variacao: 0
    };
    
    cenario2_5.variacao = cenario1_6.total > 0 ? ((cenario2_5.total - cenario1_6.total) / cenario1_6.total) * 100 : 0;
    
    return {
      baseHorasAula,
      dsrAtual,
      totalAtual,
      dsrProjetado,
      totalProjetado,
      deltaMensal,
      deltaPercentual,
      deltaAnualizado,
      horasSalaSemana,
      margem40h,
      impactoMensal,
      impactoAnual,
      cenarios: [cenario1_6, cenario2_5, cenario1_6_folga]
    };
  }, [calc]);

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  const chartData = calculations.cenarios.map(c => ({
    name: c.nome.split('(')[0].trim(),
    value: c.total
  }));

  return (
    <div className="space-y-6">
      {/* PARTE A - Conteúdo Informativo */}
      
      {/* Bloco 1 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">👨‍🏫</span>
          O professor aulista está alcançado pela emenda
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          O art. 2º da EC 141/2026 determina que a redução da jornada e a ampliação do repouso <strong>"aplicam-se aos contratos de trabalho em vigor"</strong>. O professor horista é empregado CLT, portanto está dentro. Não existe exclusão para professores.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mt-3">
          A única exclusão é o art. 8º: empregado portador de diploma de nível superior com remuneração mensal igual ou superior a <strong>2,5 vezes o limite máximo dos benefícios do RGPS (≈ R$ 21.188,87)</strong> — hipótese possível em parte do ensino superior privado, rara na educação básica. Nesse caso ficam afastadas as regras de duração e controle de jornada, salvo liberalidade do empregador ou previsão em acordo/convenção coletiva, sempre respeitado o repouso de 2 dias.
        </p>
      </div>

      {/* Bloco 2 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          O ponto crítico: o fator do DSR
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          O aulista recebe por hora-aula, com o DSR discriminado em separado no contracheque. Como a escala atual é 6x1, o adicional corresponde a <strong>1/6 do valor mensal das horas-aula</strong>. Com a escala 5x2, a proporção constitucional passa a ser 2 dias de descanso para 5 de trabalho, ou seja, <strong>fator 2/5</strong>.
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">Exemplo prático:</p>
          <p className="text-xs text-blue-800">
            Professor que fatura R$ 5.000 em horas-aula recebe hoje <strong>R$ 833,33 de DSR (1/6)</strong>, totalizando R$ 5.833,33. Com fator 2/5, o DSR sobe para <strong>R$ 2.000</strong> e o total para <strong>R$ 7.000</strong> — alta de 20%.
          </p>
        </div>
      </div>

      {/* Bloco 3 - Alerta */}
      <div className="bg-amber-50 rounded-xl shadow-lg p-6 border-2 border-amber-300">
        <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          O que a emenda não resolveu
        </h3>
        <p className="text-sm text-amber-900 leading-relaxed">
          A EC cria o direito aos 2 dias de repouso (art. 7º, XV), mas <strong>NÃO estabelece regra de cálculo do DSR para quem é pago por hora-aula ou por produção</strong>.
        </p>
        <p className="text-sm text-amber-900 leading-relaxed mt-3">
          O art. 3º determina que, decorridos 2 meses da publicação (~15/12/2026), ficam sem efeito as cláusulas de convenções e acordos coletivos sobre duração do trabalho e repouso semanal incompatíveis com a emenda — <strong>incluindo as que hoje sustentam o fator de 1/6</strong>.
        </p>
      </div>

      {/* Bloco 4 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔀</span>
          As três frentes de disputa
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Judiciário</h4>
            <p className="text-xs text-slate-700">
              A Confenen (Confederação Nacional dos Estabelecimentos de Ensino) avalia ação no STF. Advogados apontam que o debate sobre o divisor do DSR é infraconstitucional (está na CLT) e tende a terminar no TST.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Legislativo/Executivo</h4>
            <p className="text-xs text-slate-700">
              Especula-se lei, medida provisória ou decreto interpretando o cálculo. Limite: qualquer norma não pode suprimir o repouso semanal remunerado.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Negociação coletiva</h4>
            <p className="text-xs text-slate-700">
              Caminho mais prático. Duas saídas — manter o fator de 1/6 com um dos dias contado como folga compensatória, ou converter horistas em mensalistas.
            </p>
          </div>
        </div>
      </div>

      {/* Bloco 5 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Aulas não são horas
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          O limite é de <strong>8 horas diárias e 40 semanais de duração do trabalho normal</strong>: tempo efetivamente trabalhado, não número de aulas. Para o professor, a carga inclui hora-atividade (planejamento, correção, atendimento a famílias), definida em convenção coletiva ou contrato.
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">Exemplo:</p>
          <p className="text-xs text-blue-800">
            30 aulas de 50 minutos equivalem a <strong>25 horas de sala</strong>. O limite é por contrato — dois vínculos de 20h em escolas diferentes não infringem a regra.
          </p>
        </div>
      </div>

      {/* Bloco 6 - Dimensão do Setor */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Dimensão no setor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Vínculos formais</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">1,4 milhão</p>
            <p className="text-xs text-blue-700 mt-1">935,3 mil professores (Fenep)</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Acima de 40h</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">28,9%</p>
            <p className="text-xs text-amber-700 mt-1">Professores vs 63,4% demais</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide">Sem alterar DSR</p>
            <p className="text-2xl font-bold text-red-900 mt-1">+9%</p>
            <p className="text-xs text-red-700 mt-1">≈ R$ 9,3 bilhões/ano</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Com 2º dia DSR</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">+17%</p>
            <p className="text-xs text-purple-700 mt-1">≈ R$ 17,3 bilhões/ano</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Escolas básica privada</p>
            <p className="text-2xl font-bold text-green-900 mt-1">43 mil</p>
            <p className="text-xs text-green-700 mt-1">65,3% têm até 200 alunos</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-700 font-medium uppercase tracking-wide">Impacto mensalidades</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">8-11%</p>
            <p className="text-xs text-slate-700 mt-1">Reajuste estimado em 2027</p>
          </div>
        </div>
      </div>

      {/* Bloco 7 - Aviso de Incerteza */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl shadow-lg p-6 border-2 border-slate-400">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🔍</span>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Aviso de incerteza técnica</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Não existe jurisprudência ou norma publicada definindo o divisor do DSR do horista sob a EC 141.</strong> A leitura proporcional 2/5 é a tese defendida pelas entidades patronais, não uma regra positivada. Trabalhe com cenários, não com número fechado.
            </p>
            <p className="text-xs text-slate-600 mt-3 italic">
              Fontes: EC 141/2026 (Planalto e DOU de 16/10/2026, edição extra); O Globo, 21/10/2026, "Fim da escala 6x1 nas escolas vai afetar de professor horista a funcionários de apoio".
            </p>
          </div>
        </div>
      </div>

      {/* PARTE B - Calculadora de DSR */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-300">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          Calculadora de DSR para Professor Horista
        </h3>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valor da hora-aula (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={calc.valorHoraAula}
              onChange={(e) => updateCalc('valorHoraAula', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Aulas por semana
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={calc.aulasPorSemana}
              onChange={(e) => updateCalc('aulasPorSemana', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duração da aula (minutos)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={calc.duracaoAula}
              onChange={(e) => updateCalc('duracaoAula', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Semanas letivas por mês
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={calc.semanasLetivas}
              onChange={(e) => updateCalc('semanasLetivas', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fator de DSR atual
            </label>
            <select
              value={calc.fatorAtual === 1/6 ? '1/6' : 'custom'}
              onChange={(e) => {
                if (e.target.value === '1/6') {
                  updateCalc('fatorAtual', 1/6);
                } else {
                  const custom = parseFloat(prompt('Digite o fator personalizado (ex: 0.2):') || '0.2');
                  if (!isNaN(custom) && custom > 0) {
                    updateCalc('fatorAtual', custom);
                  }
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="1/6">1/6 (6x1, regra vigente)</option>
              <option value="custom">Personalizado</option>
            </select>
            {calc.fatorAtual !== 1/6 && (
              <p className="text-xs text-slate-500 mt-1">Fator personalizado: {(calc.fatorAtual * 100).toFixed(2)}%</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fator de DSR projetado
            </label>
            <select
              value={calc.fatorProjetado === 2/5 ? '2/5' : calc.fatorProjetado === 1/6 ? '1/6' : 'custom'}
              onChange={(e) => {
                if (e.target.value === '2/5') {
                  updateCalc('fatorProjetado', 2/5);
                } else if (e.target.value === '1/6') {
                  updateCalc('fatorProjetado', 1/6);
                } else {
                  const custom = parseFloat(prompt('Digite o fator personalizado (ex: 0.4):') || '0.4');
                  if (!isNaN(custom) && custom > 0) {
                    updateCalc('fatorProjetado', custom);
                  }
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="2/5">2/5 (5x2, leitura proporcional)</option>
              <option value="1/6">1/6 mantido com folga compensatória</option>
              <option value="custom">Personalizado</option>
            </select>
            {calc.fatorProjetado !== 2/5 && calc.fatorProjetado !== 1/6 && (
              <p className="text-xs text-slate-500 mt-1">Fator personalizado: {(calc.fatorProjetado * 100).toFixed(2)}%</p>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número de professores horistas
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={calc.numProfessores}
              onChange={(e) => updateCalc('numProfessores', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Cards de resultado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Total atual</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(calculations.totalAtual)}</p>
            <p className="text-xs text-slate-500 mt-1">Base + DSR ({(calc.fatorAtual * 100).toFixed(1)}%)</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Total projetado</p>
            <p className="text-xl font-bold text-emerald-900 mt-1">{formatCurrency(calculations.totalProjetado)}</p>
            <p className="text-xs text-emerald-600 mt-1">Base + DSR ({(calc.fatorProjetado * 100).toFixed(1)}%)</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Delta mensal</p>
            <p className="text-xl font-bold text-amber-900 mt-1">{formatCurrency(calculations.deltaMensal)}</p>
            <p className="text-xs text-amber-600 mt-1">{calculations.deltaPercentual.toFixed(2)}%</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide">Delta anualizado</p>
            <p className="text-xl font-bold text-red-900 mt-1">{formatCurrency(calculations.deltaAnualizado)}</p>
            <p className="text-xs text-red-600 mt-1">por professor</p>
          </div>
        </div>

        {/* Horas de sala e margem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Horas de sala por semana</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{calculations.horasSalaSemana.toFixed(1)}h</p>
            <p className="text-xs text-blue-600 mt-1">{calc.aulasPorSemana} aulas × {calc.duracaoAula} min</p>
          </div>

          <div className={`rounded-lg p-4 border-2 ${
            calculations.margem40h < 0 ? 'bg-red-50 border-red-400' :
            calculations.margem40h < 5 ? 'bg-amber-50 border-amber-400' :
            'bg-green-50 border-green-200'
          }`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${
              calculations.margem40h < 0 ? 'text-red-700' :
              calculations.margem40h < 5 ? 'text-amber-700' :
              'text-green-700'
            }`}>Margem até 40h</p>
            <p className={`text-2xl font-bold mt-1 ${
              calculations.margem40h < 0 ? 'text-red-900' :
              calculations.margem40h < 5 ? 'text-amber-900' :
              'text-green-900'
            }`}>{calculations.margem40h.toFixed(1)}h</p>
            {calculations.margem40h < 0 && (
              <p className="text-xs text-red-700 mt-1 font-semibold">⚠️ Acima do limite de 40h!</p>
            )}
            {calculations.margem40h >= 0 && calculations.margem40h < 5 && (
              <p className="text-xs text-amber-700 mt-1 font-semibold">⚠️ Margem inferior a 5h</p>
            )}
          </div>
        </div>

        {/* Impacto no corpo docente */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 mb-6">
          <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Impacto no corpo docente ({calc.numProfessores} horistas)</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-purple-600">Mensal</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(calculations.impactoMensal)}</p>
            </div>
            <div>
              <p className="text-sm text-purple-600">Anual</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(calculations.impactoAnual)}</p>
            </div>
          </div>
        </div>

        {/* Tabela comparativa */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Comparativo dos 3 cenários</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-2 px-3 font-semibold text-slate-700">Cenário</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-700">DSR mensal</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-700">Total mensal</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-700">Variação</th>
                </tr>
              </thead>
              <tbody>
                {calculations.cenarios.map((cenario, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-800">{cenario.nome}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatCurrency(cenario.dsr)}</td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-800">{formatCurrency(cenario.total)}</td>
                    <td className="py-3 px-3 text-right">
                      {cenario.variacao === 0 ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <span className={`font-semibold ${cenario.variacao > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {cenario.variacao > 0 ? '+' : ''}{cenario.variacao.toFixed(2)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">
            Nota: esta tabela compara os três cenários fixos independentemente dos campos "fator atual/projetado" acima, para servir de apoio à reunião com o cliente.
          </p>
        </div>

        {/* Gráfico */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Comparativo visual</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
