const SCENARIO_STORAGE_KEY = "simuladorSelectedScenario";
const I18N = window.PlaybookI18n || {
    t: function (_key, fallback) {
        return fallback;
    }
};

const FALLBACK_SIM_SCENARIOS = {};
const SIM_SCENARIOS = I18N.t("simulador.data.scenarios", FALLBACK_SIM_SCENARIOS);

const FALLBACK_SCENARIO_TONE_META = {
    positivo: { label: "Positivo", className: "tag-consistente" },
    negativo: { label: "Negativo", className: "tag-critico" },
    neutro: { label: "Neutro", className: "tag-atencao" }
};
const SCENARIO_TONE_META = I18N.t("simulador.data.scenarioToneMeta", FALLBACK_SCENARIO_TONE_META);

document.addEventListener("DOMContentLoaded", function () {
    highlightInternalNavigation();
    initScenariosPage();
    initComparisonPage();
    initGuidedWizard();
    initTicketTimeline();
    initExecutiveDashboard();
});

function highlightInternalNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sim-nav-grid .btn-module").forEach(function (link) {
        if (link.getAttribute("href") === currentPage) link.setAttribute("aria-current", "page");
    });
}

function initScenariosPage() {
    const grid = document.getElementById("simScenariosGrid");
    if (!grid) return;

    grid.innerHTML = getScenarioList().map(renderScenarioCard).join("");
    grid.addEventListener("click", function (event) {
        const btn = event.target.closest("button[data-simulate-scenario]");
        if (!btn) return;
        startScenarioSimulation(btn.getAttribute("data-simulate-scenario"));
    });
}

function renderScenarioCard(scenario) {
    const tone = SCENARIO_TONE_META[scenario.tone] || SCENARIO_TONE_META.neutro;
    return (
        '<article class="sim-scenario-card">' +
        '<span class="sim-scenario-tag ' + tone.className + '">' + tone.label + "</span>" +
        "<h3>" + scenario.title + "</h3>" +
        "<p>" + scenario.description + "</p>" +
        '<button class="btn-module" type="button" data-simulate-scenario="' + scenario.id + '">Simular</button>' +
        "</article>"
    );
}

function startScenarioSimulation(scenarioId) {
    if (!SIM_SCENARIOS[scenarioId]) return;
    sessionStorage.setItem(SCENARIO_STORAGE_KEY, scenarioId);
    window.location.href = "simulacao-guiada.html?cenario=" + encodeURIComponent(scenarioId);
}
function initComparisonPage() {
    const selectA = document.getElementById("compareScenarioA");
    const selectB = document.getElementById("compareScenarioB");
    const grid = document.getElementById("comparisonGrid");
    const impact = document.getElementById("governanceImpactBox");
    if (!selectA || !selectB || !grid || !impact) return;

    const options = getScenarioList().map(function (s) {
        return '<option value="' + s.id + '">' + s.title + "</option>";
    }).join("");
    selectA.innerHTML = options;
    selectB.innerHTML = options;
    selectA.value = "ticketIdeal";
    selectB.value = "ticketIncompleto";

    const rerender = function () { renderComparison(selectA.value, selectB.value, grid, impact); };
    selectA.addEventListener("change", rerender);
    selectB.addEventListener("change", rerender);

    const btnA = document.getElementById("simulateScenarioA");
    const btnB = document.getElementById("simulateScenarioB");
    if (btnA) btnA.addEventListener("click", function () { startScenarioSimulation(selectA.value); });
    if (btnB) btnB.addEventListener("click", function () { startScenarioSimulation(selectB.value); });

    rerender();
}

function renderComparison(idA, idB, grid, impact) {
    const scenarioA = SIM_SCENARIOS[idA];
    const scenarioB = SIM_SCENARIOS[idB];
    if (!scenarioA || !scenarioB) return;

    const resultA = simulateScenarioOutcome(scenarioA);
    const resultB = simulateScenarioOutcome(scenarioB);

    grid.innerHTML =
        renderComparisonColumn("Cenario A", scenarioA, resultA) +
        renderComparisonColumn("Cenario B", scenarioB, resultB);

    impact.innerHTML =
        "<h3>Impacto em Governanca</h3>" +
        '<div class="sim-impact-grid">' +
        "<article class=\"sim-impact-card\"><h4>" + scenarioA.title + "</h4><p>" + resultA.governance + "</p></article>" +
        "<article class=\"sim-impact-card\"><h4>" + scenarioB.title + "</h4><p>" + resultB.governance + "</p></article>" +
        "</div>" +
        '<p class="sim-impact-footer">Ticket ideal tende a alta consistencia operacional; ticket incompleto aumenta risco de retrabalho e perda de comparabilidade.</p>';
}

function renderComparisonColumn(label, scenario, result) {
    return (
        '<article class="sim-compare-column">' +
        "<h3>" + label + "</h3>" +
        "<h4>" + scenario.title + "</h4>" +
        "<ul>" +
        "<li><strong>Canal:</strong> " + safeValue(scenario.channel) + "</li>" +
        "<li><strong>Qualidade da abertura:</strong> " + result.openingQuality.label + "</li>" +
        "<li><strong>Prioridade:</strong> " + result.priority.level + "</li>" +
        "<li><strong>Fluxo inicial:</strong> " + result.flow.initialStatus + "</li>" +
        "<li><strong>Risco operacional:</strong> " + result.risk.level + "</li>" +
        "<li><strong>Impacto em governanca:</strong> " + result.governance + "</li>" +
        "</ul>" +
        "</article>"
    );
}

function initGuidedWizard() {
    const root = document.getElementById("simWizardRoot");
    if (!root) return;

    const refs = {
        loadedScenarioBanner: document.getElementById("loadedScenarioBanner"),
        stepItems: Array.from(document.querySelectorAll(".sim-step-item")),
        stepScreens: Array.from(document.querySelectorAll(".sim-step-screen")),
        channelCards: Array.from(document.querySelectorAll(".sim-channel-card")),
        channelFeedback: document.getElementById("channelFeedback"),
        form: {
            region: document.getElementById("ticketRegion"),
            country: document.getElementById("ticketCountry"),
            brand: document.getElementById("ticketBrand"),
            product: document.getElementById("ticketProduct"),
            serviceType: document.getElementById("ticketServiceType"),
            category: document.getElementById("ticketCategory"),
            description: document.getElementById("ticketDescription")
        },
        requiredFieldsGrid: document.getElementById("requiredFieldsGrid"),
        openingQualityBox: document.getElementById("openingQualityBox"),
        requiredReviewCheck: document.getElementById("requiredReviewCheck"),
        segmentedGroups: Array.from(document.querySelectorAll(".sim-segmented")),
        priorityResultBox: document.getElementById("priorityResultBox"),
        flowTrack: document.getElementById("flowTrack"),
        flowOptions: document.getElementById("flowOptions"),
        flowReadBox: document.getElementById("flowReadBox"),
        resultTicketSummary: document.getElementById("resultTicketSummary"),
        resultOpeningQuality: document.getElementById("resultOpeningQuality"),
        resultPriority: document.getElementById("resultPriority"),
        resultFlow: document.getElementById("resultFlow"),
        resultRisks: document.getElementById("resultRisks"),
        resultGovernance: document.getElementById("resultGovernance"),
        resultActions: document.getElementById("resultActions"),
        nav: {
            prev: document.getElementById("wizardPrevBtn"),
            next: document.getElementById("wizardNextBtn"),
            restart: document.getElementById("wizardRestartBtn"),
            message: document.getElementById("wizardMessage")
        },
        side: {
            channel: document.getElementById("sideChannel"),
            openingQuality: document.getElementById("sideOpeningQuality"),
            priority: document.getElementById("sidePriority"),
            flow: document.getElementById("sideFlow"),
            risk: document.getElementById("sideRisk"),
            governance: document.getElementById("sideGovernance")
        }
    };

    const state = createInitialWizardState();
    bindWizardEvents(refs, state);
    applyScenarioFromRequest(refs, state);
    renderWizard(refs, state);
}

