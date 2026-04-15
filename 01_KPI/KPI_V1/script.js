// Dados mockados para o dashboard
const mockData = {
    kpis: {
        totalTickets: 2967,
        ticketsFechados: 2716,
        mtts: '4,41 dias',
        mttr: '7,38 h',
        slaCompliance: '45,87%',
        resolucaoRemota: '62%',
        backlog: 251,
        agingMais5Dias: '68,92%'
    },
    regioes: [
        { nome: 'Brasil', tickets: 1540, sla: '52%', mttr: '6,2h' },
        { nome: 'Argentina', tickets: 276, sla: '61%', mttr: '11 dias' },
        { nome: 'México', tickets: 190, sla: '43%', mttr: '8 dias' },
        { nome: 'EUA', tickets: 320, sla: '49%', mttr: '5,8h' },
        { nome: 'Europa', tickets: 450, sla: '55%', mttr: '7,1h' },
        { nome: 'ROW', tickets: 114, sla: '39%', mttr: '9,3h' },
        { nome: 'América Latina', tickets: 97, sla: '48%', mttr: '10,5h' }
    ],
    produtos: [
        { marca: 'Dabi Atlante', produto: 'Consultórios', tickets: 482, sla: '54%', mttr: '4,1 dias' },
        { marca: 'Saevo', produto: 'Tomógrafo', tickets: 318, sla: '41%', mttr: '6,7 dias' },
        { marca: 'Prexion', produto: 'Scanner IOS', tickets: 127, sla: '62%', mttr: '3,2 dias' },
        { marca: 'Outro', produto: 'Vários', tickets: 2040, sla: '45%', mttr: '7,5 dias' }
    ],
    alertas: [
        'Backlog elevado em Argentina',
        'SLA abaixo do target em ROW',
        'Produto "Tomógrafo" concentra maior tempo médio de resolução',
        'Brasil apresenta maior volume de tickets',
        'Resolução remota apresenta oportunidade de expansão em México'
    ]
};

// Função para adicionar interações ao mapa
function initMapInteractions() {
    const regions = document.querySelectorAll('.region');
    regions.forEach(region => {
        region.addEventListener('mouseenter', function() {
            this.style.fill = '#0056b3';
            this.style.r = this.r.baseVal.value + 2;
        });
        region.addEventListener('mouseleave', function() {
            this.style.fill = '#007bff';
            this.style.r = this.r.baseVal.value - 2;
        });
    });
}

// Função para adicionar tooltips aos cards de KPI
function initKPICardInteractions() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        });
    });
}

// Inicializar interações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initMapInteractions();
    initKPICardInteractions();
    console.log('Dashboard Global Service Governance carregado com dados mockados.');
});