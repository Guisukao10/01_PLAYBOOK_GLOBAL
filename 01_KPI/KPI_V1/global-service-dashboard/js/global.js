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

function createPlaybookLinkSecurity() {
  // Allowlist explícita para links dinâmicos.
  const ALLOWED_SCHEMES = {
    http: true,
    https: true,
    mailto: true,
    tel: true
  };

  function toStringValue(value) {
    return String(value === undefined || value === null ? "" : value).trim();
  }

  function getScheme(value) {
    const compact = value.replace(/[\u0000-\u001F\u007F\s]+/g, "");
    const match = compact.match(/^([a-z][a-z0-9+.-]*):/i);
    return match ? match[1].toLowerCase() : "";
  }

  function sanitizeHref(rawHref, fallback) {
    const safeFallback = fallback === undefined ? "#" : fallback;
    const fallbackText = safeFallback === null ? null : toStringValue(safeFallback);
    const href = toStringValue(rawHref);

    if (!href) return fallbackText;
    if (href === "#" || href.charAt(0) === "#") return href;
    if (href.indexOf("//") === 0) return fallbackText;

    const scheme = getScheme(href);
    if (!scheme) return href;

    return ALLOWED_SCHEMES[scheme] ? href : fallbackText;
  }

  function setHref(element, rawHref, fallback) {
    const safeHref = sanitizeHref(rawHref, fallback);
    if (!element) return safeHref;

    if (safeHref === null) {
      element.removeAttribute("href");
      return null;
    }

    element.href = safeHref;
    return safeHref;
  }

  function navigate(rawHref) {
    const safeHref = sanitizeHref(rawHref, null);
    if (!safeHref) return false;

    window.location.assign(safeHref);
    return true;
  }

  return {
    sanitizeHref: sanitizeHref,
    setHref: setHref,
    navigate: navigate
  };
}

if (!window.PlaybookLinkSecurity || typeof window.PlaybookLinkSecurity.sanitizeHref !== "function") {
  window.PlaybookLinkSecurity = createPlaybookLinkSecurity();
}

function setSanitizedHref(element, href, fallback) {
  return window.PlaybookLinkSecurity.setHref(element, href, fallback);
}

function renderGlobalHeader() {
  const i18n = window.PlaybookI18n || { t: function (_key, fallback) { return fallback; } };
  const headerContainer = document.querySelector('.global-header');
  if (!headerContainer) return;

  headerContainer.replaceChildren();

  const brand = document.createElement('div');
  brand.className = 'brand';
  brand.textContent = i18n.t("kpi.v1.header.brand", "GLOBAL SERVICE GOVERNANCE");
  headerContainer.appendChild(brand);

  const nav = document.createElement('nav');
  [
    { href: 'index.html', page: 'index', label: i18n.t("kpi.v1.header.architecture", "Arquitetura") },
    { href: 'dashboard.html', page: 'dashboard', label: i18n.t("kpi.v1.header.dashboard", "Dashboard") },
    { href: 'kpi-map.html', page: 'kpi-map', label: i18n.t("kpi.v1.header.expandedMap", "Mapa Expandido") }
  ].forEach(function (item) {
    const link = document.createElement('a');
    setSanitizedHref(link, item.href, "#");
    link.setAttribute('data-page', item.page);
    link.textContent = item.label;
    nav.appendChild(link);
  });

  headerContainer.appendChild(nav);

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
