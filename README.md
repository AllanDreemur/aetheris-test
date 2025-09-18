# Instalação do projeto
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

# 🌍 Projeto Aetheris

O **Aetheris** é uma aplicação web projetada para resolver um desafio central:  
👉 **permitir que usuários descubram e visualizem facilmente quais dados geoespaciais estão disponíveis para qualquer ponto no mapa.**

O projeto é dividido em três camadas que trabalham em conjunto:  
1. **Banco de Dados**  
2. **Backend**  
3. **Frontend**

---

## 🔹 Parte 1: Banco de Dados (MongoDB) – *O "Arquivo Central"*

O banco de dados não armazena cliques de usuários. Sua função principal é:  
➡️ **servir como um catálogo local, rápido e completo de todos os produtos de dados que a API do INPE oferece.**

### Estrutura
- **Banco de dados:** `aetheris_db`  
- **Coleções principais:**  
  - `data_products` → a coleção **crucial** para o funcionamento.  
  - `location_cache` e `timeseries_cache` → planejadas para otimizações futuras (*cache*), mas não utilizadas atualmente.  

### Coleção `data_products`
Pense nela como um **dicionário/enciclopédia** do projeto.  
- Armazena todos os **produtos de dados** (ex.: `EtaCCDay_CMIP5-1`).  
- Contém: nome amigável, descrição e lista detalhada de todas as **variáveis** (ex.: `resolution_x`, `description`, etc.).  

### Inserção dos dados
Os dados são inseridos **exclusivamente pelo backend** através do script:  
```bash
npx ts-node backend/sync-db.ts
```

Fluxo do script:
1. Apaga todos os dados antigos da coleção `data_products`.  
2. Busca a lista de coleções na API do INPE.  
3. Para cada coleção, busca os detalhes completos (incluindo variáveis) e salva no MongoDB.  

---

## 🔹 Parte 2: Backend (Node.js + Express) – *O "Cérebro" da Operação*

O backend é o **intermediário inteligente**, responsável pela lógica de negócios, comunicação externa e respostas ao usuário.  

### Inicialização
- Executado via:  
  ```bash
  npm run dev
  ```
- Arquivo principal: **`backend/src/server.ts`**  
- Primeira ação: chamar `connectToDatabase` (em `database.ts`) para conectar ao MongoDB.  
- Só após a conexão, o servidor começa a ouvir na porta **3000**.  

### Servindo o Frontend
- Usa `express.static` para servir os arquivos da pasta `frontend`.  
- A aplicação é acessível em:  
  👉 `http://localhost:3000`

### Rota Principal – `/api/geodata`
Fluxo da rota:
1. Recebe **latitude e longitude** do frontend.  
2. Faz `POST` para a API do INPE (`/stac/v1/search`), enviando as coordenadas.  
3. Recebe a lista de coleções que cobrem aquele ponto.  
4. Consulta `data_products` no MongoDB para obter os **detalhes completos**.  
5. Retorna esses detalhes ao frontend em **JSON**.  

---

## 🔹 Parte 3: Frontend (HTML, CSS, TypeScript) – *A Interface do Usuário*

O frontend é a camada de interação direta, responsável por renderizar o mapa e exibir dados.  

### Estrutura
- **HTML:** `frontend/index.html`  
  - `<div id="map">` → mapa interativo  
  - `<div id="sidebar">` → painel lateral de dados  
- **CSS:** `frontend/css/styles.css` → estilos visuais (sidebar, altura do mapa).  

### Lógica (TypeScript)
- Arquivo principal: **`frontend/ts/main.ts`**  
- Inicializa o mapa com **Leaflet**.  

#### Evento de Clique
Quando o usuário clica no mapa:
1. Captura as coordenadas.  
2. Envia `fetch` para `/api/geodata` (backend).  
3. Exibe sidebar com **"carregando"**.  
4. Ao receber o JSON:  
   - Processa lista de produtos e variáveis.  
   - Gera dinamicamente o conteúdo HTML.  
   - Insere na sidebar → exibindo dados detalhados do ponto selecionado.  

---

## ✅ Resumo
Cada camada do projeto (**Banco de Dados, Backend e Frontend**) se conecta para oferecer ao usuário uma experiência fluida de **exploração geoespacial interativa**.  
