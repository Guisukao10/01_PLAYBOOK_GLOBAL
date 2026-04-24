document.addEventListener('DOMContentLoaded', function () {
  if (!window.mockData || !mockData.dashboard) return;

  const filters = document.getElementById('filters');
  const kpiCards = document.getElementById('kpiCards');
  const regionSummary = document.getElementById('regionSummary');
  const comparativeCards = document.getElementById('comparativeCards');
  const operationSections = document.getElementById('operationSections');
  const productsTable = document.getElementById('productsTable')?.querySelector('tbody');
  const alerts = document.getElementById('alertCards');

  function appendCard(container, titleText, bodyLines) {
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = titleText;
    card.appendChild(title);

    bodyLines.forEach((line) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      card.appendChild(paragraph);
    });

    container.appendChild(card);
  }

  mockData.dashboard.filters.forEach((filter) => {
    appendCard(filters, filter, [`Selecione ${filter.toLowerCase()}`]);
  });

  mockData.dashboard.kpis.forEach((kpi) => {
    appendCard(kpiCards, kpi.title, [kpi.value]);
  });

  mockData.dashboard.regions.forEach((region) => {
    appendCard(regionSummary, region.name, [
      `Tickets: ${region.tickets}`,
      `SLA: ${region.sla}`,
      `MTTR: ${region.mttr}`
    ]);
  });

  mockData.dashboard.comparative.forEach((item) => {
    appendCard(comparativeCards, item.title, [item.metric]);
  });

  mockData.dashboard.operation.forEach((item) => {
    appendCard(operationSections, item.title, [item.value]);
  });

  mockData.dashboard.products.forEach((p) => {
    if (!productsTable) return;

    const row = document.createElement('tr');
    [p.brand, p.product, p.tickets, p.sla, p.mttr].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.appendChild(cell);
    });
    productsTable.appendChild(row);
  });

  mockData.dashboard.alerts.forEach((alert) => {
    appendCard(alerts, alert.title, [alert.message]);
  });
});
