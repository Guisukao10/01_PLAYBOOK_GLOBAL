document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('[data-governanca-anchor-nav]');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const linkMap = new Map();

    links.forEach(function (link) {
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            linkMap.set(targetId, { link: link, section: targetEl });
        }
    });

    if (!linkMap.size) return;

    function setActive(targetId) {
        linkMap.forEach(function (entry, id) {
            const isActive = id === targetId;
            entry.link.classList.toggle('is-active', isActive);
            if (isActive) {
                entry.link.setAttribute('aria-current', 'page');
            } else {
                entry.link.removeAttribute('aria-current');
            }
        });
    }

    const hashId = window.location.hash ? window.location.hash.slice(1) : null;
    if (hashId && linkMap.has(hashId)) {
        setActive(hashId);
    } else {
        setActive(Array.from(linkMap.keys())[0]);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                let best = null;

                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    if (!best || entry.intersectionRatio > best.intersectionRatio) {
                        best = entry;
                    }
                });

                if (best && best.target && best.target.id) {
                    setActive(best.target.id);
                }
            },
            {
                root: null,
                rootMargin: '-32% 0px -52% 0px',
                threshold: [0.05, 0.25, 0.5, 0.75]
            }
        );

        linkMap.forEach(function (entry) {
            observer.observe(entry.section);
        });
    }

    links.forEach(function (link) {
        link.addEventListener('click', function () {
            const targetId = link.getAttribute('href').slice(1);
            if (linkMap.has(targetId)) {
                setActive(targetId);
            }
        });
    });
});
