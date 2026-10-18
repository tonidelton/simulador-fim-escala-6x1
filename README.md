# Simulador de Impacto — Fim da Escala 6x1 (EC 141/2026)

## 📋 Sobre

Aplicativo web desenvolvido pela **OSL Contadores Associados** para auxiliar empresas na avaliação do impacto financeiro e operacional da redução da jornada de trabalho de 44h para 40h semanais, conforme a **Emenda Constitucional 141/2026**.

## ✅ Status Legal

A **EC 141/2026** foi **promulgada e publicada** em edição extra do Diário Oficial da União em **16/10/2026**. A contagem dos prazos já começou.

*Nota histórica: a emenda originou-se da PEC 221/2019, que absorveu a PEC 8/2025.*

## 🎯 Funcionalidades

### 1. Resumo da EC 141/2026
- Visão geral da legislação
- Explicação das etapas de transição
- Exceções e regras especiais
- Alertas sobre PLP 201/2026 (MEI/micro/pequenas) e PLP 186/2026
- Informações de contato da OSL

### 2. Simulação Interativa
- Cadastro do perfil da empresa
- Campo especial: "Presta serviço à administração pública" (posterga Etapa 1 para +12 meses)
- Cálculo automático de impactos
- Comparação de 3 cenários:
  - **Cenário A**: Contratação de novos funcionários
  - **Cenário B**: Horas extras
  - **Cenário C**: Redistribuição de escala (apenas para empresas que operam 6 dias/semana)
- Dashboard com KPIs, gráficos e projeções
- Recálculo instantâneo ao alterar parâmetros

### 3. Cronograma Legal
- Datas fixas e definitivas a partir da publicação (16/10/2026):
  - **Etapa 1**: 15/12/2026 (+60 dias) — 42h semanais
  - **Etapa 2**: 16/12/2027 (+14 meses) — 40h semanais (escala 5x2)
- Para terceirizados da administração pública: Etapa 1 postergada para 16/10/2027 (+12 meses)
- Alertas sobre prazos importantes

### 4. Plano de Ação
- Checklist interativo de implementação
- Persistência por empresa
- Pontos de atenção jurídica
- Categorias: Diagnóstico, Negociação, Operacional, Jurídico, Consultoria
- Alerta específico sobre cláusulas coletivas perdem validade em 15/12/2026
- Acompanhamento do PLP 201/2026

### 5. Histórico e Exportação
- Salvamento de simulações no localStorage
- Exportação em CSV (compatível com Excel pt-BR)
- Impressão/PDF via navegador

## 📅 Cronograma da Transição

### Publicação
- **16/10/2026** — EC 141/2026 promulgada e publicada no DOU (edição extra)

### Etapa 1 — 42h semanais
- **15/12/2026** (+60 dias) — Empresas em geral
- **16/10/2027** (+12 meses) — Terceirizados da administração pública
- RSR de 2 dias (um preferencialmente aos domingos)
- Cláusulas coletivas de jornada incompatíveis perdem validade

### Etapa 2 — 40h semanais (escala 5x2)
- **16/12/2027** (+14 meses) — Fim da transição

## 🚀 Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`

### Testes

```bash
npm test
```

## 📱 Contato

**OSL Contadores Associados**
- WhatsApp: +55 (35) 8871-1176
- Link direto: https://wa.me/553588711176

## 🛠️ Stack Tecnológica

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Recharts** (gráficos)
- **date-fns** (manipulação de datas)
- **localStorage** (persistência local)

## 📊 Motor de Cálculo

O sistema calcula automaticamente:

1. **Horas mensais médias** = jornada semanal × (30/7)
2. **Custo mensal por empregado** = salário × (1 + encargos/100)
3. **Horas perdidas/mês** = empregados_44h × (44 - jornada_alvo) × (30/7)

### Cenários

**Cenário A (Contratação)**
- FTE necessários = horas_perdidas ÷ horas_mensais_nova_jornada
- Custo = FTE × custo_mensal_por_empregado

**Cenário B (Hora Extra)**
- Custo = horas_perdidas × (salário ÷ horas_mensais) × 1.5 × (1 + encargos/100)

**Cenário C (Redistribuição)**
- Apenas para empresas que operam 6 dias/semana
- Custo = empregados_44h × 20% × custo_mensal_por_empregado

## ⚠️ Aviso Legal

Os valores apresentados são **estimativas para planejamento**. Não consideram:
- Desonerações específicas
- Ganhos de produtividade
- Remuneração variável

A simulação apoia a consultoria, mas **não substitui análise jurídica caso a caso**.

## 📄 Base Legal

### Emenda Constitucional 141/2026
- **Promulgada e publicada**: 16/10/2026 (DOU edição extra)
- Reduz jornada máxima de 44h para 40h semanais
- Sem redução salarial

### Etapas de Transição

1. **Etapa 1**: +60 dias da publicação → 42h semanais
   - RSR de 2 dias (um preferencialmente aos domingos)
   - Cláusulas coletivas incompatíveis perdem validade
   
2. **Etapa 2**: +14 meses da publicação → 40h semanais
   - Escala 5x2
   - Fim da transição

### Exceções

- **MEI, micro e pequenas empresas**: regras transitórias em lei complementar (PLP 201/2026 em tramitação)
- **Escala 12x36 e atividades essenciais**: regimes diferenciados por lei ordinária
- **Empregados com diploma superior + salário > 2,5× teto INSS**: fora das regras de controle de jornada
- **Empregados públicos**: não alcançados
- **Terceirizados da administração pública**: Etapa 1 postergada para +12 meses

### Legislação Complementar em Tramitação

- **PLP 201/2026**: em tramitação no Senado — pode criar regras transitórias para MEI/micro/pequenas empresas
- **PLP 186/2026**: aprovado — limite do MEI para R$ 140 mil em 2028, perdão de dívidas até 13/10/2026, até 2 empregados. Remetido à sanção presidencial em 16/10/2026, prazo de sanção/veto até 06/11/2026.

## 🎨 Design

- Layout responsivo (mobile-first)
- Interface profissional (tons azul/verde escuro)
- Acessível (labels, contraste, navegação por teclado)
- Tooltips explicativos
- Estados vazios amigáveis

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── CompanyForm.tsx
│   ├── Dashboard.tsx
│   ├── Timeline.tsx
│   ├── ActionPlan.tsx
│   ├── History.tsx
│   └── LegalInfo.tsx
├── lib/                 # Lógica de negócio
│   ├── types.ts
│   ├── calculations.ts  # Constante DATA_PUBLICACAO_EC = 2026-10-16
│   ├── format.ts
│   └── storage.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔒 Privacidade

- Todos os dados são armazenados localmente no navegador (localStorage)
- Nenhum dado é enviado para servidores externos
- O aplicativo funciona 100% offline após o carregamento inicial

## 📝 Licença

Desenvolvido pela OSL Contadores Associados para uso em consultoria tributária e trabalhista.

---

**© 2026 OSL Contadores Associados**
