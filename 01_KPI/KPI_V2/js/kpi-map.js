document.addEventListener("DOMContentLoaded", function () {
    const currentNavLink = document.querySelector(".kpi-main-nav-link[aria-current='page']");
    if (currentNavLink && !currentNavLink.classList.contains("is-active")) {
        currentNavLink.classList.add("is-active");
    }
});
