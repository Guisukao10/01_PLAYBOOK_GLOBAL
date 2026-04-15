window.PLAYBOOK_I18N_LOCALES = window.PLAYBOOK_I18N_LOCALES || {};

(function () {
    function merge(target, source) {
        Object.keys(source).forEach(function (key) {
            var sourceValue = source[key];
            var targetValue = target[key];
            if (
                sourceValue &&
                typeof sourceValue === "object" &&
                !Array.isArray(sourceValue) &&
                targetValue &&
                typeof targetValue === "object" &&
                !Array.isArray(targetValue)
            ) {
                merge(targetValue, sourceValue);
                return;
            }
            target[key] = sourceValue;
        });
    }

    var patches = {
        "pt-BR": {
            common: {
                language: {
                    selectorAriaLabel: "Selecionar idioma da interface",
                    selectorTitle: "Alterar idioma"
                },
                ux: {
                    breadcrumb: {
                        ariaLabel: "Trilha de navegacao"
                    },
                    context: {
                        currentModule: "Modulo atual:"
                    },
                    nextAction: {
                        title: "Proxima acao",
                        description: "Continue pela etapa mais logica da jornada."
                    },
                    related: {
                        title: "Paginas relacionadas"
                    },
                    modules: {
                        kpi: "KPIs Globais",
                        kanban: "Kanban",
                        fluxoGlobal: "Fluxo Global",
                        prioridade: "Matriz de Prioridade",
                        camposObrigatorios: "Campos Obrigatórios",
                        governanca: "Governança",
                        canaisEntrada: "Canais de Entrada",
                        zohoDesk: "Operacao Zoho Desk"
                    }
                },
                terms: {
                    fluxoGlobal: "Fluxo Global",
                    prioridade: "Prioridade",
                    matrizPrioridade: "Matriz de Prioridade",
                    governanca: "Governança",
                    camposObrigatorios: "Campos Obrigatórios",
                    kanban: "Kanban",
                    kpis: "KPIs",
                    kpisGlobais: "KPIs Globais"
                }
            },
            home: {
                hero: {
                    eyebrow: "Governança Global de Atendimento",
                    executiveTitle: "Portal Executivo de Operacoes",
                    executiveSubtitle: "Visao consolidada para padronizar indicadores e acelerar decisoes.",
                    executiveSupport: "Esta pagina concentra a leitura executiva da operacao e o acesso rapido aos modulos criticos.",
                    dashboardCta: "Abrir dashboard",
                    panelTitle: "Pilares da leitura executiva",
                    pillars: {
                        unifiedGovernance: {
                            title: "Governança unificada",
                            description: "Regras comuns para comparabilidade entre regioes."
                        },
                        outcomeView: {
                            title: "Visao de resultado",
                            description: "SLA, backlog, aging e qualidade em uma leitura unica."
                        },
                        layeredNavigation: {
                            title: "Navegacao por camadas",
                            description: "Do resumo executivo ao detalhamento analitico em poucos cliques."
                        }
                    }
                },
                systemValue: {
                    title: "Valor estrategico da plataforma",
                    lead: "A home organiza a leitura gerencial da operacao com foco em monitoramento, governanca e decisao."
                },
                sections: {
                    globalService: {
                        title: "Camada de governanca operacional",
                        description: "Base para padronizar atendimento, regras operacionais e leitura de desempenho."
                    },
                    zohoDesk: {
                        title: "Padronizacao de plataforma",
                        description: "Trilha funcional do Zoho Desk para manter consistencia operacional e evolucao controlada."
                    }
                },
                quickAccess: {
                    title: "Acesso rapido",
                    description: "Entradas diretas para os ambientes de uso recorrente.",
                    cards: {
                        dashboard: {
                            description: "Painel consolidado para leitura executiva do desempenho."
                        },
                        expandedMap: {
                            description: "Visao analitica para aprofundar cortes e causas."
                        },
                        executiveBi: {
                            description: "Acesso ao painel Power BI em ambiente dedicado."
                        }
                    }
                }
            },
            kpi: {
                landing: {
                    nav: {
                        openOfficial: "Abrir linha oficial (KPI_V2)"
                    },
                    hero: {
                        title: "KPIs Globais",
                        subtitle: "Linha oficial consolidada: KPI_V2",
                        description: "Este modulo centraliza a leitura de indicadores em uma unica linha oficial para reduzir duplicidade e manter consistencia gerencial.",
                        openArchitecture: "Abrir arquitetura",
                        openDashboard: "Abrir dashboard executivo"
                    },
                    structure: {
                        title: "Estrutura da linha oficial"
                    },
                    navigation: {
                        title: "Navegacao oficial do modulo"
                    },
                    connection: {
                        title: "Integracao com a jornada do Playbook"
                    }
                },
                v2: {
                    index: {
                        title: "Playbook Global - Arquitetura de KPIs",
                        header: {
                            brand: "KPIs Globais"
                        },
                        nav: {
                            architecture: "Arquitetura",
                            dashboard: "Dashboard",
                            expandedMap: "Mapa expandido"
                        },
                        hero: {
                            title: "Arquitetura de KPIs Globais",
                            subtitle: "Estrutura de indicadores para governanca de atendimento",
                            description: "Esta pagina organiza a arquitetura de KPIs do atendimento global para orientar leitura executiva, analise operacional e desdobramentos no dashboard.",
                            openDashboard: "Abrir dashboard",
                            viewExpandedMap: "Ver mapa expandido"
                        },
                        sections: {
                            architecture: "Arquitetura de KPIs",
                            dimensions: "Dimensoes de analise",
                            navigation: "Navegacao"
                        },
                        architecture: {
                            globalDashboard: "GLOBAL DASHBOARD",
                            pillars: {
                                ticketVolume: {
                                    title: "Volume de Tickets",
                                    description: "Monitora demanda e distribuicao dos chamados."
                                },
                                firstResponseTime: {
                                    title: "Tempo de Primeira Resposta",
                                    description: "Mede a agilidade do primeiro retorno ao cliente."
                                },
                                resolutionTime: {
                                    title: "Tempo de Resolucao",
                                    description: "Mede o tempo ate a conclusao do atendimento."
                                },
                                sla: {
                                    title: "SLA",
                                    description: "Mede a aderencia aos prazos de atendimento."
                                },
                                quality: {
                                    title: "Qualidade",
                                    description: "Mede eficiencia operacional, estabilidade da fila e qualidade de entrega."
                                }
                            }
                        },
                        navigation: {
                            dashboard: {
                                title: "Dashboard Executivo",
                                description: "Acesse a leitura consolidada dos principais indicadores executivos e operacionais.",
                                cta: "Abrir Dashboard"
                            },
                            expandedMap: {
                                title: "Mapa Expandido",
                                description: "Aprofunde cortes, cruzamentos e causas para analise detalhada dos KPIs.",
                                cta: "Ver Mapa Expandido"
                            }
                        }
                    },
                    dashboard: {
                        title: "Playbook Global - Dashboard Executivo",
                        header: {
                            brand: "GLOBAL SERVICE GOVERNANCE"
                        },
                        hero: {
                            eyebrow: "Painel executivo",
                            title: "Indicadores globais consolidados",
                            subtitle: "Leitura executiva do desempenho operacional com acesso direto ao painel oficial.",
                            openBi: "Abrir BI em nova aba"
                        },
                        biFrameTitle: "Power BI - Dashboard executivo",
                        status: {
                            initial: "Se o painel nao carregar nesta visualizacao, use o acesso em nova aba.",
                            timeout: "Nao foi possivel confirmar o carregamento integrado. Use o acesso em nova aba.",
                            success: "Painel carregado na visualizacao integrada. Para tela cheia, use a nova aba.",
                            error: "Nao foi possivel carregar o painel nesta visualizacao. Abra o BI em nova aba."
                        }
                    },
                    map: {
                        title: "Playbook Global - Mapa Expandido de KPIs",
                        hero: {
                            title: "Mapa expandido de KPIs",
                            subtitle: "Exploracao analitica dos principais indicadores globais",
                            description: "Esta pagina detalha os desdobramentos dos principais KPIs do atendimento global, seus cortes analiticos e cruzamentos prioritarios."
                        },
                        structure: {
                            level1: { label: "Nivel 1", text: "KPI principal" },
                            level2: { label: "Nivel 2", text: "Cortes principais" },
                            level3: { label: "Nivel 3", text: "Cruzamentos prioritarios" }
                        },
                        reading: {
                            title: "Como ler este mapa"
                        },
                        nav: {
                            ticketVolume: "Volume de Tickets",
                            mtfc: "MTFC",
                            mttr: "MTTR",
                            sla: "SLA",
                            quality: "Qualidade"
                        },
                        final: {
                            title: "Como usar este mapa",
                            description: "Este mapa expandido orienta a leitura do dashboard executivo e os desdobramentos analiticos para publico executivo, gerencial e operacional.",
                            backArchitecture: "Voltar para Arquitetura",
                            backDashboard: "Voltar para Dashboard"
                        }
                    }
                }
            },
            kanban: {
                landing: {
                    highlight: "O Kanban torna o status do ticket explícito, orienta a movimentação correta e melhora a leitura de backlog, aging e SLA.",
                    overview: {
                        title: "Visão geral do Kanban",
                        description: "O quadro oficial organiza a jornada do ticket em seis status. Cada mudança deve refletir o estado real do atendimento.",
                        rule: "Regra central: movimentação formal entre status, executada pelo suporte técnico interno."
                    },
                    visualReading: {
                        title: "Leitura visual: trabalho ativo x espera"
                    },
                    flowReading: {
                        title: "Leitura operacional do fluxo",
                        caption: "Ciclo base: atendimento ativo, registro de espera real e retorno à execução até o fechamento."
                    },
                    navigation: {
                        title: "Navegação essencial do módulo"
                    }
                }
            },
            fluxoGlobal: {
                landing: {
                    guideHero: {
                        badge: "Guia oficial do processo",
                        title: "Fluxo Global do atendimento de ponta a ponta",
                        description: "Leitura visual e operacional do ticket: origem, distribuição automática, status oficiais, automações, métricas e encerramento.",
                        primaryCta: "Ver leitura detalhada por etapa",
                        secondaryCta: "Ver regras e automações"
                    },
                    hero: {
                        badge: "Artefato estrategico",
                        title: "Fluxo global da operação",
                        description: "Este módulo consolida etapas, status, responsabilidades, campos e tempos que sustentam a governança do atendimento."
                    },
                    mainBoard: {
                        title: "Quadro principal do fluxo",
                        description: "Jornada operacional em formato kanban para leitura de status, ownership, campos e riscos.",
                        visualGuide: "Leitura visual: azul para trabalho ativo, amarelo para espera e verde para encerramento."
                    },
                    legend: {
                        title: "Legenda operacional"
                    },
                    executiveReading: {
                        title: "Leitura executiva do fluxo",
                        cards: {
                            whyFlow: {
                                title: "Por que o fluxo importa",
                                description: "Define padrão único de atendimento e reduz variação entre equipes e regiões."
                            },
                            activeVsWaiting: {
                                title: "Ativo x espera",
                                description: "Separar execução de dependência evita distorções de backlog, aging e produtividade."
                            },
                            slaBase: {
                                title: "Base de SLA e indicadores",
                                description: "Primeira resposta e resolução dependem de transições corretas e registros consistentes."
                            },
                            governanceConnection: {
                                title: "Conexão com governança",
                                description: "Status, ownership e campos por etapa sustentam auditoria e decisões de gestão."
                            }
                        }
                    },
                    tracksNavigation: {
                        title: "Navegação por trilhas"
                    }
                },
                stagesPage: {
                    title: "Fluxo Global - Etapas do Fluxo",
                    header: {
                        title: "Etapas do Fluxo",
                        subtitle: "Significado operacional de cada status do ticket",
                        backToFlow: "Voltar para Fluxo Global"
                    },
                    hero: {
                        badge: "Guia operacional por status",
                        title: "Etapas do Fluxo",
                        description: "Esta página aprofunda o papel de cada status do fluxo global: objetivo, atuação, informações da etapa e regras rápidas."
                    },
                    overview: {
                        title: "Visão geral das etapas",
                        description: "Leitura rápida da sequência oficial antes do detalhamento de cada etapa."
                    },
                    details: {
                        title: "Etapas detalhadas"
                    }
                },
                data: {
                    labels: {
                        currentTrackPrefix: "Trilha atual:",
                        owner: "Owner principal",
                        requiredFields: "Campos obrigatórios",
                        desirableFields: "Campos desejáveis",
                        automaticFields: "Campos automáticos",
                        impactedIndicators: "Indicadores afetados",
                        slaTime: "SLA / Tempo",
                        risk: "Risco:",
                        noRequiredFields: "Sem campos obrigatórios nesta etapa.",
                        noDesirableFields: "Sem campos desejáveis nesta etapa.",
                        noAutomaticFields: "Sem campos automáticos nesta etapa.",
                        stageDetailWhenToUse: "Quando usar:",
                        stageDetailWhoActs: "Quem atua:",
                        stageDetailRequiredFields: "Campos obrigatórios:",
                        stageDetailDesirableFields: "Campos desejáveis:",
                        stageDetailAutomaticFields: "Campos automáticos relevantes:",
                        stageDetailOperationalCare: "Cuidado operacional:"
                    }
                }
            },
            prioridade: {
                landing: {
                    nav: {
                        viewFlow: "Ver fluxo global"
                    },
                    hero: {
                        title: "Matriz de Prioridade",
                        subtitle: "Regra unica para converter contexto em criticidade operacional",
                        description: "Este modulo define como calcular e aplicar prioridade para organizar fila, padronizar decisao e sustentar leitura de SLA, backlog e aging.",
                        startConcept: "Ver conceito",
                        runSimulation: "Executar simulacao"
                    },
                    function: {
                        title: "Papel da prioridade na arquitetura do Playbook"
                    },
                    navigation: {
                        title: "Navegacao interna do modulo"
                    },
                    connection: {
                        title: "Conexao com os demais modulos"
                    }
                }
            },
            camposObrigatorios: {
                landing: {
                    hero: {
                        title: "Campos Obrigatórios",
                        subtitle: "Politica global, operacao por etapa e referencia consolidada",
                        description: "A estrutura em tres frentes separa regra normativa, execucao operacional e consulta rapida para reduzir retrabalho e aumentar consistencia.",
                        openPolicy: "Abrir politica global",
                        openOperation: "Abrir operacao por etapa",
                        openReference: "Abrir referencia consolidada"
                    },
                    fronts: {
                        title: "Entradas oficiais do modulo"
                    },
                    quickAccess: {
                        title: "Acesso rapido"
                    }
                }
            },
            governanca: {
                landing: {
                    hero: {
                        subtitle: "Ritmo de decisao, disciplina operacional e leitura gerencial do modelo global",
                        description: "Este modulo define como a operacao e acompanhada, corrigida e escalada por rituais, responsabilidades, indicadores e auditoria.",
                        startOverview: "Comecar pela visao geral",
                        viewNavigation: "Ver navegacao do modulo"
                    },
                    architecture: {
                        title: "Arquitetura de governanca"
                    },
                    pyramid: {
                        title: "Piramide de governanca",
                        description: "Niveis de reuniao, responsaveis, saidas e decisoes para governanca operacional e executiva."
                    },
                    navigation: {
                        title: "Navegacao interna",
                        cards: {
                            overview: { cta: "Ver visao geral" },
                            rituals: { cta: "Ver rituais" },
                            responsibilities: { cta: "Ver responsabilidades" },
                            indicators: { cta: "Ver indicadores" },
                            audit: { cta: "Ver auditoria" }
                        }
                    }
                }
            },
            canaisEntrada: {
                landing: {
                    hero: {
                        subtitle: "Canais de acesso ao atendimento com padrao minimo de abertura",
                        description: "O modulo define os canais de entrada e reforca a regra central: independentemente da origem, o ticket deve iniciar com dados minimos consistentes."
                    },
                    channels: {
                        title: "Canais oficiais"
                    },
                    principle: {
                        title: "O canal varia. O padrao minimo do ticket nao.",
                        description: "Mesmo com diferencas operacionais entre paises, a abertura deve garantir os dados minimos para classificacao, tratamento e governanca."
                    },
                    connection: {
                        title: "Conexao com o modelo operacional"
                    },
                    navigation: {
                        title: "Navegacao interna"
                    }
                }
            },
            tutorialZoho: {
                landing: {
                    hero: {
                        title: "Operacao Zoho Desk por contexto de uso",
                        description: "A estrutura em tres frentes separa rotina de tickets, gestao cadastral e boas praticas para reduzir sobreposicao e aumentar consistencia.",
                        openTickets: "Abrir operacao de tickets",
                        openContacts: "Abrir gestao de contatos e clientes",
                        openBestPractices: "Abrir boas praticas operacionais"
                    },
                    entries: {
                        title: "Entradas oficiais do modulo",
                        description: "Escolha a trilha pelo tipo de necessidade operacional."
                    },
                    directAccess: {
                        description: "<strong>Acesso direto:</strong> para seguir a trilha sequencial anterior, inicie em Visao Geral da Interface.",
                        cta: "Iniciar na etapa 1"
                    }
                }
            }
        },
        es: {
            common: {
                language: {
                    selectorAriaLabel: "Seleccionar idioma de la interfaz",
                    selectorTitle: "Cambiar idioma"
                },
                ux: {
                    breadcrumb: {
                        ariaLabel: "Ruta de navegacion"
                    },
                    context: {
                        currentModule: "Modulo actual:"
                    },
                    nextAction: {
                        title: "Proxima accion",
                        description: "Continue con la etapa mas logica de la jornada."
                    },
                    related: {
                        title: "Paginas relacionadas"
                    },
                    modules: {
                        kpi: "KPIs Globales",
                        kanban: "Kanban",
                        fluxoGlobal: "Flujo Global",
                        prioridade: "Matriz de Prioridad",
                        camposObrigatorios: "Campos Obligatorios",
                        governanca: "Gobernanza",
                        canaisEntrada: "Canales de Entrada",
                        zohoDesk: "Operacion Zoho Desk"
                    }
                },
                terms: {
                    fluxoGlobal: "Flujo Global",
                    prioridade: "Prioridad",
                    matrizPrioridade: "Matriz de Prioridad",
                    governanca: "Gobernanza",
                    camposObrigatorios: "Campos Obligatorios",
                    kanban: "Kanban",
                    kpis: "KPIs",
                    kpisGlobais: "KPIs Globales"
                }
            },
            home: {
                hero: {
                    eyebrow: "Gobernanza Global de Atencion",
                    executiveTitle: "Portal Ejecutivo de Operaciones",
                    executiveSubtitle: "Vision consolidada para estandarizar indicadores y acelerar decisiones.",
                    executiveSupport: "Esta pagina concentra la lectura ejecutiva de la operacion y el acceso rapido a los modulos criticos.",
                    dashboardCta: "Abrir dashboard",
                    panelTitle: "Pilares de la lectura ejecutiva",
                    pillars: {
                        unifiedGovernance: {
                            title: "Gobernanza unificada",
                            description: "Reglas comunes para comparabilidad entre regiones."
                        },
                        outcomeView: {
                            title: "Vision de resultados",
                            description: "SLA, backlog, aging y calidad en una lectura unica."
                        },
                        layeredNavigation: {
                            title: "Navegacion por capas",
                            description: "Del resumen ejecutivo al detalle analitico en pocos clics."
                        }
                    }
                },
                systemValue: {
                    title: "Valor estrategico de la plataforma",
                    lead: "La home organiza la lectura gerencial de la operacion con foco en monitoreo, gobernanza y decision."
                },
                sections: {
                    globalService: {
                        title: "Capa de gobernanza operativa",
                        description: "Base para estandarizar atencion, reglas operativas y lectura de desempeno."
                    },
                    zohoDesk: {
                        title: "Estandarizacion de plataforma",
                        description: "Ruta funcional de Zoho Desk para mantener consistencia operativa y evolucion controlada."
                    }
                },
                quickAccess: {
                    title: "Acceso rapido",
                    description: "Entradas directas para los entornos de uso recurrente.",
                    cards: {
                        dashboard: {
                            description: "Panel consolidado para lectura ejecutiva del desempeno."
                        },
                        expandedMap: {
                            description: "Vision analitica para profundizar cortes y causas."
                        },
                        executiveBi: {
                            description: "Acceso al panel de Power BI en entorno dedicado."
                        }
                    }
                }
            },
            kpi: {
                landing: {
                    nav: {
                        openOfficial: "Abrir linea oficial (KPI_V2)"
                    },
                    hero: {
                        title: "KPIs Globales",
                        subtitle: "Linea oficial consolidada: KPI_V2",
                        description: "Este modulo centraliza la lectura de indicadores en una unica linea oficial para reducir duplicidad y mantener consistencia gerencial.",
                        openArchitecture: "Abrir arquitectura",
                        openDashboard: "Abrir dashboard ejecutivo"
                    },
                    structure: {
                        title: "Estructura de la linea oficial"
                    },
                    navigation: {
                        title: "Navegacion oficial del modulo"
                    },
                    connection: {
                        title: "Integracion con la jornada del Playbook"
                    }
                },
                v2: {
                    index: {
                        nav: {
                            architecture: "Arquitectura",
                            dashboard: "Dashboard",
                            expandedMap: "Mapa expandido"
                        },
                        hero: {
                            description: "Esta pagina organiza la arquitectura de KPIs del servicio global para orientar lectura ejecutiva y analisis operacional.",
                            openDashboard: "Abrir dashboard",
                            viewExpandedMap: "Ver mapa expandido"
                        },
                        architecture: {
                            globalDashboard: "DASHBOARD GLOBAL",
                            pillars: {
                                ticketVolume: { title: "Volumen de Tickets", description: "Monitorea demanda y distribucion de tickets." },
                                firstResponseTime: { title: "Tiempo de Primera Respuesta", description: "Mide la agilidad del primer retorno al cliente." },
                                resolutionTime: { title: "Tiempo de Resolucion", description: "Mide el tiempo hasta concluir la atencion." },
                                sla: { title: "SLA", description: "Mide la adherencia a plazos de atencion." },
                                quality: { title: "Calidad", description: "Mide eficiencia operativa y estabilidad del backlog." }
                            }
                        },
                        navigation: {
                            dashboard: {
                                title: "Dashboard Ejecutivo",
                                description: "Acceda a la lectura consolidada de los principales indicadores.",
                                cta: "Abrir Dashboard"
                            },
                            expandedMap: {
                                title: "Mapa Expandido",
                                description: "Profundice cortes y cruces para analisis detallado.",
                                cta: "Ver Mapa Expandido"
                            }
                        }
                    },
                    dashboard: {
                        hero: {
                            openBi: "Abrir BI en nueva pestana"
                        }
                    },
                    map: {
                        hero: {
                            description: "Esta pagina detalla los desdoblamientos de los KPIs globales y sus principales cruces analiticos."
                        },
                        structure: {
                            level1: { label: "Nivel 1", text: "KPI principal" },
                            level2: { label: "Nivel 2", text: "Cortes principales" },
                            level3: { label: "Nivel 3", text: "Cruces prioritarios" }
                        },
                        reading: {
                            title: "Como leer este mapa"
                        },
                        nav: {
                            ticketVolume: "Volumen de Tickets",
                            mtfc: "MTFC",
                            mttr: "MTTR",
                            sla: "SLA",
                            quality: "Calidad"
                        },
                        final: {
                            title: "Como usar este mapa",
                            description: "Este mapa expandido orienta la lectura del dashboard ejecutivo y los desdoblamientos analiticos.",
                            backArchitecture: "Volver a Arquitectura",
                            backDashboard: "Volver al Dashboard"
                        }
                    }
                }
            },
            fluxoGlobal: {
                landing: {
                    guideHero: {
                        badge: "Guia oficial del proceso",
                        title: "Flujo Global de atencion de punta a punta",
                        description: "Lectura visual y operativa del ticket: origen, distribucion automatica, estados oficiales, automatizaciones, metricas y cierre.",
                        primaryCta: "Ver lectura detallada por etapa",
                        secondaryCta: "Ver reglas y automatizaciones"
                    },
                    hero: {
                        badge: "Artefacto estrategico",
                        title: "Flujo global de la operacion",
                        description: "Este modulo consolida etapas, estados, responsabilidades, campos y tiempos que sustentan la gobernanza del servicio."
                    },
                    mainBoard: {
                        title: "Panel principal del flujo",
                        description: "Jornada operativa en formato kanban para lectura de estados, ownership, campos y riesgos.",
                        visualGuide: "Lectura visual: azul para trabajo activo, amarillo para espera y verde para cierre."
                    },
                    legend: {
                        title: "Leyenda operativa"
                    },
                    executiveReading: {
                        title: "Lectura ejecutiva del flujo",
                        cards: {
                            whyFlow: {
                                title: "Por que importa el flujo",
                                description: "Define un estandar unico de atencion y reduce variaciones entre equipos y regiones."
                            },
                            activeVsWaiting: {
                                title: "Activo vs espera",
                                description: "Separar ejecucion y dependencia evita distorsiones de backlog, aging y productividad."
                            },
                            slaBase: {
                                title: "Base de SLA e indicadores",
                                description: "Primera respuesta y resolucion dependen de transiciones correctas y registros consistentes."
                            },
                            governanceConnection: {
                                title: "Conexion con gobernanza",
                                description: "Estados, ownership y campos por etapa sostienen auditoria y decisiones de gestion."
                            }
                        }
                    },
                    tracksNavigation: {
                        title: "Navegacion por rutas"
                    }
                },
                stagesPage: {
                    title: "Flujo Global - Etapas del Flujo",
                    header: {
                        title: "Etapas del Flujo",
                        subtitle: "Significado operativo de cada estado del ticket",
                        backToFlow: "Volver a Flujo Global"
                    },
                    hero: {
                        badge: "Guia operativo por estado",
                        title: "Etapas del Flujo",
                        description: "Esta pagina profundiza el rol de cada estado del flujo global: objetivo, actuacion, informacion de la etapa y reglas rapidas."
                    },
                    overview: {
                        title: "Vision general de las etapas",
                        description: "Lectura rapida de la secuencia oficial antes del detalle de cada etapa."
                    },
                    details: {
                        title: "Etapas detalladas"
                    }
                },
                data: {
                    labels: {
                        currentTrackPrefix: "Ruta actual:",
                        owner: "Owner principal",
                        requiredFields: "Campos obligatorios",
                        desirableFields: "Campos recomendados",
                        automaticFields: "Campos automaticos",
                        impactedIndicators: "Indicadores impactados",
                        slaTime: "SLA / Tiempo",
                        risk: "Riesgo:",
                        noRequiredFields: "Sin campos obligatorios en esta etapa.",
                        noDesirableFields: "Sin campos recomendados en esta etapa.",
                        noAutomaticFields: "Sin campos automaticos en esta etapa.",
                        stageDetailWhenToUse: "Cuando usar:",
                        stageDetailWhoActs: "Quien actua:",
                        stageDetailRequiredFields: "Campos obligatorios:",
                        stageDetailDesirableFields: "Campos recomendados:",
                        stageDetailAutomaticFields: "Campos automaticos relevantes:",
                        stageDetailOperationalCare: "Cuidado operativo:"
                    }
                }
            }
            ,
            kanban: {
                landing: {
                    highlight: "Kanban hace explicito el estado del ticket, orienta el movimiento correcto y mejora la lectura de backlog, aging y SLA.",
                    overview: {
                        title: "Vision general del Kanban",
                        description: "El panel oficial organiza la jornada del ticket en seis estados. Cada cambio debe reflejar el estado real de la atencion.",
                        rule: "Regla central: movimiento formal entre estados, ejecutado por soporte tecnico interno."
                    },
                    visualReading: {
                        title: "Lectura visual: trabajo activo vs espera"
                    },
                    flowReading: {
                        title: "Lectura operativa del flujo",
                        caption: "Ciclo base: atencion activa, registro de espera real y retorno a ejecucion hasta el cierre."
                    },
                    navigation: {
                        title: "Navegacion esencial del modulo"
                    }
                }
            },
            prioridade: {
                landing: {
                    nav: {
                        viewFlow: "Ver Flujo Global"
                    },
                    hero: {
                        title: "Matriz de Prioridad",
                        subtitle: "Regla unica para convertir contexto en criticidad operativa",
                        description: "Este modulo define como calcular y aplicar prioridad para ordenar la cola, estandarizar decisiones y sostener la lectura de SLA, backlog y aging.",
                        startConcept: "Ver concepto",
                        runSimulation: "Ejecutar simulacion"
                    },
                    function: {
                        title: "Rol de la prioridad en la arquitectura del Playbook"
                    },
                    navigation: {
                        title: "Navegacion interna del modulo"
                    },
                    connection: {
                        title: "Conexion con los demas modulos"
                    }
                }
            },
            camposObrigatorios: {
                landing: {
                    hero: {
                        title: "Campos Obligatorios",
                        subtitle: "Politica global, operacion por etapa y referencia consolidada",
                        description: "La estructura en tres frentes separa regla normativa, ejecucion operativa y consulta rapida para reducir retrabajo y aumentar consistencia.",
                        openPolicy: "Abrir politica global",
                        openOperation: "Abrir operacion por etapa",
                        openReference: "Abrir referencia consolidada"
                    },
                    fronts: {
                        title: "Entradas oficiales del modulo"
                    },
                    quickAccess: {
                        title: "Acceso rapido"
                    }
                }
            },
            governanca: {
                landing: {
                    hero: {
                        subtitle: "Ritmo de decision, disciplina operativa y lectura gerencial del modelo global",
                        description: "Este modulo define como se monitorea, corrige y escala la operacion por rituales, responsabilidades, indicadores y auditoria.",
                        startOverview: "Comenzar por vision general",
                        viewNavigation: "Ver navegacion del modulo"
                    },
                    architecture: {
                        title: "Arquitectura de gobernanza"
                    },
                    pyramid: {
                        title: "Piramide de gobernanza",
                        description: "Niveles de reunion, responsables, entregables y decisiones para gobernanza operativa y ejecutiva."
                    },
                    navigation: {
                        title: "Navegacion interna",
                        cards: {
                            overview: { cta: "Ver vision general" },
                            rituals: { cta: "Ver rituales" },
                            responsibilities: { cta: "Ver responsabilidades" },
                            indicators: { cta: "Ver indicadores" },
                            audit: { cta: "Ver auditoria" }
                        }
                    }
                }
            },
            canaisEntrada: {
                landing: {
                    hero: {
                        subtitle: "Canales de acceso al servicio con estandar minimo de apertura",
                        description: "El modulo define los canales de entrada y refuerza la regla central: independientemente del origen, el ticket debe iniciar con datos minimos consistentes."
                    },
                    channels: {
                        title: "Canales oficiales"
                    },
                    principle: {
                        title: "El canal cambia. El estandar minimo del ticket no.",
                        description: "Incluso con diferencias operativas entre paises, la apertura debe garantizar datos minimos para clasificacion, tratamiento y gobernanza."
                    },
                    connection: {
                        title: "Conexion con el modelo operativo"
                    },
                    navigation: {
                        title: "Navegacion interna"
                    }
                }
            },
            tutorialZoho: {
                landing: {
                    hero: {
                        title: "Operacion de Zoho Desk por contexto de uso",
                        description: "La estructura en tres frentes separa rutina de tickets, gestion de datos y buenas practicas para reducir superposicion y aumentar consistencia.",
                        openTickets: "Abrir operacion de tickets",
                        openContacts: "Abrir gestion de contactos y clientes",
                        openBestPractices: "Abrir buenas practicas operativas"
                    },
                    entries: {
                        title: "Entradas oficiales del modulo",
                        description: "Elija la ruta segun el tipo de necesidad operativa."
                    },
                    directAccess: {
                        description: "<strong>Acceso directo:</strong> para seguir la ruta secuencial anterior, comience en Vision General de la Interfaz.",
                        cta: "Iniciar en la etapa 1"
                    }
                }
            }
        },
        en: {
            common: {
                language: {
                    selectorAriaLabel: "Select interface language",
                    selectorTitle: "Change language"
                },
                ux: {
                    breadcrumb: {
                        ariaLabel: "Navigation path"
                    },
                    context: {
                        currentModule: "Current module:"
                    },
                    nextAction: {
                        title: "Next action",
                        description: "Continue with the most logical step in the journey."
                    },
                    related: {
                        title: "Related pages"
                    },
                    modules: {
                        kpi: "Global KPIs",
                        kanban: "Kanban",
                        fluxoGlobal: "Global Flow",
                        prioridade: "Priority Matrix",
                        camposObrigatorios: "Required Fields",
                        governanca: "Governance",
                        canaisEntrada: "Input Channels",
                        zohoDesk: "Zoho Desk Operations"
                    }
                },
                terms: {
                    fluxoGlobal: "Global Flow",
                    prioridade: "Priority",
                    matrizPrioridade: "Priority Matrix",
                    governanca: "Governance",
                    camposObrigatorios: "Required Fields",
                    kanban: "Kanban",
                    kpis: "KPIs",
                    kpisGlobais: "Global KPIs"
                }
            },
            home: {
                hero: {
                    eyebrow: "Global Service Governance",
                    executiveTitle: "Executive Operations Portal",
                    executiveSubtitle: "Consolidated view to standardize indicators and accelerate decisions.",
                    executiveSupport: "This page centralizes executive reading of operations and quick access to critical modules.",
                    dashboardCta: "Open dashboard",
                    panelTitle: "Executive reading pillars",
                    pillars: {
                        unifiedGovernance: {
                            title: "Unified governance",
                            description: "Common rules for cross-region comparability."
                        },
                        outcomeView: {
                            title: "Outcome view",
                            description: "SLA, backlog, aging, and quality in a single view."
                        },
                        layeredNavigation: {
                            title: "Layered navigation",
                            description: "From executive summary to analytical detail in a few clicks."
                        }
                    }
                },
                systemValue: {
                    title: "Strategic platform value",
                    lead: "The home page structures management reading of operations with focus on monitoring, governance, and decision-making."
                },
                sections: {
                    globalService: {
                        title: "Operational governance layer",
                        description: "Foundation to standardize service, operating rules, and performance reading."
                    },
                    zohoDesk: {
                        title: "Platform standardization",
                        description: "Zoho Desk functional track to keep operational consistency and controlled evolution."
                    }
                },
                quickAccess: {
                    title: "Quick access",
                    description: "Direct entries to frequently used environments.",
                    cards: {
                        dashboard: {
                            description: "Consolidated panel for executive performance reading."
                        },
                        expandedMap: {
                            description: "Analytical view to deep-dive into cuts and root causes."
                        },
                        executiveBi: {
                            description: "Access to the Power BI panel in a dedicated environment."
                        }
                    }
                }
            },
            kpi: {
                landing: {
                    nav: {
                        openOfficial: "Open official line (KPI_V2)"
                    },
                    hero: {
                        title: "Global KPIs",
                        subtitle: "Official consolidated line: KPI_V2",
                        description: "This module centralizes indicator reading in one official line to reduce duplication and keep management consistency.",
                        openArchitecture: "Open architecture",
                        openDashboard: "Open executive dashboard"
                    },
                    structure: {
                        title: "Official line structure"
                    },
                    navigation: {
                        title: "Official module navigation"
                    },
                    connection: {
                        title: "Connection with the Playbook journey"
                    }
                },
                v2: {
                    index: {
                        nav: {
                            architecture: "Architecture",
                            dashboard: "Dashboard",
                            expandedMap: "Expanded map"
                        },
                        hero: {
                            description: "This page organizes the global service KPI architecture to guide executive reading and operational analysis.",
                            openDashboard: "Open dashboard",
                            viewExpandedMap: "View expanded map"
                        },
                        architecture: {
                            globalDashboard: "GLOBAL DASHBOARD",
                            pillars: {
                                ticketVolume: { title: "Ticket Volume", description: "Monitors ticket demand and distribution." },
                                firstResponseTime: { title: "First Response Time", description: "Measures first customer response agility." },
                                resolutionTime: { title: "Resolution Time", description: "Measures time to complete support." },
                                sla: { title: "SLA", description: "Measures compliance with response timelines." },
                                quality: { title: "Quality", description: "Measures operational efficiency and backlog stability." }
                            }
                        },
                        navigation: {
                            dashboard: {
                                title: "Executive Dashboard",
                                description: "Access the consolidated view of key executive indicators.",
                                cta: "Open Dashboard"
                            },
                            expandedMap: {
                                title: "Expanded Map",
                                description: "Deep dive into cuts and cross-analyses of KPIs.",
                                cta: "View Expanded Map"
                            }
                        }
                    },
                    dashboard: {
                        hero: {
                            openBi: "Open BI in a new tab"
                        }
                    },
                    map: {
                        hero: {
                            description: "This page details the breakdown of global KPIs and their key analytical cross-sections."
                        },
                        structure: {
                            level1: { label: "Level 1", text: "Main KPI" },
                            level2: { label: "Level 2", text: "Main cuts" },
                            level3: { label: "Level 3", text: "Priority cross-sections" }
                        },
                        reading: {
                            title: "How to read this map"
                        },
                        nav: {
                            ticketVolume: "Ticket Volume",
                            mtfc: "MTFC",
                            mttr: "MTTR",
                            sla: "SLA",
                            quality: "Quality"
                        },
                        final: {
                            title: "How to use this map",
                            description: "This expanded map supports executive dashboard reading and analytical deep dives.",
                            backArchitecture: "Back to Architecture",
                            backDashboard: "Back to Dashboard"
                        }
                    }
                }
            },
            fluxoGlobal: {
                landing: {
                    guideHero: {
                        badge: "Official process guide",
                        title: "Global Flow for end-to-end service",
                        description: "Visual and operational reading of tickets: origin, automated distribution, official statuses, automations, metrics, and closure.",
                        primaryCta: "View detailed stage reading",
                        secondaryCta: "View rules and automations"
                    },
                    hero: {
                        badge: "Strategic artifact",
                        title: "Global operational flow",
                        description: "This module consolidates stages, statuses, responsibilities, fields, and timing that support service governance."
                    },
                    mainBoard: {
                        title: "Main flow board",
                        description: "Operational journey in kanban format for reading statuses, ownership, fields, and risks.",
                        visualGuide: "Visual guide: blue for active work, yellow for waiting, and green for closure."
                    },
                    legend: {
                        title: "Operational legend"
                    },
                    executiveReading: {
                        title: "Executive flow reading",
                        cards: {
                            whyFlow: {
                                title: "Why the flow matters",
                                description: "Defines a single service standard and reduces variation across teams and regions."
                            },
                            activeVsWaiting: {
                                title: "Active vs waiting",
                                description: "Separating execution and dependency avoids backlog, aging, and productivity distortions."
                            },
                            slaBase: {
                                title: "SLA and indicator baseline",
                                description: "First response and resolution depend on correct transitions and consistent records."
                            },
                            governanceConnection: {
                                title: "Governance connection",
                                description: "Statuses, ownership, and stage fields support auditing and management decisions."
                            }
                        }
                    },
                    tracksNavigation: {
                        title: "Track-based navigation"
                    }
                },
                stagesPage: {
                    title: "Global Flow - Flow Stages",
                    header: {
                        title: "Flow Stages",
                        subtitle: "Operational meaning of each ticket status",
                        backToFlow: "Back to Global Flow"
                    },
                    hero: {
                        badge: "Operational guide by status",
                        title: "Flow Stages",
                        description: "This page deepens each global flow status: objective, actors, stage information, and quick rules."
                    },
                    overview: {
                        title: "Stages overview",
                        description: "Quick read of the official sequence before stage-by-stage detail."
                    },
                    details: {
                        title: "Detailed stages"
                    }
                },
                data: {
                    labels: {
                        currentTrackPrefix: "Current track:",
                        owner: "Primary owner",
                        requiredFields: "Required fields",
                        desirableFields: "Recommended fields",
                        automaticFields: "Automatic fields",
                        impactedIndicators: "Impacted indicators",
                        slaTime: "SLA / Time",
                        risk: "Risk:",
                        noRequiredFields: "No required fields in this stage.",
                        noDesirableFields: "No recommended fields in this stage.",
                        noAutomaticFields: "No automatic fields in this stage.",
                        stageDetailWhenToUse: "When to use:",
                        stageDetailWhoActs: "Who acts:",
                        stageDetailRequiredFields: "Required fields:",
                        stageDetailDesirableFields: "Recommended fields:",
                        stageDetailAutomaticFields: "Relevant automatic fields:",
                        stageDetailOperationalCare: "Operational caution:"
                    }
                }
            },
            kanban: {
                landing: {
                    highlight: "Kanban makes ticket status explicit, guides correct movement, and improves backlog, aging, and SLA reading.",
                    overview: {
                        title: "Kanban overview",
                        description: "The official board organizes the ticket journey into six statuses. Every movement must reflect the real service state.",
                        rule: "Core rule: formal status movement executed by internal technical support."
                    },
                    visualReading: {
                        title: "Visual reading: active work vs waiting"
                    },
                    flowReading: {
                        title: "Operational flow reading",
                        caption: "Base cycle: active handling, real waiting registration, and return to execution until closure."
                    },
                    navigation: {
                        title: "Essential module navigation"
                    }
                }
            },
            prioridade: {
                landing: {
                    nav: {
                        viewFlow: "View Global Flow"
                    },
                    hero: {
                        title: "Priority Matrix",
                        subtitle: "Single rule to convert context into operational criticality",
                        description: "This module defines how to calculate and apply priority to order the queue, standardize decisions, and support SLA, backlog, and aging reading.",
                        startConcept: "View concept",
                        runSimulation: "Run simulation"
                    },
                    function: {
                        title: "Priority role in Playbook architecture"
                    },
                    navigation: {
                        title: "Module internal navigation"
                    },
                    connection: {
                        title: "Connection with other modules"
                    }
                }
            },
            camposObrigatorios: {
                landing: {
                    hero: {
                        title: "Required Fields",
                        subtitle: "Global policy, stage-based operation, and consolidated reference",
                        description: "The three-front structure separates policy rule, operational execution, and quick reference to reduce rework and increase consistency.",
                        openPolicy: "Open global policy",
                        openOperation: "Open stage-based operation",
                        openReference: "Open consolidated reference"
                    },
                    fronts: {
                        title: "Official module entries"
                    },
                    quickAccess: {
                        title: "Quick access"
                    }
                }
            },
            governanca: {
                landing: {
                    hero: {
                        subtitle: "Decision cadence, operational discipline, and management reading of the global model",
                        description: "This module defines how operations are monitored, corrected, and escalated through rituals, responsibilities, indicators, and auditing.",
                        startOverview: "Start with overview",
                        viewNavigation: "View module navigation"
                    },
                    architecture: {
                        title: "Governance architecture"
                    },
                    pyramid: {
                        title: "Governance pyramid",
                        description: "Meeting levels, owners, outputs, and decisions for operational and executive governance."
                    },
                    navigation: {
                        title: "Internal navigation",
                        cards: {
                            overview: { cta: "View overview" },
                            rituals: { cta: "View rituals" },
                            responsibilities: { cta: "View responsibilities" },
                            indicators: { cta: "View indicators" },
                            audit: { cta: "View audit" }
                        }
                    }
                }
            },
            canaisEntrada: {
                landing: {
                    hero: {
                        subtitle: "Service access channels with minimum opening standard",
                        description: "This module defines intake channels and reinforces the core rule: regardless of source, tickets must start with consistent minimum data."
                    },
                    channels: {
                        title: "Official channels"
                    },
                    principle: {
                        title: "The channel changes. The ticket minimum standard does not.",
                        description: "Even with operational differences across countries, ticket opening must guarantee minimum data for classification, handling, and governance."
                    },
                    connection: {
                        title: "Connection with the operating model"
                    },
                    navigation: {
                        title: "Internal navigation"
                    }
                }
            },
            tutorialZoho: {
                landing: {
                    hero: {
                        title: "Zoho Desk operations by usage context",
                        description: "The three-front structure separates ticket routine, data management, and best practices to reduce overlap and increase consistency.",
                        openTickets: "Open ticket operations",
                        openContacts: "Open contacts and customers management",
                        openBestPractices: "Open operational best practices"
                    },
                    entries: {
                        title: "Official module entries",
                        description: "Choose the track based on the operational need."
                    },
                    directAccess: {
                        description: "<strong>Direct access:</strong> to follow the previous sequential track, start from Interface Overview.",
                        cta: "Start at step 1"
                    }
                }
            }
        }
    };

    Object.keys(patches).forEach(function (locale) {
        var base = window.PLAYBOOK_I18N_LOCALES[locale];
        if (!base) return;
        merge(base, patches[locale]);
    });
})();
