const epicModules = {
  global_service: {
    id: "global_service",
    modules: [
      { id: "fluxo", link: "./03_Fluxo_Global/index.html", status: "available" },
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
      { id: "operacao_zoho", link: "./09_Operacao_Zoho_Desk/index.html", status: "available" },
      { id: "automacoes", status: "coming_soon" },
      { id: "round_robin", status: "coming_soon" },
      { id: "regras_layout", status: "coming_soon" },
      { id: "evolucao_zoho", status: "coming_soon" }
    ]
  }
};

export default epicModules;
