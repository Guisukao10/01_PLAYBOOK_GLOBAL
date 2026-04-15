document.addEventListener('DOMContentLoaded', function () {
  const btnDashboard = document.getElementById('goDashboard');
  const btnKpiMap = document.getElementById('goKpiMap');

  btnDashboard?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
  btnKpiMap?.addEventListener('click', () => {
    window.location.href = 'kpi-map.html';
  });

  const pillarContainer = document.getElementById('globalPillars');
  const dimensionContainer = document.getElementById('dimensions');

  if (pillarContainer && dimensionContainer && window.mockData) {
    mockData.pillars.forEach((pillar) => {
      pillarContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="card pillar-item"><h3>${pillar.title}</h3><p>${pillar.description}</p><p><strong>Subníveis:</strong> ${pillar.levels.join(', ')}</p></div>`
      );
    });

    mockData.dimensions.forEach((dimension) => {
      dimensionContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="card"><h3>${dimension.title}</h3><p>${dimension.description}</p><p>${dimension.items.join(' • ')}</p></div>`
      );
    });
  }
});