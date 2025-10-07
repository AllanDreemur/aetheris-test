
// === Mapa Interativo com WTSS e Chart.js ===

// Inicializa o mapa Leaflet
var map = L.map('map').setView([-15.78, -47.93], 4);

// Camada base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Função principal: ao clicar no mapa
map.on('click', async function(e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  // Adiciona marcador
  const marker = L.marker([lat, lon]).addTo(map);

  // Chama função para buscar dados WTSS
  const result = await getWTSSData(lat, lon);

  if (result) {
    const popupContent = `
      <div style="width: 300px;">
        <h4>${result.title}</h4>
        <p><b>Período:</b> ${result.start_date} → ${result.end_date}</p>
        <canvas id="chart-${result.title}" width="280" height="150"></canvas>
        <p><b>NDVI (valores):</b></p>
        <p style="font-size: 0.8em; word-wrap: break-word;">${result.ndviValues.join(', ')}</p>
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    // Renderiza o gráfico NDVI no popup após renderização
    setTimeout(() => {
      const ctx = document.getElementById(`chart-${result.title}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: result.timeline,
            datasets: [{
              label: 'NDVI',
              data: result.ndviValues,
              borderWidth: 1,
              fill: false
            }]
          },
          options: {
            scales: {
              y: { beginAtZero: true }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }, 500);
  } else {
    marker.bindPopup('Erro ao obter dados WTSS.').openPopup();
  }
});

// === Função para acessar WTSS ===
async function getWTSSData(lat, lon) {
  const baseUrl = "https://data.inpe.br/bdc/wtss/v4/";

  try {
    // 1️⃣ Buscar lista de datasets
    const response = await fetch(baseUrl);
    const data = await response.json();
    const datasetInfo = data.links.find(link => link.rel === "data");
    if (!datasetInfo) return null;

    const title = datasetInfo.title;

    // 2️⃣ Buscar detalhes do dataset
    const datasetResponse = await fetch(baseUrl + title);
    const datasetDetails = await datasetResponse.json();

    const timeline = datasetDetails.timeline;
    const start_date = timeline[0];
    const end_date = timeline[timeline.length - 1];

    // 3️⃣ Buscar série temporal NDVI
    const timeSeriesUrl = `${baseUrl}time_series?coverage=${title}&attributes=NDVI&start_date=${start_date}&end_date=${end_date}&latitude=${lat}&longitude=${lon}`;
    const timeSeriesResponse = await fetch(timeSeriesUrl);
    const timeSeriesData = await timeSeriesResponse.json();

    const ndviAttr = timeSeriesData.result.attributes.find(a => a.attribute === "NDVI");
    if (!ndviAttr) return null;

    return {
      title,
      start_date,
      end_date,
      ndviValues: ndviAttr.values,
      timeline
    };
  } catch (err) {
    console.error("Erro ao acessar WTSS:", err);
    return null;
  }
}