function createInitialWizardState() {
    return {
        currentStep: 0,
        channel: "",
        ticket: { region: "", country: "", brand: "", product: "", serviceType: "", category: "", description: "" },
        reviewConfirmed: false,
        factors: { clienteParado: "", equipamentoCritico: "", impactoCliente: "", operacaoInterrompida: "", podeAguardar: "" },
        flow: { selectedPath: "" },
        derived: null
    };
}

function bindWizardEvents(refs, state) {
    refs.channelCards.forEach(function (card) {
        card.addEventListener("click", function () {
            state.channel = card.dataset.channel || "";
            setWizardMessage(refs, getChannelContext(state.channel), "success");
            renderWizard(refs, state);
        });
    });

    Object.keys(refs.form).forEach(function (key) {
        ["input", "change"].forEach(function (ev) {
            refs.form[key].addEventListener(ev, function () {
                state.ticket[key] = refs.form[key].value.trim();
                renderWizard(refs, state);
            });
        });
    });

    refs.requiredReviewCheck.addEventListener("change", function () {
        state.reviewConfirmed = refs.requiredReviewCheck.checked;
        renderWizard(refs, state);
    });

    refs.segmentedGroups.forEach(function (group) {
        const factor = group.dataset.factor;
        group.querySelectorAll("button").forEach(function (button) {
            button.addEventListener("click", function () {
                state.factors[factor] = button.dataset.value;
                renderWizard(refs, state);
            });
        });
    });

    refs.flowOptions.addEventListener("click", function (event) {
        const btn = event.target.closest(".sim-flow-option");
        if (!btn) return;
        state.flow.selectedPath = btn.dataset.path || "";
        renderWizard(refs, state);
    });

    refs.nav.prev.addEventListener("click", function () {
        if (state.currentStep > 0) state.currentStep -= 1;
        setWizardMessage(refs, "", "");
        renderWizard(refs, state);
    });

    refs.nav.next.addEventListener("click", function () {
        const validation = validateCurrentStep(state);
        if (!validation.valid) {
            setWizardMessage(refs, validation.message, "error");
            return;
        }
        if (state.currentStep < 5) state.currentStep += 1;
        setWizardMessage(refs, "", "");
        renderWizard(refs, state);
    });

    refs.nav.restart.addEventListener("click", function () {
        const fresh = createInitialWizardState();
        Object.assign(state, fresh);
        refs.channelCards.forEach(function (card) { card.classList.remove("is-selected"); });
        Object.keys(refs.form).forEach(function (k) { refs.form[k].value = ""; });
        refs.requiredReviewCheck.checked = false;
        refs.segmentedGroups.forEach(function (group) {
            group.querySelectorAll("button").forEach(function (button) { button.classList.remove("is-selected"); });
        });
        if (refs.loadedScenarioBanner) refs.loadedScenarioBanner.hidden = true;
        setWizardMessage(refs, "Simulacao reiniciada.", "success");
        renderWizard(refs, state);
    });
}

function applyScenarioFromRequest(refs, state) {
    const queryId = new URLSearchParams(window.location.search).get("cenario");
    const storedId = sessionStorage.getItem(SCENARIO_STORAGE_KEY);
    const scenario = SIM_SCENARIOS[queryId || storedId];
    if (!scenario) return;

    state.channel = scenario.channel;
    state.ticket = Object.assign({}, scenario.ticket);
    state.factors = Object.assign({}, scenario.factors);
    state.flow.selectedPath = scenario.flowPath || "";
    state.reviewConfirmed = true;
    state.currentStep = 5;

    Object.keys(refs.form).forEach(function (key) { refs.form[key].value = state.ticket[key] || ""; });
    refs.requiredReviewCheck.checked = true;

    if (refs.loadedScenarioBanner) {
        refs.loadedScenarioBanner.hidden = false;
        refs.loadedScenarioBanner.textContent = "Cenario carregado automaticamente: " + scenario.title;
    }

    sessionStorage.removeItem(SCENARIO_STORAGE_KEY);
}

function renderWizard(refs, state) {
    state.derived = deriveSimulationState(state);
    renderStepBar(refs, state);
    renderStepScreens(refs, state);
    renderChannelSection(refs, state);
    renderRequiredFields(refs, state);
    renderPrioritySection(refs, state);
    renderFlowSection(refs, state);
    renderResultSection(refs, state);
    renderSidePanel(refs, state);
    updateNavigationControls(refs, state);
    persistWizardSnapshot(state);
}

function renderStepBar(refs, state) {
    refs.stepItems.forEach(function (item, index) {
        item.classList.remove("is-current", "is-complete");
        if (index < state.currentStep) item.classList.add("is-complete");
        if (index === state.currentStep) item.classList.add("is-current");
    });
}

function renderStepScreens(refs, state) {
    refs.stepScreens.forEach(function (screen) {
        screen.hidden = Number(screen.dataset.step) !== state.currentStep;
    });
}

function renderChannelSection(refs, state) {
    refs.channelCards.forEach(function (card) {
        card.classList.toggle("is-selected", card.dataset.channel === state.channel);
    });
    refs.channelFeedback.textContent = state.channel ? getChannelContext(state.channel) : "";
}

function renderRequiredFields(refs, state) {
    refs.requiredFieldsGrid.innerHTML = buildRequiredFieldItems(state).map(function (item) {
        return '<article class="sim-required-item"><strong>' + item.label + '</strong><span class="sim-status-badge status-' + item.status + '">' + formatStatusLabel(item.status) + "</span></article>";
    }).join("");

    const quality = state.derived.openingQuality;
    refs.openingQualityBox.className = "sim-opening-quality quality-" + quality.key;
    refs.openingQualityBox.innerHTML = "<h4>Avaliacao da abertura: " + quality.label + "</h4><p>" + quality.message + "</p>";
}

function renderPrioritySection(refs, state) {
    refs.segmentedGroups.forEach(function (group) {
        const factor = group.dataset.factor;
        group.querySelectorAll("button").forEach(function (button) {
            button.classList.toggle("is-selected", state.factors[factor] === button.dataset.value);
        });
    });
    refs.priorityResultBox.innerHTML = "<h4>Prioridade sugerida: " + state.derived.priority.level + "</h4><p>" + state.derived.priority.reason + "</p>";
}

function renderFlowSection(refs, state) {
    const flow = state.derived.flow;
    refs.flowTrack.innerHTML = flow.statuses.map(function (status, index) {
        const current = status === flow.initialStatus || status === state.flow.selectedPath;
        const node = '<span class="sim-flow-node' + (current ? " is-current" : "") + '">' + status + "</span>";
        return index === flow.statuses.length - 1 ? node : node + '<span class="sim-flow-arrow">&rarr;</span>';
    }).join("");

    refs.flowOptions.innerHTML = flow.nextOptions.map(function (opt) {
        return '<button type="button" class="sim-flow-option' + (state.flow.selectedPath === opt ? " is-selected" : "") + '" data-path="' + opt + '">' + opt + "</button>";
    }).join("");

    refs.flowReadBox.innerHTML = "<strong>Status inicial sugerido:</strong> " + flow.initialStatus + "<br><strong>Leitura:</strong> " + flow.read;
}

