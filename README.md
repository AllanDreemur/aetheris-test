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
- No MongoDB Compass criar o Database: aetheris-db e as coleções: data_products, location_cache e timeseries_cache;
- Comando para o INSERT DATA:
```bash
// Troca para o banco de dados 'aetheris_db' (cria se não existir)
use aetheris_db

// Insere o documento de exemplo na coleção 'location_cache'
// A coleção também é criada automaticamente no primeiro 'insert'
db.location_cache.insertOne({
  location: {
    type: "Point",
    coordinates: [ -45.887, -23.179 ]
  },
  stacApiResponse: {
    type: "FeatureCollection",
    features: [
      {
        id: "S2-16D_V2_22LCH_2025_07_30",
        collection: "S2-16D_V2",
        properties: { datetime: "2025-07-30T13:42:19Z", resolution: 10 },
        assets: {
          NDVI: { title: "Normalized Difference Vegetation Index" },
          EVI: { title: "Enhanced Vegetation Index" }
        }
      }
    ]
  },
  createdAt: new Date("2025-09-17T22:15:00.000Z")
})

// (Opcional) Verifica se o documento foi inserido
db.location_cache.find()
```

```bash
//timeseries_cache
{
  "_id": "...",
  "location": {
    "type": "Point",
    "coordinates": [-45.887, -23.179]
  },
  "collectionName": "S2-16D_V2",
  "variableName": "NDVI",
  "timeSeriesData": {
    "result": {
      "timeline": [
        {"year": 2025, "month": 1, "day": 5, "value": 0.78},
        {"year": 2025, "month": 1, "day": 21, "value": 0.81},
        {"year": 2025, "month": 2, "day": 6, "value": 0.85}
      ]
    }
  },
  "createdAt": {
    "$date": "2025-09-17T21:39:57.000Z"
  }
}
```

```bash
//data_products
{
  "productName": "S2-16D_V2",
  "friendlyName": "Sentinel-2 MSI 16-Day Composite",
  "description": "16-day composite of Sentinel-2/MSI surface reflectance images.",
  "satellite": "Sentinel-2",
  "spatialResolution": "10m",
  "temporalResolution": "16 days",
  "availableBands": [
    "NDVI",
    "EVI",
    "RED",
    "GREEN",
    "BLUE",
    "NIR",
    "CLOUD"
  ]
}
```
