import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/format';

// Constantes normativas
const ETAPAS = {
  0: { nome: 'Etapa 0 (44h)', limiteSemanal: 44, limiteDiario: 8, vigencia: 'até 15/12/2026' },
  1: { nome: 'Etapa 1 (42h)', limiteSemanal: 42, limiteDiario: 8, vigencia: '16/12/2026 a 15/12/2027' },
  2: { nome: 'Etapa 2 (40h)', limiteSemanal: 40, limiteDiario: 8, vigencia: 'a partir de 16/12/2027' },
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Templates pré-carregados
const TEMPLATES = {
  T1: {
    nome: 'T1 — 5x2 rígido',
    descricao: 'Seg a sex 8h, sáb e dom folga. Total 40h, 2 repousos.',
    horas: [0, 8, 8, 8, 8, 8, 0],
    diagnostico: 'Conforme nas Etapas 1 e 2; na Etapa 0 fica abaixo de 44h (sem redução proporcional, mantém os 2 repousos pelo inciso XV).',
  },
  T2: {
    nome: 'T2 — 6 dias com compensação de repouso',
    descricao: 'Seg a sáb 7h, dom folga, alternando semanas de 1 e 3 dias de repouso. Total 42h.',
    horas: [0, 7, 7, 7, 7, 7, 7],
    diagnostico: 'Conforme na Etapa 1 SÓ com cláusula do § 2º e média mensal de 2 dias; não conforme na Etapa 2 (42h > 40h).',
  },
  T3: {
    nome: 'T3 — 5x2 com sábado alternado',
    descricao: 'Seg a sex 8h + 8h em um sábado a cada duas semanas. Média 44h.',
    horas: [0, 8, 8, 8, 8, 8, 4],
    diagnostico: 'Não conforme em todas as etapas (excede 42h e 40h).',
  },
  T4: {
    nome: 'T4 — 12x36',
    descricao: 'Plantão de 12h alternado com 36h de descanso. Média de 42h em 15 plantões por mês.',
    horas: [12, 0, 12, 0, 12, 0, 6],
    diagnostico: 'Conforme na Etapa 1 com instrumento coletivo; não conforme na Etapa 2 — exigirá folga adicional por mês (14 plantões, média 39,2h) ou plantão de menor duração.',
  },
};

// Quadro normativo
const QUADRO_NORMATIVO = [
  { dispositivo: 'art. 7º, XIII, CF', conteudo: '8h diárias e 40h semanais, com compensação por instrumento coletivo', consequencia: 'Limite básico de jornada; compensação via ACT/CCT' },
  { dispositivo: 'art. 7º, XV, CF', conteudo: '2 dias de repouso semanal remunerado, um preferencialmente aos domingos', consequencia: 'Garantia constitucional de 2 repousos' },
  { dispositivo: 'art. 7º, § 2º, CF', conteudo: 'Regime compensatório de repouso, média mensal', consequencia: 'Flexibiliza concessão, não remuneração' },
  { dispositivo: 'art. 7º, § 3º, CF', conteudo: 'Lei disporá sobre regimes diferenciados', consequencia: '12x36 e atividades essenciais' },
  { dispositivo: 'art. 3º da EC', conteudo: 'Queda das cláusulas coletivas incompatíveis em 16/12/2026', consequencia: 'Revisão obrigatória de convenções' },
  { dispositivo: 'art. 7º da EC', conteudo: 'Ampliação da jornada diária na janela de 12 meses', consequencia: 'Até 8h24 na Etapa 1 com ACT/CCT' },
  { dispositivo: 'art. 2º da EC', conteudo: 'Irredutibilidade salarial', consequencia: 'Sem redução de salário' },
  { dispositivo: 'Súmula 172 do TST', conteudo: 'Reflexo das horas extras habituais no repouso', consequencia: 'HE impacta cálculo do DSR' },
];

// Funções auxiliares
function formatHoras(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}h${minutos.toString().padStart(2, '0')}`;
}

function parseHoras(valor: string): number {
  const num = parseFloat(valor);
  return isNaN(num) ? 0 : Math.max(0, num);
}

interface EscalaState {
  etapa: 0 | 1 | 2;
  possuiACT: boolean;
  possuiRegimeCompensatorio: boolean;
  nome: string;
  horas: number[];
}

interface Validacao {
  tipo: 'sucesso' | 'alerta' | 'erro';
  mensagem: string;
  dispositivo?: string;
}

export default function EscalasCompensacao() {
  const [escala, setEscala] = useState<EscalaState>({
    etapa: 1,
    possuiACT: false,
    possuiRegimeCompensatorio: false,
    nome: 'Minha escala',
    horas: [0, 8, 8, 8, 8, 8, 0], // 5x2 padrão
  });

  // Parte C - Regime compensatório
  const [semanasRepouso, setSemanasRepouso] = useState<number[]>([2, 2, 2, 2]);
  const [compensarPagamento, setCompensarPagamento] = useState(false);

  // Parte D - Comparativo de custo
  const [desenhos, setDesenhos] = useState([
    { nome: 'Desenho atual', horas: escala.horas, valorHora: 20, encargos: 70, semanasMes: 4.33 },
    { nome: 'Alternativo 1', horas: [0, 8, 8, 8, 8, 8, 0], valorHora: 20, encargos: 70, semanasMes: 4.33 },
    { nome: 'Alternativo 2', horas: [0, 7, 7, 7, 7, 7, 7], valorHora: 20, encargos: 70, semanasMes: 4.33 },
  ]);

  const updateHora = (dia: number, valor: string) => {
    const novasHoras = [...escala.horas];
    novasHoras[dia] = parseHoras(valor);
    setEscala({ ...escala, horas: novasHoras });
  };

  const carregarTemplate = (key: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[key];
    setEscala({ ...escala, horas: template.horas, nome: template.nome });
  };

  // Cálculos da escala
  const calculosEscala = useMemo(() => {
    const totalSemanal = escala.horas.reduce((acc, h) => acc + h, 0);
    const diasTrabalhados = escala.horas.filter(h => h > 0).length;
    const diasRepouso = 7 - diasTrabalhados;
    const mediaDiaria = diasTrabalhados > 0 ? totalSemanal / diasTrabalhados : 0;
    
    return {
      totalSemanal,
      totalFormatado: formatHoras(totalSemanal),
      diasTrabalhados,
      diasRepouso,
      mediaDiaria,
      mediaFormatada: formatHoras(mediaDiaria),
    };
  }, [escala.horas]);

  // Validação constitucional (Parte B)
  const validacoes = useMemo((): Validacao[] => {
    const validacoes: Validacao[] = [];
    const etapaConfig = ETAPAS[escala.etapa];
    const limiteDiario = escala.etapa === 1 && escala.possuiACT ? 8.4 : 8;

    // a) Carga semanal
    if (calculosEscala.totalSemanal > etapaConfig.limiteSemanal) {
      const excedente = calculosEscala.totalSemanal - etapaConfig.limiteSemanal;
      validacoes.push({
        tipo: 'erro',
        mensagem: `Carga semanal de ${calculosEscala.totalFormatado} excede o limite de ${etapaConfig.limiteSemanal}h da ${etapaConfig.nome}. Excedente: ${formatHoras(excedente)}.`,
        dispositivo: 'art. 7º, XIII, CF',
      });
    }

    // b) Jornada diária
    escala.horas.forEach((horas, idx) => {
      if (horas > limiteDiario) {
        const excedente = horas - limiteDiario;
        validacoes.push({
          tipo: 'erro',
          mensagem: `${DIAS_SEMANA[idx]}: jornada de ${formatHoras(horas)} excede o limite diário de ${formatHoras(limiteDiario)}. Excedente: ${formatHoras(excedente)}.`,
          dispositivo: escala.etapa === 1 && !escala.possuiACT ? 'art. 7º da EC 141/2026 — requer ACT/CCT para 8h24' : 'art. 7º, XIII, CF',
        });
      }
    });

    // c) Dias de repouso
    if (calculosEscala.diasRepouso < 2) {
      if (escala.possuiRegimeCompensatorio) {
        validacoes.push({
          tipo: 'alerta',
          mensagem: `Apenas ${calculosEscala.diasRepouso} dia(s) de repouso na semana. Pendente de validação mensal (regime compensatório § 2º).`,
          dispositivo: 'art. 7º, § 2º, CF',
        });
      } else {
        validacoes.push({
          tipo: 'erro',
          mensagem: `Apenas ${calculosEscala.diasRepouso} dia(s) de repouso na semana. Mínimo de 2 dias exigido.`,
          dispositivo: 'art. 7º, XV, CF',
        });
      }
    }

    // d) Repouso zero
    if (calculosEscala.diasRepouso === 0) {
      validacoes.push({
        tipo: 'erro',
        mensagem: 'Semana sem nenhum dia de repouso. Violação grave — § 2º não permite semana sem folga em nenhuma hipótese.',
        dispositivo: 'art. 7º, § 2º, CF',
      });
    }

    // Se tudo ok
    if (validacoes.length === 0) {
      validacoes.push({
        tipo: 'sucesso',
        mensagem: 'Escala em conformidade com a legislação.',
      });
    }

    return validacoes;
  }, [escala, calculosEscala]);

  // Validador do regime compensatório (Parte C)
  const validacaoRegime = useMemo(() => {
    const totalRepouso = semanasRepouso.reduce((acc, s) => acc + s, 0);
    const numSemanas = semanasRepouso.length;
    const mediaSemanal = numSemanas > 0 ? totalRepouso / numSemanas : 0;
    const minimoAbsoluto = 2 * numSemanas;

    const validacoes: Validacao[] = [];

    // Validação 1: nenhuma semana pode ter 0
    semanasRepouso.forEach((repouso, idx) => {
      if (repouso === 0) {
        validacoes.push({
          tipo: 'erro',
          mensagem: `Semana ${idx + 1} sem nenhum dia de repouso. Violação — § 2º não permite semana sem folga.`,
          dispositivo: 'art. 7º, § 2º, CF',
        });
      }
    });

    // Validação 2: intervalo entre repousos não pode exceder 7 dias
    // Simplificação: se há semana com 0, já foi capturado acima

    // Validação 3: compensar com pagamento
    if (compensarPagamento) {
      validacoes.push({
        tipo: 'erro',
        mensagem: 'O repouso não concedido NÃO pode ser substituído por pagamento. A compensação organiza o calendário; não reduz o acréscimo de 20% na folha do horista.',
        dispositivo: 'art. 7º, "b", Lei 605/1949',
      });
    }

    // Verificar média
    if (mediaSemanal < 2) {
      validacoes.push({
        tipo: 'erro',
        mensagem: `Média semanal de ${mediaSemanal.toFixed(2)} dias de repouso. Exigência: média ≥ 2,0.`,
        dispositivo: 'art. 7º, § 2º, CF',
      });
    }

    if (validacoes.length === 0) {
      validacoes.push({
        tipo: 'sucesso',
        mensagem: `Regime compensatório conforme. Média semanal: ${mediaSemanal.toFixed(2)} dias.`,
      });
    }

    return {
      totalRepouso,
      numSemanas,
      mediaSemanal,
      minimoAbsoluto,
      validacoes,
    };
  }, [semanasRepouso, compensarPagamento]);

  // Comparativo de custo (Parte D)
  const comparativoCusto = useMemo(() => {
    const etapaConfig = ETAPAS[escala.etapa];
    const limiteDiario = escala.etapa === 1 && escala.possuiACT ? 8.4 : 8;

    return desenhos.map(desenho => {
      const totalSemanal = desenho.horas.reduce((acc, h) => acc + h, 0);
      const diasTrabalhados = desenho.horas.filter(h => h > 0).length;
      const diasRepouso = 7 - diasTrabalhados;

      // Horas excedentes semanais
      const excedenteSemanal = Math.max(0, totalSemanal - etapaConfig.limiteSemanal);

      // Horas excedentes diárias
      const excedenteDiario = desenho.horas.reduce((acc, h) => acc + Math.max(0, h - limiteDiario), 0);

      // Horas a pagar como extra (máximo, não soma)
      const horasExtraSemana = Math.max(excedenteSemanal, excedenteDiario);

      // Custo de HE mensal
      const horasExtraMes = horasExtraSemana * desenho.semanasMes;
      const custoBaseHE = horasExtraMes * desenho.valorHora;
      const custoHE50 = custoBaseHE * 1.5;
      const custoHE100 = custoBaseHE * 2;
      const custoHEComEncargos50 = custoHE50 * (1 + desenho.encargos / 100);
      const custoHEComEncargos100 = custoHE100 * (1 + desenho.encargos / 100);

      // Reflexo no repouso (Súmula 172)
      const valorHE1Repouso = diasTrabalhados > 0 ? (custoHE50 / diasTrabalhados) * 1 : 0;
      const valorHE2Repousos = diasTrabalhados > 0 ? (custoHE50 / diasTrabalhados) * diasRepouso : 0;

      return {
        nome: desenho.nome,
        totalSemanal,
        diasTrabalhados,
        diasRepouso,
        horasExtraSemana,
        horasExtraMes,
        custoHEComEncargos50,
        custoHEComEncargos100,
        valorHE1Repouso,
        valorHE2Repousos,
        variacaoRepouso: valorHE1Repouso > 0 ? ((valorHE2Repousos - valorHE1Repouso) / valorHE1Repouso) * 100 : 0,
      };
    });
  }, [desenhos, escala.etapa, escala.possuiACT]);

  const statusBadge = useMemo(() => {
    const temErro = validacoes.some(v => v.tipo === 'erro');
    const temAlerta = validacoes.some(v => v.tipo === 'alerta');

    if (temErro) {
      return { cor: 'red', texto: 'Não conforme', icone: '❌' };
    } else if (temAlerta) {
      return { cor: 'amber', texto: 'Conforme com ressalva', icone: '⚠️' };
    } else {
      return { cor: 'green', texto: 'Conforme', icone: '✅' };
    }
  }, [validacoes]);

  return (
    <div className="space-y-6">
      {/* Cards explicativos dos 3 mecanismos */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Os Três Mecanismos de Compensação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">1. Compensação de Horários</h4>
            <p className="text-xs text-blue-800">
              <strong>art. 7º, XIII, CF:</strong> Prorrogar em um dia e reduzir em outro, sem adicional, mediante acordo ou convenção coletiva. Não autoriza ultrapassar o limite semanal da etapa.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 text-sm mb-2">2. Ampliação da Jornada Diária</h4>
            <p className="text-xs text-amber-800">
              <strong>art. 7º da EC 141/2026:</strong> SÓ entre 16/12/2026 e 15/12/2027, ACT/CCT podem elevar a jornada diária para 8h24. Sem instrumento, aplica-se 8h/dia.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 text-sm mb-2">3. Regime Compensatório de Repouso</h4>
            <p className="text-xs text-purple-800">
              <strong>§ 2º do art. 7º, CF:</strong> ACT/CCT podem assegurar, na média, 2 dias de repouso DENTRO DO MÊS-CALENDÁRIO, garantido pelo menos 1 dia por semana.
            </p>
          </div>
        </div>
      </div>

      {/* Distinção obrigatória */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-indigo-300">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">⚖️</span>
          <div>
            <h4 className="font-bold text-indigo-900 mb-2">Distinção Obrigatória</h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              O § 2º flexibiliza a <strong>CONCESSÃO</strong> do descanso, não a <strong>REMUNERAÇÃO</strong>. Para o horista, os dois repousos continuam pagos pela jornada normal diária (art. 7º, "b", Lei 605/1949). A compensação organiza o calendário; <strong>não reduz o acréscimo de 20% na folha do horista</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Limites intransponíveis */}
      <div className="bg-red-50 rounded-xl shadow-lg p-6 border-2 border-red-300">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🚫</span>
          <div>
            <h4 className="font-bold text-red-900 mb-2">Limites Intransponíveis</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Irredutibilidade salarial (art. 2º)</li>
              <li>• Repouso pode ser redistribuído, jamais suprimido</li>
              <li>• Intervalo interjornada de 11h e intrajornada preservados</li>
              <li>• Feriados devidos além dos 2 repousos</li>
              <li>• Cláusulas coletivas incompatíveis perdem efeito em 16/12/2026 (art. 3º)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PARTE A - Editor de Escala Semanal */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Parte A — Editor de Escala Semanal
        </h3>

        {/* Controles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Etapa vigente</label>
            <select
              value={escala.etapa}
              onChange={(e) => setEscala({ ...escala, etapa: parseInt(e.target.value) as 0 | 1 | 2 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Etapa 0 (44h)</option>
              <option value={1}>Etapa 1 (42h)</option>
              <option value={2}>Etapa 2 (40h)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="possuiACT"
              checked={escala.possuiACT}
              onChange={(e) => setEscala({ ...escala, possuiACT: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="possuiACT" className="text-sm text-slate-700">
              Possui ACT/CCT vigente
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="possuiRegime"
              checked={escala.possuiRegimeCompensatorio}
              onChange={(e) => setEscala({ ...escala, possuiRegimeCompensatorio: e.target.checked })}
              className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="possuiRegime" className="text-sm text-slate-700">
              Regime compensatório (§ 2º)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do desenho</label>
            <input
              type="text"
              value={escala.nome}
              onChange={(e) => setEscala({ ...escala, nome: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Grade semanal */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {DIAS_SEMANA.map((dia, idx) => (
            <div key={dia} className="text-center">
              <label className="block text-xs font-medium text-slate-600 mb-1">{dia}</label>
              <input
                type="number"
                min={0}
                max={24}
                step={0.1}
                value={escala.horas[idx]}
                onChange={(e) => updateHora(idx, e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-slate-500 mt-1">{formatHoras(escala.horas[idx])}</div>
            </div>
          ))}
        </div>

        {/* Resumo ao lado */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium">Total semanal</p>
            <p className="text-xl font-bold text-slate-800">{calculosEscala.totalFormatado}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium">Dias trabalhados</p>
            <p className="text-xl font-bold text-slate-800">{calculosEscala.diasTrabalhados}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium">Dias de repouso</p>
            <p className="text-xl font-bold text-slate-800">{calculosEscala.diasRepouso}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium">Média diária</p>
            <p className="text-xl font-bold text-slate-800">{calculosEscala.mediaFormatada}</p>
          </div>
          <div className={`rounded-lg p-3 border-2 ${
            statusBadge.cor === 'green' ? 'bg-green-50 border-green-400' :
            statusBadge.cor === 'amber' ? 'bg-amber-50 border-amber-400' :
            'bg-red-50 border-red-400'
          }`}>
            <p className="text-xs font-medium">Status</p>
            <p className="text-lg font-bold flex items-center gap-1">
              <span>{statusBadge.icone}</span>
              <span>{statusBadge.texto}</span>
            </p>
          </div>
        </div>
      </div>

      {/* PARTE B - Validador Constitucional */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          Parte B — Validador Constitucional
        </h3>

        <div className="space-y-3">
          {validacoes.map((v, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${
                v.tipo === 'sucesso' ? 'bg-green-50 border-green-300' :
                v.tipo === 'alerta' ? 'bg-amber-50 border-amber-300' :
                'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">
                  {v.tipo === 'sucesso' ? '✅' : v.tipo === 'alerta' ? '⚠️' : '❌'}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    v.tipo === 'sucesso' ? 'text-green-900' :
                    v.tipo === 'alerta' ? 'text-amber-900' :
                    'text-red-900'
                  }`}>
                    {v.mensagem}
                  </p>
                  {v.dispositivo && (
                    <p className="text-xs text-slate-600 mt-1 italic">{v.dispositivo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTE C - Validador do Regime Compensatório */}
      {escala.possuiRegimeCompensatorio && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Parte C — Validador do Regime Compensatório de Repouso
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {semanasRepouso.map((repouso, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Semana {idx + 1}
                </label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={repouso}
                  onChange={(e) => {
                    const novas = [...semanasRepouso];
                    novas[idx] = Math.max(0, Math.min(7, parseInt(e.target.value) || 0));
                    setSemanasRepouso(novas);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-slate-500 mt-1">dias de repouso</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="compensarPagamento"
              checked={compensarPagamento}
              onChange={(e) => setCompensarPagamento(e.target.checked)}
              className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
            />
            <label htmlFor="compensarPagamento" className="text-sm text-slate-700">
              Compensar com pagamento (NÃO PERMITIDO)
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Total de repousos</p>
              <p className="text-xl font-bold text-slate-800">{validacaoRegime.totalRepouso}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Número de semanas</p>
              <p className="text-xl font-bold text-slate-800">{validacaoRegime.numSemanas}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Média semanal</p>
              <p className="text-xl font-bold text-slate-800">{validacaoRegime.mediaSemanal.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Mínimo absoluto</p>
              <p className="text-xl font-bold text-slate-800">{validacaoRegime.minimoAbsoluto}</p>
            </div>
          </div>

          <div className="space-y-3">
            {validacaoRegime.validacoes.map((v, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  v.tipo === 'sucesso' ? 'bg-green-50 border-green-300' :
                  v.tipo === 'alerta' ? 'bg-amber-50 border-amber-300' :
                  'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">
                    {v.tipo === 'sucesso' ? '✅' : v.tipo === 'alerta' ? '⚠️' : '❌'}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      v.tipo === 'sucesso' ? 'text-green-900' :
                      v.tipo === 'alerta' ? 'text-amber-900' :
                      'text-red-900'
                    }`}>
                      {v.mensagem}
                    </p>
                    {v.dispositivo && (
                      <p className="text-xs text-slate-600 mt-1 italic">{v.dispositivo}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTE D - Comparativo de Custo */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Parte D — Comparativo de Custo
        </h3>

        <div className="space-y-4 mb-6">
          {desenhos.map((desenho, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nome</label>
                  <input
                    type="text"
                    value={desenho.nome}
                    onChange={(e) => {
                      const novos = [...desenhos];
                      novos[idx] = { ...desenho, nome: e.target.value };
                      setDesenhos(novos);
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Valor hora (R$)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={desenho.valorHora}
                    onChange={(e) => {
                      const novos = [...desenhos];
                      novos[idx] = { ...desenho, valorHora: parseFloat(e.target.value) || 0 };
                      setDesenhos(novos);
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Encargos (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={desenho.encargos}
                    onChange={(e) => {
                      const novos = [...desenhos];
                      novos[idx] = { ...desenho, encargos: parseFloat(e.target.value) || 0 };
                      setDesenhos(novos);
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Semanas/mês</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={desenho.semanasMes}
                    onChange={(e) => {
                      const novos = [...desenhos];
                      novos[idx] = { ...desenho, semanasMes: parseFloat(e.target.value) || 0 };
                      setDesenhos(novos);
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards de resultado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {comparativoCusto.map((custo, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">{custo.nome}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">HE semanal:</span>
                  <span className="font-semibold">{formatHoras(custo.horasExtraSemana)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">HE mensal:</span>
                  <span className="font-semibold">{formatHoras(custo.horasExtraMes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Custo HE (50%):</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(custo.custoHEComEncargos50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Custo HE (100%):</span>
                  <span className="font-semibold text-red-700">{formatCurrency(custo.custoHEComEncargos100)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reflexo 1 repouso:</span>
                    <span className="font-semibold">{formatCurrency(custo.valorHE1Repouso)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reflexo 2 repousos:</span>
                    <span className="font-semibold text-purple-700">{formatCurrency(custo.valorHE2Repousos)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Variação:</span>
                    <span className="font-bold text-purple-700">+{custo.variacaoRepouso.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativoCusto.map(c => ({ nome: c.nome, 'HE 50%': c.custoHEComEncargos50, 'HE 100%': c.custoHEComEncargos100 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="HE 50%" fill="#3b82f6" />
              <Bar dataKey="HE 100%" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PARTE E - Biblioteca de Templates */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Parte E — Biblioteca de Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <div key={key} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition">
              <h4 className="font-semibold text-slate-800 text-sm mb-2">{template.nome}</h4>
              <p className="text-xs text-slate-600 mb-3">{template.descricao}</p>
              <button
                onClick={() => carregarTemplate(key as keyof typeof TEMPLATES)}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Carregar template
              </button>
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Diagnóstico:</strong> {template.diagnostico}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTE F - Quadro Normativo */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Parte F — Quadro Normativo
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Dispositivo</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Conteúdo</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Consequência Prática</th>
              </tr>
            </thead>
            <tbody>
              {QUADRO_NORMATIVO.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium text-slate-800">{item.dispositivo}</td>
                  <td className="py-3 px-3 text-slate-700">{item.conteudo}</td>
                  <td className="py-3 px-3 text-slate-600">{item.consequencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