function renderResultSection(refs, state) {
    const t = state.ticket;
    const d = state.derived;
    refs.resultTicketSummary.innerHTML = "<h4>1. Resumo do Ticket</h4><ul><li><strong>Canal:</strong> " + safeValue(state.channel) + "</li><li><strong>Regiao/Pais:</strong> " + safeValue(t.region) + " / " + safeValue(t.country) + "</li><li><strong>Tipo:</strong> " + safeValue(t.serviceType) + "</li><li><strong>Categoria:</strong> " + safeValue(t.category) + "</li><li><strong>Produto:</strong> " + safeValue(t.product) + "</li></ul>";
    refs.resultOpeningQuality.innerHTML = "<h4>2. Qualidade da Abertura</h4><p><strong>" + d.openingQuality.label + "</strong></p><p>" + d.openingQuality.message + "</p>";
    refs.resultPriority.innerHTML = "<h4>3. Prioridade Sugerida</h4><p><strong>" + d.priority.level + "</strong></p><p>" + d.priority.reason + "</p>";
    refs.resultFlow.innerHTML = "<h4>4. Fluxo Inicial Sugerido</h4><p><strong>Status inicial:</strong> " + d.flow.initialStatus + "</p><p><strong>Proximo passo escolhido:</strong> " + safeValue(state.flow.selectedPath) + "</p><p><strong>Possiveis proximos passos:</strong> " + d.flow.nextOptions.join(", ") + "</p>";
    refs.resultRisks.innerHTML = "<h4>5. Riscos Operacionais</h4><p><strong>Nivel:</strong> " + d.risk.level + "</p><p>" + d.risk.message + "</p>";
    refs.resultGovernance.innerHTML = "<h4>6. Leitura de Governanca</h4><p>" + d.governance + "</p>";
    refs.resultActions.innerHTML = "<h4>Acoes sugeridas</h4><ul><li>Complementar campos obrigatorios faltantes.</li><li>Validar prioridade com base no contexto operacional.</li><li>Direcionar ao fluxo adequado para evitar backlog e aging.</li><li>Garantir qualidade minima do registro para leitura gerencial.</li><li>Acessar <a href=\"timeline.html\">timeline do ticket</a> para visualizar impacto de tempo e SLA.</li><li>Acessar <a href=\"dashboard.html\">dashboard executivo</a> para leitura consolidada de KPIs e governanca.</li></ul>";
}

function renderSidePanel(refs, state) {
    const d = state.derived;
    refs.side.channel.textContent = safeValue(state.channel, "Nao definido");
    refs.side.openingQuality.textContent = d.openingQuality.label;
    refs.side.priority.textContent = d.priority.level;
    refs.side.flow.textContent = state.flow.selectedPath || d.flow.initialStatus;
    refs.side.risk.textContent = d.risk.level + " - " + d.risk.shortText;
    refs.side.governance.textContent = d.governance;
}

function updateNavigationControls(refs, state) {
    refs.nav.prev.disabled = state.currentStep === 0;
    const validation = validateCurrentStep(state);
    refs.nav.next.disabled = !validation.valid;
    if (!validation.valid && state.currentStep < 5) setWizardMessage(refs, validation.message, "");
    refs.nav.next.hidden = state.currentStep === 5;
    if (state.currentStep < 5) refs.nav.next.textContent = state.currentStep === 4 ? "Ir para Resultado" : "Proximo";
}

function validateCurrentStep(state) {
    if (state.currentStep === 0) return state.channel ? ok() : no("Selecione um canal para avancar.");
    if (state.currentStep === 1) {
        const required = ["region", "country", "brand", "product", "serviceType", "category", "description"];
        return required.every(function (k) { return !!state.ticket[k]; }) ? ok() : no("Preencha os dados principais do ticket para continuar.");
    }
    if (state.currentStep === 2) return state.reviewConfirmed ? ok() : no("Confirme a leitura dos campos obrigatorios para avancar.");
    if (state.currentStep === 3) return Object.values(state.factors).every(Boolean) ? ok() : no("Defina todos os criterios de prioridade para continuar.");
    if (state.currentStep === 4) return state.flow.selectedPath ? ok() : no("Selecione o proximo passo de fluxo para continuar.");
    return ok();
}

function ok() { return { valid: true, message: "" }; }
function no(message) { return { valid: false, message: message }; }

function deriveSimulationState(state) {
    const openingQuality = deriveOpeningQuality(state);
    const priority = derivePriority(state);
    const flow = deriveFlow(state, priority);
    if (state.flow.selectedPath && flow.nextOptions.indexOf(state.flow.selectedPath) === -1) state.flow.selectedPath = "";
    const risk = deriveRisk(state, openingQuality, priority, flow);
    const governance = deriveGovernance(state, openingQuality, risk);
    return { openingQuality: openingQuality, priority: priority, flow: flow, risk: risk, governance: governance };
}

function simulateScenarioOutcome(scenario) {
    const s = createInitialWizardState();
    s.channel = scenario.channel;
    s.ticket = Object.assign({}, scenario.ticket);
    s.factors = Object.assign({}, scenario.factors);
    s.reviewConfirmed = true;
    s.flow.selectedPath = scenario.flowPath || "";
    return deriveSimulationState(s);
}

function deriveOpeningQuality(state) {
    const fields = [state.channel, state.ticket.region, state.ticket.country, state.ticket.brand, state.ticket.product, state.ticket.serviceType, state.ticket.category, state.ticket.description];
    const count = fields.filter(Boolean).length;
    if (count >= 7) return { key: "consistente", label: "Consistente", message: "A abertura contem os principais elementos para classificacao e fluxo." };
    if (count >= 5) return { key: "parcial", label: "Parcial", message: "A abertura possui dados relevantes, mas ainda precisa complemento." };
    return { key: "critica", label: "Critica", message: "Abertura incompleta com alto risco para prioridade, fluxo e governanca." };
}

function derivePriority(state) {
    const weights = { alto: 3, medio: 2, baixo: 1 };
    const values = Object.values(state.factors);
    if (!values.every(Boolean)) return { level: "Pendente", reason: "Defina os criterios de criticidade para sugerir prioridade." };
    const score = values.reduce(function (a, v) { return a + (weights[v] || 0); }, 0);
    const critical = values.filter(function (v) { return v === "alto"; }).length;
    if (score >= 13 || critical >= 4) return { level: "P1", reason: "Cenario critico com alto impacto e necessidade de resposta imediata." };
    if (score >= 10 || critical >= 3) return { level: "P2", reason: "Cenario de alta criticidade com risco operacional relevante." };
    if (score >= 7) return { level: "P3", reason: "Cenario intermediario, com prioridade moderada e acompanhamento ativo." };
    return { level: "P4", reason: "Cenario de menor impacto, tratavel em cadencia padrao." };
}

function deriveFlow(state, priority) {
    const statuses = ["Aberto", "Em Atendimento", "Aguardando Cliente", "Aguardando Assistencia Tecnica", "Aguardando Peca", "Resolvido", "Fechado"];
    const next = ["Em Atendimento", "Aguardando Cliente"];
    if (state.ticket.serviceType === "Assistencia Tecnica") next.push("Aguardando Assistencia Tecnica");
    if (state.ticket.serviceType === "Pecas" || state.ticket.category === "Peca") next.push("Aguardando Peca");
    const nextOptions = Array.from(new Set(next));
    let read = "Fluxo padrao com entrada em Aberto e encaminhamento operacional inicial.";
    if (priority.level === "P1" || priority.level === "P2") read = "Prioridade alta: sugerir acao rapida e monitoramento intensivo do backlog.";
    if (nextOptions.indexOf("Aguardando Peca") >= 0) read += " Possivel dependencia de terceiros e risco de aging.";
    return { initialStatus: "Aberto", statuses: statuses, nextOptions: nextOptions, read: read };
}

