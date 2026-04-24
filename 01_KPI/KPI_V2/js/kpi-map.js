function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

function mergeDeep(target, source) {
    Object.keys(source).forEach(function (key) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (isPlainObject(sourceValue)) {
            if (!isPlainObject(targetValue)) {
                target[key] = {};
            }
            mergeDeep(target[key], sourceValue);
            return;
        }

        target[key] = sourceValue;
    });

    return target;
}

function registerKpiMapTranslations() {
    window.PLAYBOOK_I18N_LOCALES = window.PLAYBOOK_I18N_LOCALES || {};

    const bundles = {
        "pt-BR": {
            kpiMap: {
                journey: {
                    title: "Leitura executiva em 30 segundos",
                    description: "Use os 3 niveis para entender o que esta acontecendo, onde esta o problema e o que precisa ser feito."
                },
                readGuide: {
                    title: "Como ler este dashboard",
                    level1: {
                        label: "Nivel 1 - Top KPIs",
                        text: "Mostra a saude geral da operacao."
                    },
                    level2: {
                        label: "Nivel 2 - Mapa global",
                        text: "Mostra onde estao os problemas por regiao."
                    },
                    level3: {
                        label: "Nivel 3 - Tabela de tickets",
                        text: "Mostra onde agir operacionalmente."
                    }
                },
                labels: {
                    whatHappens: "O que esta acontecendo",
                    whereProblem: "Onde esta o problema",
                    whatToDo: "O que precisa ser feito"
                },
                levels: {
                    top: {
                        order: "Nivel 1",
                        title: "Top KPIs",
                        forWhat: "Leitura rapida da saude da operacao com foco em prazo, velocidade e percepcao do cliente.",
                        watch: {
                            kpiVariation: "SLA Compliance, MTFC, MTTS e CSAT",
                            statusColor: "Mudanca para amarelo ou vermelho",
                            weekTrend: "Tendencia da semana versus periodo anterior"
                        },
                        action: {
                            slaFocus: "Se SLA cair, priorize fila critica imediatamente",
                            mtfcFocus: "Se MTFC subir, reduzir tempo de primeira resposta",
                            mttsFocus: "Se MTTS subir, remover gargalos de resolucao"
                        }
                    },
                    map: {
                        order: "Nivel 2",
                        title: "Mapa global",
                        forWhat: "Leitura geografica para localizar onde o risco operacional esta concentrado.",
                        watch: {
                            redRegions: "Regioes vermelhas com pior performance",
                            yellowRegions: "Regioes amarelas em zona de atencao",
                            riskConcentration: "Concentracao de risco por regiao"
                        },
                        action: {
                            byVolume: "Investigar regioes vermelhas por volume",
                            byPriority: "Cruzar com prioridade para localizar risco real",
                            byServiceType: "Separar tipo de atendimento para plano de acao"
                        }
                    },
                    table: {
                        order: "Nivel 3",
                        title: "Tabela de tickets",
                        forWhat: "Camada operacional para decidir fila, owner e execucao diaria.",
                        watch: {
                            totalBacklog: "Volume total de backlog",
                            ticketAging: "Aging: tempo de ticket em aberto",
                            criticalPriorities: "Tickets criticos por prioridade e status"
                        },
                        action: {
                            oldestFirst: "Priorizar tickets mais antigos",
                            rebalanceCapacity: "Rebalancear capacidade por volume e aging",
                            dailyMonitoring: "Acompanhar crescimento continuo do backlog"
                        }
                    }
                },
                common: {
                    whatIsLabel: "O que e:",
                    readingLabel: "Leitura:",
                    insightLabel: "Insight:"
                },
                metrics: {
                    title: "KPIs principais para decisao",
                    tooltipHint: "i",
                    sla: {
                        name: "SLA Compliance",
                        tooltip: "Percentual de tickets dentro do SLA acordado.",
                        whatIs: "% de tickets dentro do SLA.",
                        reading: {
                            green: "Verde >= 90%",
                            yellow: "Amarelo 80-89%",
                            red: "Vermelho < 80%"
                        },
                        insight: "Indica se a operacao esta cumprindo o prazo acordado."
                    },
                    mtfc: {
                        name: "MTFC",
                        tooltip: "Tempo medio ate a primeira resposta ao cliente.",
                        whatIs: "Tempo medio ate primeira resposta.",
                        insight: "Mostra velocidade de entrada do atendimento."
                    },
                    mtts: {
                        name: "MTTS",
                        tooltip: "Tempo medio para concluir a solucao do ticket.",
                        whatIs: "Tempo medio de solucao.",
                        insight: "Mostra eficiencia na resolucao."
                    },
                    csat: {
                        name: "CSAT",
                        tooltip: "Indice de satisfacao informado pelo cliente no fechamento.",
                        whatIs: "Satisfacao do cliente.",
                        insight: "Mostra percepcao final do atendimento."
                    }
                },
                colors: {
                    title: "Camada de cores para leitura rapida",
                    description: "A regra visual deve ser igual nos KPIs e no mapa global.",
                    green: {
                        label: "Verde",
                        text: "Dentro da meta."
                    },
                    yellow: {
                        label: "Amarelo",
                        text: "Atencao."
                    },
                    red: {
                        label: "Vermelho",
                        text: "Fora da meta."
                    }
                },
                map: {
                    title: "Leitura do mapa global",
                    description: "O mapa mostra a performance por regiao.",
                    rules: {
                        green: "Verde: operacao controlada",
                        yellow: "Amarelo: atencao",
                        red: "Vermelho: risco operacional"
                    },
                    action: "Regioes em vermelho devem ser analisadas por volume, prioridade e tipo de atendimento."
                },
                backlog: {
                    title: "Gestao de backlog (critico)",
                    whatIs: {
                        title: "O que e backlog?",
                        text: "Tickets ainda nao resolvidos."
                    },
                    observe: {
                        title: "O que observar?",
                        volume: "Volume total",
                        aging: "Aging (tempo em aberto)"
                    },
                    rules: {
                        critical: "Backlog alto + aging alto -> risco critico",
                        controlled: "Backlog alto + aging baixo -> controlado",
                        capacity: "Crescimento continuo -> problema de capacidade"
                    },
                    action: "Priorize tickets mais antigos para reduzir risco operacional."
                },
                goals: {
                    title: "Metas operacionais",
                    sla: {
                        label: "SLA",
                        target: "Meta: >= 90%"
                    },
                    mtfc: {
                        title: "MTFC por prioridade",
                        p1: "P1: 1h",
                        p2: "P2: 2h",
                        p3: "P3: 3h",
                        p4: "P4: 5h",
                        p5: "P5: 6h"
                    },
                    mtts: {
                        label: "MTTS",
                        target: "Meta: reduzir tendencia ao longo do tempo"
                    }
                }
            }
        },
        en: {
            kpiMap: {
                journey: {
                    title: "Executive reading in 30 seconds",
                    description: "Use these 3 levels to understand what is happening, where the issue is, and what must be done."
                },
                readGuide: {
                    title: "How to read this dashboard",
                    level1: {
                        label: "Level 1 - Top KPIs",
                        text: "Shows overall operations health."
                    },
                    level2: {
                        label: "Level 2 - Global map",
                        text: "Shows where issues are by region."
                    },
                    level3: {
                        label: "Level 3 - Ticket table",
                        text: "Shows where to act operationally."
                    }
                },
                labels: {
                    whatHappens: "What is happening",
                    whereProblem: "Where the issue is",
                    whatToDo: "What needs to be done"
                },
                levels: {
                    top: {
                        order: "Level 1",
                        title: "Top KPIs",
                        forWhat: "Fast health reading with focus on deadline, speed, and customer perception.",
                        watch: {
                            kpiVariation: "SLA Compliance, MTFC, MTTS, and CSAT",
                            statusColor: "Shift to yellow or red",
                            weekTrend: "Week trend versus prior period"
                        },
                        action: {
                            slaFocus: "If SLA drops, prioritize the critical queue",
                            mtfcFocus: "If MTFC rises, cut first-response delay",
                            mttsFocus: "If MTTS rises, remove resolution bottlenecks"
                        }
                    },
                    map: {
                        order: "Level 2",
                        title: "Global map",
                        forWhat: "Geographic view to locate where operational risk is concentrated.",
                        watch: {
                            redRegions: "Red regions with worst performance",
                            yellowRegions: "Yellow regions in attention zone",
                            riskConcentration: "Risk concentration by region"
                        },
                        action: {
                            byVolume: "Review red regions by volume",
                            byPriority: "Cross-check with priority to find real risk",
                            byServiceType: "Break down service type for action plan"
                        }
                    },
                    table: {
                        order: "Level 3",
                        title: "Ticket table",
                        forWhat: "Operational layer to decide queue, owner, and daily execution.",
                        watch: {
                            totalBacklog: "Total backlog volume",
                            ticketAging: "Aging: open time per ticket",
                            criticalPriorities: "Critical tickets by priority and status"
                        },
                        action: {
                            oldestFirst: "Prioritize oldest tickets first",
                            rebalanceCapacity: "Rebalance capacity by volume and aging",
                            dailyMonitoring: "Track continuous backlog growth"
                        }
                    }
                },
                common: {
                    whatIsLabel: "What it is:",
                    readingLabel: "Reading:",
                    insightLabel: "Insight:"
                },
                metrics: {
                    title: "Main KPIs for decision making",
                    tooltipHint: "i",
                    sla: {
                        name: "SLA Compliance",
                        tooltip: "Percentage of tickets within the agreed SLA.",
                        whatIs: "% of tickets within SLA.",
                        reading: {
                            green: "Green >= 90%",
                            yellow: "Yellow 80-89%",
                            red: "Red < 80%"
                        },
                        insight: "Indicates whether the operation is meeting agreed deadlines."
                    },
                    mtfc: {
                        name: "MTFC",
                        tooltip: "Average time until the first response to the customer.",
                        whatIs: "Time until first response.",
                        insight: "Shows service intake speed."
                    },
                    mtts: {
                        name: "MTTS",
                        tooltip: "Average time to complete ticket resolution.",
                        whatIs: "Time to solve.",
                        insight: "Shows resolution efficiency."
                    },
                    csat: {
                        name: "CSAT",
                        tooltip: "Customer satisfaction score collected at closure.",
                        whatIs: "Customer satisfaction.",
                        insight: "Shows final customer perception of service."
                    }
                },
                colors: {
                    title: "Color layer for quick reading",
                    description: "The same visual rule should be used for KPIs and reinforced on the global map.",
                    green: {
                        label: "Green",
                        text: "Within target."
                    },
                    yellow: {
                        label: "Yellow",
                        text: "Attention."
                    },
                    red: {
                        label: "Red",
                        text: "Out of target."
                    }
                },
                map: {
                    title: "Global map reading",
                    description: "The map shows performance by region.",
                    rules: {
                        green: "Green: operation under control",
                        yellow: "Yellow: attention",
                        red: "Red: operational risk"
                    },
                    action: "Red regions must be analyzed by volume, priority, and service type."
                },
                backlog: {
                    title: "Backlog management (critical)",
                    whatIs: {
                        title: "What is backlog?",
                        text: "Tickets not resolved yet."
                    },
                    observe: {
                        title: "What to watch?",
                        volume: "Total volume",
                        aging: "Aging (time open)"
                    },
                    rules: {
                        critical: "High backlog + high aging -> critical risk",
                        controlled: "High backlog + low aging -> controlled",
                        capacity: "Continuous growth -> capacity issue"
                    },
                    action: "Prioritize oldest tickets first to reduce operational risk."
                },
                goals: {
                    title: "Operational targets",
                    sla: {
                        label: "SLA",
                        target: "Target: >= 90%"
                    },
                    mtfc: {
                        title: "MTFC by priority",
                        p1: "P1: 1h",
                        p2: "P2: 2h",
                        p3: "P3: 3h",
                        p4: "P4: 5h",
                        p5: "P5: 6h"
                    },
                    mtts: {
                        label: "MTTS",
                        target: "Target: reduce trend over time"
                    }
                }
            }
        },
        es: {
            kpiMap: {
                journey: {
                    title: "Lectura ejecutiva en 30 segundos",
                    description: "Usa estos 3 niveles para entender que esta pasando, donde esta el problema y que se debe hacer."
                },
                readGuide: {
                    title: "Como leer este dashboard",
                    level1: {
                        label: "Nivel 1 - Top KPIs",
                        text: "Muestra la salud general de la operacion."
                    },
                    level2: {
                        label: "Nivel 2 - Mapa global",
                        text: "Muestra donde estan los problemas por region."
                    },
                    level3: {
                        label: "Nivel 3 - Tabla de tickets",
                        text: "Muestra donde actuar operativamente."
                    }
                },
                labels: {
                    whatHappens: "Que esta pasando",
                    whereProblem: "Donde esta el problema",
                    whatToDo: "Que se debe hacer"
                },
                levels: {
                    top: {
                        order: "Nivel 1",
                        title: "Top KPIs",
                        forWhat: "Lectura rapida de salud con foco en plazo, velocidad y percepcion del cliente.",
                        watch: {
                            kpiVariation: "SLA Compliance, MTFC, MTTS y CSAT",
                            statusColor: "Cambio a amarillo o rojo",
                            weekTrend: "Tendencia semanal versus periodo anterior"
                        },
                        action: {
                            slaFocus: "Si SLA baja, priorizar cola critica",
                            mtfcFocus: "Si MTFC sube, reducir demora de primera respuesta",
                            mttsFocus: "Si MTTS sube, eliminar cuellos de resolucion"
                        }
                    },
                    map: {
                        order: "Nivel 2",
                        title: "Mapa global",
                        forWhat: "Lectura geografica para localizar donde se concentra el riesgo operativo.",
                        watch: {
                            redRegions: "Regiones rojas con peor performance",
                            yellowRegions: "Regiones amarillas en zona de atencion",
                            riskConcentration: "Concentracion de riesgo por region"
                        },
                        action: {
                            byVolume: "Analizar regiones rojas por volumen",
                            byPriority: "Cruzar con prioridad para ubicar riesgo real",
                            byServiceType: "Separar tipo de atencion para plan de accion"
                        }
                    },
                    table: {
                        order: "Nivel 3",
                        title: "Tabla de tickets",
                        forWhat: "Capa operativa para decidir cola, owner y ejecucion diaria.",
                        watch: {
                            totalBacklog: "Volumen total de backlog",
                            ticketAging: "Aging: tiempo abierto del ticket",
                            criticalPriorities: "Tickets criticos por prioridad y estado"
                        },
                        action: {
                            oldestFirst: "Priorizar tickets mas antiguos",
                            rebalanceCapacity: "Rebalancear capacidad por volumen y aging",
                            dailyMonitoring: "Monitorear crecimiento continuo del backlog"
                        }
                    }
                },
                common: {
                    whatIsLabel: "Que es:",
                    readingLabel: "Lectura:",
                    insightLabel: "Insight:"
                },
                metrics: {
                    title: "KPIs principales para decision",
                    tooltipHint: "i",
                    sla: {
                        name: "SLA Compliance",
                        tooltip: "Porcentaje de tickets dentro del SLA acordado.",
                        whatIs: "% de tickets dentro del SLA.",
                        reading: {
                            green: "Verde >= 90%",
                            yellow: "Amarillo 80-89%",
                            red: "Rojo < 80%"
                        },
                        insight: "Indica si la operacion cumple el plazo acordado."
                    },
                    mtfc: {
                        name: "MTFC",
                        tooltip: "Tiempo medio hasta la primera respuesta al cliente.",
                        whatIs: "Tiempo hasta primera respuesta.",
                        insight: "Muestra la velocidad de entrada de la atencion."
                    },
                    mtts: {
                        name: "MTTS",
                        tooltip: "Tiempo medio para resolver el ticket.",
                        whatIs: "Tiempo de solucion.",
                        insight: "Muestra eficiencia en la resolucion."
                    },
                    csat: {
                        name: "CSAT",
                        tooltip: "Indice de satisfaccion informado por el cliente al cierre.",
                        whatIs: "Satisfaccion del cliente.",
                        insight: "Muestra percepcion final de la atencion."
                    }
                },
                colors: {
                    title: "Capa de colores para lectura rapida",
                    description: "La misma regla visual debe aplicarse en KPIs y reforzarse en el mapa global.",
                    green: {
                        label: "Verde",
                        text: "Dentro de meta."
                    },
                    yellow: {
                        label: "Amarillo",
                        text: "Atencion."
                    },
                    red: {
                        label: "Rojo",
                        text: "Fuera de meta."
                    }
                },
                map: {
                    title: "Lectura del mapa global",
                    description: "El mapa muestra la performance por region.",
                    rules: {
                        green: "Verde: operacion controlada",
                        yellow: "Amarillo: atencion",
                        red: "Rojo: riesgo operativo"
                    },
                    action: "Las regiones en rojo deben analizarse por volumen, prioridad y tipo de atencion."
                },
                backlog: {
                    title: "Gestion de backlog (critico)",
                    whatIs: {
                        title: "Que es backlog?",
                        text: "Tickets aun no resueltos."
                    },
                    observe: {
                        title: "Que observar?",
                        volume: "Volumen total",
                        aging: "Aging (tiempo abierto)"
                    },
                    rules: {
                        critical: "Backlog alto + aging alto -> riesgo critico",
                        controlled: "Backlog alto + aging bajo -> controlado",
                        capacity: "Crecimiento continuo -> problema de capacidad"
                    },
                    action: "Prioriza tickets mas antiguos para reducir riesgo operativo."
                },
                goals: {
                    title: "Metas operativas",
                    sla: {
                        label: "SLA",
                        target: "Meta: >= 90%"
                    },
                    mtfc: {
                        title: "MTFC por prioridad",
                        p1: "P1: 1h",
                        p2: "P2: 2h",
                        p3: "P3: 3h",
                        p4: "P4: 5h",
                        p5: "P5: 6h"
                    },
                    mtts: {
                        label: "MTTS",
                        target: "Meta: reducir tendencia en el tiempo"
                    }
                }
            }
        }
    };

    Object.keys(bundles).forEach(function (locale) {
        const localeBundle = window.PLAYBOOK_I18N_LOCALES[locale] || {};
        window.PLAYBOOK_I18N_LOCALES[locale] = mergeDeep(localeBundle, bundles[locale]);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    registerKpiMapTranslations();

    if (window.PlaybookI18n && typeof window.PlaybookI18n.apply === "function") {
        window.PlaybookI18n.apply(document);
    }

    const currentNavLink = document.querySelector(".kpi-main-nav-link[aria-current='page']");
    if (currentNavLink && !currentNavLink.classList.contains("is-active")) {
        currentNavLink.classList.add("is-active");
    }
});
