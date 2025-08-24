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
let class_require_ajax = document.getElementsByClassName('solicitar-pagina');
if (class_require_ajax.length == 0) {
    alert('Existe um erro no sistema, por favor entrar em contato com o suporte.');
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
                    alert('O sistema encontrou um erro ao carregar a página selecionada.');
                    throw new Error(`Response status: ${response.status}`);
                }
                let html_data = yield response.text();
                document.getElementById('content').innerHTML = html_data;
            }
            else {
                window.location.href = url_base;
            }
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
