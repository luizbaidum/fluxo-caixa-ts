const url_base = window.location.origin;
const class_require_ajax = document.getElementsByClassName('solicitar-pagina') as HTMLCollectionOf<Element>;

function submeterFormulario() {
    let form = document.getElementById('form-crud') as HTMLFormElement;
    let form_data: FormData = new FormData(form);
}

if (class_require_ajax.length == 0) {
    alert('Por favor atualizar a página. Entrar em contato com o suporte se este erro persistir.');
    console.error('Não existem classes com o nome "solicitar-pagina" para ação.');
}

for (const span of class_require_ajax) {
    span.addEventListener('click', function (event) {
        renderizarPagina(event);
    })
}

async function renderizarPagina(event: Event) {
    let elemento = event.currentTarget as HTMLElement;
    let pagina = elemento.dataset.pagina;

    try {
        if (pagina != null && pagina != undefined) {
            let response = await fetch(url_base + '/pages/' + pagina + '.html');

            if (!response.ok) {
                alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
                throw new Error(`Response status: ${response.status}`);
            }

            let html_data = await response.text();
            document.getElementById('content')!.innerHTML = html_data
        } else {
            window.location.href = url_base;
        }
    } catch (error) {
        alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
        console.error((error as Error).message);
    }
}

interface CC {
    idContaCorrente: number
    nomeBanco: string
    nomeConta: string
}

interface Categoria {
    idCategoria: number
    descricao: string
    sinal: string
}

interface Movimento {
    idMovimento: number
    valor: number
    data: Date
    idCategoria: number
    idContaCorrente: number
}

class Cadastrar {

}

class Ler {

}

class Editar {

}

class Deletar {

}