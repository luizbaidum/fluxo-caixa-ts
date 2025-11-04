"use strict";
var _a;
const url_base = window.location.origin;
const class_require_ajax = document.getElementsByClassName('solicitar-pagina');
const currentDate = new Date();
const actual_year = currentDate.getFullYear().toString();
const actual_month = (currentDate.getMonth() + 1).toString();
if (class_require_ajax.length == 0) {
    alert('Por favor atualizar a página. Entrar em contato com o suporte se este erro persistir.');
    console.error('Não existem classes com o nome "solicitar-pagina" para ação.');
}
for (const span of class_require_ajax) {
    span.addEventListener('click', function (event) {
        renderizarPagina(event);
    });
}
async function renderizarPagina(event) {
    let elemento = event.currentTarget;
    let pagina = elemento.dataset.pagina;
    try {
        if (pagina != null && pagina != undefined) {
            let response = await fetch(url_base + '/pages/' + pagina + '.html');
            if (!response.ok) {
                alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
                throw new Error(`Response status: ${response.status}`);
            }
            let html_data = await response.text();
            document.getElementById('content').innerHTML = html_data;
            setTimeout(() => {
                criarSelectCategorias();
                criarSelectContas();
            }, 500);
        }
        else {
            window.location.href = url_base;
        }
    }
    catch (error) {
        alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
        console.error(error.message);
    }
}
async function submeterFormulario() {
    let form = document.getElementById('form-crud');
    let url = form.dataset.action;
    if (!url) {
        alert('URL não definida');
        return;
    }
    let form_data = new FormData(form);
    if (form_data.get('saldoInicial')) {
        let formatacao = new Formatations();
        form_data.set('saldoInicial', formatacao.convertToUS(form_data.get('saldoInicial')));
    }
    if (form_data.get('valor')) {
        let formatacao = new Formatations();
        form_data.set('valor', formatacao.convertToUS(form_data.get('valor')));
    }
    try {
        let resultado = await solicitarApi(url, form_data);
        mostrarRetorno(resultado);
    }
    catch (error) {
    }
}
function mostrarRetorno(resultado) {
    if (resultado.status && resultado.id != '') {
        alert('Operação realizada com sucesso. \n ID: ' + resultado.id);
    }
    else {
        alert('A solicitação não foi processada corretamente. Caso este aviso persista, entrar em contato com o suporte.');
    }
}
async function solicitarApi(url, data) {
    let url_solicitacao = url_base + '/routes.php?' + 'action=' + url;
    try {
        const response = await fetch(url_solicitacao, {
            method: 'POST',
            body: data
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        alert('Erro na requisição');
        console.error(error.message);
    }
}
class Ler {
    constructor(url) {
        this.url_leitura = url;
    }
    async listarCategorias() {
        let ret_json = await solicitarApi(this.url_leitura);
        if (ret_json.status) {
            return ret_json.ret;
        }
        return [];
    }
    async listarContas() {
        let ret_json = await solicitarApi(this.url_leitura);
        if (ret_json.status) {
            return ret_json.ret;
        }
        return [];
    }
    async listarMovMensal(mes, ano) {
        let form_data = new FormData();
        form_data.set('mes', mes);
        form_data.set('ano', ano);
        let ret_json = await solicitarApi(this.url_leitura, form_data);
        if (ret_json.status) {
            return ret_json.ret;
        }
        return {};
    }
    async listarSaldoInicial() {
        let ret_json = await solicitarApi(this.url_leitura);
        if (ret_json.status) {
            return ret_json.ret;
        }
        return [];
    }
}
async function criarSelectCategorias() {
    let local = document.getElementById('idCategoria');
    if (local) {
        let ler = new Ler('list_cat');
        let categorias = await ler.listarCategorias();
        for (let categoria of categorias) {
            let option_element = document.createElement('option');
            option_element.value = categoria.idCategoria.toString();
            option_element.textContent = categoria.descricao + ' - sinal: ' + categoria.sinal;
            local.appendChild(option_element);
        }
    }
}
async function criarSelectContas() {
    let local = document.getElementById('idContaCorrente');
    if (local) {
        let ler = new Ler('list_cc');
        let cc = await ler.listarContas();
        for (let conta of cc) {
            let option_element = document.createElement('option');
            option_element.value = conta.idContaCorrente.toString();
            option_element.textContent = conta.nomeBanco + ' - ' + conta.nomeConta;
            local.appendChild(option_element);
        }
    }
}
async function montarGridIndex(month = actual_month, year = actual_year) {
    let local = document.querySelector('#movimentos-mensais');
    if (local) {
        let ler = new Ler('list_mov_m');
        let movimentos_montar = await ler.listarMovMensal(month, year);
        let table = await gerarTabela(month, year, movimentos_montar);
        local.innerHTML = table;
    }
}
(_a = document.querySelector('.submit-yeayr-month')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var _a, _b;
    let month = (_a = document.getElementById('selectIdMes')) === null || _a === void 0 ? void 0 : _a.value;
    let year = (_b = document.getElementById('selectIdAno')) === null || _b === void 0 ? void 0 : _b.value;
    montarGridIndex(month, year);
});
