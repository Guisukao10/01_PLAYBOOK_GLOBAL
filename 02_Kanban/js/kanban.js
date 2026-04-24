(function () {
    const OFFICIAL_KANBAN_DATA = {
        nav: [
            { label: "Visao Geral", href: "index.html" },
            { label: "Status e Objetivos", href: "estrutura.html" },
            { label: "Regras e Gestao", href: "regras.html" }
        ],
        statuses: [
            {
                key: "aberto",
                title: "Aberto",
                lane: "ativo",
                objective: "Registrar o ticket e deixa-lo pronto para triagem.",
                when: "Na abertura, com informacoes minimas para iniciar o atendimento.",
                correctStay: "Permanencia curta ate o primeiro tratamento.",
                risk: "Ficar parado aqui vira backlog oculto de entrada."
            },
            {
                key: "em_atendimento",
                title: "Em Atendimento",
                lane: "ativo",
                objective: "Executar trabalho tecnico real no ticket.",
                when: "Somente enquanto existe acao efetiva em andamento.",
                correctStay: "Atualizacoes frequentes e avancos concretos.",
                risk: "Usar como status generico mascara filas de espera."
            },
            {
                key: "aguardando_cliente",
                title: "Aguardando Cliente",
                lane: "espera",
                objective: "Aguardar retorno ou acao do cliente.",
                when: "Quando o proximo passo depende objetivamente do cliente.",
                correctStay: "Com motivo claro de espera e contexto registrado.",
                risk: "Espera sem contexto reduz controle de aging e SLA."
            },
            {
                key: "aguardando_peca",
                title: "Aguardando Peca",
                lane: "espera",
                objective: "Aguardar peca, material ou logistica para continuidade.",
                when: "Quando a execucao depende de disponibilidade fisica de itens.",
                correctStay: "Com pedido rastreavel e previsao de chegada monitorada.",
                risk: "Sem controle, aumenta aging sem visibilidade de causa."
            },
            {
                key: "aguardando_terceiro",
                title: "Aguardando Terceiro / Visita Tecnica",
                lane: "espera",
                objective: "Aguardar atuacao de terceiro ou visita tecnica responsavel.",
                when: "Quando o ticket depende de assistencia tecnica/terceiro, interno ou externo.",
                correctStay: "Com dependencia registrada e previsao de retorno acompanhada.",
                risk: "Sem controle de dependencia, o gargalo fica invisivel."
            },
            {
                key: "resolvido",
                title: "Resolvido",
                lane: "final",
                objective: "Registrar solucao aplicada antes do encerramento definitivo.",
                when: "Quando a tratativa terminou, mas ainda esta em validacao de fechamento.",
                correctStay: "Com resumo claro da solucao e evidencias da conclusao.",
                risk: "Pular esta etapa distorce leitura de retrabalho e qualidade."
            },
            {
                key: "fechado",
                title: "Fechado",
                lane: "final",
                objective: "Formalizar encerramento com registro minimo de resolucao.",
                when: "Apos passar por Resolvido e validar condicoes de fechamento.",
                correctStay: "Ticket concluido, com trilha de encerramento consistente.",
                risk: "Fechar cedo distorce SLA e gera retrabalho por reabertura."
            }
        ],
        languageRows: [
            { pt: "Aberto", en: "Open", es: "Abierto" },
            { pt: "Em Atendimento", en: "In Service", es: "En Atencion" },
            { pt: "Aguardando Cliente", en: "Waiting for Customer", es: "En Espera del Cliente" },
            { pt: "Aguardando Peca", en: "Waiting for Parts", es: "En Espera de Repuestos" },
            { pt: "Aguardando Terceiro / Visita Tecnica", en: "Waiting for Third Party / Technical Visit", es: "En Espera de Tercero / Visita Tecnica" },
            { pt: "Resolvido", en: "Resolved", es: "Resuelto" },
            { pt: "Fechado", en: "Closed", es: "Cerrado" }
        ],
        validTransitions: [
            "Entrada -> Aberto -> Em Atendimento",
            "Em Atendimento -> Aguardando Cliente",
            "Em Atendimento -> Aguardando Peca",
            "Em Atendimento -> Aguardando Terceiro / Visita Tecnica",
            "Em Atendimento -> Resolvido",
            "Aguardando Cliente -> Em Atendimento",
            "Aguardando Peca -> Em Atendimento",
            "Aguardando Terceiro / Visita Tecnica -> Em Atendimento",
            "Resolvido -> Fechado"
        ],
        avoidMoves: [
            "Aberto -> Fechado sem tratamento real",
            "Usar Em Atendimento sem acao efetiva",
            "Mover para espera sem contexto minimo",
            "Fechar ticket sem passar por Resolvido",
            "Movimentacao por perfis fora do suporte tecnico interno"
        ],
        managementSignals: [
            {
                topic: "Backlog ativo",
                reading: "Volume alto em Aberto/Em Atendimento sem giro diario.",
                action: "Priorizar triagem e rebalancear capacidade da fila ativa."
            },
            {
                topic: "Gargalo de espera",
                reading: "Concentracao em Aguardando Cliente, Terceiro/Visita Tecnica ou Peca.",
                action: "Atuar no bloqueio dominante e monitorar tempo de espera."
            },
            {
                topic: "Aging",
                reading: "Tickets envelhecendo em uma mesma coluna.",
                action: "Abrir plano de ataque por causa raiz da etapa."
            },
            {
                topic: "SLA",
                reading: "Tempo de resposta/resolucao pressionado por filas erradas.",
                action: "Corrigir status para recuperar leitura real de cumprimento."
            }
        ]
    };

    const i18n = window.PlaybookI18n || {
        t: function (_key, fallback) {
            return fallback;
        }
    };

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

    const KANBAN_DATA = i18n.t("kanban.data", OFFICIAL_KANBAN_DATA);

    function getCurrentPage() {
        const parts = window.location.pathname.split("/");
        return parts[parts.length - 1] || "index.html";
    }

    function renderModuleNav() {
        const target = document.querySelector("[data-kanban-nav]");
        if (!target) {
            return;
        }

        const current = getCurrentPage();
        target.replaceChildren();

        KANBAN_DATA.nav.forEach((item) => {
            const link = document.createElement("a");
            link.className = "module-nav-link";
            if (item.href === current) {
                link.classList.add("active");
            }
            setSafeHref(link, item.href, "#");
            link.textContent = item.label;
            target.appendChild(link);
        });
    }

    function renderStatusOrder(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        target.replaceChildren();

        KANBAN_DATA.statuses.forEach((status) => {
            const card = document.createElement("article");
            card.className = "status-sequence-card stage-panel-" + status.key;

            const badge = document.createElement("span");
            badge.className = "badge-stage stage-" + status.key;
            badge.textContent = status.title;
            card.appendChild(badge);

            const paragraph = document.createElement("p");
            paragraph.textContent = status.objective;
            card.appendChild(paragraph);

            target.appendChild(card);
        });
    }

    function renderStatusByLane(targetSelector, lane) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        target.replaceChildren();

        KANBAN_DATA.statuses
            .filter((status) => status.lane === lane)
            .forEach((status) => {
                const item = document.createElement("li");
                const badge = document.createElement("span");
                badge.className = "badge-stage stage-" + status.key;
                badge.textContent = status.title;
                item.appendChild(badge);
                target.appendChild(item);
            });
    }

    function renderStatusObjectiveCards() {
        const target = document.querySelector("[data-kanban-objective-cards]");
        if (!target) {
            return;
        }

        target.replaceChildren();

        KANBAN_DATA.statuses.forEach((status) => {
            const card = document.createElement("article");
            card.id = status.key;
            card.className = "status-objective-card stage-panel-" + status.key;

            const badge = document.createElement("span");
            badge.className = "badge-stage stage-" + status.key;
            badge.textContent = status.title;
            card.appendChild(badge);

            const title = document.createElement("h3");
            title.textContent = status.title;
            card.appendChild(title);

            const objective = document.createElement("p");
            const objectiveLabel = document.createElement("strong");
            objectiveLabel.textContent = i18n.t("kanban.data.labels.objective", "Objetivo:");
            objective.appendChild(objectiveLabel);
            objective.appendChild(document.createTextNode(" " + status.objective));
            card.appendChild(objective);

            const when = document.createElement("p");
            const whenLabel = document.createElement("strong");
            whenLabel.textContent = i18n.t("kanban.data.labels.when", "Quando o ticket deve estar aqui:");
            when.appendChild(whenLabel);
            when.appendChild(document.createTextNode(" " + status.when));
            card.appendChild(when);

            const correctStay = document.createElement("p");
            const correctStayLabel = document.createElement("strong");
            correctStayLabel.textContent = i18n.t("kanban.data.labels.correctStay", "Permanencia correta:");
            correctStay.appendChild(correctStayLabel);
            correctStay.appendChild(document.createTextNode(" " + status.correctStay));
            card.appendChild(correctStay);

            const risk = document.createElement("p");
            const riskLabel = document.createElement("strong");
            riskLabel.textContent = i18n.t("kanban.data.labels.risk", "Risco de uso incorreto:");
            risk.appendChild(riskLabel);
            risk.appendChild(document.createTextNode(" " + status.risk));
            card.appendChild(risk);

            target.appendChild(card);
        });
    }

    function renderLanguageTable() {
        const target = document.querySelector("[data-kanban-language-table]");
        if (!target) {
            return;
        }

        target.replaceChildren();

        const wrap = document.createElement("div");
        wrap.className = "table-wrap";

        const table = document.createElement("table");
        table.className = "lang-table";

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        [
            i18n.t("kanban.data.labels.tablePt", "Portugues"),
            i18n.t("kanban.data.labels.tableEn", "English"),
            i18n.t("kanban.data.labels.tableEs", "Espanol")
        ].forEach((title) => {
            const th = document.createElement("th");
            th.textContent = title;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        const tbody = document.createElement("tbody");
        KANBAN_DATA.languageRows.forEach((row) => {
            const tr = document.createElement("tr");
            [row.pt, row.en, row.es].forEach((value) => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        wrap.appendChild(table);
        target.appendChild(wrap);
    }

    function renderExpectedTransitions() {
        const target = document.querySelector("[data-kanban-valid-transitions]");
        if (!target) {
            return;
        }

        target.replaceChildren();
        KANBAN_DATA.validTransitions.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            target.appendChild(li);
        });
    }

    function renderAvoidMoves() {
        const target = document.querySelector("[data-kanban-avoid-moves]");
        if (!target) {
            return;
        }

        target.replaceChildren();
        KANBAN_DATA.avoidMoves.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            target.appendChild(li);
        });
    }

    function renderManagementCards() {
        const target = document.querySelector("[data-kanban-management-cards]");
        if (!target) {
            return;
        }

        target.replaceChildren();

        KANBAN_DATA.managementSignals.forEach((item) => {
            const card = document.createElement("article");
            card.className = "executive-card management-card";

            const title = document.createElement("h3");
            title.textContent = item.topic;
            card.appendChild(title);

            const reading = document.createElement("p");
            const readingLabel = document.createElement("strong");
            readingLabel.textContent = i18n.t("kanban.data.labels.reading", "Como ler:");
            reading.appendChild(readingLabel);
            reading.appendChild(document.createTextNode(" " + item.reading));
            card.appendChild(reading);

            const action = document.createElement("p");
            const actionLabel = document.createElement("strong");
            actionLabel.textContent = i18n.t("kanban.data.labels.action", "Acao de gestao:");
            action.appendChild(actionLabel);
            action.appendChild(document.createTextNode(" " + item.action));
            card.appendChild(action);

            target.appendChild(card);
        });
    }

    function setupMainAnchorNav() {
        const body = document.body;
        if (!body || body.getAttribute("data-kanban-page") !== "main") {
            return;
        }

        const nav = document.querySelector("[data-kanban-anchor-nav]");
        if (!nav) {
            return;
        }

        const links = Array.from(nav.querySelectorAll("a[href^='#']"));
        if (!links.length) {
            return;
        }

        const targetMap = links
            .map((link) => {
                const hash = link.getAttribute("href");
                if (!hash) {
                    return null;
                }

                const section = document.querySelector(hash);
                if (!section) {
                    return null;
                }

                return { hash: hash.toLowerCase(), link: link, section: section };
            })
            .filter(Boolean);

        if (!targetMap.length) {
            return;
        }

        function activate(hash) {
            const normalized = (hash || "").toLowerCase();
            targetMap.forEach((item) => {
                const isActive = item.hash === normalized;
                item.link.classList.toggle("is-active", isActive);
                if (isActive) {
                    item.link.setAttribute("aria-current", "location");
                } else {
                    item.link.removeAttribute("aria-current");
                }
            });
        }

        targetMap.forEach((item) => {
            item.link.addEventListener("click", function (event) {
                event.preventDefault();
                item.section.scrollIntoView({ behavior: "smooth", block: "start" });
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, "", item.hash);
                } else {
                    window.location.hash = item.hash;
                }
                activate(item.hash);
            });
        });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            activate("#" + entry.target.id);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "-30% 0px -50% 0px",
                    threshold: 0.01
                }
            );

            targetMap.forEach((item) => observer.observe(item.section));
        }

        const initialHash = window.location.hash ? window.location.hash.toLowerCase() : targetMap[0].hash;
        activate(initialHash);
    }

    function isMainPageRuntime() {
        const body = document.body;
        return !!body && body.getAttribute("data-kanban-page") === "main";
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMainAnchorNav();

        // Main page runs only the official single-page experience.
        if (isMainPageRuntime()) {
            return;
        }

        // Legacy/support pages keep isolated rendering with the official 7-status model.
        renderModuleNav();
        renderStatusOrder("[data-kanban-status-order]");
        renderStatusByLane("[data-kanban-active-statuses]", "ativo");
        renderStatusByLane("[data-kanban-waiting-statuses]", "espera");
        renderStatusObjectiveCards();
        renderExpectedTransitions();
        renderAvoidMoves();
        renderLanguageTable();
        renderManagementCards();
    });
})();
