(function () {
    if (!window.PlaybookI18n) return;

    const defaultLocale = "pt-BR";
    const locale = window.localStorage.getItem("playbookLocale") || defaultLocale;
    const activeLocale = window.PlaybookI18n.init(locale);

    if (activeLocale !== locale) {
        window.localStorage.setItem("playbookLocale", activeLocale);
    }

    window.playbookSetLocale = function (nextLocale, options) {
        const updated = window.PlaybookI18n.setLocale(nextLocale);
        window.localStorage.setItem("playbookLocale", updated);
        const shouldReload = !options || options.reload !== false;
        if (shouldReload) {
            window.location.reload();
        }
        return updated;
    };
})();
