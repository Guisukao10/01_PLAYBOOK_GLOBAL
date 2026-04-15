document.addEventListener('DOMContentLoaded', function () {
  if (!window.mockData || !mockData.dashboard) return;

  const filters = document.getElementById('filters');
  const kpiCards = document.getElementById('kpiCards');
  const regionSummary = document.getElementById('regionSummary');
  const comparativeCards = document.getElementById('comparativeCards');
  const operationSections = document.getElementById('operationSections');
  const productsTable = document.getElementById('productsTable')?.querySelector('tbody');
  const alerts = document.getElementById('alertCards');

  mockData.dashboard.filters.forEach((filter) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${filter}</h3><p>Selecione ${filter.toLowerCase()}</p>`;
    filters.appendChild(card);
  });

  mockData.dashboard.kpis.forEach((kpi) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${kpi.title}</h3><p>${kpi.value}</p>`;
    kpiCards.appendChild(card);
  });

  mockData.dashboard.regions.forEach((region) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${region.name}</h3><p>Tickets: ${region.tickets}</p><p>SLA: ${region.sla}</p><p>MTTR: ${region.mttr}</p>`;
    regionSummary.appendChild(card);
  });

  mockData.dashboard.comparative.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.metric}</p>`;
    comparativeCards.appendChild(card);
  });

  mockData.dashboard.operation.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.value}</p>`;
    operationSections.appendChild(card);
  });

  mockData.dashboard.products.forEach((p) => {
    productsTable?.insertAdjacentHTML('beforeend', `<tr><td>${p.brand}</td><td>${p.product}</td><td>${p.tickets}</td><td>${p.sla}</td><td>${p.mttr}</td></tr>`);
  });

  mockData.dashboard.alerts.forEach((alert) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${alert.title}</h3><p>${alert.message}</p>`;
    alerts.appendChild(card);
  });
});