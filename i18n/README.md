# i18n - Playbook Global

## Objetivo
Camada central de internacionalizacao para projeto estatico (HTML/CSS/JS puro), com fallback seguro para `pt-BR`.

## Estrutura
- `i18n/locales/pt-BR.js`: base oficial de textos nesta etapa.
- `i18n/locales/es.js`: reservado para futura traducao.
- `i18n/locales/en.js`: reservado para futura traducao.
- `i18n/locales/stage7-ui.js`: patch incremental da ETAPA 7 para chaves novas de UI e dicionario terminologico comum.
- `i18n/i18n.js`: API global (`window.PlaybookI18n`).
- `i18n/init.js`: bootstrap de idioma e aplicacao no DOM.

## Convencao de chaves
Formato hierarquico estavel por dominio:
- `common.*`
- `navigation.*`
- `home.*`
- `kpi.*`
- `kanban.*`
- `fluxoGlobal.*`
- `prioridade.*`
- `camposObrigatorios.*`
- `governanca.*`
- `canaisEntrada.*`
- `simulador.*` (somente legado/arquivado)
- `tutorialZoho.*`

Para homepage (padrao-mae de i18n), usar subgrupos semanticos:
- `home.header.*`
- `home.hero.*`
- `home.quickAccess.*`
- `home.axes.*`
- `home.value.*`
- `home.footer.*`

## Como usar no HTML
Use `data-i18n` no elemento:

```html
<h2 data-i18n="home.sections.epicsTitle">Dois epicos, uma governanca integrada</h2>
```

Para atributos:
- `data-i18n-placeholder`
- `data-i18n-title`
- `data-i18n-aria-label`

## Como usar no JavaScript

```js
const i18n = window.PlaybookI18n || { t: (_k, fallback) => fallback };
const label = i18n.t("common.buttons.open", "Abrir");
```

## Regras
- Sempre adicionar novo texto em `pt-BR.js` antes de usar.
- Para migracoes seguras por etapa, e permitido criar patches incrementais de locale (como `stage7-ui.js`) e carregar apos `pt-BR.js`, `es.js` e `en.js`.
- Evitar string hardcoded em `innerHTML`/`textContent` sem passar por `t()`.
- Reutilizar chaves em `common` e `navigation` quando o texto se repete.

## Padrao Oficial (ETAPA 7)
- Fonte unica: `window.PlaybookI18n` (sem engines paralelas).
- HTML estatico: `data-i18n` para texto e `data-i18n-*` para atributos.
- JS dinamico: `PlaybookI18n.t(chave, fallback)` com fallback defensivo.
- Chaves por dominio (`home.*`, `kpi.*`, `kanban.*`, `fluxoGlobal.*`, etc.).
- Termos recorrentes centralizados em `common.terms.*`.

## Padrao Oficial Consolidado (ETAPA 10)
- Runtime oficial unico: `i18n/i18n.js` + `i18n/init.js`.
- Seletor de idioma oficial unico: `PlaybookI18n.renderLanguageSelector(...)`, reutilizado por `js/global.js` e `01_KPI/KPI_V2/js/global.js`.
- Fonte textual oficial:
  - base por idioma em `i18n/locales/pt-BR.js`, `i18n/locales/es.js`, `i18n/locales/en.js`
  - patch estrutural de UI em `i18n/locales/stage7-ui.js` para migracao incremental segura dos hardcodes criticos.
- Convencao de chave:
  - `dominio.subdominio.elemento.propriedade`
  - exemplos: `home.hero.executiveTitle`, `kpi.v2.index.navigation.dashboard.cta`, `fluxoGlobal.data.labels.owner`.
- Regras para expansao:
  - textos de estrutura visivel (header, menu, botoes, titulos, CTAs, labels recorrentes) entram primeiro no i18n.
  - conteudo editorial longo pode ser migrado em ondas, sem quebrar pagina.
  - qualquer novo modulo deve usar `data-i18n` no HTML e `i18n.t(...)` em render dinamico.

## Idiomas disponiveis
- `pt-BR` (padrao)
- `es`
- `en`

## Troca de idioma
- Via seletor no header (quando a pagina carrega `../js/global.js` ou `js/global.js` junto da camada i18n).
- Via API:
  - `window.playbookSetLocale('pt-BR')`
  - `window.playbookSetLocale('es')`
  - `window.playbookSetLocale('en')`

Observacao: a troca faz recarga da pagina para garantir atualizacao dos blocos dinamicos.
