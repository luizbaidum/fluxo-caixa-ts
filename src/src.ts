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
        let formatacao = new Formatations();
        form_data.set('saldoInicial', formatacao.convertToUS(form_data.get('saldoInicial') as string) as string);
    }

    if (form_data.get('valor')) {
        let formatacao = new Formatations();
        form_data.set('valor', formatacao.convertToUS(form_data.get('valor') as string) as string);
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

    async listarMovMensal(): Promise<ListaMovimentoMensal> {
        let ret_json = await solicitarApi(this.url_leitura);

        if (ret_json.status) {
            return ret_json.ret as ListaMovimentoMensal;
        }

        return {};
    }

     async listarSaldoInicial(): Promise<SaldoInicial[]> {
        let ret_json = await solicitarApi(this.url_leitura);

        if (ret_json.status) {
            return ret_json.ret as SaldoInicial[];
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

async function montarGridIndex(): Promise<void> {
    let local = document.querySelector('#movimentos-mensais') as HTMLDivElement;

    if (local) {
        let ler = new Ler('list_mov_m');
        let mov_m: ListaMovimentoMensal = await ler.listarMovMensal();

        let movimentos_montar = await prepararConteudo(mov_m);

        let table = await gerarTabela('janeiro','2025', movimentos_montar);
        local.innerHTML = table;
    }
}

async function prepararConteudo(original: ListaMovimentoMensal): Promise <ListaMovimentoMensal> {
    let aux: {[chave: string]: ListaMovimentoMensal[]} = {};
    let contador: {[chave: string]: number} = {};
    let controle_id: number = 0;
    let arr_chave_data: string[] = [];

    return original;

    // for (let chave_data in original) {
    //     arr_chave_data.push(chave_data);
    // }

    // let ler: Ler = new Ler('list_cc');
    // let cc: CC[] = await ler.listarContas();
    // let id_cc_only: number[] = cc.map(conta => conta.idContaCorrente);

    // console.log(id_cc_only);

    // for (const dia of arr_chave_data) {
    //     for (const id_cc of id_cc_only) {
    //         let chave: string = dia + '&&' + id_cc;
    //         let diferenca: number = 0;
    //         let objeto_vazio: listaMovimentoMensal = {
    //                             idMovimento: 0,
    //                             valor: 0,
    //                             data: dia,
    //                             idCategoria: 0,
    //                             idContaCorrente: id_cc,
    //                             descCC: '',
    //                             descCat: ''
    //                         };

    //         if (aux[chave]) {
    //             if (aux[chave].length != contador[dia]) {
    //                 diferenca = contador[dia] - aux[chave].length;

    //                 for (let i = 0; i < diferenca; i++) {
    //                     aux[chave].push(objeto_vazio);
    //                 }
    //             }
    //         } else {
    //             aux[chave] = [objeto_vazio];
    //         }
    //     }
    // }

    // return {};

    // return aux;
}