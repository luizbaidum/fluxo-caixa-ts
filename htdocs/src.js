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
const url_base = window.location.origin;
const class_require_ajax = document.getElementsByClassName('solicitar-pagina');
if (class_require_ajax.length == 0) {
    alert('Por favor atualizar a página. Entrar em contato com o suporte se este erro persistir.');
    console.error('Não existem classes com o nome "solicitar-pagina" para ação.');
}
for (const span of class_require_ajax) {
    span.addEventListener('click', function (event) {
        renderizarPagina(event);
    });
}
function renderizarPagina(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let elemento = event.currentTarget;
        let pagina = elemento.dataset.pagina;
        try {
            if (pagina != null && pagina != undefined) {
                let response = yield fetch(url_base + '/pages/' + pagina + '.html');
                if (!response.ok) {
                    alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
                    throw new Error(`Response status: ${response.status}`);
                }
                let html_data = yield response.text();
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
    });
}
function submeterFormulario() {
    return __awaiter(this, void 0, void 0, function* () {
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
            let resultado = yield solicitarApi(url, form_data);
            mostrarRetorno(resultado);
        }
        catch (error) {
        }
    });
}
function mostrarRetorno(resultado) {
    if (resultado.status && resultado.id != '') {
        alert('Operação realizada com sucesso. \n ID: ' + resultado.id);
    }
    else {
        alert('A solicitação não foi processada corretamente. Caso este aviso persista, entrar em contato com o suporte.');
    }
}
function solicitarApi(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let url_solicitacao = url_base + '/routes.php?' + 'action=' + url;
        try {
            const response = yield fetch(url_solicitacao, {
                method: 'POST',
                body: data
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return yield response.json();
        }
        catch (error) {
            alert('Erro na requisição');
            console.error(error.message);
        }
    });
}
class Ler {
    constructor(url) {
        this.url_leitura = url;
    }
    listarCategorias() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret_json = yield solicitarApi(this.url_leitura);
            if (ret_json.status) {
                return ret_json.ret;
            }
            return [];
        });
    }
    listarContas() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret_json = yield solicitarApi(this.url_leitura);
            if (ret_json.status) {
                return ret_json.ret;
            }
            return [];
        });
    }
    listarMovMensal() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret_json = yield solicitarApi(this.url_leitura);
            if (ret_json.status) {
                return ret_json.ret;
            }
            return [];
        });
    }
    listarSaldoInicial() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret_json = yield solicitarApi(this.url_leitura);
            if (ret_json.status) {
                return ret_json.ret;
            }
            return [];
        });
    }
}
function criarSelectCategorias() {
    return __awaiter(this, void 0, void 0, function* () {
        let local = document.getElementById('idCategoria');
        if (local) {
            let ler = new Ler('list_cat');
            let categorias = yield ler.listarCategorias();
            for (let categoria of categorias) {
                let option_element = document.createElement('option');
                option_element.value = categoria.idCategoria.toString();
                option_element.textContent = categoria.descricao + ' - sinal: ' + categoria.sinal;
                local.appendChild(option_element);
            }
        }
    });
}
function criarSelectContas() {
    return __awaiter(this, void 0, void 0, function* () {
        let local = document.getElementById('idContaCorrente');
        if (local) {
            let ler = new Ler('list_cc');
            let cc = yield ler.listarContas();
            for (let conta of cc) {
                let option_element = document.createElement('option');
                option_element.value = conta.idContaCorrente.toString();
                option_element.textContent = conta.nomeBanco + ' - ' + conta.nomeConta;
                local.appendChild(option_element);
            }
        }
    });
}
function montarGridIndex() {
    return __awaiter(this, void 0, void 0, function* () {
        let local = document.querySelector('#movimentos-mensais');
        if (local) {
            let ler = new Ler('list_mov_m');
            let mov_m = yield ler.listarMovMensal();
            let movimentos_montar = yield prepararConteudo(mov_m);
            let table = yield gerarTabela('janeiro', '2025', movimentos_montar);
            local.innerHTML = table;
        }
    });
}
function prepararConteudo(original) {
    return __awaiter(this, void 0, void 0, function* () {
        let aux = {};
        let contador = {};
        let controle_id = 0;
        for (const mov of original) {
            let chave = mov.data + '&&' + mov.idContaCorrente;
            if (!aux[chave]) {
                aux[chave] = [];
            }
            if (!contador[mov.data]) {
                contador[mov.data] = 1;
            }
            else {
                if (controle_id == Number(chave.split('&&')[1])) {
                    contador[mov.data]++;
                }
            }
            controle_id = mov.idContaCorrente;
            aux[chave].push(mov);
        }
        let ler = new Ler('list_cc');
        let cc = yield ler.listarContas();
        let id_cc_only = cc.map(conta => conta.idContaCorrente);
        let dias_movimento = Object.keys(aux).map(chave => chave.split('&&')[0]);
        for (const dia of dias_movimento) {
            for (const id_cc of id_cc_only) {
                let chave = dia + '&&' + id_cc;
                let diferenca = 0;
                let objeto_vazio = {
                    idMovimento: 0,
                    valor: 0,
                    data: dia,
                    idCategoria: 0,
                    idContaCorrente: id_cc,
                    descCC: '',
                    descCat: ''
                };
                if (aux[chave]) {
                    if (aux[chave].length != contador[dia]) {
                        diferenca = contador[dia] - aux[chave].length;
                        for (let i = 0; i < diferenca; i++) {
                            aux[chave].push(objeto_vazio);
                        }
                    }
                }
                else {
                    aux[chave] = [objeto_vazio];
                }
            }
        }
        return aux;
    });
}
