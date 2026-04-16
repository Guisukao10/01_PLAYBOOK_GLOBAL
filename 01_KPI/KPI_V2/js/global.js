function getI18n() {
    return window.PlaybookI18n || {
        t: function (_key, fallback) {
            return fallback;
        }
    };
}

document.addEventListener("DOMContentLoaded", function () {
    initializeLanguageSelector();
    initializeNavigationScroll();
    enableSmoothScroll();
    enforceKpiWayfinderLock();
    if (!isWayfinderDisabled()) {
        injectCompactLocalNav();
        applyWayfindingLayer();
    }
    markCurrentLocalLinks();
    enforceKpiWayfinderLock();
});

function isWayfinderDisabled() {
    if (isKpiV2Scope()) return true;

    const body = document.body;
    if (!body) return false;

    const value = body.getAttribute("data-disable-wayfinder");
    if (value === null) return false;

    return value === "" || value.toLowerCase() === "true";
}

function isKpiV2Scope() {
    const body = document.body;
    if (body && body.hasAttribute("data-kpi-page")) return true;

    const path = normalizePath(window.location.pathname);
    return path.indexOf("/01_kpi/kpi_v2/") !== -1;
}

function normalizeTextValue(value) {
    const source = String(value || "").toLowerCase();
    if (typeof source.normalize !== "function") {
        return source.replace(/\s+/g, " ").trim();
    }

    return source
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function removeKpiWayfinderArtifacts() {
    if (!isKpiV2Scope()) return;

    document.querySelectorAll(".ux-wayfinder, .ux-wayfinder-grid, .ux-wayfinder-card, .ux-related-list").forEach(function (node) {
        node.remove();
    });

    const forbiddenHeadings = [
        "proxima acao",
        "paginas relacionadas",
        "relacionados",
        "next action",
        "related pages",
        "proxima accion"
    ];

    document.querySelectorAll("main section, main article, main aside, main div").forEach(function (container) {
        const heading = container.querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6");
        if (!heading) return;

        const normalizedHeading = normalizeTextValue(heading.textContent);
        if (forbiddenHeadings.indexOf(normalizedHeading) === -1) return;

        container.remove();
    });
}

function enforceKpiWayfinderLock() {
    if (!isKpiV2Scope()) return;

    removeKpiWayfinderArtifacts();

    if (window.__kpiWayfinderObserverActive) return;
    if (typeof MutationObserver !== "function" || !document.body) return;

    const observer = new MutationObserver(function () {
        removeKpiWayfinderArtifacts();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.__kpiWayfinderObserverActive = true;
}

function initializeLanguageSelector() {
    if (!window.PlaybookI18n || !window.playbookSetLocale) return;
    if (document.getElementById("playbookLanguageSelector")) return;

    const target = document.querySelector(".header .header-container");
    if (!target) return;

    window.PlaybookI18n.renderLanguageSelector({
        target: target,
        selectorId: "playbookLanguageSelector",
        wrapperClass: "language-selector-wrap",
        labelClass: "language-selector-label",
        inputClass: "language-selector-input"
    });
}

function initializeNavigationScroll() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");
    if (!sections.length || !navLinks.length) return;

    window.addEventListener("scroll", function () {
        let current = "";

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 140) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            const active = href === "#" + current;
            link.classList.toggle("active", active);
            if (active) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    });
}

function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const header = document.querySelector(".header");
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight - 8;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

function normalizePath(path) {
    return String(path || "")
        .replace(/\\/g, "/")
        .replace(/\/+$/, "")
        .toLowerCase();
}

function toAbsolutePath(href) {
    try {
        return normalizePath(new URL(href, window.location.href).pathname);
    } catch (_error) {
        return "";
    }
}

function injectCompactLocalNav() {
    const main = document.querySelector("main");
    if (!main) return;
    if (document.querySelector(".internal-local-nav")) return;

    const links = collectTopNavCandidates();
    if (links.length < 2) return;

    const section = document.createElement("section");
    section.className = "internal-local-nav";

    const container = document.createElement("div");
    container.className = "container";

    const title = document.createElement("p");
    title.className = "internal-local-nav-title";
    title.textContent = getI18n().t("common.ux.pageNavigation", "Navegação desta página");

    const list = document.createElement("div");
    list.className = "internal-local-nav-list";

    links.forEach(function (item) {
        const anchor = document.createElement("a");
        anchor.className = "internal-local-nav-link";
        anchor.href = item.href;
        anchor.textContent = item.label;
        if (item.absPath === normalizePath(window.location.pathname)) {
            anchor.setAttribute("aria-current", "page");
        }
        list.appendChild(anchor);
    });

    container.appendChild(title);
    container.appendChild(list);
    section.appendChild(container);

    const hero = main.querySelector(":scope > .hero, :scope > .module-hero, :scope > .dashboard-hero, :scope > .kpi-hero");
    if (hero) {
        hero.insertAdjacentElement("afterend", section);
        return;
    }

    main.insertAdjacentElement("afterbegin", section);
}

function collectTopNavCandidates() {
    const links = document.querySelectorAll("main a[href], .header-nav a[href]");
    const seen = {};
    const currentPath = normalizePath(window.location.pathname);
    const candidates = [];

    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;
        if (/^https?:/i.test(href)) return;

        const absPath = toAbsolutePath(href);
        if (!absPath || !absPath.endsWith(".html")) return;
        if (seen[absPath]) return;

        const label = (link.textContent || "").replace(/\s+/g, " ").trim();
        if (!label || label.length < 3) return;

        seen[absPath] = true;
        candidates.push({
            href: href,
            absPath: absPath,
            label: label
        });
    });

    candidates.sort(function (a, b) {
        if (a.absPath === currentPath) return -1;
        if (b.absPath === currentPath) return 1;
        return a.label.localeCompare(b.label);
    });

    return candidates.slice(0, 8);
}

