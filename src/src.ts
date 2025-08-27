const url_base = window.location.origin;
const class_require_ajax = document.getElementsByClassName('solicitar-pagina') as HTMLCollectionOf<Element>;

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

            setTimeout(() => {
                criarSelectCategorias();
                criarSelectContas();
            }, 500)
        } else {
            window.location.href = url_base;
        }
    } catch (error) {
        alert('O sistema encontrou um erro ao carregar a página selecionada. Entrar em contato com o suporte se este erro persistir.');
        console.error((error as Error).message);
    }
}

async function submeterFormulario() {
    let form = document.getElementById('form-crud') as HTMLFormElement;
    let url = form.dataset.action;

    if (!url) {
        alert('URL não definida');
        return;
    }

    let form_data: FormData = new FormData(form);

    if (form_data.get('saldoInicial')) {
        let formatacao = new Formatations(form_data.get('saldoInicial') as string);
        form_data.set('saldoInicial', formatacao.convertToUS() as string);
    }

    try {
        let resultado = await solicitarApi(url, form_data);
        mostrarRetorno(resultado);
    } catch (error) {

    }
}

function mostrarRetorno(resultado: RetornoSolicitacao) {
    if (resultado.status && resultado.id != '') {
        alert('Operação realizada com sucesso. \n ID: ' + resultado.id)
    } else {
        alert('A solicitação não foi processada corretamente. Caso este aviso persista, entrar em contato com o suporte.')
    }
}

async function solicitarApi(url: string, data?: FormData) {
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

    } catch (error) {
        alert('Erro na requisição');
        console.error((error as Error).message);
    }
}

interface RetornoSolicitacao {
    status: boolean
    id: number | string
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

class Ler {
    url_leitura: string;

    constructor(url: string) {
        this.url_leitura = url;
    }

    async listarCategorias(): Promise<Categoria[]> {
        let ret_json = await solicitarApi(this.url_leitura);

        if (ret_json.status) {
            return ret_json.ret as Categoria[];
        }

        return [];
    }

    async listarContas(): Promise<CC[]> {
        let ret_json = await solicitarApi(this.url_leitura);

        if (ret_json.status) {
            return ret_json.ret as CC[];
        }

        return [];
    }
}

async function criarSelectCategorias(): Promise<void> {
    let local = document.getElementById('idCategoria') as HTMLSelectElement;

    if (local) {
        let ler = new Ler('list_cat');
        let categorias: Categoria[] = await ler.listarCategorias();

        for (let categoria of categorias) {
            let option_element = document.createElement('option');

            option_element.value = categoria.idCategoria.toString();
            option_element.textContent = categoria.descricao + ' - sinal: ' + categoria.sinal;

            local.appendChild(option_element);
        }
    }
}

async function criarSelectContas(): Promise<void> {
    let local = document.getElementById('idContaCorrente') as HTMLSelectElement;

    if (local) {
        let ler = new Ler('list_cc');
        let cc: CC[] = await ler.listarContas();

        for (let conta of cc) {
            let option_element = document.createElement('option');

            option_element.value = conta.idContaCorrente.toString();
            option_element.textContent = conta.nomeBanco + ' - ' + conta.nomeConta;

            local.appendChild(option_element);
        }
    }
}