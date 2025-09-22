/// <reference types="leaflet" />
// Envolvemos todo o nosso código neste evento para garantir que o HTML esteja pronto
document.addEventListener('DOMContentLoaded', () => {
    // --- Inicialização do Mapa ---
    const map = L.map('map').setView([-23.305, -45.967], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // --- Referências aos Elementos HTML ---
    const dataSidebar = document.getElementById('sidebar');
    const dataSidebarContent = document.getElementById('sidebar-content');
    const closeBtn = document.getElementById('sidebar-close-btn');
    // --- Lógica da Sidebar de Dados ---
    closeBtn.addEventListener('click', () => {
        dataSidebar.classList.add('hidden');
    });
    // --- Evento de Clique no Mapa ---
    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const apiUrl = `http://localhost:3000/api/geodata?lat=${lat}&lng=${lng}`;
        dataSidebarContent.innerHTML = 'Buscando dados detalhados...';
        dataSidebar.classList.remove('hidden');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let contentHtml = '';
            if (data && data.length > 0) {
                data.forEach((product) => {
                    // --- LÓGICA DO ACORDEÃO AQUI ---
                    contentHtml += `
                  <div class="accordion-item">
                    <div class="accordion-header">${product.friendlyName}</div>
                    <div class="accordion-content">
                `;
                    if (product.variables && product.variables.length > 0) {
                        contentHtml += `<ul style="font-size: 0.9em; margin: 0; padding: 0; list-style-type: none;">`;
                        product.variables.forEach((variable) => {
                            var _a, _b;
                            contentHtml += `
                            <li style="margin-bottom: 8px; padding-left: 10px; border-left: 2px solid #eee;">
                                <strong>${variable.common_name || variable.name}</strong>: 
                                ${variable.description || 'Sem descrição.'}
                                <div style="font-size: 0.9em; color: #555;">(resolution_x: ${(_a = variable.resolution_x) !== null && _a !== void 0 ? _a : 'N/A'}, resolution_y: ${(_b = variable.resolution_y) !== null && _b !== void 0 ? _b : 'N/A'})</div>
                            </li>
                        `;
                        });
                        contentHtml += `</ul>`;
                    }
                    else {
                        contentHtml += `<p>Nenhuma variável detalhada encontrada para este produto.</p>`;
                    }
                    contentHtml += `</div></div>`; // Fecha accordion-content e accordion-item
                });
            }
            else {
                contentHtml = '<p>Nenhum dado encontrado para este ponto.</p>';
            }
            dataSidebarContent.innerHTML = contentHtml;
            // --- ADICIONA A LÓGICA DE CLIQUE PARA OS CABEÇALHOS DO ACORDEÃO ---
            const headers = dataSidebarContent.querySelectorAll('.accordion-header');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.parentElement;
                    // Fecha todos os outros itens abertos
                    headers.forEach(otherHeader => {
                        var _a;
                        if (otherHeader !== header) {
                            (_a = otherHeader.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
                        }
                    });
                    // Alterna (abre/fecha) o item clicado
                    item === null || item === void 0 ? void 0 : item.classList.toggle('active');
                });
            });
        })
            .catch(error => {
            console.error('Erro ao buscar dados:', error);
            dataSidebarContent.innerHTML = `<strong>Erro ao buscar dados:</strong> <br>${error.message}`;
        });
    });
});
export {};
//# sourceMappingURL=main.js.map