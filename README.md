# Simulador de Impacto — Fim da Escala 6x1

## 📋 Sobre

Aplicativo web desenvolvido pela **OSL Contadores Associados** para auxiliar empresas na avaliação do impacto financeiro e operacional da redução da jornada de trabalho de 44h para 40h semanais, conforme a PEC 221/2019.

## 🎯 Funcionalidades

### 1. Resumo da PEC
- Visão geral da legislação
- Explicação das etapas de transição
- Exceções e regras especiais
- Informações de contato da OSL

### 2. Simulação Interativa
- Cadastro do perfil da empresa
- Cálculo automático de impactos
- Comparação de 3 cenários:
  - **Cenário A**: Contratação de novos funcionários
  - **Cenário B**: Horas extras
  - **Cenário C**: Redistribuição de escala (apenas para empresas que operam 6 dias/semana)
- Dashboard com KPIs, gráficos e projeções
- Recálculo instantâneo ao alterar parâmetros

### 3. Cronograma Legal
- Datas calculadas automaticamente
- Etapa 1: +60 dias após promulgação (42h)
- Etapa 2: +14 meses após promulgação (40h)
- Alertas sobre prazos importantes

### 4. Plano de Ação
- Checklist interativo de implementação
- Persistência por empresa
- Pontos de atenção jurídica
- Categorias: Diagnóstico, Negociação, Operacional, Jurídico, Consultoria

### 5. Histórico e Exportação
- Salvamento de simulações no localStorage
- Exportação em CSV (compatível com Excel pt-BR)
- Impressão/PDF via navegador

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

- **PEC 221/2019** (absorveu a PEC 8/2025)
- Aprovada pela Câmara em 27/05/2026
- Aprovada pelo Senado em 14/10/2026
- Aguardando promulgação

### Etapas de Transição

1. **Etapa 1**: 60 dias após promulgação → 42h semanais
   - RSR de 2 dias (um preferencialmente aos domingos)
   
2. **Etapa 2**: 14 meses após promulgação → 40h semanais
   - Fim da transição

### Exceções

- MEI, micro e pequenas empresas: regras transitórias em lei complementar
- Escala 12x36 e atividades essenciais: regimes diferenciados
- Empregados com diploma superior + salário > 2,5× teto INSS: fora das regras de controle de jornada
- Empregados públicos: não alcançados

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
│   ├── calculations.ts
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
