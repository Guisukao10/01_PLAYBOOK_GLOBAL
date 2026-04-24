function navigateSafely(rawHref) {
  if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.navigate === "function") {
    return window.PlaybookLinkSecurity.navigate(rawHref);
  }

  const href = String(rawHref === undefined || rawHref === null ? "" : rawHref).trim();
  if (!href) return false;
  if (href.indexOf("//") === 0) return false;
  if (href === "#" || href.charAt(0) === "#") {
    window.location.assign(href);
    return true;
  }

  const compact = href.replace(/[\u0000-\u001F\u007F\s]+/g, "");
  const schemeMatch = compact.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== "http" && scheme !== "https" && scheme !== "mailto" && scheme !== "tel") {
      return false;
    }
  }

  window.location.assign(href);
  return true;
}

document.addEventListener('DOMContentLoaded', function () {
  const btnDashboard = document.getElementById('goDashboard');
  const btnKpiMap = document.getElementById('goKpiMap');

  btnDashboard?.addEventListener('click', () => {
    navigateSafely('dashboard.html');
  });
  btnKpiMap?.addEventListener('click', () => {
    navigateSafely('kpi-map.html');
  });

  const pillarContainer = document.getElementById('globalPillars');
  const dimensionContainer = document.getElementById('dimensions');

  if (pillarContainer && dimensionContainer && window.mockData) {
    mockData.pillars.forEach((pillar) => {
      const card = document.createElement('div');
      card.className = 'card pillar-item';

      const title = document.createElement('h3');
      title.textContent = pillar.title;
      card.appendChild(title);

      const description = document.createElement('p');
      description.textContent = pillar.description;
      card.appendChild(description);

      const levels = document.createElement('p');
      const levelsLabel = document.createElement('strong');
      levelsLabel.textContent = 'SubnÃ­veis:';
      levels.appendChild(levelsLabel);
      levels.appendChild(document.createTextNode(' ' + pillar.levels.join(', ')));
      card.appendChild(levels);

      pillarContainer.appendChild(card);
    });

    mockData.dimensions.forEach((dimension) => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = dimension.title;
      card.appendChild(title);

      const description = document.createElement('p');
      description.textContent = dimension.description;
      card.appendChild(description);

      const items = document.createElement('p');
      items.textContent = dimension.items.join(' â€¢ ');
      card.appendChild(items);

      dimensionContainer.appendChild(card);
    });
  }
});
