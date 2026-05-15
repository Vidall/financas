# Sistema Web de Controle Financeiro — Especificação Completa

## Contexto do projeto

Preciso de um sistema web completo de controle financeiro pessoal, baseado na estrutura que já uso em planilhas Excel mensais. Cada mês tem uma guia chamada "plano" com entradas, contas fixas, gastos variáveis, reservas e metas. O sistema precisa ser bonito, funcional e seguir rigorosamente os padrões de DDD (Domain-Driven Design).

---

## Arquitetura geral — DDD com monorepo

O projeto é dividido em **três pacotes independentes** dentro de um monorepo:

```
financas-web/
├── core/          ← domínio puro: entidades, VOs, regras de negócio, interfaces
├── backend/       ← Nest.js: infraestrutura, API, banco de dados (depende do core)
├── frontend/      ← Next.js: interface, componentes, páginas (depende do core)
└── package.json   ← root do monorepo (npm workspaces ou pnpm workspaces)
```

### Por que esse modelo?

- O `core` é a fonte de verdade do sistema. Ele não conhece framework algum — nem Next, nem Nest, nem Prisma.
- O `backend` e o `frontend` importam do `core` as entidades, Value Objects e contratos (interfaces de repositório, casos de uso, etc.).
- Isso garante que as regras de negócio nunca fiquem espalhadas entre camadas.

---

## Pacote `core` — domínio da aplicação

Este é o coração do sistema. Tudo que define **o que o sistema faz** (e não como) fica aqui.

### Estrutura interna

```
core/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Entrada.ts
│   │   │   ├── ContaFixa.ts
│   │   │   ├── GastoVariavel.ts
│   │   │   ├── Meta.ts
│   │   │   ├── PlanoMensal.ts
│   │   │   ├── Reservas.ts
│   │   │   └── Usuario.ts
│   │   ├── value-objects/
│   │   │   ├── Dinheiro.ts         ← VO com validação de valor monetário (não negativo, arredondamento)
│   │   │   ├── Periodo.ts          ← VO representando mês + ano
│   │   │   ├── StatusPagamento.ts  ← enum rico: Pendente | Concluído | Atrasado
│   │   │   ├── CategoriaDespesa.ts ← VO com nome e ícone
│   │   │   └── Email.ts            ← VO com validação de formato
│   │   ├── aggregates/
│   │   │   └── PlanoMensalAggregate.ts  ← raiz do agregado: coordena entradas, contas, gastos, metas
│   │   └── events/
│   │       ├── ContaPagaEvent.ts
│   │       ├── MetaAtualizadaEvent.ts
│   │       └── GastoExcedidoEvent.ts
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── CriarPlanoMensal.ts
│   │   │   ├── RegistrarEntrada.ts
│   │   │   ├── PagarConta.ts
│   │   │   ├── LancarGasto.ts
│   │   │   ├── AtualizarMeta.ts
│   │   │   └── ObterResumoDashboard.ts
│   │   ├── ports/                  ← interfaces de repositório (abstrações puras)
│   │   │   ├── IPlanoMensalRepository.ts
│   │   │   ├── IEntradaRepository.ts
│   │   │   ├── IContaFixaRepository.ts
│   │   │   ├── IGastoVariavelRepository.ts
│   │   │   ├── IMetaRepository.ts
│   │   │   └── IUsuarioRepository.ts
│   │   └── dtos/                   ← objetos de transferência usados entre camadas
│   │       ├── ResumoDashboardDTO.ts
│   │       ├── EntradaDTO.ts
│   │       └── ...
│   └── index.ts                    ← exporta tudo publicamente
├── package.json
└── tsconfig.json
```

### Regras de negócio que vivem no core (exemplos)

- `Dinheiro` não pode ser negativo
- `PlanoMensal` calcula automaticamente sobra (entradas - saídas) e percentual comprometido do salário
- `Meta` calcula automaticamente: percentual atingido, valor restante, meses estimados para completar
- `GastoVariavel` emite evento `GastoExcedidoEvent` quando o valor real supera o planejado
- `ContaFixa` muda status para `Atrasado` automaticamente quando a data de vencimento passa sem pagamento
- `StatusPagamento` é um Value Object rico, não um simples string — possui método `isAtrasado()`, `isConcluido()`, etc.

### Como modelar o domínio a partir do JSON

