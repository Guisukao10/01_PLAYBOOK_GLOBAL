document.addEventListener('DOMContentLoaded', function () {
  if (!window.mockData || !mockData.kpiMap) return;

  const kpiSectionsNode = document.getElementById('kpiSections');
  mockData.kpiMap.forEach((kpi) => {
    const section = document.createElement('section');
    section.className = 'kpi-section';
    section.innerHTML = `
      <h2 class="section-title">${kpi.title}</h2>
      <p><strong>Definição:</strong> ${kpi.definition}</p>
      <div class="kpi-meta">
        <div><strong>Nível 2</strong><ul>${kpi.level2.map((n) => `<li>${n}</li>`).join('')}</ul></div>
        <div><strong>Nível 3</strong><ul>${kpi.level3.map((n) => `<li>${n}</li>`).join('')}</ul></div>
      </div>
      <div style="margin-top:0.75rem;"><strong>Estratégias:</strong><ul>${kpi.strategies.map((s) => `<li>${s}</li>`).join('')}</ul></div>
    `;
    kpiSectionsNode.appendChild(section);
  });
});