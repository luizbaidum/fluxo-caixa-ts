<?php

if (empty($_GET['action'])) {
    return json_encode([]);
}

class Routing {
    private string $route;
    public string $func;

    function __construct() {
        $this->route = $_GET['action'];
        $this->setFunc();
    }

    private function setFunc() {
        switch ($this->route) {
            case 'cad_cat':
                $this->func = 'cadastrarCategoria';
                break;
            case 'list_cat':
                $this->func = 'listarCategorias';
                break;
            case 'list_cc':
                $this->func = 'listarContas';
                break;
            case 'cad_cc':
                $this->func = 'cadastrarConta';
                break;
            case 'cad_mov':
                $this->func = 'cadastrarMovimento';
                break;
            case 'list_mov_m':
                $this->func = 'listarMovMensal';
                break;
            case 'list_s_i':
                $this->func = 'listarSaldosIniciais';
                break;
        }
    }
}

$routing = new Routing();
$exec = $routing->func;

$mes = $_POST['mes'] ?? '';
$ano = $_POST['ano'] ?? '';

function converterMes($mes) {
    switch ($mes) {
        case '1':
            return '01';
        case '2':
            return '02';
        case '3':
            return '03';
        case '4':
            return '04';
        case '5':
            return '05';
        case '6':
            return '06';
        case '7':
            return '07';
        case '8':
            return '08';
        case '9':
            return '09';
        default:
            return $mes;
    }
}

require '../src/server/api.php';

if ($mes != '' && $mes!= false && $ano != '') {
    $mes = converterMes($mes);
    $exec($mes, $ano);
} else {
    $exec();
}

?>