function deriveRisk(state, openingQuality, priority, flow) {
    let score = 0;
    if (openingQuality.key === "critica") score += 3;
    else if (openingQuality.key === "parcial") score += 1;
    if (priority.level === "P1") score += 2;
    else if (priority.level === "P2") score += 1;
    if (flow.nextOptions.indexOf("Aguardando Peca") >= 0 || flow.nextOptions.indexOf("Aguardando Assistencia Tecnica") >= 0) score += 1;
    const missing = ["region", "country", "serviceType", "category", "description"].filter(function (k) { return !state.ticket[k]; }).length;
    if (missing >= 2) score += 2;
    if (score >= 5) return { level: "Alto", shortText: "Atencao imediata", message: "Ha risco alto de atraso, inconsistencias e impacto na leitura de governanca." };
    if (score >= 3) return { level: "Medio", shortText: "Monitorar de perto", message: "Existem pontos de atencao que podem gerar backlog ou perda de padrao." };
    return { level: "Baixo", shortText: "Cenario controlado", message: "Cenario com baixo risco operacional e boa previsibilidade de andamento." };
}

function deriveGovernance(state, openingQuality, risk) {
    const missing = ["region", "country", "serviceType", "category", "description"].filter(function (k) { return !state.ticket[k]; }).length;
    if (missing > 0 || openingQuality.key === "critica") return "Ticket precisa complementar dados obrigatorios.";
    if (risk.level === "Alto") return "Ticket em risco de comprometer comparabilidade e indicadores.";
    return "Ticket apto para seguir no fluxo.";
}

function buildRequiredFieldItems(state) {
    const pStatus = state.derived && state.derived.priority.level !== "Pendente" ? "preenchido" : "pendente";
    return [
        { label: "Canal de entrada", status: state.channel ? "preenchido" : "faltante" },
        { label: "Regiao", status: state.ticket.region ? "preenchido" : "faltante" },
        { label: "Pais", status: state.ticket.country ? "preenchido" : "faltante" },
        { label: "Marca", status: state.ticket.brand ? "preenchido" : "faltante" },
        { label: "Produto", status: state.ticket.product ? "preenchido" : "faltante" },
        { label: "Tipo de atendimento", status: state.ticket.serviceType ? "preenchido" : "faltante" },
        { label: "Categoria", status: state.ticket.category ? "preenchido" : "faltante" },
        { label: "Descricao do problema", status: state.ticket.description ? "preenchido" : "faltante" },
        { label: "Prioridade", status: pStatus },
        { label: "Status inicial", status: "automatico" }
    ];
}

function getChannelContext(channel) {
    const map = {
        Telefone: "Entrada rapida, com risco maior de depender de registro manual complementar.",
        WhatsApp: "Canal conveniente, mas sujeito a abertura incompleta.",
        Formulario: "Canal mais estruturado para garantir informacoes minimas.",
        "E-mail": "Canal tradicional, mas com maior chance de chegar sem padrao."
    };
    return map[channel] || "";
}

function formatStatusLabel(status) {
    const map = { preenchido: "Preenchido", faltante: "Faltante", automatico: "Automatico", pendente: "Pendente" };
    return map[status] || "Pendente";
}

function setWizardMessage(refs, message, type) {
    refs.nav.message.textContent = message || "";
    refs.nav.message.className = "sim-wizard-message" + (type ? " " + type : "");
}

function safeValue(value, fallback) {
    return value || fallback || "Nao definido";
}

function getScenarioList() {
    return Object.keys(SIM_SCENARIOS).map(function (key) { return SIM_SCENARIOS[key]; });
}

window.SimuladorModule = {
    cenarios: SIM_SCENARIOS,
    startScenarioSimulation: startScenarioSimulation,
    simulateScenarioOutcome: simulateScenarioOutcome
};
function persistWizardSnapshot(state) {
    const snapshot = {
        channel: state.channel,
        ticket: state.ticket,
        derived: state.derived,
        flowPath: state.flow.selectedPath,
        updatedAt: Date.now()
    };
    sessionStorage.setItem('simuladorWizardSnapshot', JSON.stringify(snapshot));
}

function initTicketTimeline() {
    const summaryCard = document.getElementById('timelineSummaryCard');
    if (!summaryCard) return;

    const refs = {
        summaryCard: summaryCard,
        track: document.getElementById('timelineTrack'),
        kanban: document.getElementById('timelineKanban'),
        slaBox: document.getElementById('timelineSlaBox'),
        message: document.getElementById('timelineMessage'),
        sideStatus: document.getElementById('timelineSideStatus'),
        sideTime: document.getElementById('timelineSideTime'),
        sideSla: document.getElementById('timelineSideSla'),
        sideRisk: document.getElementById('timelineSideRisk'),
        sideGovernance: document.getElementById('timelineSideGovernance'),
        btnAdvance: document.getElementById('timelineAdvanceBtn'),
        btnRestart: document.getElementById('timelineRestartBtn'),
        btnAuto: document.getElementById('timelineAutoBtn')
    };

    const simulation = createTimelineSimulationState(resolveTimelineSourceData());

    const controls = {
        autoTimer: null,
        isAutoRunning: false
    };

    refs.btnAdvance.addEventListener('click', function () {
        advanceTimelineStep(simulation, refs);
    });

    refs.btnRestart.addEventListener('click', function () {
        stopAutoSimulation(controls, refs);
        resetTimelineSimulation(simulation);
        renderTimeline(simulation, refs);
        setTimelineMessage(refs, 'Simulacao reiniciada.', '');
    });

    refs.btnAuto.addEventListener('click', function () {
        if (controls.isAutoRunning) {
            stopAutoSimulation(controls, refs);
            setTimelineMessage(refs, 'Simulacao automatica pausada.', '');
            return;
        }

        controls.isAutoRunning = true;
        refs.btnAuto.textContent = 'Pausar simulacao automatica';

        controls.autoTimer = window.setInterval(function () {
            const moved = advanceTimelineStep(simulation, refs);
            if (!moved) {
                stopAutoSimulation(controls, refs);
                setTimelineMessage(refs, 'Simulacao automatica concluida.', 'success');
            }
        }, 1100);
    });

    renderTimeline(simulation, refs);
}

function resolveTimelineSourceData() {
    const queryId = new URLSearchParams(window.location.search).get('cenario');
    const storedScenario = sessionStorage.getItem(SCENARIO_STORAGE_KEY);
    const scenario = SIM_SCENARIOS[queryId || storedScenario];

    if (scenario) {
        return {
            source: 'scenario',
            title: scenario.title,
            scenario: scenario,
            outcome: simulateScenarioOutcome(scenario)
        };
    }

    const snapshotRaw = sessionStorage.getItem('simuladorWizardSnapshot');
    if (snapshotRaw) {
        try {
            const snapshot = JSON.parse(snapshotRaw);
            if (snapshot && snapshot.channel) {
                return {
                    source: 'wizard',
                    title: 'Simulacao guiada recente',
                    snapshot: snapshot,
                    outcome: snapshot.derived
                };
            }
        } catch (error) {
            console.warn('Falha ao ler snapshot do wizard:', error);
        }
    }

    const fallback = SIM_SCENARIOS.ticketIdeal;
    return {
        source: 'scenario',
        title: fallback.title,
        scenario: fallback,
        outcome: simulateScenarioOutcome(fallback)
    };
}

function createTimelineSimulationState(sourceData) {
    const baseTicket = sourceData.source === 'scenario' ? sourceData.scenario.ticket : sourceData.snapshot.ticket;
    const baseChannel = sourceData.source === 'scenario' ? sourceData.scenario.channel : sourceData.snapshot.channel;

    const timelineOrder = ['Aberto', 'Em Atendimento', 'Aguardando Cliente', 'Aguardando Assistencia Tecnica', 'Aguardando Peca', 'Resolvido', 'Fechado'];

    const durations = deriveTimelineDurations(sourceData);

    return {
        sourceData: sourceData,
        channel: baseChannel,
        ticket: baseTicket,
        outcome: sourceData.outcome,
        timelineOrder: timelineOrder,
        durations: durations,
        currentIndex: 0,
        elapsedMinutes: 0,
        visited: { Aberto: true }
    };
}

