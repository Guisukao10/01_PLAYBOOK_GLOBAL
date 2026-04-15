function initializeLanguageSelector() {
  if (!window.PlaybookI18n || !window.playbookSetLocale) return;
  if (document.getElementById("playbookLanguageSelector")) return;

  const target = document.querySelector(".header .header-content") || document.querySelector(".header .header-container") || document.querySelector('.global-header');
  if (!target) return;

  const wrapper = document.createElement("div");
  wrapper.className = "language-selector-wrap";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.marginLeft = "12px";

  const locale = window.PlaybookI18n.getLocale();
  const i18n = window.PlaybookI18n;
  const languageLabelByLocale = {
    "pt-BR": "Idioma",
    es: "Idioma",
    en: "Language"
  };

  const label = document.createElement("label");
  label.setAttribute("for", "playbookLanguageSelector");
  label.style.fontSize = "12px";
  label.style.opacity = "0.9";
  label.textContent = i18n.t(
    "common.language.selectorLabel",
    languageLabelByLocale[locale] || "Language"
  );

  const select = document.createElement("select");
  select.id = "playbookLanguageSelector";
  select.style.padding = "4px 8px";
  select.style.borderRadius = "6px";

  [
    { value: "pt-BR", label: "PT-BR" },
    { value: "es", label: "ES" },
    { value: "en", label: "EN" }
  ].forEach(function (optionMeta) {
    const option = document.createElement("option");
    option.value = optionMeta.value;
    option.textContent = optionMeta.label;
    select.appendChild(option);
  });

  select.value = locale;
  select.addEventListener("change", function () {
    window.playbookSetLocale(select.value, { reload: true });
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  target.appendChild(wrapper);
}

function renderGlobalHeader() {
  const i18n = window.PlaybookI18n || { t: function (_key, fallback) { return fallback; } };
  const headerContainer = document.querySelector('.global-header');
  if (!headerContainer) return;

  headerContainer.innerHTML = `
    <div class="brand">${i18n.t("kpi.v1.header.brand", "GLOBAL SERVICE GOVERNANCE")}</div>
    <nav>
      <a href="index.html" data-page="index">${i18n.t("kpi.v1.header.architecture", "Arquitetura")}</a>
      <a href="dashboard.html" data-page="dashboard">${i18n.t("kpi.v1.header.dashboard", "Dashboard")}</a>
      <a href="kpi-map.html" data-page="kpi-map">${i18n.t("kpi.v1.header.expandedMap", "Mapa Expandido")}</a>
    </nav>
  `;

  const links = headerContainer.querySelectorAll('nav a');
  const current = location.pathname.split('/').pop();
  links.forEach((item) => {
    if (item.getAttribute('href') === current || (current === '' && item.getAttribute('href') === 'index.html')) {
      item.classList.add('active');
    }
  });
}

function initGlobalScripts() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderGlobalHeader();
      initializeLanguageSelector();
    });
  } else {
    renderGlobalHeader();
    initializeLanguageSelector();
  }
}

initGlobalScripts();
