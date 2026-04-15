const mockData = {
  pillars: [
    {
      title: 'Volume de Tickets',
      description: 'Mede volume total e distribuição dos chamados',
      levels: ['Região', 'Produto', 'Categoria', 'Tipo atendimento']
    },
    {
      title: 'Tempo de Primeira Resposta',
      description: 'Mede agilidade inicial no retorno ao cliente',
      levels: ['Região', 'Produto', 'Criticidade', 'Departamento']
    },
    {
      title: 'Tempo de Resolução',
      description: 'Mede tempo até conclusão do atendimento',
      levels: ['Região', 'Produto', 'Técnico', 'Criticidade']
    },
    {
      title: 'SLA',
      description: 'Mede conformidade com prazos definidos',
      levels: ['Região', 'Produto', 'Criticidade', 'Departamento']
    },
    {
      title: 'Qualidade',
      description: 'Mede saúde operacional do atendimento',
      levels: ['Resolução remota', 'Atendimento remoto', 'Reabertura', 'Backlog', 'Aging']
    }
  ],

  dimensions: [
    { title: 'Geografia', description: 'Campos para segmentação geográfica', items: ['Região', 'País', 'Cidade'] },
    { title: 'Produto', description: 'Campos para análise técnica', items: ['Marca', 'Produto', 'Linha'] },
    { title: 'Operação', description: 'Campos operacionais', items: ['Categoria', 'Tipo atendimento', 'Departamento', 'Criticidade', 'Atendimento remoto'] },
    { title: 'Tempo', description: 'Campos temporais', items: ['Ano', 'Mês', 'Semana'] }
  ],

  dashboard: {
    filters: ['Região', 'País', 'Marca', 'Produto', 'Categoria', 'Criticidade', 'Departamento', 'Canal'],
    kpis: [
      { title: 'Total Tickets', value: '243.482' },
      { title: 'Tickets Fechados', value: '210.983' },
      { title: 'MTTS', value: '2h 34m' },
      { title: 'MTTR', value: '6h 12m' },
      { title: 'SLA', value: '93.2%' },
      { title: 'Backlog', value: '14.832' },
      { title: 'Aging', value: '5.1%' },
      { title: 'Resolução Remota', value: '78.7%' }
    ],
    regions: [
      { name: 'Brasil', tickets: '76.238', sla: '91,8%', mttr: '5h 58m' },
      { name: 'Argentina', tickets: '28.923', sla: '92,6%', mttr: '6h 45m' },
      { name: 'México', tickets: '36.410', sla: '90,4%', mttr: '6h 22m' },
      { name: 'EUA', tickets: '59.103', sla: '94,8%', mttr: '5h 44m' },
      { name: 'Europa', tickets: '31.874', sla: '95,1%', mttr: '5h 31m' },
      { name: 'ROW', tickets: '9.370', sla: '92,0%', mttr: '6h 12m' },
      { name: 'LATAM', tickets: '41.564', sla: '93,0%', mttr: '6h 05m' }
    ],
    comparative: [
      { title: 'Volume por região', metric: 'Brasil, EUA, Europa, LATAM' },
      { title: 'SLA por região', metric: 'Europa 95.1%, EUA 94.8%' },
      { title: 'MTTR por região', metric: 'Argentina 6h45m, México 6h22m' }
    ],
    operation: [
      { title: 'Tickets por mês', value: '14.000 - 28.000' },
      { title: 'Backlog', value: '14.832' },
      { title: 'Tipo atendimento', value: 'Incidente, Requisição, Mudança' },
      { title: 'Canal', value: 'Chat, E-mail, Telefone, Portal' }
    ],
    products: [
      { brand: 'Alpha', product: 'Alpha Cloud', tickets: '8.730', sla: '94.5%', mttr: '5h 05m' },
      { brand: 'Beta', product: 'Beta Suite', tickets: '12.308', sla: '91.1%', mttr: '6h 24m' },
      { brand: 'Gamma', product: 'Gamma Secure', tickets: '7.204', sla: '96.6%', mttr: '4h 50m' },
      { brand: 'Delta', product: 'Delta Analytics', tickets: '9.941', sla: '93.2%', mttr: '6h 07m' }
    ],
    alerts: [
      { title: 'Backlog alto', message: 'Backlog acima de 14.000 tickets.' },
      { title: 'SLA baixo', message: 'SLA de algumas regiões abaixo de 92%.' },
      { title: 'Produto com alto MTTR', message: 'Beta Suite com 6h24m.' },
      { title: 'Região com maior volume', message: 'Brasil lidera com 76.238 tickets.' }
    ]
  },

  kpiMap: [
    {
      title: 'Volume', definition: 'Total de atendimentos recebidos',
      level2: ['Região', 'Produto', 'Categoria', 'Criticidade'],
      level3: ['Região + Produto', 'Produto + Criticidade'],
      strategies: ['Análise por concentração', 'Comparação inter-região', 'Sazonalidade por período']
    },
    {
      title: 'MTFC', definition: 'Mean Time to First Contact',
      level2: ['Região', 'Produto', 'Departamento'],
      level3: ['Produto + Criticidade', 'Região + Departamento'],
      strategies: ['Melhoria de tempo inicial', 'Times de resposta foco']
    },
    {
      title: 'MTTR', definition: 'Mean Time to Resolve',
      level2: ['Região', 'Produto', 'Técnico', 'Criticidade'],
      level3: ['Região + Produto', 'Produto + Criticidade'],
      strategies: ['Aprimoramento de SLA', 'Capacitação técnica por cluster']
    },
    {
      title: 'SLA', definition: 'Cumprimento de prazos acordados',
      level2: ['Região', 'Produto', 'Criticidade', 'Departamento'],
      level3: ['Região + Criticidade', 'Produto + Departamento'],
      strategies: ['Monitoramento contínuo', 'Plano preventivo de falhas']
    },
    {
      title: 'Qualidade', definition: 'Saúde dos serviços e satisfação',
      level2: ['Resolução remota', 'Backlog', 'Aging', 'Reabertura'],
      level3: ['Reabertura + Aging', 'Resolução remota + Backlog'],
      strategies: ['Redução de reabertura', 'Aprimoramento de atendimento remoto']
    }
  ]
};