Use o arquivo `financas_maio_2026.json` (disponível na pasta .spec/docs) como fonte para extrair:
- Os campos de cada entidade (ex: `ContaFixa` tem nome, planejado, real, dataPago, status, observação)
- As categorias de `GastoVariavel` se tornam o VO `CategoriaDespesa`
- Os tipos de `Meta` (Reserva / Meta) se tornam um enum rico no domínio
- O objeto `comprometimento_salario` vira um método calculado dentro do `PlanoMensalAggregate`
- O objeto `carteira` vira uma entidade `ContaBancaria` com banco e saldo

**Não use o JSON para popular banco de dados.** Use-o apenas para derivar o modelo de domínio.

---

## Pacote `backend` — Nest.js

Camada de infraestrutura e API. Depende do `core` via workspace (`@financas/core`).

### Responsabilidades

- Implementar os repositórios definidos no `core/application/ports/`
- Expor os casos de uso via controllers HTTP (REST)
- Gerenciar banco de dados com Prisma + PostgreSQL
- Autenticação JWT (Guard do Nest)
- Validação de entrada com `class-validator` + `class-transformer`

### Estrutura interna

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── plano-mensal/
│   │   │   ├── plano-mensal.module.ts
│   │   │   ├── plano-mensal.controller.ts
│   │   │   ├── plano-mensal.service.ts          ← orquestra casos de uso do core
│   │   │   └── plano-mensal.repository.ts       ← implementa IPlanoMensalRepository
│   │   ├── entradas/
│   │   ├── contas-fixas/
│   │   ├── gastos-variaveis/
│   │   └── metas/
│   ├── infrastructure/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts
│   │   │   └── schema.prisma                    ← reflete as entidades do core
│   │   └── mappers/                             ← converte entidade de domínio ↔ modelo do Prisma
│   └── main.ts
├── package.json
└── tsconfig.json
```

### Autenticação

- POST `/auth/register` — cria usuário (bcrypt na senha)
- POST `/auth/login` — retorna access token (JWT) + refresh token (httpOnly cookie)
- POST `/auth/refresh` — renova o access token
- POST `/auth/logout`
- Todos os endpoints protegidos com `JwtAuthGuard`

### Endpoints principais

```
GET    /plano/:mes/:ano           → resumo do mês (dashboard)
POST   /plano                     → criar plano para um mês
GET    /entradas/:planoId
POST   /entradas
PATCH  /entradas/:id
DELETE /entradas/:id
GET    /contas-fixas/:planoId
POST   /contas-fixas
PATCH  /contas-fixas/:id/pagar    → marca como paga, registra data e valor real
GET    /gastos-variaveis/:planoId
POST   /gastos-variaveis
PATCH  /gastos-variaveis/:id
GET    /metas/:planoId
POST   /metas
PATCH  /metas/:id/atualizar       → atualiza total guardado
GET    /categorias
POST   /categorias                → cria categoria personalizada (nome + ícone)
```

---

## Pacote `frontend` — Next.js

Camada de apresentação. Depende do `core` via workspace (`@financas/core`) para usar DTOs, enums e tipos — nunca regras de negócio diretamente.

### Responsabilidades

- Renderizar o dashboard e todos os módulos
- Consumir a API do backend via `fetch` ou `axios`
- Gerenciar estado com Zustand ou React Query
- Autenticação via token JWT no header + refresh automático

### Estrutura interna

```
frontend/
├── src/
│   ├── app/                        ← App Router do Next.js 14+
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          ← sidebar + header
│   │   │   ├── page.tsx            ← dashboard principal
│   │   │   ├── entradas/page.tsx
│   │   │   ├── contas/page.tsx
│   │   │   ├── gastos/page.tsx
│   │   │   └── metas/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                     ← primitivos: Card, Badge, Button, Input, Modal
│   │   ├── charts/                 ← Donut, Barras, Pizza (Recharts)
│   │   ├── dashboard/              ← cards de resumo, barra de comprometimento
│   │   ├── entradas/
│   │   ├── contas-fixas/
│   │   ├── gastos-variaveis/
│   │   └── metas/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePlanoMensal.ts
│   │   └── useDashboard.ts
│   ├── services/
│   │   └── api.ts                  ← cliente HTTP centralizado
│   └── styles/
│       └── globals.css
├── package.json
└── tsconfig.json
```

---

## Visual e identidade

- Estilo inspirado no layout do Claude (anthropic.com): limpo, minimalista, tipografia moderna, sem excesso de elementos
- Paleta: fundo escuro (preto ou cinza muito escuro), detalhes em neon — ciano (#00f5ff), verde-elétrico (#39ff14), roxo-neon (#bf00ff) e branco
- Bordas finas com glow sutil nos cards e botões
- Traços simples: sem gradientes pesados, sem sombras excessivas — só brilho nos elementos de destaque
- Fonte sans-serif moderna (ex: Inter ou Geist)
- Ícones minimalistas (Lucide)
- Transições suaves e responsivo (mobile-first)

### Cores exatas

```ts
// tailwind.config.ts
colors: {
  background: '#0a0a0f',
  surface:    '#111118',
  border:     '#1e1e2e',
  'neon-cyan':   '#00f5ff',
  'neon-green':  '#39ff14',
  'neon-purple': '#bf00ff',
  'neon-orange': '#ff6600',
  text:   '#e2e8f0',
  muted:  '#64748b',
}
```

---

## Stack completa

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 14+ (App Router) + TypeScript   |
| Estilização| Tailwind CSS dark mode + glow CSS       |
| Gráficos   | Recharts                                |
| Backend    | Nest.js + TypeScript                    |
| ORM        | Prisma                                  |
| Banco      | PostgreSQL (local: SQLite p/ dev)       |
| Auth       | JWT + bcrypt + httpOnly cookie          |
| Monorepo   | pnpm workspaces                         |
| Deploy     | Hostinger VPS (backend + banco + front) |

---

## Funcionalidades obrigatórias

### 1. Autenticação
- Tela de login com e-mail e senha
- Registro de novo usuário
- Proteção de rotas (somente logado acessa o sistema)
- Logout com invalidação do refresh token
- Dados completamente isolados por usuário

### 2. Dashboard principal
- Cards de resumo no topo: entradas (planejado vs real), saídas (planejado vs real), sobra do mês, saldo na carteira
- Barra de progresso de comprometimento do salário
- Gráfico de rosca (donut): distribuição das despesas por categoria
- Gráfico de barras: planejado vs real por categoria
- Lista rápida: últimas contas pagas com data e valor
- Indicador de metas: barra de progresso para cada meta ativa

### 3. Módulo de Entradas
- Cadastro com: nome, valor, se foi recebido, data
- Total recebido vs total esperado

### 4. Módulo de Contas Fixas
- Cadastro com: nome, valor planejado, valor real, data de vencimento, status, observação
- Badge colorido: verde = concluído, amarelo = pendente, vermelho = atrasado

### 5. Módulo de Gastos Variáveis
- Cadastro com: nome, categoria, forma de pagamento, valor planejado, valor real, data, status
- Destaque visual quando o gasto real supera o planejado (neon laranja/vermelho)
- Possibilidade de criar nova categoria com nome e ícone

### 6. Módulo de Reservas e Metas
- Cadastro com: nome, tipo (reserva/meta), meta total, valor mensal, total guardado, onde está guardado
- Barra de progresso visual por meta
- Cálculo automático: percentual atingido, valor restante, meses estimados para completar

### 7. Navegação por mês
- Seletor de mês/ano no topo
- Cada mês é uma instância independente no banco
- Histórico de todos os meses cadastrados

### 8. Comprometimento do salário
- Salário de referência do mês
- Percentual comprometido calculado pelo domínio
- Gráfico de pizza por item

---

## Ordem de construção sugerida para o Claude Code

1. Configurar o monorepo com pnpm workspaces (`core`, `backend`, `frontend`)
2. Construir o `core` completo: entidades, VOs, agregado, casos de uso, interfaces de repositório — baseado no modelo extraído do `financas_maio_2026.json`
3. Escrever testes unitários para o domínio (sem framework, Jest puro)
4. Configurar o `backend` Nest.js importando `@financas/core`, implementar repositórios com Prisma, schema do banco, autenticação JWT
5. Configurar o `frontend` Next.js importando `@financas/core` para tipos e DTOs, configurar Tailwind com o tema neon
6. Implementar a tela de Login e Register
7. Montar o layout com sidebar e header
8. Construir o dashboard com os gráficos (Recharts)
9. Implementar os módulos: Entradas, Contas Fixas, Gastos Variáveis, Metas
10. Integrar frontend ↔ backend via API REST
11. Preparar configuração de deploy para Hostinger VPS (Docker Compose ou PM2)

---



