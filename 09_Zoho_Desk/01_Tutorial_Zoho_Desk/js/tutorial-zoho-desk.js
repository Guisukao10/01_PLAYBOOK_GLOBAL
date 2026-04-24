(function () {
    var progressApi = window.ZohoDeskTutorialProgress;
    if (!progressApi) return;

    var STEPS = progressApi.getSteps();
    var completedStepIds = new Set();

    var stepsListEl = null;
    var progressValueEl = null;
    var progressBarEl = null;
    var progressFillEl = null;
    var progressMessageEl = null;
    var completionSectionEl = null;
    var reviewStepsButtonEl = null;

    function sanitizeHref(rawHref, fallback) {
        if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.sanitizeHref === "function") {
            return window.PlaybookLinkSecurity.sanitizeHref(rawHref, fallback);
        }

        var safeFallback = fallback === undefined ? "#" : fallback;
        var fallbackText = safeFallback === null ? null : String(safeFallback).trim();
        var href = String(rawHref === undefined || rawHref === null ? "" : rawHref).trim();

        if (!href) return fallbackText;
        if (href === "#" || href.charAt(0) === "#") return href;
        if (href.indexOf("//") === 0) return fallbackText;

        var compact = href.replace(/[\u0000-\u001F\u007F\s]+/g, "");
        var schemeMatch = compact.match(/^([a-z][a-z0-9+.-]*):/i);
        if (!schemeMatch) return href;

        var scheme = schemeMatch[1].toLowerCase();
        if (scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel") {
            return href;
        }

        return fallbackText;
    }

    function setSafeHref(element, rawHref, fallback) {
        if (window.PlaybookLinkSecurity && typeof window.PlaybookLinkSecurity.setHref === "function") {
            return window.PlaybookLinkSecurity.setHref(element, rawHref, fallback);
        }

        var safeHref = sanitizeHref(rawHref, fallback);
        if (!element) return safeHref;
        if (safeHref === null) {
            element.removeAttribute("href");
            return null;
        }

        element.href = safeHref;
        return safeHref;
    }

    function loadProgress() {
        completedStepIds = progressApi.loadCompletedStepIds();
    }

    function saveProgress() {
        progressApi.saveCompletedStepIds(completedStepIds);
    }

    function markStepAsCompleted(stepId) {
        if (completedStepIds.has(stepId)) return false;

        completedStepIds.add(stepId);
        saveProgress();
        return true;
    }

    function createStepCard(step, index) {
        var isComplete = completedStepIds.has(step.id);
        var isAvailable = typeof step.contentPath === "string" && step.contentPath.length > 0;

        var card = document.createElement("article");
        card.className = "tutorial-step-card" + (isComplete ? " is-complete" : "") + (!isAvailable ? " is-coming-soon" : "");

        var head = document.createElement("div");
        head.className = "tutorial-step-head";

        var number = document.createElement("span");
        number.className = "tutorial-step-number";
        number.textContent = "Etapa " + String(index + 1).padStart(2, "0");

        var status = document.createElement("span");
        status.className = "tutorial-step-status" + (!isAvailable && !isComplete ? " is-coming-soon" : "");
        status.textContent = isComplete ? "Concluído" : (isAvailable ? "Disponível" : "Em breve");

        head.appendChild(number);
        head.appendChild(status);

        var title = document.createElement("h3");
        title.textContent = step.title;

        var objective = document.createElement("p");
        objective.className = "tutorial-step-objective";
        objective.textContent = "Objetivo: " + step.objective;

        var actions = document.createElement("div");
        actions.className = "tutorial-step-actions";

        var viewButton = null;
        if (isAvailable) {
            viewButton = document.createElement("a");
            viewButton.className = "btn-secondary tutorial-step-view-btn";
            viewButton.textContent = "Ver etapa";
            setSafeHref(viewButton, step.contentPath, "#");
        } else {
            viewButton = document.createElement("button");
            viewButton.type = "button";
            viewButton.className = "btn-secondary tutorial-step-view-btn";
            viewButton.textContent = "Em breve";
            viewButton.disabled = true;
        }

        var completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.className = "btn-primary tutorial-step-complete-btn";
        completeButton.textContent = isComplete ? "Concluído" : "Concluir etapa";
        completeButton.disabled = isComplete;
        completeButton.addEventListener("click", function () {
            if (markStepAsCompleted(step.id)) {
                render();
            }
        });

        actions.appendChild(viewButton);
        actions.appendChild(completeButton);

        var details = document.createElement("p");
        details.className = "tutorial-step-details";
        details.textContent = isAvailable
            ? "Resumo da etapa: " + step.objective
            : "Página desta etapa será publicada em breve.";

        card.appendChild(head);
        card.appendChild(title);
        card.appendChild(objective);
        card.appendChild(actions);
        card.appendChild(details);

        return card;
    }

    function renderSteps() {
        if (!stepsListEl) return;
        stepsListEl.replaceChildren();

        STEPS.forEach(function (step, index) {
            stepsListEl.appendChild(createStepCard(step, index));
        });
    }

    function renderProgress() {
        var summary = progressApi.getProgressSummary(completedStepIds);
        var percent = summary.percent;

        if (progressValueEl) {
            progressValueEl.textContent = percent + "%";
        }

        if (progressBarEl) {
            progressBarEl.setAttribute("aria-valuenow", String(percent));
        }

        if (progressFillEl) {
            progressFillEl.style.width = percent + "%";
        }

        if (progressMessageEl) {
            if (percent === 100) {
                progressMessageEl.textContent = "Trilha concluída com sucesso.";
            } else if (percent === 0) {
                progressMessageEl.textContent = "Nenhuma etapa concluída ainda.";
            } else {
                progressMessageEl.textContent = summary.completed + " de " + summary.total + " etapas concluídas.";
            }
        }

        if (completionSectionEl) {
            completionSectionEl.hidden = percent !== 100;
        }
    }

    function render() {
        renderSteps();
        renderProgress();
    }

    function bindEvents() {
        if (reviewStepsButtonEl) {
            reviewStepsButtonEl.addEventListener("click", function () {
                var stepsSection = document.getElementById("etapas-trilha");
                if (!stepsSection) return;
                stepsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }

    function cacheElements() {
        stepsListEl = document.getElementById("tutorialStepsList");
        progressValueEl = document.getElementById("tutorialProgressValue");
        progressBarEl = document.getElementById("tutorialProgressBar");
        progressFillEl = document.getElementById("tutorialProgressFill");
        progressMessageEl = document.getElementById("tutorialProgressMessage");
        completionSectionEl = document.getElementById("tutorialCompletionSection");
        reviewStepsButtonEl = document.getElementById("reviewStepsButton");
    }

    document.addEventListener("DOMContentLoaded", function () {
        cacheElements();
        loadProgress();
        bindEvents();
        render();
    });
})();
