(function () {
    const FALLBACK_LOCALE = "pt-BR";

    function getByPath(source, path) {
        if (!source || !path) return undefined;
        return path.split(".").reduce(function (acc, key) {
            if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
                return acc[key];
            }
            return undefined;
        }, source);
    }

    function setText(target, value) {
        if (value === undefined || value === null) return;
        target.textContent = String(value);
    }

    function applyAttributes(root, api) {
        const attrMap = [
            { attr: "data-i18n-placeholder", target: "placeholder" },
            { attr: "data-i18n-title", target: "title" },
            { attr: "data-i18n-aria-label", target: "aria-label" }
        ];

        attrMap.forEach(function (entry) {
            root.querySelectorAll("[" + entry.attr + "]").forEach(function (node) {
                const key = node.getAttribute(entry.attr);
                const value = api.t(key);
                if (value !== undefined) {
                    node.setAttribute(entry.target, String(value));
                }
            });
        });
    }

    function createI18nApi() {
        const locales = window.PLAYBOOK_I18N_LOCALES || {};
        const available = Object.keys(locales);
        let current = FALLBACK_LOCALE;
        const selectorDefaults = [
            { value: "pt-BR", label: "PT-BR" },
            { value: "es", label: "ES" },
            { value: "en", label: "EN" }
        ];

        function safeLocale(locale) {
            if (locale && locales[locale]) return locale;
            return FALLBACK_LOCALE;
        }

        function t(path, defaultValue, localeOverride) {
            if (!path) return defaultValue;

            const locale = safeLocale(localeOverride || current);
            const fromCurrent = getByPath(locales[locale], path);
            if (fromCurrent !== undefined) return fromCurrent;

            const fromFallback = getByPath(locales[FALLBACK_LOCALE], path);
            if (fromFallback !== undefined) return fromFallback;

            return defaultValue;
        }

        function apply(root) {
            const scopedRoot = root || document;

            scopedRoot.querySelectorAll("[data-i18n]").forEach(function (node) {
                const key = node.getAttribute("data-i18n");
                const value = t(key);
                setText(node, value);
            });

            scopedRoot.querySelectorAll("[data-i18n-html]").forEach(function (node) {
                const key = node.getAttribute("data-i18n-html");
                const value = t(key);
                if (value !== undefined && value !== null) {
                    node.innerHTML = String(value);
                }
            });

            applyAttributes(scopedRoot, { t: t });
            document.documentElement.lang = safeLocale(current);
        }

        function setLocale(locale, options) {
            current = safeLocale(locale);
            const shouldApply = !options || options.apply !== false;
            if (shouldApply) {
                apply(document);
            }
            return current;
        }

        function renderLanguageSelector(options) {
            const settings = options || {};
            const selectorId = settings.selectorId || "playbookLanguageSelector";
            const target = settings.target;

            if (!target || document.getElementById(selectorId)) {
                return null;
            }

            const wrapper = document.createElement("div");
            wrapper.className = settings.wrapperClass || "language-selector-wrap";

            const label = document.createElement("label");
            label.className = settings.labelClass || "language-selector-label";
            label.setAttribute("for", selectorId);
            label.textContent = t("common.language.selectorLabel", "Language");

            const select = document.createElement("select");
            select.id = selectorId;
            select.className = settings.inputClass || "language-selector-input";
            select.setAttribute(
                "aria-label",
                t("common.language.selectorAriaLabel", "Select interface language")
            );
            select.setAttribute(
                "title",
                t("common.language.selectorTitle", "Change language")
            );

            const optionSource = Array.isArray(settings.options) && settings.options.length
                ? settings.options
                : selectorDefaults;

            optionSource.forEach(function (optionMeta) {
                const option = document.createElement("option");
                option.value = optionMeta.value;
                option.textContent = optionMeta.label;
                select.appendChild(option);
            });

            select.value = safeLocale(current);
            select.addEventListener("change", function () {
                if (typeof window.playbookSetLocale === "function") {
                    window.playbookSetLocale(select.value, { reload: true });
                }
            });

            wrapper.appendChild(label);
            wrapper.appendChild(select);
            target.appendChild(wrapper);

            return select;
        }

        return {
            t: t,
            apply: apply,
            setLocale: setLocale,
            renderLanguageSelector: renderLanguageSelector,
            getLocale: function () { return current; },
            getAvailableLocales: function () { return available.slice(); },
            init: function (locale) {
                current = safeLocale(locale);
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", function () { apply(document); });
                } else {
                    apply(document);
                }
                return current;
            }
        };
    }

    window.PlaybookI18n = createI18nApi();
})();