function deriveTimelineDurations(sourceData) {
    const outcome = sourceData.outcome || {};
    const riskLevel = outcome.risk ? outcome.risk.level : 'Baixo';
    const priority = outcome.priority ? outcome.priority.level : 'P3';
    const quality = outcome.openingQuality ? outcome.openingQuality.key : 'consistente';
    const scenario = sourceData.scenario;

    const durations = {
        Aberto: 30,
        'Em Atendimento': 120,
        'Aguardando Cliente': 240,
        'Aguardando Assistencia Tecnica': 480,
        'Aguardando Peca': 960,
        Resolvido: 30,
        Fechado: 15
    };

    if (priority === 'P1') {
        durations.Aberto = 15;
        durations['Em Atendimento'] = 60;
    } else if (priority === 'P2') {
        durations.Aberto = 20;
        durations['Em Atendimento'] = 90;
    }

    if (quality === 'critica') {
        durations['Aguardando Cliente'] += 360;
    } else if (quality === 'parcial') {
        durations['Aguardando Cliente'] += 120;
    }

    if (riskLevel === 'Alto') {
        durations['Aguardando Assistencia Tecnica'] += 240;
    }

    if (scenario && scenario.id === 'dependenciaPeca') {
        durations['Aguardando Peca'] += 1440;
    }

    if (scenario && scenario.id === 'dependenciaAT') {
        durations['Aguardando Assistencia Tecnica'] += 480;
    }

    if (scenario && scenario.id === 'ticketIdeal') {
        durations['Aguardando Cliente'] = 60;
        durations['Aguardando Assistencia Tecnica'] = 180;
        durations['Aguardando Peca'] = 240;
    }

    return durations;
}

function advanceTimelineStep(simulation, refs) {
    const nextIndex = simulation.currentIndex + 1;
    if (nextIndex >= simulation.timelineOrder.length) {
        setTimelineMessage(refs, 'Ticket ja atingiu o status final.', '');
        return false;
    }

    const nextStatus = simulation.timelineOrder[nextIndex];
    simulation.currentIndex = nextIndex;
    simulation.visited[nextStatus] = true;
    simulation.elapsedMinutes += simulation.durations[nextStatus] || 0;

    renderTimeline(simulation, refs);
    setTimelineMessage(refs, 'Ticket movido para ' + nextStatus + '.', '');
    return true;
}

function resetTimelineSimulation(simulation) {
    simulation.currentIndex = 0;
    simulation.elapsedMinutes = 0;
    simulation.visited = { Aberto: true };
}

function stopAutoSimulation(controls, refs) {
    if (controls.autoTimer) {
        window.clearInterval(controls.autoTimer);
    }
    controls.autoTimer = null;
    controls.isAutoRunning = false;
    refs.btnAuto.textContent = 'Simular automaticamente';
}

function renderTimeline(simulation, refs) {
    renderTimelineSummary(simulation, refs);
    renderTimelineTrack(simulation, refs);
    renderTimelineKanban(simulation, refs);
    renderTimelineSidePanel(simulation, refs);
    renderTimelineSla(simulation, refs);
}

function renderTimelineSummary(simulation, refs) {
    const outcome = simulation.outcome;
    const risk = outcome.risk ? outcome.risk.level : 'Nao definido';

    refs.summaryCard.innerHTML =
        renderSummaryItem('Canal de entrada', simulation.channel) +
        renderSummaryItem('Regiao', simulation.ticket.region) +
        renderSummaryItem('Tipo de atendimento', simulation.ticket.serviceType) +
        renderSummaryItem('Prioridade', outcome.priority ? outcome.priority.level : 'Pendente') +
        renderSummaryItem('Qualidade da abertura', outcome.openingQuality ? outcome.openingQuality.label : 'Pendente') +
        renderSummaryItem('Risco inicial', risk);
}

function renderSummaryItem(label, value) {
    return '<article class="sim-ticket-summary-item"><span>' + label + '</span><strong>' + safeValue(value) + '</strong></article>';
}

function renderTimelineTrack(simulation, refs) {
    refs.track.innerHTML = simulation.timelineOrder.map(function (status) {
        const riskClass = getStatusRiskClass(simulation, status);
        const riskLabel = getStatusRiskLabel(simulation, status);
        const timeLabel = formatMinutes(simulation.durations[status] || 0);

        let stateClass = '';
        if (simulation.visited[status] && status !== simulation.timelineOrder[simulation.currentIndex]) {
            stateClass = ' is-done';
        }
        if (status === simulation.timelineOrder[simulation.currentIndex]) {
            stateClass = ' is-current';
        }

        return (
            '<article class="sim-timeline-node' + stateClass + '">' +
            '<span class="sim-timeline-icon">' + getStatusIcon(status) + '</span>' +
            '<div class="sim-timeline-title">' + status + '</div>' +
            '<div class="sim-timeline-time">Tempo no status: ' + timeLabel + '</div>' +
            '<span class="sim-timeline-risk ' + riskClass + '">' + riskLabel + '</span>' +
            '</article>'
        );
    }).join('');
}

function renderTimelineKanban(simulation, refs) {
    const columns = ['Aberto', 'Em Atendimento', 'Aguardando Cliente', 'Aguardando Assistencia Tecnica', 'Aguardando Peca', 'Resolvido'];
    const currentStatus = simulation.timelineOrder[simulation.currentIndex];

    refs.kanban.innerHTML = columns.map(function (column) {
        let ticketHtml = '';
        if (column === currentStatus || (column === 'Resolvido' && currentStatus === 'Fechado')) {
            ticketHtml =
                '<article class="sim-kanban-ticket">' +
                '<strong>Ticket Simulado</strong>' +
                '<p>' + safeValue(simulation.channel) + ' | ' + safeValue(simulation.outcome.priority.level) + '</p>' +
                '</article>';
        }

        return '<section class="sim-kanban-column"><h4>' + column + '</h4>' + ticketHtml + '</section>';
    }).join('');
}

function renderTimelineSla(simulation, refs) {
    const sla = getSlaState(simulation);
    refs.slaBox.className = 'sim-sla-box ' + sla.className;
    refs.slaBox.innerHTML =
        '<strong>SLA:</strong> ' + sla.label + '<br>' +
        '<span>' + sla.message + '</span>';
}

function renderTimelineSidePanel(simulation, refs) {
    const currentStatus = simulation.timelineOrder[simulation.currentIndex];
    const sla = getSlaState(simulation);
    const risk = deriveTimelineRisk(simulation, currentStatus);
    const governance = deriveTimelineGovernance(simulation, currentStatus, sla.label, risk.level);

    refs.sideStatus.textContent = currentStatus;
    refs.sideTime.textContent = formatMinutes(simulation.elapsedMinutes);
    refs.sideSla.textContent = sla.label;
    refs.sideRisk.textContent = risk.level + ' - ' + risk.message;
    refs.sideGovernance.textContent = governance;
}

function setTimelineMessage(refs, message, type) {
    refs.message.textContent = message;
    refs.message.className = 'sim-timeline-message' + (type ? ' ' + type : '');
}

