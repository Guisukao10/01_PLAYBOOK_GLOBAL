document.addEventListener("DOMContentLoaded", function () {
    addHoverEffects();
    setupButtonInteractions();
});

function addHoverEffects() {
    const cards = document.querySelectorAll(".pilar, .dimensao-card, .navegacao-card");
    cards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            this.style.transition = "all 0.3s ease";
        });
    });
}

function setupButtonInteractions() {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Mantém interação para eventuais métricas de clique do módulo KPI.
        });
    });
}

