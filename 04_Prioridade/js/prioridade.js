/**
 * PRIORIDADE.JS - Logica compartilhada do modulo 04_Prioridade
 */

document.addEventListener("DOMContentLoaded", function () {
    initPrioridadeModule();
});

const PRIORIDADE_I18N = window.PlaybookI18n || {
    t: function (_key, fallback) {
        return fallback;
    }
};

const FALLBACK_PRIORIDADE_CONFIG = {
    campos: {
        solicitante: {
            label: "Solicitante",
            opcoes: {
                assistencia_distribuidor: { codigo: "S1", label: "Assistencia / Distribuidor", peso: 1 },
                cliente: { codigo: "S2", label: "Cliente", peso: 2 },
                cliente_locacao: { codigo: "S3", label: "Cliente de Locacao", peso: 3 }
            }
        },
        tipo_atendimento: {
            label: "Tipo de atendimento",
            opcoes: {
                dentista_especialista_produto: {
                    codigo: "A1",
                    label: "Quero falar com um dentista especialista de produto",
                    peso: 1
                },
                falar_com_sac: { codigo: "A2", label: "Falar com o SAC", peso: 2 },
                tecnico_especializado: {
                    codigo: "A3",
                    label: "Quero ser atendido por um tecnico especializado",
                    peso: 3
                },
                locacao_suporte_tecnico: {
                    codigo: "A4",
                    label: "Sou cliente de locacao de produto e preciso de suporte tecnico",
                    peso: 4
                }
            }
        },
        categoria: {
            label: "Categoria",
            opcoes: {
                duvidas_gerais_sac: { codigo: "C1", label: "Duvidas gerais (SAC)", peso: 1 },
                instalacao_linha_imagem: {
                    codigo: "C2",
                    label: "Instalacao de produtos da linha de imagem",
                    peso: 2
                },
                duvidas_gerais_equipamento: {
                    codigo: "C3",
                    label: "Duvidas gerais sobre o equipamento",
                    peso: 3
                },
                assuntos_financeiros: { codigo: "C4", label: "Assuntos Financeiros", peso: 4 },
                problemas_tecnicos_equipamento: {
                    codigo: "C5",
                    label: "Problemas tecnicos com o equipamento",
                    peso: 5
                }
            }
        },
        produto: {
            label: "Produto",
            opcoes: {
                fotopolimerizador: { codigo: "P1", label: "Fotopolimerizador", peso: 1 },
                peca_de_mao: { codigo: "P2", label: "Peca de Mao", peso: 1 },
                bomba_vacuo: { codigo: "P3", label: "Bomba Vacuo", peso: 1 },
                compressor: { codigo: "P4", label: "Compressor", peso: 1 },
                micro_motor_eletrico: { codigo: "P5", label: "Micro Motor Eletrico", peso: 1 },
                raio_x_periapical: { codigo: "P6", label: "Raio-X Periapical", peso: 2 },
                autoclave: { codigo: "P7", label: "Autoclave", peso: 2 },
                profilaxia: { codigo: "P8", label: "Profilaxia", peso: 2 },
                digitalizador_eagle_ps: { codigo: "P9", label: "Digitalizador Eagle PS", peso: 2 },
                raio_x_portatil: { codigo: "P10", label: "Raio-X Portatil", peso: 2 },
                sensor_intraoral: { codigo: "P11", label: "Sensor Intraoral", peso: 3 },
                consultorios: { codigo: "P12", label: "Consultorios", peso: 3 },
                scanner_ios: { codigo: "P13", label: "Scanner IOS", peso: 3 },
                eagle_scan: { codigo: "P14", label: "Eagle Scan", peso: 3 },
                tomografo_panoramico: { codigo: "P15", label: "Tomografo / Panoramico", peso: 3 }
            }
        }
    },
    faixas: [
        { codigo: "P1", nome: "P1", min: 144, max: 180 },
        { codigo: "P2", nome: "P2", min: 108, max: 143 },
        { codigo: "P3", nome: "P3", min: 64, max: 107 },
        { codigo: "P4", nome: "P4", min: 27, max: 63 },
        { codigo: "P5", nome: "P5", min: 0, max: 26 }
    ],
    metadadosPrioridade: {
        P1: { badgeClass: "badge-p1", descricao: "Urgente" },
        P2: { badgeClass: "badge-p2", descricao: "Alta" },
        P3: { badgeClass: "badge-p3", descricao: "Media" },
        P4: { badgeClass: "badge-p4", descricao: "Baixa" },
        P5: { badgeClass: "badge-p5", descricao: "Muito baixa" },
        NC: { badgeClass: "badge-low", descricao: "Nao classificada" }
    }
};

