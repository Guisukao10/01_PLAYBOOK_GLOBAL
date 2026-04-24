(function () {
  const CAMPOS_TOPICOS_I18N = window.PlaybookI18n || {
    t: function (_key, fallback) {
      return fallback;
    }
  };

  const fallbackTopicConfig = {
    informacoes: {
      ticketRequiredNames: [
        "Nome do solicitante / cliente",
        "E-mail",
        "Telefone",
        "Solicitante",
        "Tipo de atendimento",
        "Categoria",
        "Produto",
        "Marca do produto",
        "Assunto",
        "Descricao"
      ],
      contactRequiredNames: ["Nome", "Sobrenome", "Nome da conta", "E-mail", "Telefone/Celular"],
      conditionalRequiredNames: ["Numero de serie do equipamento"],
      closingRequiredNames: ["Resolucao / Resumo de resolucao"]
    }
  };

  function getTopicConfig() {
    return CAMPOS_TOPICOS_I18N.t("camposObrigatorios.data.topicConfig", fallbackTopicConfig);
  }

  function hasCamposData() {
    return Array.isArray(window.ticketFields) && Array.isArray(window.contactFields);
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function clearTarget(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (tbody) tbody.replaceChildren();
  }

  function renderTopicRows(rows, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.replaceChildren();

    const fragment = document.createDocumentFragment();

    rows.forEach(function (row) {
      const tr = document.createElement("tr");

      row.forEach(function (value, index) {
        const td = document.createElement("td");
        td.className = "co-cell";

        if (index === 1 && typeof window.getBadgeClass === "function") {
          const badge = document.createElement("span");
          badge.className = "co-badge " + window.getBadgeClass(value);
          badge.textContent = value;
          td.appendChild(badge);
        } else if (index === 3 && typeof window.getOwnerBadgeClass === "function") {
          const badge = document.createElement("span");
          badge.className = "co-badge " + window.getOwnerBadgeClass(value);
          badge.textContent = value;
          td.appendChild(badge);
        } else {
          td.textContent = value;
        }

        tr.appendChild(td);
      });

      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
  }

  function renderSimpleList(items, targetId, badgeLabel, badgeClass) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.replaceChildren();

    const fragment = document.createDocumentFragment();
    items.forEach(function (text) {
      const li = document.createElement("li");
      li.className = "co-required-line";

      const badge = document.createElement("span");
      badge.className = "co-badge " + badgeClass;
      badge.textContent = badgeLabel;

      const label = document.createElement("span");
      label.textContent = text;

      li.appendChild(badge);
      li.appendChild(label);
      fragment.appendChild(li);
    });

    target.appendChild(fragment);
  }

  function byNames(rows, names) {
    if (!Array.isArray(rows)) return [];
    if (!Array.isArray(names) || !names.length) return [];

    const normalizedNames = names.map(function (name) {
      return normalizeText(name);
    });

    return rows.filter(function (row) {
      return normalizedNames.indexOf(normalizeText(row[0])) >= 0;
    });
  }

  function renderInformacoesObrigatorias() {
    const cfg = getTopicConfig().informacoes || fallbackTopicConfig.informacoes;
    renderSimpleList(
      cfg.ticketRequiredNames || [],
      "required-ticket-list",
      CAMPOS_TOPICOS_I18N.t("camposObrigatorios.data.labels.requiredGlobal", "Obrigatorio global"),
      "co-badge-global"
    );
    renderSimpleList(
      cfg.contactRequiredNames || [],
      "required-contact-list",
      CAMPOS_TOPICOS_I18N.t("camposObrigatorios.data.labels.requiredGlobal", "Obrigatorio global"),
      "co-badge-global"
    );

    renderTopicRows(byNames(window.ticketFields, cfg.conditionalRequiredNames || []), "required-conditional-body");
    renderTopicRows(byNames(window.ticketFields, cfg.closingRequiredNames || []), "required-closing-body");
  }

  function renderAbertura() {
    const ticketRows = window.ticketFields.filter(function (row) {
      return normalizeText(row[4]).indexOf("abertura") >= 0;
    });
    const contactRows = window.contactFields.filter(function (row) {
      return normalizeText(row[4]).indexOf("abertura") >= 0;
    });

    renderTopicRows(ticketRows, "abertura-ticket-body");
    renderTopicRows(contactRows, "abertura-contact-body");
  }

  function renderAutomaticos() {
    const ticketRows = window.ticketFields.filter(function (row) {
      return normalizeText(row[1]).indexOf("automatic") >= 0 || normalizeText(row[2]).indexOf("automatic") >= 0;
    });
    const contactRows = window.contactFields.filter(function (row) {
      return normalizeText(row[1]).indexOf("automatic") >= 0 || normalizeText(row[2]).indexOf("automatic") >= 0;
    });

    renderTopicRows(ticketRows, "automaticos-ticket-body");
    renderTopicRows(contactRows, "automaticos-contact-body");
  }

  function renderAtendimento() {
    const stageKeywords = [
      "atendimento",
      "aguardando cliente",
      "aguardando peca",
      "aguardando terceiro"
    ];

    const ticketRows = window.ticketFields.filter(function (row) {
      const stage = normalizeText(row[4]);
      return stageKeywords.some(function (keyword) {
        return stage.indexOf(keyword) >= 0;
      });
    });

    renderTopicRows(ticketRows, "atendimento-ticket-body");
  }

  function renderFechamento() {
    const ticketRows = window.ticketFields.filter(function (row) {
      return normalizeText(row[4]).indexOf("resolucao / fechamento") >= 0;
    });
    renderTopicRows(ticketRows, "fechamento-ticket-body");
  }

  function renderGovernanca() {
    const ticketRows = window.ticketFields.filter(function (row) {
      return normalizeText(row[4]).indexOf("sistema") >= 0;
    });
    renderTopicRows(ticketRows, "governanca-ticket-body");
  }

  function executeForCurrentPage() {
    if (!hasCamposData()) return;

    const page = document.body.dataset.camposPage;
    switch (page) {
      case "informacoes":
        renderInformacoesObrigatorias();
        break;
      case "abertura":
        renderAbertura();
        break;
      case "automaticos":
        renderAutomaticos();
        break;
      case "atendimento":
        renderAtendimento();
        break;
      case "fechamento":
        renderFechamento();
        break;
      case "governanca":
        renderGovernanca();
        break;
      default:
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", executeForCurrentPage);
  document.addEventListener("campos:data-ready", executeForCurrentPage);
})();
