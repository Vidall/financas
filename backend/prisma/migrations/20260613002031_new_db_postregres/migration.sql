-- CreateTable
CREATE TABLE "usuarios" (
    "id" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senhaHash" VARCHAR(255) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_bancarias" (
    "id" VARCHAR(36) NOT NULL,
    "usuarioId" VARCHAR(36) NOT NULL,
    "banco" VARCHAR(255) NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "contas_bancarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos_mensais" (
    "id" VARCHAR(36) NOT NULL,
    "usuarioId" VARCHAR(36) NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "salarioReferencia" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planos_mensais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entradas" (
    "id" VARCHAR(36) NOT NULL,
    "planoMensalId" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "recebido" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3),

    CONSTRAINT "entradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_fixas" (
    "id" VARCHAR(36) NOT NULL,
    "planoMensalId" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "valorPlanejado" DOUBLE PRECISION NOT NULL,
    "valorReal" DOUBLE PRECISION,
    "vencimento" TIMESTAMP(3),
    "dataPago" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    "observacao" TEXT,

    CONSTRAINT "contas_fixas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_variaveis" (
    "id" VARCHAR(36) NOT NULL,
    "planoMensalId" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "categoriaNome" VARCHAR(255) NOT NULL,
    "categoriaIcone" VARCHAR(10) NOT NULL DEFAULT '💰',
    "formaPagamento" VARCHAR(100) NOT NULL,
    "valorPlanejado" DOUBLE PRECISION NOT NULL,
    "valorReal" DOUBLE PRECISION,
    "valorUtilizado" DOUBLE PRECISION,
    "data" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "gastos_variaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" VARCHAR(36) NOT NULL,
    "planoMensalId" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "metaTotal" DOUBLE PRECISION NOT NULL,
    "valorMensal" DOUBLE PRECISION NOT NULL,
    "valorRealMes" DOUBLE PRECISION,
    "totalGuardado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "onde" VARCHAR(255),
    "data" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" VARCHAR(36) NOT NULL,
    "usuarioId" VARCHAR(36) NOT NULL,
    "tokenHash" VARCHAR(512) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "planos_mensais_usuarioId_mes_ano_key" ON "planos_mensais"("usuarioId", "mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- AddForeignKey
ALTER TABLE "contas_bancarias" ADD CONSTRAINT "contas_bancarias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planos_mensais" ADD CONSTRAINT "planos_mensais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_fixas" ADD CONSTRAINT "contas_fixas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_variaveis" ADD CONSTRAINT "gastos_variaveis_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