function getSlaState(simulation) {
    const thresholdByPriority = {
        P1: 240,
        P2: 480,
        P3: 960,
        P4: 1440,
        Pendente: 720
    };

    const priority = simulation.outcome.priority ? simulation.outcome.priority.level : 'Pendente';
    const threshold = thresholdByPriority[priority] || thresholdByPriority.Pendente;
    const elapsed = simulation.elapsedMinutes;

    if (elapsed <= threshold * 0.8) {
        return {
            label: 'Dentro do SLA',
            className: 'sla-ontrack',
            message: 'Tempo acumulado dentro da margem prevista para o ticket.'
        };
    }

    if (elapsed <= threshold) {
        return {
            label: 'SLA em risco',
            className: 'sla-risk',
            message: 'Tempo proximo do limite. Recomendado acelerar tratativa e monitorar backlog.'
        };
    }

    return {
        label: 'SLA estourado',
        className: 'sla-breached',
        message: 'Tempo acima do limite esperado. Impacto direto em governanca e indicadores.'
    };
}

function deriveTimelineRisk(simulation, status) {
    const waitingStatuses = ['Aguardando Cliente', 'Aguardando Assistencia Tecnica', 'Aguardando Peca'];
    const priority = simulation.outcome.priority ? simulation.outcome.priority.level : 'P3';

    if (status === 'Aguardando Peca') {
        return { level: 'Alto', message: 'Dependencia de peca detectada. Risco de aging elevado.' };
    }

    if ((priority === 'P1' || priority === 'P2') && waitingStatuses.indexOf(status) >= 0) {
        return { level: 'Alto', message: 'Ticket critico em espera. Risco operacional alto.' };
    }

    if (waitingStatuses.indexOf(status) >= 0) {
        return { level: 'Medio', message: 'Ticket em espera com risco moderado de atraso.' };
    }

    if (status === 'Resolvido' || status === 'Fechado') {
        return { level: 'Baixo', message: 'Fluxo encerrado com controle operacional.' };
    }

    return { level: 'Baixo', message: 'Fluxo sob acompanhamento padrao.' };
}

function deriveTimelineGovernance(simulation, status, slaLabel, riskLevel) {
    if (slaLabel === 'SLA estourado') {
        return 'Tempo acima do SLA compromete comparabilidade e leitura de performance.';
    }

    if (riskLevel === 'Alto') {
        return 'Governanca sob pressao. Recomendado escalonamento e plano de mitigacao.';
    }

    if (status === 'Fechado') {
        return 'Fluxo eficiente. Governanca consistente.';
    }

    return 'Ticket monitorado com rastreabilidade adequada para governanca.';
}

function getStatusRiskClass(simulation, status) {
    const level = deriveTimelineRisk(simulation, status).level;
    if (level === 'Alto') return 'sim-risk-high';
    if (level === 'Medio') return 'sim-risk-medium';
    return 'sim-risk-low';
}

function getStatusRiskLabel(simulation, status) {
    return deriveTimelineRisk(simulation, status).level;
}

function getStatusIcon(status) {
    const map = {
        Aberto: 'A',
        'Em Atendimento': 'EA',
        'Aguardando Cliente': 'AC',
        'Aguardando Assistencia Tecnica': 'AT',
        'Aguardando Peca': 'AP',
        Resolvido: 'R',
        Fechado: 'F'
    };
    return map[status] || 'S';
}

function formatMinutes(totalMinutes) {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(days + 'd');
    if (hours > 0) parts.push(hours + 'h');
    if (minutes > 0 || parts.length === 0) parts.push(minutes + 'min');

    return parts.join(' ');
}

function initExecutiveDashboard() {
    const refs = {
        summary: document.getElementById('dashboardScenarioSummary'),
        kpiGrid: document.getElementById('dashboardKpiGrid'),
        compare: document.getElementById('dashboardGovernanceCompare'),
        volumeImpact: document.getElementById('dashboardVolumeImpact'),
        executiveReading: document.getElementById('dashboardExecutiveReading'),
        volumeButtons: Array.from(document.querySelectorAll('[data-volume]'))
    };

    if (!refs.summary || !refs.kpiGrid || !refs.compare || !refs.volumeImpact || !refs.executiveReading) return;

    const sourceData = resolveDashboardSourceData();
    const dashboardState = {
        sourceData: sourceData,
        scenarioOutcome: sourceData.outcome || simulateScenarioOutcome(SIM_SCENARIOS.ticketIdeal),
        selectedVolume: 10
    };

    refs.volumeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const volume = Number(button.getAttribute('data-volume')) || 10;
            dashboardState.selectedVolume = volume;
            refs.volumeButtons.forEach(function (btn) {
                btn.classList.toggle('active', btn === button);
            });
            renderDashboardVolumeImpact(refs, dashboardState);
            renderDashboardExecutiveReading(refs, dashboardState);
        });
    });

    const defaultButton = refs.volumeButtons.find(function (btn) {
        return Number(btn.getAttribute('data-volume')) === dashboardState.selectedVolume;
    });
    if (defaultButton) defaultButton.classList.add('active');

    renderExecutiveDashboard(refs, dashboardState);
}

function renderExecutiveDashboard(refs, dashboardState) {
    renderDashboardScenarioSummary(refs, dashboardState);
    renderDashboardKpis(refs, dashboardState);
    renderDashboardGovernanceCompare(refs, dashboardState);
    renderDashboardVolumeImpact(refs, dashboardState);
    renderDashboardExecutiveReading(refs, dashboardState);
}

function resolveDashboardSourceData() {
    const timelineSource = resolveTimelineSourceData();
    if (timelineSource) return timelineSource;

    const fallback = SIM_SCENARIOS.ticketIdeal;
    return {
        source: 'scenario',
        title: fallback.title,
        scenario: fallback,
        outcome: simulateScenarioOutcome(fallback)
    };
}

function renderDashboardScenarioSummary(refs, dashboardState) {
    const sourceData = dashboardState.sourceData;
    const outcome = dashboardState.scenarioOutcome;
    const ticket = sourceData.source === 'scenario' ? sourceData.scenario.ticket : sourceData.snapshot.ticket;
    const channel = sourceData.source === 'scenario' ? sourceData.scenario.channel : sourceData.snapshot.channel;
    const selectedFlow = sourceData.source === 'scenario' ? sourceData.scenario.flowPath : sourceData.snapshot.flowPath;
    const flowLabel = selectedFlow || (outcome.flow ? outcome.flow.initialStatus : 'Aberto');

    refs.summary.innerHTML =
        renderSummaryItem('Canal de entrada', channel) +
        renderSummaryItem('Qualidade da abertura', outcome.openingQuality ? outcome.openingQuality.label : 'Pendente') +
        renderSummaryItem('Prioridade', outcome.priority ? outcome.priority.level : 'Pendente') +
        renderSummaryItem('Fluxo', flowLabel) +
        renderSummaryItem('Dependencias', deriveDependencyLabel(outcome)) +
        renderSummaryItem('Risco operacional', outcome.risk ? outcome.risk.level : 'Nao definido') +
        renderSummaryItem('Regiao/Pais', safeValue(ticket.region) + ' / ' + safeValue(ticket.country)) +
        renderSummaryItem('Tipo de atendimento', safeValue(ticket.serviceType));
}

function renderDashboardKpis(refs, dashboardState) {
    const metrics = calculateDashboardMetrics(dashboardState.sourceData, dashboardState.scenarioOutcome);
    dashboardState.metrics = metrics;

    const cards = [
        {
            title: 'Tempo de primeira resposta',
            value: formatMinutes(metrics.firstResponseMinutes),
            note: 'Leitura simulada considerando canal, prioridade e qualidade da abertura.',
            state: metrics.firstResponseState
        },
        {
            title: 'Tempo de resolucao',
            value: formatMinutes(metrics.resolutionMinutes),
            note: 'Leitura simulada com impacto de dependencias e risco operacional.',
            state: metrics.resolutionState
        },
        {
            title: 'SLA',
            value: metrics.slaLabel,
            note: metrics.slaNote,
            state: metrics.slaState
        },
        {
            title: 'Backlog simulado',
            value: metrics.backlogLabel,
            note: 'Projecao do nivel de fila para o cenario atual.',
            state: metrics.backlogState
        },
        {
            title: 'Aging simulado',
            value: metrics.agingLabel,
            note: 'Risco de permanencia prolongada no fluxo.',
            state: metrics.agingState
        },
        {
            title: 'Qualidade do ticket',
            value: metrics.ticketQualityLabel,
            note: 'Consistencia dos dados para governanca e indicadores.',
            state: metrics.ticketQualityState
        }
    ];

    refs.kpiGrid.innerHTML = cards.map(renderKpiCard).join('');
}

