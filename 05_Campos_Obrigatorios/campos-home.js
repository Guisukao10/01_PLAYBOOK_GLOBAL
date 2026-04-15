(function () {
  const FALLBACK_LOCALE = "pt-BR";
  const CAMPOS_DATA_SRC = "./campos-data.js";

  function getI18n() {
    return window.PlaybookI18n || {
      t: function (_key, fallback) {
        return fallback;
      },
      getLocale: function () {
        return FALLBACK_LOCALE;
      }
    };
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getCurrentLocale() {
    const i18n = getI18n();
    if (typeof i18n.getLocale === "function") {
      return i18n.getLocale() || FALLBACK_LOCALE;
    }
    const htmlLang = document.documentElement.getAttribute("lang");
    return htmlLang || FALLBACK_LOCALE;
  }

  function getCamposData() {
    if (window.PlaybookCamposData && Array.isArray(window.PlaybookCamposData.fields)) {
      return window.PlaybookCamposData;
    }
    return { fields: [], enums: {} };
  }

  function ensureCamposData(callback) {
    if (window.PlaybookCamposData && Array.isArray(window.PlaybookCamposData.fields)) {
      callback();
      return;
    }

    if (window.__playbookCamposDataLoading) {
      document.addEventListener("campos:data-script-ready", callback, { once: true });
      return;
    }

    window.__playbookCamposDataLoading = true;
    const script = document.createElement("script");
    script.src = CAMPOS_DATA_SRC;
    script.async = false;
    script.onload = function () {
      window.__playbookCamposDataLoading = false;
      document.dispatchEvent(new CustomEvent("campos:data-script-ready"));
      callback();
    };
    script.onerror = function () {
      window.__playbookCamposDataLoading = false;
      console.error("Falha ao carregar a fonte unica de campos:", CAMPOS_DATA_SRC);
      callback();
    };
    document.head.appendChild(script);
  }

  function translateEnum(enumType, enumValue, i18n) {
    if (!enumValue) return "";
    const key = "camposObrigatorios.matrix." + enumType + "." + enumValue;
    return i18n.t(key, enumValue);
  }

  function translateField(fieldKey, i18n) {
    if (!fieldKey) return "";
    return i18n.t("camposObrigatorios.matrix.fields." + fieldKey, fieldKey);
  }

  function translateRule(ruleKey, i18n) {
    if (!ruleKey) return "";
    return i18n.t("camposObrigatorios.matrix.rules." + ruleKey, ruleKey);
  }

  function translateCondition(conditionKey, i18n) {
    if (!conditionKey) {
      return i18n.t("camposObrigatorios.matrix.common.notApplicable", "-");
    }
    return i18n.t("camposObrigatorios.matrix.conditions." + conditionKey, conditionKey);
  }

  function toLegacyPtRow(field, i18n) {
    const observation = (field.description ? String(field.description) : "").trim();
    const ruleText = translateRule(field.requiredRule, i18n);
    const conditionText = field.condition ? translateCondition(field.condition, i18n) : "";

    const observationParts = [];
    if (observation) observationParts.push(observation);
    if (conditionText && conditionText !== "-") observationParts.push(conditionText);
    if (ruleText) observationParts.push(ruleText);

    return [
      translateField(field.field, i18n),
      translateEnum("classifications", field.classification, i18n),
      translateEnum("inputTypes", field.inputType, i18n),
      translateEnum("owners", field.owner, i18n),
      translateEnum("stages", field.stage, i18n),
      observationParts.join(" ")
    ];
  }

  function buildDisplayRows(fields, i18n) {
    return fields.map(function (field) {
      const impacts = Array.isArray(field.impact) ? field.impact : [];
      const impactText = impacts
        .map(function (impactCode) {
          return translateEnum("impacts", impactCode, i18n);
        })
        .filter(Boolean)
        .join(", ");

      return {
        id: field.id,
        entity: field.entity,
        field: field.field,
        classification: field.classification,
        condition: field.condition,
        stage: field.stage,
        owner: field.owner,
        impact: impactText || i18n.t("camposObrigatorios.matrix.common.notApplicable", "-"),
        rule: field.requiredRule
      };
    });
  }

  function getBadgeClass(value) {
    const normalized = normalizeText(value);

    if (
      normalized === "mandatory" ||
      normalized.indexOf("obrigat") >= 0 ||
      normalized.indexOf("mandatory") >= 0 ||
      normalized.indexOf("obligat") >= 0
    ) {
      return "co-badge-global";
    }

    if (
      normalized === "recommended" ||
      normalized.indexOf("desej") >= 0 ||
      normalized.indexOf("recommended") >= 0 ||
      normalized.indexOf("deseable") >= 0
    ) {
      return "co-badge-desejavel";
    }

    if (
      normalized === "automatic" ||
      normalized.indexOf("automatic") >= 0 ||
      normalized.indexOf("interno automatico") >= 0 ||
      normalized.indexOf("autom") >= 0
    ) {
      return "co-badge-interno";
    }

    if (
      normalized === "conditional" ||
      normalized.indexOf("condicional") >= 0 ||
      normalized.indexOf("conditional") >= 0
    ) {
      return "co-badge-condicional";
    }

    return "co-badge-default";
  }

  function getOwnerBadgeClass(value) {
    const normalized = normalizeText(value);
    if (normalized === "system" || normalized === "sistema") return "co-badge-owner-sistema";
    if (normalized === "customer" || normalized === "cliente") return "co-badge-owner-cliente";
    if (normalized === "agent" || normalized === "agente") return "co-badge-owner-agente";
    if (normalized === "coordinator" || normalized === "coordenador") return "co-badge-owner-compartilhado";
    if (normalized.indexOf("/") >= 0) return "co-badge-owner-compartilhado";
    return "co-badge-default";
  }

  function writeSelectOptions(select, enumValues, enumType, i18n) {
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = i18n.t("camposObrigatorios.matrix.filters.all", "Todos");
    select.appendChild(allOption);

    enumValues.forEach(function (value) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = translateEnum(enumType, value, i18n);
      select.appendChild(option);
    });

    if (currentValue) select.value = currentValue;
  }

  function renderMatrixTable(rows, i18n) {
    const tbody = document.getElementById("consolidated-matrix-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!rows.length) {
      const empty = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 8;
      cell.className = "co-cell co-empty-row";
      cell.textContent = i18n.t("camposObrigatorios.matrix.filters.noResults", "Nenhum campo encontrado para os filtros selecionados.");
      empty.appendChild(cell);
      tbody.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    rows.forEach(function (row) {
      const tr = document.createElement("tr");

      const entityCell = document.createElement("td");
      entityCell.className = "co-cell";
      entityCell.textContent = translateEnum("entities", row.entity, i18n);

      const fieldCell = document.createElement("td");
      fieldCell.className = "co-cell";
      fieldCell.textContent = translateField(row.field, i18n);

      const classificationCell = document.createElement("td");
      classificationCell.className = "co-cell";
      const classificationBadge = document.createElement("span");
      const classificationLabel = translateEnum("classifications", row.classification, i18n);
      classificationBadge.className = "co-badge " + getBadgeClass(row.classification);
      classificationBadge.textContent = classificationLabel;
      classificationCell.appendChild(classificationBadge);

      const conditionCell = document.createElement("td");
      conditionCell.className = "co-cell";
      conditionCell.textContent = translateCondition(row.condition, i18n);

      const stageCell = document.createElement("td");
      stageCell.className = "co-cell";
      stageCell.textContent = translateEnum("stages", row.stage, i18n);

      const ownerCell = document.createElement("td");
      ownerCell.className = "co-cell";
      const ownerBadge = document.createElement("span");
      ownerBadge.className = "co-badge " + getOwnerBadgeClass(row.owner);
      ownerBadge.textContent = translateEnum("owners", row.owner, i18n);
      ownerCell.appendChild(ownerBadge);

      const impactCell = document.createElement("td");
      impactCell.className = "co-cell";
      impactCell.textContent = row.impact;

      const ruleCell = document.createElement("td");
      ruleCell.className = "co-cell";
      ruleCell.textContent = translateRule(row.rule, i18n);

      tr.appendChild(entityCell);
      tr.appendChild(fieldCell);
      tr.appendChild(classificationCell);
      tr.appendChild(conditionCell);
      tr.appendChild(stageCell);
      tr.appendChild(ownerCell);
      tr.appendChild(impactCell);
      tr.appendChild(ruleCell);

      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
  }

  function updateMatrixCount(total, i18n) {
    const target = document.getElementById("matrixResultsCount");
    if (!target) return;

    if (total === 1) {
      target.textContent = "1 " + i18n.t("camposObrigatorios.matrix.filters.resultSingular", "campo encontrado");
      return;
    }

    target.textContent = total + " " + i18n.t("camposObrigatorios.matrix.filters.resultPlural", "campos encontrados");
  }

  function applyMatrixFilters(displayRows, i18n) {
    const entityValue = (document.getElementById("matrixFilterEntity") || {}).value || "";
    const classificationValue = (document.getElementById("matrixFilterClassification") || {}).value || "";
    const stageValue = (document.getElementById("matrixFilterStage") || {}).value || "";
    const ownerValue = (document.getElementById("matrixFilterOwner") || {}).value || "";

    const filtered = displayRows.filter(function (row) {
      if (entityValue && row.entity !== entityValue) return false;
      if (classificationValue && row.classification !== classificationValue) return false;
      if (stageValue && row.stage !== stageValue) return false;
      if (ownerValue && row.owner !== ownerValue) return false;
      return true;
    });

    renderMatrixTable(filtered, i18n);
    updateMatrixCount(filtered.length, i18n);
  }

  function setupMatrix(displayRows, enums) {
    const tbody = document.getElementById("consolidated-matrix-body");
    if (!tbody) return;

    const i18n = getI18n();
    const enumBag = enums || {};

    writeSelectOptions(
      document.getElementById("matrixFilterEntity"),
      enumBag.entities || ["ticket", "contact_customer"],
      "entities",
      i18n
    );
    writeSelectOptions(
      document.getElementById("matrixFilterClassification"),
      enumBag.classifications || ["mandatory", "recommended", "automatic", "conditional"],
      "classifications",
      i18n
    );
    writeSelectOptions(
      document.getElementById("matrixFilterStage"),
      enumBag.stages || ["opening", "in_progress", "waiting_customer", "waiting_parts", "waiting_third_party", "resolution_closing", "system"],
      "stages",
      i18n
    );
    writeSelectOptions(
      document.getElementById("matrixFilterOwner"),
      enumBag.owners || ["customer", "agent", "system", "coordinator"],
      "owners",
      i18n
    );

    ["matrixFilterEntity", "matrixFilterClassification", "matrixFilterStage", "matrixFilterOwner"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", function () {
        applyMatrixFilters(displayRows, i18n);
      });
    });

    applyMatrixFilters(displayRows, i18n);
  }

  function publishLegacyRows(fields) {
    const ptI18n = {
      t: function (key, fallback) {
        return key ? getI18n().t(key, fallback, FALLBACK_LOCALE) : fallback;
      }
    };

    const ticketRows = fields
      .filter(function (field) {
        return field.entity === "ticket";
      })
      .map(function (field) {
        return toLegacyPtRow(field, ptI18n);
      });

    const contactRows = fields
      .filter(function (field) {
        return field.entity === "contact_customer";
      })
      .map(function (field) {
        return toLegacyPtRow(field, ptI18n);
      });

    window.ticketFields = ticketRows;
    window.contactFields = contactRows;
    document.dispatchEvent(new CustomEvent("campos:data-ready"));
  }

  function initCamposModule() {
    const data = getCamposData();
    const fields = Array.isArray(data.fields) ? data.fields : [];
    const i18n = getI18n();

    publishLegacyRows(fields);

    const displayRows = buildDisplayRows(fields, i18n);
    setupMatrix(displayRows, data.enums);
  }

  window.getBadgeClass = getBadgeClass;
  window.getOwnerBadgeClass = getOwnerBadgeClass;

  document.addEventListener("DOMContentLoaded", function () {
    ensureCamposData(initCamposModule);
  });
})();
