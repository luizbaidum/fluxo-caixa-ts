function criarSelects(): void {
    criarSelect('idSelectAno', anos, (ano: string) => ({value: ano, text: ano}));
    criarSelect('idSelectMes', meses, (mes: string, indice: number) => ({
        value: (indice + 1).toString(),
        text: mes
    }));
}

function criarSelect(
    containerId: string,
    dados: string[],
    mapearOption: (item: string, index: number) => {value: string, text: string}
): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const select = document.createElement('select');
    select.className = 'bg-blue-500 border-none rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300';
    if (containerId == 'idSelectAno') {
        select.setAttribute('id', 'selectIdAno');
    } else {
        select.setAttribute('id', 'selectIdMes');
    }

    dados.forEach((item, index) => {
        const {value, text} = mapearOption(item, index);
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });

    container.appendChild(select);
}

function getValorClass(valor: number | undefined): string {
    if (valor === undefined) 
        return 'table-cell empty-cell';

    return valor < 0 ? 'table-cell text-red-600' : 'table-cell';
}

async function gerarTabela(mes: string, ano: string, movimentos: ListaMovimentoMensal): Promise<string> {
    let table: string = '';
    let arr_ret_cabecalho = await construirCabecalho(mes, ano);
    let cabecalho = arr_ret_cabecalho[0];
    let contas = arr_ret_cabecalho[1];
    let formatacao = new Formatations();

    table = table + cabecalho + '<tbody>';

    // Gerar todos os dias do mês (exemplo para setembro/2025)
    let todos_dias_mes = [
        '2025-09-10', '2025-09-11', '2025-09-12', '2025-09-13',
        // Você pode gerar isso dinamicamente baseado no mês/ano
    ];

    todos_dias_mes.forEach(function(dia) {
        if (movimentos[dia]) {
            let hasMultiplasLinhas = false;
            let movimentosPorConta: any[] = [];

            // Primeiro, verificar se há múltiplos movimentos em alguma conta
            for (let id_cc of contas) {
                if (movimentos[dia][id_cc]) {
                    let n_linhas = Object.keys(movimentos[dia][id_cc]).length;
                    if (n_linhas > 1) {
                        hasMultiplasLinhas = true;
                    }
                    movimentosPorConta.push(movimentos[dia][id_cc]);
                } else {
                    movimentosPorConta.push(null);
                }
            }

            if (hasMultiplasLinhas) {
                // Encontrar o número máximo de linhas necessárias
                let maxLinhas = 1;
                movimentosPorConta.forEach(movs => {
                    if (movs && Object.keys(movs).length > maxLinhas) {
                        maxLinhas = Object.keys(movs).length;
                    }
                });

                // Gerar múltiplas linhas
                for (let linhaIndex = 0; linhaIndex < maxLinhas; linhaIndex++) {
                    table += `<tr class="${linhaIndex === 0 ? '' : 'extra-row'}">`;

                    // Data apenas na primeira linha
                    if (linhaIndex === 0) {
                        table += `<td class="table-cell date-cell" rowspan="${maxLinhas}">${formatacao.converterDataParaBrasileiro(dia)}</td>`;
                    }

                    // Para cada conta
                    for (let i = 0; i < contas.length; i++) {
                        const movs = movimentosPorConta[i];

                        if (movs) {
                            const movKeys = Object.keys(movs);
                            if (linhaIndex < movKeys.length) {
                                const mov = movs[movKeys[linhaIndex]];
                                table += `<td class="table-cell ${getValorClass(mov.valor)}">${mov.valor !== undefined ? formatacao.convertToBR(mov.valor) : ''}</td>`;
                                table += `<td class="table-cell">${mov.descCat || ''}</td>`;
                            } else {
                                // Linhas vazias para preencher
                                table += `<td class="table-cell"></td>`;
                                table += `<td class="table-cell"></td>`;
                            }
                        } else if (linhaIndex === 0) {
                            // Primeira linha, conta sem movimentos
                            table += `<td class="table-cell">0,00</td>`;
                            table += `<td class="table-cell"></td>`;
                        } else {
                            // Linhas extras vazias
                            table += `<td class="table-cell"></td>`;
                            table += `<td class="table-cell"></td>`;
                        }
                    }

                    table += `</tr>`;
                }
            } else {
                // Apenas uma linha por dia
                table += `<tr class="">`;
                table += `<td class="table-cell date-cell">${formatacao.converterDataParaBrasileiro(dia)}</td>`;

                for (let id_cc of contas) {
                    if (movimentos[dia][id_cc]) {
                        const movs = movimentos[dia][id_cc];
                        const mov = Object.values(movs)[0] as any;

                        table += `<td class="table-cell ${getValorClass(mov.valor)}">${mov.valor !== undefined ? formatacao.convertToBR(mov.valor) : ''}</td>`;
                        table += `<td class="table-cell">${mov.descCat || ''}</td>`;
                    } else {
                        table += `<td class="table-cell">0,00</td>`;
                        table += `<td class="table-cell"></td>`;
                    }
                }

                table += `</tr>`;
            }
        }
    });

    table += `</tbody></table>`;

    return table;
}

async function construirCabecalho(mes: string, ano: string): Promise<[string, number[]]> {
    let ler_cc = new Ler('list_cc');
    let contas: CC[] = await ler_cc.listarContas();
    let n_contas = contas.length;
    let arr_id_contas = contas.map(x => x.idContaCorrente);

    let cabecalho: string = `
        <table class="w-full border-collapse rounded-lg shadow-sm">
            <thead>
                <tr>
                    <th colspan="${(n_contas + 1) * 2}" class="table-cell table-header text-center text-xl p-3">${mes}/${ano}</th>
                </tr>

                <tr class="table-header">
                    <th class="table-cell text-left"></th>`;

    for (const conta of contas) {
        cabecalho += `<th colspan="2" class="table-cell text-center">${conta.nomeBanco}</th>`
    }

    cabecalho += `</tr>
                  <tr class="table-subheader">
                    <th class="table-cell text-left table-header">Saldo inicial</th>`;

    cabecalho += await construirSaldosIniciais();

    cabecalho += `</tr>
                <tr class="table-subheader">
                    <th class="table-cell text-left table-header">Data</th>`;

    for (let i = 0; i < n_contas; i++) {
        cabecalho += `<th class="table-cell">Valor</th>
                        <th class="table-cell">Descrição</th>`;
    }

    cabecalho += `</tr>
            </thead>`;

    return [cabecalho, arr_id_contas];
}

async function construirSaldosIniciais(): Promise<string> {
    let ler_s_i = new Ler('list_s_i');
    let saldos: SaldoInicial[] = await ler_s_i.listarSaldoInicial();
    let formatacao = new Formatations();

    let html_saldos: string = '';

    for (const s of saldos) {
        html_saldos += `<th colspan="2" class="table-cell text-center">${formatacao.convertToBR(s.saldoInicial)}</th>`
    }

    return html_saldos;
}