(function () {
    var STEP_ID = "zoho-step-01";
    var progressApi = window.ZohoDeskTutorialProgress;
    if (!progressApi) return;

    var feedbackEl = null;
    var statusBadgeEl = null;
    var progressLabelEl = null;
    var completeButtons = [];

    function cacheElements() {
        feedbackEl = document.getElementById("step01Feedback");
        statusBadgeEl = document.getElementById("step01StatusBadge");
        progressLabelEl = document.getElementById("step01ProgressLabel");
        completeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-complete-step]"));
    }

    function showFeedback(message, type) {
        if (!feedbackEl) return;

        feedbackEl.textContent = message;
        feedbackEl.hidden = false;
        feedbackEl.classList.remove("is-success", "is-info");
        feedbackEl.classList.add(type === "success" ? "is-success" : "is-info");
    }

    function renderState() {
        var isComplete = progressApi.isStepCompleted(STEP_ID);
        var progressSummary = progressApi.getProgressSummary();

        if (statusBadgeEl) {
            statusBadgeEl.textContent = isComplete ? "Concluído" : "Disponível";
            statusBadgeEl.classList.toggle("is-complete", isComplete);
        }

        if (progressLabelEl) {
            progressLabelEl.textContent = progressSummary.percent + "% da trilha concluída";
        }

        completeButtons.forEach(function (button) {
            if (isComplete) {
                button.textContent = "Etapa 01 concluída";
                button.disabled = true;
                return;
            }

            button.textContent = "Marcar etapa como concluída";
            button.disabled = false;
        });
    }

    function handleCompleteClick() {
        var hasUpdated = progressApi.markStepAsCompleted(STEP_ID);
        renderState();

        if (hasUpdated) {
            showFeedback("Etapa 01 concluída.", "success");
            return;
        }

        showFeedback("Etapa 01 já estava concluída.", "info");
    }

    function bindEvents() {
        completeButtons.forEach(function (button) {
            button.addEventListener("click", handleCompleteClick);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        cacheElements();
        bindEvents();
        renderState();
    });
})();
