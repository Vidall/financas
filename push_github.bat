@echo off
cd /d "D:\meusProjetos\EmProcesso\financas"

echo Corrigindo URL do remote para github.com/Vidall/financas...
git remote set-url origin https://github.com/Vidall/financas.git

echo Adicionando arquivos...
git add .

echo Fazendo commit...
git commit -m "chore: update tsconfig and next-env" 2>nul || echo Sem alteracoes novas

echo Fazendo push...
git push -u origin master

if %errorlevel% neq 0 (
  echo.
  echo Tentando variante finan-as...
  git remote set-url origin https://github.com/Vidall/finan-as.git
  git push -u origin master
)

echo.
echo Pressione qualquer tecla para fechar...
pause
