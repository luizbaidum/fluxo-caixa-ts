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
            let formatacao = new Formatations(form_data.get('saldoInicial'));
            form_data.set('saldoInicial', formatacao.convertToUS());
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
