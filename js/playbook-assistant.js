(function () {
    "use strict";

    if (window.__PlaybookAssistantInitialized) return;
    window.__PlaybookAssistantInitialized = true;

    var MAX_RESULTS = 8;
    var DEFAULT_LOCALE_KEY = "ptBR";
    var DEFAULT_RESULT_IDS = [
        "flow-what-is",
        "flow-official-status",
        "rules-auto-distribution",
        "priority-matrix",
        "priority-zero-hour",
        "fields-what",
        "fields-consolidated-matrix",
        "gov-fields-impact-kpis"
    ];

    var UI_TEXT = {
        ptBR: {
            fabLabel: "Ajuda",
            fabAria: "Abrir assistente local do playbook",
            title: "Assistente do Playbook",
            subtitle: "Encontre respostas rapidas sobre fluxo, prioridade, campos e governanca.",
            searchLabel: "Buscar",
            searchPlaceholder: "Busque por status, prioridade, campos, SLA...",
            suggestionsTitle: "Sugestoes rapidas",
            resultsTitle: "Resultados",
            noResults: "Nenhum resultado encontrado",
            openPage: "Abrir pagina",
            close: "Fechar",
            clearSearch: "Limpar busca",
            showing: "Mostrando {shown} de {total} resultados",
            localDataUnavailable: "Base local indisponivel no momento.",
            quickSuggestions: [
                { label: "Fluxo Global", query: "fluxo global" },
                { label: "Status", query: "status" },
                { label: "Prioridade", query: "prioridade" },
                { label: "Campos obrigatorios", query: "campos" },
                { label: "SLA", query: "sla" },
                { label: "Zero hora", query: "zero hora" },
                { label: "Matriz consolidada", query: "matriz consolidada" },
                { label: "Regras e automacoes", query: "regras" }
            ]
        },
        en: {
            fabLabel: "Help",
            fabAria: "Open playbook local assistant",
            title: "Playbook Assistant",
            subtitle: "Find quick answers about flow, priority, fields and governance.",
            searchLabel: "Search",
            searchPlaceholder: "Search for status, priority, fields, SLA...",
            suggestionsTitle: "Quick suggestions",
            resultsTitle: "Results",
            noResults: "No results found",
            openPage: "Open page",
            close: "Close",
            clearSearch: "Clear search",
            showing: "Showing {shown} of {total} results",
            localDataUnavailable: "Local knowledge base is currently unavailable.",
            quickSuggestions: [
                { label: "Global Flow", query: "global flow" },
                { label: "Status", query: "status" },
                { label: "Priority", query: "priority" },
                { label: "Required fields", query: "required fields" },
                { label: "SLA", query: "sla" },
                { label: "Zero hour", query: "zero hour" },
                { label: "Consolidated matrix", query: "consolidated matrix" },
                { label: "Rules and automation", query: "rules" }
            ]
        },
        es: {
            fabLabel: "Ayuda",
            fabAria: "Abrir asistente local del playbook",
            title: "Asistente del Playbook",
            subtitle: "Encuentra respuestas rapidas sobre flujo, prioridad, campos y gobernanza.",
            searchLabel: "Buscar",
            searchPlaceholder: "Busca por estado, prioridad, campos, SLA...",
            suggestionsTitle: "Sugerencias rapidas",
            resultsTitle: "Resultados",
            noResults: "No se encontraron resultados",
            openPage: "Abrir pagina",
            close: "Cerrar",
            clearSearch: "Limpiar busqueda",
            showing: "Mostrando {shown} de {total} resultados",
            localDataUnavailable: "Base local no disponible en este momento.",
            quickSuggestions: [
                { label: "Flujo Global", query: "flujo global" },
                { label: "Estado", query: "estado" },
                { label: "Prioridad", query: "prioridad" },
                { label: "Campos obligatorios", query: "campos obligatorios" },
                { label: "SLA", query: "sla" },
                { label: "Hora cero", query: "hora cero" },
                { label: "Matriz consolidada", query: "matriz consolidada" },
                { label: "Reglas y automatizaciones", query: "reglas" }
            ]
        }
    };

    function getAssistantData() {
        var data = window.PlaybookAssistantData || {};
        var items = Array.isArray(data.items) ? data.items : [];
        var modules = data.modules && typeof data.modules === "object" ? data.modules : {};
        return { items: items, modules: modules };
    }

    function getLocaleKey() {
        var raw = "";

        if (window.PlaybookI18n && typeof window.PlaybookI18n.getLocale === "function") {
            raw = window.PlaybookI18n.getLocale() || "";
        }

        if (!raw) {
            try {
                raw = window.localStorage.getItem("playbookLocale") || "";
            } catch (_error) {
                raw = "";
            }
        }

        if (!raw && document.documentElement) {
            raw = document.documentElement.lang || "";
        }

        if (!raw && window.navigator) {
            raw = window.navigator.language || "";
        }

        var normalized = String(raw || "").toLowerCase();

        if (normalized.indexOf("en") === 0) return "en";
        if (normalized.indexOf("es") === 0) return "es";
        return DEFAULT_LOCALE_KEY;
    }

    function getUiText(localeKey) {
        return UI_TEXT[localeKey] || UI_TEXT[DEFAULT_LOCALE_KEY];
    }

    function normalizeText(value) {
        var text = String(value || "").toLowerCase();

        if (typeof text.normalize === "function") {
            text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        return text
            .replace(/[^a-z0-9\s-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function getLocalizedValue(source, localeKey, fallbackValue) {
        if (source && typeof source === "object") {
            return source[localeKey] || source.ptBR || source.en || source.es || fallbackValue || "";
        }
        return fallbackValue || "";
    }

    function getItemTitle(item, localeKey) {
        return getLocalizedValue(item.q, localeKey, item.id || "Sem titulo");
    }

    function getItemAnswer(item, localeKey) {
        return getLocalizedValue(item.a, localeKey, "");
    }

    function getModuleName(item, localeKey, modules) {
        var moduleMap = modules[item.module] || null;
        return getLocalizedValue(moduleMap, localeKey, item.module || "");
    }

    function getTags(item) {
        return Array.isArray(item.tags) ? item.tags : [];
    }

    function scoreLocalized(item, localeKey, modules, queryNorm, queryTokens) {
        var title = normalizeText(getItemTitle(item, localeKey));
        var answer = normalizeText(getItemAnswer(item, localeKey));
        var moduleName = normalizeText(getModuleName(item, localeKey, modules));
        var tags = getTags(item).map(normalizeText);

        var score = 0;
        if (!queryNorm) return 0;

        if (title === queryNorm) score += 1100;
        if (title.indexOf(queryNorm) === 0) score += 760;
        if (title.indexOf(queryNorm) >= 0) score += 520;

        for (var i = 0; i < tags.length; i += 1) {
            if (!tags[i]) continue;
            if (tags[i] === queryNorm) score += 460;
            else if (tags[i].indexOf(queryNorm) >= 0) score += 330;
        }

        if (moduleName.indexOf(queryNorm) >= 0) score += 260;
        if (answer.indexOf(queryNorm) >= 0) score += 140;

        for (var j = 0; j < queryTokens.length; j += 1) {
            var token = queryTokens[j];
            if (!token || token.length < 2) continue;

            var hit = false;
            if (title.indexOf(token) >= 0) {
                score += 80;
                hit = true;
            }

            if (moduleName.indexOf(token) >= 0) {
                score += 55;
                hit = true;
            }

            for (var k = 0; k < tags.length; k += 1) {
                if (tags[k].indexOf(token) >= 0) {
                    score += 60;
                    hit = true;
                    break;
                }
            }

            if (answer.indexOf(token) >= 0) {
                score += 22;
                hit = true;
            }

            if (!hit) {
                score -= 16;
            }
        }

        return score;
    }

    function searchItems(items, modules, query, localeKey) {
        var queryNorm = normalizeText(query);
        var queryTokens = queryNorm.split(" ");
        var matches = [];

        for (var i = 0; i < items.length; i += 1) {
            var item = items[i];
            var score = scoreLocalized(item, localeKey, modules, queryNorm, queryTokens);

            if (score <= 0) {
                var fallbackLocales = ["ptBR", "en", "es"];
                for (var j = 0; j < fallbackLocales.length; j += 1) {
                    var alt = fallbackLocales[j];
                    if (alt === localeKey) continue;
                    var altScore = scoreLocalized(item, alt, modules, queryNorm, queryTokens);
                    if (altScore > 0) {
                        score = Math.max(score, Math.floor(altScore * 0.75));
                    }
                }
            }

            if (score > 0) {
                matches.push({ item: item, score: score });
            }
        }

        matches.sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;

            var aTitle = getItemTitle(a.item, localeKey);
            var bTitle = getItemTitle(b.item, localeKey);
            return aTitle.localeCompare(bTitle);
        });

        return {
            total: matches.length,
            results: matches.slice(0, MAX_RESULTS)
        };
    }

    function getDefaultResults(items) {
        var picked = [];
        var seen = {};

        for (var i = 0; i < DEFAULT_RESULT_IDS.length; i += 1) {
            var targetId = DEFAULT_RESULT_IDS[i];
            var found = null;

            for (var j = 0; j < items.length; j += 1) {
                if (items[j].id === targetId) {
                    found = items[j];
                    break;
                }
            }

            if (found && !seen[found.id]) {
                seen[found.id] = true;
                picked.push({ item: found, score: 0 });
            }
        }

        for (var k = 0; k < items.length && picked.length < MAX_RESULTS; k += 1) {
            if (seen[items[k].id]) continue;
            seen[items[k].id] = true;
            picked.push({ item: items[k], score: 0 });
        }

        return {
            total: picked.length,
            results: picked.slice(0, MAX_RESULTS)
        };
    }

    function getAssistantBasePath() {
        if (typeof window.PlaybookAssistantBasePath === "string" && window.PlaybookAssistantBasePath) {
            return window.PlaybookAssistantBasePath;
        }

        var scripts = document.querySelectorAll("script[src]");
        for (var i = scripts.length - 1; i >= 0; i -= 1) {
            var src = scripts[i].src || "";
            if (/\/js\/playbook-assistant\.js(?:\?|#|$)/i.test(src)) {
                try {
                    return new URL("../", src).href;
                } catch (_error) {
                    break;
                }
            }
        }

        try {
            return new URL("./", window.location.href).href;
        } catch (_errorFallback) {
            return "";
        }
    }

    function resolveHref(href) {
        if (!href) return "#";
        if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) return href;

        try {
            return new URL(href, getAssistantBasePath()).href;
        } catch (_error) {
            return href;
        }
    }

    function createElement(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    function mountAssistant() {
        if (!document.body) return;
        if (document.getElementById("playbookAssistantRoot")) return;

        var localeKey = getLocaleKey();
        var ui = getUiText(localeKey);
        var data = getAssistantData();

        var root = createElement("div", "playbook-assistant-root");
        root.id = "playbookAssistantRoot";

        var fab = createElement("button", "playbook-assistant-fab");
        fab.type = "button";
        fab.setAttribute("aria-label", ui.fabAria);
        fab.setAttribute("aria-controls", "playbookAssistantPanel");
        fab.setAttribute("aria-expanded", "false");

        var fabIcon = createElement("span", "playbook-assistant-fab-icon", "?");
        fabIcon.setAttribute("aria-hidden", "true");
        var fabLabel = createElement("span", "playbook-assistant-fab-label", ui.fabLabel);
        fab.appendChild(fabIcon);
        fab.appendChild(fabLabel);

        var backdrop = createElement("button", "playbook-assistant-backdrop");
        backdrop.type = "button";
        backdrop.setAttribute("aria-label", ui.close);

        var panel = createElement("aside", "playbook-assistant-panel");
        panel.id = "playbookAssistantPanel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "false");
        panel.setAttribute("aria-hidden", "true");

        var header = createElement("header", "playbook-assistant-header");
        var titleWrap = createElement("div", "playbook-assistant-title-wrap");
        var title = createElement("h2", "playbook-assistant-title", ui.title);
        title.id = "playbookAssistantTitle";
        var subtitle = createElement("p", "playbook-assistant-subtitle", ui.subtitle);
        titleWrap.appendChild(title);
        titleWrap.appendChild(subtitle);

        var closeButton = createElement("button", "playbook-assistant-close", ui.close);
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", ui.close);

        header.appendChild(titleWrap);
        header.appendChild(closeButton);

        var searchArea = createElement("div", "playbook-assistant-search-area");
        var searchLabel = createElement("label", "playbook-assistant-sr-only", ui.searchLabel);
        searchLabel.setAttribute("for", "playbookAssistantSearchInput");
        var searchInput = createElement("input", "playbook-assistant-search-input");
        searchInput.id = "playbookAssistantSearchInput";
        searchInput.type = "search";
        searchInput.setAttribute("autocomplete", "off");
        searchInput.setAttribute("placeholder", ui.searchPlaceholder);
        searchInput.setAttribute("aria-label", ui.searchLabel);

        var clearButton = createElement("button", "playbook-assistant-clear", ui.clearSearch);
        clearButton.type = "button";
        clearButton.setAttribute("aria-label", ui.clearSearch);
        clearButton.hidden = true;

        searchArea.appendChild(searchLabel);
        searchArea.appendChild(searchInput);
        searchArea.appendChild(clearButton);

        var suggestionsSection = createElement("section", "playbook-assistant-suggestions");
        var suggestionsTitle = createElement("h3", "playbook-assistant-section-title", ui.suggestionsTitle);
        var suggestionsList = createElement("div", "playbook-assistant-suggestions-list");
        suggestionsSection.appendChild(suggestionsTitle);
        suggestionsSection.appendChild(suggestionsList);

        var resultsSection = createElement("section", "playbook-assistant-results");
        var resultsHeader = createElement("div", "playbook-assistant-results-head");
        var resultsTitle = createElement("h3", "playbook-assistant-section-title", ui.resultsTitle);
        var resultsMeta = createElement("p", "playbook-assistant-results-meta", "");
        resultsHeader.appendChild(resultsTitle);
        resultsHeader.appendChild(resultsMeta);

        var resultsList = createElement("div", "playbook-assistant-results-list");
        resultsSection.appendChild(resultsHeader);
        resultsSection.appendChild(resultsList);

        panel.appendChild(header);
        panel.appendChild(searchArea);
        panel.appendChild(suggestionsSection);
        panel.appendChild(resultsSection);

        root.appendChild(fab);
        root.appendChild(backdrop);
        root.appendChild(panel);

        document.body.appendChild(root);

        function setOpen(nextOpen) {
            var isOpen = !!nextOpen;
            root.classList.toggle("is-open", isOpen);
            panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
            fab.setAttribute("aria-expanded", isOpen ? "true" : "false");
            document.body.classList.toggle("playbook-assistant-open", isOpen);

            if (isOpen) {
                window.setTimeout(function () {
                    searchInput.focus();
                }, 40);
            }
        }

        function renderSuggestions(currentQueryNorm) {
            suggestionsList.innerHTML = "";
            suggestionsSection.hidden = currentQueryNorm.length > 0;
            if (suggestionsSection.hidden) return;

            var quick = ui.quickSuggestions || [];
            for (var i = 0; i < quick.length; i += 1) {
                var suggestion = quick[i];
                var button = createElement("button", "playbook-assistant-suggestion", suggestion.label);
                button.type = "button";
                button.setAttribute("data-query", suggestion.query);
                button.addEventListener("click", function (event) {
                    var query = event.currentTarget.getAttribute("data-query") || "";
                    searchInput.value = query;
                    renderContent(query);
                    searchInput.focus();
                });
                suggestionsList.appendChild(button);
            }
        }

        function createResultCard(resultWrap, index) {
            var item = resultWrap.item;
            var card = createElement("article", "playbook-assistant-result-card");

            var toggle = createElement("button", "playbook-assistant-result-toggle");
            toggle.type = "button";
            toggle.setAttribute("aria-expanded", "false");
            var bodyId = "playbookAssistantResultBody-" + index;
            toggle.setAttribute("aria-controls", bodyId);

            var titleNode = createElement("span", "playbook-assistant-result-title", getItemTitle(item, localeKey));
            var moduleNode = createElement("span", "playbook-assistant-result-module", getModuleName(item, localeKey, data.modules));

            toggle.appendChild(titleNode);
            toggle.appendChild(moduleNode);

            var body = createElement("div", "playbook-assistant-result-body");
            body.id = bodyId;
            body.hidden = true;

            var answer = createElement("p", "playbook-assistant-result-answer", getItemAnswer(item, localeKey));
            body.appendChild(answer);

            var tags = getTags(item);
            if (tags.length) {
                var tagsWrap = createElement("div", "playbook-assistant-result-tags");
                for (var i = 0; i < tags.length; i += 1) {
                    tagsWrap.appendChild(createElement("span", "playbook-assistant-tag", tags[i]));
                }
                body.appendChild(tagsWrap);
            }

            var link = createElement("a", "playbook-assistant-result-link", ui.openPage);
            link.href = resolveHref(item.href);
            body.appendChild(link);

            toggle.addEventListener("click", function () {
                var expanded = toggle.getAttribute("aria-expanded") === "true";
                toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
                body.hidden = expanded;
            });

            card.appendChild(toggle);
            card.appendChild(body);
            return card;
        }

        function renderContent(query) {
            var queryNorm = normalizeText(query);
            var response;

            clearButton.hidden = !queryNorm;
            renderSuggestions(queryNorm);

            if (!data.items.length) {
                resultsMeta.textContent = "";
                resultsList.innerHTML = "";
                var unavailable = createElement("p", "playbook-assistant-empty", ui.localDataUnavailable);
                resultsList.appendChild(unavailable);
                return;
            }

            if (queryNorm) {
                response = searchItems(data.items, data.modules, queryNorm, localeKey);
            } else {
                response = getDefaultResults(data.items);
            }

            resultsList.innerHTML = "";

            if (!response.results.length) {
                resultsMeta.textContent = "";
                resultsList.appendChild(createElement("p", "playbook-assistant-empty", ui.noResults));
                return;
            }

            if (response.total > response.results.length) {
                resultsMeta.textContent = ui.showing
                    .replace("{shown}", String(response.results.length))
                    .replace("{total}", String(response.total));
            } else {
                resultsMeta.textContent = "";
            }

            for (var i = 0; i < response.results.length; i += 1) {
                resultsList.appendChild(createResultCard(response.results[i], i));
            }
        }

        fab.addEventListener("click", function () {
            var next = !root.classList.contains("is-open");
            setOpen(next);
        });

        closeButton.addEventListener("click", function () {
            setOpen(false);
            fab.focus();
        });

        backdrop.addEventListener("click", function () {
            setOpen(false);
            fab.focus();
        });

        clearButton.addEventListener("click", function () {
            searchInput.value = "";
            renderContent("");
            searchInput.focus();
        });

        searchInput.addEventListener("input", function () {
            renderContent(searchInput.value || "");
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && root.classList.contains("is-open")) {
                setOpen(false);
                fab.focus();
            }
        });

        renderContent("");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountAssistant);
    } else {
        mountAssistant();
    }
})();