function calculateDashboardMetrics(sourceData, outcome) {
    const channel = sourceData.source === 'scenario' ? sourceData.scenario.channel : sourceData.snapshot.channel;
    const flow = outcome.flow || { nextOptions: [] };
    const priority = outcome.priority ? outcome.priority.level : 'Pendente';
    const openingKey = outcome.openingQuality ? outcome.openingQuality.key : 'parcial';
    const risk = outcome.risk ? outcome.risk.level : 'Medio';

    const responseBaseByPriority = { P1: 20, P2: 40, P3: 80, P4: 120, Pendente: 90 };
    const responseByChannel = { Telefone: -5, Formulario: -10, WhatsApp: 15, 'E-mail': 20 };
    const resolutionBaseByPriority = { P1: 240, P2: 480, P3: 900, P4: 1320, Pendente: 720 };

    let firstResponseMinutes = (responseBaseByPriority[priority] || 90) + (responseByChannel[channel] || 0);
    if (openingKey === 'parcial') firstResponseMinutes += 20;
    if (openingKey === 'critica') firstResponseMinutes += 45;
    firstResponseMinutes = Math.max(10, firstResponseMinutes);

    let resolutionMinutes = resolutionBaseByPriority[priority] || 720;
    if (flow.nextOptions && flow.nextOptions.indexOf('Aguardando Peca') >= 0) resolutionMinutes += 960;
    if (flow.nextOptions && flow.nextOptions.indexOf('Aguardando Assistencia Tecnica') >= 0) resolutionMinutes += 540;
    if (openingKey === 'parcial') resolutionMinutes += 180;
    if (openingKey === 'critica') resolutionMinutes += 420;
    if (risk === 'Alto') resolutionMinutes += 240;
    if (risk === 'Baixo') resolutionMinutes -= 60;
    resolutionMinutes = Math.max(120, resolutionMinutes);

    const slaThresholdByPriority = { P1: 240, P2: 600, P3: 1200, P4: 1800, Pendente: 900 };
    const slaThreshold = slaThresholdByPriority[priority] || slaThresholdByPriority.Pendente;

    let slaLabel = 'Dentro do prazo';
    let slaNote = 'Ritmo de tratamento aderente ao modelo global.';
    let slaState = 'ontrack';
    if (resolutionMinutes > slaThreshold * 0.85 && resolutionMinutes <= slaThreshold) {
        slaLabel = 'SLA em risco';
        slaNote = 'Necessario monitoramento proximo para evitar estouro.';
        slaState = 'risk';
    }
    if (resolutionMinutes > slaThreshold) {
        slaLabel = 'SLA estourado';
        slaNote = 'Tempo projetado acima do limite esperado para a prioridade.';
        slaState = 'breach';
    }

    let backlogLabel = 'Baixo';
    let backlogState = 'ontrack';
    if (risk === 'Medio' || openingKey === 'parcial') {
        backlogLabel = 'Moderado';
        backlogState = 'risk';
    }
    if (risk === 'Alto' || openingKey === 'critica') {
        backlogLabel = 'Alto';
        backlogState = 'breach';
    }

    let agingLabel = 'Controlado';
    let agingState = 'ontrack';
    if (resolutionMinutes > 960) {
        agingLabel = 'Atencao';
        agingState = 'risk';
    }
    if (resolutionMinutes > 1680) {
        agingLabel = 'Elevado';
        agingState = 'breach';
    }

    let ticketQualityLabel = 'Consistente';
    let ticketQualityState = 'ontrack';
    if (openingKey === 'parcial') {
        ticketQualityLabel = 'Parcial';
        ticketQualityState = 'risk';
    }
    if (openingKey === 'critica') {
        ticketQualityLabel = 'Critica';
        ticketQualityState = 'breach';
    }

    let firstResponseState = 'ontrack';
    if (firstResponseMinutes > 60) firstResponseState = 'risk';
    if (firstResponseMinutes > 120) firstResponseState = 'breach';

    let resolutionState = 'ontrack';
    if (resolutionMinutes > 720) resolutionState = 'risk';
    if (resolutionMinutes > 1440) resolutionState = 'breach';

    return {
        firstResponseMinutes: firstResponseMinutes,
        firstResponseState: firstResponseState,
        resolutionMinutes: resolutionMinutes,
        resolutionState: resolutionState,
        slaLabel: slaLabel,
        slaState: slaState,
        slaNote: slaNote,
        backlogLabel: backlogLabel,
        backlogState: backlogState,
        agingLabel: agingLabel,
        agingState: agingState,
        ticketQualityLabel: ticketQualityLabel,
        ticketQualityState: ticketQualityState
    };
}

function renderKpiCard(card) {
    return (
        '<article class="sim-kpi-card sim-kpi-state-' + card.state + '">' +
        '<h3>' + card.title + '</h3>' +
        '<div class="sim-kpi-value">' + card.value + '</div>' +
        '<p class="sim-kpi-note">' + card.note + '</p>' +
        '</article>'
    );
}

function renderDashboardGovernanceCompare(refs, dashboardState) {
    const outcome = dashboardState.scenarioOutcome;
    const metrics = dashboardState.metrics || calculateDashboardMetrics(dashboardState.sourceData, outcome);
    const comparison = calculateGovernanceComparison(outcome, metrics);
    dashboardState.governanceComparison = comparison;

    refs.compare.innerHTML =
        '<article class="sim-governance-column">' +
        '<h3>Sem governanca</h3>' +
        '<ul>' +
        '<li><strong>SLA:</strong> ' + comparison.without.sla + '%</li>' +
        '<li><strong>Tempo de resolucao:</strong> ' + formatMinutes(comparison.without.resolutionMinutes) + '</li>' +
        '<li><strong>Backlog:</strong> ' + comparison.without.backlog + '</li>' +
        '<li><strong>Qualidade de dados:</strong> ' + comparison.without.dataQuality + '%</li>' +
        '<li><strong>Consistencia:</strong> ' + comparison.without.consistency + '%</li>' +
        '</ul>' +
        '</article>' +
        '<article class="sim-governance-column">' +
        '<h3>Com governanca</h3>' +
        '<ul>' +
        '<li><strong>SLA:</strong> ' + comparison.with.sla + '%</li>' +
        '<li><strong>Tempo de resolucao:</strong> ' + formatMinutes(comparison.with.resolutionMinutes) + '</li>' +
        '<li><strong>Backlog:</strong> ' + comparison.with.backlog + '</li>' +
        '<li><strong>Qualidade de dados:</strong> ' + comparison.with.dataQuality + '%</li>' +
        '<li><strong>Consistencia:</strong> ' + comparison.with.consistency + '%</li>' +
        '</ul>' +
        '</article>';
}

