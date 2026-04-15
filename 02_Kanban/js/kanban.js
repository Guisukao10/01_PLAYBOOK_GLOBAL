(function () {
    const FALLBACK_KANBAN_DATA = {
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
                key: "aguardando_assistencia_tecnica",
                title: "Aguardando Assistencia Tecnica",
                lane: "espera",
                objective: "Aguardar acao da assistencia tecnica.",
                when: "Quando a resolucao depende de atuacao tecnica externa/interna dedicada.",
                correctStay: "Com solicitacao registrada e acompanhamento da previsao.",
                risk: "Sem registro claro, o ticket some da leitura de gargalo."
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
                key: "fechado",
                title: "Fechado",
                lane: "final",
                objective: "Formalizar encerramento com registro minimo de resolucao.",
                when: "Apos concluir atendimento e validar condicoes de fechamento.",
                correctStay: "Ticket concluido, com trilha de encerramento consistente.",
                risk: "Fechar cedo distorce SLA e gera retrabalho por reabertura."
            }
        ],
        languageRows: [
            { pt: "Aberto", en: "Open", es: "Abierto" },
            { pt: "Em Atendimento", en: "In Service", es: "En Atencion" },
            { pt: "Aguardando Cliente", en: "Waiting for Customer", es: "En Espera del Cliente" },
            { pt: "Aguardando Assistencia Tecnica", en: "Waiting for Technical Assistance", es: "En Espera de Asistencia Tecnica" },
            { pt: "Aguardando Peca", en: "Waiting for Parts", es: "En Espera de Repuestos" },
            { pt: "Fechado", en: "Closed", es: "Cerrado" }
        ],
        validTransitions: [
            "Aberto -> Em Atendimento",
            "Em Atendimento -> Aguardando Cliente",
            "Em Atendimento -> Aguardando Assistencia Tecnica",
            "Em Atendimento -> Aguardando Peca",
            "Aguardando Cliente -> Em Atendimento",
            "Aguardando Assistencia Tecnica -> Em Atendimento",
            "Aguardando Peca -> Em Atendimento",
            "Em Atendimento -> Fechado"
        ],
        avoidMoves: [
            "Aberto -> Fechado sem tratamento real",
            "Usar Em Atendimento sem acao efetiva",
            "Mover para espera sem contexto minimo",
            "Fechar ticket sem resumo de resolucao",
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
                reading: "Concentracao em Aguardando Cliente, AT ou Peca.",
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

    const KANBAN_DATA = i18n.t("kanban.data", FALLBACK_KANBAN_DATA);

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

    document.addEventListener("DOMContentLoaded", function () {
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
