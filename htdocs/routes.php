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

require '../src/server/api.php';

$exec();

?>