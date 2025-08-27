class Formatations {
    valor: string;

    constructor(value: string) {
        this.valor = value;
    }

    convertToUS(): string|void {
        try {
            let br = this.valor;
            let converting = br.replace(/\./g, '');
            let us = converting.replace(/,/g, '.');

            return us;
        } catch (e) {
            alert('Erro ao converter valor numérico.');
            console.error('Error -> ' + e);
        }
    }
}

document.addEventListener('keyup', (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target.matches('.numero-br')) {
        let valor = target.value;

        valor = valor.replace(/\D/g, '');

        if (valor.length === 0) {
            valor = '000';
        } else if (valor.length === 1) {
            valor = '00' + valor;
        } else if (valor.length === 2) {
            valor = '0' + valor;
        }

        const parteInteira = valor.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const parteDecimal = valor.slice(-2);
        valor = `${parteInteira},${parteDecimal}`;

        valor = valor.replace(/^0+(?=\d)/, '');

        target.value = valor;

        if (valor === 'NaN') {
            target.value = '';
        }
    }
});