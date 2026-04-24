(function () {
    "use strict";

    const PAGE_NAME = "etapas-do-fluxo.html";
    const MODULE_HOME_PAGE = "etapas-do-fluxo.html";

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function normalizePath(path) {
        return String(path || "").replace(/\\/g, "/").toLowerCase();
    }

    function normalizeHref(href) {
        return normalizePath(String(href || "").split("#")[0].split("?")[0]);
    }

    function resolveModuleHref(href) {
        const normalized = normalizeHref(href);
        if (normalized === "index.html" || normalized.endsWith("/index.html")) {
            return MODULE_HOME_PAGE;
        }
        return href;
    }

    function slugify(value, fallback) {
        const base = String(value || fallback || "stage")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return base || String(fallback || "stage");
    }

    function createMiniList(items, emptyLabel) {
        const list = document.createElement("ul");
        list.className = "stg-mini-list";

        const entries = asArray(items);
        if (!entries.length) {
            const emptyItem = document.createElement("li");
            emptyItem.textContent = emptyLabel;
            list.appendChild(emptyItem);
            return list;
        }

        entries.forEach(function (item) {
            const li = document.createElement("li");
            li.textContent = String(item);
            list.appendChild(li);
        });

        return list;
    }

    function createTokenList(items, emptyLabel) {
        const list = document.createElement("ul");
        list.className = "stg-token-list";

        const entries = asArray(items);
        if (!entries.length) {
            const emptyItem = document.createElement("li");
            emptyItem.className = "stg-token stg-token-empty";
            emptyItem.textContent = emptyLabel;
            list.appendChild(emptyItem);
            return list;
        }

        entries.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "stg-token";
            li.textContent = String(item);
            list.appendChild(li);
        });

        return list;
    }

    function createInlineSummary(items, emptyLabel) {
        const entries = asArray(items);
        if (!entries.length) return emptyLabel;
        return entries.map(function (item) { return String(item); }).join(" | ");
    }

    function getI18n() {
        return window.PlaybookI18n || {
            t: function (_key, fallback) {
                return fallback;
            }
        };
    }

    function sanitizeHref(rawHref, fallback) {
        if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.sanitizeHref === "function") {
            return window.PlaybookLinkSecurity.sanitizeHref(rawHref, fallback);
        }

        const safeFallback = fallback === undefined ? "#" : fallback;
        const fallbackText = safeFallback === null ? null : String(safeFallback).trim();
        const href = String(rawHref === undefined || rawHref === null ? "" : rawHref).trim();

        if (!href) return fallbackText;
        if (href === "#" || href.charAt(0) === "#") return href;
        if (href.indexOf("//") === 0) return fallbackText;

        const compact = href.replace(/[\u0000-\u001F\u007F\s]+/g, "");
        const schemeMatch = compact.match(/^([a-z][a-z0-9+.-]*):/i);
        if (!schemeMatch) return href;

        const scheme = schemeMatch[1].toLowerCase();
        if (scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel") {
            return href;
        }

        return fallbackText;
    }

    function setSafeHref(element, rawHref, fallback) {
        if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.setHref === "function") {
            return window.PlaybookLinkSecurity.setHref(element, rawHref, fallback);
        }

        const safeHref = sanitizeHref(rawHref, fallback);
        if (!element) return safeHref;
        if (safeHref === null) {
            element.removeAttribute("href");
            return null;
        }

        element.href = safeHref;
        return safeHref;
    }

    function buildData(i18n) {
        const stagesPage = i18n.t("fluxoGlobal.stagesPage", {}) || {};
        const moduleData = i18n.t("fluxoGlobal.data", {}) || {};
        const nav = i18n.t("fluxoGlobal.nav", {}) || {};
        const labels = moduleData.labels || {};
        const detailLabels = stagesPage.labels || {};
        const infoLabels = stagesPage.infoLabels || {};

        return {
            moduleName: moduleData.moduleName || "Fluxo Global",
            pages: asArray(moduleData.pages),
            nav: nav,
            breadcrumbHome: labels.breadcrumbHome || "InÃ­cio",
            pagerPrevious: labels.pagerPrevious || "PÃ¡gina anterior:",
            pagerNext: labels.pagerNext || "PrÃ³xima pÃ¡gina:",
            pagerBackHome: labels.pagerBackHome || "Voltar para a home do mÃ³dulo",
            trackPrefix: labels.currentTrackPrefix || "Leitura atual:",
            overviewStages: asArray(moduleData.stages).map(function (item, index) {
                if (item && typeof item === "object") {
                    return {
                        id: item.id || "",
                        name: item.name || ("Etapa " + (index + 1))
                    };
                }

                return {
                    id: "",
                    name: String(item || ("Etapa " + (index + 1)))
                };
            }),
            details: stagesPage.details || {},
            detailTitle: (stagesPage.details && stagesPage.details.title) || "Etapas detalhadas",
            detailEmpty: (stagesPage.details && stagesPage.details.empty) || "NÃ£o aplicÃ¡vel nesta etapa.",
            detailLabels: {
                objective: detailLabels.objective || "Objetivo:",
                actors: detailLabels.actors || "Quem atua",
                happens: detailLabels.happens || "O que acontece nesta etapa",
                quickLine: detailLabels.quickLine || "Leitura rÃ¡pida",
                whenUse: detailLabels.whenUse || detailLabels.happens || "Quando usar / o que significa",
                stageInfo: detailLabels.stageInfo || "InformaÃ§Ãµes da etapa",
                notes: detailLabels.notes || "Regras e observaÃ§Ãµes rÃ¡pidas"
            },
            infoLabels: {
                automatic: infoLabels.automatic || "AutomÃ¡tico",
                required: infoLabels.required || "ObrigatÃ³rio",
                conditional: infoLabels.conditional || "Condicional",
                desirable: infoLabels.desirable || "DesejÃ¡vel"
            },
            finalNotes: stagesPage.finalNotes || {},
            currentTitle:
                (stagesPage.header && stagesPage.header.title) ||
                (stagesPage.hero && stagesPage.hero.title) ||
                "Etapas do Fluxo"
        };
    }

    function renderBreadcrumb(target, data) {
        if (!target) return;
        target.textContent = data.breadcrumbHome + " > " + data.moduleName + " > " + data.currentTitle;
    }

    function renderNav(target, data) {
        if (!target) return;

        const links = [
            {
                href: MODULE_HOME_PAGE,
                label: data.nav.home || "Fluxo Global",
                title: data.nav.homeTitle || ""
            },
            {
                href: PAGE_NAME,
                label: data.nav.flowRead || data.currentTitle,
                title: data.nav.flowReadTitle || ""
            },
        ];

        const shell = document.createElement("div");
        shell.className = "fluxo-nav-shell";

        const label = document.createElement("p");
        label.className = "fluxo-nav-shell-label";
        label.textContent = data.trackPrefix;
        shell.appendChild(label);

        const linksWrap = document.createElement("div");
        linksWrap.className = "fluxo-nav-shell-links";

        const current = normalizeHref(PAGE_NAME);
        links.forEach(function (item) {
            const anchor = document.createElement("a");
            anchor.className = "fluxo-nav-link fluxo-nav-link-core";
            setSafeHref(anchor, item.href, "#");
            anchor.textContent = item.label;
            if (item.title) {
                anchor.title = item.title;
            }

            if (normalizeHref(item.href).endsWith(current)) {
                anchor.classList.add("active");
                anchor.setAttribute("aria-current", "page");
            }

            linksWrap.appendChild(anchor);
        });

        shell.appendChild(linksWrap);
        target.replaceChildren();
        target.appendChild(shell);
    }

    function renderOverview(target, data, stageEntries) {
        if (!target) return;
        target.replaceChildren();

        stageEntries.forEach(function (stage, index) {
            const anchor = document.createElement("a");
            anchor.className = "stg-overview-chip stg-overview-link";
            setSafeHref(anchor, "#" + stage.id, "#");
            anchor.textContent = stage.title;
            if (index === 0) {
                anchor.setAttribute("aria-current", "location");
            }

            target.appendChild(anchor);
            if (index < stageEntries.length - 1) {
                const arrow = document.createElement("span");
                arrow.className = "stg-overview-arrow";
                arrow.setAttribute("aria-hidden", "true");
                arrow.textContent = "â†’";
                target.appendChild(arrow);
            }
        });

        if (!stageEntries.length && data.overviewStages.length) {
            data.overviewStages.forEach(function (stage, index) {
                const chip = document.createElement("span");
                chip.className = "stg-overview-chip";
                chip.textContent = stage.name;
                target.appendChild(chip);
                if (index < data.overviewStages.length - 1) {
                    const arrow = document.createElement("span");
                    arrow.className = "stg-overview-arrow";
                    arrow.setAttribute("aria-hidden", "true");
                    arrow.textContent = "â†’";
                    target.appendChild(arrow);
                }
            });
        }
    }

    function renderStageDetails(target, data) {
        if (!target) return;
        target.replaceChildren();

        const stages = asArray(data.details.stages);
        const stageEntries = [];

        stages.forEach(function (stage, index) {
            const stageId = String(stage && stage.id ? stage.id : slugify(stage && stage.title, "stage-" + (index + 1)));
            const stageTitle = String((stage && stage.title) || ("Etapa " + (index + 1)));
            stageEntries.push({ id: stageId, title: stageTitle });

            const card = document.createElement("article");
            card.className = "stg-stage-card";
            card.id = stageId;

            const actors = asArray(stage && stage.actors);
            const happens = asArray(stage && stage.happens);
            const stageMeaning = String(
                (stage && (stage.whenUse || stage.meaning)) ||
                createInlineSummary(happens, data.detailEmpty)
            );

            const head = document.createElement("header");
            head.className = "stg-stage-head";

            const title = document.createElement("h3");
            title.textContent = stageTitle;
            head.appendChild(title);

            const objective = document.createElement("p");
            objective.className = "stg-stage-objective";
            objective.textContent = data.detailLabels.objective + " " + String((stage && stage.objective) || data.detailEmpty);
            head.appendChild(objective);

            const meaning = document.createElement("p");
            meaning.className = "stg-stage-meaning";
            meaning.textContent = data.detailLabels.whenUse + " " + stageMeaning;
            head.appendChild(meaning);

            card.appendChild(head);

            const body = document.createElement("div");
            body.className = "stg-stage-body";

            const quickBlock = document.createElement("section");
            quickBlock.className = "stg-stage-quick";
            const quickTitle = document.createElement("h4");
            quickTitle.textContent = data.detailLabels.quickLine;
            quickBlock.appendChild(quickTitle);

            const quickGrid = document.createElement("div");
            quickGrid.className = "stg-quick-grid";

            const actorsBlock = document.createElement("div");
            actorsBlock.className = "stg-quick-item";
            const actorsTitle = document.createElement("p");
            actorsTitle.className = "stg-quick-label";
            actorsTitle.textContent = data.detailLabels.actors;
            actorsBlock.appendChild(actorsTitle);

            const actorRow = document.createElement("div");
            actorRow.className = "stg-actor-row";
            if (actors.length) {
                actors.forEach(function (actor) {
                    const chip = document.createElement("span");
                    chip.className = "stg-actor-chip";
                    chip.textContent = String(actor);
                    actorRow.appendChild(chip);
                });
            } else {
                const fallbackChip = document.createElement("span");
                fallbackChip.className = "stg-actor-chip";
                fallbackChip.textContent = data.detailEmpty;
                actorRow.appendChild(fallbackChip);
            }
            actorsBlock.appendChild(actorRow);
            quickGrid.appendChild(actorsBlock);

            const happensBlock = document.createElement("div");
            happensBlock.className = "stg-quick-item";
            const happensTitle = document.createElement("p");
            happensTitle.className = "stg-quick-label";
            happensTitle.textContent = data.detailLabels.whenUse;
            happensBlock.appendChild(happensTitle);
            const happensSummary = document.createElement("p");
            happensSummary.className = "stg-quick-text";
            happensSummary.textContent = stageMeaning;
            happensBlock.appendChild(happensSummary);
            quickGrid.appendChild(happensBlock);

            quickBlock.appendChild(quickGrid);
            body.appendChild(quickBlock);

            const infoBlock = document.createElement("section");
            infoBlock.className = "stg-stage-block";
            const infoTitle = document.createElement("h4");
            infoTitle.textContent = data.detailLabels.stageInfo;
            infoBlock.appendChild(infoTitle);

            const infoGrid = document.createElement("div");
            infoGrid.className = "stg-info-grid";
            const info = (stage && stage.info) || {};
            const infoGroups = [
                { key: "automatic", className: "stg-info-automatic" },
                { key: "required", className: "stg-info-required" },
                { key: "conditional", className: "stg-info-conditional" },
                { key: "desirable", className: "stg-info-desirable" }
            ];

            infoGroups.forEach(function (group) {
                const groupNode = document.createElement("article");
                groupNode.className = "stg-info-group " + group.className;
                const groupTitle = document.createElement("h5");
                groupTitle.textContent = String(data.infoLabels[group.key] || group.key);
                groupNode.appendChild(groupTitle);
                groupNode.appendChild(createTokenList(info[group.key], data.detailEmpty));
                infoGrid.appendChild(groupNode);
            });

            infoBlock.appendChild(infoGrid);
            body.appendChild(infoBlock);

            const notesBlock = document.createElement("section");
            notesBlock.className = "stg-stage-block stg-stage-notes";
            const notesTitle = document.createElement("h4");
            notesTitle.textContent = data.detailLabels.notes;
            notesBlock.appendChild(notesTitle);
            notesBlock.appendChild(createMiniList(stage && stage.notes, data.detailEmpty));
            body.appendChild(notesBlock);

            card.appendChild(body);
            target.appendChild(card);
        });

        return stageEntries;
    }

    function renderFinalNotes(target, data) {
        if (!target) return;
        target.replaceChildren();

        const title = document.createElement("h3");
        title.textContent = data.finalNotes.title || "Regras e observaÃ§Ãµes importantes";
        target.appendChild(title);

        const list = document.createElement("ul");
        list.className = "stg-final-list";

        const items = asArray(data.finalNotes.items);
        items.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "stg-final-chip";
            li.textContent = String(item);
            list.appendChild(li);
        });

        target.appendChild(list);
    }

    function createPagerLink(href, text) {
        if (!href || !text) return null;
        const safeHref = sanitizeHref(href, null);
        if (!safeHref) return null;

        const link = document.createElement("a");
        link.className = "fluxo-pager-link";
        link.href = safeHref;
        link.textContent = text;
        return link;
    }

    function renderPager(target, data) {
        if (!target) return;
        target.replaceChildren();

        const pages = asArray(data.pages);
        if (!pages.length) return;

        const currentIndex = pages.findIndex(function (page) {
            return normalizeHref(page && page.href).endsWith("/" + PAGE_NAME) || normalizeHref(page && page.href) === PAGE_NAME;
        });

        if (currentIndex < 0) return;

        const left = document.createElement("div");
        left.className = "fluxo-pager-slot";

        const center = document.createElement("div");
        center.className = "fluxo-pager-slot center";

        const right = document.createElement("div");
        right.className = "fluxo-pager-slot right";

        const previous = pages[currentIndex - 1];
        if (previous && previous.href && previous.label) {
            left.appendChild(
                createPagerLink(resolveModuleHref(previous.href), data.pagerPrevious + " " + previous.label)
            );
        }

        const home = pages[0];
        if (home && home.href) {
            center.appendChild(
                createPagerLink(resolveModuleHref(home.href), data.pagerBackHome)
            );
        }

        const next = pages[currentIndex + 1];
        if (next && next.href && next.label) {
            right.appendChild(
                createPagerLink(resolveModuleHref(next.href), data.pagerNext + " " + next.label)
            );
        }

        target.appendChild(left);
        target.appendChild(center);
        target.appendChild(right);
    }

    function init() {
        const body = document.body;
        if (!body) return;
        if (String(body.getAttribute("data-fluxo-page") || "").toLowerCase() !== PAGE_NAME) return;

        const i18n = getI18n();
        const data = buildData(i18n);

        renderBreadcrumb(document.querySelector("[data-fluxo-breadcrumb]"), data);
        renderNav(document.querySelector("[data-fluxo-nav]"), data);

        const stageEntries = renderStageDetails(
            document.querySelector("[data-fluxo-stage-details]"),
            data
        ) || [];

        renderOverview(
            document.querySelector("[data-fluxo-stages-overview]"),
            data,
            stageEntries
        );

        renderFinalNotes(
            document.querySelector("[data-fluxo-stages-final-rules]"),
            data
        );

        renderPager(document.querySelector("[data-fluxo-pager]"), data);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
        return;
    }

    init();
})();
