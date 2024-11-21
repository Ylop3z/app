// JavaScript File: script.js

// Initialize the Google Sheets API
function initGoogleSheetsApi() {
  gapi.load('client', async () => {
    await gapi.client.init({
      apiKey: 'AIzaSyAmwEK0lryfL4nQn_bdigm22N4hi8cBPz8',
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    });
    loadAgentData();
  });
}

async function loadAgentData() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '11B7Dh-GEXVAWhp55gXu0zQkij0ftgl-0B_Z4dp6cpCk',
      range: 'Mattrix!B:I', // Ajusta el rango según la estructura de tu hoja
    });

    const values = response.result.values;
    if (!values) {
      console.error('No data found.');
      return;
    }

    const agentsData = values.slice(1).map(row => ({
      name: row[0],
      image: row[1] ? `images/${normalizeName(row[0])}.jpg` : 'images/default.jpg', // Ruta de la imagen desde la carpeta images
      conversionRate: row[7], // Mantenemos el valor como cadena sin convertir a float
      workOrders: row[5], // Mantenemos el valor como cadena
      adh: row[3] // Mantenemos el valor como cadena
    }));

    renderAgents(agentsData);
  } catch (error) {
    console.error('Error loading agent data:', error);
  }
}

function normalizeName(name) {
  // Normalizar el nombre: convertir a mayúsculas y reemplazar espacios por guiones bajos
  return name.toUpperCase().replace(/\s+/g, '_');
}

// Función para formatear la tasa de conversión sin redondear, asegurando dos decimales
function formatConversionRate(rate) {
  return rate; // No se aplica formato adicional, se muestra tal cual está
}

function renderAgents(agentsData) {
  const container = document.getElementById('agentsContainer');
  container.innerHTML = '';

  // Ordenar agentes de mayor a menor según los Work Orders
  agentsData.sort((a, b) => parseInt(b.workOrders) - parseInt(a.workOrders));

  agentsData
    .filter(agent => parseFloat(agent.conversionRate) > 19) // Filtramos los agentes con tasa de conversión mayor a 19
    .slice(0, 6) // Limitar a 6 agentes (2 filas de 3)
    .forEach(agent => {
      const agentCard = document.createElement('div');
      agentCard.classList.add('col-md-4', 'mb-4');

      agentCard.innerHTML = `
        <div class="card agent-card">
          <img src="${agent.image}" class="card-img-top agent-image" alt="${agent.name}" crossorigin="anonymous" onerror="this.onerror=null;this.src='images/default.jpg';">
          <div class="card-body">
            <h5 class="card-title">${agent.name}</h5>
            <span class="conversion-badge">
              ${agent.conversionRate}  <!-- Mostramos el valor exacto tal como está -->
            </span>
            <div class="agent-stats">
              <p class="mb-3">
                <i class="bi bi-trophy performance-icon"></i>
                ${agent.workOrders} Work Orders
              </p>
              <p class="mb-3">
                <i class="bi bi-lightning-charge performance-icon"></i>
                ${agent.adh} ADH  <!-- Mostramos ADH tal cual está -->
              </p>
            </div>
          </div>
        </div>
      `;

      container.appendChild(agentCard);
    });
}


// Cargar datos y renderizar agentes cuando el contenido esté listo
document.addEventListener('DOMContentLoaded', function() {
  try {
    initGoogleSheetsApi();
  } catch (error) {
    console.error('Error initializing Google Sheets API:', error);
  }
});
