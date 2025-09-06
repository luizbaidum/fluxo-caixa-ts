const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
                'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
const ano = '2025';

function getValorClass(valor: number | undefined): string {
    if (valor === undefined) 
        return 'table-cell empty-cell';

    return valor < 0 ? 'table-cell text-red-600' : 'table-cell';
}

async function gerarTabela(mes: string, ano: string, movimentos: {[chave: string]: listaMovimentoMensal[]}): Promise<string> {
    let table: string = '';
    let cabecalho = await construirCabecalho(mes, ano);
    let chaves: string[] = Object.keys(movimentos);

    table = table + cabecalho;

    for (const chav of chaves) {
        for (const mov of movimentos[chav]) {
            table += `
                <tr class="">
                    <td class="table-cell date-cell">${mov.data}</td>

                    <td class="${getValorClass(mov.valor)}">${mov.valor !== undefined ? new Formatations().convertToBR(mov.valor) : ''}</td>
                    <td class="table-cell">${mov.descCat || ''}</td>
                </tr>
            `;
        }

    }

    table += `</table>`;
    return table;
}

async function construirCabecalho(mes: string, ano: string): Promise<string> {
    let ler_cc = new Ler('list_cc');
    let contas: CC[] = await ler_cc.listarContas();
    let n_contas = contas.length;

    let cabecalho: string = `
    <table class="w-full border-collapse rounded-lg shadow-sm">
        <tr>
            <th colspan="${(n_contas + 1) * 2}" class="table-cell table-header text-center text-xl p-3">${mes.toUpperCase()} ${ano}</th>
        </tr>

        <tr class="table-header">
            <th rowspan="3" class="table-cell text-left">Data</th>`;

            for (const conta of contas) {
                cabecalho += `<th colspan="2" class="table-cell text-center">${conta.nomeBanco}</th>`
            }

    cabecalho += `</tr>
            <tr class="table-subheader">`;

    cabecalho += await construirSaldosIniciais();

    cabecalho += `</tr>
            <tr class="table-subheader">`

    for (let i = 0; i < n_contas; i++) {
        cabecalho += `<th class="table-cell">Valor</th>
                        <th class="table-cell">Descrição</th>`;
    }

    cabecalho += `</tr>`;

    return cabecalho;
}

async function construirSaldosIniciais(): Promise<string> {
    let ler_s_i = new Ler('list_s_i');
    let saldos: saldoInicial[] = await ler_s_i.listarSaldoInicial();

    let html_saldos: string = '';

    for (const sald of saldos) {
        html_saldos += `<th colspan="2" class="table-cell text-center">${sald.saldoInicial}</th>`
    }

    return html_saldos;
}