function calculateGovernanceComparison(outcome, metrics) {
    const openingKey = outcome.openingQuality ? outcome.openingQuality.key : 'parcial';
    const risk = outcome.risk ? outcome.risk.level : 'Medio';
    const basePenalty = (openingKey === 'critica' ? 18 : openingKey === 'parcial' ? 9 : 3) + (risk === 'Alto' ? 12 : risk === 'Medio' ? 6 : 2);

    const withGovernance = {
        sla: Math.max(68, 94 - basePenalty),
        resolutionMinutes: Math.round(metrics.resolutionMinutes * 0.86),
        backlog: metrics.backlogLabel === 'Alto' ? 'Moderado' : metrics.backlogLabel === 'Moderado' ? 'Baixo-Moderado' : 'Baixo',
        dataQuality: openingKey === 'consistente' ? 95 : openingKey === 'parcial' ? 82 : 70,
        consistency: openingKey === 'consistente' ? 94 : openingKey === 'parcial' ? 80 : 65
    };

    const withoutGovernance = {
        sla: Math.max(40, withGovernance.sla - 22),
        resolutionMinutes: Math.round(metrics.resolutionMinutes * 1.23),
        backlog: metrics.backlogLabel === 'Baixo' ? 'Moderado' : 'Alto',
        dataQuality: Math.max(38, withGovernance.dataQuality - 26),
        consistency: Math.max(35, withGovernance.consistency - 28)
    };

    return { with: withGovernance, without: withoutGovernance };
}

function renderDashboardVolumeImpact(refs, dashboardState) {
    const metrics = dashboardState.metrics || calculateDashboardMetrics(dashboardState.sourceData, dashboardState.scenarioOutcome);
    const impact = calculateVolumeImpact(metrics, dashboardState.scenarioOutcome, dashboardState.selectedVolume);
    dashboardState.volumeImpact = impact;

    const cards = [
        {
            title: 'Impacto no SLA',
            value: impact.slaCompliance + '%',
            note: 'Percentual estimado de cumprimento de SLA no volume simulado.',
            state: impact.slaState
        },
        {
            title: 'Impacto no backlog',
            value: impact.backlogTickets + ' tickets',
            note: 'Tickets com tendencia de fila e espera no fluxo.',
            state: impact.backlogState
        },
        {
            title: 'Impacto na governanca',
            value: impact.governanceLabel,
            note: 'Leitura de estabilidade operacional para acompanhamento global.',
            state: impact.governanceState
        },
        {
            title: 'Impacto nos indicadores',
            value: impact.indicatorReliability + '%',
            note: 'Confiabilidade simulada dos dados para leitura executiva.',
            state: impact.indicatorState
        }
    ];

    refs.volumeImpact.innerHTML = cards.map(renderKpiCard).join('');
}

function calculateVolumeImpact(metrics, outcome, volume) {
    const risk = outcome.risk ? outcome.risk.level : 'Medio';
    const openingKey = outcome.openingQuality ? outcome.openingQuality.key : 'parcial';
    const slaBase = metrics.slaState === 'breach' ? 58 : metrics.slaState === 'risk' ? 78 : 92;
    const volumePenalty = volume === 100 ? 18 : volume === 50 ? 10 : 4;
    const riskPenalty = risk === 'Alto' ? 10 : risk === 'Medio' ? 5 : 1;
    const qualityPenalty = openingKey === 'critica' ? 12 : openingKey === 'parcial' ? 6 : 0;

    const slaCompliance = Math.max(30, slaBase - volumePenalty - riskPenalty - qualityPenalty);
    const backlogRate = risk === 'Alto' ? 0.34 : risk === 'Medio' ? 0.2 : 0.11;
    const qualityFactor = openingKey === 'critica' ? 1.25 : openingKey === 'parcial' ? 1.1 : 0.95;
    const backlogTickets = Math.round(volume * backlogRate * qualityFactor);

    const indicatorReliability = Math.max(35, 96 - qualityPenalty - Math.round(volumePenalty * 0.9));

    let governanceLabel = 'Controlado';
    let governanceState = 'ontrack';
    if (slaCompliance < 80 || backlogTickets > volume * 0.22) {
        governanceLabel = 'Atencao';
        governanceState = 'risk';
    }
    if (slaCompliance < 65 || backlogTickets > volume * 0.3) {
        governanceLabel = 'Critico';
        governanceState = 'breach';
    }

    return {
        slaCompliance: slaCompliance,
        backlogTickets: backlogTickets,
        indicatorReliability: indicatorReliability,
        governanceLabel: governanceLabel,
        slaState: governanceState === 'breach' ? 'breach' : governanceState === 'risk' ? 'risk' : 'ontrack',
        backlogState: backlogTickets > volume * 0.28 ? 'breach' : backlogTickets > volume * 0.18 ? 'risk' : 'ontrack',
        governanceState: governanceState,
        indicatorState: indicatorReliability < 70 ? 'breach' : indicatorReliability < 82 ? 'risk' : 'ontrack'
    };
}

function renderDashboardExecutiveReading(refs, dashboardState) {
    const outcome = dashboardState.scenarioOutcome;
    const metrics = dashboardState.metrics || calculateDashboardMetrics(dashboardState.sourceData, outcome);
    const comparison = dashboardState.governanceComparison || calculateGovernanceComparison(outcome, metrics);
    const impact = dashboardState.volumeImpact || calculateVolumeImpact(metrics, outcome, dashboardState.selectedVolume);

    const summarySentence = buildExecutiveSummary(outcome, metrics, impact);
    const governanceGain = comparison.with.sla - comparison.without.sla;

    refs.executiveReading.innerHTML =
        '<h3>Leitura Executiva</h3>' +
        '<p>' + summarySentence + '</p>' +
        '<p>No volume de <strong>' + dashboardState.selectedVolume + ' tickets</strong>, a simulacao projeta <strong>' + impact.slaCompliance + '%</strong> de SLA e <strong>' + impact.backlogTickets + ' tickets</strong> em backlog potencial.</p>' +
        '<p>Comparando operacao com e sem governanca, ha ganho estimado de <strong>' + governanceGain + ' p.p.</strong> em aderencia de SLA.</p>';
}

function buildExecutiveSummary(outcome, metrics, impact) {
    const quality = outcome.openingQuality ? outcome.openingQuality.label : 'Parcial';
    const priority = outcome.priority ? outcome.priority.level : 'Pendente';
    const risk = outcome.risk ? outcome.risk.level : 'Medio';
    const dependency = deriveDependencyLabel(outcome);

    if (impact.governanceLabel === 'Critico') {
        return 'O cenario simulado evidencia pressao operacional elevada: abertura ' + quality.toLowerCase() + ', prioridade ' + priority + ' e dependencias em ' + dependency.toLowerCase() + ' aumentam risco de perda de desempenho e comparabilidade.';
    }

    if (metrics.slaState === 'risk' || metrics.slaState === 'breach') {
        return 'O cenario mostra que a qualidade da abertura e a classificacao de prioridade influenciam diretamente o SLA. Com risco ' + risk.toLowerCase() + ', a governanca precisa atuar para reduzir atrasos e retrabalho.';
    }

    return 'O cenario demonstra boa sustentacao do modelo global: abertura ' + quality.toLowerCase() + ', prioridade ' + priority + ' e fluxo coerente fortalecem desempenho operacional e leitura executiva.';
}

function deriveDependencyLabel(outcome) {
    if (!outcome.flow || !outcome.flow.nextOptions) return 'Baixa';
    const options = outcome.flow.nextOptions;
    if (options.indexOf('Aguardando Peca') >= 0 && options.indexOf('Aguardando Assistencia Tecnica') >= 0) return 'Peca e Assistencia Tecnica';
    if (options.indexOf('Aguardando Peca') >= 0) return 'Peca';
    if (options.indexOf('Aguardando Assistencia Tecnica') >= 0) return 'Assistencia Tecnica';
    if (options.indexOf('Aguardando Cliente') >= 0) return 'Retorno do Cliente';
    return 'Baixa';
}

window.SimuladorModule = Object.assign({}, window.SimuladorModule || {}, {
    initExecutiveDashboard: initExecutiveDashboard
});
