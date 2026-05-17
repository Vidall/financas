#!/bin/bash
set -e

cd /var/www/financas

echo ">>> Atualizando código..."
cp backend/.env /tmp/financas_env_backup
git fetch origin main
git reset --hard origin/main
cp /tmp/financas_env_backup backend/.env

echo ">>> Verificando .env..."
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
npx prisma db push
pnpm build
cd ..

echo ">>> Frontend: build..."
cd frontend
pnpm build
cd ..

echo ">>> Reiniciando processos..."
pm2 restart all

echo ">>> Deploy concluído!"
