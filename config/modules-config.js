const epicModules = {
  global_service: {
    id: "global_service",
    modules: [
      { id: "fluxo", link: "./03_Fluxo_Global/etapas-do-fluxo.html", status: "available" },
      { id: "matriz", link: "./04_Prioridade/index.html", status: "available" },
      { id: "campos", link: "./05_Campos_Obrigatorios/index.html", status: "available" },
      { id: "kanban", link: "./02_Kanban/index.html", status: "available" },
      { id: "governanca", link: "./06_Governanca/index.html", status: "available" },
      { id: "kpi", link: "./01_KPI/KPI_V2/index.html", status: "available" }
    ]
  },
  zoho_desk: {
    id: "zoho_desk",
    modules: [
      { id: "tutorial_zoho_desk", link: "./09_Zoho_Desk/01_Tutorial_Zoho_Desk/index.html", status: "available" },
      { id: "edicao_administracao_zoho_desk", link: "./09_Zoho_Desk/02_Edicao_Administracao/index.html", status: "available" }
    ]
  }
};

export default epicModules;
