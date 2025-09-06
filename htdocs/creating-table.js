"use strict";
const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
const ano = '2025';
function getValorClass(valor) {
    if (valor === undefined)
        return 'table-cell empty-cell';
    return valor < 0 ? 'table-cell text-red-600' : 'table-cell';
}
async function gerarTabela(mes, ano, movimentos /*{[chave: string]: listaMovimentoMensal[]}*/) {
    let table = '';
    let arr_ret_cabecalho = await construirCabecalho(mes, ano);
    let cabecalho = arr_ret_cabecalho[0];
    let contas = arr_ret_cabecalho[1];
    let formatacao = new Formatations();
    table = table + cabecalho + '<tbody>';
    let teste = [
        '2025-09-10',
        '2025-09-11',
        '2025-09-12',
        '2025-09-13',
    ];
    console.log(contas);
    console.log(movimentos);
    teste.forEach(function (dia, i) {
        if (movimentos[dia]) {
            table += `<tr class="">
                        <td class="table-cell date-cell">${dia}</td>`;
            for (let id_cc of contas) {
                let mov_mesma_cc = movimentos[dia][id_cc];
                if (mov_mesma_cc) {
                    if (Object.values(mov_mesma_cc).length > 1) {
                        let n_linhas = Object.values(mov_mesma_cc).length;
                        for (let i = 0; i < n_linhas; i++) {
                        }
                    }
                    for (let mov of Object.values(mov_mesma_cc)) {
                        table += `<td class="${getValorClass(mov.valor)}">${mov.valor !== undefined ? formatacao.convertToBR(mov.valor) : ''}</td>
                            <td class="table-cell">${mov.descCat}</td>`;
                    }
                }
                else {
                    table += `<td>0,00</td>
                              <td class="table-cell"></td>`;
                }
            }
        }
        table += `</tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
async function construirCabecalho(mes, ano) {
    let ler_cc = new Ler('list_cc');
    let contas = await ler_cc.listarContas();
    let n_contas = contas.length;
    let arr_id_contas = contas.map(x => x.idContaCorrente);
    let cabecalho = `
        <table class="w-full border-collapse rounded-lg shadow-sm">
            <thead>
                <tr>
                    <th colspan="${(n_contas + 1) * 2}" class="table-cell table-header text-center text-xl p-3">${mes.toUpperCase()} ${ano}</th>
                </tr>

                <tr class="table-header">
                    <th rowspan="3" class="table-cell text-left">Data</th>`;
    for (const conta of contas) {
        cabecalho += `<th colspan="2" class="table-cell text-center">${conta.nomeBanco}</th>`;
    }
    cabecalho += `</tr>
                <tr class="table-subheader">`;
    cabecalho += await construirSaldosIniciais();
    cabecalho += `</tr>
                <tr class="table-subheader">`;
    for (let i = 0; i < n_contas; i++) {
        cabecalho += `<th class="table-cell">Valor</th>
                        <th class="table-cell">Descrição</th>`;
    }
    cabecalho += `</tr>
            </thead>`;
    return [cabecalho, arr_id_contas];
}
async function construirSaldosIniciais() {
    let ler_s_i = new Ler('list_s_i');
    let saldos = await ler_s_i.listarSaldoInicial();
    let html_saldos = '';
    for (const s of saldos) {
        html_saldos += `<th colspan="2" class="table-cell text-center">${s.saldoInicial}</th>`;
    }
    return html_saldos;
}
