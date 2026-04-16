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
        target.innerHTML = KANBAN_DATA.nav
            .map((item) => {
                const isActive = item.href === current ? " active" : "";
                return `<a class="module-nav-link${isActive}" href="${item.href}">${item.label}</a>`;
            })
            .join("");
    }

    function renderStatusOrder(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.statuses
            .map(
                (status) => `
                    <article class="status-sequence-card stage-panel-${status.key}">
                        <span class="badge-stage stage-${status.key}">${status.title}</span>
                        <p>${status.objective}</p>
                    </article>
                `
            )
            .join("");
    }

    function renderStatusByLane(targetSelector, lane) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.statuses
            .filter((status) => status.lane === lane)
            .map((status) => `<li><span class="badge-stage stage-${status.key}">${status.title}</span></li>`)
            .join("");
    }

    function renderStatusObjectiveCards() {
        const target = document.querySelector("[data-kanban-objective-cards]");
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.statuses
            .map(
                (status) => `
                    <article id="${status.key}" class="status-objective-card stage-panel-${status.key}">
                        <span class="badge-stage stage-${status.key}">${status.title}</span>
                        <h3>${status.title}</h3>
                        <p><strong>${i18n.t("kanban.data.labels.objective", "Objetivo:")}</strong> ${status.objective}</p>
                        <p><strong>${i18n.t("kanban.data.labels.when", "Quando o ticket deve estar aqui:")}</strong> ${status.when}</p>
                        <p><strong>${i18n.t("kanban.data.labels.correctStay", "Permanencia correta:")}</strong> ${status.correctStay}</p>
                        <p><strong>${i18n.t("kanban.data.labels.risk", "Risco de uso incorreto:")}</strong> ${status.risk}</p>
                    </article>
                `
            )
            .join("");
    }

    function renderLanguageTable() {
        const target = document.querySelector("[data-kanban-language-table]");
        if (!target) {
            return;
        }

        const rows = KANBAN_DATA.languageRows
            .map((row) => `<tr><td>${row.pt}</td><td>${row.en}</td><td>${row.es}</td></tr>`)
            .join("");

        target.innerHTML = `
            <div class="table-wrap">
                <table class="lang-table">
                    <thead>
                        <tr>
                            <th>${i18n.t("kanban.data.labels.tablePt", "Portugues")}</th>
                            <th>${i18n.t("kanban.data.labels.tableEn", "English")}</th>
                            <th>${i18n.t("kanban.data.labels.tableEs", "Espanol")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderExpectedTransitions() {
        const target = document.querySelector("[data-kanban-valid-transitions]");
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.validTransitions.map((item) => `<li>${item}</li>`).join("");
    }

    function renderAvoidMoves() {
        const target = document.querySelector("[data-kanban-avoid-moves]");
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.avoidMoves.map((item) => `<li>${item}</li>`).join("");
    }

    function renderManagementCards() {
        const target = document.querySelector("[data-kanban-management-cards]");
        if (!target) {
            return;
        }

        target.innerHTML = KANBAN_DATA.managementSignals
            .map(
                (item) => `
                    <article class="executive-card management-card">
                        <h3>${item.topic}</h3>
                        <p><strong>${i18n.t("kanban.data.labels.reading", "Como ler:")}</strong> ${item.reading}</p>
                        <p><strong>${i18n.t("kanban.data.labels.action", "Acao de gestao:")}</strong> ${item.action}</p>
                    </article>
                `
            )
            .join("");
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
