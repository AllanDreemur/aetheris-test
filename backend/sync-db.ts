import axios from 'axios';
import { MongoClient } from 'mongodb';

const INPE_COLLECTIONS_URL = 'https://data.inpe.br/bdc/stac/v1/collections';
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'aetheris_db';

async function syncDetailedProducts() {
  console.log('Iniciando sincronização detalhada (versão corrigida)...');

  try {
    const initialResponse = await axios.get(INPE_COLLECTIONS_URL);
    const collections = initialResponse.data.collections;
    console.log(`Encontradas ${collections.length} coleções na API.`);

    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);
    const productsCollection = db.collection('data_products');
    console.log('Conectado ao MongoDB.');

    await productsCollection.deleteMany({});
    console.log('Coleção "data_products" antiga foi limpa.');

    const newProducts = [];

    for (const collection of collections) {
      try {
        console.log(`Buscando detalhes para: ${collection.id}`);
        const detailUrl = `https://data.inpe.br/bdc/stac/v1/collections/${collection.id}`;
        const detailResponse = await axios.get(detailUrl);
        const collectionDetails = detailResponse.data;

        // Tenta extrair as bandas da fonte que você identificou ('properties['eo:bands']').
        // Se não encontrar, ele tenta o método antigo ('cube:dimensions') como um fallback.
        const detailedBands = collectionDetails.properties?.['eo:bands'] || 
                            collectionDetails['cube:dimensions']?.bands?.values || 
                            [];

        newProducts.push({
          productName: collectionDetails.id,
          friendlyName: collectionDetails.title || collectionDetails.id,
          description: collectionDetails.description,
          variables: detailedBands 
        });

      } catch (e) {
        console.error(`Falha ao buscar detalhes para ${collection.id}. Pulando.`);
      }
    }

    if (newProducts.length > 0) {
      await productsCollection.insertMany(newProducts);
      console.log(`Sincronização concluída! ${newProducts.length} produtos detalhados foram inseridos.`);
    } else {
      console.log('Nenhum produto para inserir.');
    }

    await client.close();

  } catch (error) {
    console.error('Ocorreu um erro durante a sincronização:', error);
  }
}

syncDetailedProducts();