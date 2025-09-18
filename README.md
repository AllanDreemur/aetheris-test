# Backend e Frontend
Dependências que precisam ser instaladas tanto no backend, quanto no frontend:
```bash
npm i
```

Antes de iniciar o servidor pela primeira vez, você precisa popular seu banco de dados local com os metadados das coleções do INPE.
```bash
npx ts-node sync-db.ts
```

Para iniciar o servidor, abra um prompt na pasta do backend e use o comando:
```bash
npm run dev
```

Ao fazer alterações no frontend, abrir um prompt e usar o comando abaixo para processar a alteração em js:
```bash
npx tsc
```

# MongoDB:
- Instalar o MongoDB Community Server;
- Editar as variáveis de ambiente, adicionar na variável PATH C:\Program Files\MongoDB\Server\8.2\bin\
- No MongoDB Compass criar o Database: 
```bash
aetheris-db 
```
E as coleções: 
```bash
data_products, location_cache e timeseries_cache;
```
