"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
const ano = '2025';
function getValorClass(valor) {
    if (valor === undefined)
        return 'table-cell empty-cell';
    return valor < 0 ? 'table-cell text-red-600' : 'table-cell';
}
function gerarTabela(mes, ano, movimentos) {
    return __awaiter(this, void 0, void 0, function* () {
        let table = '';
        let cabecalho = yield construirCabecalho(mes, ano);
        let chaves = Object.keys(movimentos);
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
    });
}
function construirCabecalho(mes, ano) {
    return __awaiter(this, void 0, void 0, function* () {
        let ler_cc = new Ler('list_cc');
        let contas = yield ler_cc.listarContas();
        let n_contas = contas.length;
        let cabecalho = `
    <table class="w-full border-collapse rounded-lg shadow-sm">
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
        cabecalho += yield construirSaldosIniciais();
        cabecalho += `</tr>
            <tr class="table-subheader">`;
        for (let i = 0; i < n_contas; i++) {
            cabecalho += `<th class="table-cell">Valor</th>
                        <th class="table-cell">Descrição</th>`;
        }
        cabecalho += `</tr>`;
        return cabecalho;
    });
}
function construirSaldosIniciais() {
    return __awaiter(this, void 0, void 0, function* () {
        let ler_s_i = new Ler('list_s_i');
        let saldos = yield ler_s_i.listarSaldoInicial();
        let html_saldos = '';
        for (const sald of saldos) {
            html_saldos += `<th colspan="2" class="table-cell text-center">${sald.saldoInicial}</th>`;
        }
        return html_saldos;
    });
}
