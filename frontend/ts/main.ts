/// <reference types="leaflet" />

// --- 1. INICIALIZAÇÃO DO MAPA (DECLARAÇÃO ÚNICA DA VARIÁVEL 'map') ---
const map = L.map('map').setView([-23.305, -45.967], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- 2. CONTROLE DA SIDEBAR ---
const sidebar = document.getElementById('sidebar')!;
const sidebarContent = document.getElementById('sidebar-content')!;
const closeBtn = document.getElementById('sidebar-close-btn')!;

closeBtn.addEventListener('click', () => {
  sidebar.classList.add('hidden');
});

// --- 3. EVENTO DE CLIQUE NO MAPA (USA A VARIÁVEL 'map' JÁ CRIADA) ---
map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  const apiUrl = `http://localhost:3000/api/geodata?lat=${lat}&lng=${lng}`;
  
  const sidebar = document.getElementById('sidebar')!;
  const sidebarContent = document.getElementById('sidebar-content')!;
  
  // Mostra a sidebar com a mensagem de "carregando"
  sidebarContent.innerHTML = 'Buscando dados detalhados...';
  sidebar.classList.remove('hidden');

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Resposta detalhada do backend:', data);

      let contentHtml = '';
      if (data && data.length > 0) {
        data.forEach((product: any) => {
          contentHtml += `<div style="margin-bottom: 15px;"><strong>${product.friendlyName}</strong>`;
          
          if (product.variables && product.variables.length > 0) {
            contentHtml += `<ul style="font-size: 0.9em; margin: 5px 0 0 0; padding: 0; list-style-type: none;">`;
            product.variables.forEach((variable: any) => {
              contentHtml += `
                <li style="margin-bottom: 8px; padding-left: 10px; border-left: 2px solid #eee;">
                  <strong>${variable.common_name || variable.name}</strong>: 
                  ${variable.description || 'Sem descrição.'}
                  <div style="font-size: 0.9em; color: #555;">(resolution_x: ${variable.resolution_x ?? 'N/A'}, resolution_y: ${variable.resolution_y ?? 'N/A'})</div>
                </li>
              `;
            });
            contentHtml += `</ul>`;
          }
          contentHtml += `</div>`;
        });
      } else {
        contentHtml = '<p>Nenhum dado encontrado para este ponto.</p>';
      }
      
      sidebarContent.innerHTML = contentHtml;
    })
    .catch(error => {
      console.error('Erro ao buscar dados:', error);
      sidebarContent.innerHTML = `<strong>Erro ao buscar dados:</strong> <br>${error.message}`;
    });
});