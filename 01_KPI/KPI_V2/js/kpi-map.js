document.addEventListener("DOMContentLoaded", function () {
    initializeKPIMap();
});

function initializeKPIMap() {
    setupInternalNavigation();
    setupScrollTracking();
}

function setupInternalNavigation() {
    const navChips = document.querySelectorAll(".nav-kpi-chip");

    navChips.forEach(function (chip) {
        chip.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            const navBar = document.querySelector(".navegacao-kpis");
            const navHeight = navBar ? navBar.offsetHeight : 0;
            const header = document.querySelector(".header");
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetSection.offsetTop - headerHeight - navHeight - 8;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

function setupScrollTracking() {
    const sections = document.querySelectorAll(".kpi-bloco");
    const navChips = document.querySelectorAll(".nav-kpi-chip");

    window.addEventListener("scroll", function () {
        let currentSection = "";

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 180;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navChips.forEach(function (chip) {
            const isActive = chip.getAttribute("href") === "#" + currentSection;
            chip.classList.toggle("active", isActive);
            if (isActive) {
                chip.setAttribute("aria-current", "page");
            } else {
                chip.removeAttribute("aria-current");
            }
        });
    });
}