function collectInternalCandidates() {
    const currentPath = normalizePath(window.location.pathname);
    const seen = {};
    const candidates = [];

    const links = document.querySelectorAll("main a[href], .header-nav a[href]");

    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;
        if (/^https?:/i.test(href)) return;

        const absPath = toAbsolutePath(href);
        if (!absPath || absPath === currentPath) return;
        if (!absPath.endsWith(".html")) return;
        if (seen[absPath]) return;

        const text = (link.textContent || "").trim();
        if (!text) return;

        seen[absPath] = true;
        candidates.push({
            href: href,
            label: text,
            score: getLinkPriority(link)
        });
    });

    candidates.sort(function (a, b) {
        return b.score - a.score;
    });

    return candidates;
}

function getLinkPriority(link) {
    if (!link || !link.classList) return 1;
    if (link.classList.contains("btn-primary")) return 5;
    if (link.classList.contains("btn-secondary")) return 4;
    if (link.classList.contains("nav-link")) return 2;
    return 1;
}

function renderWayfinder(i18n) {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer.footer");
    if (!main || !footer) return;
    if (document.querySelector(".ux-wayfinder")) return;

    const candidates = collectInternalCandidates();
    if (!candidates.length) return;

    const next = candidates[0];
    const related = candidates.slice(1, 4);

    const section = document.createElement("section");
    section.className = "ux-wayfinder";

    const container = document.createElement("div");
    container.className = "container";

    const grid = document.createElement("div");
    grid.className = "ux-wayfinder-grid";

    const nextCard = document.createElement("article");
    nextCard.className = "ux-wayfinder-card is-next";
    nextCard.innerHTML = "<h3>" +
        i18n.t("common.ux.nextAction.title", "Proxima acao") +
        "</h3><p>" +
        i18n.t("common.ux.nextAction.description", "Continue com a proxima etapa recomendada.") +
        "</p>";

    const nextLink = document.createElement("a");
    nextLink.className = "btn btn-primary";
    nextLink.href = next.href;
    nextLink.textContent = next.label;
    nextCard.appendChild(nextLink);

    grid.appendChild(nextCard);

    if (related.length) {
        const relatedCard = document.createElement("article");
        relatedCard.className = "ux-wayfinder-card";
        relatedCard.innerHTML = "<h3>" + i18n.t("common.ux.related.title", "Paginas relacionadas") + "</h3>";

        const list = document.createElement("ul");
        list.className = "ux-related-list";
        related.forEach(function (item) {
            const li = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.href = item.href;
            anchor.textContent = item.label;
            li.appendChild(anchor);
            list.appendChild(li);
        });

        relatedCard.appendChild(list);
        grid.appendChild(relatedCard);
    }

    container.appendChild(grid);
    section.appendChild(container);

    main.parentNode.insertBefore(section, footer);
}

function markCurrentLocalLinks() {
    const currentPath = normalizePath(window.location.pathname);
    const localLinks = document.querySelectorAll(".header-nav a[href], .nav-link[href], .btn[href]");

    localLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;

        const linkPath = toAbsolutePath(href);
        if (!linkPath) return;

        if (linkPath === currentPath) {
            link.setAttribute("aria-current", "page");
            link.classList.add("is-current");
        }
    });
}

function applyWayfindingLayer() {
    if (isKpiV2Scope()) return;

    const i18n = getI18n();
    renderWayfinder(i18n);
}
