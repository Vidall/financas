#!/bin/bash
set -e

cd /var/www/financas

echo ">>> Atualizando código..."
git fetch origin main
git checkout -- .
git pull origin main

echo ">>> Restaurando .env..."
if [ ! -f backend/.env ]; then
  echo "ERRO: backend/.env não encontrado. Crie o arquivo antes de continuar."
  exit 1
fi

echo ">>> Instalando dependências..."
pnpm install --frozen-lockfile

echo ">>> Build do core..."
cd core && pnpm build && cd ..

echo ">>> Backend: migrate + build..."
cd backend
pnpm prisma generate
npx prisma migrate deploy
pnpm build
cd ..

echo ">>> Frontend: build..."
cd frontend
pnpm build
cd ..

echo ">>> Reiniciando processos..."
pm2 restart all

echo ">>> Deploy concluído!"
