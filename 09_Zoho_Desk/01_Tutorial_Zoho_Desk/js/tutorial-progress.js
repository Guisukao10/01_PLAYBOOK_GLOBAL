(function (global) {
    var STORAGE_KEY = "playbook.zohoDesk.primeirosPassos.progresso.v1";

    var STEPS = [
        {
            id: "zoho-step-01",
            title: "O que é o Zoho Desk",
            objective: "Entender o papel do Zoho Desk como sistema central de atendimento.",
            contentPath: "./pages/etapa-01-o-que-e-zohodesk.html"
        },
        {
            id: "zoho-step-02",
            title: "Como acessar o sistema",
            objective: "Conhecer a entrada no sistema, tela inicial e navegação básica."
        },
        {
            id: "zoho-step-03",
            title: "O que é um ticket",
            objective: "Entender que o ticket é o registro oficial de uma solicitação, problema ou atendimento."
        },
        {
            id: "zoho-step-04",
            title: "Onde ficam os tickets",
            objective: "Localizar tickets nas listas, filas e áreas principais do sistema."
        },
        {
            id: "zoho-step-05",
            title: "Visualizações do sistema",
            objective: "Entender visualizações por status, prioridade, responsável e filtros."
        },
        {
            id: "zoho-step-06",
            title: "Como abrir um ticket",
            objective: "Aprender o registro básico de um novo atendimento."
        },
        {
            id: "zoho-step-07",
            title: "Como ler um ticket",
            objective: "Identificar cliente, assunto, descrição, status, prioridade, responsável, SLA e campos principais."
        },
        {
            id: "zoho-step-08",
            title: "Como atualizar um ticket",
            objective: "Registrar andamento, resposta, comentário interno e atualização de informações."
        },
        {
            id: "zoho-step-09",
            title: "Como movimentar o ticket no fluxo",
            objective: "Entender o uso correto dos status oficiais do atendimento."
        },
        {
            id: "zoho-step-10",
            title: "Como finalizar um atendimento",
            objective: "Registrar resolução e encerrar o ticket corretamente."
        },
        {
            id: "zoho-step-11",
            title: "Boas práticas do dia a dia",
            objective: "Evitar erros comuns e manter o atendimento organizado."
        },
        {
            id: "zoho-step-12",
            title: "Conclusão da trilha",
            objective: "Revisar o aprendizado, marcar 100% concluído e voltar para a tela inicial."
        }
    ];

    var VALID_IDS = STEPS.map(function (step) { return step.id; });

    function cloneStep(step) {
        return Object.assign({}, step);
    }

    function toSet(ids) {
        var set = new Set();
        if (!ids || !ids.forEach) return set;

        ids.forEach(function (id) {
            if (VALID_IDS.indexOf(id) >= 0) {
                set.add(id);
            }
        });

        return set;
    }

    function loadCompletedStepIds() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return new Set();

            var parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.completedStepIds)) {
                return new Set();
            }

            return toSet(parsed.completedStepIds);
        } catch (_error) {
            return new Set();
        }
    }

    function saveCompletedStepIds(completedIds) {
        try {
            var ids = completedIds instanceof Set ? Array.from(completedIds) : completedIds;
            var payload = {
                completedStepIds: Array.from(toSet(ids)),
                updatedAt: new Date().toISOString()
            };

            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (_error) {
            /* localStorage indisponível; seguir sem persistência. */
        }
    }

    function markStepAsCompleted(stepId) {
        if (VALID_IDS.indexOf(stepId) < 0) return false;

        var completedIds = loadCompletedStepIds();
        var alreadyCompleted = completedIds.has(stepId);
        if (alreadyCompleted) return false;

        completedIds.add(stepId);
        saveCompletedStepIds(completedIds);
        return true;
    }

    function isStepCompleted(stepId) {
        return loadCompletedStepIds().has(stepId);
    }

    function getProgressSummary(completedIds) {
        var normalized = completedIds instanceof Set
            ? completedIds
            : toSet(Array.isArray(completedIds) ? completedIds : Array.from(loadCompletedStepIds()));

        var total = STEPS.length;
        var completedCount = normalized.size;
        var percent = total ? Math.round((completedCount / total) * 100) : 0;

        return {
            total: total,
            completed: completedCount,
            percent: percent
        };
    }

    global.ZohoDeskTutorialProgress = {
        STORAGE_KEY: STORAGE_KEY,
        getSteps: function () {
            return STEPS.map(cloneStep);
        },
        getStepById: function (stepId) {
            var step = STEPS.find(function (item) { return item.id === stepId; });
            return step ? cloneStep(step) : null;
        },
        loadCompletedStepIds: loadCompletedStepIds,
        saveCompletedStepIds: saveCompletedStepIds,
        markStepAsCompleted: markStepAsCompleted,
        isStepCompleted: isStepCompleted,
        getProgressSummary: getProgressSummary
    };
})(window);
