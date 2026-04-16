const i18n = window.PlaybookI18n || {
    t: function (_key, fallback) {
        return fallback;
    }
};

const fallbackZohoJourney = [];

const zohoJourney = i18n.t('tutorialZoho.data.journey', fallbackZohoJourney);

function getCurrentStepIndex() {
    const current = window.location.pathname.split('/').pop();
    return zohoJourney.findIndex((step) => step.file === current);
}

function renderJourneyOverview() {
    const container = document.querySelector('[data-journey-overview]');
    if (!container) return;

    container.innerHTML = '';

    zohoJourney.forEach((step, index) => {
        const card = document.createElement('article');
        card.className = 'zd-step-card';
        if (index === 0) {
            card.classList.add('is-start');
        }

        const badge = document.createElement('span');
        badge.className = 'zd-step-number';
        badge.textContent = `${i18n.t('tutorialZoho.data.labels.stepPrefix', 'Etapa')} ${index + 1}`;

        const copy = document.createElement('div');
        copy.className = 'zd-step-copy';
        const title = document.createElement('strong');
        title.textContent = step.title;
        const text = document.createElement('p');
        text.textContent = step.summary;
        copy.appendChild(title);
        copy.appendChild(text);

        const link = document.createElement('a');
        link.className = 'btn-module';
        link.href = step.file;
        link.textContent = index === 0 ? i18n.t('tutorialZoho.data.labels.startStep', 'Iniciar etapa') : i18n.t('tutorialZoho.data.labels.openStep', 'Abrir etapa');

        card.appendChild(badge);
        card.appendChild(copy);
        card.appendChild(link);

        container.appendChild(card);
    });
}

function renderStepIndicator() {
    const index = getCurrentStepIndex();
    if (index < 0) return;

    const indicatorTargets = document.querySelectorAll('[data-step-indicator]');
    indicatorTargets.forEach((target) => {
        target.textContent = `${i18n.t('tutorialZoho.data.labels.stepPrefix', 'Etapa')} ${index + 1} de ${zohoJourney.length}`;
    });
}

function renderMiniJourney() {
    const index = getCurrentStepIndex();
    if (index < 0) return;

    const miniTargets = document.querySelectorAll('[data-step-mini]');
    miniTargets.forEach((target) => {
        target.innerHTML = '';

        zohoJourney.forEach((step, stepIndex) => {
            const link = document.createElement('a');
            link.className = 'zd-mini-link';
            link.href = step.file;
            link.textContent = `${stepIndex + 1}`;

            if (stepIndex === index) {
                link.setAttribute('aria-current', 'page');
                link.title = `${step.title} ${i18n.t('tutorialZoho.data.labels.stepCurrentSuffix', '(etapa atual)')}`;
            } else {
                link.title = step.title;
            }

            target.appendChild(link);
        });
    });
}

function renderStepNavigation() {
    const index = getCurrentStepIndex();
    if (index < 0) return;

    const navTargets = document.querySelectorAll('[data-step-nav]');
    navTargets.forEach((target) => {
        target.innerHTML = '';

        if (index > 0) {
            const prevLink = document.createElement('a');
            prevLink.className = 'btn-secondary';
            prevLink.href = zohoJourney[index - 1].file;
            prevLink.textContent = `${i18n.t('tutorialZoho.data.labels.backPrefix', 'Voltar:')} ${zohoJourney[index - 1].title}`;
            target.appendChild(prevLink);
        } else {
            const backToHome = document.createElement('a');
            backToHome.className = 'btn-secondary';
            backToHome.href = 'index.html';
            backToHome.textContent = i18n.t('tutorialZoho.data.labels.backToHome', 'Voltar para a home do módulo');
            target.appendChild(backToHome);
        }

        const homeLink = document.createElement('a');
        homeLink.className = 'btn-secondary';
        homeLink.href = 'index.html#jornada';
        homeLink.textContent = i18n.t('tutorialZoho.data.labels.viewJourney', 'Ver jornada completa');
        target.appendChild(homeLink);

        if (index < zohoJourney.length - 1) {
            const nextLink = document.createElement('a');
            nextLink.className = 'btn-module';
            nextLink.href = zohoJourney[index + 1].file;
            nextLink.textContent = `${i18n.t('tutorialZoho.data.labels.nextPrefix', 'Avançar:')} ${zohoJourney[index + 1].title}`;
            target.appendChild(nextLink);
        } else {
            const finishLink = document.createElement('a');
            finishLink.className = 'btn-module';
            finishLink.href = '../06_Governanca/index.html';
            finishLink.textContent = i18n.t('tutorialZoho.data.labels.finishToGovernance', 'Avançar para Governança Global');
            target.appendChild(finishLink);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderJourneyOverview();
    renderStepIndicator();
    renderMiniJourney();
    renderStepNavigation();
});



