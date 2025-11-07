"use strict";
class Formatations {
    convertToUS(valor_br) {
        try {
            let converting = valor_br.replace(/\./g, '');
            let iso = converting.replace(/,/g, '.');
            return iso;
        }
        catch (e) {
            alert('Erro ao converter valor numérico.');
            console.error('Error -> ' + e);
        }
    }
    convertToBR(valor_iso) {
        try {
            let valor_limpo = Number(valor_iso).toFixed(2).replace(/[^\d.,]/g, '');
            if (!valor_limpo.includes('.')) {
                return parseInt(valor_limpo).toLocaleString('pt-BR');
            }
            let valor_numerico = parseFloat(valor_limpo);
            return valor_numerico.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        catch (e) {
            alert('Erro ao converter valor para formato brasileiro.');
            console.error('Error -> ' + e);
        }
    }
    converterDataParaBrasileiro(data) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            throw new Error('Formato de data inválido. Use yyyy-mm-dd');
        }
        // Divide a string usando o hífen como separador
        const partes = data.split('-');
        // Extrai ano, mês e dia
        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];
        // Retorna no formato dd/mm/yyyy
        return `${dia}/${mes}/${ano}`;
    }
}
document.addEventListener('keyup', (e) => {
    const target = e.target;
    if (target.matches('.numero-br')) {
        let valor = target.value;
        valor = valor.replace(/\D/g, '');
        if (valor.length === 0) {
            valor = '000';
        }
        else if (valor.length === 1) {
            valor = '00' + valor;
        }
        else if (valor.length === 2) {
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