const PRIORIDADE_STYLE_MAP = {
    P1: "is-p1",
    P2: "is-p2",
    P3: "is-p3",
    P4: "is-p4",
    P5: "is-p5"
};

function initPrioridadeModule() {
    setupSimulationPage();
}

function obterConfiguracaoMatriz() {
    return PRIORIDADE_I18N.t("prioridade.data.matrixConfig", FALLBACK_PRIORIDADE_CONFIG);
}

function obterSelecoes(form, configuracao) {
    const selecoes = {};

    Object.keys(configuracao.campos).forEach(function (campo) {
        const elemento = form.elements[campo];
        selecoes[campo] = elemento ? elemento.value : "";
    });

    selecoes.out_of_box_zero_hora = form.elements.out_of_box_zero_hora
        ? form.elements.out_of_box_zero_hora.value
        : "no";

    return selecoes;
}

function validarCampos(selecoes, configuracao) {
    const pendentes = [];

    Object.keys(configuracao.campos).forEach(function (campo) {
        if (!selecoes[campo]) {
            pendentes.push(configuracao.campos[campo].label);
        }
    });

    return {
        valido: pendentes.length === 0,
        pendentes: pendentes
    };
}

function calcularPontuacao(selecoes, configuracao) {
    let total = 1;
    const detalhes = [];

    Object.keys(configuracao.campos).forEach(function (campo) {
        const definicaoCampo = configuracao.campos[campo];
        const opcao = definicaoCampo.opcoes[selecoes[campo]];

        if (!opcao) {
            return;
        }

        total *= opcao.peso;
        detalhes.push({
            campo: definicaoCampo.label,
            codigo: opcao.codigo,
            opcao: opcao.label,
            peso: opcao.peso
        });
    });

    return {
        total: total,
        detalhes: detalhes,
        formula: detalhes.map(function (item) { return item.peso; }).join(" x ")
    };
}

function ordenarFaixas(configuracao) {
    return (configuracao.faixas || []).slice().sort(function (a, b) {
        return Number(b.min) - Number(a.min);
    });
}

function classificarPrioridade(pontuacaoTotal, configuracao) {
    const faixa = ordenarFaixas(configuracao).find(function (item) {
        return pontuacaoTotal >= item.min && pontuacaoTotal <= item.max;
    });

    if (faixa) {
        return faixa;
    }

    return { codigo: "NC", nome: "NC", min: 0, max: 0 };
}

function forcarUrgenciaPorExcecao(selecoes) {
    return selecoes.out_of_box_zero_hora === "yes";
}

function obterMetadadosPrioridade(classificacao, configuracao) {
    if (!classificacao || !classificacao.codigo) {
        return configuracao.metadadosPrioridade.NC;
    }

    return configuracao.metadadosPrioridade[classificacao.codigo] || configuracao.metadadosPrioridade.NC;
}

function obterDetalhesResultado(codigoPrioridade, configuracao) {
    const codigo = codigoPrioridade || "NC";
    const normalizado = String(codigo).toLowerCase();
    const metadados = obterMetadadosPrioridade({ codigo: codigo }, configuracao);

    return {
        codigo: codigo,
        nome: PRIORIDADE_I18N.t(
            "prioridade.simulation.result.levels." + normalizado + ".name",
            metadados.descricao
        ),
        mtfc: PRIORIDADE_I18N.t(
            "prioridade.simulation.result.levels." + normalizado + ".mtfc",
            "-"
        ),
        interpretacao: PRIORIDADE_I18N.t(
            "prioridade.simulation.result.levels." + normalizado + ".interpretation",
            ""
        ),
        cardClass: PRIORIDADE_STYLE_MAP[codigo] || "is-neutral"
    };
}

function popularSelectCampos(form, configuracao) {
    const placeholder = PRIORIDADE_I18N.t(
        "prioridade.simulation.form.selectPlaceholder",
        "Selecione..."
    );

    Object.keys(configuracao.campos).forEach(function (campo) {
        const select = form.elements[campo];
        if (!select) {
            return;
        }

        const primeiraOpcao = select.querySelector("option[value='']");
        select.innerHTML = "";

        const optionPlaceholder = document.createElement("option");
        optionPlaceholder.value = "";
        optionPlaceholder.textContent = primeiraOpcao ? primeiraOpcao.textContent : placeholder;
        select.appendChild(optionPlaceholder);

        const opcoes = configuracao.campos[campo].opcoes || {};
        Object.keys(opcoes).forEach(function (opcaoKey) {
            const opcao = opcoes[opcaoKey];
            const option = document.createElement("option");
            option.value = opcaoKey;
            option.textContent = opcao.codigo + " - " + opcao.label;
            select.appendChild(option);
        });
    });
}

