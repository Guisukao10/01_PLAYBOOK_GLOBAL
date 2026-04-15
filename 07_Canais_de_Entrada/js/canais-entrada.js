document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.ce-nav-grid .btn-module');

    links.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });
});