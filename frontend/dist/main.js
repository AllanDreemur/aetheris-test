/// <reference types="leaflet" />
// O objeto 'L' do Leaflet está globalmente disponível por causa do script que adicionamos no HTML.
// A diretiva acima e as definições de tipo que instalamos fazem o TypeScript entender o que 'L' é.
// 1. Inicializa o mapa, definindo a visão inicial para as coordenadas de Jacareí e o nível de zoom.
const map = L.map('map').setView([-23.305, -45.967], 13);
// 2. Adiciona a camada de "azulejos" (tiles) do mapa. Usaremos o OpenStreetMap, que é gratuito.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// 3. Adiciona um marcador de exemplo no mapa.
L.marker([-23.305, -45.967]).addTo(map)
    .bindPopup('Olá, FATEC Jacareí!')
    .openPopup();
// 4. Adiciona um evento de clique no mapa - Este é o núcleo do RF01!
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    console.log(`Você clicou no mapa nas coordenadas: Latitude ${lat}, Longitude ${lng}`);
    // Adiciona um popup no local do clique
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`Coordenadas: <br> Lat: ${lat.toFixed(5)} <br> Lon: ${lng.toFixed(5)}`)
        .openOn(map);
});
export {};
//# sourceMappingURL=main.js.map