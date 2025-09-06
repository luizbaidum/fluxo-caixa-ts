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

interface SaldoInicial {
    idContaCorrente: number,
    saldoInicial: number
}

interface Movimento {
    idMovimento: number;
    valor: number;
    dataMov: string;
    idCategoria: number;
    idContaCorrente: number;
    descCC: string;
    descCat: string;
}

interface ListaMovimentoMensal {
    [dia: string]: {
        [id: number]: Movimento;
    };
}