function limparResultado(refs) {
    refs.resultCard.classList.remove("is-p1", "is-p2", "is-p3", "is-p4", "is-p5");
    refs.resultCard.classList.add("is-neutral");
    refs.resultStatus.textContent = PRIORIDADE_I18N.t(
        "prioridade.simulation.result.pendingState",
        "Preencha os campos e calcule para visualizar a prioridade final."
    );
    refs.resultPriorityCode.textContent = "P-";
    refs.resultPriorityName.textContent = "-";
    refs.resultScore.textContent = "0";
    refs.resultMtfc.textContent = "-";
    refs.resultFormula.textContent = "-";
    refs.resultInterpretation.textContent = PRIORIDADE_I18N.t(
        "prioridade.simulation.result.pendingInterpretation",
        "Ao calcular, voce vera a leitura operacional do nivel de prioridade."
    );
    refs.resultException.hidden = true;
    refs.resultException.textContent = "";
}

function exibirMensagem(refs, mensagem, tipo) {
    refs.formMensagem.textContent = mensagem;
    refs.formMensagem.className = "form-message " + tipo;
}

function renderizarResultado(resultado, classificacao, refs, configuracao, excecaoAtiva) {
    const detalhes = obterDetalhesResultado(classificacao.codigo, configuracao);

    refs.resultCard.classList.remove("is-neutral", "is-p1", "is-p2", "is-p3", "is-p4", "is-p5");
    refs.resultCard.classList.add(detalhes.cardClass);

    refs.resultStatus.textContent = PRIORIDADE_I18N.t(
        "prioridade.simulation.result.readyState",
        "Resultado calculado com a regra oficial de prioridade."
    );
    refs.resultPriorityCode.textContent = detalhes.codigo;
    refs.resultPriorityName.textContent = detalhes.nome;
    refs.resultScore.textContent = String(resultado.total);
    refs.resultMtfc.textContent = detalhes.mtfc;
    refs.resultFormula.textContent = resultado.formula
        ? resultado.formula + " = " + resultado.total
        : String(resultado.total);
    refs.resultInterpretation.textContent = detalhes.interpretacao;

    if (excecaoAtiva) {
        refs.resultException.hidden = false;
        refs.resultException.textContent = PRIORIDADE_I18N.t(
            "prioridade.simulation.result.exceptionForced",
            "Excecao aplicada: Out of the box / Zero hora sempre força P1 (Urgente) com MTFC 1h."
        );
    } else {
        refs.resultException.hidden = true;
        refs.resultException.textContent = "";
    }
}

function setupSimulationPage() {
    const form = document.getElementById("simulacao-form");
    if (!form) {
        return;
    }

    const refs = {
        formMensagem: document.getElementById("simulacao-message"),
        resultCard: document.getElementById("simResultCard"),
        resultStatus: document.getElementById("simResultStatus"),
        resultPriorityCode: document.getElementById("simResultPriorityCode"),
        resultPriorityName: document.getElementById("simResultPriorityName"),
        resultScore: document.getElementById("simResultScore"),
        resultMtfc: document.getElementById("simResultMtfc"),
        resultFormula: document.getElementById("simResultFormula"),
        resultInterpretation: document.getElementById("simResultInterpretation"),
        resultException: document.getElementById("simResultException")
    };

    const configuracao = obterConfiguracaoMatriz();
    popularSelectCampos(form, configuracao);
    limparResultado(refs);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const selecoes = obterSelecoes(form, configuracao);
        const validacao = validarCampos(selecoes, configuracao);

        if (!validacao.valido) {
            exibirMensagem(
                refs,
                PRIORIDADE_I18N.t(
                    "prioridade.data.messages.fillAllFieldsPrefix",
                    "Preencha todos os campos para calcular a prioridade. Faltam: "
                ) + validacao.pendentes.join(", ") + ".",
                "error"
            );
            limparResultado(refs);
            return;
        }

        const resultado = calcularPontuacao(selecoes, configuracao);
        const excecaoAtiva = forcarUrgenciaPorExcecao(selecoes);
        const classificacao = excecaoAtiva
            ? { codigo: "P1", nome: "P1", min: 144, max: 180 }
            : classificarPrioridade(resultado.total, configuracao);

        renderizarResultado(resultado, classificacao, refs, configuracao, excecaoAtiva);
        exibirMensagem(
            refs,
            PRIORIDADE_I18N.t(
                "prioridade.data.messages.simulationSuccess",
                "Simulacao calculada com sucesso."
            ),
            "success"
        );
    });
}

window.PrioridadeModule = {
    obterConfiguracaoMatriz: obterConfiguracaoMatriz,
    obterSelecoes: obterSelecoes,
    validarCampos: validarCampos,
    calcularPontuacao: calcularPontuacao,
    classificarPrioridade: classificarPrioridade,
    obterMetadadosPrioridade: obterMetadadosPrioridade
};
