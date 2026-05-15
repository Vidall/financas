-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "contas_bancarias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "saldo" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "contas_bancarias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "planos_mensais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "salarioReferencia" REAL NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "planos_mensais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "entradas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planoMensalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "recebido" BOOLEAN NOT NULL DEFAULT false,
    "data" DATETIME,
    CONSTRAINT "entradas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contas_fixas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planoMensalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valorPlanejado" REAL NOT NULL,
    "valorReal" REAL,
    "vencimento" DATETIME,
    "dataPago" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "observacao" TEXT,
    CONSTRAINT "contas_fixas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gastos_variaveis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planoMensalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaNome" TEXT NOT NULL,
    "categoriaIcone" TEXT NOT NULL DEFAULT '💰',
    "formaPagamento" TEXT NOT NULL,
    "valorPlanejado" REAL NOT NULL,
    "valorReal" REAL,
    "data" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    CONSTRAINT "gastos_variaveis_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planoMensalId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "metaTotal" REAL NOT NULL,
    "valorMensal" REAL NOT NULL,
    "totalGuardado" REAL NOT NULL DEFAULT 0,
    "onde" TEXT,
    "data" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    CONSTRAINT "metas_planoMensalId_fkey" FOREIGN KEY ("planoMensalId") REFERENCES "planos_mensais" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    CONSTRAINT "refresh_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "planos_mensais_usuarioId_mes_ano_key" ON "planos_mensais"("usuarioId", "mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");
