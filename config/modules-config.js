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
      { id: "primeiros_passos_zoho_desk", link: "./09_Zoho_Desk/01_Tutorial_Zoho_Desk/index.html", status: "available" },
      { id: "atendimento_atualizacao_tickets", status: "coming_soon" },
      { id: "boas_praticas_operacionais_zoho", status: "coming_soon" },
      { id: "filtros_visualizacoes_zoho", status: "coming_soon" },
      { id: "regras_globais_atendimento_zoho", status: "coming_soon" }
    ]
  }
};

export default epicModules;
